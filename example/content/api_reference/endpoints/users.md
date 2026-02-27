---
name: Users
order: 1
icon: user
---

## List Users

Retrieve a paginated list of all users.

```
GET /api/users
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Items per page (max 100) |
| `sort` | string | `created_at` | Sort field |
| `order` | string | `desc` | Sort order: `asc` or `desc` |

### Response

```json
{
  "data": [
    {
      "id": "usr_abc123",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "admin",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 142
  }
}
```

## Get User

Retrieve a single user by ID.

```
GET /api/users/:id
```

### Response

```json
{
  "id": "usr_abc123",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin",
  "created_at": "2025-01-15T10:30:00Z",
  "last_login": "2025-03-10T08:15:00Z"
}
```

## Create User

```
POST /api/users
```

### Request Body

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "role": "member"
}
```

> All endpoints require a valid API key passed in the `Authorization` header.
