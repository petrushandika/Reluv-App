# Lampiran

## Lampiran A: Flow Chart dan Diagram Proses

### A.1 Flow Chart User Registration

```
┌─────────────────┐
│  User Akses     │
│  Halaman        │
│  Registrasi     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User Isi Form  │
│  - Email        │
│  - Password     │
│  - Nama         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Validasi Data  │─────▶│  Data Valid? │
└────────┬────────┘      └──────┬───────┘
         │                      │
         │ No                   │ Yes
         │                      │
         ▼                      ▼
┌─────────────────┐      ┌─────────────────┐
│  Tampilkan      │      │  Hash Password   │
│  Error Message  │      │  dengan bcrypt  │
└─────────────────┘      └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  Simpan ke DB   │
                          │  (Status:       │
                          │   Unverified)   │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  Generate Token │
                          │  Verifikasi     │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  Kirim Email    │
                          │  Verifikasi     │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  User Klik Link │
                          │  Verifikasi     │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  Update Status  │
                          │  Verified       │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  Registrasi     │
                          │  Berhasil       │
                          └─────────────────┘
```

### A.2 Flow Chart Purchase Process

```
┌─────────────────┐
│  User Login     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Browse Produk  │
│  / Search       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pilih Produk   │
│  & Varian       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Add to Cart    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Review Cart    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Klik Checkout  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pilih Alamat   │
│  Pengiriman     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Hitung Shipping│
│  Rate (Biteship)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pilih Courier  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Apply Voucher  │
│  (Optional)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Review Order   │
│  Summary        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pilih Payment  │
│  Method         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Create Payment │
│  (Midtrans)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redirect ke    │
│  Payment Page   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  User Bayar     │─────▶│  Payment     │
│                  │      │  Success?    │
└─────────────────┘      └──────┬───────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    │ Yes                   │ No
                    │                       │
                    ▼                       ▼
         ┌─────────────────┐      ┌─────────────────┐
         │  Webhook        │      │  Payment Failed │
         │  Verification   │      │  Notification   │
         └────────┬────────┘      └─────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Update Order   │
         │  Status: PAID   │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │  Send           │
         │  Notifications  │
         │  (Buyer & Seller)│
         └─────────────────┘
```

### A.3 Flow Chart Seller Product Listing

```
┌─────────────────┐
│  Seller Login   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Check Store    │─────▶│  Store Ada?  │
│  Exists         │      └──────┬───────┘
└─────────────────┘             │
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    │ No                    │ Yes
                    │                       │
                    ▼                       │
         ┌─────────────────┐                │
         │  Create Store   │                │
         └────────┬────────┘                │
                  │                         │
                  └───────────┬─────────────┘
                              │
                              ▼
                 ┌─────────────────┐
                 │  Klik "Sell"    │
                 │  Button        │
                 └────────┬───────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Upload Images  │
                 │  (Cloudinary)   │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Isi Info Produk│
                 │  - Nama         │
                 │  - Deskripsi    │
                 │  - Harga        │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Pilih Kategori │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Set Kondisi    │
                 │  (New/Like New/ │
                 │   Good/Fair)    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Tambah Varian  │
                 │  (Optional)     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Review Info    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐      ┌──────────────┐
                 │  Submit Produk │─────▶│  Validasi    │
                 └─────────────────┘      └──────┬───────┘
                                                  │
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │  Simpan ke DB   │
                                         └────────┬────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │  Produk Live    │
                                         │  di Platform    │
                                         └─────────────────┘
```

### A.4 Flow Chart Order Fulfillment (Seller)

```
┌─────────────────┐
│  Order Baru     │
│  Diterima       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Seller Terima  │
│  Notifikasi     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Check Payment  │─────▶│  Payment     │
│  Status         │      │  Paid?       │
└─────────────────┘      └──────┬───────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    │ No                    │ Yes
                    │                       │
                    ▼                       │
         ┌─────────────────┐                │
         │  Wait Payment   │                │
         └─────────────────┘                │
                                             │
                                             ▼
                                ┌─────────────────┐
                                │  Update Status:  │
                                │  PROCESSING     │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  Prepare        │
                                │  Produk         │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  Pack Produk    │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  Create         │
                                │  Shipment       │
                                │  (Biteship)     │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  Update Status: │
                                │  SHIPPED        │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  Input Tracking │
                                │  Number         │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  Send           │
                                │  Notification   │
                                │  ke Buyer       │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  Track Delivery │
                                │  Status         │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  Status:        │
                                │  DELIVERED      │
                                └─────────────────┘
```

## Lampiran B: Diagram Navigasi Website

### B.1 Site Map - Struktur Navigasi

```
                    ┌─────────────────┐
                    │   Homepage (/)   │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Products   │    │   Categories │    │    Search    │
│   Listing    │    │   Browse     │    │              │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Product    │    │   Category   │    │   Search     │
│   Detail     │    │   Products   │    │   Results   │
└──────┬───────┘    └──────────────┘    └──────┬───────┘
       │                                        │
       ▼                                        │
┌──────────────┐                               │
│  Add to Cart │                               │
│  / Wishlist  │                               │
└──────┬───────┘                               │
       │                                       │
       ▼                                       │
┌──────────────┐                               │
│     Cart     │                               │
└──────┬───────┘                               │
       │                                       │
       ▼                                       │
┌──────────────┐                               │
│   Checkout   │                               │
└──────┬───────┘                               │
       │                                       │
       ▼                                       │
┌──────────────┐                               │
│   Payment    │                               │
└──────────────┘                               │
                                               │
                    ┌──────────────────────────┴──────────┐
                    │                                       │
                    ▼                                       ▼
         ┌─────────────────┐                  ┌─────────────────┐
         │   User Auth     │                  │   User Profile  │
         │   - Login       │                  │   - Profile      │
         │   - Register    │                  │   - Orders      │
         │   - Forgot Pwd  │                  │   - Addresses    │
         └────────┬────────┘                  │   - Reviews      │
                  │                            └────────┬────────┘
                  │                                     │
                  ▼                                     │
         ┌─────────────────┐                           │
         │   Seller Area   │                           │
         │   - Sell        │                           │
         │   - Dashboard   │                           │
         │   - Products    │                           │
         │   - Orders      │                           │
         │   - Analytics   │                           │
         └─────────────────┘                           │
                                                        │
                                        ┌───────────────┴──────────┐
                                        │                           │
                                        ▼                           ▼
                            ┌─────────────────┐        ┌─────────────────┐
                            │   Admin Panel  │        │   Help Center   │
                            │   - Users      │        │   - FAQ         │
                            │   - Products   │        │   - Support     │
                            │   - Orders     │        │   - Contact     │
                            │   - Categories │        └─────────────────┘
                            │   - Vouchers   │
                            └─────────────────┘
```

