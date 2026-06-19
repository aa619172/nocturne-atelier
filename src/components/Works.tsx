import { works } from '../data/site'

export function Works() {
  return (
    <section id="works" className="works">
      <div className="section-inner section-inner--narrow">
        <div className="section-header section-header--center">
          <p className="smallcaps wine-text section-label">— Catalogue —</p>
          <h2>Selected Works</h2>
          <p className="smallcaps muted-text works-years">MMXXIII — MMXXIV</p>
        </div>

        <ul className="works-list works-list--symmetric">
          {works.map((work) => (
            <li key={work.title}>
              <span className="font-mono gold-text work-num">{work.num}</span>
              <h3>{work.title}</h3>
              <p className="smallcaps muted-text work-meta">{work.meta}</p>
              <p className="muted-text work-desc">
                {work.description}{' '}
                <span className="smallcaps work-year">{work.year}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
