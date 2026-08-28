// Fetches the Hockeypuck machine-readable stats document.
import axios from "axios";
import { parseStats } from "./utils/stats";

const { protocol, host } = window.location;

export const REQUEST_HOST = `${protocol}//${host}`;

// A development server has no keyserver behind it, so point local runs at a
// public instance instead. Override with VITE_API_HOST when you have your own.
const DEV_API_HOST = import.meta.env?.VITE_API_HOST ?? "http://keyserver.dobrev.it:11371";

const STATS_PATH = "/pks/lookup?op=stats&options=mr";

const REQUEST_TIMEOUT_MS = 15000;

function apiHost() {
  const isLocalhost = host.includes("localhost") || host.includes("192.168.");
  return isLocalhost ? DEV_API_HOST : REQUEST_HOST;
}

export async function fetchPgpData() {
  const response = await axios.get(`${apiHost()}${STATS_PATH}`, {
    timeout: REQUEST_TIMEOUT_MS,
    headers: { Accept: "application/json" },
  });
  return parseStats(response.data);
}