### B.2 User Navigation Flow

**Guest User:**

```
Homepage → Browse Products → Product Detail → Login/Register → Cart → Checkout
```

**Authenticated Buyer:**

```
Homepage → Browse/Search → Product Detail → Add to Cart → Cart → Checkout → Payment → Order History
```

**Seller:**

```
Homepage → Login → Seller Dashboard → Sell Product → Manage Products → Manage Orders → Analytics
```

**Admin:**

```
Homepage → Login → Admin Panel → Manage Users → Manage Products → Manage Categories → Manage Vouchers
```

## Lampiran C: Use Case Diagram

### C.1 Use Case Diagram - Buyer

```
                    ┌─────────────────┐
                    │     Buyer       │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Register   │    │    Login     │    │ Browse       │
│   Account    │    │              │    │ Products     │
└──────────────┘    └──────────────┘    └──────┬───────┘
                                                │
        ┌───────────────────────────────────────┼───────────────────────┐
        │                                       │                       │
        ▼                                       ▼                       ▼
┌──────────────┐                      ┌──────────────┐      ┌──────────────┐
│   Search     │                      │  View Product│      │  Filter      │
│   Products   │                      │  Details      │      │  Products    │
└──────────────┘                      └──────┬───────┘      └──────────────┘
                                              │
        ┌─────────────────────────────────────┼──────────────────────────┐
        │                                     │                          │
        ▼                                     ▼                          ▼
┌──────────────┐                    ┌──────────────┐          ┌──────────────┐
│ Add to Cart  │                    │ Add to       │          │  View        │
│              │                    │ Wishlist     │          │  Reviews     │
└──────┬───────┘                    └──────────────┘          └──────────────┘
       │
       ▼
┌──────────────┐
│  Manage Cart │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Checkout   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Make Payment│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Track Order  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Write Review │
└──────────────┘
```

### C.2 Use Case Diagram - Seller

```
                    ┌─────────────────┐
                    │     Seller      │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Create      │    │  Manage      │    │  Manage      │
│  Store       │    │  Products    │    │  Orders      │
└──────────────┘    └──────┬───────┘    └──────┬───────┘
                           │                   │
        ┌──────────────────┼───────────────────┼──────────────────┐
        │                  │                   │                  │
        ▼                  ▼                   ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ List Product │  │ Update       │  │ Delete       │  │ View         │
│              │  │ Product      │  │ Product      │  │ Analytics    │
└──────┬───────┘  └──────────────┘  └──────────────┘  └──────┬───────┘
       │                                                       │
       ▼                                                       │
┌──────────────┐                                               │
│ Upload      │                                               │
│ Images      │                                               │
└──────┬───────┘                                               │
       │                                                       │
       ▼                                                       │
┌──────────────┐                                               │
│ Set Product  │                                               │
│ Variants     │                                               │
└──────────────┘                                               │
                                                               │
        ┌──────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────┐
│ Process      │
│ Orders       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Update Order │
│ Status       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Create       │
│ Shipment     │
└──────────────┘
```

### C.3 Use Case Diagram - Admin

```
                    ┌─────────────────┐
                    │      Admin      │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Manage      │    │  Manage      │    │  Manage      │
│  Users       │    │  Products    │    │  Categories  │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ View All     │  │ Approve/     │  │ Create       │
│ Users        │  │ Reject       │  │ Category     │
└──────┬───────┘  │ Products     │  └──────┬───────┘
       │          └──────────────┘         │
       ▼                                   ▼
┌──────────────┐                  ┌──────────────┐
│ Verify User  │                  │ Edit         │
└──────┬───────┘                  │ Category     │
       │                          └──────┬───────┘
       ▼                                 │
┌──────────────┐                        ▼
│ Ban/Unban    │                ┌──────────────┐
│ User         │                │ Delete        │
└──────────────┘                │ Category     │
                                └──────────────┘

        ┌──────────────────────────────────────┐
        │                                      │
        ▼                                      ▼
┌──────────────┐                    ┌──────────────┐
│  Manage      │                    │  View        │
│  Vouchers    │                    │  Analytics   │
└──────┬───────┘                    └──────────────┘
       │
       ▼
┌──────────────┐
│ Create       │
│ Voucher      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Edit Voucher │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Delete       │
│ Voucher      │
└──────────────┘
```

## Lampiran D: Diagram Arsitektur Sistem

### A.1 Arsitektur Umum Platform Reluv App

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Frontend (Next.js 16)                   │  │
│  │  - React 19 Components                               │  │
│  │  - Zustand State Management                          │  │
│  │  - Tailwind CSS Styling                              │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     APPLICATION LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Backend API (NestJS 11)                  │  │
│  │  - Controllers (Request Handling)                    │  │
│  │  - Services (Business Logic)                         │  │
│  │  - Guards (Authentication/Authorization)              │  │
│  │  - Interceptors (Response Transformation)            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Database (PostgreSQL)                        │  │
│  │  - Prisma ORM                                        │  │
│  │  - Data Models                                       │  │
│  │  - Migrations                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  THIRD-PARTY SERVICES                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Midtrans   │  │   Biteship   │  │  Cloudinary  │     │
│  │  (Payment)   │  │  (Shipping)  │  │   (Images)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### A.2 Database Schema Diagram

