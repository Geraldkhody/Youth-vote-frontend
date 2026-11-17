import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminLayout } from './AdminLayout'
import { AuthProvider } from '../../context/AuthContext'
import * as client from '../../api/client'

vi.mock('../../api/client', async () => {
  const actual = await vi.importActual<typeof client>('../../api/client')
  return { ...actual, getCurrentAdmin: vi.fn() }
})

const mockedGetCurrentAdmin = client.getCurrentAdmin as ReturnType<typeof vi.fn>

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/admin/nominations']}>
      <AuthProvider>
        <AdminLayout>
          <p>Page content</p>
        </AdminLayout>
      </AuthProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  mockedGetCurrentAdmin.mockReset().mockResolvedValue({ name: 'Admin User', email: 'admin@example.com' })
})

describe('AdminLayout mobile drawer', () => {
  it('sets aria-expanded on the menu button and toggles it on click', async () => {
    const user = userEvent.setup()
    renderLayout()

    const menuButton = await screen.findByRole('button', { name: /menu/i })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes the drawer on Escape', async () => {
    const user = userEvent.setup()
    renderLayout()

    const menuButton = await screen.findByRole('button', { name: /menu/i })
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })
})
