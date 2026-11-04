import { useEffect, useState } from 'react'
import { getNominees, getNominee, updateNominee, deactivateNominee, ApiError, type NomineeSummary, type Nominee } from '../../api/client'
import { useCategories } from '../../hooks/useCategories'

export function NomineesPage() {
  const { categories } = useCategories()
  const [categoryId, setCategoryId] = useState('')
  const [nominees, setNominees] = useState<NomineeSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setNominees([])
      return
    }
    setLoading(true)
    setListError(null)
    getNominees(Number(categoryId))
      .then(setNominees)
      .catch((err) => setListError(err instanceof ApiError ? err.message : 'Failed to load nominees.'))
      .finally(() => setLoading(false))
  }, [categoryId])

  return (
    <div className="nominees-page">
      <div className="page-header">
        <h1>Nominees</h1>
        <p>This list shows active nominees only.</p>
      </div>

      <div className="filters">
        <label>
          Category
          <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSelectedId(null) }}>
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {listError && <p className="error-message">{listError}</p>}
      {loading && <p className="page-message">Loading…</p>}

      {!loading && categoryId && (
        <ul className="nominee-list">
          {nominees.map((nominee) => (
            <li key={nominee.id}>
              <button type="button" onClick={() => setSelectedId(nominee.id)}>
                {nominee.code} — {nominee.full_name}
              </button>
            </li>
          ))}
          {nominees.length === 0 && <li className="nominee-list__empty">No active nominees in this category.</li>}
        </ul>
      )}

      {selectedId !== null && (
        <NomineeDetail
          nomineeId={selectedId}
          onChanged={() => {
            getNominees(Number(categoryId)).then(setNominees)
          }}
        />
      )}
    </div>
  )
}

function NomineeDetail({ nomineeId, onChanged }: { nomineeId: number; onChanged: () => void }) {
  const [nominee, setNominee] = useState<Nominee | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [deactivateReason, setDeactivateReason] = useState('')
  const [showDeactivate, setShowDeactivate] = useState(false)

  function load() {
    setError(null)
    getNominee(nomineeId)
      .then((data) => {
        setNominee(data)
        setFullName(data.full_name)
        setPhone(data.phone)
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load nominee.'))
  }

  useEffect(load, [nomineeId])

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const updated = await updateNominee(nomineeId, { full_name: fullName, phone })
      setNominee(updated)
      onChanged()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeactivate() {
    setSaving(true)
    setError(null)
    try {
      const updated = await deactivateNominee(nomineeId, deactivateReason)
      setNominee(updated)
      setShowDeactivate(false)
      onChanged()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to deactivate.')
    } finally {
      setSaving(false)
    }
  }

  if (!nominee) {
    return error ? <p className="error-message">{error}</p> : <p className="page-message">Loading…</p>
  }

  return (
    <div className="nominee-detail card">
      <h2>
        {nominee.code} — {nominee.full_name}
      </h2>
      {error && <p className="error-message">{error}</p>}

      <div className="field">
        <label>Full name</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="field">
        <label>Phone</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
        Save changes
      </button>

      {!nominee.is_active && <p className="page-note">Deactivated: {nominee.deactivation_reason}</p>}

      {nominee.is_active && (
        <div className="deactivate-section">
          <button type="button" className="btn btn-danger" onClick={() => setShowDeactivate((v) => !v)} disabled={saving}>
            Deactivate
          </button>
          {showDeactivate && (
            <div className="reject-form">
              <input
                type="text"
                placeholder="Reason for deactivation"
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-danger-solid"
                onClick={handleDeactivate}
                disabled={saving || !deactivateReason.trim()}
              >
                Confirm deactivate
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
