# Ruang Lingkup

## 4.1 Ruang Lingkup Fungsional

### 4.1.1 Manajemen Pengguna (User Management)

Platform Reluv App menyediakan sistem manajemen pengguna yang komprehensif dengan fitur-fitur berikut:

1. **Registrasi dan Autentikasi**

   - Registrasi dengan email dan password
   - Login dengan email/password
   - Social login (Google, Facebook)
   - Email verification
   - Password reset dan recovery

2. **Profil Pengguna**

   - Manajemen profil pengguna (nama, foto, bio, dll)
   - Manajemen alamat pengiriman
   - Riwayat transaksi
   - Wishlist
   - Notifikasi

3. **Role dan Permission**
   - User (pembeli)
   - Seller (penjual)
   - Admin (administrator platform)

### 4.1.2 Manajemen Produk (Product Management)

Sistem manajemen produk dirancang khusus untuk produk preloved fashion:

1. **Listing Produk**

   - Upload produk dengan informasi lengkap
   - Upload multiple images
   - Deskripsi produk yang detail
   - Kategorisasi produk
   - Tag dan atribut produk

2. **Varian Produk**

   - Manajemen varian (ukuran, warna, kondisi)
   - Harga per varian
   - Stok per varian
   - Kondisi produk (New, Like New, Good, Fair, Poor)

3. **Manajemen Inventori**
   - Tracking stok
   - Update status produk (aktif/nonaktif)
   - Archive produk

### 4.1.3 Sistem Kategorisasi

Sistem kategorisasi yang komprehensif untuk produk fashion:

1. **Kategori Utama**

   - Women (Wanita)
   - Men (Pria)
   - Kids (Anak-anak)
   - Accessories (Aksesoris)
   - Shoes (Sepatu)
   - Bags (Tas)

2. **Sub-kategori**

   - Kategori bertingkat (parent-child)
   - Filter berdasarkan kategori
   - Navigasi berdasarkan kategori

3. **Brand Management**
   - Kategorisasi berdasarkan brand
   - Filter berdasarkan brand
   - Brand verification

### 4.1.4 Shopping Cart dan Checkout

Sistem keranjang belanja dan checkout yang user-friendly:

1. **Shopping Cart**

   - Add to cart
   - Update quantity
   - Remove item
   - Cart persistence
   - Cart summary

2. **Checkout Process**
   - Pilih alamat pengiriman
   - Pilih metode pengiriman
   - Pilih metode pembayaran
   - Apply voucher/diskon
   - Review order
   - Place order

### 4.1.5 Sistem Pembayaran (Payment System)

Integrasi dengan sistem pembayaran yang aman:

1. **Metode Pembayaran**

   - Bank Transfer
   - E-Wallet (GoPay, OVO, DANA, dll)
   - Credit/Debit Card
   - Virtual Account

2. **Payment Gateway**
   - Integrasi dengan Midtrans
   - Payment verification
   - Payment status tracking
   - Refund processing

### 4.1.6 Sistem Pengiriman (Shipping System)

Sistem pengiriman yang terintegrasi:

1. **Shipping Rate Calculation**

   - Real-time shipping rate calculation
   - Integrasi dengan Biteship
   - Multiple courier options
   - Estimated delivery time

2. **Order Tracking**
   - Tracking number
   - Real-time tracking updates
   - Delivery status notifications
   - Delivery confirmation

### 4.1.7 Sistem Review dan Rating

Sistem review dan rating yang dapat dipercaya:

1. **Product Reviews**

   - Rating produk (1-5 stars)
   - Written review
   - Photo review
   - Verified purchase badge

2. **Seller Reviews**
   - Rating penjual
   - Review tentang pengalaman berbelanja
   - Response dari penjual

### 4.1.8 Sistem Voucher dan Diskon

Sistem promosi yang terintegrasi:

1. **Voucher**

   - Voucher code
   - Voucher types (percentage, fixed amount, free shipping)
   - Voucher validity period
   - Voucher usage limit

2. **Discount**
   - Product discount
   - Category discount
   - Store discount
   - Global discount

### 4.1.9 Manajemen Toko (Store Management)

Tools untuk penjual dalam mengelola toko mereka:

1. **Store Profile**

   - Store information
   - Store banner dan logo
   - Store description
   - Store verification

2. **Store Analytics**

   - Sales statistics
   - Product performance
   - Customer analytics
   - Revenue reports

3. **Order Management**
   - View orders
   - Update order status
   - Process orders
   - Cancel orders

### 4.1.10 Sistem Notifikasi

Sistem notifikasi yang komprehensif:

1. **Notification Types**

   - Order notifications
   - Payment notifications
   - Shipping notifications
   - Review notifications
   - Promotional notifications

2. **Notification Channels**
   - In-app notifications
   - Email notifications
   - Push notifications (future)

### 4.1.11 Sistem Pencarian dan Filter

Sistem pencarian yang efektif:

1. **Search Functionality**

   - Text search
   - Advanced search
   - Search suggestions
   - Search history

2. **Filtering**
   - Filter by category
   - Filter by price range
   - Filter by condition
   - Filter by brand
   - Filter by size
   - Filter by location

### 4.1.12 Admin Panel

Panel administrasi untuk mengelola platform:

1. **User Management**

   - View all users
   - User verification
   - User ban/unban
   - User statistics

