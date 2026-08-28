// Fetches the Hockeypuck machine-readable stats document.
import axios from "axios";
import { parseStats } from "./utils/stats";

// A dev server has no keyserver behind it, so local runs read from a public
// instance instead. Override with VITE_API_HOST.
const DEV_API_HOST = import.meta.env?.VITE_API_HOST ?? "http://keyserver.dobrev.it:11371";

const STATS_PATH = "/pks/lookup?op=stats&options=mr";

const REQUEST_TIMEOUT_MS = 15000;

// Whole hostnames are compared rather than searched for a substring, so a
// real deployment on a host such as "not-localhost.example.com" is not
// mistaken for a local one.
export function isLocalHostname(hostname) {
  const name = String(hostname ?? "");

  return (
    name === "localhost" ||
    name.endsWith(".localhost") ||
    name === "::1" ||
    name === "[::1]" ||
    // The whole 127.0.0.0/8 loopback range, not just 127.0.0.1.
    /^127\.\d+\.\d+\.\d+$/.test(name) ||
    /^192\.168\.\d+\.\d+$/.test(name)
  );
}

// import.meta.env.DEV is the unambiguous signal for `vite dev` and is always
// false in a built bundle. The hostname check additionally covers `vite
// preview` and a build opened over the LAN.
export function isLocalOrigin(location = window.location) {
  return import.meta.env?.DEV === true || isLocalHostname(location.hostname);
}

export function apiHost(location = window.location) {
  return isLocalOrigin(location) ? DEV_API_HOST : `${location.protocol}//${location.host}`;
}

export async function fetchPgpData() {
  const response = await axios.get(`${apiHost()}${STATS_PATH}`, {
    timeout: REQUEST_TIMEOUT_MS,
    headers: { Accept: "application/json" },
  });
  return parseStats(response.data);
}
