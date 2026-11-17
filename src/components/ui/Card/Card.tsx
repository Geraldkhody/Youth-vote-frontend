import type { HTMLAttributes } from 'react'
import styles from './Card.module.css'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  accentTop?: boolean
  tone?: 'surface' | 'brand'
}

export function Card({ accentTop, tone = 'surface', className, children, ...rest }: CardProps) {
  const classes = [
    styles.card,
    tone === 'brand' ? styles.brandTone : '',
    accentTop ? styles.accentTop : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
