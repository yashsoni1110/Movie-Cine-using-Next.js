// File: _tests_/Navbar.test.jsx

import { render, screen } from '@testing-library/react';
import Navbar from '../src/components/Navbar';
// We need your FavoritesProvider to wrap the test!
import { FavoritesProvider } from '../src/context/FavoritesContext';

// --- POINT 5: MOCKING NEXT ROUTER & SEARCH PARAMS ---
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    // Faking the URL parameters (like ?q=Batman)
    return {
      get: () => '',
      toString: () => ''
    };
  }
}));

// --- POINT 7: WRAPPING IN STATE PROVIDER ---
test('renders Navbar wrapped in Favorites Context', () => {
  render(
    <FavoritesProvider>
      <Navbar />
    </FavoritesProvider>
  );

  // Verification: Ensure the component rendered successfully
  expect(screen.getByText('Favorites', { selector: 'span' })).toBeInTheDocument();
});
