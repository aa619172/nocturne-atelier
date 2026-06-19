import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  confirm2FA,
  fetchCurrentUser,
  login,
  logout,
  register,
  setup2FA,
  verify2FALogin,
  type AuthUser,
} from '../api/auth'

type AuthModalView = 'signin' | 'signup' | '2fa-login' | '2fa-setup' | '2fa-verify'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  modalOpen: boolean
  modalView: AuthModalView
  pendingToken: string | null
  qrDataUrl: string | null
  totpSecret: string | null
  feedback: string | null
  openModal: (view?: AuthModalView) => void
  closeModal: () => void
  setModalView: (view: AuthModalView) => void
  signUp: (payload: { name: string; email: string; password: string }) => Promise<boolean>
  signIn: (payload: { email: string; password: string }) => Promise<boolean>
  complete2FALogin: (token: string) => Promise<boolean>
  begin2FASetup: () => Promise<boolean>
  verify2FASetup: (token: string) => Promise<boolean>
  signOut: () => Promise<void>
  clearFeedback: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalView, setModalView] = useState<AuthModalView>('signin')
  const [pendingToken, setPendingToken] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [totpSecret, setTotpSecret] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    fetchCurrentUser().then((current) => {
      setUser(current)
      setLoading(false)
    })
  }, [])

  const openModal = useCallback((view: AuthModalView = 'signin') => {
    setModalView(view)
    setModalOpen(true)
    setFeedback(null)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setPendingToken(null)
    setQrDataUrl(null)
    setTotpSecret(null)
    setFeedback(null)
  }, [])

  const clearFeedback = useCallback(() => setFeedback(null), [])

  const signUp = useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      const result = await register(payload)
      if (!result.ok) {
        setFeedback(result.message)
        return false
      }
      if ('user' in result) {
        setUser(result.user)
      }
      setFeedback(result.message ?? 'Welcome to the threshold.')
      return true
    },
    [],
  )

  const signIn = useCallback(async (payload: { email: string; password: string }) => {
    const result = await login(payload)
    if (!result.ok) {
      setFeedback(result.message)
      return false
    }
    if (result.requires2FA) {
      setPendingToken(result.pendingToken)
      setModalView('2fa-login')
      setFeedback(result.message ?? 'Present the second seal.')
      return false
    }
    if ('user' in result) {
      setUser(result.user)
    }
    setFeedback(result.message ?? 'Welcome back.')
    return true
  }, [])

  const complete2FALogin = useCallback(
    async (token: string) => {
      if (!pendingToken) {
        setFeedback('Session expired. Sign in again.')
        setModalView('signin')
        return false
      }
      const result = await verify2FALogin({ pendingToken, token })
      if (!result.ok) {
        setFeedback(result.message)
        return false
      }
      if (!('user' in result)) {
        setFeedback('Unexpected response from the threshold.')
        return false
      }
      setUser(result.user)
      setPendingToken(null)
      setFeedback(result.message ?? 'Both seals verified.')
      return true
    },
    [pendingToken],
  )

  const begin2FASetup = useCallback(async () => {
    const result = await setup2FA()
    if (!result.ok) {
      setFeedback(result.message)
      return false
    }
    setQrDataUrl(result.qrDataUrl)
    setTotpSecret(result.secret)
    setModalView('2fa-verify')
    setFeedback(result.message ?? 'Scan the sigil, then confirm.')
    return true
  }, [])

  const verify2FASetup = useCallback(async (token: string) => {
    const result = await confirm2FA(token)
    if (!result.ok) {
      setFeedback(result.message)
      return false
    }
    if (!('user' in result)) {
      setFeedback('Unexpected response from the threshold.')
      return false
    }
    setUser(result.user)
    setQrDataUrl(null)
    setTotpSecret(null)
    setFeedback(result.message ?? 'Second seal bound.')
    return true
  }, [])

  const signOut = useCallback(async () => {
    await logout()
    setUser(null)
    closeModal()
  }, [closeModal])

  const value = useMemo(
    () => ({
      user,
      loading,
      modalOpen,
      modalView,
      pendingToken,
      qrDataUrl,
      totpSecret,
      feedback,
      openModal,
      closeModal,
      setModalView,
      signUp,
      signIn,
      complete2FALogin,
      begin2FASetup,
      verify2FASetup,
      signOut,
      clearFeedback,
    }),
    [
      user,
      loading,
      modalOpen,
      modalView,
      pendingToken,
      qrDataUrl,
      totpSecret,
      feedback,
      openModal,
      closeModal,
      signUp,
      signIn,
      complete2FALogin,
      begin2FASetup,
      verify2FASetup,
      signOut,
      clearFeedback,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
