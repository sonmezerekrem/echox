---
name: OAuth 2.0
order: 2
icon: lock
---

## Overview

For user-facing integrations, use OAuth 2.0 with the authorization code flow. This lets users grant your application access without sharing their credentials.

## Authorization Flow

### 1. Redirect to Authorization

Send users to the authorization endpoint:

```
https://auth.example.com/oauth/authorize
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=https://yourapp.com/callback
  &response_type=code
  &scope=read+write
```

### 2. Handle the Callback

After the user authorizes, they are redirected to your `redirect_uri` with a `code` parameter:

```
https://yourapp.com/callback?code=AUTH_CODE_HERE
```

### 3. Exchange for Access Token

```bash
curl -X POST https://auth.example.com/oauth/token \
  -d "grant_type=authorization_code" \
  -d "code=AUTH_CODE_HERE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=https://yourapp.com/callback"
```

### Response

```json
{
  "access_token": "at_live_abc123...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "rt_live_xyz789..."
}
```

## Scopes

| Scope | Description |
|-------|-------------|
| `read` | Read access to user data and projects |
| `write` | Create and modify resources |
| `admin` | Manage project settings and members |
| `offline_access` | Receive a refresh token |

## Refreshing Tokens

Access tokens expire after 1 hour. Use the refresh token to get a new one:

```bash
curl -X POST https://auth.example.com/oauth/token \
  -d "grant_type=refresh_token" \
  -d "refresh_token=rt_live_xyz789..."
```
