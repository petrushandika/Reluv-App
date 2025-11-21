# API Reference

## 📋 Base URL

```
http://localhost:8000/api/v1
```

## 🔐 Authentication

Sebagian besar endpoints memerlukan authentication. Include JWT token di header:

```
Authorization: Bearer <your-token>
```

Untuk mendapatkan token, gunakan endpoint `/auth/login` atau `/auth/register`.

## 📚 Endpoints

### Authentication

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Forgot Password

```http
POST /auth/forgot
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password

```http
POST /auth/reset
Content-Type: application/json

{
  "token": "reset-token",
  "newPassword": "newpassword123",
  "confirmNewPassword": "newpassword123"
}
```

### Products

#### Get All Products

```http
GET /products?page=1&limit=10&search=shirt&categoryId=1
```

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term
- `categoryId` (number): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `sortBy` (string): Sort field
- `sortOrder` (string): 'asc' or 'desc'

#### Get Product by ID

```http
GET /products/:id
```

#### Create Product

```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Vintage T-Shirt",
  "slug": "vintage-t-shirt-12345",
  "description": "Beautiful vintage t-shirt",
  "categoryId": 403,
  "parentCategoryId": 401,
  "childCategoryId": 404,
  "images": ["https://example.com/image1.jpg"],
  "isPublished": true,
  "isPreloved": true,
  "variants": [
    {
      "size": "M",
      "color": "Blue",
      "price": 150000,
      "compareAtPrice": 200000,
      "stock": 1,
      "condition": "NEW",
      "conditionNote": "Brand new with tags",
      "weight": 200,
      "length": 20,
      "width": 15,
      "height": 5
    }
  ]
}
```

#### Update Product

```http
PATCH /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "description": "Updated description"
}
```

#### Delete Product

```http
DELETE /products/:id
Authorization: Bearer <token>
```

### Categories

#### Get All Categories

```http
GET /categories
```

Returns nested category structure.

#### Get Category by ID

```http
GET /categories/:id
```

#### Create Category (Admin)

```http
POST /categories
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Category",
  "slug": "new-category",
  "parentId": null
}
```

### Cart

#### Get My Cart

```http
GET /cart
Authorization: Bearer <token>
```

#### Add Item to Cart

```http
POST /cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 1
}
```

#### Update Cart Item

```http
PATCH /cart/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

#### Remove Item from Cart

```http
DELETE /cart/items/:id
Authorization: Bearer <token>
```

### Orders

#### Create Order

```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "locationId": 1,
  "shippingCost": 15000,
  "notes": "Please handle with care",
  "voucherCode": "DISCOUNT10"
}
```

#### Get My Orders

```http
GET /orders
Authorization: Bearer <token>
```

#### Get Order by ID

```http
GET /orders/:id
Authorization: Bearer <token>
```

### Reviews

#### Get Product Reviews

```http
GET /products/:productId/reviews
```

#### Create Review

```http
POST /products/:productId/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent product!",
  "images": ["https://example.com/review-image.jpg"]
}
```

### Wishlist

#### Get My Wishlist

```http
GET /wishlist
Authorization: Bearer <token>
```

#### Add to Wishlist

```http
POST /wishlist/:productId
Authorization: Bearer <token>
```

#### Remove from Wishlist

```http
DELETE /wishlist/:productId
Authorization: Bearer <token>
```

### Users

#### Get My Profile

```http
GET /users/me
Authorization: Bearer <token>
```

#### Update My Profile

```http
PATCH /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John Updated",
  "lastName": "Doe Updated"
}
```

### Store

#### Get All Stores

```http
GET /store?page=1&limit=10&search=store
```

#### Get Store by Slug

```http
GET /store/:slug
```

#### Create Store

```http
POST /store
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Awesome Store",
  "slug": "my-awesome-store",
  "locationId": 1
}
```

### Locations

#### Create Location

```http
POST /locations
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Home",
  "recipient": "John Doe",
  "phone": "+6281234567890",
  "province": "DKI Jakarta",
  "city": "Jakarta Selatan",
  "district": "Tebet",
  "subDistrict": "Tebet Timur",
  "postalCode": "12820",
  "address": "Jl. Example Street No. 123",
  "isDefault": true
}
```

#### Get My Locations

```http
GET /locations?page=1&limit=10
Authorization: Bearer <token>
```

### Vouchers

#### Get Active Vouchers

```http
GET /vouchers
```

#### Apply Voucher

```http
POST /vouchers/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "DISCOUNT10"
}
```

### Upload

#### Upload Image

```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image-file>
```

### Shipping Rates

#### Check Rates by Area

```http
POST /shipping-rates/check-by-area
Content-Type: application/json

{
  "origin_area_id": "IDNP6IDNC148IDND845IDZ12820",
  "destination_area_id": "IDNP6IDNC148IDND845IDZ12830",
  "items": [
    {
      "name": "T-Shirt",
      "value": 150000,
      "length": 20,
      "width": 15,
      "height": 5,
      "weight": 200,
      "quantity": 1
    }
  ]
}
```

## 📤 Response Format

Semua responses menggunakan format konsisten. Lihat [Response Format Documentation](./06-response-format.md) untuk detail lengkap.

## 🔒 Authorization

### Public Endpoints

- `GET /products`
- `GET /products/:id`
- `GET /categories`
- `GET /categories/:id`
- `GET /store`
- `GET /store/:slug`
- `GET /vouchers`
- `POST /auth/register`
- `POST /auth/login`

### Authenticated Endpoints

Semua endpoints selain public endpoints memerlukan JWT token.

### Admin Only Endpoints

- `POST /categories`
- `PATCH /categories/:id`
- `DELETE /categories/:id`
- `POST /vouchers/admin`
- `PATCH /vouchers/admin/:id`
- `DELETE /vouchers/admin/:id`

## 📝 Postman Collection

Untuk testing yang lebih mudah, import `RELUV-API.postman_collection.json` ke Postman.

## 🔗 Related Documentation

- [Response Format](./06-response-format.md)
- [Authentication](./04-authentication.md)
- [Validation](./07-validation.md)
