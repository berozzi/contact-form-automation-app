import { useState, type FormEvent } from 'react'

import { sendContactMessage } from '../api/contact'
import type {
  ContactFormErrors,
  ContactFormFieldName,
  ContactPayload,
  SubmitState,
} from '../types/contact'
import { FormElement } from './FormElement'

const EMPTY_FORM: ContactPayload = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^[+()\d\s-]{7,20}$/

/** Walidacja po stronie klienta – backend i tak waliduje ponownie. */
export function validateContactForm(values: ContactPayload): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!values.firstName.trim()) {
    errors.firstName = 'Podaj imię.'
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Podaj nazwisko.'
  }

  if (!values.phone.trim()) {
    errors.phone = 'Podaj numer telefonu.'
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Numer telefonu wygląda na niepoprawny.'
  }

  if (!values.email.trim()) {
    errors.email = 'Podaj adres e-mail.'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Adres e-mail wygląda na niepoprawny.'
  }

  if (!values.message.trim()) {
    errors.message = 'Napisz wiadomość.'
  } else if (values.message.trim().length < 10) {
    errors.message = 'Wiadomość musi mieć co najmniej 10 znaków.'
  }

  return errors
}

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(EMPTY_FORM)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [feedback, setFeedback] = useState<string>('')

  const isSubmitting = submitState === 'submitting'

  const handleChange = (field: ContactFormFieldName, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateContactForm(values)
    setErrors(nextErrors)
    setFeedback('')

    if (Object.keys(nextErrors).length > 0) {
      setSubmitState('error')
      return
    }

    setSubmitState('submitting')

    try {
      const response = await sendContactMessage({
        ...values,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      })

      setFeedback(response.message)
      setSubmitState('success')
      setValues(EMPTY_FORM)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości.')
      setSubmitState('error')
    }
  }

  return (
    <form
      data-testid="contact-form"
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-5 sm:grid-cols-2"
    >
      <FormElement
        name="firstName"
        label="Imię"
        autoComplete="given-name"
        placeholder="Jan"
        value={values.firstName}
        onChange={(value) => handleChange('firstName', value)}
        error={errors.firstName}
        required
      />

      <FormElement
        name="lastName"
        label="Nazwisko"
        autoComplete="family-name"
        placeholder="Kowalski"
        value={values.lastName}
        onChange={(value) => handleChange('lastName', value)}
        error={errors.lastName}
        required
      />

      <FormElement
        name="phone"
        label="Telefon"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+48 123 456 789"
        value={values.phone}
        onChange={(value) => handleChange('phone', value)}
        error={errors.phone}
        required
      />

      <FormElement
        name="email"
        label="E-mail"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="jan.kowalski@example.com"
        value={values.email}
        onChange={(value) => handleChange('email', value)}
        error={errors.email}
        required
      />

      <FormElement
        as="textarea"
        name="message"
        label="Wiadomość"
        placeholder="W czym możemy pomóc?"
        hint="Minimum 10 znaków."
        rows={6}
        maxLength={2000}
        value={values.message}
        onChange={(value) => handleChange('message', value)}
        error={errors.message}
        className="sm:col-span-2"
        required
      />

      <div className="flex flex-col gap-3 sm:col-span-2">
        <button
          type="submit"
          data-testid="submit-button"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:bg-sky-400 sm:w-auto"
        >
          {isSubmitting ? 'Wysyłanie…' : 'Wyślij wiadomość'}
        </button>

        {feedback && (
          <p
            data-testid="form-feedback"
            role="status"
            aria-live="polite"
            className={
              submitState === 'success'
                ? 'text-sm font-medium text-emerald-600'
                : 'text-sm font-medium text-red-600'
            }
          >
            {feedback}
          </p>
        )}
      </div>
    </form>
  )
}