2. **Product Management**

   - View all products
   - Product approval
   - Product moderation
   - Product statistics

3. **Order Management**

   - View all orders
   - Order monitoring
   - Order statistics

4. **Category Management**

   - Create/edit categories
   - Category hierarchy
   - Category statistics

5. **Voucher Management**
   - Create/edit vouchers
   - Voucher statistics

## 4.2 Ruang Lingkup Teknis

### 4.2.1 Teknologi yang Digunakan

1. **Frontend**

   - Next.js 16 (App Router)
   - React 19
   - TypeScript
   - Tailwind CSS 4
   - Zustand (State Management)
   - React Hook Form + Zod (Form Validation)
   - Axios (HTTP Client)

2. **Backend**

   - NestJS 11
   - TypeScript
   - PostgreSQL (Database)
   - Prisma ORM
   - JWT Authentication
   - Passport.js (OAuth)

3. **Third-party Services**
   - Cloudinary (Image Upload)
   - Midtrans (Payment Gateway)
   - Biteship (Shipping)
   - Nodemailer (Email Service)

### 4.2.2 Arsitektur Sistem

1. **Client-Server Architecture**

   - Frontend sebagai client
   - Backend sebagai server
   - RESTful API communication

2. **Database Design**

   - Relational database (PostgreSQL)
   - Normalized schema
   - Indexing untuk optimasi

3. **Security**
   - JWT-based authentication
   - Password hashing (bcrypt)
   - HTTPS encryption
   - Input validation
   - SQL injection prevention

### 4.2.3 Deployment dan Infrastructure

1. **Development Environment**

   - Local development setup
   - Environment variables
   - Database migrations

2. **Production Environment**
   - Cloud hosting
   - Database hosting
   - CDN for static assets
   - SSL certificates

## 4.3 Ruang Lingkup Non-Fungsional

### 4.3.1 Performa

1. **Response Time**

   - API response time < 200ms
   - Page load time < 3 seconds
   - Image optimization

2. **Scalability**
   - Support untuk 10,000+ concurrent users
   - Horizontal scaling capability
   - Database optimization

### 4.2.2 Keamanan

1. **Data Protection**

   - Encryption untuk sensitive data
   - Secure password storage
   - Secure API endpoints

2. **Authentication & Authorization**
   - Secure authentication mechanism
   - Role-based access control
   - Session management

### 4.3.3 Usability

1. **User Experience**

   - Intuitive user interface
   - Responsive design
   - Accessibility compliance

2. **Documentation**
   - User documentation
   - Developer documentation
   - API documentation

### 4.3.4 Maintainability

1. **Code Quality**

   - Clean code principles
   - Code documentation
   - Type safety (TypeScript)

2. **Testing**
   - Unit testing
   - Integration testing
   - E2E testing (future)

## 4.4 Batasan Ruang Lingkup

### 4.4.1 Fitur yang Tidak Termasuk (Out of Scope)

1. **Mobile Native Apps**

   - Aplikasi mobile native (iOS/Android) tidak termasuk dalam scope awal
   - Platform fokus pada web application yang responsive

2. **Live Chat**

   - Fitur live chat antara pembeli dan penjual tidak termasuk dalam versi awal
   - Komunikasi dilakukan melalui sistem pesan atau review

3. **Auction/Bidding System**

   - Sistem lelang tidak termasuk dalam scope
   - Platform fokus pada fixed price sales

4. **Multi-currency**

   - Platform hanya mendukung mata uang Rupiah (IDR)
   - Tidak ada konversi mata uang

5. **International Shipping**

   - Pengiriman hanya untuk wilayah Indonesia
   - Tidak ada pengiriman internasional

6. **AI/ML Features**

   - Fitur AI/ML seperti recommendation engine yang advanced tidak termasuk dalam versi awal
   - Dapat ditambahkan di versi selanjutnya

7. **Blockchain Integration**
   - Integrasi blockchain untuk verifikasi keaslian tidak termasuk dalam scope awal
   - Dapat dipertimbangkan untuk versi selanjutnya

### 4.4.2 Platform yang Tidak Didukung

1. **Legacy Browsers**

   - Browser yang tidak mendukung ES6+ tidak didukung
   - Fokus pada modern browsers

2. **Offline Mode**
   - Platform memerlukan koneksi internet
   - Tidak ada mode offline

## 4.5 Asumsi dan Ketergantungan

### 4.5.1 Asumsi

1. **Infrastructure**

   - Ketersediaan internet yang stabil
   - Server hosting yang reliable
   - Database hosting yang scalable

2. **Third-party Services**

   - Ketersediaan dan reliability dari third-party services (Midtrans, Biteship, Cloudinary)
   - API yang stabil dari third-party services

3. **User Behavior**
   - Pengguna memiliki pengetahuan dasar tentang e-commerce
   - Pengguna memiliki akses ke email untuk verifikasi
   - Pengguna memiliki metode pembayaran yang valid

### 4.5.2 Ketergantungan

1. **External Services**

   - Midtrans untuk payment processing
   - Biteship untuk shipping calculation
   - Cloudinary untuk image storage
   - Email service provider untuk notifications

2. **Technology Stack**

   - Node.js runtime
   - PostgreSQL database
   - Modern web browsers

3. **Regulations**
   - Compliance dengan regulasi e-commerce di Indonesia
   - Compliance dengan data protection regulations
