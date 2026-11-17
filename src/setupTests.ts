import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// RTL doesn't auto-cleanup unless the runner exposes global afterEach.
afterEach(cleanup)

// jsdom doesn't implement the native <dialog> modal API (showModal/close,
// or Escape-to-cancel) -- ConfirmDialog and the nominee detail panel rely
// on both, so we polyfill just enough of it for tests. Real browsers
// already do this natively; this only runs under jsdom.
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    const openDialogs = document.querySelectorAll<HTMLDialogElement>('dialog[open]')
    const topDialog = openDialogs[openDialogs.length - 1]
    if (!topDialog) return

    const cancelEvent = new Event('cancel', { cancelable: true })
    topDialog.dispatchEvent(cancelEvent)
    if (!cancelEvent.defaultPrevented) {
      topDialog.close()
    }
  })
}
