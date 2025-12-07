# API Specification
## Reluv App - E-Commerce Platform untuk Preloved Fashion

---

## 1. PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen ini menjelaskan spesifikasi lengkap API (Application Programming Interface) untuk platform Reluv App. Dokumen ini digunakan sebagai acuan untuk development team dan pihak yang akan mengintegrasikan dengan API.

### 1.2 Base URL

**Development**: `http://localhost:8000/api/v1`  
**Production**: `https://api.reluv.app/api/v1`

### 1.3 API Versioning

API menggunakan versioning di URL path: `/api/v1/`

---

## 2. AUTHENTICATION

### 2.1 Authentication Method

API menggunakan **JWT (JSON Web Token)** untuk authentication. Token harus disertakan di header setiap request yang memerlukan authentication.

### 2.2 How to Authenticate

Include JWT token di Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### 2.3 Getting Token

Token diperoleh melalui:
- Register endpoint: `POST /auth/register`
- Login endpoint: `POST /auth/login`
- OAuth endpoints: `GET /auth/google` atau `GET /auth/facebook`

---

## 3. RESPONSE FORMAT

### 3.1 Success Response

Semua success responses mengikuti format standar:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### 3.2 Error Response

Error responses mengikuti format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {
      // Additional error details
    }
  }
}
```

### 3.3 HTTP Status Codes

- `200 OK`: Request berhasil
- `201 Created`: Resource berhasil dibuat
- `400 Bad Request`: Request tidak valid
- `401 Unauthorized`: Tidak terautentikasi
- `403 Forbidden`: Tidak memiliki akses
- `404 Not Found`: Resource tidak ditemukan
- `500 Internal Server Error`: Server error

---

## 4. AUTHENTICATION ENDPOINTS

### 4.1 Register

**Endpoint**: `POST /auth/register`

**Description**: Mendaftarkan user baru

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt-token"
  },
  "message": "User registered successfully"
}
```

### 4.2 Login

**Endpoint**: `POST /auth/login`

**Description**: Login user

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt-token"
  },
  "message": "Login successful"
}
```

### 4.3 OAuth Endpoints

**Google OAuth**: `GET /auth/google`  
**Facebook OAuth**: `GET /auth/facebook`

Redirects ke OAuth provider consent screen.

---

## 5. PRODUCT ENDPOINTS

### 5.1 Get All Products

**Endpoint**: `GET /products`

**Description**: Mendapatkan list semua produk dengan filter dan pagination

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `search` (string): Search keyword
- `sort` (string): Sort by (price, date, rating)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Product Name",
        "slug": "product-name",
        "price": 150000,
        "images": ["url1", "url2"],
        "category": {
          "id": "uuid",
          "name": "Category Name"
        },
        "store": {
          "id": "uuid",
          "name": "Store Name"
        }
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### 5.2 Get Product by Slug

**Endpoint**: `GET /products/:slug`

**Description**: Mendapatkan detail produk berdasarkan slug

**Response** (200):
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-name",
      "description": "Product description",
      "price": 150000,
      "images": ["url1", "url2"],
      "variants": [
        {
          "id": "uuid",
          "size": "M",
          "color": "Black",
          "condition": "Good",
          "stock": 5,
          "price": 150000
        }
      ],
      "category": {
        "id": "uuid",
        "name": "Category Name"
      },
      "store": {
        "id": "uuid",
        "name": "Store Name",
        "rating": 4.5
      },
      "reviews": [
        {
          "id": "uuid",
          "rating": 5,
          "comment": "Great product",
          "user": {
            "firstName": "John",
            "lastName": "Doe"
          }
        }
      ]
    }
  }
}
```

### 5.3 Create Product

**Endpoint**: `POST /products`

