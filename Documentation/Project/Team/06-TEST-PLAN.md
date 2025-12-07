# Test Plan
## Reluv App - E-Commerce Platform untuk Preloved Fashion

---

## 1. PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen ini menjelaskan rencana pengujian (test plan) untuk platform Reluv App. Dokumen ini mencakup strategi pengujian, test cases, dan acceptance criteria untuk memastikan kualitas sistem.

### 1.2 Ruang Lingkup Testing

Testing mencakup:
- Unit Testing
- Integration Testing
- System Testing
- User Acceptance Testing (UAT)

### 1.3 Target Pembaca

- **QA Engineer**: Raihan Hafizh Hidayat
- Development Team
  - **Fullstack Engineer**: Petrus Handika
- **Project Manager**: Akmal Amrulloh
- Client/Stakeholder

### 1.4 QA Engineer

**QA Engineer**: Raihan Hafizh Hidayat

Tanggung jawab:
- Test planning dan execution
- Quality assurance
- Bug tracking dan reporting
- Test documentation

---

## 2. TESTING STRATEGY

### 2.1 Testing Levels

#### 2.1.1 Unit Testing

**Tujuan**: Menguji individual components dan functions

**Scope**:
- Service methods
- Utility functions
- Component logic
- API endpoints (individual)

**Tools**:
- Jest (Backend)
- React Testing Library (Frontend)

**Coverage Target**: Minimum 70%

#### 2.1.2 Integration Testing

**Tujuan**: Menguji integrasi antar komponen

**Scope**:
- API endpoints dengan database
- Frontend-Backend integration
- Third-party integrations (Midtrans, Biteship, Cloudinary)

**Tools**:
- Jest dengan Supertest (Backend)
- Cypress atau Playwright (E2E)

#### 2.1.3 System Testing

**Tujuan**: Menguji sistem secara keseluruhan

**Scope**:
- End-to-end user flows
- Performance testing
- Security testing
- Compatibility testing

#### 2.1.4 User Acceptance Testing (UAT)

**Tujuan**: Validasi bahwa sistem memenuhi kebutuhan user

**Scope**:
- User flows sesuai requirement
- Usability testing
- Business logic validation

---

## 3. TEST CASES

### 3.1 Authentication

#### TC-001: User Registration

**Test Case ID**: TC-001  
**Test Case Name**: User Registration dengan Email/Password  
**Priority**: High

**Preconditions**: User belum terdaftar

**Test Steps**:
1. Buka halaman register
2. Isi form dengan data valid
3. Submit form
4. Verifikasi email verifikasi terkirim

**Expected Result**:
- User berhasil terdaftar
- Email verifikasi terkirim
- User di-redirect ke halaman login atau verifikasi

**Test Data**:
```
firstName: "John"
lastName: "Doe"
email: "john@example.com"
password: "password123"
confirmPassword: "password123"
```

#### TC-002: User Login

**Test Case ID**: TC-002  
**Test Case Name**: User Login dengan Email/Password  
**Priority**: High

**Preconditions**: User sudah terdaftar dan verified

**Test Steps**:
1. Buka halaman login
2. Masukkan email dan password
3. Click login button

**Expected Result**:
- User berhasil login
- Token JWT di-generate
- User di-redirect ke dashboard

**Test Data**:
```
email: "john@example.com"
password: "password123"
```

#### TC-003: Google OAuth Login

**Test Case ID**: TC-003  
**Test Case Name**: Login dengan Google OAuth  
**Priority**: Medium

**Preconditions**: User memiliki Google account

**Test Steps**:
1. Buka halaman login
2. Click "Login with Google"
3. Authorize aplikasi di Google
4. Verifikasi callback

**Expected Result**:
- User berhasil login dengan Google
- User data di-create atau di-update
- User di-redirect ke dashboard

---

### 3.2 Product Management

#### TC-004: Create Product Listing

**Test Case ID**: TC-004  
**Test Case Name**: Penjual membuat listing produk baru  
**Priority**: High

**Preconditions**: User sudah login sebagai penjual

**Test Steps**:
1. Buka halaman "Add Product"
2. Isi form produk (nama, deskripsi, harga, kategori)
3. Upload gambar produk
4. Tambahkan variants (jika ada)
5. Submit form

**Expected Result**:
- Produk berhasil dibuat
- Produk muncul di "My Products"
- Produk dapat dilihat di public listing

**Test Data**:
```
name: "Vintage Denim Jacket"
description: "Denim jacket in good condition"
price: 250000
categoryId: "uuid"
images: [file1, file2]
```

#### TC-005: Search Products

**Test Case ID**: TC-005  
**Test Case Name**: Pencarian produk dengan keyword  
**Priority**: High

**Preconditions**: Ada produk di database

**Test Steps**:
1. Buka halaman products
2. Masukkan keyword di search box
3. Click search atau tekan Enter

**Expected Result**:
- Hasil pencarian relevan dengan keyword
- Produk yang sesuai ditampilkan
- Pagination berfungsi jika hasil banyak

**Test Data**:
```
keyword: "jacket"
```

#### TC-006: Filter Products

**Test Case ID**: TC-006  
**Test Case Name**: Filter produk berdasarkan kategori dan harga  
**Priority**: Medium

**Preconditions**: Ada produk di database

**Test Steps**:
1. Buka halaman products
2. Pilih kategori dari filter
3. Set range harga (min-max)
4. Apply filter

