import { useEffect, useState } from 'react'
import { getAuditLog, ApiError, type AuditLogEntry } from '../../../api/client'
import { PageHeader } from '../../../components/admin/PageHeader/PageHeader'
import { FilterBar } from '../../../components/admin/FilterBar/FilterBar'
import { DataTable } from '../../../components/admin/DataTable/DataTable'
import { InlineError } from '../../../components/admin/InlineError/InlineError'
import styles from './AuditLogPage.module.css'

// Audit rows should never contain these, but if a bug ever puts one there,
// never render it -- strip it out rather than trusting the server shape.
const SENSITIVE_KEYS = ['password', 'password_hash']

function sanitizeDetails(details: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!details) return details
  const cleaned = { ...details }
  for (const key of SENSITIVE_KEYS) {
    delete cleaned[key]
  }
  return cleaned
}

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
    <div>
      <PageHeader title="Audit log" description="Every admin action, newest first." />

      <FilterBar onClear={actionFilter ? () => setActionFilter('') : undefined}>
        <label>
          Filter by action
          <input
            type="text"
            placeholder="e.g. nomination.approve"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          />
        </label>
      </FilterBar>

      {error && <InlineError message={error} />}

      <DataTable
        caption="Audit log"
        colSpan={5}
        isLoading={loading}
        isEmpty={!loading && entries.length === 0}
        emptyMessage="No entries found."
        head={
          <tr>
            <th>When</th>
            <th>Admin</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Details</th>
          </tr>
        }
      >
        {entries.map((entry) => (
          <tr key={entry.id}>
            <td data-label="When">
              <time
                dateTime={entry.created_at}
                title={new Date(entry.created_at).toLocaleString()}
              >
                {new Date(entry.created_at).toLocaleString()}
              </time>
            </td>
            <td data-label="Admin">{entry.admin_id ?? '—'}</td>
            <td data-label="Action">{entry.action}</td>
            <td data-label="Entity">
              {entry.entity_type} #{entry.entity_id}
            </td>
            <td data-label="Details">
              {entry.details ? (
                <details>
                  <summary>View</summary>
                  <pre className={styles.detailsBlock}>
                    {JSON.stringify(sanitizeDetails(entry.details), null, 2)}
                  </pre>
                </details>
              ) : (
                '—'
              )}
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  )
}
