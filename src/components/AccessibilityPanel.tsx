import { useEffect } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'
import type { A11ySettings } from '../context/AccessibilityContext'

const options: { key: keyof A11ySettings; label: string; description: string }[] = [
  {
    key: 'reducedMotion',
    label: 'Reduce motion',
    description: 'Minimize animations and twinkling effects.',
  },
  {
    key: 'highContrast',
    label: 'High contrast',
    description: 'Stronger text and border contrast.',
  },
  {
    key: 'largeText',
    label: 'Larger text',
    description: 'Increase base font size across the site.',
  },
  {
    key: 'underlineLinks',
    label: 'Underline links',
    description: 'Make all links clearly underlined.',
  },
  {
    key: 'enhancedFocus',
    label: 'Enhanced focus',
    description: 'Bold focus rings for keyboard navigation.',
  },
]

export function AccessibilityPanel() {
  const { settings, panelOpen, setPanelOpen, toggle, reset } = useAccessibility()

  useEffect(() => {
    if (!panelOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanelOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panelOpen, setPanelOpen])

  return (
    <>
      <button
        type="button"
        className="a11y-fab"
        onClick={() => setPanelOpen(!panelOpen)}
        aria-expanded={panelOpen}
        aria-controls="a11y-panel"
        aria-label="Accessibility options"
        title="Accessibility options"
      >
        <span aria-hidden="true">♿</span>
      </button>

      {panelOpen && (
        <div
          id="a11y-panel"
          className="a11y-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-panel-title"
        >
          <div className="a11y-panel__header">
            <h2 id="a11y-panel-title" className="smallcaps">
              Accessibility
            </h2>
            <button
              type="button"
              className="a11y-panel__close"
              onClick={() => setPanelOpen(false)}
              aria-label="Close accessibility panel"
            >
              ✕
            </button>
          </div>

          <ul className="a11y-panel__list">
            {options.map((option) => (
              <li key={option.key}>
                <label className="a11y-toggle">
                  <input
                    type="checkbox"
                    checked={settings[option.key]}
                    onChange={() => toggle(option.key)}
                  />
                  <span className="a11y-toggle__text">
                    <strong>{option.label}</strong>
                    <span className="muted-text">{option.description}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <button type="button" className="btn a11y-panel__reset" onClick={reset}>
            Reset options
          </button>
        </div>
      )}

      {panelOpen && (
        <button
          type="button"
          className="a11y-backdrop"
          aria-label="Close accessibility panel"
          onClick={() => setPanelOpen(false)}
        />
      )}
    </>
  )
}
