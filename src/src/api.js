// This file contains the API calls for the app
import axios from "axios";

// Set REQUEST_HOST based on the current domain
const { protocol, host } = window.location;

export const REQUEST_HOST = `${protocol}//${host}`;

export async function fetchPgpData() {
  // Check if host contains "localhost"
  // If so, use the local API server
  // Otherwise, use the production API server
  const isLocalhost = host.includes("localhost") || host.includes("192.168.");
  const apiHost = isLocalhost ? "http://keyserver.dobrev.it:11371" : REQUEST_HOST;
  const response = await axios.get(`${apiHost}/pks/lookup?op=stats&options=mr`);
  return response.data;
}
