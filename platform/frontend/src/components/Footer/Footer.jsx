import { Link } from 'react-router-dom'
import { Globe, Share2, MessageCircle, Link as LinkIcon, Send, Feather } from 'lucide-react'
import './Footer.css'

const NAV_LINKS = [
  { title: 'Features',  href: '#' },
  { title: 'Solution',  href: '#' },
  { title: 'Customers', href: '#' },
  { title: 'Pricing',   href: '#' },
  { title: 'Help',      href: '#' },
  { title: 'About',     href: '#' },
]

const SOCIAL_LINKS = [
  { icon: Share2,      label: 'Share'   },
  { icon: MessageCircle, label: 'Message' },
  { icon: LinkIcon,    label: 'Link'    },
  { icon: Globe,       label: 'Website' },
  { icon: Send,        label: 'Send'    },
  { icon: Feather,     label: 'Post'    },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-nav">
          {NAV_LINKS.map((link) => (
            <Link key={link.title} to={link.href} className="footer-link">
              {link.title}
            </Link>
          ))}
        </div>

        <div className="footer-social">
          {SOCIAL_LINKS.map(({ icon: Icon, label }) => (
            <a key={label} href="#" target="_blank" rel="noopener noreferrer" aria-label={label} className="footer-social-link">
              <Icon size={18} />
            </a>
          ))}
        </div>

        <span className="footer-copy">
          © {new Date().getFullYear()} PwnZone.io — All rights reserved
        </span>
      </div>
    </footer>
  )
}
