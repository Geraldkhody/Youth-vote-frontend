import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'
import { createNomination, ApiError } from '../api/client'
import { validateNominationForm, type NominationFormValues, type NominationFormErrors } from '../utils/validation'
import { PublicHeader } from '../components/PublicHeader'

const EMPTY_VALUES: NominationFormValues = {
  category_id: '',
  nominee_name: '',
  nominee_phone: '',
  nominator_name: '',
  nominator_phone: '',
}

export function NominatePage() {
  const { categories, loading: categoriesLoading } = useCategories()
  const [values, setValues] = useState<NominationFormValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<NominationFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function updateField(field: keyof NominationFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setServerError(null)
    setSuccess(false)

    const validationErrors = validateNominationForm(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setSubmitting(true)
    try {
      await createNomination({
        category_id: Number(values.category_id),
        nominee_name: values.nominee_name.trim(),
        nominee_phone: values.nominee_phone.trim(),
        nominator_name: values.nominator_name.trim(),
        nominator_phone: values.nominator_phone.trim(),
      })
      setValues(EMPTY_VALUES)
      setSuccess(true)
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PublicHeader />
      <div className="centered-page">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>

        <div className="card">
          <h1>Nominate someone</h1>
          <p>Fill in the details below. We&apos;ll review every nomination before it&apos;s published.</p>

          {success && (
            <p className="success-message">Thank you. Your nomination has been received and is pending review.</p>
          )}
          {serverError && <p className="error-message">{serverError}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="category_id">Category</label>
              <select
                id="category_id"
                value={values.category_id}
                disabled={categoriesLoading}
                onChange={(e) => updateField('category_id', e.target.value)}
              >
                <option value="" disabled>
                  Choose a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="field-error">{errors.category_id}</p>}
            </div>

            <div className="field">
              <label htmlFor="nominee_name">Nominee name</label>
              <input
                id="nominee_name"
                type="text"
                value={values.nominee_name}
                onChange={(e) => updateField('nominee_name', e.target.value)}
              />
              {errors.nominee_name && <p className="field-error">{errors.nominee_name}</p>}
            </div>

            <div className="field">
              <label htmlFor="nominee_phone">Nominee phone number</label>
              <input
                id="nominee_phone"
                type="tel"
                placeholder="0244123456"
                value={values.nominee_phone}
                onChange={(e) => updateField('nominee_phone', e.target.value)}
              />
              {errors.nominee_phone && <p className="field-error">{errors.nominee_phone}</p>}
            </div>

            <div className="field">
              <label htmlFor="nominator_name">Your name</label>
              <input
                id="nominator_name"
                type="text"
                value={values.nominator_name}
                onChange={(e) => updateField('nominator_name', e.target.value)}
              />
              {errors.nominator_name && <p className="field-error">{errors.nominator_name}</p>}
            </div>

            <div className="field">
              <label htmlFor="nominator_phone">Your phone number</label>
              <input
                id="nominator_phone"
                type="tel"
                placeholder="0244123456"
                value={values.nominator_phone}
                onChange={(e) => updateField('nominator_phone', e.target.value)}
              />
              {errors.nominator_phone && <p className="field-error">{errors.nominator_phone}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit nomination'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
