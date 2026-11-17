import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import styles from './ImageCard.module.css'

type ImageCardProps = {
  title: string
  line: string
  to: string
  pattern: ReactNode
}

export function ImageCard({ title, line, to, pattern }: ImageCardProps) {
  return (
    <Link to={to} className={styles.card}>
      <div className={styles.pattern} aria-hidden="true">
        {pattern}
      </div>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.line}>{line}</p>
        <span className={styles.arrow} aria-hidden="true">
          &rarr;
        </span>
      </div>
    </Link>
  )
}
