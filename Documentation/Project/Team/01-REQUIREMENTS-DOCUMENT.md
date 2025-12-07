# Requirements Document
## Reluv App - E-Commerce Platform untuk Preloved Fashion

---

## 1. PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen ini berisi spesifikasi lengkap mengenai kebutuhan fungsional dan non-fungsional untuk pengembangan platform Reluv App. Dokumen ini digunakan sebagai acuan dalam proses pengembangan untuk memastikan semua fitur dan requirement terpenuhi sesuai dengan kebutuhan pengguna dan tujuan bisnis.

### 1.2 Ruang Lingkup

Dokumen ini mencakup:
- Functional Requirements (Kebutuhan Fungsional)
- Non-Functional Requirements (Kebutuhan Non-Fungsional)
- User Stories dan Use Cases
- Acceptance Criteria
- Constraints dan Assumptions

### 1.3 Target Pembaca

- Development Team
  - **Fullstack Engineer**: Petrus Handika
  - **Project Manager**: Akmal Amrulloh
  - **UI/UX Designer**: Farhan Fathurrahman
  - **QA Engineer**: Raihan Hafizh Hidayat
- Client/Stakeholder

---

## 2. IDENTIFIKASI STAKEHOLDER

### 2.1 Stakeholder Utama

#### 2.1.1 Pembeli (Buyers)

**Karakteristik**:
- Pengguna yang membeli produk preloved fashion
- Mencari produk berkualitas dengan harga terjangkau
- Peduli dengan kondisi dan keaslian produk

**Kebutuhan**:
- Kemudahan pencarian produk
- Informasi produk yang jelas dan akurat
- Transaksi yang aman
- Tracking pengiriman real-time

#### 2.1.2 Penjual (Sellers)

**Karakteristik**:
- Pengguna yang menjual produk preloved fashion
- Memiliki produk fashion bekas yang ingin dijual
- Ingin mendapatkan penghasilan tambahan

**Kebutuhan**:
- Kemudahan listing produk
- Tools manajemen toko
- Jangkauan pasar yang luas
- Sistem pembayaran yang terintegrasi

#### 2.1.3 Administrator (Admin)

**Karakteristik**:
- Pengelola platform
- Bertanggung jawab atas operasional platform

**Kebutuhan**:
- Dashboard analytics
- User management
- Content moderation
- System monitoring

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 User Management

#### FR-001: User Registration

**Deskripsi**: Sistem harus memungkinkan pengguna untuk mendaftar sebagai user baru.

**Detail**:
- User dapat mendaftar menggunakan email dan password
- User dapat mendaftar menggunakan Google OAuth
- User dapat mendaftar menggunakan Facebook OAuth
- Sistem harus memvalidasi format email
- Sistem harus memvalidasi kekuatan password (minimal 8 karakter)
- Sistem harus mengirim email verifikasi setelah registrasi

**Acceptance Criteria**:
- [ ] User dapat registrasi dengan email/password
- [ ] User dapat registrasi dengan Google
- [ ] User dapat registrasi dengan Facebook
- [ ] Email verifikasi terkirim setelah registrasi
- [ ] Password harus minimal 8 karakter

#### FR-002: User Login

**Deskripsi**: Sistem harus memungkinkan pengguna yang sudah terdaftar untuk login.

**Detail**:
- User dapat login menggunakan email dan password
- User dapat login menggunakan Google OAuth
- User dapat login menggunakan Facebook OAuth
- Sistem harus menyimpan session user
- Sistem harus memberikan token JWT untuk autentikasi

**Acceptance Criteria**:
- [ ] User dapat login dengan email/password
- [ ] User dapat login dengan Google
- [ ] User dapat login dengan Facebook
- [ ] Session tersimpan dengan aman
- [ ] JWT token di-generate setelah login

#### FR-003: User Profile Management

**Deskripsi**: User harus dapat mengelola profil mereka.

**Detail**:
- User dapat melihat profil mereka
- User dapat mengedit informasi profil (nama, email, phone, foto)
- User dapat mengubah password
- User dapat melihat riwayat transaksi

