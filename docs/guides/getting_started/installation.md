---
name: Installation
order: 2
icon: download-01
---

## Install Echox

Install Echox globally or as a dev dependency:

```bash
npm install -g @sonmezerekrem/echox
```

Or add it to your project:

```bash
npm install -D @sonmezerekrem/echox
```

## Initialize a New Project

Create a new documentation site:

```bash
echox init
```

This scaffolds a minimal project with `config.json`, `assets/`, and sample content.

## Run Commands

- **Development:** `echox dev` — Start dev server with hot reload
- **Build:** `echox build` — Build static site to `./dist`
- **Preview:** `echox preview` — Preview the built site locally

When using as a local dependency, run from your docs directory or set `ECHOX_DIR`:

```bash
ECHOX_DIR=./my-docs echox dev
```
