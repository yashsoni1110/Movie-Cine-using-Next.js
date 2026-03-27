import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from '@/components/Counter'

test('increments count when button clicked', async () => {
  render(<Counter />)

  const button = screen.getByText('Increment')

  await userEvent.click(button)

  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})