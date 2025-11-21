# Authentication

## 🔐 Overview

Reluv Backend menggunakan JWT (JSON Web Tokens) untuk authentication. Sistem ini mendukung multiple authentication methods termasuk email/password dan OAuth (Google, Facebook).

## 🔑 Authentication Methods

### 1. Email/Password Authentication

#### Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Resource created successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "firstName": "John"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "firstName": "John"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. OAuth Authentication

#### Google OAuth

```http
GET /api/v1/auth/google
```

Redirects ke Google OAuth consent screen.

#### Facebook OAuth

```http
GET /api/v1/auth/facebook
```

Redirects ke Facebook OAuth consent screen.

## 🎫 JWT Token

### Token Structure

JWT token terdiri dari 3 parts:

1. Header
2. Payload (berisi user data)
3. Signature

### Token Payload

```json
{
  "sub": 1,
  "email": "john@example.com",
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Token Expiration

Default: 7 days (dapat diubah di `.env` dengan `JWT_EXPIRES_IN`)

## 🔒 Using Authentication

### Include Token in Requests

Setelah login, include token di Authorization header:

```http
GET /api/v1/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example with cURL

```bash
curl -X GET http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Example with Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

// Set token
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Or per request
api.get('/users/me', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## 🛡 Protected Routes

### Using Guards

Routes yang memerlukan authentication menggunakan `JwtAuthGuard`:

```typescript
@UseGuards(JwtAuthGuard)
@Get('me')
getProfile(@GetUser() user: User) {
  return this.usersService.findMe(user.id);
}
```

### Getting Current User

Gunakan `@GetUser()` decorator untuk mendapatkan current user:

```typescript
@UseGuards(JwtAuthGuard)
@Post('products')
createProduct(
  @GetUser() user: User,
  @Body() createProductDto: CreateProductDto
) {
  return this.productsService.create(user, createProductDto);
}
```

## 👮 Authorization

### Role-Based Access Control

Sistem mendukung 2 roles:

- `USER` - Regular user
- `ADMIN` - Administrator

### Admin Routes

Routes yang memerlukan admin access menggunakan `AdminGuard`:

```typescript
@UseGuards(JwtAuthGuard, AdminGuard)
@Post('categories')
createCategory(@Body() createCategoryDto: CreateCategoryDto) {
  return this.categoriesService.create(createCategoryDto);
}
```

### Check User Role

```typescript
if (user.role === 'ADMIN') {
  // Admin only logic
}
```

## 🔄 Password Management

### Forgot Password

```http
POST /api/v1/auth/forgot
Content-Type: application/json

{
  "email": "john@example.com"
}
```

Sends password reset email dengan reset token.

### Reset Password

```http
POST /api/v1/auth/reset
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123",
  "confirmNewPassword": "newpassword123"
}
```

### Email Verification

Setelah register, user akan menerima email verification. Klik link di email untuk verify account.

## 🔐 Security Best Practices

### 1. Password Requirements

- Minimum 6 characters
- Disarankan menggunakan kombinasi huruf, angka, dan simbol
- Password di-hash dengan bcrypt sebelum disimpan

### 2. Token Security

- Jangan expose token di client-side code
- Store token di secure storage (httpOnly cookies atau secure localStorage)
- Implement token refresh jika diperlukan
- Set expiration time yang reasonable

### 3. HTTPS

- Selalu gunakan HTTPS di production
- Jangan kirim token melalui HTTP

### 4. Rate Limiting

- Implement rate limiting untuk login/register endpoints
- Prevent brute force attacks

## 🚨 Error Responses

### Unauthorized (401)

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/users/me"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "statusCode": 403,
  "message": "You do not have permission to access this resource",
  "error": "Forbidden",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/categories"
}
```

## 📚 Related Documentation

- [API Reference](./03-api-reference.md)
- [Response Format](./06-response-format.md)
- [Getting Started](./01-getting-started.md)
