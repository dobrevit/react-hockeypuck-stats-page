// This file contains the API calls for the app
import axios from "axios";

// Set REQUEST_HOST based on the current domain
const { protocol, host, port } = window.location;
var reqhost;
if (port) {
  reqhost = `${host}:${port}`;
} else {
  reqhost = host;
}

export const REQUEST_HOST = `${protocol}//${reqhost}`;

export async function fetchPgpData() {
  // Check if host contains "localhost"
  // If so, use the local API server
  // Otherwise, use the production API server
  const isLocalhost = reqhost.includes("localhost") || reqhost.includes("192.168.");
  const apiHost = isLocalhost ? "http://keyserver.dobrev.it:11371" : REQUEST_HOST;
  const response = await axios.get(`${apiHost}/pks/lookup?op=stats&options=mr`);
  return response.data;
}
