/**
 * Wspólny model wiadomości – używany w formularzu oraz jako kontrakt z backendem.
 */
export type ContactPayload = {
  firstName: string
  lastName: string
  phone: string
  email: string
  message: string
}

export type ContactFormFieldName = keyof ContactPayload

export type ContactFormErrors = Partial<Record<ContactFormFieldName, string>>

export type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

/** Odpowiedź zwracana przez `POST /api/contact`. */
export type ContactResponse = {
  ok: boolean
  message: string
}
