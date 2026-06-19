import { useEffect } from 'react'

const ALLOW_CONTEXT_MENU = 'input, textarea, select, [data-allow-context-menu]'

function isAllowedTarget(target: EventTarget | null) {
  return target instanceof Element && target.closest(ALLOW_CONTEXT_MENU)
}

function blockContextMenu(event: MouseEvent) {
  if (isAllowedTarget(event.target)) return
  event.preventDefault()
}

function blockDrag(event: DragEvent) {
  if (event.target instanceof HTMLImageElement || event.target instanceof HTMLAudioElement) {
    event.preventDefault()
  }
}

function blockCopy(event: ClipboardEvent) {
  if (isAllowedTarget(event.target)) return
  event.preventDefault()
}

function blockKeys(event: KeyboardEvent) {
  if (isAllowedTarget(event.target)) return

  const key = event.key.toLowerCase()
  const mod = event.ctrlKey || event.metaKey

  if (key === 'f12') {
    event.preventDefault()
    return
  }

  if (event.key === 'PrintScreen') {
    event.preventDefault()
    void navigator.clipboard?.writeText('').catch(() => {})
    return
  }

  if (!mod) return

  if (event.shiftKey && ['i', 'j', 'c', 'k'].includes(key)) {
    event.preventDefault()
    return
  }

  if (['u', 's', 'p', 'c', 'a'].includes(key)) {
    event.preventDefault()
  }
}

function syncCaptureShield() {
  const hidden = document.hidden
  document.documentElement.toggleAttribute('data-capture-shield', hidden)
}

export function ContentProtection() {
  useEffect(() => {
    document.documentElement.setAttribute('data-content-protected', 'true')

    document.addEventListener('contextmenu', blockContextMenu)
    document.addEventListener('dragstart', blockDrag)
    document.addEventListener('copy', blockCopy)
    document.addEventListener('cut', blockCopy)
    document.addEventListener('keydown', blockKeys)
    document.addEventListener('visibilitychange', syncCaptureShield)
    window.addEventListener('blur', syncCaptureShield)
    window.addEventListener('focus', syncCaptureShield)

    return () => {
      document.documentElement.removeAttribute('data-content-protected')
      document.documentElement.removeAttribute('data-capture-shield')
      document.removeEventListener('contextmenu', blockContextMenu)
      document.removeEventListener('dragstart', blockDrag)
      document.removeEventListener('copy', blockCopy)
      document.removeEventListener('cut', blockCopy)
      document.removeEventListener('keydown', blockKeys)
      document.removeEventListener('visibilitychange', syncCaptureShield)
      window.removeEventListener('blur', syncCaptureShield)
      window.removeEventListener('focus', syncCaptureShield)
    }
  }, [])

  return null
}
