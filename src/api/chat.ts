export type ChatResult =
  | { ok: true; reply: string }
  | { ok: false; message: string }

export async function sendChatMessage(message: string): Promise<ChatResult> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    const data = (await res.json()) as { reply?: string; error?: string }

    if (!res.ok) {
      return { ok: false, message: data.error ?? 'The line to Gate Keeper has gone quiet.' }
    }

    return { ok: true, reply: data.reply ?? '' }
  } catch {
    return {
      ok: false,
      message:
        'Gate Keeper cannot be reached — ensure the atelier\'s correspondence line is running (npm run dev:all).',
    }
  }
}

export async function fetchGateKeeperGreeting(): Promise<string> {
  try {
    const res = await fetch('/api/chat/greeting')
    const data = (await res.json()) as { greeting?: string }
    return data.greeting ?? 'Good evening. I am Gate Keeper — sentinel at this atelier\'s threshold.'
  } catch {
    return 'Good evening. I am Gate Keeper — sentinel at this atelier\'s threshold and keeper of its night correspondence. What shall we illumine?'
  }
}
