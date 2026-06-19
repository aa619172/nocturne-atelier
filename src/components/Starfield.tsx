import { useEffect, useRef } from 'react'

export function Starfield() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const render = () => {
      container.innerHTML = ''
      const reduced = document.documentElement.dataset.reducedMotion === 'true'
      const count = reduced ? 20 : 60

      for (let i = 0; i < count; i++) {
        const star = document.createElement('span')
        star.className = 'star'
        star.style.top = `${(i * 53) % 100}%`
        star.style.left = `${(i * 37) % 100}%`
        const size = `${(i % 3) + 1}px`
        star.style.width = size
        star.style.height = size
        if (!reduced) star.style.animationDelay = `${(i % 7) * 0.6}s`
        container.appendChild(star)
      }
    }

    render()

    const observer = new MutationObserver(render)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-reduced-motion'],
    })

    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className="starfield" aria-hidden="true" />
}
