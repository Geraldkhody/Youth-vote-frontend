import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Accordion } from './Accordion'

const ITEMS = [
  { question: 'Does it cost anything to nominate someone?', answer: 'No, nominating is free.' },
  { question: 'How much does a vote cost?', answer: 'Each vote costs GH₵1.00.' },
]

describe('Accordion', () => {
  it('opens and closes an item when its summary is clicked', async () => {
    const user = userEvent.setup()
    render(<Accordion items={ITEMS} />)

    const summary = screen.getByText(ITEMS[0].question).closest('summary')!
    const details = summary.closest('details')!

    expect(details).not.toHaveAttribute('open')

    await user.click(summary)
    expect(details).toHaveAttribute('open')

    await user.click(summary)
    expect(details).not.toHaveAttribute('open')
  })
})
