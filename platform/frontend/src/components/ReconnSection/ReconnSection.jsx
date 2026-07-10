import { useState, useEffect, useCallback } from 'react'
import { Search, Globe, FolderSearch, Shield, Layers, Network, X, Copy, Check } from 'lucide-react'
import api from '../../services/api'
import './ReconnSection.css'

const TOOLS = [
  { id: 'nmap',      label: 'Port Scanner',     icon: Network,      placeholder: 'e.g. 192.168.1.1',      description: 'nmap + fast scan — service detection & open ports' },
  { id: 'whois',     label: 'WHOIS Lookup',     icon: Globe,        placeholder: 'e.g. pwnzone.io',       description: 'Domain registration info' },
  { id: 'dns',       label: 'DNS Lookup',       icon: Search,       placeholder: 'e.g. pwnzone.io',       description: 'Resolve DNS records (A, MX, TXT…)' },
  { id: 'dirsearch', label: 'Dir Search',       icon: FolderSearch, placeholder: 'e.g. http://10.0.0.1', description: 'Enumerate directories & files on a web server' },
  { id: 'ssl',       label: 'SSL Checker',      icon: Shield,       placeholder: 'e.g. pwnzone.io',       description: 'Inspect SSL/TLS certificate' },
  { id: 'subdomain', label: 'Subdomain Finder', icon: Layers,       placeholder: 'e.g. pwnzone.io',       description: 'Enumerate subdomains' },
]

function formatOutput(id, data) {
  const r = data.result
  switch (id) {
    case 'nmap':
      return (data.scanner ? `[${data.scanner}]\n\n` : '') + r

    case 'whois':
      return r

    case 'dns':
      return [
        `A:     ${r.A?.join(', ') || '—'}`,
        `NS:    ${r.NS?.join(', ') || '—'}`,
        `MX:    ${r.MX?.map(m => `${m.exchange} (pri ${m.priority})`).join(', ') || '—'}`,
        `TXT:   ${r.TXT?.map(t => t.join('')).join(' | ') || '—'}`,
        `CNAME: ${r.CNAME?.join(', ') || '—'}`,
      ].join('\n')

    case 'dirsearch':
      return r

    case 'ssl':
      return [
        `Subject:     ${JSON.stringify(r.subject)}`,
        `Issuer:      ${JSON.stringify(r.issuer)}`,
        `Valid From:  ${r.validFrom}`,
        `Valid To:    ${r.validTo}`,
        `Fingerprint: ${r.fingerprint}`,
        `SAN:         ${r.san}`,
        `Key Bits:    ${r.bits}`,
      ].join('\n')

    case 'subdomain':
      if (!r?.length) return 'No subdomains found.'
      return r.map(s => `${s.subdomain.padEnd(40)} ${s.ips.join(', ')}`).join('\n')

    default:
      return JSON.stringify(r, null, 2)
  }
}

// ── Result Modal ──────────────────────────────────────────────────────────────
function ResultModal({ tool, target, content, isError, onClose }) {
  const [copied, setCopied] = useState(false)
  const Icon = tool.icon

  const copy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div className="recon-modal-overlay" onClick={onClose}>
      <div className="recon-modal" onClick={(e) => e.stopPropagation()}>
        <div className="recon-modal-header">
          <div className="recon-modal-title">
            <span className="recon-card-icon"><Icon size={16} /></span>
            <span>{tool.label}</span>
            <span className="recon-modal-target">— {target}</span>
          </div>
          <div className="recon-modal-actions">
            <button className="recon-modal-btn" onClick={copy} title="Copy output">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button className="recon-modal-btn recon-modal-close" onClick={onClose} title="Close (Esc)">
              <X size={15} />
            </button>
          </div>
        </div>
        <pre className={`recon-modal-body${isError ? ' recon-modal-body--error' : ''}`}>
          {content}
        </pre>
      </div>
    </div>
  )
}

// ── Tool Card ─────────────────────────────────────────────────────────────────
function ToolCard({ tool }) {
  const [target, setTarget] = useState('')
  const [modal, setModal]   = useState(null)   // { content, isError }
  const [loading, setLoading] = useState(false)
  const Icon = tool.icon

  const run = async () => {
    if (!target.trim()) return
    setLoading(true)
    setModal(null)
    try {
      const res = await api.post(`/recon/${tool.id}`, { target: target.trim() })
      setModal({ content: formatOutput(tool.id, res.data), isError: false })
    } catch (e) {
      setModal({ content: e?.response?.data?.error || e.message, isError: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="recon-card">
        <div className="recon-card-header">
          <span className="recon-card-icon"><Icon size={18} /></span>
          <div>
            <p className="recon-card-title">{tool.label}</p>
            <p className="recon-card-desc">{tool.description}</p>
          </div>
        </div>
        <div className="recon-card-input-row">
          <input
            className="recon-input"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder={tool.placeholder}
            onKeyDown={(e) => e.key === 'Enter' && run()}
          />
          <button className="recon-run-btn" onClick={run} disabled={loading}>
            {loading ? 'Running…' : 'Run'}
          </button>
        </div>
        {modal && (
          <button className="recon-view-btn" onClick={() => setModal(modal)}>
            View Results
          </button>
        )}
      </div>

      {modal && (
        <ResultModal
          tool={tool}
          target={target}
          content={modal.content}
          isError={modal.isError}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}

export default function ReconnSection() {
  return (
    <div className="recon-page">
      <div className="recon-page-header">
        <h1>Reconnaissance</h1>
        <p className="recon-page-sub">Run passive &amp; active recon tools against a target</p>
      </div>
      <div className="recon-grid">
        {TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
      </div>
    </div>
  )
}
