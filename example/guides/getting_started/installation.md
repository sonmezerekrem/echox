---
name: Installation
order: 2
icon: download-04
---

## Prerequisites

> [!NOTE]
> Echox requires Node.js 18 or later. Check your version with `node --version`.

- **Node.js** 18 or later
- **npm**, **yarn**, or **pnpm**

## Install Globally

```bash
npm install -g echox
```

Once installed, the `echox` command is available anywhere on your system.

## Using npx

If you prefer not to install globally, use npx:

```bash
npx echox dev
```

## Using Docker

Pull the official image and mount your docs directory:

```bash
docker run -v $(pwd):/docs -p 4321:4321 echox dev --host
```

For production builds:

```bash
docker run -v $(pwd):/docs echox build
```

The static output will be in `./dist`.

## Verify Installation

Run the following to confirm everything is working:

```bash
echox --version
```

You should see the current version number printed to your terminal.

## Troubleshooting

:::accordion{title="Command not found: echox"}
Make sure you installed globally with `npm install -g echox`. If using a Node version manager (nvm, fnm), ensure the global bin directory is in your PATH.
:::

:::accordion{title="Port already in use"}
If port 4321 is busy, Echox will automatically try the next available port. You can also specify a port: `echox dev --port 3000`.
:::

> [!WARNING]
> On Windows, use PowerShell or WSL. The Docker volume mount syntax `$(pwd)` may differ on Windows CMD.
