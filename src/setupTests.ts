import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// RTL doesn't auto-cleanup unless the runner exposes global afterEach.
afterEach(cleanup)
