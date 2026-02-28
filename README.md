# Echox

Static documentation site builder powered by Astro. Build docs from markdown, optional OpenAPI, and file-based tasks.

## Install globally (GitHub Packages)

After pushing to `main`, the package is published to GitHub Packages with the version from `package.json`. Bump `version` in `package.json` before pushing when you want a new release.

**One-time setup:** you must tell npm to use GitHub Packages for this scope first; otherwise `npm install` will hit the public npm registry and get 404.

```bash
echo "@sonmezerekrem:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

Then authenticate (required for private repos; use a [personal access token](https://github.com/settings/tokens) with `read:packages`):

```bash
npm login --registry=https://npm.pkg.github.com
# Username: your-github-username
# Password: your-personal-access-token
```

**Install the CLI:**

```bash
npm install -g @sonmezerekrem/echox
```

**If you see `404 Not Found` or "not in this registry":** the package is on GitHub Packages, not npmjs.org. Ensure `~/.npmrc` contains `@sonmezerekrem:registry=https://npm.pkg.github.com` and that you are logged in with `npm login --registry=https://npm.pkg.github.com` (Password = GitHub personal access token with `read:packages`).

**If you see "Access token expired or revoked":** run `npm login --registry=https://npm.pkg.github.com` again and use a valid [GitHub PAT](https://github.com/settings/tokens) (with `read:packages`).

Then run:

```bash
echox dev    # develop with example content
echox build  # build static site
echox preview
echox init   # scaffold content/, assets/, config.json
```

## Development

```bash
npm install
npm run dev   # ECHOX_DIR=./example
npm run build
npm run preview
```

See [AGENTS.md](./AGENTS.md) for project layout and conventions.
