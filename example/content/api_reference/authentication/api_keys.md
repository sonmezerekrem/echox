---
name: API Keys
order: 1
icon: key-02
---

## Overview

All API requests must include an API key for authentication. Keys are scoped to a specific project and can have different permission levels.

## Creating an API Key

Generate a new key from the project settings dashboard, or use the API:

```
POST /api/projects/:id/keys
```

### Request Body

```json
{
  "name": "CI/CD Pipeline",
  "permissions": ["read", "write"],
  "expires_at": "2026-01-01T00:00:00Z"
}
```

### Response

```json
{
  "id": "key_m3k9x2",
  "name": "CI/CD Pipeline",
  "token": "pk_live_abc123xyz789...",
  "permissions": ["read", "write"],
  "expires_at": "2026-01-01T00:00:00Z",
  "created_at": "2025-06-15T09:00:00Z"
}
```

> The full token is only shown once at creation. Store it securely.

## Using API Keys

Pass the key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer pk_live_abc123xyz789" \
  https://api.example.com/api/users
```

## Permission Levels

| Permission | Description |
|------------|-------------|
| `read` | Read-only access to resources |
| `write` | Create and update resources |
| `admin` | Full access including deletion and settings |

## Revoking a Key

```
DELETE /api/projects/:id/keys/:key_id
```

Revoked keys immediately stop working for all future requests.
