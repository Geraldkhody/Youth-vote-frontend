import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTable } from './DataTable'

describe('DataTable', () => {
  it('carries data-label attributes on cells for the phone layout', () => {
    render(
      <DataTable
        caption="People"
        colSpan={2}
        head={
          <tr>
            <th>Name</th>
            <th>Phone</th>
          </tr>
        }
      >
        <tr>
          <td data-label="Name">Jane</td>
          <td data-label="Phone">0241234567</td>
        </tr>
      </DataTable>,
    )

    const nameCell = screen.getByText('Jane')
    const phoneCell = screen.getByText('0241234567')
    expect(nameCell).toHaveAttribute('data-label', 'Name')
    expect(phoneCell).toHaveAttribute('data-label', 'Phone')
  })

  it('shows the empty state instead of rows when isEmpty is set', () => {
    render(
      <DataTable
        caption="People"
        colSpan={1}
        isEmpty
        emptyMessage="No people yet."
        head={
          <tr>
            <th>Name</th>
          </tr>
        }
      >
        <tr>
          <td>Should not render</td>
        </tr>
      </DataTable>,
    )

    expect(screen.getByText('No people yet.')).toBeInTheDocument()
    expect(screen.queryByText('Should not render')).not.toBeInTheDocument()
  })
})
