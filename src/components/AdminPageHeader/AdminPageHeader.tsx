import type { ReactNode } from 'react'
import styles from './AdminPageHeader.module.css'

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className={action ? `${styles.header} ${styles.withAction}` : styles.header}>
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}
