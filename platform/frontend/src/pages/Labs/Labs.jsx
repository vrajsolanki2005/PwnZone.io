import { useState } from 'react'
import SearchInput from '../../components/ui/SearchInput/SearchInput'
import LabCard from '../../components/ui/LabCard/LabCard'
import './Labs.css'

const FILTERS = [
  { key: 'All', label: 'All' },
  { key: 'P1',  label: '🔴 P1 – Critical' },
  { key: 'P2',  label: '🟠 P2 – High' },
  { key: 'P3',  label: '🟡 P3 – Medium' },
  { key: 'P4',  label: '🟢 P4 – Low' },
]

const PRIORITY_META = {
  P1: { emoji: '🔴', label: 'P1 – Critical', desc: 'Immediate exploitation risk, business impact, data compromise' },
  P2: { emoji: '🟠', label: 'P2 – High',     desc: 'Severe but requires conditions, lateral exploitation possible' },
  P3: { emoji: '🟡', label: 'P3 – Medium',   desc: 'Exploitable but limited scope or mitigations exist' },
  P4: { emoji: '🟢', label: 'P4 – Low',      desc: 'Best practices, defense-in-depth, minor exposure' },
}

const LABS = [
  { id: 'TM-01', title: 'SQL Injection Awareness',              points: 100, category: 'Injection',       priority: 'P1' },
  { id: 'TM-02', title: 'Blind SQL Injection Awareness',        points: 100, category: 'Injection',       priority: 'P1' },
  { id: 'TM-03', title: 'Second-Order SQL Injection Awareness', points: 100, category: 'Injection',       priority: 'P1' },
  { id: 'TM-04', title: 'NoSQL Injection Awareness',            points: 100, category: 'Injection',       priority: 'P1' },
  { id: 'TM-05', title: 'Command Injection Awareness',          points: 100, category: 'Injection',       priority: 'P1' },
  { id: 'TM-06', title: 'Server-Side Template Injection Awareness', points: 100, category: 'Injection',   priority: 'P1' },
  { id: 'TM-07', title: 'Authentication Bypass Scenario',       points: 100, category: 'Authentication',  priority: 'P1' },
  { id: 'TM-08', title: 'OAuth Account Takeover Scenario',      points: 100, category: 'Authentication',  priority: 'P1' },
  { id: 'TM-09', title: 'JWT Security Scenario',                points: 100, category: 'Authentication',  priority: 'P1' },
  { id: 'TM-10', title: 'Session Management Scenario',          points: 100, category: 'Authentication',  priority: 'P1' },
  { id: 'TM-11', title: 'Vertical IDOR Scenario',               points: 100, category: 'Access Control',  priority: 'P1' },
  { id: 'TM-12', title: 'Privilege Escalation Scenario',        points: 100, category: 'Access Control',  priority: 'P1' },
  { id: 'TM-13', title: 'File Upload Security Scenario',        points: 100, category: 'File Security',   priority: 'P1' },
  { id: 'TM-14', title: 'SSRF Concept Demonstration',           points: 100, category: 'Server Side',     priority: 'P1' },
  { id: 'TM-15', title: 'Internal Resource Access Scenario',    points: 100, category: 'Server Side',     priority: 'P1' },
  { id: 'TM-16', title: 'XML Processing Security Scenario',     points: 100, category: 'Injection',       priority: 'P1' },
  { id: 'TM-17', title: 'Payment Validation Logic Scenario',    points: 100, category: 'Business Logic',  priority: 'P1' },
  { id: 'TM-18', title: 'HTTP Request Smuggling Awareness',     points: 100, category: 'Server Side',     priority: 'P1' },
  { id: 'TM-19', title: 'Insecure Deserialization Awareness',   points: 100, category: 'Server Side',     priority: 'P1' },
  { id: 'TM-20', title: 'Dependency Management Security Scenario', points: 100, category: 'Supply Chain', priority: 'P1' },

  { id: 'TM-21', title: 'Stored XSS Awareness',                 points: 75, category: 'Client Side',     priority: 'P2' },
  { id: 'TM-22', title: 'Blind XSS Awareness',                  points: 75, category: 'Client Side',     priority: 'P2' },
  { id: 'TM-23', title: 'Horizontal IDOR Scenario',             points: 75, category: 'Access Control',  priority: 'P2' },
  { id: 'TM-24', title: 'BOLA Awareness Module',                points: 75, category: 'Access Control',  priority: 'P2' },
  { id: 'TM-25', title: 'BFLA Awareness Module',                points: 75, category: 'Access Control',  priority: 'P2' },
  { id: 'TM-26', title: 'Missing Authorization Scenario',       points: 75, category: 'Access Control',  priority: 'P2' },
  { id: 'TM-27', title: 'Object Ownership Validation Scenario', points: 75, category: 'Access Control',  priority: 'P2' },
  { id: 'TM-28', title: 'Password Reset Security Scenario',     points: 75, category: 'Authentication',  priority: 'P2' },
  { id: 'TM-29', title: 'Token Lifecycle Security Scenario',    points: 75, category: 'Authentication',  priority: 'P2' },
  { id: 'TM-30', title: 'Arbitrary File Access Awareness',      points: 75, category: 'File Security',   priority: 'P2' },
  { id: 'TM-31', title: 'Path Traversal Awareness',             points: 75, category: 'File Security',   priority: 'P2' },
  { id: 'TM-32', title: 'File Inclusion Awareness',             points: 75, category: 'File Security',   priority: 'P2' },
  { id: 'TM-33', title: 'Webhook Security Scenario',            points: 75, category: 'API Security',    priority: 'P2' },
  { id: 'TM-34', title: 'GraphQL Mutation Security Scenario',   points: 75, category: 'API Security',    priority: 'P2' },
  { id: 'TM-35', title: 'API Key Management Scenario',          points: 75, category: 'API Security',    priority: 'P2' },
  { id: 'TM-36', title: 'Race Condition Awareness',             points: 75, category: 'Business Logic',  priority: 'P2' },
  { id: 'TM-37', title: 'Price Manipulation Logic Scenario',    points: 75, category: 'Business Logic',  priority: 'P2' },
  { id: 'TM-38', title: 'Coupon Validation Scenario',           points: 75, category: 'Business Logic',  priority: 'P2' },
  { id: 'TM-39', title: 'Mass Assignment Awareness',            points: 75, category: 'API Security',    priority: 'P2' },
  { id: 'TM-40', title: 'Cache Poisoning Awareness',            points: 75, category: 'Server Side',     priority: 'P2' },

  { id: 'TM-41', title: 'Reflected XSS Awareness',              points: 50, category: 'Client Side',     priority: 'P3' },
  { id: 'TM-42', title: 'DOM XSS Awareness',                    points: 50, category: 'Client Side',     priority: 'P3' },
  { id: 'TM-43', title: 'Markdown Rendering Security Scenario', points: 50, category: 'Client Side',     priority: 'P3' },
  { id: 'TM-44', title: 'SVG Handling Security Scenario',       points: 50, category: 'Client Side',     priority: 'P3' },
  { id: 'TM-45', title: 'Rich Text Editor Security Scenario',   points: 50, category: 'Client Side',     priority: 'P3' },
  { id: 'TM-46', title: 'CSRF Awareness',                       points: 50, category: 'Client Side',     priority: 'P3' },
  { id: 'TM-47', title: 'Forced Browsing Awareness',            points: 50, category: 'Access Control',  priority: 'P3' },
  { id: 'TM-48', title: 'Excessive Data Exposure Awareness',    points: 50, category: 'API Security',    priority: 'P3' },
  { id: 'TM-49', title: 'Rate Limiting Awareness',              points: 50, category: 'API Security',    priority: 'P3' },
  { id: 'TM-50', title: 'Brute Force Protection Scenario',      points: 50, category: 'Authentication',  priority: 'P3' },
  { id: 'TM-51', title: 'API Parameter Pollution Awareness',    points: 50, category: 'API Security',    priority: 'P3' },
  { id: 'TM-52', title: 'GraphQL Object Authorization Scenario',points: 50, category: 'API Security',    priority: 'P3' },
  { id: 'TM-53', title: 'Host Header Security Scenario',        points: 50, category: 'Server Side',     priority: 'P3' },
  { id: 'TM-54', title: 'CORS Security Scenario',               points: 50, category: 'Server Side',     priority: 'P3' },

  { id: 'TM-55', title: 'Clickjacking Awareness',               points: 25, category: 'Client Side',     priority: 'P4' },
  { id: 'TM-56', title: 'Password Policy Awareness',            points: 25, category: 'Authentication',  priority: 'P4' },
  { id: 'TM-57', title: 'Redirect Validation Scenario',         points: 25, category: 'Client Side',     priority: 'P4' },
  { id: 'TM-58', title: 'Error Handling & Information Disclosure Scenario', points: 25, category: 'Server Side', priority: 'P4' },
  { id: 'TM-59', title: 'GraphQL Introspection Awareness',      points: 25, category: 'API Security',    priority: 'P4' },
  { id: 'TM-60', title: 'Subdomain Takeover Awareness',         points: 25, category: 'Recon',           priority: 'P4' },
]

