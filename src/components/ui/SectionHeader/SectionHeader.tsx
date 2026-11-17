import type { ReactNode } from 'react'
import styles from './SectionHeader.module.css'

type SectionHeaderProps = {
  eyebrow: string
  heading: ReactNode
  support?: ReactNode
  align?: 'left' | 'center'
}

export function SectionHeader({ eyebrow, heading, support, align = 'center' }: SectionHeaderProps) {
  return (
    <div className={`${styles.header} ${align === 'center' ? styles.center : ''}`}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.heading}>{heading}</h2>
      {support && <p className={styles.support}>{support}</p>}
    </div>
  )
}
