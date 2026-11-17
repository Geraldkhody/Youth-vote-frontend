import type { ReactNode, Ref } from 'react'
import { useReveal } from '../../../hooks/useReveal'
import styles from './Reveal.module.css'

type RevealProps = {
  as?: 'div' | 'section'
  className?: string
  children: ReactNode
}

export function Reveal({ as = 'div', className, children }: RevealProps) {
  const { ref, revealed } = useReveal<HTMLElement>()
  const classes = `${styles.reveal} ${revealed ? styles.revealed : ''} ${className ?? ''}`.trim()

  if (as === 'section') {
    return (
      <section ref={ref as Ref<HTMLElement>} className={classes}>
        {children}
      </section>
    )
  }

  return (
    <div ref={ref as unknown as Ref<HTMLDivElement>} className={classes}>
      {children}
    </div>
  )
}