const PRIORITY_ORDER = ['P1', 'P2', 'P3', 'P4']

export default function Labs() {
  const [search, setSearch] = useState('')
  const [active, setActive] = useState('All')

  const filtered = LABS.filter(lab => {
    const matchFilter = active === 'All' || lab.priority === active
    const matchSearch = lab.title.toLowerCase().includes(search.toLowerCase()) ||
                        lab.id.toLowerCase().includes(search.toLowerCase()) ||
                        lab.category.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const groups = PRIORITY_ORDER.map(p => ({
    priority: p,
    labs: filtered.filter(l => l.priority === p),
  })).filter(g => g.labs.length > 0)

  return (
    <div>
      <h1>Labs</h1>
      <div className="labs-toolbar">
        <SearchInput
          placeholder="Search labs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="labs-filters">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`labs-filter-btn${active === f.key ? ' labs-filter-btn--active' : ''}`}
              onClick={() => setActive(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {groups.map(({ priority, labs }) => {
        const meta = PRIORITY_META[priority]
        return (
          <div key={priority} className="labs-section">
            <div className="labs-section__header">
              <span className={`labs-section__badge labs-section__badge--${priority.toLowerCase()}`}>
                {meta.emoji} {meta.label}
              </span>
              <span className="labs-section__desc">{meta.desc}</span>
              <span className="labs-section__count">{labs.length} labs</span>
            </div>
            <div className="labs-grid">
              {labs.map(lab => <LabCard key={lab.id} {...lab} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
