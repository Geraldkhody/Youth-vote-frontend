import styles from './Accordion.module.css'

export type AccordionItem = {
  question: string
  answer: string
}

type AccordionProps = {
  items: AccordionItem[]
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <details className={styles.item} key={item.question}>
          <summary className={styles.summary}>
            <span>{item.question}</span>
            <span className={styles.chevron} aria-hidden="true">
              &#9660;
            </span>
          </summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
