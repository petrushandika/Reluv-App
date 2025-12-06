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

#### Confirm Email

```http
GET /auth/confirm?token=<verification-token>
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

#### Resend Verification Email

```http
POST /auth/verification
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Google OAuth

```http
GET /auth/google
```

Redirects to Google OAuth consent screen.

#### Google OAuth Callback

```http
GET /auth/google/callback?code=<oauth-code>
```

Handled automatically by OAuth flow.

#### Facebook OAuth

```http
GET /auth/facebook
```

Redirects to Facebook OAuth consent screen.

#### Facebook OAuth Callback

```http
GET /auth/facebook/callback?code=<oauth-code>
```

Handled automatically by OAuth flow.

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
  "lastName": "Doe Updated",
  "phone": "+6281234567890"
}
```

#### Update My Profile (with avatar/banner)

```http
PATCH /users/me/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "bio": "My bio",
  "gender": "MALE",
  "birthDate": "1990-01-01",
  "avatar": <file>,
  "banner": <file>
}
```

### Products

#### Get All Products

```http
GET /products?page=1&limit=10&search=shirt&categoryId=1&minPrice=100000&maxPrice=500000&sortBy=createdAt&sortOrder=desc
```

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term
- `categoryId` (number): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `sortBy` (string): Sort field (createdAt, price, name)
- `sortOrder` (string): 'asc' or 'desc'

#### Get Product by Slug

```http
GET /products/:slug
```

Returns product details by slug (URL-friendly identifier).

#### Get My Products

```http
GET /products/me?page=1&limit=10
Authorization: Bearer <token>
```

Get all products created by the authenticated user.

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
  "storeId": 1,
  "images": ["https://example.com/image1.jpg"],
  "isPublished": true,
  "isPreloved": true,
  "variants": [
    {
      "size": "M",
      "price": 150000,
      "stock": 1,
      "condition": "NEW",
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

#### Add Variant to Product

```http
POST /products/:productId/variants
Authorization: Bearer <token>
Content-Type: application/json

{
  "size": "L",
  "price": 200000,
  "stock": 5,
  "condition": "NEW",
  "weight": 200,
  "length": 20,
  "width": 15,
  "height": 5
}
```

#### Update Variant

```http
PATCH /products/:productId/variants/:variantId
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 180000,
  "stock": 3
}
```

#### Delete Variant

```http
DELETE /products/:productId/variants/:variantId
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

#### Update Category (Admin)

```http
PATCH /categories/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Updated Category Name"
}
```

#### Delete Category (Admin)

```http
DELETE /categories/:id
Authorization: Bearer <admin-token>
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
  "variantId": 1,
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

**Response includes:**
- `order`: Order object with `discountId`, `discountAmount`, `voucherId`, `voucherCode`
- `payment`: Payment transaction object

**Note:** Discounts are automatically applied based on product, category, store, and global scope. Voucher discount is applied after item discounts.

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

#### Get Seller Orders

```http
GET /orders/seller/all
Authorization: Bearer <token>
```

Get all orders for products sold by the authenticated seller.

#### Get Seller Order by ID

```http
GET /orders/seller/:id
Authorization: Bearer <token>
```

Get specific order details for seller.

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

#### Check Wishlist Status

```http
GET /wishlist/status/:productId
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

### Store

#### Get All Stores

```http
GET /store?page=1&limit=10&search=store
```

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term

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

#### Get My Store

```http
GET /store/me/my-store
Authorization: Bearer <token>
```

#### Update My Store

```http
PATCH /store/me/my-store
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Store Name",
  "slug": "updated-store-slug"
}
```

#### Update My Store Profile

```http
PATCH /store/me/my-store/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Store description",
  "banner": "https://example.com/banner.jpg"
}
```

#### Create Store for User (Admin)

```http
POST /store/admin/create-for-user
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "userId": 1,
  "name": "Store Name",
  "slug": "store-slug",
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
  "isDefault": true,
  "biteship_area_id": "IDNP31IDNC151IDND1234IDZ12820",
  "latitude": -6.2088,
  "longitude": 106.8456
}
```

