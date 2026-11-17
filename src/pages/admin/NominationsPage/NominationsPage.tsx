import { useEffect, useRef, useState } from 'react'
import {
  getNominations,
  getAllCategories,
  approveNomination,
  rejectNomination,
  mergeNomination,
  getNominees,
  getNominee,
  ApiError,
  type Nomination,
  type NomineeSummary,
  type Category,
} from '../../../api/client'
import { StatusBadge } from '../../../components/StatusBadge/StatusBadge'
import { PageHeader } from '../../../components/admin/PageHeader/PageHeader'
import { FilterBar } from '../../../components/admin/FilterBar/FilterBar'
import { DataTable } from '../../../components/admin/DataTable/DataTable'
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog/ConfirmDialog'
import { InlineError } from '../../../components/admin/InlineError/InlineError'
import { useToast } from '../../../components/admin/Toast/Toast'
import { Button } from '../../../components/ui/Button/Button'
import dialogStyles from '../../../components/admin/ConfirmDialog/ConfirmDialog.module.css'
import styles from './NominationsPage.module.css'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

export function NominationsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [nominations, setNominations] = useState<Nomination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getAllCategories().then(setCategories).catch(() => {})
  }, [])

  async function reload() {
    setLoading(true)
    setError(null)
    try {
      const data = await getNominations({
        status: statusFilter === 'all' ? undefined : statusFilter,
        category_id: categoryFilter ? Number(categoryFilter) : undefined,
      })
      setNominations(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load nominations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter])

  const hasFilters = statusFilter !== 'all' || categoryFilter !== ''
  const pendingCount = nominations.filter((n) => n.status === 'pending').length

  return (
    <div>
      <PageHeader title="Nominations" description="Review, approve, reject, or merge submitted nominations." />

      <FilterBar
        onClear={
          hasFilters
            ? () => {
                setStatusFilter('all')
                setCategoryFilter('')
              }
            : undefined
        }
      >
        <label>
          Status
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <label>
          Category
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </FilterBar>

      {!loading && <p className={styles.count}>{pendingCount} pending</p>}

      {error && <InlineError message={error} />}

      <DataTable
        caption="Nominations"
        colSpan={7}
        isLoading={loading}
        isEmpty={!loading && nominations.length === 0}
        emptyMessage="No nominations found."
        head={
          <tr>
            <th>Nominee</th>
            <th>Category</th>
            <th>Nominator</th>
            <th>Status</th>
            <th>Created</th>
            <th>Nominee code</th>
            <th>Actions</th>
          </tr>
        }
      >
        {nominations.map((nomination) => (
          <NominationRow key={nomination.id} nomination={nomination} categories={categories} onChanged={reload} />
        ))}
      </DataTable>
    </div>
  )
}