**Description**: Membuat produk baru (Auth required)

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 150000,
  "categoryId": "uuid",
  "images": ["url1", "url2"],
  "variants": [
    {
      "size": "M",
      "color": "Black",
      "condition": "Good",
      "stock": 5,
      "price": 150000
    }
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-name"
    }
  },
  "message": "Product created successfully"
}
```

---

## 6. CART ENDPOINTS

### 6.1 Get Cart

**Endpoint**: `GET /cart`

**Description**: Mendapatkan cart user (Auth required)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [
        {
          "id": "uuid",
          "product": {
            "id": "uuid",
            "name": "Product Name",
            "price": 150000,
            "image": "url"
          },
          "variant": {
            "size": "M",
            "color": "Black"
          },
          "quantity": 2,
          "subtotal": 300000
        }
      ],
      "total": 300000
    }
  }
}
```

### 6.2 Add to Cart

**Endpoint**: `POST /cart/items`

**Description**: Menambahkan item ke cart (Auth required)

**Request Body**:
```json
{
  "productId": "uuid",
  "variantId": "uuid",
  "quantity": 2
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "cartItem": {
      "id": "uuid",
      "quantity": 2
    }
  },
  "message": "Item added to cart"
}
```

---

## 7. ORDER ENDPOINTS

### 7.1 Create Order

**Endpoint**: `POST /orders`

**Description**: Membuat order dari cart (Auth required)

**Request Body**:
```json
{
  "items": [
    {
      "cartItemId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddressId": "uuid",
  "paymentMethod": "bank_transfer",
  "shippingCourier": "jne",
  "voucherCode": "DISCOUNT10"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "uuid",
      "orderNumber": "ORD-20250101-001",
      "status": "pending_payment",
      "total": 300000,
      "shippingCost": 15000,
      "paymentUrl": "https://payment-url"
    }
  },
  "message": "Order created successfully"
}
```

### 7.2 Get Orders

**Endpoint**: `GET /orders`

**Description**: Mendapatkan list orders user (Auth required)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "orderNumber": "ORD-20250101-001",
        "status": "processing",
        "total": 300000,
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

## 8. PAYMENT ENDPOINTS

### 8.1 Payment Webhook

**Endpoint**: `POST /payments/webhook`

**Description**: Webhook dari Midtrans untuk payment notifications

**Note**: Endpoint ini dipanggil oleh Midtrans, bukan oleh client.

---

## 9. SHIPPING ENDPOINTS

### 9.1 Check Shipping Rates

**Endpoint**: `POST /shipping-rates/check-by-area`

**Description**: Mengecek ongkos kirim berdasarkan area

**Request Body**:
```json
{
  "originAreaId": "biteship-area-id",
  "destinationAreaId": "biteship-area-id",
  "weight": 1000
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "rates": [
      {
        "courier": "jne",
        "service": "REG",
        "cost": 15000,
        "estimatedDays": "2-3"
      }
    ]
  }
}
```

---

## 10. REVIEW ENDPOINTS

### 10.1 Get Product Reviews

**Endpoint**: `GET /products/:productId/reviews`

**Description**: Mendapatkan reviews untuk produk

**Response** (200):
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Great product!",
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 10.2 Create Review

**Endpoint**: `POST /products/:productId/reviews`

**Description**: Membuat review untuk produk (Auth required)

**Request Body**:
```json
{
  "rating": 5,
  "comment": "Great product!",
  "images": ["url1", "url2"]
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "review": {
      "id": "uuid",
      "rating": 5,
      "comment": "Great product!"
    }
  },
  "message": "Review created successfully"
}
```

---

## 11. POSTMAN COLLECTION

Untuk testing yang lebih mudah, gunakan Postman Collection yang tersedia di:
`Backend/docs/RELUV-API.postman_collection.json`

**Setup**:
1. Import file ke Postman
2. Set environment variables:
   - `base_url`: `http://localhost:8000/api/v1`
   - `token`: JWT token dari login

---

**Dokumen ini dibuat pada**: 01/01/2025  
**Versi**: 1.0  
**Status**: Final - API Specification

