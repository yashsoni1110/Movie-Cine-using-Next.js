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

import userEvent from '@testing-library/user-event';

test('triggers a fetch request on hover (API Mocking)', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ videos: { results: [] } }),
    })
  );

  const mockMovie = { id: 550, title: 'Fight Club' };
  
  render(<MovieCard movie={mockMovie} onToggleFavorite={() => {}} />);

  const heading = screen.getByRole('heading', { name: /Fight Club/i });
  await userEvent.hover(heading.parentElement);

  expect(global.fetch).toHaveBeenCalled();
  
  jest.clearAllMocks();
});
