import { render, screen } from '@testing-library/react'
import TrailerButton from '@/components/TrailerButton'

test('renders button with custom label', () => {
  render(<TrailerButton label="Watch Now" />)

  expect(screen.getByText('Watch Now')).toBeInTheDocument()
})