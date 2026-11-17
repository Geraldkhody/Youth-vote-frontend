import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ImageCard } from './ImageCard'
import { PatternBackground } from '../../illustrations/PatternBackground/PatternBackground'

describe('ImageCard', () => {
  it('marks its decorative pattern background as aria-hidden', () => {
    const { container } = render(
      <MemoryRouter>
        <ImageCard title="Youth Leader" line="See nominees" to="/nominees" pattern={<PatternBackground variant={0} />} />
      </MemoryRouter>,
    )

    const pattern = container.querySelector('[aria-hidden="true"]')
    expect(pattern).toBeInTheDocument()
  })
})