**Entity Relationship Diagram (ERD) - Core Entities:**

```
User ──┬── UserProfile
       ├── Store ──┬── StoreProfile
       │           ├── Product ──┬── Variant
       │           │             ├── Review
       │           │             └── Category
       │           └── Badge
       ├── Cart ─── CartItem
       ├── Order ──┬── OrderItem
       │           ├── Payment
       │           └── Shipment
       ├── Location
       ├── Wishlist
       ├── Review
       └── Notification
```

## Lampiran B: API Endpoints Documentation

### B.1 Authentication Endpoints

| Method | Endpoint                       | Description            | Auth Required |
| ------ | ------------------------------ | ---------------------- | ------------- |
| POST   | `/api/v1/auth/register`        | Register new user      | No            |
| POST   | `/api/v1/auth/login`           | Login user             | No            |
| POST   | `/api/v1/auth/logout`          | Logout user            | Yes           |
| POST   | `/api/v1/auth/refresh`         | Refresh access token   | Yes           |
| POST   | `/api/v1/auth/forgot-password` | Request password reset | No            |
| POST   | `/api/v1/auth/reset-password`  | Reset password         | No            |
| POST   | `/api/v1/auth/verify-email`    | Verify email address   | No            |
| GET    | `/api/v1/auth/google`          | Google OAuth login     | No            |
| GET    | `/api/v1/auth/facebook`        | Facebook OAuth login   | No            |

### B.2 Products Endpoints

| Method | Endpoint                                | Description                     | Auth Required |
| ------ | --------------------------------------- | ------------------------------- | ------------- |
| GET    | `/api/v1/products`                      | Get all products (with filters) | No            |
| GET    | `/api/v1/products/:id`                  | Get product by ID               | No            |
| POST   | `/api/v1/products`                      | Create product                  | Yes (Seller)  |
| PUT    | `/api/v1/products/:id`                  | Update product                  | Yes (Seller)  |
| DELETE | `/api/v1/products/:id`                  | Delete product                  | Yes (Seller)  |
| GET    | `/api/v1/products/search`               | Search products                 | No            |
| GET    | `/api/v1/products/category/:categoryId` | Get products by category        | No            |

### B.3 Cart Endpoints

| Method | Endpoint               | Description      | Auth Required |
| ------ | ---------------------- | ---------------- | ------------- |
| GET    | `/api/v1/cart`         | Get user cart    | Yes           |
| POST   | `/api/v1/cart`         | Add item to cart | Yes           |
| PUT    | `/api/v1/cart/:itemId` | Update cart item | Yes           |
| DELETE | `/api/v1/cart/:itemId` | Remove cart item | Yes           |
| DELETE | `/api/v1/cart`         | Clear cart       | Yes           |

### B.4 Orders Endpoints

| Method | Endpoint                    | Description         | Auth Required |
| ------ | --------------------------- | ------------------- | ------------- |
| GET    | `/api/v1/orders`            | Get user orders     | Yes           |
| GET    | `/api/v1/orders/:id`        | Get order by ID     | Yes           |
| POST   | `/api/v1/orders`            | Create order        | Yes           |
| PUT    | `/api/v1/orders/:id`        | Update order status | Yes (Seller)  |
| POST   | `/api/v1/orders/:id/cancel` | Cancel order        | Yes           |

### B.5 Payment Endpoints

| Method | Endpoint                   | Description        | Auth Required |
| ------ | -------------------------- | ------------------ | ------------- |
| POST   | `/api/v1/payments/create`  | Create payment     | Yes           |
| POST   | `/api/v1/payments/webhook` | Payment webhook    | No (Signed)   |
| GET    | `/api/v1/payments/:id`     | Get payment status | Yes           |

### B.6 Shipping Endpoints

| Method | Endpoint                                 | Description              | Auth Required |
| ------ | ---------------------------------------- | ------------------------ | ------------- |
| POST   | `/api/v1/shipping/rates`                 | Calculate shipping rates | Yes           |
| GET    | `/api/v1/shipping/track/:trackingNumber` | Track shipment           | Yes           |
| POST   | `/api/v1/shipping/create`                | Create shipment          | Yes (Seller)  |

## Lampiran C: Database Schema Details

### C.1 User Table Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'USER',
  is_active BOOLEAN DEFAULT true,
  google_id VARCHAR(255) UNIQUE,
  facebook_id VARCHAR(255) UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  verification_token_expiry TIMESTAMP,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  birth DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active_verified ON users(is_active, is_verified);
```

### C.2 Product Table Schema

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] NOT NULL,
  is_published BOOLEAN DEFAULT true,
  is_preloved BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  seller_id INTEGER NOT NULL REFERENCES users(id),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  store_id INTEGER REFERENCES store(id),
  child_category_id INTEGER REFERENCES categories(id),
  parent_category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_seller ON products(seller_id, is_published, is_active);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
```

### C.3 Order Table Schema

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  total_amount INTEGER NOT NULL,
  items_amount INTEGER NOT NULL,
  shipping_cost INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'PENDING',
  notes TEXT,
  buyer_id INTEGER NOT NULL REFERENCES users(id),
  location_id INTEGER NOT NULL REFERENCES locations(id),
  discount_amount INTEGER DEFAULT 0,
  voucher_code VARCHAR(50),
  voucher_id INTEGER REFERENCES vouchers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_buyer_status ON orders(buyer_id, status);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