**Acceptance Criteria**:
- [ ] User dapat melihat profil
- [ ] User dapat mengedit profil
- [ ] User dapat mengubah password
- [ ] User dapat melihat riwayat transaksi

---

## 4. PRODUCT MANAGEMENT

### 4.1 Product Listing

#### FR-004: Create Product Listing

**Deskripsi**: Penjual harus dapat membuat listing produk baru.

**Detail**:
- Penjual dapat menambahkan informasi produk (nama, deskripsi, harga, kategori)
- Penjual dapat mengupload multiple images (minimal 1, maksimal 10)
- Penjual dapat menambahkan product variants (size, color, condition)
- Penjual dapat mengatur status produk (draft, published, sold)
- Sistem harus memvalidasi semua field yang wajib diisi

**Acceptance Criteria**:
- [ ] Penjual dapat membuat listing produk
- [ ] Penjual dapat upload multiple images
- [ ] Penjual dapat menambahkan variants
- [ ] Sistem memvalidasi field wajib
- [ ] Produk dapat disimpan sebagai draft

#### FR-005: Product Search and Filter

**Deskripsi**: Pembeli harus dapat mencari dan memfilter produk.

**Detail**:
- Pembeli dapat mencari produk berdasarkan keyword
- Pembeli dapat memfilter berdasarkan kategori
- Pembeli dapat memfilter berdasarkan harga (min-max)
- Pembeli dapat memfilter berdasarkan kondisi produk
- Pembeli dapat memfilter berdasarkan lokasi penjual
- Pembeli dapat mengurutkan hasil (harga, terbaru, rating)

**Acceptance Criteria**:
- [ ] Pembeli dapat mencari produk
- [ ] Pembeli dapat memfilter produk
- [ ] Pembeli dapat mengurutkan hasil
- [ ] Hasil pencarian relevan

#### FR-006: Product Detail View

**Deskripsi**: Pembeli harus dapat melihat detail produk.

**Detail**:
- Pembeli dapat melihat semua informasi produk
- Pembeli dapat melihat semua gambar produk
- Pembeli dapat melihat rating dan review produk
- Pembeli dapat melihat informasi penjual
- Pembeli dapat menambahkan produk ke cart
- Pembeli dapat menambahkan produk ke wishlist

**Acceptance Criteria**:
- [ ] Detail produk ditampilkan dengan lengkap
- [ ] Gambar produk dapat di-zoom
- [ ] Rating dan review ditampilkan
- [ ] Produk dapat ditambahkan ke cart/wishlist

---

## 5. SHOPPING FEATURES

### 5.1 Shopping Cart

#### FR-007: Add to Cart

**Deskripsi**: Pembeli harus dapat menambahkan produk ke shopping cart.

**Detail**:
- Pembeli dapat menambahkan produk ke cart
- Pembeli dapat memilih variant produk (size, color)
- Pembeli dapat mengatur quantity produk
- Sistem harus menampilkan total harga di cart
- Sistem harus memvalidasi stok produk

**Acceptance Criteria**:
- [ ] Produk dapat ditambahkan ke cart
- [ ] Variant dapat dipilih
- [ ] Quantity dapat diatur
- [ ] Total harga ditampilkan
- [ ] Stok divalidasi

#### FR-008: Manage Shopping Cart

**Deskripsi**: Pembeli harus dapat mengelola shopping cart mereka.

**Detail**:
- Pembeli dapat melihat semua item di cart
- Pembeli dapat mengubah quantity item
- Pembeli dapat menghapus item dari cart
- Pembeli dapat melihat total harga
- Sistem harus menghitung ongkos kirim

**Acceptance Criteria**:
- [ ] Item di cart dapat dilihat
- [ ] Quantity dapat diubah
- [ ] Item dapat dihapus
- [ ] Total harga dihitung dengan benar
- [ ] Ongkos kirim dihitung

#### FR-009: Wishlist Management

**Deskripsi**: Pembeli harus dapat mengelola wishlist mereka.

