export function Manifesto() {
  return (
    <section id="manifesto" className="manifesto">
      <div className="symmetry-rule" aria-hidden="true">
        <span className="symmetry-rule__line" />
        <span className="symmetry-rule__diamond">◆</span>
        <span className="symmetry-rule__line" />
      </div>
      <div className="section-inner">
        <p className="smallcaps wine-text manifesto-label">— Manifesto —</p>
        <p className="quote">
          &ldquo;We write music for the half-light: for cathedrals after vespers,
          for forests that remember names, and for the small hour when the mind,
          alone, becomes a chapel.&rdquo;
        </p>
        <div className="ornament smallcaps">N · A</div>
      </div>
    </section>
  )
}