```

## Lampiran D: Environment Variables

### D.1 Backend Environment Variables

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/reluv_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3099
API_PREFIX=/api/v1

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Midtrans Configuration
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_IS_PRODUCTION=false

# Biteship Configuration
BITESHIP_API_KEY=your-biteship-api-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@reluv.app

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/auth/google/callback

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:8000/api/v1/auth/facebook/callback

# Security
BCRYPT_SALT_ROUNDS=10
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

### D.2 Frontend Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Cloudinary (Public)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Midtrans (Public)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your-client-key
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false

# Application
NEXT_PUBLIC_APP_NAME=Reluv App
NEXT_PUBLIC_APP_URL=http://localhost:3099
```

## Lampiran E: Testing Scenarios

### E.1 User Registration Flow Test

**Test Case:** User Registration dengan Email

**Steps:**

1. User mengakses halaman registrasi
2. User mengisi form dengan data valid:
   - Email: test@example.com
   - Password: Test1234!
   - First Name: Test
   - Last Name: User
3. User submit form
4. Sistem memvalidasi data
5. Sistem mengirim email verifikasi
6. User menerima email verifikasi
7. User klik link verifikasi
8. Email terverifikasi
9. User dapat login

**Expected Result:** User berhasil registrasi dan email terverifikasi

### E.2 Product Purchase Flow Test

**Test Case:** Complete Purchase Flow

**Steps:**

1. User login
2. User browse produk
3. User pilih produk
4. User pilih varian (ukuran, warna)
5. User klik "Add to Cart"
6. User pergi ke cart
7. User klik "Checkout"
8. User pilih alamat pengiriman
9. Sistem hitung shipping rate
10. User pilih courier
11. User apply voucher (jika ada)
12. User review order summary
13. User pilih metode pembayaran
14. User redirect ke Midtrans
15. User complete payment
16. Sistem verifikasi payment
17. Order status updated
18. Notifikasi dikirim

**Expected Result:** Order berhasil dibuat dan payment terverifikasi

## Lampiran F: Deployment Checklist

### F.1 Pre-Deployment Checklist

- [ ] Semua environment variables telah dikonfigurasi
- [ ] Database migrations telah dijalankan
- [ ] Database seed data telah diisi
- [ ] SSL certificate telah diinstal
- [ ] Domain name telah dikonfigurasi
- [ ] CDN telah dikonfigurasi
- [ ] Monitoring tools telah diinstal
- [ ] Error tracking telah dikonfigurasi
- [ ] Backup strategy telah disiapkan
- [ ] Security audit telah dilakukan

### F.2 Post-Deployment Checklist

- [ ] Health check endpoint berfungsi
- [ ] Database connection berfungsi
- [ ] API endpoints dapat diakses
- [ ] Frontend dapat diakses
- [ ] Payment gateway terintegrasi
- [ ] Shipping service terintegrasi
- [ ] Email service berfungsi
- [ ] Image upload berfungsi
- [ ] Authentication berfungsi
- [ ] Monitoring aktif

## Lampiran G: Glossary

### G.1 Istilah Teknis

- **API (Application Programming Interface)**: Antarmuka yang memungkinkan komunikasi antara aplikasi
- **JWT (JSON Web Token)**: Standar untuk token autentikasi berbasis JSON
- **ORM (Object-Relational Mapping)**: Teknik untuk mapping objek ke database
- **REST (Representational State Transfer)**: Arsitektur untuk web services
- **SSR (Server-Side Rendering)**: Teknik rendering halaman di server
- **SPA (Single Page Application)**: Aplikasi web yang dimuat sekali
- **CDN (Content Delivery Network)**: Jaringan untuk distribusi konten
- **CI/CD (Continuous Integration/Continuous Deployment)**: Otomatisasi build dan deployment

### G.2 Istilah Bisnis

- **Preloved**: Produk fashion yang telah digunakan sebelumnya namun masih layak pakai
- **GMV (Gross Merchandise Value)**: Total nilai transaksi di platform
- **AOV (Average Order Value)**: Rata-rata nilai per order
- **Conversion Rate**: Persentase visitor yang melakukan pembelian
- **CAC (Customer Acquisition Cost)**: Biaya untuk mendapatkan customer baru
- **LTV (Lifetime Value)**: Nilai total customer selama menggunakan platform

### G.3 Istilah E-commerce

- **Cart Abandonment**: Fenomena user menambahkan item ke cart namun tidak checkout
- **Checkout Flow**: Proses dari cart hingga pembayaran
- **Product Variant**: Variasi produk (ukuran, warna, dll)
- **SKU (Stock Keeping Unit)**: Kode unik untuk setiap varian produk
- **Order Fulfillment**: Proses pemenuhan order dari penjual ke pembeli

## Lampiran H: Sequence Diagrams

### H.1 Sequence Diagram - User Registration

```
User          Frontend         Backend         Database        Email Service
 │               │                │                │                │
 │──Register────▶│                │                │                │
 │               │──POST /auth/register───────────▶│                │
 │               │                │                │                │
 │               │                │──Validate──────▶│                │
 │               │                │                │                │
 │               │                │◀─User Data─────│                │
 │               │                │                │                │
 │               │                │──Hash Password─│                │
 │               │                │                │                │
 │               │                │──Save User────▶│                │
 │               │                │                │                │
 │               │                │──Generate Token│                │
 │               │                │                │                │
 │               │                │──Send Email────┼───────────────▶│
 │               │                │                │                │
 │               │◀──Success──────│                │                │
 │◀──Email Sent──│                │                │                │
 │               │                │                │                │
 │──Click Link──▶│                │                │                │
 │               │──GET /auth/verify───────────────▶│                │
 │               │                │                │                │
 │               │                │──Verify Token─▶│                │
 │               │                │                │                │
 │               │                │──Update Status▶│                │
 │               │                │                │                │
 │               │◀──Verified─────│                │                │
 │◀──Success─────│                │                │                │
```

