import { services } from '../data/site'

export function Services() {
  return (
    <section id="services" className="services">
      <div className="section-inner">
        <div className="section-header section-header--center section-header--narrow">
          <p className="smallcaps wine-text section-label">— Commissions —</p>
          <h2>
            The Atelier accepts{' '}
            <em className="gold-gradient">work of a kindred dark.</em>
          </h2>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article key={service.num} className="service-card service-card--symmetric">
              <span className="num smallcaps">{service.num}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
