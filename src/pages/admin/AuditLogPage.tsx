import { useEffect, useState } from 'react'
import { getAuditLog, ApiError, type AuditLogEntry } from '../../api/client'

export function AuditLogPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([])
  const [actionFilter, setActionFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getAuditLog(actionFilter || undefined)
      .then(setEntries)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load audit log.'))
      .finally(() => setLoading(false))
  }, [actionFilter])

  return (
    <div className="audit-log-page">
      <div className="page-header">
        <h1>Audit log</h1>
        <p>Every admin action, newest first.</p>
      </div>

      <div className="filters">
        <label>
          Filter by action
          <input
            type="text"
            placeholder="e.g. nomination.approve"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          />
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
                <th>When</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{new Date(entry.created_at).toLocaleString()}</td>
                  <td>{entry.admin_id ?? '—'}</td>
                  <td>{entry.action}</td>
                  <td>
                    {entry.entity_type} #{entry.entity_id}
                  </td>
                  <td>{entry.details ? JSON.stringify(entry.details) : '—'}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5}>No entries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
