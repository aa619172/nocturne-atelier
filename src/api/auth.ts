export type AuthUser = {
  id: number
  email: string
  name: string
  totpEnabled: boolean
  createdAt: string
}

type AuthResult =
  | { ok: true; user: AuthUser; message?: string; requires2FA?: false }
  | { ok: true; requires2FA: true; pendingToken: string; message?: string }
  | { ok: false; message: string }

type Setup2FAResult =
  | { ok: true; qrDataUrl: string; secret: string; message?: string }
  | { ok: false; message: string }

const jsonHeaders = { 'Content-Type': 'application/json' }

async function parseAuthResponse(res: Response): Promise<AuthResult> {
  const data = (await res.json()) as {
    error?: string
    message?: string
    user?: AuthUser
    requires2FA?: boolean
    pendingToken?: string
  }

  if (!res.ok) {
    return { ok: false, message: data.error ?? 'The threshold refused entry.' }
  }

  if (data.requires2FA && data.pendingToken) {
    return {
      ok: true,
      requires2FA: true,
      pendingToken: data.pendingToken,
      message: data.message,
    }
  }

  if (data.user) {
    return { ok: true, user: data.user, message: data.message, requires2FA: false }
  }

  return { ok: false, message: data.error ?? 'Unexpected response from the threshold.' }
}

export async function register(payload: {
  name: string
  email: string
  password: string
}): Promise<AuthResult> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    return parseAuthResponse(res)
  } catch {
    return { ok: false, message: 'Could not reach the atelier. Is the API running?' }
  }
}

export async function login(payload: {
  email: string
  password: string
}): Promise<AuthResult> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: jsonHeaders,
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    return parseAuthResponse(res)
  } catch {
    return { ok: false, message: 'Could not reach the atelier. Is the API running?' }
  }
}

export async function verify2FALogin(payload: {
  pendingToken: string
  token: string
}): Promise<AuthResult> {
  try {
    const res = await fetch('/api/auth/2fa/login', {
      method: 'POST',
      headers: jsonHeaders,
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    return parseAuthResponse(res)
  } catch {
    return { ok: false, message: 'Could not verify the second seal.' }
  }
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' })
    if (!res.ok) return null
    const data = (await res.json()) as { user?: AuthUser }
    return data.user ?? null
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
}

export async function setup2FA(): Promise<Setup2FAResult> {
  try {
    const res = await fetch('/api/auth/2fa/setup', {
      method: 'POST',
      credentials: 'include',
    })
    const data = (await res.json()) as {
      error?: string
      message?: string
      qrDataUrl?: string
      secret?: string
    }
    if (!res.ok || !data.qrDataUrl || !data.secret) {
      return { ok: false, message: data.error ?? 'Could not begin two-factor setup.' }
    }
    return {
      ok: true,
      qrDataUrl: data.qrDataUrl,
      secret: data.secret,
      message: data.message,
    }
  } catch {
    return { ok: false, message: 'Could not begin two-factor setup.' }
  }
}

export async function confirm2FA(token: string): Promise<AuthResult> {
  try {
    const res = await fetch('/api/auth/2fa/verify', {
      method: 'POST',
      headers: jsonHeaders,
      credentials: 'include',
      body: JSON.stringify({ token }),
    })
    return parseAuthResponse(res)
  } catch {
    return { ok: false, message: 'Could not bind the second seal.' }
  }
}