### H.2 Sequence Diagram - Product Purchase Flow

```
Buyer         Frontend         Backend         Midtrans        Database
 │               │                │                │                │
 │──Add to Cart─▶│                │                │                │
 │               │──POST /cart───────────────────▶│                │
 │               │                │                │                │
 │               │                │──Save Cart────▶│                │
 │               │                │                │                │
 │               │◀──Success──────│                │                │
 │               │                │                │                │
 │──Checkout────▶│                │                │                │
 │               │──POST /orders─────────────────▶│                │
 │               │                │                │                │
 │               │                │──Create Order▶│                │
 │               │                │                │                │
 │               │                │──Create Payment Request───────▶│
 │               │                │                │                │
 │               │                │◀──Payment Token─────────────────│
 │               │                │                │                │
 │               │◀──Payment URL──│                │                │
 │──Redirect────▶│                │                │                │
 │               │                │                │                │
 │──Pay─────────┼────────────────┼───────────────▶│                │
 │               │                │                │                │
 │               │                │◀──Webhook──────│                │
 │               │                │                │                │
 │               │                │──Verify Payment│                │
 │               │                │                │                │
 │               │                │──Update Order─▶│                │
 │               │                │                │                │
 │               │◀──Notification─│                │                │
 │◀──Success─────│                │                │                │
```

### H.3 Sequence Diagram - Seller Product Listing

```
Seller        Frontend         Backend         Cloudinary      Database
 │               │                │                │                │
 │──Upload Img──▶│                │                │                │
 │               │──POST /upload──────────────────┼───────────────▶│
 │               │                │                │                │
 │               │                │                │◀──Image URL───│
 │               │                │                │                │
 │               │◀──Image URL────│                │                │
 │               │                │                │                │
 │──Submit──────▶│                │                │                │
 │               │──POST /products────────────────▶│                │
 │               │                │                │                │
 │               │                │──Validate──────│                │
 │               │                │                │                │
 │               │                │──Save Product──▶│                │
 │               │                │                │                │
 │               │◀──Product ID───│                │                │
 │◀──Success─────│                │                │                │
```

## Lampiran I: Activity Diagrams

### I.1 Activity Diagram - Complete Purchase Process

```
┌─────────────────────────────────────────────────────────────┐
│                    START: User Login                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Browse/Search Products│
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Select Product & Variant│
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │    Add to Cart          │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │    Review Cart          │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │    Click Checkout       │
              └────────────┬───────────┘
                           │
                           ▼
        ┌──────────────────┴──────────────────┐
        │                                      │
        ▼                                      ▼
┌───────────────┐                    ┌───────────────┐
│ Select Address│                    │ Add New Address│
└───────┬───────┘                    └───────┬───────┘
        │                                    │
        └──────────────┬─────────────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │  Calculate Shipping    │
              │  (Biteship API)        │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Select Courier         │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Apply Voucher (Optional)│
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Review Order Summary  │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Select Payment Method │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Create Payment (Midtrans)│
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Redirect to Payment  │
              └────────────┬───────────┘
                           │
                           ▼
        ┌──────────────────┴──────────────────┐
        │                                      │
        ▼                                      ▼
┌───────────────┐                    ┌───────────────┐
│ Payment Success│                   │ Payment Failed│
└───────┬───────┘                    └───────┬───────┘
        │                                    │
        │                                    ▼
        │                          ┌───────────────┐
        │                          │  Retry Payment│
        │                          └───────┬───────┘
        │                                    │
        └──────────────┬─────────────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │  Order Confirmed        │
              │  Send Notifications     │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │         END            │
              └────────────────────────┘
```

### I.2 Activity Diagram - Order Fulfillment (Seller Side)

```
┌─────────────────────────────────────────────────────────────┐
│              START: Order Notification Received              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Check Payment Status  │
              └────────────┬───────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                      │
        ▼                                      ▼
┌───────────────┐                    ┌───────────────┐
│ Payment Paid  │                    │ Payment Pending│
└───────┬───────┘                    └───────┬───────┘
        │                                    │
        │                                    │ (Wait)
        │                                    │
        └──────────────┬─────────────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │  Update Status:         │
              │  PROCESSING             │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Prepare Product        │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Pack Product           │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Create Shipment        │
              │  (Biteship)            │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Update Status: SHIPPED│
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Input Tracking Number │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Send Notification      │
              │  to Buyer               │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Track Delivery Status  │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Status: DELIVERED      │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │         END            │
              └────────────────────────┘
```

## Lampiran J: Data Dictionary dan Sample Data

### J.1 Data Dictionary - User Table

| Field Name                | Data Type | Length | Nullable | Default        | Description               | Constraints         |
| ------------------------- | --------- | ------ | -------- | -------------- | ------------------------- | ------------------- |
| id                        | INTEGER   | -      | NO       | AUTO_INCREMENT | Primary key               | PRIMARY KEY         |
| email                     | VARCHAR   | 255    | NO       | -              | User email address        | UNIQUE, NOT NULL    |
| password                  | VARCHAR   | 255    | YES      | NULL           | Hashed password           | -                   |
| phone                     | VARCHAR   | 20     | YES      | NULL           | Phone number              | -                   |
| role                      | ENUM      | -      | NO       | 'USER'         | User role                 | USER, SELLER, ADMIN |
| is_active                 | BOOLEAN   | -      | NO       | true           | Account status            | -                   |
| google_id                 | VARCHAR   | 255    | YES      | NULL           | Google OAuth ID           | UNIQUE              |
| facebook_id               | VARCHAR   | 255    | YES      | NULL           | Facebook OAuth ID         | UNIQUE              |
| is_verified               | BOOLEAN   | -      | NO       | false          | Email verification status | -                   |
| verification_token        | VARCHAR   | 255    | YES      | NULL           | Email verification token  | -                   |
| verification_token_expiry | TIMESTAMP | -      | YES      | NULL           | Token expiration          | -                   |
| first_name                | VARCHAR   | 100    | YES      | NULL           | First name                | -                   |
| last_name                 | VARCHAR   | 100    | YES      | NULL           | Last name                 | -                   |
| birth                     | DATE      | -      | YES      | NULL           | Date of birth             | -                   |
| created_at                | TIMESTAMP | -      | NO       | NOW()          | Record creation time      | -                   |
| updated_at                | TIMESTAMP | -      | NO       | NOW()          | Last update time          | AUTO UPDATE         |

