import type { ContactPayload, ContactResponse } from '../types/contact'

const API_BASE_URL = 'http://localhost:3000'

export async function sendContactMessage(payload: ContactPayload): Promise<ContactResponse> {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => null)) as ContactResponse | null

  if (!response.ok) {
    throw new Error(data?.message ?? `Serwer zwrócił błąd ${response.status}`)
  }

  return data ?? { ok: true, message: 'Dziękujemy za wiadomość!' }
}