**Expected Result**:
- Hanya produk dengan kategori yang dipilih ditampilkan
- Hanya produk dalam range harga ditampilkan
- Filter dapat di-reset

---

### 3.3 Shopping Cart

#### TC-007: Add to Cart

**Test Case ID**: TC-007  
**Test Case Name**: Menambahkan produk ke shopping cart  
**Priority**: High

**Preconditions**: User sudah login, ada produk tersedia

**Test Steps**:
1. Buka halaman detail produk
2. Pilih variant (size, color)
3. Set quantity
4. Click "Add to Cart"

**Expected Result**:
- Produk ditambahkan ke cart
- Cart icon menampilkan jumlah item
- Item muncul di cart page

#### TC-008: Update Cart Item

**Test Case ID**: TC-008  
**Test Case Name**: Mengubah quantity item di cart  
**Priority**: Medium

**Preconditions**: Ada item di cart

**Test Steps**:
1. Buka halaman cart
2. Ubah quantity item
3. Verifikasi total harga terupdate

**Expected Result**:
- Quantity terupdate
- Subtotal item terupdate
- Total cart terupdate

---

### 3.4 Order Management

#### TC-009: Create Order

**Test Case ID**: TC-009  
**Test Case Name**: Membuat order dari cart  
**Priority**: High

**Preconditions**: Ada item di cart, user punya alamat

**Test Steps**:
1. Buka halaman cart
2. Click "Checkout"
3. Pilih alamat pengiriman
4. Pilih metode pembayaran
5. Pilih jasa pengiriman
6. Apply voucher (opsional)
7. Click "Place Order"

**Expected Result**:
- Order berhasil dibuat
- Order status: "pending_payment"
- Payment URL di-generate
- Cart dikosongkan

#### TC-010: Order Tracking

**Test Case ID**: TC-010  
**Test Case Name**: Melacak status order  
**Priority**: Medium

**Preconditions**: Ada order yang sudah dibuat

**Test Steps**:
1. Buka halaman "My Orders"
2. Click order yang ingin dilacak
3. Verifikasi status order
4. Verifikasi tracking number (jika sudah shipped)

**Expected Result**:
- Status order ditampilkan
- Tracking number tersedia (jika shipped)
- History status ditampilkan

---

### 3.5 Payment Integration

#### TC-011: Payment Processing

**Test Case ID**: TC-011  
**Test Case Name**: Proses pembayaran melalui Midtrans  
**Priority**: High

**Preconditions**: Ada order dengan status "pending_payment"

**Test Steps**:
1. Buka payment URL dari order
2. Pilih metode pembayaran
3. Lakukan pembayaran (test mode)
4. Verifikasi callback dari Midtrans

**Expected Result**:
- Payment URL valid
- Payment berhasil diproses
- Order status terupdate menjadi "paid"
- Notification terkirim ke user

---

## 4. PERFORMANCE TESTING

### 4.1 Load Testing

**Tujuan**: Menguji performa sistem di bawah beban normal

**Scenarios**:
- 100 concurrent users
- 1000 requests per minute
- Response time < 500ms untuk 95% requests

### 4.2 Stress Testing

**Tujuan**: Menguji batas maksimal sistem

**Scenarios**:
- 500 concurrent users
- 5000 requests per minute
- Sistem tetap stabil

---

## 5. SECURITY TESTING

### 5.1 Authentication Testing

- Test invalid credentials
- Test expired tokens
- Test unauthorized access
- Test SQL injection
- Test XSS attacks

### 5.2 Authorization Testing

- Test role-based access
- Test resource ownership
- Test admin-only endpoints

---

## 6. ACCEPTANCE CRITERIA

### 6.1 Functional Acceptance

- [ ] Semua functional requirements terpenuhi
- [ ] Semua test cases passed
- [ ] Tidak ada critical bugs
- [ ] Tidak ada high-priority bugs

### 6.2 Non-Functional Acceptance

- [ ] Response time < 3 detik untuk halaman
- [ ] API response time < 500ms
- [ ] Uptime > 99%
- [ ] Security vulnerabilities tidak ada

### 6.3 User Acceptance

- [ ] UAT passed oleh client
- [ ] User flows sesuai requirement
- [ ] Usability acceptable
- [ ] Documentation lengkap

---

## 7. TEST ENVIRONMENT

### 7.1 Development Environment

- **URL**: `http://localhost:3099` (Frontend)
- **API**: `http://localhost:8000/api/v1` (Backend)
- **Database**: Local PostgreSQL

### 7.2 Staging Environment

- **URL**: `https://staging.reluv.app`
- **API**: `https://api-staging.reluv.app/api/v1`
- **Database**: Staging PostgreSQL

### 7.3 Production Environment

- **URL**: `https://reluv.app`
- **API**: `https://api.reluv.app/api/v1`
- **Database**: Production PostgreSQL

---

## 8. TEST SCHEDULE

### 8.1 Testing Timeline

- **Week 1-2**: Unit testing selama development
- **Week 3**: Integration testing
- **Week 4**: System testing dan UAT

### 8.2 Test Execution

- Daily testing untuk features yang baru selesai
- Weekly test report
- Bug tracking dan resolution

---

**Dokumen ini dibuat pada**: 01/01/2025  
**Versi**: 1.0  
**Status**: Final - Test Plan

