import { describe, test, expect } from "vitest";
import { parseStats, parseError, parseTimestamp, peerStatsUrl, EMPTY_STATS } from "./stats";

// Trimmed from a live Hockeypuck 2.4 response.
const CURRENT_FORMAT = {
  now: "2026-08-28T09:06:07Z",
  version: "2.4",
  hostname: "keyserver.dobrev.it",
  nodename: "hkp01",
  contact: "0x283A56AE9544F3C87C71ADB0CAAAE2B8C198C9AE",
  httpAddr: "0.0.0.0:11371",
  reconAddr: "hkp01.cluster.local:11370",
  software: "Hockeypuck",
  total: 6352938,
  queryConfig: {
    selfSignedOnly: false,
    keywordSearchDisabled: false,
    enableInexactMatching: false,
  },
  peers: [
    {
      name: "fi_pgpkeys_eu",
      httpAddr: "fi.pgpkeys.eu:11371",
      reconAddr: "fi.pgpkeys.eu:11370",
      statsPath: "/pks/lookup?op=stats",
      lastIncomingRecon: "2026-08-28T08:48:59.897756195Z",
      lastIncomingError: "%!q(<nil>)",
      lastOutgoingRecon: "2026-08-28T08:06:20.291076281Z",
      lastOutgoingError: "%!q(<nil>)",
      reconStatus: "OK",
      lastRecovery: "2026-08-28T08:48:59.897737216Z",
      lastRecoveryError: "%!q(<nil>)",
      recoveryStatus: "OK",
    },
    {
      name: "keyserver_escomposlinux_org",
      httpAddr: "keyserver.escomposlinux.org:11371",
      reconAddr: "keyserver.escomposlinux.org:11370",
      statsPath: "/pks/lookup?op=stats",
      lastIncomingRecon: "0001-01-01T00:00:00Z",
      lastIncomingError: '"cannot peer: mismatched filters"',
      lastOutgoingRecon: "0001-01-01T00:00:00Z",
      lastOutgoingError: '"cannot peer: mismatched filters"',
      reconStatus: "Starting",
      lastRecovery: "0001-01-01T00:00:00Z",
      lastRecoveryError: "%!q(<nil>)",
      recoveryStatus: "Starting",
    },
  ],
  pksTargets: null,
  hourly: [
    { inserted: 1, updated: 0, removed: 0, insertedJitter: 13, removedJitter: 0, time: "2026-08-28T08:00:00Z" },
  ],
  daily: [
    { inserted: 7, updated: 5, removed: 0, insertedJitter: 40, removedJitter: 1, time: "2026-08-27T00:00:00Z" },
    { inserted: 1, updated: 0, removed: 0, insertedJitter: 13, removedJitter: 0, time: "2026-08-28T00:00:00Z" },
  ],
};

// The spelling Hockeypuck emitted before the keys were lowercased.
const LEGACY_FORMAT = {
  Now: "2026-08-28T09:06:07Z",
  Version: "2.1",
  Hostname: "keyserver.dobrev.it",
  Nodename: "hkp01",
  Contact: "0xDEADBEEF",
  HTTPAddr: "0.0.0.0:11371",
  ReconAddr: "hkp01.cluster.local:11370",
  Total: 1234,
  Peers: [{ Name: "legacy_peer", HTTPAddr: "legacy:11371", ReconAddr: "legacy:11370" }],
  Hourly: [{ Time: "2026-08-28T08:00:00Z", Inserted: 3, Updated: 2, Removed: 1 }],
  Daily: [{ Time: "2026-08-28T00:00:00Z", Inserted: 30, Updated: 20, Removed: 10 }],
};

