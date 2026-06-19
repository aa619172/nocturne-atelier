import { useCallback, useId, useState, type CSSProperties, type ReactNode } from 'react'
import { tarotCards, type TarotCard } from '../data/site'
import { useAccessibility } from '../context/AccessibilityContext'
import { Logo } from './Logo'
import { TarotIllustration } from './TarotArt'

function pickRandomCard(excludeId?: string): TarotCard {
  const pool = excludeId ? tarotCards.filter((c) => c.id !== excludeId) : tarotCards
  return pool[Math.floor(Math.random() * pool.length)] ?? tarotCards[0]
}

function BaroqueCorner({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 54 C2 32 12 16 54 2"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
      <path
        d="M6 50 C6 34 14 20 48 6"
        stroke="currentColor"
        strokeWidth="0.55"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M10 44 C10 30 18 18 42 10"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M14 36 Q22 26 30 30 Q38 34 32 42 Q26 48 18 40"
        stroke="currentColor"
        strokeWidth="0.55"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M20 24 Q26 18 32 22 Q38 26 34 32 Q30 36 24 30"
        stroke="currentColor"
        strokeWidth="0.45"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M26 16 Q30 12 34 16 Q38 20 34 24 Q30 26 26 22"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M8 20 C12 14 18 12 24 14"
        stroke="currentColor"
        strokeWidth="0.35"
        strokeLinecap="round"
        opacity="0.4"
      />
      <circle cx="10" cy="10" r="1.4" fill="currentColor" opacity="0.55" />
      <circle cx="18" cy="16" r="0.85" fill="currentColor" opacity="0.4" />
      <circle cx="24" cy="8" r="0.6" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

function BaroqueMedallion({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="0.35" opacity="0.35" />
      <path
        d="M12 4 L13 8 L17 8 L14 10.5 L15 14.5 L12 12.5 L9 14.5 L10 10.5 L7 8 L11 8 Z"
        stroke="currentColor"
        strokeWidth="0.35"
        fill="currentColor"
        opacity="0.25"
      />
    </svg>
  )
}

function FleurDeLis({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 2 L11 8 L10 22 M10 8 L6 12 L10 14 M10 8 L14 12 L10 14"
        stroke="currentColor"
        strokeWidth="0.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 10 Q10 6 13 10"
        stroke="currentColor"
        strokeWidth="0.4"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

function BeadChain({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 4 H120"
        stroke="currentColor"
        strokeWidth="0.35"
        opacity="0.35"
      />
      {[8, 20, 32, 44, 56, 68, 80, 92, 104, 112].map((x) => (
        <circle key={x} cx={x} cy="4" r="1.1" fill="currentColor" opacity="0.45" />
      ))}
    </svg>
  )
}

function BaroqueEdge({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 7 H24 M28 7 Q36 2.5 40 7 Q44 11.5 52 7 H80"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M32 7 Q36 4.5 40 7 Q44 9.5 48 7"
        stroke="currentColor"
        strokeWidth="0.35"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M36 7 L38 5 L40 7 L42 5 L44 7"
        stroke="currentColor"
        strokeWidth="0.3"
        strokeLinecap="round"
        opacity="0.35"
      />
      <circle cx="40" cy="7" r="1.15" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

function CardBaroqueFrame({ children, variant = 'front' }: { children: ReactNode; variant?: 'front' | 'back' }) {
  return (
    <div className={`arcanum-card__frame arcanum-card__frame--${variant}`}>
      <BaroqueCorner className="arcanum-card__corner arcanum-card__corner--tl" />
      <BaroqueCorner className="arcanum-card__corner arcanum-card__corner--tr" />
      <BaroqueCorner className="arcanum-card__corner arcanum-card__corner--bl" />
      <BaroqueCorner className="arcanum-card__corner arcanum-card__corner--br" />
      <BaroqueMedallion className="arcanum-card__medallion arcanum-card__medallion--tl" />
      <BaroqueMedallion className="arcanum-card__medallion arcanum-card__medallion--tr" />
      <BaroqueMedallion className="arcanum-card__medallion arcanum-card__medallion--bl" />
      <BaroqueMedallion className="arcanum-card__medallion arcanum-card__medallion--br" />
      <FleurDeLis className="arcanum-card__fleur arcanum-card__fleur--top" />
      <FleurDeLis className="arcanum-card__fleur arcanum-card__fleur--bottom" />
      <BeadChain className="arcanum-card__beads arcanum-card__beads--top" />
      <BeadChain className="arcanum-card__beads arcanum-card__beads--bottom" />
      <BaroqueEdge className="arcanum-card__edge arcanum-card__edge--top" />
      <BaroqueEdge className="arcanum-card__edge arcanum-card__edge--bottom" />
      <BaroqueEdge className="arcanum-card__edge arcanum-card__edge--left" />
      <BaroqueEdge className="arcanum-card__edge arcanum-card__edge--right" />
      <div className="arcanum-card__rule arcanum-card__rule--h" aria-hidden="true" />
      <div className="arcanum-card__rule arcanum-card__rule--v" aria-hidden="true" />
      <div className="arcanum-card__frame-inner">{children}</div>
    </div>
  )
}

function CardBack() {
  return (
    <div className="arcanum-card__face arcanum-card__back" aria-hidden="true">
      <CardBaroqueFrame variant="back">
        <div className="arcanum-card__back-panel">
          <Logo className="arcanum-card__logo" alt="" />
        </div>
      </CardBaroqueFrame>
    </div>
  )
}

function CardFront({ card }: { card: TarotCard }) {
  return (
    <div className="arcanum-card__face arcanum-card__front">
      <CardBaroqueFrame variant="front">
        <span className="font-mono gold-text arcanum-card__num">{card.num}</span>
        <div className="arcanum-card__art-panel">
          <TarotIllustration cardId={card.id} className="arcanum-card__art" />
        </div>
        <div className="arcanum-card__title-block">
          <span className="arcanum-card__divider" aria-hidden="true" />
          <h3 className="smallcaps arcanum-card__title">{card.title}</h3>
          <span className="arcanum-card__symbol-label">{card.symbol}</span>
        </div>
      </CardBaroqueFrame>
    </div>
  )
}

export function Arcanum() {
  const { settings } = useAccessibility()
  const reducedMotion = settings.reducedMotion
  const readingId = useId()

  const [drawn, setDrawn] = useState<TarotCard | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [shuffling, setShuffling] = useState(false)

  const draw = useCallback(() => {
    if (shuffling) return

    const next = pickRandomCard(drawn?.id)
    setFlipped(false)
    setDrawn(next)

    if (reducedMotion) {
      setFlipped(true)
      return
    }

    setShuffling(true)
    window.setTimeout(() => {
      setShuffling(false)
      requestAnimationFrame(() => setFlipped(true))
    }, 700)
  }, [drawn?.id, reducedMotion, shuffling])

  const reset = useCallback(() => {
    setFlipped(false)
    setDrawn(null)
    setShuffling(false)
  }, [])

  const canDraw = !flipped && !shuffling

  return (
    <section id="arcanum" className="arcanum" aria-labelledby="arcanum-heading">
      <div className="symmetry-rule" aria-hidden="true">
        <span className="symmetry-rule__line" />
        <span className="symmetry-rule__diamond">◆</span>
        <span className="symmetry-rule__line" />
      </div>

      <div className="section-inner section-inner--narrow">
        <div className="section-header section-header--center">
          <p className="smallcaps wine-text section-label">— The Arcanum —</p>
          <h2 id="arcanum-heading">
            Candle-draw from the{' '}
            <em className="gold-gradient">hidden manuscript.</em>
          </h2>
          <p className="muted-text arcanum-intro">
            Twelve Major Arcana from the house deck — draw one card and read what the
            half-light would whisper to a listener at vigil.
          </p>
        </div>

        <div className="arcanum-stage">
          <div
            className={`arcanum-deck ${shuffling ? 'arcanum-deck--shuffling' : ''}`}
            aria-hidden="true"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="arcanum-deck__card"
                style={{ '--deck-index': i } as CSSProperties}
              >
                <CardBack />
              </div>
            ))}
          </div>

          <div className="arcanum-draw">
            <button
              type="button"
              className="arcanum-card"
              onClick={canDraw ? draw : undefined}
              disabled={!canDraw}
              aria-label={
                flipped && drawn
                  ? `${drawn.title} revealed`
                  : 'Draw a card from the Arcanum deck'
              }
              aria-describedby={flipped && drawn ? readingId : undefined}
            >
              <div
                className={`arcanum-card__inner ${flipped ? 'arcanum-card__inner--flipped' : ''}`}
              >
                <CardBack />
                {drawn && <CardFront card={drawn} />}
              </div>
            </button>

            <div className="arcanum-controls">
              {canDraw ? (
                <button
                  type="button"
                  className="btn smallcaps arcanum-draw-btn"
                  onClick={draw}
                  disabled={shuffling}
                >
                  {shuffling ? 'Shuffling…' : 'Draw a card'}
                </button>
              ) : (
                <button type="button" className="btn smallcaps arcanum-draw-btn" onClick={reset}>
                  Draw again
                </button>
              )}
            </div>

            {drawn && flipped && (
              <div id={readingId} className="arcanum-reading" aria-live="polite">
                <p className="smallcaps wine-text arcanum-reading__label">— Reading —</p>
                <h3 className="arcanum-reading__title">{drawn.title}</h3>
                <p className="arcanum-reading__meaning">{drawn.meaning}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
