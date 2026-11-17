import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { getAllCategories, createCategory, updateCategory, deleteCategory, ApiError, type Category } from '../../../api/client'
import { PageHeader } from '../../../components/admin/PageHeader/PageHeader'
import { DataTable } from '../../../components/admin/DataTable/DataTable'
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog/ConfirmDialog'
import { InlineError } from '../../../components/admin/InlineError/InlineError'
import { FormField } from '../../../components/admin/FormField/FormField'
import { StatusBadge } from '../../../components/StatusBadge/StatusBadge'
import { useToast } from '../../../components/admin/Toast/Toast'
import { Button } from '../../../components/ui/Button/Button'
import styles from './CategoriesPage.module.css'

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
    <div>
      <PageHeader
        title="Categories"
        description="Create and manage award categories."
        actions={
          <Button variant="secondary" onClick={() => setShowAddForm((v) => !v)}>
            {showAddForm ? 'Cancel' : '+ Add category'}
          </Button>
        }
      />

      {showAddForm && (
        <AddCategoryForm
          onCreated={() => {
            setShowAddForm(false)
            reload()
          }}
        />
      )}

      {listError && <InlineError message={listError} />}

      <DataTable
        caption="Categories"
        colSpan={5}
        isLoading={loading}
        isEmpty={!loading && categories.length === 0}
        emptyMessage="No categories yet."
        head={
          <tr>
            <th>Letter</th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        }
      >
        {categories.map((category) => (
          <CategoryRow key={category.id} category={category} onChanged={reload} />
        ))}
      </DataTable>
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
    <div className={`card ${styles.addForm}`}>
      <h2>New category</h2>
      {error && <InlineError message={error} />}
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="new_category_name" label="Name">
          <input
            type="text"
            value={values.name}
            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
          />
        </FormField>

        <FormField id="new_category_letter" label="Code letter" hint="1-3 letters, A-Z">
          <input
            type="text"
            maxLength={3}
            value={values.code_letter}
            onChange={(e) => setValues((prev) => ({ ...prev, code_letter: e.target.value }))}
          />
        </FormField>

        <FormField id="new_category_description" label="Description (optional)">
          <input
            type="text"
            value={values.description}
            onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
          />
        </FormField>

        <Button type="submit" loading={submitting} loadingLabel="Creating">
          Create category
        </Button>
      </form>
    </div>
  )
}

function CategoryRow({ category, onChanged }: { category: Category; onChanged: () => void }) {
  const { showToast } = useToast()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [codeLetter, setCodeLetter] = useState(category.code_letter)
  const [description, setDescription] = useState(category.description ?? '')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)

  async function handleSave() {
    setBusy(true)
    setError(null)
    try {
      await updateCategory(category.id, { name, code_letter: codeLetter.trim(), description })
      setEditing(false)
      showToast('Category updated.')
      onChanged()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save changes.')
    } finally {
      setBusy(false)
    }
  }

  function handleCancel() {
    setName(category.name)
    setCodeLetter(category.code_letter)
    setDescription(category.description ?? '')
    setEditing(false)
  }

  async function handleToggleActive() {
    setBusy(true)
    setError(null)
    try {
      await updateCategory(category.id, { is_active: !category.is_active })
      setShowDeactivateDialog(false)
      showToast(category.is_active ? 'Category deactivated.' : 'Category reactivated.')
      onChanged()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update category.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    setBusy(true)
    setError(null)
    try {
      await deleteCategory(category.id)
      setShowDeleteDialog(false)
      showToast('Category deleted.')
      onChanged()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete category.')
      setBusy(false)
    }
  }

  return (
    <tr>
      <td data-label="Letter">
        {editing ? (
          <input
            type="text"
            maxLength={3}
            value={codeLetter}
            onChange={(e) => setCodeLetter(e.target.value)}
          />
        ) : (
          category.code_letter
        )}
      </td>
      <td data-label="Name">
        {editing ? (
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          category.name
        )}
      </td>
      <td data-label="Description">
        {editing ? (
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        ) : (
          category.description || <small>—</small>
        )}
      </td>
      <td data-label="Status">
        <StatusBadge status={category.is_active ? 'active' : 'inactive'} />
      </td>
      <td data-label="Actions">
        <div className="row-actions">
          <div className="btn-group">
            {editing ? (
              <>
                <Button className="btn-sm" onClick={handleSave} loading={busy} loadingLabel="Saving">
                  Save
                </Button>
                <Button variant="secondary" className="btn-sm" onClick={handleCancel} disabled={busy}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" className="btn-sm" onClick={() => setEditing(true)} disabled={busy}>
                  Edit
                </Button>
                <Button
                  variant={category.is_active ? 'danger' : 'secondary'}
                  className="btn-sm"
                  onClick={() => setShowDeactivateDialog(true)}
                  disabled={busy}
                >
                  {category.is_active ? 'Deactivate' : 'Reactivate'}
                </Button>
                <Button variant="danger" className="btn-sm" onClick={() => setShowDeleteDialog(true)} disabled={busy}>
                  Delete
                </Button>
              </>
            )}
          </div>
          {error && <InlineError message={error} />}
        </div>

        <ConfirmDialog
          open={showDeactivateDialog}
          title={category.is_active ? 'Deactivate category' : 'Reactivate category'}
          message={
            category.is_active
              ? `Deactivate "${category.name}"? It will be hidden from the public categories list.`
              : `Reactivate "${category.name}"? It will show up on the public categories list again.`
          }
          confirmLabel={category.is_active ? 'Deactivate' : 'Reactivate'}
          danger={category.is_active}
          busy={busy}
          onConfirm={handleToggleActive}
          onCancel={() => setShowDeactivateDialog(false)}
        />

        <ConfirmDialog
          open={showDeleteDialog}
          title="Delete category"
          message={`Delete "${category.name}"? This also permanently deletes its nominations and nominees. This cannot be undone.`}
          confirmLabel="Delete"
          danger
          busy={busy}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </td>
    </tr>
  )
}
