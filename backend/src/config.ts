/**
 * Konfiguracja aplikacji.
 * UWAGA: adresy webhooka są na razie wpisane wprost w kod (bez sekretów).
 * Gdy przyjdzie czas na produkcję – przenieś je do zmiennych środowiskowych.
 */
export const config = {
  port: 3000,

  /** Adresy źródłowe CORS – frontend w trybie dev. */
  corsOrigins: ['http://localhost:5173', 'http://127.0.0.1:5173'] as string[],

  /** Webhook, na który wysyłana jest wiadomość z formularza. */
  webhook: {
    url: 'https://example.com/webhooks/contact-form',
    // Opcjonalny nagłówek autoryzacyjny – na razie pusty.
    token: '',
  },
} as const
