# Hockeypuck OpenPGP Stats Page

A React app that displays statistics for a [Hockeypuck](https://github.com/hockeypuck/hockeypuck)
OpenPGP keyserver deployment. It is a modern take on the
[stats page](https://github.com/hockeypuck/hockeypuck/blob/master/contrib/templates/stats.html.tmpl)
that ships with Hockeypuck, and reads the same data from the server's
machine-readable stats endpoint, `/pks/lookup?op=stats&options=mr`.

The app is built with Vite and available in 21 languages.

## Requirements

- Node.js 22 or newer
- npm 11.6 or newer, which is needed for the `min-release-age` setting in [.npmrc](./src/.npmrc)

An [.nvmrc](./.nvmrc) is provided, so `nvm use` picks the right Node version.

## Getting started

All application code lives in [src/](./src), which is the directory npm commands run from.

```sh
cd src
npm ci
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

A development server has no keyserver behind it, so local runs read from
[keyserver.dobrev.it](http://keyserver.dobrev.it:11371) instead. Point them somewhere
else with `VITE_API_HOST`:

```sh
VITE_API_HOST=http://my-keyserver.example:11371 npm start
```

In a deployed build the app always reads from the host serving it, so no configuration
is needed there.

## Available scripts

| Script | What it does |
| --- | --- |
| `npm start` | Runs the dev server on port 3000 with hot reloading. `npm run dev` is the same thing. |
| `npm test` | Runs the Vitest suite once. |
| `npm run test:watch` | Runs the suite in watch mode. |
| `npm run test:coverage` | Runs the suite and writes a coverage report. |
| `npm run build` | Builds to `build/`. |
| `npm run preview` | Serves the contents of `build/` locally, to check a production build. |

## Supply-chain settings

[.npmrc](./src/.npmrc) hardens dependency installation against the registry
compromises that have hit the npm ecosystem, and is committed deliberately:

- **`min-release-age=7`** installs only versions that have been on the registry for at
  least seven days. A malicious release published from a compromised maintainer account
  is almost always yanked well inside that window.
- **`ignore-scripts=true`** stops dependencies running `install` and `postinstall`
  scripts, which is the vector those attacks use to execute on install. Nothing in this
  dependency tree needs a build step, so the setting costs nothing here.
- **`audit-level=high`** fails an install on a known high-severity advisory rather than
  only printing a summary.

The practical consequence is that `npm install <pkg>@latest` fails when that version is
less than a week old. Pin the newest version that clears the window instead of removing
the setting. There is a copy of the file at the repository root so commands run from
either directory get the same treatment.

## The stats document

Hockeypuck renamed every key in the machine-readable stats document from the Go
exported-field spelling (`Total`, `Daily`, `Peers[].Name`) to lowerCamelCase (`total`,
`daily`, `peers[].name`). [src/src/utils/stats.js](./src/src/utils/stats.js) parses both
spellings, so the page also works against a peer that has not been upgraded yet, and it
normalises two Go rendering artifacts that would otherwise reach the screen:

- `0001-01-01T00:00:00Z`, Go's zero time, means "never" rather than the year 1.
- `%!q(<nil>)` in a peer's error field means there is no error, and a real error arrives
  wrapped in literal quote characters.

Note that only the JSON tags were renamed. The Go template field names used by the
`<noscript>` fallback in [src/index.html](./src/index.html) are still capitalised.

## Adding a language

Add a `translation.json` under [src/src/locales/](./src/src/locales), named with the
locale code, and add that code to `LANGUAGE_NAMES` in
[src/src/i18n.js](./src/src/i18n.js). The catalogues themselves are picked up from the
directory at build time, so there is no list of imports to maintain.

## Deployment

Build the app, then copy `favicon.ico`, `manifest.json`, `robots.txt` and the `assets`
folder from `build/` to the `webroot` of your Hockeypuck server. Copy `build/index.html`
to the `templates` folder, usually `/var/lib/hockeypuck/templates`, and rename it to
`modernstats.html.tmpl`. Then point the `hockeypuck` section of your configuration file
at the new template:

```toml
[hockeypuck]
...
statsTemplate="/var/lib/hockeypuck/templates/modernstats.html.tmpl"
```

Restart Hockeypuck afterwards.

## Docker

```sh
docker compose up --build
```

The [Dockerfile](./src/Dockerfile) builds the app in a Node stage and copies only the
built assets into an nginx runtime image, which serves them on port 3000 with the
single-page-app fallback configured in [nginx.conf](./src/nginx.conf). The Node
toolchain does not ship in the final image.
