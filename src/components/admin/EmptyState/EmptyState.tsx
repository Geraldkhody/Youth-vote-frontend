import styles from './EmptyState.module.css'

// Calm, no illustration -- just a clear message for an empty table/list.
export function EmptyState({ message }: { message: string }) {
  return <p className={styles.emptyState}>{message}</p>
}
