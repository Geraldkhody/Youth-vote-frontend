import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

function Trigger({ open, onCancel }: { open: boolean; onCancel: () => void }) {
  return (
    <>
      <button type="button">Open trigger</button>
      <ConfirmDialog
        open={open}
        title="Deactivate nominee"
        message="Are you sure?"
        requireReason
        reasonLabel="Reason"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    </>
  )
}

describe('ConfirmDialog', () => {
  it('disables confirm until a required reason is entered', async () => {
    const user = userEvent.setup()
    render(<Trigger open onCancel={vi.fn()} />)

    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toBeDisabled()

    const reasonField = screen.getByLabelText(/reason/i)
    await user.type(reasonField, 'Withdrew')

    expect(confirmButton).toBeEnabled()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    const onCancel = vi.fn()
    render(<ConfirmDialog open title="Delete" message="Sure?" onConfirm={vi.fn()} onCancel={onCancel} />)

    await user.keyboard('{Escape}')

    expect(onCancel).toHaveBeenCalled()
    expect(document.activeElement).toBe(trigger)

    document.body.removeChild(trigger)
  })
})
