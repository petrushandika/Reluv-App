# Reluv App - E-Commerce Preloved Fashion Platform

## 📋 Overview

Reluv adalah platform e-commerce untuk preloved fashion items yang memungkinkan pengguna untuk membeli dan menjual produk fashion bekas berkualitas. Platform ini dibangun dengan arsitektur modern menggunakan Next.js untuk frontend dan NestJS untuk backend.

## 🏗 Architecture

```
Reluv-App/
├── Frontend/          # Next.js 16 + React 19 + TypeScript
├── Backend/           # NestJS 11 + PostgreSQL + Prisma
└── RELUV-API.postman_collection.json  # API Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm atau yarn

### Backend Setup

```bash
cd Backend
npm install
cp .env.example .env
# Configure .env file
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

Backend akan berjalan di `http://localhost:8000`

### Frontend Setup

```bash
cd Frontend
npm install
cp .env.example .env.local
# Configure .env.local file
npm run dev
```

Frontend akan berjalan di `https://fe-reluv-app.vercel.app`
# Frontend akan berjalan di `http://localhost:3099`

## 📚 Documentation

- [Backend Documentation](./Backend/README.md) - Complete backend API documentation
- [Frontend Documentation](./Frontend/README.md) - Complete frontend documentation
- [API Collection](./RELUV-API.postman_collection.json) - Postman collection untuk testing API

## 🛠 Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand (State Management)
- Axios (HTTP Client)
- React Hook Form + Zod (Form Validation)

### Backend
- NestJS 11
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Cloudinary (Image Upload)
- Midtrans (Payment)
- Biteship (Shipping)

## ✨ Features

### Core Features
- ✅ User Authentication (Email, Google, Facebook)
- ✅ Product Management
- ✅ Category Management (Nested Categories)
- ✅ Shopping Cart
- ✅ Wishlist
- ✅ Order Management
- ✅ Payment Integration (Midtrans)
- ✅ Shipping Integration (Biteship)
- ✅ Product Reviews & Ratings
- ✅ Voucher System
- ✅ Address Management
- ✅ Store Management
- ✅ Image Upload (Cloudinary)
- ✅ Email Notifications
- ✅ Real-time Notifications

### User Features
- Browse products by category
- Search products
- Add to cart
- Add to wishlist
- Create orders
- Manage profile
- Manage addresses
- View order history
- Write reviews

### Seller Features
- List products
- Manage product variants
- Upload product images
- Manage store profile

### Admin Features
- Manage categories
- Manage vouchers
- View all orders
- Manage users

## 📁 Project Structure

```
Reluv-App/
├── Backend/
│   ├── src/
│   │   ├── auth/              # Authentication
│   │   ├── products/          # Product management
│   │   ├── categories/        # Category management
│   │   ├── cart/              # Shopping cart
│   │   ├── orders/            # Order processing
│   │   ├── payments/          # Payment integration
│   │   ├── shipments/         # Shipping management
│   │   ├── reviews/           # Reviews & ratings
│   │   ├── vouchers/          # Voucher system
│   │   ├── wishlist/          # Wishlist
│   │   ├── users/             # User management
│   │   ├── store/             # Store management
│   │   ├── locations/         # Address management
│   │   ├── notifications/     # Notifications
│   │   ├── upload/            # File upload
│   │   ├── maps/              # Maps integration
│   │   ├── geocode/           # Geocoding
│   │   ├── shipping-rates/   # Shipping rates
│   │   └── common/            # Shared utilities
│   └── prisma/                # Database schema & migrations
│
├── Frontend/
│   └── src/
│       ├── app/               # Next.js pages (App Router)
│       ├── features/          # Feature modules
│       │   ├── auth/
│       │   ├── products/
│       │   ├── cart/
│       │   ├── wishlist/
│       │   ├── reviews/
│       │   ├── sell/
│       │   └── ...
│       └── shared/            # Shared components & utilities
│
└── RELUV-API.postman_collection.json
```

## 🔐 Authentication

API menggunakan JWT untuk authentication. Setelah login, include token di header:

```
Authorization: Bearer <your-token>
```

## 📤 API Response Format

Semua API responses menggunakan format konsisten:

### Success Response
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

### Error Response
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products/999"
}
```

## 🧪 Testing API

Import `RELUV-API.postman_collection.json` ke Postman untuk testing semua endpoints.

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
MIDTRANS_SERVER_KEY=...
BITESHIP_API_KEY=...
# ... (lihat Backend/README.md untuk lengkapnya)
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 🚢 Deployment

### Backend
1. Build: `npm run build`
2. Set environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Start: `npm run start:prod`

### Frontend
1. Build: `npm run build`
2. Set environment variables
3. Deploy ke Vercel/Netlify atau self-hosted

## 📄 License

Private - All rights reserved

## 👥 Contributing

Untuk kontribusi, silakan buat issue atau pull request.

## 📞 Support

Untuk support atau pertanyaan, silakan buat issue di repository.
