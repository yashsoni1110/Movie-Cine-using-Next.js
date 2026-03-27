import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Search from '@/components/Search'

test('renders input with placeholder', () => {
  render(<Search placeholder="Search here" value="" onChange={() => {}} />)

  expect(
    screen.getByPlaceholderText('Search here')
  ).toBeInTheDocument()
})

test('calls onChange when typing', async () => {
  const handleChange = jest.fn()
  render(<Search placeholder="Search movie" value="" onChange={handleChange} />)

  const input = screen.getByPlaceholderText('Search movie')

  await userEvent.type(input, 'Batman')

  expect(handleChange).toHaveBeenCalledTimes(6) // B-a-t-m-a-n
  expect(handleChange).toHaveBeenCalledWith('B')
})
