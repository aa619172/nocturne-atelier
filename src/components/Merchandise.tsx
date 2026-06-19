import { useState } from 'react'
import { merchandiseCategories } from '../data/site'
import { createCheckoutSession } from '../api/checkout'

export function Merchandise() {
  const [checkoutItemId, setCheckoutItemId] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleAcquire = async (itemId: string) => {
    setCheckoutItemId(itemId)
    setCheckoutError(null)

    const result = await createCheckoutSession(itemId)

    if (result.ok) {
      window.location.href = result.url
      return
    }

    setCheckoutError(result.message)
    setCheckoutItemId(null)
  }

  return (
    <section id="reliquary" className="reliquary">
      <div className="section-inner">
        <div className="section-header section-header--center section-header--narrow">
          <p className="smallcaps wine-text section-label">— The Reliquary —</p>
          <h2>
            House wares for the{' '}
            <em className="gold-gradient">candle-watch.</em>
          </h2>
          <p className="muted-text reliquary-intro">
            Vestments, talismans, and bound words — wrought for those who keep
            vigil in the half-light. Secure checkout via Stripe; guest acquisition
            is permitted.
          </p>
          {checkoutError && (
            <p className="reliquary-checkout-error" role="alert">
              {checkoutError}
            </p>
          )}
        </div>

        {merchandiseCategories.map((category) => (
          <div key={category.id} className="merch-category">
            <div className="merch-category-header">
              <span className="font-mono gold-text merch-category-num">{category.num}</span>
              <h3>{category.title}</h3>
              <p className="smallcaps muted-text">{category.description}</p>
            </div>

            <div className="merch-grid">
              {category.items.map((item) => (
                <article key={item.id} className="merch-card merch-card--symmetric">
                  <div className="merch-card__image">
                    <img src={item.imageSrc} alt="" loading="lazy" width={400} height={400} />
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <span className="merch-price smallcaps gold-text">{item.price} · denarii</span>
                  <button
                    type="button"
                    className="merch-acquire smallcaps"
                    disabled={checkoutItemId === item.id}
                    onClick={() => handleAcquire(item.id)}
                  >
                    {checkoutItemId === item.id ? 'Opening ledger…' : 'Acquire'}
                  </button>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
