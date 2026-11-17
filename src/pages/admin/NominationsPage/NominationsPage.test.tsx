import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NominationsPage } from './NominationsPage'
import { ToastProvider } from '../../../components/admin/Toast/Toast'
import * as client from '../../../api/client'

vi.mock('../../../api/client', async () => {
  const actual = await vi.importActual<typeof client>('../../../api/client')
  return {
    ...actual,
    getAllCategories: vi.fn(),
    getNominations: vi.fn(),
    approveNomination: vi.fn(),
    rejectNomination: vi.fn(),
  }
})

const mockedGetAllCategories = client.getAllCategories as ReturnType<typeof vi.fn>
const mockedGetNominations = client.getNominations as ReturnType<typeof vi.fn>
const mockedApprove = client.approveNomination as ReturnType<typeof vi.fn>
const mockedReject = client.rejectNomination as ReturnType<typeof vi.fn>

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

function renderPage() {
  return render(
    <ToastProvider>
      <NominationsPage />
    </ToastProvider>,
  )
}

beforeEach(() => {
  mockedGetAllCategories.mockReset().mockResolvedValue([])
  mockedGetNominations.mockReset().mockResolvedValue([pendingNomination])
  mockedApprove.mockReset()
  mockedReject.mockReset().mockResolvedValue({ ...pendingNomination, status: 'rejected' })
})

describe('NominationsPage', () => {
  it('shows the server error message when approve is refused', async () => {
    mockedApprove.mockRejectedValue(new client.ApiError("only pending nominations can be approved (this one is 'approved')", 400))
    const user = userEvent.setup()

    renderPage()

    const approveButton = await screen.findByRole('button', { name: /approve/i })
    await user.click(approveButton)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/only pending nominations can be approved/i)
  })

  it('sends the typed reason when rejecting a nomination', async () => {
    const user = userEvent.setup()

    renderPage()

    const rejectButton = await screen.findByRole('button', { name: /^reject$/i })
    await user.click(rejectButton)

    const dialog = await screen.findByRole('dialog')
    const reasonField = within(dialog).getByLabelText(/reason for rejection/i)
    await user.type(reasonField, 'Incomplete information')

    const confirmButton = within(dialog).getByRole('button', { name: /^reject$/i })
    await user.click(confirmButton)

    await waitFor(() => expect(mockedReject).toHaveBeenCalledWith(1, 'Incomplete information'))
  })
})
