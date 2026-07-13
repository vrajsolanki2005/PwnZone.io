const { chat } = require('../services/aiService');

const CYBER_KEYWORDS = [
  'hack', 'exploit', 'vulnerability', 'vuln', 'xss', 'sqli', 'sql injection', 'csrf', 'ssrf',
  'idor', 'rce', 'lfi', 'rfi', 'xxe', 'ssti', 'owasp', 'pentest', 'penetration', 'recon',
  'osint', 'burp', 'nmap', 'payload', 'bypass', 'injection', 'auth', 'authentication',
  'authorization', 'jwt', 'oauth', 'session', 'cookie', 'token', 'password', 'brute',
  'phishing', 'malware', 'ransomware', 'trojan', 'reverse shell', 'privilege escalation',
  'ctf', 'capture the flag', 'bug bounty', 'security', 'secure', 'cipher', 'encrypt',
  'decrypt', 'cryptography', 'tls', 'ssl', 'https', 'firewall', 'ids', 'ips', 'waf',
  'network', 'port', 'scan', 'dns', 'http', 'api', 'endpoint', 'header', 'request',
  'response', 'web', 'server', 'client', 'browser', 'cors', 'csp', 'clickjack',
  'subdomain', 'takeover', 'open redirect', 'path traversal', 'directory', 'upload',
  'file inclusion', 'deserialization', 'race condition', 'logic', 'access control',
  'broken', 'misconfiguration', 'exposure', 'leak', 'disclosure', 'report', 'cvss', 'cve',
  'zero day', '0day', 'poc', 'proof of concept', 'mitigation', 'remediation', 'patch',
  'hacker', 'attacker', 'defender', 'red team', 'blue team', 'purple team', 'threat',
  'risk', 'audit', 'compliance', 'gdpr', 'pci', 'iso 27001', 'nist', 'framework',
];

const OFF_TOPIC_REPLY = "I'm specialized in cybersecurity topics only. Please ask me something related to hacking, bug bounty, or web security!";

function isCybersecurityRelated(message) {
  const lower = message.toLowerCase();
  return CYBER_KEYWORDS.some(kw => lower.includes(kw));
}

const JAILBREAK_PATTERNS = [
  /ignore (previous|all|prior) instructions/i,
  /pretend (you are|to be)/i,
  /act as (a |an )?(?!security|hacker|pentester|researcher)/i,
  /you are now/i,
  /forget (your|all) (rules|instructions|training)/i,
  /jailbreak/i,
  /do anything now/i,
  /dan mode/i,
];

function isJailbreakAttempt(message) {
  return JAILBREAK_PATTERNS.some(p => p.test(message));
}

const chatHandler = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required.' });

    const trimmed = message.trim();

    if (isJailbreakAttempt(trimmed)) {
      return res.json({ response: OFF_TOPIC_REPLY });
    }

    if (!isCybersecurityRelated(trimmed)) {
      return res.json({ response: OFF_TOPIC_REPLY });
    }

    const response = await chat(trimmed, history);
    res.json({ response });
  } catch (err) {
    console.error('[AI]', err.message);
    res.status(500).json({ error: 'AI service unavailable. Please try again.' });
  }
};

module.exports = { chatHandler };
