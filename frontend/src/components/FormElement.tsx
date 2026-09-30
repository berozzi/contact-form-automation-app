import { type ChangeEvent, type ReactNode } from 'react'

type CommonProps = {
  /** Nazwa pola – trafia do atrybutu `name` oraz `data-testid`. */
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: ReactNode
  required?: boolean
  placeholder?: string
  disabled?: boolean
  autoComplete?: string
  inputMode?: 'text' | 'tel' | 'email' | 'url'
  className?: string
}

type InputElementProps = CommonProps & {
  as?: 'input'
  type?: 'text' | 'tel' | 'email'
  maxLength?: number
}

type TextareaElementProps = CommonProps & {
  as: 'textarea'
  rows?: number
  maxLength?: number
}

export type FormElementProps = InputElementProps | TextareaElementProps

/**
 * Jedyny komponent odpowiedzialny za wygląd pola formularza.
 * Dzięki niemu wszystkie pola (input / textarea) wyglądają identycznie,
 * a w testach można się do nich odwoływać przez `data-testid={name}`.
 */
export function FormElement(props: FormElementProps) {
  const {
    name,
    label,
    value,
    onChange,
    error,
    hint,
    required = false,
    placeholder,
    disabled = false,
    autoComplete,
    className = '',
  } = props

  const inputId = `field-${name}`
  const describedById = `${inputId}-helper`

  const hasError = Boolean(error)

  const baseControlClasses = [
    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm',
    'transition-colors placeholder:text-slate-400',
    'focus:outline-none focus:ring-4',
    'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500',
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15'
      : 'border-slate-300 hover:border-slate-400 focus:border-sky-500 focus:ring-sky-500/15',
  ].join(' ')

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  const describedBy = error || hint ? describedById : undefined

  return (
    <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-red-500">
            *
          </span>
        )}
      </label>

      {props.as === 'textarea' ? (
        <textarea
          id={inputId}
          data-testid={name}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={props.rows ?? 5}
          maxLength={props.maxLength}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={`${baseControlClasses} resize-y min-h-28`}
        />
      ) : (
        <input
          id={inputId}
          data-testid={name}
          name={name}
          type={props.type ?? 'text'}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          inputMode={props.inputMode}
          maxLength={props.maxLength}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={baseControlClasses}
        />
      )}

      {error ? (
        <p
          id={describedById}
          data-testid={`${name}-error`}
          role="alert"
          className="text-xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={describedById} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
