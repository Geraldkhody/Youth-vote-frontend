import type { ReactNode } from 'react'

// Wraps a row of labelled filter fields with a "Clear filters" button.
// `onClear` is only shown when provided, since not every filter set needs it.
export function FilterBar({ children, onClear }: { children: ReactNode; onClear?: () => void }) {
  return (
    <div className="filters">
      {children}
      {onClear && (
        <button type="button" className="btn btn-sm btn-secondary" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  )
}
