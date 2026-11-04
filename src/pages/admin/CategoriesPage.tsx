import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { getAllCategories, createCategory, updateCategory, ApiError, type Category } from '../../api/client'

const EMPTY_FORM = { name: '', code_letter: '', description: '' }

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  function reload() {
    setLoading(true)
    setListError(null)
    getAllCategories()
      .then(setCategories)
      .catch((err) => setListError(err instanceof ApiError ? err.message : 'Failed to load categories.'))
      .finally(() => setLoading(false))
  }

  useEffect(reload, [])

  return (
    <div className="categories-page">
      <div className="page-header page-header--with-action">
        <div>
          <h1>Categories</h1>
          <p>Create and manage award categories.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowAddForm((v) => !v)}>
          {showAddForm ? 'Cancel' : '+ Add category'}
        </button>
      </div>

      {showAddForm && (
        <AddCategoryForm
          onCreated={() => {
            setShowAddForm(false)
            reload()
          }}
        />
      )}

      {listError && <p className="error-message">{listError}</p>}

      {loading ? (
        <p className="page-message">Loading…</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Letter</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <CategoryRow key={category.id} category={category} onChanged={reload} />
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5}>No categories yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function AddCategoryForm({ onCreated }: { onCreated: () => void }) {
  const [values, setValues] = useState(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await createCategory({
        name: values.name.trim(),
        code_letter: values.code_letter.trim(),
        description: values.description.trim() || undefined,
      })
      setValues(EMPTY_FORM)
      onCreated()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create category.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card add-category-form">
      <h2>New category</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="new_category_name">Name</label>
          <input
            id="new_category_name"
            type="text"
            value={values.name}
            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="field">
          <label htmlFor="new_category_letter">Code letter (A-Z)</label>
          <input
            id="new_category_letter"
            type="text"
            maxLength={1}
            value={values.code_letter}
            onChange={(e) => setValues((prev) => ({ ...prev, code_letter: e.target.value }))}
          />
        </div>

        <div className="field">
          <label htmlFor="new_category_description">Description (optional)</label>
          <input
            id="new_category_description"
            type="text"
            value={values.description}
            onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create category'}
        </button>
      </form>
    </div>
  )
}

function CategoryRow({ category, onChanged }: { category: Category; onChanged: () => void }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSave() {
    setBusy(true)
    setError(null)
    try {
      await updateCategory(category.id, { name, description })
      setEditing(false)
      onChanged()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save changes.')
    } finally {
      setBusy(false)
    }
  }

  async function handleToggleActive() {
    setBusy(true)
    setError(null)
    try {
      await updateCategory(category.id, { is_active: !category.is_active })
      onChanged()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update category.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <tr>
      <td>{category.code_letter}</td>
      <td>
        {editing ? (
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          category.name
        )}
      </td>
      <td>
        {editing ? (
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        ) : (
          category.description || <small>—</small>
        )}
      </td>
      <td>
        <span className={`status-badge status-badge--${category.is_active ? 'approved' : 'rejected'}`}>
          {category.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td>
        <div className="row-actions">
          <div className="btn-group">
            {editing ? (
              <>
                <button type="button" className="btn btn-sm btn-primary" onClick={handleSave} disabled={busy}>
                  Save
                </button>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditing(false)} disabled={busy}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditing(true)} disabled={busy}>
                  Edit
                </button>
                <button
                  type="button"
                  className={category.is_active ? 'btn btn-sm btn-danger' : 'btn btn-sm btn-secondary'}
                  onClick={handleToggleActive}
                  disabled={busy}
                >
                  {category.is_active ? 'Deactivate' : 'Reactivate'}
                </button>
              </>
            )}
          </div>
          {error && <p className="field-error">{error}</p>}
        </div>
      </td>
    </tr>
  )
}
