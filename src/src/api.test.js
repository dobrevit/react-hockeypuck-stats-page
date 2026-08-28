import { describe, test, expect, vi, afterEach } from "vitest";
import { isLocalHostname, isLocalOrigin, apiHost } from "./api";

const at = (href) => new URL(href);

afterEach(() => {
  vi.unstubAllEnvs();
});

// Tested as a pure function so the assertions are about the hostname rules
// themselves, not about import.meta.env.DEV being true under the test runner.
describe("isLocalHostname", () => {
  test.each(["localhost", "app.localhost", "127.0.0.1", "127.1.2.3", "192.168.1.50", "::1", "[::1]"])(
    "%s is local",
    (hostname) => {
      expect(isLocalHostname(hostname)).toBe(true);
    }
  );

  test.each([
    "keyserver.dobrev.it",
    "pgp.example.org",
    // Substring matching used to misclassify all three of these as local.
    "not-localhost.example.com",
    "localhost.attacker.example",
    "192.168.example.com",
  ])("%s is remote", (hostname) => {
    expect(isLocalHostname(hostname)).toBe(false);
  });

  test.each([undefined, null, ""])("%s is remote", (hostname) => {
    expect(isLocalHostname(hostname)).toBe(false);
  });
});

describe("isLocalOrigin", () => {
  test("is true under the dev server whatever the hostname", () => {
    vi.stubEnv("DEV", true);
    expect(isLocalOrigin(at("https://keyserver.dobrev.it/"))).toBe(true);
  });

  test("falls back to the hostname in a built bundle", () => {
    vi.stubEnv("DEV", false);
    expect(isLocalOrigin(at("https://keyserver.dobrev.it/"))).toBe(false);
    expect(isLocalOrigin(at("http://127.0.0.1:3000/"))).toBe(true);
  });
});

describe("apiHost", () => {
  test("reads from the serving origin in a deployed build", () => {
    vi.stubEnv("DEV", false);
    expect(apiHost(at("https://keyserver.dobrev.it/"))).toBe("https://keyserver.dobrev.it");
    expect(apiHost(at("http://pgp.example.org:11371/"))).toBe("http://pgp.example.org:11371");
  });

  test("uses the development keyserver for every local origin", () => {
    vi.stubEnv("DEV", false);
    for (const href of ["http://localhost:3000/", "http://127.0.0.1:3000/", "http://192.168.1.50:5173/"]) {
      expect(apiHost(at(href))).toBe("http://keyserver.dobrev.it:11371");
    }
  });
});
