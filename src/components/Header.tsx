import { useState } from 'react'
import { Logo } from './Logo'
import { useAuth } from '../context/AuthContext'

const leftLinks = [
  { href: '#manifesto', label: 'Manifesto' },
  { href: '#arcanum', label: 'Arcanum' },
  { href: '#works', label: 'Works' },
  { href: '#services', label: 'Services' },
]

const rightLinks = [
  { href: '#listen', label: 'Listen' },
  { href: '#reliquary', label: 'Reliquary' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const { openModal } = useAuth()
  const close = () => setOpen(false)

  const openThreshold = () => {
    close()
    openModal('signin')
  }

  return (
    <header>
      <div className="nav-inner nav-inner--symmetric">
        <nav className="nav-links nav-links--left smallcaps" aria-label="Primary left">
          {leftLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#top" className="nav-brand-center">
          <Logo className="nav-brand-center__mark" width={52} height={52} alt="" />
          <span className="smallcaps gold-text nav-brand-center__text">Nocturne · Atelier</span>
        </a>

        <nav className="nav-links nav-links--right smallcaps" aria-label="Primary right">
          {rightLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <button type="button" className="btn smallcaps nav-threshold" onClick={openThreshold}>
            Threshold
          </button>
          <a href="#contact" className="btn smallcaps nav-commission">
            Commission
          </a>
        </nav>

        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Menu
        </button>
      </div>

      <nav
        id="mobile-nav"
        className={`mobile-nav smallcaps ${open ? 'is-open' : ''}`}
        aria-label="Mobile"
        hidden={!open}
      >
        {[...leftLinks, ...rightLinks].map((link) => (
          <a key={link.href} href={link.href} onClick={close}>
            {link.label}
          </a>
        ))}
        <button type="button" className="mobile-nav__cta" onClick={openThreshold}>
          Threshold
        </button>
        <a href="#contact" className="mobile-nav__cta" onClick={close}>
          Commission
        </a>
      </nav>
    </header>
  )
}
