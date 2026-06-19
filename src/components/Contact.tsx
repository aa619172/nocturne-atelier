import { useState, type FormEvent } from 'react'
import { sendContact } from '../api/contact'

export function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    const result = await sendContact({ name, email, message })

    if (result.ok) {
      setStatus('success')
      setFeedback(result.message)
      setName('')
      setEmail('')
      setMessage('')
    } else {
      setStatus('error')
      setFeedback(result.message)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="section-inner section-inner--contact">
        <p className="smallcaps wine-text contact-label">— Correspondence —</p>
        <h2>
          Write to the <em className="gold-gradient">atelier.</em>
        </h2>
        <p>
          For commissions, licensing, ritual, and slow correspondence. Letters are
          read by candlelight and answered within the fortnight. The house threshold
          stands at{' '}
          <a href="https://nocturneatelier.net/" className="underline-link">
            nocturneatelier.net
          </a>
          .
        </p>

        {status === 'success' ? (
          <p className="contact-success" role="status">
            {feedback}
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={status === 'loading'}
            />
            <input
              type="email"
              placeholder="Your sigil (email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
            />
            <textarea
              rows={4}
              placeholder="The nature of the work…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={status === 'loading'}
            />
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Dispatching…' : 'Send by raven'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="contact-error" role="alert">
            {feedback}
          </p>
        )}
      </div>
    </section>
  )
}
