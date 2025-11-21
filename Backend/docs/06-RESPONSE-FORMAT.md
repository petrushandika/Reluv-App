# API Response Format Documentation

## 📋 Overview

Semua endpoint di Reluv Backend API menggunakan format response yang konsisten dan rapi untuk memudahkan integrasi dan debugging.

## ✅ Success Response Format

### Standard Success Response (200 OK)

**GET, PATCH, DELETE operations**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "Vintage T-Shirt",
    "slug": "vintage-t-shirt-12345",
    "description": "Beautiful vintage t-shirt",
    "price": 150000,
    "images": ["https://example.com/image1.jpg"]
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products/1"
}
```

### Created Response (201 Created)

**POST operations (create)**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Resource created successfully",
  "data": {
    "id": 1,
    "name": "Vintage T-Shirt",
    "slug": "vintage-t-shirt-12345",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

### Paginated Response (200 OK)

**GET operations dengan pagination**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Product 1"
    },
    {
      "id": 2,
      "name": "Product 2"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

## ❌ Error Response Format

### Bad Request (400)

**Validation errors atau invalid input**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "name must be between 1 and 255 characters, slug must be between 1 and 255 characters",
  "error": "Bad Request",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products",
  "details": [
    {
      "property": "name",
      "constraints": {
        "length": "Product name must be between 1 and 255 characters"
      }
    },
    {
      "property": "slug",
      "constraints": {
        "length": "Slug must be between 1 and 255 characters"
      }
    }
  ]
}
```

### Unauthorized (401)

**Missing or invalid authentication token**

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

### Forbidden (403)

**Insufficient permissions**

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

### Not Found (404)

**Resource not found**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Product with ID 999 not found",
  "error": "Not Found",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products/999"
}
```

### Conflict (409)

**Resource conflict (duplicate, cannot delete, etc.)**

```json
{
  "success": false,
  "statusCode": 409,
  "message": "Cannot delete category with ID 401 because it has child categories.",
  "error": "Conflict",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/categories/401"
}
```

### Internal Server Error (500)

**Server errors**

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

## 📊 Response Fields

### Success Response Fields

| Field        | Type         | Description                         |
| ------------ | ------------ | ----------------------------------- |
| `success`    | boolean      | Always `true` for success responses |
| `statusCode` | number       | HTTP status code (200, 201)         |
| `message`    | string       | Human-readable success message      |
| `data`       | object/array | Response data                       |
| `meta`       | object       | Pagination metadata (optional)      |
| `timestamp`  | string       | ISO 8601 timestamp                  |
| `path`       | string       | Request path                        |

### Error Response Fields

| Field        | Type         | Description                            |
| ------------ | ------------ | -------------------------------------- |
| `success`    | boolean      | Always `false` for error responses     |
| `statusCode` | number       | HTTP status code (400, 401, 404, etc.) |
| `message`    | string       | Human-readable error message           |
| `error`      | string       | Error type/category                    |
| `timestamp`  | string       | ISO 8601 timestamp                     |
| `path`       | string       | Request path                           |
| `details`    | array/object | Additional error details (optional)    |

## 🔄 Message Variations

### Success Messages

Messages bervariasi berdasarkan HTTP method dan status code:

- **GET**: "Data retrieved successfully"
- **POST (201)**: "Resource created successfully"
- **PATCH**: "Resource updated successfully"
- **DELETE**: "Resource deleted successfully"
- **POST (200)**: "Operation completed successfully"

### Error Messages

Error messages bersifat deskriptif dan informatif:

- Validation errors: Menampilkan semua field yang error
- Not found: Menyebutkan resource yang tidak ditemukan
- Conflict: Menjelaskan alasan conflict
- Unauthorized: "Unauthorized" atau "Invalid token"

## 📝 Examples

### Example 1: Get Product

**Request:**

```
GET /api/v1/products/1
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "Vintage T-Shirt",
    "slug": "vintage-t-shirt-12345",
    "description": "Beautiful vintage t-shirt in excellent condition",
    "categoryId": 403,
    "parentCategoryId": 401,
    "childCategoryId": 404,
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "variants": [
      {
        "id": 1,
        "size": "M",
        "color": "Blue",
        "price": 150000,
        "stock": 1,
        "condition": "NEW"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products/1"
}
```

### Example 2: Create Product

**Request:**

```
POST /api/v1/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Vintage T-Shirt",
  "slug": "vintage-t-shirt-12345",
  "description": "Beautiful vintage t-shirt",
  "categoryId": 403,
  "images": ["https://example.com/image1.jpg"],
  "variants": [...]
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Resource created successfully",
  "data": {
    "id": 1,
    "name": "Vintage T-Shirt",
    "slug": "vintage-t-shirt-12345",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

### Example 3: Validation Error

**Request:**

```
POST /api/v1/products
{
  "name": "",
  "slug": "a"
}
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "name must be between 1 and 255 characters, slug must be between 1 and 255 characters",
  "error": "Bad Request",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products",
  "details": [
    {
      "property": "name",
      "constraints": {
        "length": "Product name must be between 1 and 255 characters",
        "isNotEmpty": "name should not be empty"
      }
    },
    {
      "property": "slug",
      "constraints": {
        "length": "Slug must be between 1 and 255 characters"
      }
    }
  ]
}
```

### Example 4: Paginated List

**Request:**

```
GET /api/v1/products?page=1&limit=10
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Product 1",
      "price": 150000
    },
    {
      "id": 2,
      "name": "Product 2",
      "price": 200000
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

## 🔧 Implementation

Response format di-handle oleh:

1. **TransformInterceptor** (`src/common/interceptors/transform.interceptor.ts`)
   - Mengubah semua success response menjadi format konsisten
   - Menambahkan metadata (success, statusCode, message, timestamp, path)

2. **HttpExceptionFilter** (`src/common/filters/http-exception.filter.ts`)
   - Menangani semua error response
   - Format error response yang konsisten

Kedua interceptor dan filter sudah di-register secara global di `main.ts`.

## 💡 Best Practices

1. **Always check `success` field** untuk menentukan apakah request berhasil
2. **Use `statusCode`** untuk handling berbeda berdasarkan HTTP status
3. **Check `details` field** untuk validation errors
4. **Use `timestamp`** untuk logging dan debugging
5. **Use `path`** untuk tracking request yang error

## 📚 Related Documentation

- [Backend README](../README.md) - Complete backend documentation
- [Postman Collection](../RELUV-API.postman_collection.json) - API testing collection
