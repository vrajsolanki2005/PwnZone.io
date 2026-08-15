import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Clock, Trophy, Layers, Lock, Unlock, ExternalLink, Play, Flag, CheckCircle } from 'lucide-react'
import { labApi, progressApi } from '../../services/api'
import './LabInfo.css'

const PRIORITY_LABEL = { P1: '🔴 P1 – Critical', P2: '🟠 P2 – High', P3: '🟡 P3 – Medium', P4: '🟢 P4 – Low' }
const STAR_MAP       = { P1: 5, P2: 4, P3: 3, P4: 2 }

function stars(priority) {
  const n = STAR_MAP[priority] || 3
  return '★'.repeat(n) + '☆'.repeat(5 - n)
}

// ── Per-category learning objectives ────────────────────────
const OBJECTIVES_BY_CATEGORY = {
  'Injection': [
    'Identify common injection entry points in web applications',
    'Craft and test basic injection payloads',
    'Retrieve or manipulate data through successful exploitation',
    'Understand mitigation techniques and secure coding practices',
  ],
  'Authentication & Session Management': [
    'Identify weaknesses in authentication flows',
    'Bypass or circumvent authentication controls',
    'Understand session token lifecycle risks',
    'Recognize and apply secure authentication patterns',
  ],
  'Broken Access Control': [
    'Identify missing or misconfigured authorization checks',
    'Exploit object-level and function-level access flaws',
    'Access resources belonging to other users or roles',
    'Apply correct authorization patterns to prevent the flaw',
  ],
  'File Handling Vulnerabilities': [
    'Identify unsafe file handling logic',
    'Exploit path traversal or unrestricted upload issues',
    'Access or execute unintended server-side files',
    'Apply secure file validation and storage practices',
  ],
  'Server-Side Vulnerabilities': [
    'Understand server-side request parsing and execution',
    'Craft payloads targeting internal server behavior',
    'Trigger unintended actions via vulnerable server logic',
    'Understand mitigations and secure design patterns',
  ],
  'Client-Side Vulnerabilities': [
    'Identify unsanitized output rendered in the browser',
    'Inject and execute malicious scripts in victim context',
    'Understand impact on other users and session hijacking',
    'Apply output encoding and CSP as countermeasures',
  ],
  'API Security': [
    'Identify insecure API design patterns',
    'Exploit authorization, exposure, or parameter issues',
    'Retrieve sensitive data or perform unauthorized actions',
    'Apply API security best practices and rate limiting',
  ],
  'Business Logic': [
    'Identify implicit assumptions in business workflows',
    'Manipulate requests to break intended logic',
    'Achieve unauthorized outcomes such as price or flow bypass',
    'Understand testing techniques for logic flaws',
  ],
  'Software Supply Chain': [
    'Understand dependency management risks',
    'Identify attack vectors in third-party packages',
    'Recognize typosquatting and confusion attack patterns',
    'Apply secure dependency hygiene practices',
  ],
  'Reconnaissance & Asset Discovery': [
    'Identify exposed assets and dangling references',
    'Enumerate subdomains and misconfigured cloud resources',
    'Understand subdomain takeover preconditions',
    'Apply defensive DNS and asset management practices',
  ],
}

