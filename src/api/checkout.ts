type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; message: string }

export async function createCheckoutSession(itemId: string): Promise<CheckoutResult> {
  try {
    const res = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ itemId }),
    })

    const data = (await res.json()) as { url?: string; error?: string }

    if (!res.ok || !data.url) {
      return { ok: false, message: data.error ?? 'Could not open the secure ledger.' }
    }

    return { ok: true, url: data.url }
  } catch {
    return {
      ok: false,
      message: 'Could not reach the atelier. Is the API running?',
    }
  }
}
