jest.mock("axios");
import axios from 'axios';

import { render, screen, waitForElementToBeRemoved } from './test-utils';
import App from './App';

jest.mock('./api.js');

test('renders MainLayout with DataTable and StatsTable', async () => {
  const data = {
    peers: [],
    Hourly: [],
    Daily: [],
    hostname: "test",
    version: "test",
  };
  axios.get.mockResolvedValue({ data: {data: data } });

  render(<MainLayout />);

  await waitFor(() => screen.getByTestId('data-table'));
  await waitFor(() => screen.getByTestId('stats-table'));

  expect(axios.get).toHaveBeenCalledTimes(1);

  // Perform your assertions on DataTable and StatsTable content here
});

test('renders learn react link', async () => {
  render(<App />);
  const loadingElement = screen.getByText(/loading/i);
  await waitForElementToBeRemoved(loadingElement);

  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
