/** Model wiadomości przesyłanej z formularza kontaktowego. */
export type ContactPayload = {
  firstName: string
  lastName: string
  phone: string
  email: string
  message: string
}

export type ContactFormErrors = Partial<Record<keyof ContactPayload, string>>
