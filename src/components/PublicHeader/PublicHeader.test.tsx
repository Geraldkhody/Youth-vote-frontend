import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { PublicHeader } from './PublicHeader'

describe('PublicHeader', () => {
  it('toggles aria-expanded on the phone menu button', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <PublicHeader />
      </MemoryRouter>,
    )

    const toggle = screen.getByRole('button', { name: /open menu/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
