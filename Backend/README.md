# Reluv Backend API Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Testing](#testing)

## 🎯 Overview

Reluv Backend adalah RESTful API yang dibangun dengan NestJS untuk aplikasi e-commerce preloved fashion. API ini menyediakan berbagai fitur seperti authentication, product management, order processing, payment integration, dan shipping management.

## 🛠 Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, Passport.js
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Payment**: Midtrans
- **Shipping**: Biteship
- **Validation**: class-validator, class-transformer

## 📦 Prerequisites

- Node.js (v18 atau lebih tinggi)
- PostgreSQL (v14 atau lebih tinggi)
- npm atau yarn
- Cloudinary account (untuk image upload)
- Midtrans account (untuk payment)
- Biteship account (untuk shipping)

## 🚀 Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd Reluv-App/Backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

4. **Configure environment variables** (lihat [Configuration](#configuration))

5. **Setup database**

```bash
npx prisma migrate dev
npx prisma db seed
```

6. **Run the application**

```bash
npm run start:dev
```

## ⚙️ Configuration

Buat file `.env` di root directory Backend dengan konfigurasi berikut:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/reluv_db?schema=public"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3099
# FRONTEND_URL=http://localhost:3099

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="noreply@reluv.com"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:8000/api/v1/auth/google/callback"

# Facebook OAuth
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"
FACEBOOK_CALLBACK_URL="http://localhost:8000/api/v1/auth/facebook/callback"

# Midtrans
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION=false

# Biteship
BITESHIP_API_KEY="your-biteship-api-key"
```

## 🗄 Database Setup

1. **Create database**

```sql
CREATE DATABASE reluv_db;
```

2. **Run migrations**

```bash
npx prisma migrate dev
```

3. **Seed database** (optional)

```bash
npx prisma db seed
```

## ▶️ Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

API akan berjalan di `http://localhost:8000/api/v1`

## 📁 Project Structure

```
Backend/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── jwt.strategy.ts
│   ├── products/          # Product management
│   ├── categories/        # Category management
│   ├── cart/              # Shopping cart
│   ├── orders/            # Order processing
│   ├── payments/          # Payment integration (Midtrans)
│   ├── shipments/         # Shipping management (Biteship)
│   ├── reviews/           # Product reviews
│   ├── vouchers/          # Voucher management
│   ├── wishlist/          # Wishlist feature
│   ├── users/             # User management
│   ├── store/             # Store management
│   ├── locations/         # Address management
│   ├── notifications/     # Notification system
│   ├── upload/            # File upload (Cloudinary)
│   ├── maps/              # Maps integration
│   ├── geocode/           # Geocoding services
│   ├── shipping-rates/    # Shipping rate calculation
│   ├── common/            # Shared utilities
│   │   ├── decorators/    # Custom decorators
│   │   ├── filters/       # Exception filters
│   │   ├── guards/        # Authentication guards
│   │   ├── interceptors/   # Response interceptors
│   │   └── interfaces/     # TypeScript interfaces
│   ├── prisma/            # Prisma service
│   ├── cloudinary/        # Cloudinary service
│   ├── email/             # Email service
│   ├── configs/           # Configuration files
│   ├── utils/             # Utility functions
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Database seeder
│   └── data/              # Seed data
├── test/                  # Test files
├── .env                   # Environment variables
└── package.json
```

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Endpoints Overview

#### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/confirm` - Confirm email
- `POST /auth/forgot` - Request password reset
- `POST /auth/reset` - Reset password
- `GET /auth/google` - Google OAuth
- `GET /auth/facebook` - Facebook OAuth

#### Products

- `GET /products` - Get all products (with filters)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Auth required)
- `PATCH /products/:id` - Update product (Auth required)
- `DELETE /products/:id` - Delete product (Auth required)
- `POST /products/:productId/variants` - Add variant
- `PATCH /products/:productId/variants/:variantId` - Update variant
- `DELETE /products/:productId/variants/:variantId` - Delete variant

#### Categories

- `GET /categories` - Get all categories (nested)
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category (Admin)
- `PATCH /categories/:id` - Update category (Admin)
- `DELETE /categories/:id` - Delete category (Admin)

#### Cart

- `GET /cart` - Get user cart (Auth required)
- `POST /cart/items` - Add item to cart (Auth required)
- `PATCH /cart/items/:id` - Update cart item (Auth required)
- `DELETE /cart/items/:id` - Remove item from cart (Auth required)

#### Orders

- `POST /orders` - Create order (Auth required)
- `GET /orders` - Get user orders (Auth required)
- `GET /orders/:id` - Get order by ID (Auth required)

#### Reviews

- `GET /products/:productId/reviews` - Get product reviews
- `POST /products/:productId/reviews` - Create review (Auth required)

#### Wishlist

- `GET /wishlist` - Get user wishlist (Auth required)
- `GET /wishlist/status/:productId` - Check wishlist status (Auth required)
- `POST /wishlist/:productId` - Add to wishlist (Auth required)
- `DELETE /wishlist/:productId` - Remove from wishlist (Auth required)

#### Users

- `GET /users/me` - Get current user (Auth required)
- `PATCH /users/me` - Update user profile (Auth required)
- `PATCH /users/me/profile` - Update user profile details (Auth required)

#### Store

- `GET /store` - Get all stores (public)
- `GET /store/:slug` - Get store by slug (public)
- `POST /store` - Create store (Auth required)
- `GET /store/me/my-store` - Get my store (Auth required)
- `PATCH /store/me/my-store` - Update my store (Auth required)
- `PATCH /store/me/my-store/profile` - Update store profile (Auth required)

#### Locations

- `POST /locations` - Create location (Auth required)
- `GET /locations` - Get user locations (Auth required)
- `GET /locations/:id` - Get location by ID (Auth required)
- `PATCH /locations/:id` - Update location (Auth required)
- `DELETE /locations/:id` - Delete location (Auth required)

#### Vouchers

- `GET /vouchers` - Get active vouchers (public)
- `POST /vouchers/apply` - Apply voucher (Auth required)
- `POST /vouchers/admin` - Create voucher (Admin)
- `PATCH /vouchers/admin/:id` - Update voucher (Admin)
- `DELETE /vouchers/admin/:id` - Delete voucher (Admin)

#### Upload

- `POST /upload/image` - Upload image (Auth required)

#### Shipping Rates

- `POST /shipping-rates/check-by-area` - Check rates by area
- `POST /shipping-rates/check-by-coords` - Check rates by coordinates

#### Maps & Geocoding

- `GET /maps/search-areas` - Search areas (Biteship)
- `GET /maps/search-osm` - Search OpenStreetMap
- `GET /geocode/reverse` - Reverse geocoding

#### Notifications

- `GET /notifications` - Get user notifications (Auth required)
- `PATCH /notifications/:id/read` - Mark as read (Auth required)
- `POST /notifications/read-all` - Mark all as read (Auth required)

Untuk dokumentasi lengkap dengan contoh request/response, lihat file `RELUV-API.postman_collection.json` atau gunakan Postman untuk import collection.

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk authentication.

### How to Authenticate

1. **Register/Login** untuk mendapatkan token

```bash
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

2. **Include token** di header setiap request

```
Authorization: Bearer <your-token>
```

### Protected Routes

Routes yang memerlukan authentication akan menggunakan `@UseGuards(JwtAuthGuard)`.

### Admin Routes

Routes yang memerlukan admin access akan menggunakan `@UseGuards(JwtAuthGuard, AdminGuard)`.

## 📤 Response Format

Semua response menggunakan format yang konsisten:

### Success Response (200/201)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

### Paginated Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": [ ... ],
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

### Error Response

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

## ⚠️ Error Handling

API menggunakan global exception filter untuk menangani semua error secara konsisten.

### HTTP Status Codes

- **200 OK**: Success
- **201 Created**: Resource created
- **400 Bad Request**: Validation error
- **401 Unauthorized**: Missing/invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict
- **500 Internal Server Error**: Server error

### Validation Errors

Validation errors akan mengembalikan detail error:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "property": "name",
      "constraints": {
        "length": "Product name must be between 1 and 255 characters"
      }
    }
  ]
}
```

## ✅ Validation

Semua input divalidasi menggunakan `class-validator` dan `class-transformer`.

### Validation Rules

- **Required fields**: `@IsNotEmpty()`
- **String length**: `@Length(min, max)`
- **Email**: `@IsEmail()`
- **Number range**: `@Min()`, `@Max()`
- **URL**: `@IsUrl()`
- **Enum**: `@IsEnum()`
- **Array**: `@IsArray()`, `@ArrayMinSize()`

Validation dilakukan secara otomatis oleh `ValidationPipe` yang di-register secara global.

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Database Schema

Database schema didefinisikan di `prisma/schema.prisma`. Untuk melihat schema lengkap:

```bash
npx prisma studio
```

## 🔧 Scripts

- `npm run build` - Build untuk production
- `npm run start:dev` - Run development server
- `npm run start:prod` - Run production server
- `npm run format` - Format code dengan Prettier
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Open Prisma Studio

## 📄 License

Private - All rights reserved
