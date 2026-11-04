import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NominationsPage } from './NominationsPage'
import * as client from '../../api/client'

vi.mock('../../api/client', async () => {
  const actual = await vi.importActual<typeof client>('../../api/client')
  return {
    ...actual,
    getCategories: vi.fn(),
    getNominations: vi.fn(),
    approveNomination: vi.fn(),
  }
})

const mockedGetCategories = client.getCategories as ReturnType<typeof vi.fn>
const mockedGetNominations = client.getNominations as ReturnType<typeof vi.fn>
const mockedApprove = client.approveNomination as ReturnType<typeof vi.fn>

const pendingNomination = {
  id: 1,
  category_id: 1,
  nominator_name: 'Jane Nominator',
  nominator_phone: '233244999999',
  nominee_name: 'John Nominee',
  nominee_phone: '233244123456',
  nominee_id: null,
  status: 'pending' as const,
  rejection_reason: null,
  reviewed_at: null,
  created_at: '2026-11-01T00:00:00',
}

beforeEach(() => {
  mockedGetCategories.mockReset().mockResolvedValue([])
  mockedGetNominations.mockReset().mockResolvedValue([pendingNomination])
  mockedApprove.mockReset()
})

describe('NominationsPage', () => {
  it('shows the server error message when approve is refused', async () => {
    mockedApprove.mockRejectedValue(new client.ApiError("only pending nominations can be approved (this one is 'approved')", 400))
    const user = userEvent.setup()

    render(<NominationsPage />)

    const approveButton = await screen.findByRole('button', { name: /approve/i })
    await user.click(approveButton)

    await waitFor(() =>
      expect(screen.getByText(/only pending nominations can be approved/i)).toBeInTheDocument(),
    )
  })
})
