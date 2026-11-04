import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { RequireAdmin } from './RequireAdmin'
import * as client from '../api/client'
import { AuthProvider } from '../context/AuthContext'

vi.mock('../api/client', async () => {
  const actual = await vi.importActual<typeof client>('../api/client')
  return { ...actual, getCurrentAdmin: vi.fn() }
})

const mockedGetCurrentAdmin = client.getCurrentAdmin as ReturnType<typeof vi.fn>

beforeEach(() => {
  mockedGetCurrentAdmin.mockReset()
})

describe('RequireAdmin', () => {
  it('redirects to /admin/login when the user is logged out', async () => {
    mockedGetCurrentAdmin.mockRejectedValue(new client.ApiError('authentication required', 401))

    render(
      <MemoryRouter initialEntries={['/admin/nominations']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/admin/nominations"
              element={
                <RequireAdmin>
                  <p>Secret admin content</p>
                </RequireAdmin>
              }
            />
            <Route path="/admin/login" element={<p>Login page</p>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Secret admin content')).not.toBeInTheDocument()
  })
})
