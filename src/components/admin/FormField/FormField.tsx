import { cloneElement, isValidElement, type ReactElement } from 'react'

// Wires a label, an input, a hint and an error together with the right
// htmlFor/aria-describedby/aria-invalid, instead of repeating that wiring
// on every field. The child must be a single input/select/textarea with
// its `id` already set to the same `id` passed here.
export function FormField({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactElement<{ id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }>
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  const input = isValidElement(children)
    ? cloneElement(children, {
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })
    : children

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {input}
      {hint && (
        <small id={hintId}>{hint}</small>
      )}
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
