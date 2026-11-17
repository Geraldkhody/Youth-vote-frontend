import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AuditLogPage } from './AuditLogPage'
import * as client from '../../../api/client'

vi.mock('../../../api/client', async () => {
  const actual = await vi.importActual<typeof client>('../../../api/client')
  return { ...actual, getAuditLog: vi.fn() }
})

const mockedGetAuditLog = client.getAuditLog as ReturnType<typeof vi.fn>

const entryWithLeakedSecrets = {
  id: 1,
  admin_id: 1,
  action: 'admin.create',
  entity_type: 'admin_user',
  entity_id: 2,
  details: { password: 'hunter2', password_hash: 'abc123', name: 'New Admin' },
  created_at: '2026-11-01T00:00:00',
}

beforeEach(() => {
  mockedGetAuditLog.mockReset().mockResolvedValue([entryWithLeakedSecrets])
})

describe('AuditLogPage', () => {
  it('never renders password or hash keys, even if the server ever sends them', async () => {
    const user = userEvent.setup()
    render(<AuditLogPage />)

    const expandButton = await screen.findByText('View')
    await user.click(expandButton)

    expect(screen.getByText(/"name": "New Admin"/)).toBeInTheDocument()
    expect(screen.queryByText(/password/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/hunter2/)).not.toBeInTheDocument()
    expect(screen.queryByText(/abc123/)).not.toBeInTheDocument()
  })
})
