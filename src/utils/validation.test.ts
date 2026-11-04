import { describe, expect, it } from 'vitest'
import { validatePhone } from './validation'

describe('validatePhone', () => {
  it.each(['0244123456', '233244123456', '+233244123456'])('accepts %s', (value) => {
    expect(validatePhone(value)).toBe(true)
  })

  it.each(['02441 234 56', '233-244-123-456', '+233 244 123 456'])(
    'accepts %s with spaces or dashes',
    (value) => {
      expect(validatePhone(value)).toBe(true)
    },
  )

  it.each(['123', '', '0344123'])('rejects %s', (value) => {
    expect(validatePhone(value)).toBe(false)
  })
})
