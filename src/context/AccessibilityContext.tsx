import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type A11ySettings = {
  reducedMotion: boolean
  highContrast: boolean
  largeText: boolean
  underlineLinks: boolean
  enhancedFocus: boolean
}

type A11yContextValue = {
  settings: A11ySettings
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
  toggle: (key: keyof A11ySettings) => void
  reset: () => void
}

const STORAGE_KEY = 'nocturne-a11y'

const defaults: A11ySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  underlineLinks: false,
  enhancedFocus: false,
}

const A11yContext = createContext<A11yContextValue | null>(null)

function loadSettings(): A11ySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaults, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { ...defaults, reducedMotion: true }
  }
  return defaults
}

function applySettings(settings: A11ySettings) {
  const root = document.documentElement
  root.dataset.reducedMotion = settings.reducedMotion ? 'true' : 'false'
  root.dataset.highContrast = settings.highContrast ? 'true' : 'false'
  root.dataset.largeText = settings.largeText ? 'true' : 'false'
  root.dataset.underlineLinks = settings.underlineLinks ? 'true' : 'false'
  root.dataset.enhancedFocus = settings.enhancedFocus ? 'true' : 'false'
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(() => {
    const initial = loadSettings()
    applySettings(initial)
    return initial
  })
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    applySettings(settings)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const toggle = useCallback((key: keyof A11ySettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const reset = useCallback(() => {
    setSettings(defaults)
  }, [])

  return (
    <A11yContext.Provider value={{ settings, panelOpen, setPanelOpen, toggle, reset }}>
      {children}
    </A11yContext.Provider>
  )
}

export function useAccessibility() {
  const ctx = useContext(A11yContext)
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider')
  return ctx
}
