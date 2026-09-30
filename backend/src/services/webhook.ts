import { config } from '../config.js'
import type { ContactPayload } from '../types.js'

type SendResult = {
  delivered: boolean
  reason: string
}

/**
 * Wysyłka wiadomości na webhook.
 *
 * UWAGA: wywołanie `fetch` jest na razie zakomentowane – webhook nie jest jeszcze
 * skonfigurowany. Gdy będzie gotowy, odkomentuj blok poniżej (i usuń sekcję
 * tymczasowego logowania), a funkcja zacznie realnie dostarczać wiadomość.
 */
export async function sendToWebhook(payload: ContactPayload): Promise<SendResult> {
  console.log('[webhook] Wiadomość przygotowana do wysłania:', payload)
  console.log(`[webhook] Docelowy adres: ${config.webhook.url}`)

  // const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  // if (config.webhook.token) {
  //   headers.Authorization = `Bearer ${config.webhook.token}`
  // }

  // try {
  //   const response = await fetch(config.webhook.url, {
  //     method: 'POST',
  //     headers,
  //     body: JSON.stringify(payload),
  //   })
  //
  //   if (!response.ok) {
  //     return { delivered: false, reason: `Webhook zwrócił status ${response.status}` }
  //   }
  //
  //   return { delivered: true, reason: 'Wiadomość dostarczona na webhook.' }
  // } catch (error) {
  //   return {
  //     delivered: false,
  //     reason: error instanceof Error ? error.message : 'Nieznany błąd webhooka',
  //   }
  // }

  // Dopóki `fetch` jest zakomentowany, udajemy dostarczenie, żeby formularz
  // dawał się przetestować w całości (front dostanie 200 z podziękowaniem).
  return { delivered: true, reason: 'Wysyłka na webhook jest tymczasowo zasymulowana.' }
}
