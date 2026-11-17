import type { ReactNode } from 'react'
import styles from './PageHeader.module.css'

// The single h1 for an admin page: title, a one-line description, and an
// optional actions area on the right (e.g. "+ Add category").
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className={actions ? `${styles.header} ${styles.withActions}` : styles.header}>
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
