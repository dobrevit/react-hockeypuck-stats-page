import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from './test-utils.jsx';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { parseStats } from './utils/stats';

const fetchPgpData = vi.hoisted(() => vi.fn());
vi.mock('./api', () => ({ fetchPgpData }));

const RESPONSE = {
  now: '2026-08-28T09:06:07Z',
  software: 'Hockeypuck',
  version: '2.4',
  hostname: 'keyserver.dobrev.it',
  nodename: 'hkp01',
  contact: '0xDEADBEEF',
  httpAddr: '0.0.0.0:11371',
  reconAddr: 'hkp01.cluster.local:11370',
  total: 6352938,
  peers: [
    {
      name: 'fi_pgpkeys_eu',
      httpAddr: 'fi.pgpkeys.eu:11371',
      reconAddr: 'fi.pgpkeys.eu:11370',
      statsPath: '/pks/lookup?op=stats',
      reconStatus: 'OK',
      lastIncomingRecon: '2026-08-28T08:48:59Z',
      lastIncomingError: '%!q(<nil>)',
    },
  ],
  daily: [{ time: '2026-08-27T00:00:00Z', inserted: 1234, updated: 5, removed: 0 }],
  hourly: [{ time: '2026-08-27T08:00:00Z', inserted: 7, updated: 2, removed: 1 }],
};

beforeEach(() => {
  fetchPgpData.mockReset();
  fetchPgpData.mockResolvedValue(parseStats(RESPONSE));
});

describe('App', () => {
  test('renders main layout with page title', async () => {
    render(<App />);

    expect(await screen.findByText(/Hockeypuck PGP Server Stats/i)).toBeInTheDocument();
  });

  test('renders settings section', async () => {
    render(<App />);

    expect(await screen.findByText(/^Settings$/)).toBeInTheDocument();
  });

  // MUI 9 stopped hoisting shorthand system props (display="flex") into sx and
  // now drops them silently, which stacked the header instead of laying it out
  // as a row. Nothing else in the suite would notice that.
  test('lays the header out as a row rather than stacking it', async () => {
    render(<App />);

    const title = await screen.findByText(/Hockeypuck PGP Server Stats/i);
    const headerRow = title.parentElement;
    expect(getComputedStyle(headerRow)).toMatchObject({
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    });

    const controls = title.nextElementSibling;
    expect(getComputedStyle(controls)).toMatchObject({
      display: 'flex',
      alignItems: 'center',
    });
  });

  test('renders the values from the lowercase stats document', async () => {
    render(<App />);

    // Would render blank against the pre-2.2 capitalised key names.
    expect(await screen.findByText('keyserver.dobrev.it')).toBeInTheDocument();
    expect(screen.getByText('Hockeypuck 2.4')).toBeInTheDocument();
    expect(screen.getByText('hkp01')).toBeInTheDocument();
    expect(screen.getByText('hkp01.cluster.local:11370')).toBeInTheDocument();
    expect(screen.getByText(new Intl.NumberFormat().format(6352938))).toBeInTheDocument();
  });

  test('lists gossip peers and links to their stats page', async () => {
    render(<App />);

    expect(await screen.findByText('fi_pgpkeys_eu')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /fi_pgpkeys_eu/i });
    expect(link).toHaveAttribute('href', 'http://fi.pgpkeys.eu:11371/pks/lookup?op=stats');
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  test('renders the daily histogram', async () => {
    render(<App />);

    expect(await screen.findByText(new Intl.NumberFormat().format(1234))).toBeInTheDocument();
  });

  test('expands a day to reveal its hourly rows', async () => {
    const user = userEvent.setup();
    render(<App />);

    // The hourly sub-table is unmounted until its day is expanded.
    expect(await screen.findByText('fi_pgpkeys_eu')).toBeInTheDocument();
    expect(screen.queryByText('7')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /expand row/i }));

    expect(await screen.findByText('7')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /collapse row/i })).toBeInTheDocument();
  });

  test('surfaces a failed fetch instead of rendering a blank page', async () => {
    fetchPgpData.mockRejectedValue(new Error('Network Error'));
    render(<App />);

    expect(await screen.findByText(/Could not load statistics/i)).toBeInTheDocument();
    expect(screen.getByText(/Network Error/)).toBeInTheDocument();
  });
});
