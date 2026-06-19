import { Logo } from './Logo'

export function Hero() {
  return (
    <section id="top" className="hero hero--symmetric">
      <div className="symmetry-rule symmetry-rule--top" aria-hidden="true">
        <span className="symmetry-rule__line" />
        <span className="symmetry-rule__diamond">◆</span>
        <span className="symmetry-rule__line" />
      </div>

      <div className="hero-inner">
        <div className="hero-logo">
          <div className="blur-bg" aria-hidden="true" />
          <div className="spin-border" aria-hidden="true" />
          <Logo
            className="hero-logo__img"
            alt="Nocturne Atelier — NA monogram with crescent moon and arcane sigil"
          />
        </div>

        <div className="hero-copy">
          <p className="smallcaps wine-text hero-est">Est. by candlelight · Anno MMXX</p>
          <h1>
            <span className="italic hero-line">Music for</span>
            <span className="hero-line">the unlit hours.</span>
          </h1>
          <p className="hero-lead">
            A dark music house composing{' '}
            <span className="gold-text">gothic ambient</span>,{' '}
            <span className="gold-text">arcane atmospheres</span>, horror-inspired
            scores, and spellbound classical soundscapes — written in long
            candle-watches for screen, ritual, and the quiet listener.
          </p>
          <div className="hero-actions">
            <a href="#listen" className="btn btn-hero">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 1 L12 7 L2 13 Z" fill="currentColor" />
              </svg>
              <span className="smallcaps">Enter the catalogue</span>
            </a>
            <a href="#manifesto" className="smallcaps underline-link">
              Read the manifesto
            </a>
          </div>
        </div>
      </div>

      <div className="symmetry-rule symmetry-rule--bottom" aria-hidden="true">
        <span className="symmetry-rule__line" />
        <span className="symmetry-rule__diamond">◆</span>
        <span className="symmetry-rule__line" />
      </div>
    </section>
  )
}