**Detail**:
- Pembeli dapat menambahkan produk ke wishlist
- Pembeli dapat melihat semua produk di wishlist
- Pembeli dapat menghapus produk dari wishlist
- Pembeli dapat memindahkan produk dari wishlist ke cart

**Acceptance Criteria**:
- [ ] Produk dapat ditambahkan ke wishlist
- [ ] Wishlist dapat dilihat
- [ ] Produk dapat dihapus dari wishlist
- [ ] Produk dapat dipindahkan ke cart

---

## 6. ORDER MANAGEMENT

### 6.1 Order Creation

#### FR-010: Create Order

**Deskripsi**: Pembeli harus dapat membuat order dari shopping cart.

**Detail**:
- Pembeli dapat membuat order dari cart
- Pembeli harus memilih alamat pengiriman
- Pembeli harus memilih metode pembayaran
- Pembeli harus memilih jasa pengiriman
- Sistem harus menghitung total (produk + ongkir)
- Sistem harus membuat order dengan status "pending payment"

**Acceptance Criteria**:
- [ ] Order dapat dibuat dari cart
- [ ] Alamat pengiriman harus dipilih
- [ ] Metode pembayaran harus dipilih
- [ ] Total dihitung dengan benar
- [ ] Order status "pending payment"

#### FR-011: Order Tracking

**Deskripsi**: Pembeli dan penjual harus dapat melacak status order.

**Detail**:
- User dapat melihat status order (pending, paid, processing, shipped, delivered, cancelled)
- User dapat melihat detail order
- User dapat melihat tracking number pengiriman
- Sistem harus mengupdate status order secara real-time

**Acceptance Criteria**:
- [ ] Status order dapat dilihat
- [ ] Detail order lengkap
- [ ] Tracking number tersedia
- [ ] Status update real-time

---

## 7. PAYMENT INTEGRATION

### 7.1 Payment Processing

#### FR-012: Payment Integration

**Deskripsi**: Sistem harus terintegrasi dengan payment gateway untuk memproses pembayaran.

**Detail**:
- Sistem harus terintegrasi dengan Midtrans
- Sistem harus mendukung multiple payment methods (Bank Transfer, E-Wallet, Credit Card)
- Sistem harus memproses payment notification dari Midtrans
- Sistem harus mengupdate order status setelah payment berhasil
- Sistem harus menangani payment failure

**Acceptance Criteria**:
- [ ] Integrasi dengan Midtrans berfungsi
- [ ] Multiple payment methods tersedia
- [ ] Payment notification diproses
- [ ] Order status terupdate setelah payment
- [ ] Payment failure ditangani dengan baik

---

## 8. SHIPPING INTEGRATION

### 8.1 Shipping Management

#### FR-013: Shipping Cost Calculation

**Deskripsi**: Sistem harus dapat menghitung ongkos kirim secara real-time.

**Detail**:
- Sistem harus terintegrasi dengan Biteship
- Sistem harus menghitung ongkos kirim berdasarkan alamat pengirim dan penerima
- Sistem harus menampilkan multiple shipping options
- Sistem harus menampilkan estimasi waktu pengiriman
- Sistem harus menyimpan shipping cost ke order

**Acceptance Criteria**:
- [ ] Integrasi dengan Biteship berfungsi
- [ ] Ongkos kirim dihitung real-time
- [ ] Multiple shipping options ditampilkan
- [ ] Estimasi waktu pengiriman ditampilkan
- [ ] Shipping cost tersimpan di order

#### FR-014: Shipping Tracking

**Deskripsi**: Sistem harus dapat melacak status pengiriman.

**Detail**:
- Sistem harus menampilkan tracking number
- Sistem harus menampilkan status pengiriman real-time
- Sistem harus mengirim notifikasi saat status pengiriman berubah
- Sistem harus menampilkan history tracking

**Acceptance Criteria**:
- [ ] Tracking number ditampilkan
- [ ] Status pengiriman real-time
- [ ] Notifikasi terkirim saat status berubah
- [ ] History tracking tersedia

---

## 9. REVIEW AND RATING

### 9.1 Product Reviews

#### FR-015: Product Review

