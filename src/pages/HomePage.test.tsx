import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { HomePage } from './HomePage'
import * as client from '../api/client'

vi.mock('../api/client', async () => {
  const actual = await vi.importActual<typeof client>('../api/client')
  return { ...actual, getCategories: vi.fn() }
})

const mockedGetCategories = client.getCategories as ReturnType<typeof vi.fn>

beforeEach(() => {
  mockedGetCategories.mockReset()
})

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  it('shows a "Nominate someone" button linking to /nominate', async () => {
    mockedGetCategories.mockResolvedValue([])
    renderHomePage()

    const links = await screen.findAllByRole('link', { name: /nominate someone/i })
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => expect(link).toHaveAttribute('href', '/nominate'))
  })

  it('shows a category card for each active category returned by the API', async () => {
    mockedGetCategories.mockResolvedValue([
      { id: 1, name: 'Most Supportive', code_letter: 'A', description: 'For the biggest cheerleader', is_active: true, created_at: '' },
      { id: 2, name: 'Youth Leader', code_letter: 'B', description: null, is_active: true, created_at: '' },
    ])
    renderHomePage()

    expect(await screen.findByText('Most Supportive')).toBeInTheDocument()
    expect(screen.getByText('For the biggest cheerleader')).toBeInTheDocument()
    expect(screen.getByText('Youth Leader')).toBeInTheDocument()
  })

  it('shows a friendly message when there are no categories', async () => {
    mockedGetCategories.mockResolvedValue([])
    renderHomePage()

    expect(await screen.findByText(/categories will be published here soon/i)).toBeInTheDocument()
  })
})