function NominationRow({
  nomination,
  categories,
  onChanged,
}: {
  nomination: Nomination
  categories: Category[]
  onChanged: () => void
}) {
  const { showToast } = useToast()
  const category = categories.find((c) => c.id === nomination.category_id)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [nomineeCode, setNomineeCode] = useState<string | null>(null)

  useEffect(() => {
    if (nomination.status === 'approved' && nomination.nominee_id) {
      getNominee(nomination.nominee_id)
        .then((nominee) => setNomineeCode(nominee.code))
        .catch(() => {})
    }
  }, [nomination.status, nomination.nominee_id])

  async function handleApprove() {
    setBusy(true)
    setActionError(null)
    try {
      await approveNomination(nomination.id)
      showToast(`${nomination.nominee_name} approved.`)
      onChanged()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to approve.')
    } finally {
      setBusy(false)
    }
  }

  async function handleReject(reason?: string) {
    setBusy(true)
    setActionError(null)
    try {
      await rejectNomination(nomination.id, reason ?? '')
      setShowRejectDialog(false)
      showToast(`${nomination.nominee_name} rejected.`)
      onChanged()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to reject.')
    } finally {
      setBusy(false)
    }
  }

  async function handleMerge(nomineeId: number) {
    setBusy(true)
    setActionError(null)
    try {
      await mergeNomination(nomination.id, nomineeId)
      setShowMergeDialog(false)
      showToast(`${nomination.nominee_name} merged.`)
      onChanged()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to merge.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <tr>
      <td data-label="Nominee">
        {nomination.nominee_name}
        <br />
        <small>{nomination.nominee_phone}</small>
      </td>
      <td data-label="Category">{category ? `${category.code_letter} — ${category.name}` : nomination.category_id}</td>
      <td data-label="Nominator">
        {nomination.nominator_name}
        <br />
        <small>{nomination.nominator_phone}</small>
      </td>
      <td data-label="Status">
        <StatusBadge status={nomination.status} />
      </td>
      <td data-label="Created">
        <time dateTime={nomination.created_at} title={new Date(nomination.created_at).toLocaleString()}>
          {new Date(nomination.created_at).toLocaleDateString()}
        </time>
      </td>
      <td data-label="Nominee code">
        {nomination.status === 'approved' && nomineeCode && (
          <div className={styles.nomineeIdTag}>{nomineeCode}</div>
        )}
        {nomination.rejection_reason && (
          <div className={styles.rejectionReason}>Reason: {nomination.rejection_reason}</div>
        )}
      </td>
      <td data-label="Actions">
        {nomination.status === 'pending' && (
          <div className="row-actions">
            <div className="btn-group">
              <Button variant="primary" className="btn-sm" onClick={handleApprove} loading={busy} loadingLabel="Approving">
                Approve
              </Button>
              <Button variant="danger" className="btn-sm" onClick={() => setShowRejectDialog(true)} disabled={busy}>
                Reject
              </Button>
              <Button variant="secondary" className="btn-sm" onClick={() => setShowMergeDialog(true)} disabled={busy}>
                Merge…
              </Button>
            </div>
          </div>
        )}
        {actionError && <InlineError message={actionError} />}

        <ConfirmDialog
          open={showRejectDialog}
          title="Reject nomination"
          message={`Reject the nomination for ${nomination.nominee_name}?`}
          confirmLabel="Reject"
          danger
          requireReason
          reasonLabel="Reason for rejection"
          busy={busy}
          onConfirm={(reason) => handleReject(reason)}
          onCancel={() => setShowRejectDialog(false)}
        />

        {showMergeDialog && (
          <MergeDialog
            categoryId={nomination.category_id}
            busy={busy}
            onConfirm={handleMerge}
            onCancel={() => setShowMergeDialog(false)}
          />
        )}
      </td>
    </tr>
  )
}

function MergeDialog({
  categoryId,
  busy,
  onConfirm,
  onCancel,
}: {
  categoryId: number
  busy: boolean
  onConfirm: (nomineeId: number) => void
  onCancel: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const [nominees, setNominees] = useState<NomineeSummary[] | null>(null)
  const [selectedNomineeId, setSelectedNomineeId] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    getNominees(categoryId)
      .then(setNominees)
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : 'Failed to load nominees.'))
  }, [categoryId])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    previouslyFocused.current = document.activeElement as HTMLElement | null
    dialog.showModal()
  }, [])

  function handleClose() {
    onCancel()
    previouslyFocused.current?.focus()
  }

  return (
    <dialog
      ref={dialogRef}
      className={dialogStyles.dialog}
      aria-labelledby="merge-dialog-title"
      onCancel={(e) => {
        e.preventDefault()
        handleClose()
      }}
      onClose={handleClose}
    >
      <h2 id="merge-dialog-title">Merge into an existing nominee</h2>
      <p>Choose the nominee this nomination should be merged into.</p>

      {loadError && <InlineError message={loadError} />}

      <div className="field">
        <label htmlFor="merge-nominee">Nominee</label>
        <select id="merge-nominee" value={selectedNomineeId} onChange={(e) => setSelectedNomineeId(e.target.value)}>
          <option value="">Choose an existing nominee</option>
          {nominees?.map((nominee) => (
            <option key={nominee.id} value={nominee.id}>
              {nominee.code} — {nominee.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className={dialogStyles.actions}>
        <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={busy}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy || !selectedNomineeId}
          onClick={() => onConfirm(Number(selectedNomineeId))}
        >
          Confirm merge
        </button>
      </div>
    </dialog>
  )
}