// ── Per-category scenario narrative ─────────────────────────
const SCENARIO_BY_CATEGORY = {
  'Injection': [
    'You have been brought in as a security consultant for a mid-sized e-commerce platform.',
    'The development team uses a relational database to store product listings, user accounts, and order data.',
    'During initial recon, you notice that several input fields are passed directly to backend queries without sanitization.',
    'Your objective is to exploit the injection vulnerability, extract the hidden flag, and demonstrate the impact to the client.',
  ],
  'Authentication & Session Management': [
    'A startup has launched a new SaaS application and suspects their login system has critical weaknesses.',
    'They have asked you to assess the authentication flow, from credential submission to session management.',
    'The application handles sensitive user data and a breach would be catastrophic.',
    'Your goal is to bypass or abuse the authentication mechanism and retrieve the hidden flag.',
  ],
  'Broken Access Control': [
    'A healthcare portal stores patient records accessible only to authorized staff.',
    'A recent code audit flagged missing authorization checks on several API endpoints.',
    'You have been granted a low-privilege account to simulate what a malicious user could access.',
    'Your objective is to escalate access and retrieve data that should be off-limits to your role.',
  ],
  'File Handling Vulnerabilities': [
    'A document management system allows authenticated users to upload and retrieve files.',
    'The engineering team used a custom implementation for file path resolution without thorough review.',
    'An internal audit suspects users may be able to reach files outside the intended storage directory.',
    'Your task is to exploit the file handling flaw and locate the hidden flag on the server.',
  ],
  'Server-Side Vulnerabilities': [
    'A financial services platform exposes an internal report generation feature to authenticated users.',
    'The feature makes server-side HTTP requests based on user-supplied parameters.',
    'Internal network segments — including a metadata service — are reachable from the application server.',
    'Your objective is to pivot through the server-side request to reach restricted internal resources and find the flag.',
  ],
  'Client-Side Vulnerabilities': [
    'A community forum platform allows users to post comments and rich content visible to all members.',
    'The application renders user-submitted content without sufficient sanitization.',
    'An admin reviews new posts periodically, making their session a high-value target.',
    "Your goal is to inject a payload that executes in the victim's browser and captures the hidden flag.",
  ],
  'API Security': [
    'A logistics company recently launched a REST API to integrate with third-party partners.',
    'The API was built quickly with a focus on features, leaving security controls incomplete.',
    'You have obtained a valid low-privilege API token through their public developer portal.',
    'Your mission is to identify and exploit API security flaws to access data beyond your authorization scope.',
  ],
  'Business Logic': [
    'An online retailer runs a discount and coupon system for promotional campaigns.',
    'The checkout flow was designed by a team unfamiliar with adversarial testing.',
    'Assumptions baked into the server-side logic may allow manipulation of prices or coupon behavior.',
    'Your task is to identify the logic flaw, exploit it, and retrieve the hidden flag embedded in the system.',
  ],
  'Software Supply Chain': [
    'A technology company has onboarded you to review their CI/CD pipeline and dependency management.',
    'They rely on dozens of open-source packages, many of which have not been audited recently.',
    'The build system automatically installs packages without lockfile enforcement in some stages.',
    'Your objective is to identify the supply chain vulnerability and locate the hidden flag.',
  ],
  'Reconnaissance & Asset Discovery': [
    'A fintech company is concerned about their external attack surface after a competitor suffered a breach.',
    'During preliminary recon you discover a subdomain pointing to a deprovisioned cloud service.',
    'The DNS record was never cleaned up after a legacy system was retired six months ago.',
    'Your goal is to demonstrate the subdomain takeover risk and retrieve the hidden flag as proof of concept.',
  ],
}

