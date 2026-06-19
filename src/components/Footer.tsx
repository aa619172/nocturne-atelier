export function Footer() {
  return (
    <footer>
      <div className="symmetry-rule" aria-hidden="true">
        <span className="symmetry-rule__line" />
        <span className="symmetry-rule__diamond">◆</span>
        <span className="symmetry-rule__line" />
      </div>
      <div className="footer-inner">
        <p className="smallcaps footer-brand">
          Nocturne Atelier · Gothic · Ambient · Arcane
        </p>
        <p className="smallcaps muted-text">
          <a href="https://nocturneatelier.net/" className="underline-link">
            nocturneatelier.net
          </a>
        </p>
        <p className="smallcaps muted-text">© MMXXVI — Composed in the dark</p>
      </div>
    </footer>
  )
}
