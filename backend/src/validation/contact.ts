import type { ContactFormErrors, ContactPayload } from '../types.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^[+()\d\s-]{7,20}$/

const MAX_MESSAGE_LENGTH = 2000

/** Zwraca wytrenowany obiekt albo mapę błędów walidacyjnych. */
export function parseContactPayload(body: unknown):
  | { ok: true; value: ContactPayload }
  | { ok: false; errors: ContactFormErrors } {
  const errors: ContactFormErrors = {}

  if (typeof body !== 'object' || body === null) {
    return { ok: false, errors: { message: 'Nieprawidłowe dane formularza.' } }
  }

  const raw = body as Record<string, unknown>

  const readString = (key: keyof ContactPayload): string =>
    typeof raw[key] === 'string' ? (raw[key] as string).trim() : ''

  const firstName = readString('firstName')
  const lastName = readString('lastName')
  const phone = readString('phone')
  const email = readString('email')
  const message = readString('message')

  if (!firstName) errors.firstName = 'Podaj imię.'
  if (!lastName) errors.lastName = 'Podaj nazwisko.'

  if (!phone) {
    errors.phone = 'Podaj numer telefonu.'
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = 'Numer telefonu wygląda na niepoprawny.'
  }

  if (!email) {
    errors.email = 'Podaj adres e-mail.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Adres e-mail wygląda na niepoprawny.'
  }

  if (!message) {
    errors.message = 'Napisz wiadomość.'
  } else if (message.length < 10) {
    errors.message = 'Wiadomość musi mieć co najmniej 10 znaków.'
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Wiadomość może mieć maksymalnie ${MAX_MESSAGE_LENGTH} znaków.`
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  return { ok: true, value: { firstName, lastName, phone, email, message } }
}
