import type { ReactNode } from 'react'
import styles from './StepCard.module.css'

type StepCardProps = {
  number: string
  icon: ReactNode
  title: string
  text: string
}

export function StepCard({ number, icon, title, text }: StepCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </div>
  )
}
