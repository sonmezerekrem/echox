---
name: Projects
order: 2
icon: folder-library
status: draft
---

## List Projects

Retrieve all projects the authenticated user has access to.

```
GET /api/projects
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | `all` | Filter: `active`, `archived`, or `all` |
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Items per page |

### Response

```json
{
  "data": [
    {
      "id": "prj_xyz789",
      "name": "Documentation Site",
      "slug": "documentation-site",
      "status": "active",
      "members_count": 5,
      "created_at": "2025-02-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8
  }
}
```

## Create Project

```
POST /api/projects
```

### Request Body

```json
{
  "name": "New Project",
  "description": "A new documentation project",
  "visibility": "private"
}
```

## Delete Project

```
DELETE /api/projects/:id
```

Returns `204 No Content` on success.

> Deleting a project is irreversible. All associated data including pages and assets will be permanently removed.
