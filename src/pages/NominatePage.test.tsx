import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NominatePage } from './NominatePage'
import * as client from '../api/client'

vi.mock('../api/client', async () => {
  const actual = await vi.importActual<typeof client>('../api/client')
  return {
    ...actual,
    getCategories: vi.fn(),
    createNomination: vi.fn(),
  }
})

const mockedGetCategories = client.getCategories as ReturnType<typeof vi.fn>
const mockedCreateNomination = client.createNomination as ReturnType<typeof vi.fn>

beforeEach(() => {
  mockedGetCategories.mockReset()
  mockedCreateNomination.mockReset()
})

describe('NominatePage', () => {
  it('shows required errors on empty submit and does not call createNomination', async () => {
    mockedGetCategories.mockResolvedValue([{ id: 1, name: 'Fashionable', code_letter: 'F', description: null, is_active: true, created_at: '' }])
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NominatePage />
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByRole('combobox')).not.toBeDisabled())

    await user.click(screen.getByRole('button', { name: /submit nomination/i }))

    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0)
    expect(mockedCreateNomination).not.toHaveBeenCalled()
  })

  it('disables the category select while categories are loading', () => {
    mockedGetCategories.mockReturnValue(new Promise(() => {})) // never resolves
    render(
      <MemoryRouter>
        <NominatePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('shows the nomination form', () => {
    mockedGetCategories.mockResolvedValue([])
    render(
      <MemoryRouter>
        <NominatePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /nominate someone/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit nomination/i })).toBeInTheDocument()
  })
})
