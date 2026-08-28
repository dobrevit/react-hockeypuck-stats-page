// Parser for the Hockeypuck machine-readable stats document, served from
// /pks/lookup?op=stats&options=mr
//
// Hockeypuck renamed every key in that document from the Go exported-field
// spelling ("Total", "Daily", "Peers[].Name") to lowerCamelCase ("total",
// "daily", "peers[].name"). Reading both spellings keeps this page working
// against a peer that has not been upgraded yet, and means a future rename
// only has to be added here rather than chased through the components.
//
// Everything below returns a fully populated object with sensible zero
// values, so components never have to guard against a missing branch.

// Go's zero time. Hockeypuck emits it for "this has never happened".
const GO_ZERO_TIME = "0001-01-01T00:00:00Z";

// A nil error rendered through Go's %q verb. Not something to show a user.
const GO_NIL_ERROR = "%!q(<nil>)";

const DEFAULT_STATS_PATH = "/pks/lookup?op=stats";

// Returns the first key that the document actually carries. Checked against
// undefined and null only, so a legitimate 0 or "" is still returned.
function pick(source, ...names) {
  if (!source || typeof source !== "object") {
    return undefined;
  }
  for (const name of names) {
    if (source[name] !== undefined && source[name] !== null) {
      return source[name];
    }
  }
  return undefined;
}

function text(value) {
  return typeof value === "string" ? value : "";
}

function count(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

// Timestamps arrive as RFC 3339. Returns null for "never" and for anything
// unparseable, which callers render as a dash rather than "Invalid Date".
export function parseTimestamp(value) {
  if (typeof value !== "string" || value === "" || value === GO_ZERO_TIME) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// Peer errors are %q-formatted, so a real error arrives wrapped in literal
// quote characters and the absence of one arrives as the %!q(<nil>) artifact.
// Returns "" when there is no error to report.
export function parseError(value) {
  const trimmed = text(value).trim();
  if (trimmed === "" || trimmed === GO_NIL_ERROR) {
    return "";
  }
  if (trimmed.length > 1 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

function parseHistogram(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }
  return entries
    .map((entry) => ({
      time: parseTimestamp(pick(entry, "time", "Time")),
      inserted: count(pick(entry, "inserted", "Inserted")),
      updated: count(pick(entry, "updated", "Updated")),
      removed: count(pick(entry, "removed", "Removed")),
      insertedJitter: count(pick(entry, "insertedJitter", "InsertedJitter")),
      removedJitter: count(pick(entry, "removedJitter", "RemovedJitter")),
    }))
    .filter((entry) => entry.time !== null);
}

function parsePeers(peers) {
  if (!Array.isArray(peers)) {
    return [];
  }
  return peers.map((peer) => ({
    name: text(pick(peer, "name", "Name")),
    httpAddr: text(pick(peer, "httpAddr", "HTTPAddr")),
    reconAddr: text(pick(peer, "reconAddr", "ReconAddr")),
    statsPath: text(pick(peer, "statsPath", "StatsPath")) || DEFAULT_STATS_PATH,
    reconStatus: text(pick(peer, "reconStatus", "ReconStatus")),
    recoveryStatus: text(pick(peer, "recoveryStatus", "RecoveryStatus")),
    lastIncomingRecon: parseTimestamp(pick(peer, "lastIncomingRecon", "LastIncomingRecon")),
    lastOutgoingRecon: parseTimestamp(pick(peer, "lastOutgoingRecon", "LastOutgoingRecon")),
    lastRecovery: parseTimestamp(pick(peer, "lastRecovery", "LastRecovery")),
    lastIncomingError: parseError(pick(peer, "lastIncomingError", "LastIncomingError")),
    lastOutgoingError: parseError(pick(peer, "lastOutgoingError", "LastOutgoingError")),
    lastRecoveryError: parseError(pick(peer, "lastRecoveryError", "LastRecoveryError")),
  }));
}

export function parseStats(payload) {
  const raw = payload && typeof payload === "object" ? payload : {};
  const queryConfig = pick(raw, "queryConfig", "QueryConfig") ?? {};

  return {
    now: parseTimestamp(pick(raw, "now", "Now")),
    software: text(pick(raw, "software", "Software")),
    version: text(pick(raw, "version", "Version")),
    hostname: text(pick(raw, "hostname", "Hostname")),
    nodename: text(pick(raw, "nodename", "Nodename")),
    contact: text(pick(raw, "contact", "Contact")),
    httpAddr: text(pick(raw, "httpAddr", "HTTPAddr")),
    reconAddr: text(pick(raw, "reconAddr", "ReconAddr")),
    total: count(pick(raw, "total", "Total")),
    peers: parsePeers(pick(raw, "peers", "Peers")),
    hourly: parseHistogram(pick(raw, "hourly", "Hourly")),
    daily: parseHistogram(pick(raw, "daily", "Daily")),
    queryConfig: {
      selfSignedOnly: pick(queryConfig, "selfSignedOnly", "SelfSignedOnly") === true,
      keywordSearchDisabled:
        pick(queryConfig, "keywordSearchDisabled", "KeywordSearchDisabled") === true,
      enableInexactMatching:
        pick(queryConfig, "enableInexactMatching", "EnableInexactMatching") === true,
    },
  };
}

// The shape components render before the first response arrives.
export const EMPTY_STATS = parseStats(null);

// Peers advertise where their own stats live, so link to that rather than
// assuming every peer serves the document at the same path.
export function peerStatsUrl(peer) {
  if (!peer?.httpAddr) {
    return null;
  }
  return `http://${peer.httpAddr}${peer.statsPath}`;
}
