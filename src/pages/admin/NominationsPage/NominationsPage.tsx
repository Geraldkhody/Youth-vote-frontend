import { useEffect, useState } from 'react'
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
import { AdminPageHeader } from '../../../components/AdminPageHeader/AdminPageHeader'
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

  return (
    <div>
      <AdminPageHeader title="Nominations" description="Review, approve, reject, or merge submitted nominations." />

      <div className="filters">
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
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="page-message">Loading…</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Nominee</th>
                <th>Category</th>
                <th>Nominator</th>
                <th>Status</th>
                <th>Created</th>
                <th>Nominee code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nominations.map((nomination) => (
                <NominationRow key={nomination.id} nomination={nomination} categories={categories} onChanged={reload} />
              ))}
              {nominations.length === 0 && (
                <tr>
                  <td colSpan={7}>No nominations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
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
  const category = categories.find((c) => c.id === nomination.category_id)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState(false)
  const [nominees, setNominees] = useState<NomineeSummary[] | null>(null)
  const [selectedNomineeId, setSelectedNomineeId] = useState('')
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
      onChanged()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to approve.')
    } finally {
      setBusy(false)
    }
  }

  async function handleReject() {
    setBusy(true)
    setActionError(null)
    try {
      await rejectNomination(nomination.id, rejectReason)
      setShowReject(false)
      setRejectReason('')
      onChanged()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to reject.')
    } finally {
      setBusy(false)
    }
  }

  async function loadNomineesForMerge() {
    try {
      const data = await getNominees(nomination.category_id)
      setNominees(data)
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to load nominees.')
    }
  }

  async function handleMerge() {
    if (!selectedNomineeId) return
    setBusy(true)
    setActionError(null)
    try {
      await mergeNomination(nomination.id, Number(selectedNomineeId))
      onChanged()
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to merge.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <tr>
      <td>
        {nomination.nominee_name}
        <br />
        <small>{nomination.nominee_phone}</small>
      </td>
      <td>{category ? `${category.code_letter} — ${category.name}` : nomination.category_id}</td>
      <td>
        {nomination.nominator_name}
        <br />
        <small>{nomination.nominator_phone}</small>
      </td>
      <td>
        <StatusBadge status={nomination.status} />
      </td>
      <td>{new Date(nomination.created_at).toLocaleDateString()}</td>
      <td>
        {nomination.status === 'approved' && nomineeCode && (
          <div className={styles.nomineeIdTag}>{nomineeCode}</div>
        )}
        {nomination.rejection_reason && (
          <div className={styles.rejectionReason}>Reason: {nomination.rejection_reason}</div>
        )}
      </td>
      <td>
        {nomination.status === 'pending' && (
          <div className="row-actions">
            <div className="btn-group">
              <button type="button" className="btn btn-sm btn-primary" onClick={handleApprove} disabled={busy}>
                Approve
              </button>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => setShowReject((v) => !v)}
                disabled={busy}
              >
                Reject
              </button>
            </div>
            {showReject && (
              <div className="reject-form">
                <input
                  type="text"
                  placeholder="Reason for rejection"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger-solid"
                  onClick={handleReject}
                  disabled={busy || !rejectReason.trim()}
                >
                  Confirm reject
                </button>
              </div>
            )}

            {nominees === null ? (
              <button type="button" className="btn btn-sm btn-secondary" onClick={loadNomineesForMerge} disabled={busy}>
                Merge…
              </button>
            ) : (
              <div className="merge-form">
                <select value={selectedNomineeId} onChange={(e) => setSelectedNomineeId(e.target.value)}>
                  <option value="">Choose an existing nominee</option>
                  {nominees.map((nominee) => (
                    <option key={nominee.id} value={nominee.id}>
                      {nominee.code} — {nominee.full_name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={handleMerge}
                  disabled={busy || !selectedNomineeId}
                >
                  Confirm merge
                </button>
              </div>
            )}
          </div>
        )}
        {actionError && <p className="field-error">{actionError}</p>}
      </td>
    </tr>
  )
}
