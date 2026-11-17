import type { ReactNode } from 'react'
import { LoadingSkeleton } from '../LoadingSkeleton/LoadingSkeleton'
import { EmptyState } from '../EmptyState/EmptyState'
import styles from './DataTable.module.css'

// A styled wrapper around a plain <table>: sticky header, row hover, and a
// horizontal scroll container on small screens. Below ~640px it instead
// turns each row into a stacked card -- the caller's <td> elements must
// carry a `data-label` attribute (the column header text) for that to work.
//
// `head` is the <tr> of <th>s, `children` is the <tbody> rows. When
// `isLoading`/`isEmpty` is set, a skeleton or empty-state message replaces
// the rows (colSpan should match the number of columns in `head`).
export function DataTable({
  caption,
  head,
  children,
  isLoading,
  isEmpty,
  emptyMessage = 'Nothing to show yet.',
  colSpan,
}: {
  caption: string
  head: ReactNode
  children: ReactNode
  isLoading?: boolean
  isEmpty?: boolean
  emptyMessage?: string
  colSpan: number
}) {
  return (
    <div className={styles.wrapper}>
      <table aria-label={caption}>
        <thead>{head}</thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={colSpan}>
                <LoadingSkeleton />
              </td>
            </tr>
          ) : isEmpty ? (
            <tr>
              <td colSpan={colSpan}>
                <EmptyState message={emptyMessage} />
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )
}
