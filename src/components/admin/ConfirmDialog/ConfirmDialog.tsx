import { useEffect, useRef, useState } from 'react'
import styles from './ConfirmDialog.module.css'

// Built on the native <dialog> element, which already traps focus and
// closes on Escape via showModal(). We just need to open/close it to match
// the `open` prop, return focus to whatever triggered it, and (for
// destructive actions that need one) require a reason before confirming.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  requireReason = false,
  reasonLabel = 'Reason',
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  requireReason?: boolean
  reasonLabel?: string
  busy?: boolean
  onConfirm: (reason?: string) => void
  onCancel: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null
      setReason('')
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  function handleClose() {
    onCancel()
    // showModal() already returns focus natively in most browsers, but we
    // do it explicitly so it's consistent everywhere.
    previouslyFocused.current?.focus()
  }

  function handleConfirm() {
    onConfirm(requireReason ? reason : undefined)
  }

  const confirmDisabled = busy || (requireReason && !reason.trim())

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="confirm-dialog-title"
      onCancel={(e) => {
        e.preventDefault()
        handleClose()
      }}
      onClose={handleClose}
    >
      <h2 id="confirm-dialog-title">{title}</h2>
      <p>{message}</p>

      {requireReason && (
        <div className="field">
          <label htmlFor="confirm-dialog-reason">{reasonLabel}</label>
          <textarea
            id="confirm-dialog-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={busy}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={danger ? 'btn btn-danger-solid' : 'btn btn-primary'}
          onClick={handleConfirm}
          disabled={confirmDisabled}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
