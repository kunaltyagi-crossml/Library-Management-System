# API Routes Documentation

This directory contains Next.js API routes that provide server-side functionality.

## Available Routes

### 1. Health Check
**Endpoint:** `GET /api/health`

Simple health check to verify the application is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-07T12:00:00.000Z",
  "service": "Library Management Frontend",
  "version": "1.0.0"
}
```

**Usage:**
```javascript
const response = await fetch('/api/health');
const data = await response.json();
console.log(data.status); // "healthy"
```

---

### 2. Logout
**Endpoint:** `POST /api/auth/logout`

Handles user logout. Can be extended to blacklist tokens on the backend.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Usage:**
```javascript
const response = await fetch('/api/auth/logout', {
  method: 'POST'
});
```

---

### 3. Proxy (Optional)
**Endpoint:** `ALL /api/proxy/*`

Acts as a proxy to the Django backend. Useful for avoiding CORS issues.

**Usage:**
```javascript
// Instead of calling http://localhost:8000/api/books/
// You can call /api/proxy/books/
const response = await fetch('/api/proxy/books/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Configuration:**
Set `BACKEND_URL` in `.env.local`:
```
BACKEND_URL=http://localhost:8000/api
```

---

### 4. File Upload
**Endpoint:** `POST /api/upload`

Handles file uploads (images only).

**Limits:**
- Max file size: 5MB
- Allowed types: JPEG, PNG, WebP

**Request:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.url); // "/uploads/1234567890_image.jpg"
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "url": "/uploads/1234567890_image.jpg",
  "filename": "1234567890_image.jpg",
  "size": 123456,
  "type": "image/jpeg"
}
```

**Note:** In production, replace this with cloud storage (AWS S3, Cloudinary, etc.)

---

## When to Use These Routes

### Use the Proxy Route When:
- You want to avoid CORS issues during development
- You need to hide your backend URL from the client
- You want to add server-side logging or middleware
- You need to transform requests/responses

### Use Direct API Calls When:
- CORS is properly configured on your backend
- You want to reduce latency (no extra hop)
- Your backend URL is already public

## Directory Structure

```
app/api/
├── health/
│   └── route.ts          # Health check endpoint
├── auth/
│   └── logout/
│       └── route.ts      # Logout endpoint
├── proxy/
│   └── [...path]/
│       └── route.ts      # Proxy to backend
├── upload/
│   └── route.ts          # File upload handler
└── README.md             # This file
```

## Adding New Routes

To create a new API route:

1. Create a folder in `app/api/`
2. Add a `route.ts` file
3. Export HTTP method handlers

Example:
```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
```

## Security Considerations

- Always validate input
- Implement rate limiting for production
- Add authentication where needed
- Sanitize file uploads
- Use HTTPS in production
- Set appropriate CORS headers
- Never expose sensitive data in responses

## Testing

Test your API routes:

```bash
# Health check
curl http://localhost:3000/api/health

# Logout
curl -X POST http://localhost:3000/api/auth/logout

# Upload (with file)
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/image.jpg"
```

## Environment Variables

Required in `.env.local`:
```
BACKEND_URL=http://localhost:8000/api  # For proxy route
```