const DEFAULT_RESOURCES_BY_CATEGORY = {
  'Injection': [
    { title: 'OWASP – Injection', sub: 'owasp.org', href: 'https://owasp.org/www-community/Injection_Flaws' },
    { title: 'OWASP SQL Injection Cheat Sheet', sub: 'cheatsheetseries.owasp.org', href: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' },
    { title: 'PortSwigger – SQL Injection', sub: 'portswigger.net', href: 'https://portswigger.net/web-security/sql-injection' },
  ],
  'Authentication & Session Management': [
    { title: 'OWASP Authentication Cheat Sheet', sub: 'cheatsheetseries.owasp.org', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
    { title: 'OWASP Session Management Cheat Sheet', sub: 'cheatsheetseries.owasp.org', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html' },
    { title: 'PortSwigger – Authentication', sub: 'portswigger.net', href: 'https://portswigger.net/web-security/authentication' },
  ],
  'Broken Access Control': [
    { title: 'OWASP Broken Access Control', sub: 'owasp.org', href: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/' },
    { title: 'OWASP IDOR Cheat Sheet', sub: 'cheatsheetseries.owasp.org', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html' },
    { title: 'PortSwigger – Access Control', sub: 'portswigger.net', href: 'https://portswigger.net/web-security/access-control' },
  ],
  'File Handling Vulnerabilities': [
    { title: 'OWASP File Upload Cheat Sheet', sub: 'cheatsheetseries.owasp.org', href: 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html' },
    { title: 'PortSwigger – File Upload Vulnerabilities', sub: 'portswigger.net', href: 'https://portswigger.net/web-security/file-upload' },
    { title: 'PortSwigger – Path Traversal', sub: 'portswigger.net', href: 'https://portswigger.net/web-security/file-path-traversal' },
  ],
  'Server-Side Vulnerabilities': [
    { title: 'PortSwigger – SSRF', sub: 'portswigger.net', href: 'https://portswigger.net/web-security/ssrf' },
    { title: 'OWASP SSRF Prevention Cheat Sheet', sub: 'cheatsheetseries.owasp.org', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html' },
    { title: 'PortSwigger – HTTP Request Smuggling', sub: 'portswigger.net', href: 'https://portswigger.net/web-security/request-smuggling' },
  ],
  'Client-Side Vulnerabilities': [
    { title: 'OWASP XSS Overview', sub: 'owasp.org', href: 'https://owasp.org/www-community/attacks/xss/' },
    { title: 'OWASP XSS Prevention Cheat Sheet', sub: 'cheatsheetseries.owasp.org', href: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html' },
    { title: 'PortSwigger – XSS', sub: 'portswigger.net', href: 'https://portswigger.net/web-security/cross-site-scripting' },
  ],
  'API Security': [
    { title: 'OWASP API Security Top 10', sub: 'owasp.org', href: 'https://owasp.org/www-project-api-security/' },
    { title: 'OWASP REST Security Cheat Sheet', sub: 'cheatsheetseries.owasp.org', href: 'https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html' },
    { title: 'PortSwigger – API Testing', sub: 'portswigger.net', href: 'https://portswigger.net/web-security/api-testing' },
  ],
  'Business Logic': [
    { title: 'PortSwigger – Business Logic Vulnerabilities', sub: 'portswigger.net', href: 'https://portswigger.net/web-security/logic-flaws' },
    { title: 'OWASP Testing Guide – Business Logic', sub: 'owasp.org', href: 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing' },
  ],
  'Software Supply Chain': [
    { title: 'OWASP Software Component Verification Standard', sub: 'owasp.org', href: 'https://owasp.org/www-project-scvs/' },
    { title: 'MITRE ATT&CK – Supply Chain Compromise', sub: 'attack.mitre.org', href: 'https://attack.mitre.org/techniques/T1195/' },
  ],
  'Reconnaissance & Asset Discovery': [
    { title: 'HackerOne – Subdomain Takeover', sub: 'hackerone.com', href: 'https://www.hackerone.com/application-security/guide-subdomain-takeovers' },
    { title: 'can-i-take-over-xyz', sub: 'github.com', href: 'https://github.com/EdOverflow/can-i-take-over-xyz' },
  ],
}

const HINTS_BY_CATEGORY = {
  'Injection':                           ['Try injecting special characters into every input field.', "Think about how the server constructs its query — what happens with a single quote?", "UNION SELECT may help you retrieve data from other tables."],
  'Authentication & Session Management': ['Inspect the login request and response closely in your proxy.', 'Look at how tokens are generated — are they predictable or reusable?', 'Check what happens if you modify the session token or JWT claims.'],
  'Broken Access Control':               ['Try accessing other users\' resources by changing an ID in the request.', 'Are there admin-only endpoints hinted at in the JavaScript or API docs?', 'Check if authorization is enforced on every method (GET, POST, PUT, DELETE).'],
  'File Handling Vulnerabilities':       ['Try using ../ sequences in file path parameters.', 'Does the upload endpoint validate MIME type client-side or server-side?', 'Check the HTTP response for hints about the server file system layout.'],
  'Server-Side Vulnerabilities':         ['Try pointing the URL parameter to http://127.0.0.1 or http://169.254.169.254.', 'What internal services might be reachable from the server?', 'Try different URL schemes: file://, dict://, gopher://.'],
  'Client-Side Vulnerabilities':         ['Try a simple <script>alert(1)</script> first to confirm execution.', 'Look for unsanitized reflection in the page source.', 'Consider stored XSS — does your payload persist after a page reload?'],
  'API Security':                        ['Intercept API calls and look for IDs or object references you can manipulate.', 'Are there fields in the response you can try sending back in a write request?', 'Check if the API uses numeric sequential IDs — can you enumerate them?'],
  'Business Logic':                      ['Try submitting negative or zero values for prices or quantities.', 'What assumptions does the workflow make about request ordering?', 'Repeat a request that should only succeed once.'],
  'Software Supply Chain':               ['Check package names for slight misspellings compared to popular libraries.', 'Look at what version constraints are set in the manifest file.', 'Check if there is a lockfile and whether it is enforced during CI.'],
  'Reconnaissance & Asset Discovery':    ['Look up the subdomain in public DNS records.', 'Check whether the cloud resource it points to is still claimed.', 'Try visiting the subdomain directly in your browser.'],
}

const RULES = [
  'Only test within the boundaries of this lab environment.',
  'Do not attempt to attack the platform infrastructure.',
  'Do not share flags or solutions publicly.',
  'Using hints will reduce your final score for this lab.',
  'Complete the challenge ethically and document your findings.',
]

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

export default function LabInfo() {
  const { slug }          = useParams()
  const navigate          = useNavigate()
  const [lab, setLab]     = useState(null)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('PENDING')  // PENDING | COMPLETED

  const [unlockedHints, setUnlocked]  = useState([])
  const [flag, setFlag]               = useState('')
  const [flagState, setFlagState]     = useState(null)   // null | 'success' | 'error'
  const [flagMsg, setFlagMsg]         = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [labOnline, setLabOnline]     = useState(null)   // null | true | false

  useEffect(() => {
    labApi.getOne(slug)
      .then(r => setLab(r.data))
      .catch(() => setError('Lab not found.'))
  }, [slug])

  useEffect(() => {
    if (!lab) return
    progressApi.map()
      .then(r => { if (r.data[String(lab.id)] === 'COMPLETED') setStatus('COMPLETED') })
      .catch(() => {})
  }, [lab])

  useEffect(() => {
    if (!lab?.lab_url) return
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 4000)
    const labPath = lab.lab_url.startsWith('http')
      ? new URL(lab.lab_url).origin
      : window.location.origin
    const healthPath = lab.lab_url.startsWith('http')
      ? `${new URL(lab.lab_url).origin}/health`
      : lab.lab_url.replace(/\/[^/]+$/, '/health')
    fetch(healthPath, { signal: ctrl.signal })
      .then(r => setLabOnline(r.ok))
      .catch(() => setLabOnline(false))
      .finally(() => clearTimeout(timer))
  }, [lab])

  const unlockHint = (i) => {
    if (!unlockedHints.includes(i)) {
      setUnlocked(p => [...p, i])
      progressApi.unlockHint(slug).catch(() => {})
    }
  }

  const handleFlagSubmit = async (e) => {
    e.preventDefault()
    if (!flag.trim()) return
    setSubmitting(true)
    setFlagState(null)
    try {
      const res = await progressApi.submitFlag(slug, flag.trim())
      if (res.data.alreadyCompleted) {
        setFlagState('success')
        setFlagMsg('You already completed this lab! 🎉')
      } else {
        setFlagState('success')
        setFlagMsg(`Correct! You earned ${res.data.points_earned} points${res.data.penalty > 0 ? ` (−${res.data.penalty} hint penalty)` : ''} 🎉`)
        setStatus('COMPLETED')
        window.dispatchEvent(new Event('flag:submitted'))
      }
    } catch (err) {
      setFlagState('error')
      setFlagMsg(err.response?.data?.message || 'Incorrect flag. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (error) return <div className="li-state li-state--error">{error}</div>
  if (!lab)  return <div className="li-state">Loading...</div>

  const priorityKey  = lab.difficulty?.toLowerCase()
  const objectives   = lab.meta?.objectives ?? OBJECTIVES_BY_CATEGORY[lab.category]   ?? OBJECTIVES_BY_CATEGORY['Injection']
  const scenario     = lab.meta?.scenario   ?? SCENARIO_BY_CATEGORY[lab.category]     ?? SCENARIO_BY_CATEGORY['Injection']
  const resources    = lab.meta?.resources  ?? DEFAULT_RESOURCES_BY_CATEGORY[lab.category] ?? []
  const hints        = lab.meta?.hints      ?? HINTS_BY_CATEGORY[lab.category]        ?? HINTS_BY_CATEGORY['Injection']
  const completed    = status === 'COMPLETED'

  return (
    <motion.div className="li" initial="hidden" animate="show" variants={stagger}>

      {/* Breadcrumb */}
      <motion.div className="li-breadcrumb" variants={fadeUp}>
        <Link to="/">Dashboard</Link>
        <ChevronRight size={12} className="li-breadcrumb__sep" />
        <Link to="/labs">Labs</Link>
        <ChevronRight size={12} className="li-breadcrumb__sep" />
        <span className="li-breadcrumb__current">{lab.title}</span>
      </motion.div>

      {/* Hero */}
      <motion.div className="li-hero" variants={fadeUp}>
        <div className="li-hero__glow" />
        <div className="li-hero__top">
          <div>
            <h1 className="li-hero__title">{lab.title}</h1>
            <div className="li-hero__stars">{stars(lab.difficulty)}</div>
            <div className="li-hero__meta">
              <span className={`li-hero__badge li-hero__badge--${priorityKey}`}>{PRIORITY_LABEL[lab.difficulty]}</span>
              <span className="li-hero__badge li-hero__badge--pts"><Trophy size={11} /> {lab.points} Points</span>
              <span className="li-hero__badge li-hero__badge--time"><Clock size={11} /> {lab.estimated_time} mins</span>
              <span className="li-hero__badge li-hero__badge--cat"><Layers size={11} /> {lab.category}</span>
            </div>
          </div>
          {completed && (
            <span className="li-hero__status"><CheckCircle size={14} /> Completed</span>
          )}
        </div>
      </motion.div>

      {/* About */}
      <motion.div className="li-card" variants={fadeUp}>
        <h2 className="li-card__title"><span>📖</span> About this Vulnerability</h2>
        <p className="li-card__text">{lab.description}</p>
        <p className="li-card__text">
          Understanding this vulnerability is critical for both offensive security practitioners and developers.
          Real-world exploitation of this class of issue has led to data breaches, account takeovers, and full system compromise at major organizations.
          No direct exploitation spoilers are provided here — the lab environment is where you apply what you learn.
        </p>
      </motion.div>

      {/* Learning Objectives */}
      <motion.div className="li-card" variants={fadeUp}>
        <h2 className="li-card__title"><span>🎯</span> Learning Objectives</h2>
        <div className="li-objectives">
          {objectives.map((obj, i) => (
            <motion.div
              key={i}
              className="li-objective"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.28 }}
            >
              <div className="li-objective__check">✓</div>
              {obj}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scenario */}
      <motion.div className="li-card" variants={fadeUp}>
        <h2 className="li-card__title"><span>🕵️</span> Scenario</h2>
        <div className="li-scenario">
          {scenario.map((line, i) => (
            <p key={i} className="li-scenario__line">{line}</p>
          ))}
        </div>
      </motion.div>

      {/* Rules */}
      <motion.div className="li-card" variants={fadeUp}>
        <h2 className="li-card__title"><span>📋</span> Rules</h2>
        <div className="li-rules">
          {RULES.map((rule, i) => (
            <div key={i} className="li-rule">
              <div className="li-rule__dot" />
              {rule}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hints */}
      <motion.div className="li-card" variants={fadeUp}>
        <h2 className="li-card__title"><span>💡</span> Hints</h2>
        <div className="li-hints">
          {hints.map((hint, i) => {
            const unlocked = unlockedHints.includes(i)
            return (
              <div key={i} className="li-hint">
                <div className="li-hint__header" onClick={() => unlocked && null}>
                  <span className="li-hint__label">
                    {unlocked ? <Unlock size={13} /> : <Lock size={13} />}
                    Hint {i + 1}
                  </span>
                  {!unlocked && (
                    <button className="li-hint__unlock" onClick={() => unlockHint(i)}>
                      <Unlock size={11} /> Unlock (−{(i + 1) * 10} pts)
                    </button>
                  )}
                  {unlocked && <span className="li-hint__cost">Unlocked</span>}
                </div>
                <AnimatePresence>
                  {unlocked && (
                    <motion.div
                      className="li-hint__body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {hint}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div className="li-card" variants={fadeUp}>
        <h2 className="li-card__title"><span>🔗</span> Resources</h2>
        <div className="li-resources">
          {resources.map((r, i) => (
            <a key={i} className="li-resource" href={r.href} target="_blank" rel="noopener noreferrer">
              <div className="li-resource__icon"><ExternalLink size={14} /></div>
              <div>
                <div className="li-resource__title">{r.title}</div>
                <div className="li-resource__sub">{r.sub}</div>
              </div>
              <ChevronRight size={14} className="li-resource__arrow" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={fadeUp}>
        <div className="li-actions">
          {lab.lab_url && (
            <div className="li-server-status">
              <span className={`li-server-dot ${
                labOnline === null ? 'li-server-dot--checking' :
                labOnline ? 'li-server-dot--online' : 'li-server-dot--offline'
              }`} />
              {labOnline === null ? 'Checking lab server…' :
               labOnline ? 'Lab Server Online' : 'Lab Server Offline'}
            </div>
          )}
          <button
            className="li-btn li-btn--primary"
            onClick={() => navigate(`/labs/${slug}/start`)}
            disabled={labOnline === false}
          >
            <Play size={14} /> Launch Lab
          </button>
        </div>

        {/* Flag Submit */}
        {!completed && (
          <div className="li-flag">
            <form className="li-flag__form" onSubmit={handleFlagSubmit}>
              <input
                className="li-flag__input"
                placeholder="Enter flag — e.g. FLAG{...}"
                value={flag}
                onChange={e => setFlag(e.target.value)}
                disabled={submitting}
              />
              <button className="li-btn li-btn--outline" type="submit" disabled={submitting}>
                <Flag size={13} /> {submitting ? 'Checking...' : 'Submit Flag'}
              </button>
            </form>
            {flagState && (
              <motion.p
                className={`li-flag__feedback li-flag__feedback--${flagState}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {flagState === 'success' ? <CheckCircle size={14} /> : '✕'} {flagMsg}
              </motion.p>
            )}
          </div>
        )}

        {completed && (
          <div className="li-flag">
            <button className="li-btn li-btn--success" disabled>
              <CheckCircle size={14} /> Lab Completed
            </button>
          </div>
        )}
      </motion.div>

    </motion.div>
  )
}