**Deskripsi**: Pembeli harus dapat memberikan review dan rating untuk produk yang sudah dibeli.

**Detail**:
- Pembeli dapat memberikan rating (1-5 stars)
- Pembeli dapat menulis review text
- Pembeli dapat upload foto review
- Sistem harus memvalidasi bahwa pembeli sudah membeli produk
- Sistem harus menampilkan review di halaman produk

**Acceptance Criteria**:
- [ ] Rating dapat diberikan (1-5 stars)
- [ ] Review text dapat ditulis
- [ ] Foto review dapat diupload
- [ ] Hanya pembeli yang sudah membeli dapat review
- [ ] Review ditampilkan di halaman produk

---

## 10. NON-FUNCTIONAL REQUIREMENTS

### 10.1 Performance Requirements

#### NFR-001: Response Time

- Halaman harus load dalam waktu maksimal 3 detik
- API response time maksimal 500ms untuk 95% requests
- Database query harus dioptimalkan

#### NFR-002: Scalability

- Sistem harus dapat menangani 1000 concurrent users
- Sistem harus dapat menangani 10,000 produk
- Database harus dapat di-scale horizontal

### 10.2 Security Requirements

#### NFR-003: Authentication & Authorization

- Sistem harus menggunakan JWT untuk authentication
- Password harus di-hash menggunakan bcrypt
- Session harus expire setelah 24 jam
- Role-based access control harus diimplementasikan

#### NFR-004: Data Protection

- Data pribadi harus dienkripsi
- Payment data tidak boleh disimpan di database
- HTTPS harus digunakan untuk semua komunikasi
- Input validation harus dilakukan untuk mencegah SQL injection dan XSS

### 10.3 Usability Requirements

#### NFR-005: User Interface

- Interface harus responsif (mobile, tablet, desktop)
- Interface harus intuitif dan mudah digunakan
- Error messages harus jelas dan informatif
- Loading states harus ditampilkan

#### NFR-006: Accessibility

- Website harus accessible (WCAG 2.1 Level AA)
- Keyboard navigation harus didukung
- Screen reader compatibility

### 10.4 Reliability Requirements

#### NFR-007: Availability

- Sistem harus memiliki uptime 99% atau lebih
- Backup harus dilakukan secara rutin
- Disaster recovery plan harus tersedia

#### NFR-008: Error Handling

- Error harus ditangani dengan baik
- Error messages harus user-friendly
- Error logging harus dilakukan

---

## 11. CONSTRAINTS

### 11.1 Technical Constraints

- Menggunakan teknologi yang sudah ditentukan (Next.js, NestJS, PostgreSQL)
- Integrasi dengan third-party services (Midtrans, Biteship, Cloudinary)
- Deployment di platform yang sudah ditentukan (Vercel, Railway/Render)

### 11.2 Business Constraints

- Budget terbatas: Rp 2.950.000
- Timeline terbatas: 4 minggu
- Resource terbatas: Tim kecil

### 11.3 Regulatory Constraints

- Compliance dengan regulasi data privacy (UU PDP)
- Compliance dengan regulasi e-commerce di Indonesia

---

## 12. ASSUMPTIONS

### 12.1 Technical Assumptions

- Internet connection stabil untuk development dan deployment
- Third-party services (Midtrans, Biteship, Cloudinary) available dan reliable
- PostgreSQL database dapat diakses

### 12.2 Business Assumptions

- Client dapat memberikan feedback tepat waktu
- Requirements tidak akan berubah signifikan selama development
- Testing dapat dilakukan dengan data sample

---

## 13. GLOSSARY

- **Preloved**: Produk fashion bekas pakai yang masih layak pakai
- **Escrow**: Sistem jaminan transaksi dimana pembayaran ditahan sampai barang diterima
- **JWT**: JSON Web Token, metode autentikasi stateless
- **OAuth**: Protokol autentikasi untuk social login
- **API**: Application Programming Interface
- **ORM**: Object-Relational Mapping

---

**Dokumen ini dibuat pada**: 01/01/2025  
**Versi**: 1.0  
**Status**: Final - Requirements Document

