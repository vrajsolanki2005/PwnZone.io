import { useState, useEffect, useRef } from 'react'
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchInput from '../../components/ui/SearchInput/SearchInput'
import LabCard from '../../components/ui/LabCard/LabCard'
import { labApi, progressApi } from '../../services/api'
import './Labs.css'

const DIFFICULTIES = [
  { key: 'P1', label: '🔴 P1 – Critical' },
  { key: 'P2', label: '🟠 P2 – High' },
  { key: 'P3', label: '🟡 P3 – Medium' },
  { key: 'P4', label: '🟢 P4 – Low' },
]

const CATEGORIES = [
  'API Security',
  'Authentication & Session Management',
  'Broken Access Control',
  'Business Logic',
  'Client-Side Vulnerabilities',
  'File Handling Vulnerabilities',
  'Injection',
  'Reconnaissance & Asset Discovery',
  'Server-Side Vulnerabilities',
  'Software Supply Chain',
]

const SORT_OPTIONS = [
  { key: 'default',     label: 'Default (Priority)' },
  { key: 'points-desc', label: 'Points: High → Low' },
  { key: 'points-asc',  label: 'Points: Low → High' },
  { key: 'title-asc',   label: 'Title: A → Z' },
  { key: 'title-desc',  label: 'Title: Z → A' },
  { key: 'newest',      label: 'Newest First' },
  { key: 'oldest',      label: 'Oldest First' },
]

const PRIORITY_META = {
  P1: { emoji: '🔴', label: 'P1 – Critical', desc: 'Immediate exploitation risk, business impact, data compromise' },
  P2: { emoji: '🟠', label: 'P2 – High',     desc: 'Severe but requires conditions, lateral exploitation possible' },
  P3: { emoji: '🟡', label: 'P3 – Medium',   desc: 'Exploitable but limited scope or mitigations exist' },
  P4: { emoji: '🟢', label: 'P4 – Low',      desc: 'Best practices, defense-in-depth, minor exposure' },
}

const PRIORITY_ORDER = ['P1', 'P2', 'P3', 'P4']

function Dropdown({ label, value, options, onSelect, onClear }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="labs-dropdown" ref={ref}>
      <button
        className={`labs-dropdown__trigger${value ? ' labs-dropdown__trigger--active' : ''}`}
        onClick={() => setOpen(p => !p)}
      >
        <span>{value || label}</span>
        {value
          ? <X size={13} className="labs-dropdown__clear" onClick={e => { e.stopPropagation(); onClear(); setOpen(false) }} />
          : <ChevronDown size={14} className={`labs-dropdown__chevron${open ? ' open' : ''}`} />
        }
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="labs-dropdown__menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            {options.map(opt => (
              <li
                key={typeof opt === 'string' ? opt : opt.key}
                className={`labs-dropdown__item${value === (typeof opt === 'string' ? opt : opt.label) ? ' labs-dropdown__item--active' : ''}`}
                onClick={() => { onSelect(opt); setOpen(false) }}
              >
                {typeof opt === 'string' ? opt : opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Labs() {
  const [labs, setLabs]         = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')
  const [difficulty, setDiff]   = useState('')
  const [category, setCat]      = useState('')
  const [sort, setSort]         = useState('')
  const debounceRef = useRef(null)

  useEffect(() => {
    progressApi.map().then(r => setProgress(r.data)).catch(() => {})
  }, [])

  const activeFilters = [
    difficulty && { key: 'difficulty', label: DIFFICULTIES.find(d => d.key === difficulty)?.label, clear: () => setDiff('') },
    category   && { key: 'category',   label: category, clear: () => setCat('') },
    sort       && { key: 'sort',       label: SORT_OPTIONS.find(s => s.key === sort)?.label, clear: () => setSort('') },
  ].filter(Boolean)

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setLoading(true)
      const params = {}
      if (difficulty)    params.difficulty = difficulty
      if (category)      params.category   = category
      if (search.trim()) params.search     = search.trim()
      if (sort && sort !== 'default') params.sort = sort
      labApi.getAll(params)
        .then(r => { setLabs(r.data); setError(null) })
        .catch(() => setError('Failed to load labs.'))
        .finally(() => setLoading(false))
    }, search ? 350 : 0)
    return () => clearTimeout(debounceRef.current)
  }, [difficulty, category, search, sort])

  const isFiltered = difficulty || category || search || sort

  const groups = PRIORITY_ORDER.map(p => ({
    priority: p,
    labs: labs.filter(l => l.difficulty === p),
  })).filter(g => g.labs.length > 0)

  return (
    <div>
      <h1>Labs</h1>

      <div className="labs-toolbar">
        <SearchInput
          placeholder="Search labs, categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="labs-controls">
          <SlidersHorizontal size={15} className="labs-controls__icon" />
          <Dropdown
            label="Difficulty"
            value={difficulty ? DIFFICULTIES.find(d => d.key === difficulty)?.label : ''}
            options={DIFFICULTIES}
            onSelect={opt => setDiff(opt.key)}
            onClear={() => setDiff('')}
          />
          <Dropdown
            label="Category"
            value={category}
            options={CATEGORIES}
            onSelect={opt => setCat(opt)}
            onClear={() => setCat('')}
          />
          <Dropdown
            label="Sort By"
            value={sort ? SORT_OPTIONS.find(s => s.key === sort)?.label : ''}
            options={SORT_OPTIONS}
            onSelect={opt => setSort(opt.key)}
            onClear={() => setSort('')}
          />
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="labs-chips">
          {activeFilters.map(f => (
            <span key={f.key} className="labs-chip">
              {f.label}
              <button onClick={f.clear}><X size={11} /></button>
            </span>
          ))}
          <button className="labs-chips__clear-all" onClick={() => { setDiff(''); setCat(''); setSort(''); setSearch('') }}>
            Clear all
          </button>
        </div>
      )}

      {!loading && !error && (
        <p className="labs-results-count">{labs.length} lab{labs.length !== 1 ? 's' : ''} found</p>
      )}

      {loading && <p className="labs-state">Loading labs...</p>}
      {error   && <p className="labs-state labs-state--error">{error}</p>}

      {!loading && !error && !isFiltered && groups.map(({ priority, labs: group }) => {
        const meta = PRIORITY_META[priority]
        return (
          <div key={priority} className="labs-section">
            <div className="labs-section__header">
              <span className={`labs-section__badge labs-section__badge--${priority.toLowerCase()}`}>
                {meta.emoji} {meta.label}
              </span>
              <span className="labs-section__desc">{meta.desc}</span>
              <span className="labs-section__count">{group.length} labs</span>
            </div>
            <div className="labs-grid">
              {group.map(lab => (
                <LabCard
                  key={lab.id}
                  id={lab.slug}
                  title={lab.title}
                  points={lab.points}
                  category={lab.category}
                  priority={lab.difficulty}
                  status={progress[lab.id] || 'PENDING'}
                />
              ))}
            </div>
          </div>
        )
      })}

      {!loading && !error && isFiltered && (
        <div className="labs-grid labs-grid--flat">
          {labs.map(lab => (
            <LabCard
              key={lab.id}
              id={lab.slug}
              title={lab.title}
              points={lab.points}
              category={lab.category}
              priority={lab.difficulty}
              status={progress[lab.id] || 'PENDING'}
            />
          ))}
        </div>
      )}

      {!loading && !error && labs.length === 0 && (
        <p className="labs-state">No labs match your filters.</p>
      )}
    </div>
  )
}