**Required Fields:**
- `label`, `recipient`, `phone`, `province`, `city`, `district`, `subDistrict`, `postalCode`, `address`

**Optional Fields:**
- `isDefault` (default: false)
- `biteship_area_id`
- `latitude`, `longitude`

#### Get My Locations

```http
GET /locations?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Location by ID

```http
GET /locations/:id
Authorization: Bearer <token>
```

#### Update Location

```http
PATCH /locations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "label": "Office",
  "recipient": "John Doe",
  "phone": "+6281234567890",
  "province": "DKI Jakarta",
  "city": "Jakarta Pusat",
  "district": "Menteng",
  "subDistrict": "Gondangdia",
  "postalCode": "10350",
  "address": "Jl. Office Street No. 456",
  "isDefault": false
}
```

#### Delete Location

```http
DELETE /locations/:id
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

#### Create Voucher (Store Owner)

```http
POST /vouchers
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "DISCOUNT10",
  "name": "10% Discount",
  "description": "Get 10% off on your purchase",
  "type": "PERCENTAGE",
  "value": 10,
  "maxDiscount": 50000,
  "minPurchase": 200000,
  "usageLimit": 100,
  "expiry": "2024-12-31T23:59:59.000Z",
  "storeId": 1
}
```

**Note:** `value` is an integer. For PERCENTAGE type, value should be 0-100. For FIXED_AMOUNT type, value is the discount amount in Rupiah. For FREE_SHIPPING type, value should be 0. `storeId` is required and the user must own the store.

#### Update Voucher (Store Owner)

```http
PATCH /vouchers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false
}
```

#### Delete Voucher (Store Owner)

```http
DELETE /vouchers/:id
Authorization: Bearer <token>
```

### Discounts

#### Get All Discounts

```http
GET /discounts?page=1&limit=10&scope=STORE&isActive=true
```

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `scope` (string): Filter by scope (GLOBAL, CATEGORY, PRODUCT, STORE)
- `isActive` (boolean): Filter by active status
- `storeId` (number): Filter by store ID
- `categoryId` (number): Filter by category ID
- `productId` (number): Filter by product ID

#### Get Discount by ID

```http
GET /discounts/:id
```

#### Create Discount (Store Owner)

```http
POST /discounts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Store Discount 20%",
  "description": "Get 20% off on all store products",
  "type": "PERCENTAGE",
  "value": 20,
  "maxDiscount": 100000,
  "minPurchase": 200000,
  "scope": "STORE",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z",
  "usageLimit": 1000,
  "isActive": true,
  "storeId": 1
}
```

**Note:** 
- `value` is an integer. For PERCENTAGE type, value should be 0-100. For FIXED_AMOUNT type, value is the discount amount in Rupiah. For FREE_SHIPPING type, value should be 0.
- For `scope: "CATEGORY"`, include `categoryId` (required). For `scope: "PRODUCT"`, include `productId` (required). For `scope: "STORE"`, include `storeId` (required). For `scope: "GLOBAL"`, omit all IDs.
- User must own the store if scope is STORE, or have permission for CATEGORY/PRODUCT discounts.

#### Update Discount (Store Owner)

```http
PATCH /discounts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false
}
```

#### Delete Discount (Store Owner)

```http
DELETE /discounts/:id
Authorization: Bearer <token>
```

### Promotions

#### Get All Promotions

```http
GET /promotions?page=1&limit=10&storeId=1&isActive=true
```

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `storeId` (number): Filter by store ID
- `isActive` (boolean): Filter by active status
- `type` (string): Filter by type (FLASH_SALE, BOGO, BUNDLE, SEASONAL, CUSTOM)

#### Get Promotion by ID

```http
GET /promotions/:id
```

#### Create Promotion (Store Owner)

```http
POST /promotions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Flash Sale",
  "type": "FLASH_SALE",
  "description": "Limited time flash sale",
  "discount": 20,
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.000Z",
  "isActive": true,
  "storeId": 1,
  "productIds": [1, 2, 3]
}
```

#### Update Promotion (Store Owner)

```http
PATCH /promotions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false
}
```

#### Delete Promotion (Store Owner)

```http
DELETE /promotions/:id
Authorization: Bearer <token>
```