### J.2 Data Dictionary - Product Table

| Field Name         | Data Type | Length | Nullable | Default        | Description          | Constraints      |
| ------------------ | --------- | ------ | -------- | -------------- | -------------------- | ---------------- |
| id                 | INTEGER   | -      | NO       | AUTO_INCREMENT | Primary key          | PRIMARY KEY      |
| name               | VARCHAR   | 255    | NO       | -              | Product name         | NOT NULL         |
| slug               | VARCHAR   | 255    | NO       | -              | URL-friendly name    | UNIQUE, NOT NULL |
| description        | TEXT      | -      | NO       | -              | Product description  | NOT NULL         |
| images             | TEXT[]    | -      | NO       | -              | Array of image URLs  | NOT NULL         |
| is_published       | BOOLEAN   | -      | NO       | true           | Publication status   | -                |
| is_preloved        | BOOLEAN   | -      | NO       | true           | Preloved flag        | -                |
| is_active          | BOOLEAN   | -      | NO       | true           | Active status        | -                |
| view_count         | INTEGER   | -      | NO       | 0              | View counter         | -                |
| seller_id          | INTEGER   | -      | NO       | -              | Seller user ID       | FOREIGN KEY      |
| category_id        | INTEGER   | -      | NO       | -              | Category ID          | FOREIGN KEY      |
| store_id           | INTEGER   | -      | YES      | NULL           | Store ID             | FOREIGN KEY      |
| child_category_id  | INTEGER   | -      | YES      | NULL           | Child category ID    | FOREIGN KEY      |
| parent_category_id | INTEGER   | -      | YES      | NULL           | Parent category ID   | FOREIGN KEY      |
| created_at         | TIMESTAMP | -      | NO       | NOW()          | Record creation time | -                |
| updated_at         | TIMESTAMP | -      | NO       | NOW()          | Last update time     | AUTO UPDATE      |

### J.3 Data Dictionary - Order Table

| Field Name      | Data Type | Length | Nullable | Default        | Description              | Constraints                                                       |
| --------------- | --------- | ------ | -------- | -------------- | ------------------------ | ----------------------------------------------------------------- |
| id              | INTEGER   | -      | NO       | AUTO_INCREMENT | Primary key              | PRIMARY KEY                                                       |
| order_number    | VARCHAR   | 50     | NO       | -              | Unique order number      | UNIQUE, NOT NULL                                                  |
| total_amount    | INTEGER   | -      | NO       | -              | Total order amount (IDR) | NOT NULL                                                          |
| items_amount    | INTEGER   | -      | NO       | -              | Items subtotal (IDR)     | NOT NULL                                                          |
| shipping_cost   | INTEGER   | -      | NO       | 0              | Shipping cost (IDR)      | -                                                                 |
| status          | ENUM      | -      | NO       | 'PENDING'      | Order status             | PENDING, PAID, SHIPPED, DELIVERED, COMPLETED, CANCELLED, REFUNDED |
| notes           | TEXT      | -      | YES      | NULL           | Order notes              | -                                                                 |
| buyer_id        | INTEGER   | -      | NO       | -              | Buyer user ID            | FOREIGN KEY                                                       |
| location_id     | INTEGER   | -      | NO       | -              | Shipping address ID      | FOREIGN KEY                                                       |
| discount_amount | INTEGER   | -      | NO       | 0              | Discount amount (IDR)    | -                                                                 |
| voucher_code    | VARCHAR   | 50     | YES      | NULL           | Applied voucher code     | -                                                                 |
| voucher_id      | INTEGER   | -      | YES      | NULL           | Voucher ID               | FOREIGN KEY                                                       |
| created_at      | TIMESTAMP | -      | NO       | NOW()          | Record creation time     | -                                                                 |
| updated_at      | TIMESTAMP | -      | NO       | NOW()          | Last update time         | AUTO UPDATE                                                       |

### J.4 Sample Data - Users

| id  | email              | first_name | last_name | role   | is_verified | created_at          |
| --- | ------------------ | ---------- | --------- | ------ | ----------- | ------------------- |
| 1   | buyer@example.com  | John       | Doe       | USER   | true        | 2024-01-15 10:00:00 |
| 2   | seller@example.com | Jane       | Smith     | SELLER | true        | 2024-01-15 10:05:00 |
| 3   | admin@example.com  | Admin      | User      | ADMIN  | true        | 2024-01-15 10:10:00 |

### J.5 Sample Data - Products

| id  | name                   | slug                   | price  | condition | seller_id | category_id | created_at          |
| --- | ---------------------- | ---------------------- | ------ | --------- | --------- | ----------- | ------------------- |
| 1   | Vintage Denim Jacket   | vintage-denim-jacket   | 250000 | LIKE_NEW  | 2         | 1           | 2024-01-16 09:00:00 |
| 2   | Designer Handbag       | designer-handbag       | 500000 | GOOD      | 2         | 5           | 2024-01-16 09:15:00 |
| 3   | Classic White Sneakers | classic-white-sneakers | 300000 | NEW       | 2         | 4           | 2024-01-16 09:30:00 |

### J.6 Sample Data - Orders

