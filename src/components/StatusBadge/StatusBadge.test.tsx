import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusBadge, type Status } from './StatusBadge'

const STATUSES: { status: Status; label: string }[] = [
  { status: 'pending', label: 'Pending' },
  { status: 'approved', label: 'Approved' },
  { status: 'rejected', label: 'Rejected' },
  { status: 'active', label: 'Active' },
  { status: 'inactive', label: 'Inactive' },
]

describe('StatusBadge', () => {
  it.each(STATUSES)('renders an icon and the text label for $status', ({ status, label }) => {
    render(<StatusBadge status={status} />)

    const badge = screen.getByText(label)
    expect(badge).toBeInTheDocument()
    // The icon glyph is a separate aria-hidden span, not the only content.
    expect(badge.parentElement?.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})
