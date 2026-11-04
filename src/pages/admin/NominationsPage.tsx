import { useEffect, useState } from 'react'
import {
  getNominations,
  approveNomination,
  rejectNomination,
  mergeNomination,
  getNominees,
  ApiError,
  type Nomination,
  type NomineeSummary,
} from '../../api/client'
import { useCategories } from '../../hooks/useCategories'
import { StatusBadge } from '../../components/StatusBadge'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

export function NominationsPage() {
  const { categories } = useCategories()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [nominations, setNominations] = useState<Nomination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    <div className="nominations-page">
      <div className="page-header">
        <h1>Nominations</h1>
        <p>Review, approve, reject, or merge submitted nominations.</p>
      </div>

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
                <th>Nominator</th>
                <th>Status</th>
                <th>Created</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nominations.map((nomination) => (
                <NominationRow key={nomination.id} nomination={nomination} onChanged={reload} />
              ))}
              {nominations.length === 0 && (
                <tr>
                  <td colSpan={6}>No nominations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function NominationRow({ nomination, onChanged }: { nomination: Nomination; onChanged: () => void }) {
  const [actionError, setActionError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState(false)
  const [nominees, setNominees] = useState<NomineeSummary[] | null>(null)
  const [selectedNomineeId, setSelectedNomineeId] = useState('')

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
        {nomination.nominee_id && <div className="nominee-id-tag">Nominee ID: {nomination.nominee_id}</div>}
        {nomination.rejection_reason && (
          <div className="rejection-reason">Reason: {nomination.rejection_reason}</div>
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