| id  | order_number | total_amount | status    | buyer_id | created_at          |
| --- | ------------ | ------------ | --------- | -------- | ------------------- |
| 1   | REL-2024-001 | 250000       | PAID      | 1        | 2024-01-17 14:00:00 |
| 2   | REL-2024-002 | 500000       | SHIPPED   | 1        | 2024-01-18 10:00:00 |
| 3   | REL-2024-003 | 300000       | DELIVERED | 1        | 2024-01-19 11:00:00 |

## Lampiran K: State Diagrams

### K.1 Order State Diagram

```
                    ┌─────────┐
                    │ PENDING │
                    └────┬────┘
                         │
                         │ Payment Success
                         │
                         ▼
                    ┌─────────┐
                    │  PAID   │
                    └────┬────┘
                         │
                         │ Seller Process
                         │
                         ▼
                    ┌─────────┐
                    │ SHIPPED │
                    └────┬────┘
                         │
                         │ Delivery Success
                         │
                         ▼
                    ┌──────────┐
                    │ DELIVERED│
                    └────┬─────┘
                         │
                         │ Buyer Confirm
                         │
                         ▼
                    ┌──────────┐
                    │COMPLETED │
                    └──────────┘

         ┌──────────────────────────────┐
         │                              │
         │  PENDING ──Cancel──▶ CANCELLED│
         │  PAID ────Refund───▶ REFUNDED│
         └──────────────────────────────┘
```

### K.2 Payment State Diagram

```
                    ┌─────────┐
                    │ PENDING │
                    └────┬────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         │ Payment       │ Payment       │ Payment
         │ Success       │ Failed        │ Expired
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │  PAID   │    │ FAILED  │    │ EXPIRED │
    └────┬────┘    └─────────┘    └─────────┘
         │
         │ Refund Request
         │
         ▼
    ┌──────────┐
    │ REFUNDED │
    └──────────┘
```

### K.3 Product Status State Diagram

```
                    ┌─────────┐
                    │ DRAFT   │
                    └────┬────┘
                         │
                         │ Publish
                         │
                         ▼
                    ┌─────────┐
                    │ ACTIVE  │
                    └────┬────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         │ Deactivate    │ Sold          │ Delete
         │               │               │
         ▼               ▼               ▼
    ┌──────────┐    ┌─────────┐    ┌──────────┐
    │ INACTIVE │    │  SOLD   │    │ DELETED  │
    └──────────┘    └─────────┘    └──────────┘
```

## Lampiran L: Error Codes dan Messages

### L.1 Authentication Error Codes

| Error Code | HTTP Status | Message                    | Description                      |
| ---------- | ----------- | -------------------------- | -------------------------------- |
| AUTH_001   | 400         | Invalid email format       | Email tidak valid                |
| AUTH_002   | 400         | Password too weak          | Password tidak memenuhi kriteria |
| AUTH_003   | 401         | Invalid credentials        | Email atau password salah        |
| AUTH_004   | 401         | Token expired              | JWT token telah kadaluarsa       |
| AUTH_005   | 401         | Unauthorized               | Tidak memiliki akses             |
| AUTH_006   | 403         | Email not verified         | Email belum diverifikasi         |
| AUTH_007   | 409         | Email already exists       | Email sudah terdaftar            |
| AUTH_008   | 400         | Invalid verification token | Token verifikasi tidak valid     |

### L.2 Product Error Codes

| Error Code | HTTP Status | Message                | Description                           |
| ---------- | ----------- | ---------------------- | ------------------------------------- |
| PROD_001   | 404         | Product not found      | Produk tidak ditemukan                |
| PROD_002   | 403         | Unauthorized to edit   | Tidak memiliki izin mengedit          |
| PROD_003   | 400         | Invalid product data   | Data produk tidak valid               |
| PROD_004   | 400         | Image upload failed    | Upload gambar gagal                   |
| PROD_005   | 400         | Invalid category       | Kategori tidak valid                  |
| PROD_006   | 400         | Product already exists | Produk dengan slug tersebut sudah ada |

### L.3 Order Error Codes

| Error Code | HTTP Status | Message                          | Description                   |
| ---------- | ----------- | -------------------------------- | ----------------------------- |
| ORD_001    | 404         | Order not found                  | Order tidak ditemukan         |
| ORD_002    | 400         | Cart is empty                    | Keranjang kosong              |
| ORD_003    | 400         | Invalid shipping address         | Alamat pengiriman tidak valid |
| ORD_004    | 400         | Shipping rate calculation failed | Gagal menghitung ongkos kirim |
| ORD_005    | 400         | Invalid voucher code             | Kode voucher tidak valid      |
| ORD_006    | 400         | Voucher expired                  | Voucher telah kadaluarsa      |
| ORD_007    | 400         | Insufficient stock               | Stok tidak mencukupi          |
| ORD_008    | 403         | Cannot cancel order              | Order tidak dapat dibatalkan  |

### L.4 Payment Error Codes

| Error Code | HTTP Status | Message                     | Description                   |
| ---------- | ----------- | --------------------------- | ----------------------------- |
| PAY_001    | 400         | Payment creation failed     | Gagal membuat payment         |
| PAY_002    | 400         | Invalid payment method      | Metode pembayaran tidak valid |
| PAY_003    | 400         | Payment verification failed | Verifikasi pembayaran gagal   |
| PAY_004    | 400         | Payment already processed   | Pembayaran sudah diproses     |
| PAY_005    | 400         | Refund failed               | Refund gagal                  |

## Lampiran M: Requirements to Features Mapping

### M.1 Functional Requirements Mapping

