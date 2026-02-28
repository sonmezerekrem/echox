# Echox

Static documentation site builder powered by Astro. Build docs from markdown, optional OpenAPI, and file-based tasks.

## Install globally (GitHub Packages)

After pushing to `main`, the package is published to GitHub Packages with the version from `package.json`. Bump `version` in `package.json` before pushing when you want a new release.

**One-time setup:** tell npm to use GitHub Packages for this scope (use your GitHub username or org instead of `sonmezerekrem` if you forked):

```bash
echo "@sonmezerekrem:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

Authenticate (required for private repos; use a [personal access token](https://github.com/settings/tokens) with `read:packages`):

```bash
npm login --registry=https://npm.pkg.github.com
# Username: your-github-username
# Password: your-personal-access-token
```

**Install the CLI:**

```bash
npm install -g @sonmezerekrem/echox
```

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
