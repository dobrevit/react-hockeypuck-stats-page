import { describe, test, expect } from "vitest";
import { render, screen } from "../test-utils.jsx";
import DataTable from "./DataTable.jsx";
import { parseStats } from "../utils/stats";

const withPeers = (peers) => parseStats({ peers });

describe("DataTable", () => {
  test("links a peer that advertises an HTTP address", () => {
    render(
      <DataTable
        data={withPeers([
          {
            name: "fi_pgpkeys_eu",
            httpAddr: "fi.pgpkeys.eu:11371",
            reconAddr: "fi.pgpkeys.eu:11370",
            statsPath: "/pks/lookup?op=stats",
            reconStatus: "OK",
          },
        ])}
      />
    );

    expect(screen.getByRole("link", { name: /fi_pgpkeys_eu/i })).toHaveAttribute(
      "href",
      "http://fi.pgpkeys.eu:11371/pks/lookup?op=stats"
    );
  });

  test("renders a peer with no HTTP address as text rather than a dead anchor", () => {
    render(
      <DataTable
        data={withPeers([
          { name: "recon_only_peer", httpAddr: "", reconAddr: "recon.example:11370", reconStatus: "OK" },
        ])}
      />
    );

    expect(screen.getByText("recon_only_peer")).toBeInTheDocument();
    // An anchor without an href is not focusable and is not exposed as a link.
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(document.querySelector("a:not([href])")).toBeNull();
  });

  test("hangs the reported error off the status", () => {
    render(
      <DataTable
        data={withPeers([
          {
            name: "broken_peer",
            httpAddr: "broken.example:11371",
            reconAddr: "broken.example:11370",
            reconStatus: "Starting",
            lastIncomingError: '"cannot peer: mismatched filters"',
          },
        ])}
      />
    );

    expect(screen.getByText(/Starting/)).toBeInTheDocument();
  });

  test("says so when there are no peers at all", () => {
    render(<DataTable data={withPeers([])} />);

    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });
});