### Badges

#### Get All Badges

```http
GET /badges?page=1&limit=10&storeId=1&isActive=true&type=VERIFIED
```

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `storeId` (number): Filter by store ID
- `isActive` (boolean): Filter by active status
- `type` (string): Filter by type (VERIFIED, PREMIUM, FEATURED, TRENDING, BEST_SELLER, NEW_STORE, CUSTOM)

#### Get Badge by ID

```http
GET /badges/:id
```

#### Create Badge (Store Owner)

```http
POST /badges
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "VERIFIED",
  "name": "Verified Store",
  "description": "This store is verified",
  "icon": "https://example.com/icon.svg",
  "color": "#10b981",
  "isActive": true,
  "storeId": 1
}
```

#### Update Badge (Store Owner)

```http
PATCH /badges/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false
}
```

#### Delete Badge (Store Owner)

```http
DELETE /badges/:id
Authorization: Bearer <token>
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

#### Check Rates by Coordinates

```http
POST /shipping-rates/check-by-coords
Content-Type: application/json

{
  "origin_latitude": -6.2088,
  "origin_longitude": 106.8456,
  "destination_latitude": -6.2297,
  "destination_longitude": 106.8203,
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

### Maps & Geocoding

#### Search Areas (Biteship)

```http
GET /maps/search-areas?input=Jakarta
```

Search for areas using Biteship API. Returns area suggestions with area IDs.

#### Search OpenStreetMap

```http
GET /maps/search-osm?q=Jakarta Selatan
```

Search for locations using OpenStreetMap Nominatim API.

#### Reverse Geocoding

```http
GET /geocode/reverse?lat=-6.2088&lon=106.8456
```

Convert coordinates (latitude, longitude) to address information.

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
- `GET /discounts`
- `GET /discounts/:id`
- `GET /promotions`
- `GET /promotions/:id`
- `GET /badges`
- `GET /badges/:id`
- `GET /products/:productId/reviews`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/confirm`
- `POST /auth/forgot`
- `POST /auth/reset`
- `POST /shipping-rates/check-by-area`

### Authenticated Endpoints

Semua endpoints selain public endpoints memerlukan JWT token.

### Admin Only Endpoints

- `POST /categories`
- `PATCH /categories/:id`
- `DELETE /categories/:id`
- `POST /store/admin/create-for-user`

### Store Owner Only Endpoints

- `POST /vouchers` (must own the store specified in `storeId`)
- `PATCH /vouchers/:id` (must own the store)
- `DELETE /vouchers/:id` (must own the store)
- `POST /discounts` (must own the store if scope is STORE, or have permission for CATEGORY/PRODUCT/GLOBAL)
- `PATCH /discounts/:id` (must own the store if discount is store-specific)
- `DELETE /discounts/:id` (must own the store if discount is store-specific)
- `POST /promotions` (must own the store specified in `storeId`)
- `PATCH /promotions/:id` (must own the store)
- `DELETE /promotions/:id` (must own the store)
- `POST /badges` (must own the store specified in `storeId`)
- `PATCH /badges/:id` (must own the store)
- `DELETE /badges/:id` (must own the store)

## 📝 Postman Collection

Untuk testing yang lebih mudah, import `RELUV-API.postman_collection.json` ke Postman.

**Setup:**
1. Import file `RELUV-API.postman_collection.json` ke Postman
2. Set environment variables:
   - `base_url`: `http://localhost:8000/api/v1`
   - `token`: JWT token dari login (akan di-set otomatis jika menggunakan Postman scripts)
   - `admin_token`: JWT token untuk admin user

**Collection includes:**
- Authentication endpoints (register, login, confirm, forgot, reset)
- User management
- Products CRUD
- Categories
- Cart operations
- Orders
- Locations
- Vouchers (with storeId requirement)
- Discounts (all scopes: GLOBAL, CATEGORY, PRODUCT, STORE)
- Promotions
- Badges
- Store management
- Wishlist

## 🔗 Related Documentation

- [Response Format](./06-response-format.md)
- [Authentication](./04-authentication.md)
- [Validation](./07-validation.md)
