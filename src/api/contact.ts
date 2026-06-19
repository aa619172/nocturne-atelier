type ContactPayload = {
  name: string
  email: string
  message: string
}

type ContactResult =
  | { ok: true; message: string }
  | { ok: false; message: string }

export async function sendContact(payload: ContactPayload): Promise<ContactResult> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = (await res.json()) as { message?: string; error?: string }

    if (!res.ok) {
      return { ok: false, message: data.error ?? 'Your raven could not be dispatched.' }
    }

    return { ok: true, message: data.message ?? 'Your raven has been dispatched.' }
  } catch {
    return {
      ok: false,
      message: 'Could not reach the atelier. Is the API running?',
    }
  }
}
