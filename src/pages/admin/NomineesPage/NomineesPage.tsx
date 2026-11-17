import { useEffect, useRef, useState } from 'react'
import {
  getNominees,
  getNominee,
  updateNominee,
  deactivateNominee,
  ApiError,
  type NomineeSummary,
  type Nominee,
  type Category,
} from '../../../api/client'
import { useCategories } from '../../../hooks/useCategories'
import { PageHeader } from '../../../components/admin/PageHeader/PageHeader'
import { DataTable } from '../../../components/admin/DataTable/DataTable'
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog/ConfirmDialog'
import { InlineError } from '../../../components/admin/InlineError/InlineError'
import { FormField } from '../../../components/admin/FormField/FormField'
import { useToast } from '../../../components/admin/Toast/Toast'
import { Button } from '../../../components/ui/Button/Button'
import styles from './NomineesPage.module.css'

export function NomineesPage() {
  const { categories } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [nominees, setNominees] = useState<NomineeSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  function reloadNominees() {
    if (!selectedCategory) return
    getNominees(selectedCategory.id).then(setNominees).catch(() => {})
  }

  useEffect(() => {
    if (!selectedCategory) {
      setNominees([])
      return
    }
    setLoading(true)
    setListError(null)
    getNominees(selectedCategory.id)
      .then(setNominees)
      .catch((err) => setListError(err instanceof ApiError ? err.message : 'Failed to load nominees.'))
      .finally(() => setLoading(false))
  }, [selectedCategory])

  function selectCategory(category: Category) {
    setSelectedCategory(category)
    setSelectedId(null)
  }

  return (
    <div>
      <PageHeader title="Nominees" description="This list shows active nominees only." />

      {!selectedCategory && (
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={styles.categoryCard}
              onClick={() => selectCategory(category)}
            >
              <h3>{category.name}</h3>
              {category.description && <p>{category.description}</p>}
            </button>
          ))}
          {categories.length === 0 && <p className="page-message">No categories yet.</p>}
        </div>
      )}

      {selectedCategory && (
        <>
          <Button variant="secondary" onClick={() => setSelectedCategory(null)}>
            ← Back to categories
          </Button>

          <h2 className={styles.selectedCategoryName}>{selectedCategory.name}</h2>

          {listError && <InlineError message={listError} />}

          <DataTable
            caption={`Nominees in ${selectedCategory.name}`}
            colSpan={3}
            isLoading={loading}
            isEmpty={!loading && nominees.length === 0}
            emptyMessage="No active nominees in this category."
            head={
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            }
          >
            {nominees.map((nominee) => (
              <NomineeRow key={nominee.id} nominee={nominee} onView={() => setSelectedId(nominee.id)} />
            ))}
          </DataTable>

          {selectedId !== null && (
            <NomineeDetailDialog
              nomineeId={selectedId}
              onClose={() => setSelectedId(null)}
              onChanged={reloadNominees}
            />
          )}
        </>
      )}
    </div>
  )
}

function NomineeRow({ nominee, onView }: { nominee: NomineeSummary; onView: () => void }) {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(nominee.code)
      setCopied(true)
      showToast('Code copied.')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Could not copy the code.', 'error')
    }
  }

  return (
    <tr>
      <td data-label="Code">
        <span className={styles.codeBadge}>{nominee.code}</span>
      </td>
      <td data-label="Name">{nominee.full_name}</td>
      <td data-label="Actions">
        <div className="btn-group">
          <Button variant="secondary" className="btn-sm" onClick={onView}>
            View
          </Button>
          <Button variant="secondary" className="btn-sm" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy code'}
          </Button>
        </div>
      </td>
    </tr>
  )
}

function NomineeDetailDialog({
  nomineeId,
  onClose,
  onChanged,
}: {
  nomineeId: number
  onClose: () => void
  onChanged: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const [nominee, setNominee] = useState<Nominee | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const { showToast } = useToast()

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

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    dialog.showModal()
  }, [])

  function handleClose() {
    onClose()
    previouslyFocused.current?.focus()
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const updated = await updateNominee(nomineeId, { full_name: fullName, phone })
      setNominee(updated)
      showToast('Nominee updated.')
      onChanged()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeactivate(reason?: string) {
    setSaving(true)
    setError(null)
    try {
      const updated = await deactivateNominee(nomineeId, reason ?? '')
      setNominee(updated)
      setShowDeactivateDialog(false)
      showToast('Nominee deactivated.')
      onChanged()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to deactivate.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.detailDialog}
      aria-labelledby="nominee-detail-title"
      onCancel={(e) => {
        e.preventDefault()
        handleClose()
      }}
      onClose={handleClose}
    >
      {!nominee ? (
        <>
          <h2 id="nominee-detail-title">Nominee</h2>
          {error ? <InlineError message={error} /> : <p className="page-message">Loading…</p>}
        </>
      ) : (
        <>
          <div className={styles.detailHeader}>
            <h2 id="nominee-detail-title">
              {nominee.code} — {nominee.full_name}
            </h2>
            <button type="button" className={styles.closeButton} onClick={handleClose} aria-label="Close">
              ✕
            </button>
          </div>

          {error && <InlineError message={error} />}

          <FormField id="nominee_full_name" label="Full name">
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </FormField>
          <FormField id="nominee_phone" label="Phone">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </FormField>
          <Button onClick={handleSave} loading={saving} loadingLabel="Saving">
            Save changes
          </Button>

          {!nominee.is_active && <p className="page-note">Deactivated: {nominee.deactivation_reason}</p>}

          {nominee.is_active && (
            <div className={styles.deactivateSection}>
              <Button variant="danger" onClick={() => setShowDeactivateDialog(true)} disabled={saving}>
                Deactivate
              </Button>
            </div>
          )}

          <ConfirmDialog
            open={showDeactivateDialog}
            title="Deactivate nominee"
            message={`Deactivate ${nominee.full_name}? They will be hidden from the public nominee list.`}
            confirmLabel="Deactivate"
            danger
            requireReason
            reasonLabel="Reason for deactivation"
            busy={saving}
            onConfirm={(reason) => handleDeactivate(reason)}
            onCancel={() => setShowDeactivateDialog(false)}
          />
        </>
      )}
    </dialog>
  )
}