| Requirement ID | Requirement Description     | Feature                    | Status         |
| -------------- | --------------------------- | -------------------------- | -------------- |
| FR-001         | User Registration           | Auth Module - Register     | ✅ Implemented |
| FR-002         | User Authentication         | Auth Module - Login        | ✅ Implemented |
| FR-003         | Profile Management          | User Module - Profile      | ✅ Implemented |
| FR-004         | Product Listing             | Product Module - Create    | ✅ Implemented |
| FR-005         | Product Variants            | Product Module - Variants  | ✅ Implemented |
| FR-006         | Category System             | Category Module            | ✅ Implemented |
| FR-007         | Search & Filter             | Product Module - Search    | ✅ Implemented |
| FR-008         | Shopping Cart               | Cart Module                | ✅ Implemented |
| FR-009         | Checkout Process            | Order Module - Checkout    | ✅ Implemented |
| FR-010         | Address Management          | Location Module            | ✅ Implemented |
| FR-011         | Payment Integration         | Payment Module - Midtrans  | ✅ Implemented |
| FR-012         | Payment Tracking            | Payment Module - Status    | ✅ Implemented |
| FR-013         | Shipping Calculation        | Shipping Module - Biteship | ✅ Implemented |
| FR-014         | Order Tracking              | Shipment Module - Tracking | ✅ Implemented |
| FR-015         | Product Reviews             | Review Module              | ✅ Implemented |
| FR-016         | Seller Reviews              | Review Module - Seller     | ✅ Implemented |
| FR-017         | Voucher Management          | Voucher Module             | ✅ Implemented |
| FR-018         | Discount Management         | Discount Module            | ✅ Implemented |
| FR-019         | Store Profile               | Store Module - Profile     | ✅ Implemented |
| FR-020         | Store Analytics             | Store Module - Analytics   | ✅ Implemented |
| FR-021         | Order Management (Seller)   | Order Module - Seller      | ✅ Implemented |
| FR-022         | In-App Notifications        | Notification Module        | ✅ Implemented |
| FR-023         | Email Notifications         | Email Module               | ✅ Implemented |
| FR-024         | User Management (Admin)     | Admin Module - Users       | ✅ Implemented |
| FR-025         | Product Management (Admin)  | Admin Module - Products    | ✅ Implemented |
| FR-026         | Category Management (Admin) | Admin Module - Categories  | ✅ Implemented |
| FR-027         | Voucher Management (Admin)  | Admin Module - Vouchers    | ✅ Implemented |

### M.2 Non-Functional Requirements Mapping

| Requirement ID | Requirement Description   | Implementation                        | Status         |
| -------------- | ------------------------- | ------------------------------------- | -------------- |
| NFR-001        | Response Time < 200ms     | API Optimization, Caching             | ✅ Implemented |
| NFR-002        | Scalability 10,000+ users | Database Indexing, Connection Pooling | ✅ Implemented |
| NFR-003        | Uptime > 99.9%            | Monitoring, Health Checks             | ✅ Implemented |
| NFR-004        | JWT Authentication        | Auth Module - JWT                     | ✅ Implemented |
| NFR-005        | Data Protection           | HTTPS, Input Validation               | ✅ Implemented |
| NFR-006        | Payment Security          | PCI DSS Compliance (Midtrans)         | ✅ Implemented |
| NFR-007        | Responsive UI             | Tailwind CSS, Mobile-First            | ✅ Implemented |
| NFR-008        | User Experience           | Intuitive UI, Clear Error Messages    | ✅ Implemented |
| NFR-009        | Code Quality              | TypeScript, ESLint, Clean Code        | ✅ Implemented |
| NFR-010        | Test Coverage > 80%       | Unit Tests, Integration Tests         | ✅ Implemented |
| NFR-011        | Browser Compatibility     | Modern Browsers Support               | ✅ Implemented |
| NFR-012        | Device Compatibility      | Responsive Design                     | ✅ Implemented |

## Lampiran N: API Request/Response Examples

### N.1 Register User Request

**Request:**

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (Success):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isVerified": false
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/auth/register"
}
```

**Response (Error):**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "errors": [
    {
      "field": "email",
      "message": "Email is already registered"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/auth/register"
}
```

### N.2 Create Product Request

**Request:**

```http
POST /api/v1/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Vintage Denim Jacket",
  "description": "Classic vintage denim jacket in excellent condition",
  "categoryId": 1,
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ],
  "variants": [
    {
      "price": 250000,
      "stock": 1,
      "condition": "LIKE_NEW",
      "size": "M",
      "color": "Blue"
    }
  ]
}
```

**Response (Success):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Vintage Denim Jacket",
    "slug": "vintage-denim-jacket",
    "description": "Classic vintage denim jacket in excellent condition",
    "categoryId": 1,
    "sellerId": 2,
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

### N.3 Create Order Request

**Request:**

```http
POST /api/v1/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "locationId": 1,
  "courierCode": "jne",
  "serviceCode": "REG",
  "voucherCode": "WELCOME10"
}
```

**Response (Success):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "orderNumber": "REL-2024-001",
    "totalAmount": 250000,
    "itemsAmount": 200000,
    "shippingCost": 30000,
    "discountAmount": 20000,
    "status": "PENDING",
    "payment": {
      "snapToken": "abc123...",
      "snapRedirectUrl": "https://app.midtrans.com/snap/v2/vtweb/abc123..."
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/orders"
}
```

## Lampiran O: Contact Information

### O.1 Development Team

Untuk pertanyaan teknis atau support, silakan hubungi:

- **Email**: support@reluv.app
- **Documentation**: https://docs.reluv.app
- **GitHub**: https://github.com/reluv-app

### O.2 Third-Party Services Support

- **Midtrans Support**: https://docs.midtrans.com/docs/getting-started
- **Biteship Support**: https://biteship.com/en/docs
- **Cloudinary Support**: https://cloudinary.com/documentation

---

**Catatan:** Lampiran ini akan terus diperbarui seiring dengan perkembangan platform dan penambahan dokumentasi baru.
