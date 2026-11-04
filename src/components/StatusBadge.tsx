import type { Nomination } from '../api/client'

const LABELS: Record<Nomination['status'], string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

export function StatusBadge({ status }: { status: Nomination['status'] }) {
  return <span className={`status-badge status-badge--${status}`}>{LABELS[status]}</span>
}
