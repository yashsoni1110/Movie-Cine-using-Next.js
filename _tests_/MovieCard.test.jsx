import { render, screen } from '@testing-library/react'
import MovieCard from '@/components/MovieCard'

test('renders movie title, rating and year', () => {
  const mockMovie = {
    title: 'Avengers',
    vote_average: 8.5,
    release_date: '2020-01-01'
  }

  render(<MovieCard movie={mockMovie} />)

  expect(
    screen.getByRole('heading', { name: /Avengers/i })
  ).toBeInTheDocument()

  expect(screen.getByText('8.5')).toBeInTheDocument()
  expect(screen.getByText('2020')).toBeInTheDocument()
})