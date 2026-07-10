const router = require('express').Router();
const dns = require('dns').promises;
const tls = require('tls');
const whois = require('whois');
const { execFile } = require('child_process');
const auth = require('../middleware/authMiddleware');

router.use(auth);

// ── helpers ───────────────────────────────────────────────────────────────────

function runCmd(bin, args, timeout) {
  return new Promise(resolve => {
    execFile(bin, args, { timeout }, (err, stdout) => resolve(err ? '' : stdout));
  });
}

function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*[mGKHF]|\x1B\[[0-9;]*m/g, '').replace(/\x1B\[.*?[@-~]/g, '');
}

function parsePorts(stdout) {
  const ports = {};
  for (const line of stdout.split('\n')) {
    // matches: 22/tcp  open  ssh  syn-ack ttl 63  OpenSSH 6.6.1...
    const m = line.match(/^(\d+)\/(tcp|udp)\s+(\S+)\s+(\S+)\s+(?:\S+\s+ttl\s+\d+\s+)?(.*)/);
    if (m) {
      const port = parseInt(m[1]);
      ports[port] = {
        port, proto: m[2], state: m[3],
        service: m[4],
        version: m[5]?.trim() || ''
      };
    }
  }
  return ports;
}

// ── RUSTSCAN + NMAP ───────────────────────────────────────────────────────────
router.post('/nmap', async (req, res) => {
  const { target } = req.body;
  if (!target) return res.status(400).json({ error: 'target required' });
  if (!/^[a-zA-Z0-9._\-\/]+$/.test(target))
    return res.status(400).json({ error: 'Invalid target format' });

  // rustscan does fast full-port discovery then hands off to nmap for service detection
  const raw = await runCmd(
    'rustscan',
    ['-a', target, '--ulimit', '5000', '-b', '500', '--timeout', '2000', '--', '-sV', '-T4'],
    250000
  );

  const out   = stripAnsi(raw);
  const ports = parsePorts(out);

  // extract host up / latency line from nmap output
  const hostLine = out.match(/Host is up.*?\(([^)]+)\)/);
  const latency  = hostLine ? hostLine[1] : null;

  if (!Object.keys(ports).length) {
    return res.json({ result: `No open ports found on ${target}` });
  }

  const rows = Object.values(ports)
    .sort((a, b) => a.port - b.port)
    .map(p => {
      const c1 = `${p.port}/${p.proto}`.padEnd(10);
      const c2 = p.state.padEnd(8);
      const c3 = p.service.padEnd(16);
      return `${c1} ${c2} ${c3} ${p.version}`;
    });

  const header  = `${'PORT'.padEnd(10)} ${'STATE'.padEnd(8)} ${'SERVICE'.padEnd(16)} VERSION`;
  const divider = '-'.repeat(72);
  const meta    = [`Target: ${target}`, latency ? `Latency: ${latency}` : '', `Open ports: ${rows.length}`].filter(Boolean).join('  |  ');

  res.json({ result: `${header}\n${divider}\n${rows.join('\n')}\n${divider}\n${meta}` });
});

// ── WHOIS ─────────────────────────────────────────────────────────────────────
router.post('/whois', (req, res) => {
  const { target } = req.body;
  if (!target) return res.status(400).json({ error: 'target required' });
  whois.lookup(target, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ result: data });
  });
});

// ── DNS ───────────────────────────────────────────────────────────────────────
router.post('/dns', async (req, res) => {
  const { target } = req.body;
  if (!target) return res.status(400).json({ error: 'target required' });
  try {
    const [a, mx, txt, ns, cname] = await Promise.allSettled([
      dns.resolve4(target),
      dns.resolveMx(target),
      dns.resolveTxt(target),
      dns.resolveNs(target),
      dns.resolveCname(target),
    ]);
    res.json({
      result: {
        A:     a.status     === 'fulfilled' ? a.value     : [],
        MX:    mx.status    === 'fulfilled' ? mx.value    : [],
        TXT:   txt.status   === 'fulfilled' ? txt.value   : [],
        NS:    ns.status    === 'fulfilled' ? ns.value    : [],
        CNAME: cname.status === 'fulfilled' ? cname.value : [],
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── DIRSEARCH ─────────────────────────────────────────────────────────────────
router.post('/dirsearch', async (req, res) => {
  const { target, wordlist } = req.body;
  if (!target) return res.status(400).json({ error: 'target required' });
  if (!/^https?:\/\/[a-zA-Z0-9._\-]+(:\d+)?(\/.*)?$/.test(target))
    return res.status(400).json({ error: 'Invalid target URL. Must start with http:// or https://' });

  const args = [
    '/opt/dirsearch/dirsearch.py',
    '-u', target,
    '--format', 'plain',
    '-q',
    '--no-color',
    '-t', '20',
    '--timeout', '10',
    '-x', '404,403,500',
  ];
  if (wordlist) args.push('-w', wordlist);

  runCmd('python3', args, 120000).then(stdout => {
    if (!stdout.trim()) return res.json({ result: 'No paths found.' });
    res.json({ result: stdout.trim() });
  }).catch(e => res.status(500).json({ error: e.message }));
});

// ── SSL CHECKER ───────────────────────────────────────────────────────────────
router.post('/ssl', (req, res) => {
  const { target } = req.body;
  if (!target) return res.status(400).json({ error: 'target required' });
  const sock = tls.connect(443, target, { servername: target, rejectUnauthorized: false }, () => {
    const cert = sock.getPeerCertificate(true);
    sock.destroy();
    if (!cert || !cert.subject) return res.status(500).json({ error: 'No certificate found' });
    res.json({
      result: {
        subject:     cert.subject,
        issuer:      cert.issuer,
        validFrom:   cert.valid_from,
        validTo:     cert.valid_to,
        fingerprint: cert.fingerprint,
        san:         cert.subjectaltname,
        bits:        cert.bits,
      },
    });
  });
  sock.on('error', (e) => res.status(500).json({ error: e.message }));
});

// ── SUBDOMAIN FINDER ──────────────────────────────────────────────────────────
const SUBDOMAINS = [
  'www','mail','ftp','smtp','pop','ns1','ns2','webmail','admin','portal',
  'api','dev','staging','test','vpn','remote','blog','shop','cdn','static',
  'app','m','mobile','secure','login','dashboard','status','docs','support',
];

router.post('/subdomain', async (req, res) => {
  const { target } = req.body;
  if (!target) return res.status(400).json({ error: 'target required' });
  const checks = SUBDOMAINS.map(async (sub) => {
    const host = `${sub}.${target}`;
    try {
      const addrs = await dns.resolve4(host);
      return { subdomain: host, ips: addrs, status: 'found' };
    } catch { return null; }
  });
  const results = (await Promise.all(checks)).filter(Boolean);
  res.json({ result: results });
});

module.exports = router;
