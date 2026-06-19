import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

export function AuthModal() {
  const {
    user,
    modalOpen,
    modalView,
    feedback,
    qrDataUrl,
    totpSecret,
    closeModal,
    setModalView,
    signUp,
    signIn,
    complete2FALogin,
    begin2FASetup,
    verify2FASetup,
    signOut,
    clearFeedback,
  } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, closeModal])

  useEffect(() => {
    if (!modalOpen) {
      setName('')
      setEmail('')
      setPassword('')
      setTotpCode('')
      setBusy(false)
    }
  }, [modalOpen])

  if (!modalOpen) return null

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    clearFeedback()
    const ok = await signUp({ name, email, password })
    setBusy(false)
    if (ok) closeModal()
  }

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    clearFeedback()
    const ok = await signIn({ email, password })
    setBusy(false)
    if (ok) closeModal()
  }

  const handle2FALogin = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    clearFeedback()
    const ok = await complete2FALogin(totpCode)
    setBusy(false)
    if (ok) closeModal()
  }

  const handle2FAVerify = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    clearFeedback()
    const ok = await verify2FASetup(totpCode)
    setBusy(false)
    if (ok) closeModal()
  }

  const title =
    modalView === 'signup'
      ? 'Inscribe your name'
      : modalView === '2fa-login'
        ? 'Present the second seal'
        : modalView === '2fa-setup' || modalView === '2fa-verify'
          ? 'Bind the second seal'
          : user
            ? 'The Threshold'
            : 'Cross the threshold'

  return (
    <>
      <button type="button" className="threshold-backdrop" aria-label="Close" onClick={closeModal} />
      <div
        className="threshold-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="threshold-title"
        data-allow-context-menu
      >
        <header className="threshold-panel__header">
          <div>
            <p className="smallcaps wine-text threshold-panel__label">— The Threshold —</p>
            <h2 id="threshold-title">{title}</h2>
            {user && modalView === 'signin' && (
              <p className="threshold-panel__subtitle muted-text">
                Signed in as {user.name} · {user.email}
              </p>
            )}
          </div>
          <button type="button" className="threshold-panel__close smallcaps" onClick={closeModal}>
            Close
          </button>
        </header>

        <div className="threshold-panel__body">
          {feedback && (
            <p
              className={`threshold-feedback ${feedback.toLowerCase().includes('not') || feedback.toLowerCase().includes('could') || feedback.toLowerCase().includes('refused') || feedback.toLowerCase().includes('recognized') ? 'threshold-feedback--error' : ''}`}
              role="status"
            >
              {feedback}
            </p>
          )}

          {user && modalView === 'signin' ? (
            <div className="threshold-account">
              <p className="muted-text">
                {user.totpEnabled
                  ? 'Your account is warded with two-factor authentication.'
                  : 'Fortify your account with a second seal from an authenticator app.'}
              </p>
              {!user.totpEnabled && (
                <button
                  type="button"
                  className="threshold-submit"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true)
                    clearFeedback()
                    await begin2FASetup()
                    setBusy(false)
                  }}
                >
                  Bind two-factor seal
                </button>
              )}
              <button type="button" className="threshold-link" onClick={() => signOut()}>
                Depart the threshold
              </button>
            </div>
          ) : modalView === 'signup' ? (
            <form className="threshold-form" onSubmit={handleSignUp}>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={busy}
              />
              <input
                type="email"
                placeholder="Your sigil (email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy}
              />
              <input
                type="password"
                placeholder="Passphrase (8+ characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={busy}
              />
              <button type="submit" className="threshold-submit" disabled={busy}>
                {busy ? 'Inscribing…' : 'Inscribe upon the ledger'}
              </button>
              <button
                type="button"
                className="threshold-link"
                onClick={() => {
                  clearFeedback()
                  setModalView('signin')
                }}
              >
                Already inscribed? Enter instead
              </button>
            </form>
          ) : modalView === '2fa-login' ? (
            <form className="threshold-form" onSubmit={handle2FALogin}>
              <p className="muted-text">
                Enter the six-digit code from your authenticator to complete entry.
              </p>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Authenticator code"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                required
                disabled={busy}
              />
              <button type="submit" className="threshold-submit" disabled={busy}>
                {busy ? 'Verifying…' : 'Present second seal'}
              </button>
            </form>
          ) : modalView === '2fa-verify' ? (
            <form className="threshold-form" onSubmit={handle2FAVerify}>
              {qrDataUrl && (
                <div className="threshold-qr">
                  <img src={qrDataUrl} alt="Scan with authenticator app" width={180} height={180} />
                </div>
              )}
              {totpSecret && (
                <p className="smallcaps muted-text threshold-secret">
                  Manual key: <span className="gold-text">{totpSecret}</span>
                </p>
              )}
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Confirm with authenticator code"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                required
                disabled={busy}
              />
              <button type="submit" className="threshold-submit" disabled={busy}>
                {busy ? 'Binding…' : 'Bind second seal'}
              </button>
            </form>
          ) : (
            <form className="threshold-form" onSubmit={handleSignIn}>
              <input
                type="email"
                placeholder="Your sigil (email)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy}
              />
              <input
                type="password"
                placeholder="Passphrase"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={busy}
              />
              <button type="submit" className="threshold-submit" disabled={busy}>
                {busy ? 'Opening…' : 'Enter the threshold'}
              </button>
              <button
                type="button"
                className="threshold-link"
                onClick={() => {
                  clearFeedback()
                  setModalView('signup')
                }}
              >
                Not yet inscribed? Sign up
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
