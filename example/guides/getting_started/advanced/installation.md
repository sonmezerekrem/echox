---
name: Advanced Installation
order: 1
icon: settings-02
---

## Advanced installation options

This page covers advanced installation scenarios for Echox.

### Custom install path

You can install Echox to a custom directory and add it to your PATH:

```bash
npm install echox --prefix /opt/echox
export PATH="/opt/echox/node_modules/.bin:$PATH"
```

### CI/CD

In CI pipelines, pin the version for reproducible builds:

```bash
npm install -g echox@latest
echox build
```

### Offline install

After downloading the package once, you can install from a local tarball:

```bash
npm pack echox
npm install -g echox-*.tgz
```
