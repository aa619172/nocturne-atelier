import { useEffect, useRef, useState, type FormEvent } from 'react'
import { fetchGateKeeperGreeting, sendChatMessage } from '../api/chat'

type Message = {
  id: string
  role: 'user' | 'gatekeeper'
  text: string
}

const SUGGESTIONS = [
  'What is Nocturne Atelier?',
  'Tell me about the catalogue',
  'How do I commission a score?',
  'Open the Listening Room',
]

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function GateKeeperChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [greetingReady, setGreetingReady] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open || greetingReady) return

    let cancelled = false

    fetchGateKeeperGreeting().then((greeting) => {
      if (cancelled) return
      setMessages([{ id: createId(), role: 'gatekeeper', text: greeting }])
      setGreetingReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [open, greetingReady])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    setInput('')
    setMessages((prev) => [...prev, { id: createId(), role: 'user', text: trimmed }])
    setLoading(true)

    const result = await sendChatMessage(trimmed)

    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: 'gatekeeper',
        text: result.ok ? result.reply : result.message,
      },
    ])
    setLoading(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void sendMessage(input)
  }

  return (
    <>
      <button
        type="button"
        className="gatekeeper-fab"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="gatekeeper-panel"
        aria-label="Speak with Gate Keeper, sentinel at the threshold"
        title="Speak with Gate Keeper"
      >
        <span className="gatekeeper-fab__sigil" aria-hidden="true">
          G
        </span>
      </button>

      {open && (
        <div
          id="gatekeeper-panel"
          className="gatekeeper-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gatekeeper-panel-title"
        >
          <div className="gatekeeper-panel__header">
            <div>
              <h2 id="gatekeeper-panel-title" className="smallcaps gold-text">
                Gate Keeper
              </h2>
              <p className="gatekeeper-panel__subtitle smallcaps muted-text">
                Keeper of the Threshold
              </p>
            </div>
            <button
              type="button"
              className="gatekeeper-panel__close"
              onClick={() => setOpen(false)}
              aria-label="Close conversation with Gate Keeper"
            >
              ✕
            </button>
          </div>

          <div className="gatekeeper-panel__messages" ref={scrollRef} aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`gatekeeper-message gatekeeper-message--${message.role}`}
              >
                {message.role === 'gatekeeper' && (
                  <span className="gatekeeper-message__name smallcaps" aria-hidden="true">
                    Gate Keeper
                  </span>
                )}
                <p className="gatekeeper-message__text">{message.text}</p>
              </div>
            ))}

            {loading && (
              <div className="gatekeeper-message gatekeeper-message--gatekeeper" aria-busy="true">
                <span className="gatekeeper-message__name smallcaps" aria-hidden="true">
                  Gate Keeper
                </span>
                <p className="gatekeeper-message__text gatekeeper-message__text--pending">
                  <span className="gatekeeper-typing" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  <span className="sr-only">Gate Keeper is composing a reply</span>
                </p>
              </div>
            )}
          </div>

          {messages.length <= 1 && !loading && (
            <div className="gatekeeper-panel__suggestions" aria-label="Suggested questions">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="gatekeeper-suggestion smallcaps"
                  onClick={() => void sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <form className="gatekeeper-panel__form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="gatekeeper-input">
              Message to Gate Keeper
            </label>
            <input
              id="gatekeeper-input"
              ref={inputRef}
              type="text"
              className="gatekeeper-panel__input"
              placeholder="Ask of the catalogue, commissions…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
            <button type="submit" className="btn gatekeeper-panel__send smallcaps" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}

      {open && (
        <button
          type="button"
          className="gatekeeper-backdrop"
          aria-label="Close conversation with Gate Keeper"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