describe("parseStats", () => {
  test("reads the lowercase keys of the current format", () => {
    const stats = parseStats(CURRENT_FORMAT);

    expect(stats.software).toBe("Hockeypuck");
    expect(stats.version).toBe("2.4");
    expect(stats.hostname).toBe("keyserver.dobrev.it");
    expect(stats.total).toBe(6352938);
    expect(stats.peers).toHaveLength(2);
    expect(stats.daily).toHaveLength(2);
    expect(stats.hourly).toHaveLength(1);
    expect(stats.now).toEqual(new Date("2026-08-28T09:06:07Z"));
  });

  test("still reads the legacy capitalised keys", () => {
    const stats = parseStats(LEGACY_FORMAT);

    expect(stats.version).toBe("2.1");
    expect(stats.total).toBe(1234);
    expect(stats.peers[0].name).toBe("legacy_peer");
    expect(stats.peers[0].httpAddr).toBe("legacy:11371");
    expect(stats.daily[0].inserted).toBe(30);
    expect(stats.hourly[0].removed).toBe(1);
  });

  test("carries the histogram counters through", () => {
    const [yesterday] = parseStats(CURRENT_FORMAT).daily;

    expect(yesterday.inserted).toBe(7);
    expect(yesterday.updated).toBe(5);
    expect(yesterday.removed).toBe(0);
    expect(yesterday.insertedJitter).toBe(40);
    expect(yesterday.time).toEqual(new Date("2026-08-27T00:00:00Z"));
  });

  test("keeps the order the server sent the histogram in", () => {
    const days = parseStats(CURRENT_FORMAT).daily.map((entry) => entry.time.toISOString());

    expect(days).toEqual(["2026-08-27T00:00:00.000Z", "2026-08-28T00:00:00.000Z"]);
  });

  test("reports a peer that has never gossiped as never, not as year 1", () => {
    const [, unpeered] = parseStats(CURRENT_FORMAT).peers;

    expect(unpeered.lastIncomingRecon).toBeNull();
    expect(unpeered.lastOutgoingRecon).toBeNull();
    expect(unpeered.lastRecovery).toBeNull();
    expect(unpeered.reconStatus).toBe("Starting");
  });

  test("unwraps peer errors and drops the nil placeholder", () => {
    const [healthy, unpeered] = parseStats(CURRENT_FORMAT).peers;

    expect(healthy.lastIncomingError).toBe("");
    expect(healthy.lastOutgoingError).toBe("");
    expect(unpeered.lastIncomingError).toBe("cannot peer: mismatched filters");
  });

  test("reads the query configuration flags", () => {
    expect(parseStats(CURRENT_FORMAT).queryConfig).toEqual({
      selfSignedOnly: false,
      keywordSearchDisabled: false,
      enableInexactMatching: false,
    });
  });

  test("returns a renderable shape for junk and for nothing at all", () => {
    for (const input of [null, undefined, "", 42, []]) {
      const stats = parseStats(input);

      expect(stats.peers).toEqual([]);
      expect(stats.daily).toEqual([]);
      expect(stats.hourly).toEqual([]);
      expect(stats.total).toBe(0);
      expect(stats.version).toBe("");
    }
  });

  test("drops histogram entries that carry no usable timestamp", () => {
    const stats = parseStats({ daily: [{ time: "not-a-date", inserted: 5 }, { time: "2026-08-28T00:00:00Z" }] });

    expect(stats.daily).toHaveLength(1);
  });

  test("EMPTY_STATS is safe to render before the first response", () => {
    expect(EMPTY_STATS.peers).toEqual([]);
    expect(EMPTY_STATS.total).toBe(0);
  });
});

describe("parseError", () => {
  test("treats the Go nil artifact as no error", () => {
    expect(parseError("%!q(<nil>)")).toBe("");
    expect(parseError("")).toBe("");
    expect(parseError(undefined)).toBe("");
  });

  test("strips the %q quoting from a real error", () => {
    expect(parseError('"read tcp: connection reset by peer"')).toBe(
      "read tcp: connection reset by peer"
    );
  });

  test("passes an unquoted error through untouched", () => {
    expect(parseError("plain failure")).toBe("plain failure");
  });
});

describe("parseTimestamp", () => {
  test("maps the Go zero time to null", () => {
    expect(parseTimestamp("0001-01-01T00:00:00Z")).toBeNull();
  });

  test("parses a nanosecond-precision timestamp", () => {
    expect(parseTimestamp("2026-08-28T08:48:59.897756195Z")).toBeInstanceOf(Date);
  });

  test("rejects anything unparseable", () => {
    expect(parseTimestamp("tomorrow")).toBeNull();
    expect(parseTimestamp(null)).toBeNull();
  });
});

describe("peerStatsUrl", () => {
  test("uses the stats path the peer advertises", () => {
    expect(peerStatsUrl(parseStats(CURRENT_FORMAT).peers[0])).toBe(
      "http://fi.pgpkeys.eu:11371/pks/lookup?op=stats"
    );
  });

  test("falls back to the default path for a legacy peer", () => {
    expect(peerStatsUrl(parseStats(LEGACY_FORMAT).peers[0])).toBe(
      "http://legacy:11371/pks/lookup?op=stats"
    );
  });

  test("returns null when there is no address to link to", () => {
    expect(peerStatsUrl({ httpAddr: "" })).toBeNull();
    expect(peerStatsUrl(null)).toBeNull();
  });
});
