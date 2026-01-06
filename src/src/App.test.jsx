import { describe, test, expect } from 'vitest';
import { render, screen } from './test-utils.jsx';
import App from './App.jsx';

describe('App', () => {
  test('renders main layout with page title', async () => {
    render(<App />);

    // Check that the main page title is rendered
    const titleElement = screen.getByText(/Hockeypuck PGP Server Stats/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders settings section', async () => {
    render(<App />);

    const settingsElement = screen.getByText(/Settings/i);
    expect(settingsElement).toBeInTheDocument();
  });
});
