import type { ReactNode } from 'react'
import styles from './FeatureCard.module.css'

type FeatureCardProps = {
  icon: ReactNode
  title: string
  text: string
}

export function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </div>
  )
}
