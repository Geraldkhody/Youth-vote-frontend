export type Status = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'

const LABELS: Record<Status, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  active: 'Active',
  inactive: 'Inactive',
}

// Small glyphs, not just colour, so status is readable without colour vision.
const ICONS: Record<Status, string> = {
  pending: '●',
  approved: '✓',
  active: '✓',
  rejected: '✕',
  inactive: '✕',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span aria-hidden="true">{ICONS[status]}</span>
      <span>{LABELS[status]}</span>
    </span>
  )
}
