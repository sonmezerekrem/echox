---
name: Installation
order: 2
icon: download-04
---

## Prerequisites

> [!NOTE]
> EchoDocs requires Node.js 18 or later. Check your version with `node --version`.

- **Node.js** 18 or later
- **npm**, **yarn**, or **pnpm**

## Install Globally

```bash
npm install -g echodocs
```

Once installed, the `echodocs` command is available anywhere on your system.

## Using npx

If you prefer not to install globally, use npx:

```bash
npx echodocs dev
```

## Using Docker

Pull the official image and mount your docs directory:

```bash
docker run -v $(pwd):/docs -p 4321:4321 echodocs dev --host
```

For production builds:

```bash
docker run -v $(pwd):/docs echodocs build
```

The static output will be in `./dist`.

## Verify Installation

Run the following to confirm everything is working:

```bash
echodocs --version
```

You should see the current version number printed to your terminal.

## Troubleshooting

:::accordion{title="Command not found: echodocs"}
Make sure you installed globally with `npm install -g echodocs`. If using a Node version manager (nvm, fnm), ensure the global bin directory is in your PATH.
:::

:::accordion{title="Port already in use"}
If port 4321 is busy, EchoDocs will automatically try the next available port. You can also specify a port: `echodocs dev --port 3000`.
:::

> [!WARNING]
> On Windows, use PowerShell or WSL. The Docker volume mount syntax `$(pwd)` may differ on Windows CMD.
