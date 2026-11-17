import styles from './LoadingSkeleton.module.css'

// A handful of pulsing bars standing in for rows that haven't loaded yet.
// `rows` controls how many placeholder bars to show.
export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.bar} />
      ))}
    </div>
  )
}
