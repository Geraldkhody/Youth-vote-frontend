import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroIllustration } from './HeroIllustration'

describe('HeroIllustration', () => {
  it('has a descriptive accessible name since it conveys meaning, not decoration', () => {
    render(<HeroIllustration />)
    expect(screen.getByRole('img')).toHaveAccessibleName(/celebrating/i)
  })
})
