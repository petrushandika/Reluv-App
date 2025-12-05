# Analisis Kebutuhan

## 7.1 Pendahuluan

Analisis kebutuhan merupakan tahap kritis dalam pengembangan sistem yang bertujuan untuk mengidentifikasi, mendokumentasikan, dan memvalidasi kebutuhan fungsional dan non-fungsional dari sistem yang akan dikembangkan. Analisis kebutuhan yang komprehensif memastikan bahwa sistem yang dikembangkan dapat memenuhi kebutuhan pengguna dan tujuan bisnis.

## 7.2 Metodologi Analisis Kebutuhan

### 7.2.1 Teknik Pengumpulan Kebutuhan

Beberapa teknik yang digunakan dalam pengumpulan kebutuhan untuk platform Reluv App:

1. **Studi Literatur**

   - Analisis platform e-commerce yang ada
   - Best practices dalam pengembangan e-commerce
   - Karakteristik pasar preloved fashion

2. **Analisis Kompetitor**

   - Analisis fitur-fitur platform kompetitor
   - Identifikasi gap dan peluang
   - Analisis user experience dari platform yang ada

3. **User Personas**

   - Identifikasi karakteristik pengguna target
   - Kebutuhan dan pain points dari setiap persona
   - Use cases untuk setiap persona

4. **User Stories**
   - Dokumentasi kebutuhan dalam bentuk user stories
   - Acceptance criteria untuk setiap user story
   - Priority mapping

## 7.3 Identifikasi Stakeholder

### 7.3.1 Stakeholder Utama

1. **Pembeli (Buyers)**

   - Pengguna yang membeli produk preloved fashion
   - Karakteristik: Mencari produk berkualitas dengan harga terjangkau
   - Kebutuhan: Kemudahan pencarian, informasi produk yang jelas, transaksi yang aman

2. **Penjual (Sellers)**

   - Pengguna yang menjual produk preloved fashion
   - Karakteristik: Memiliki produk fashion bekas yang ingin dijual
   - Kebutuhan: Kemudahan listing produk, tools manajemen toko, jangkauan pasar yang luas

3. **Administrator (Admins)**
   - Pengelola platform
   - Karakteristik: Bertanggung jawab atas operasional platform
   - Kebutuhan: Tools untuk mengelola platform, monitoring, dan analitik

### 7.3.2 Stakeholder Sekunder

1. **Payment Gateway Provider (Midtrans)**

   - Penyedia layanan pembayaran
   - Kebutuhan: Integrasi yang aman dan reliable

2. **Shipping Provider (Biteship)**

   - Penyedia layanan pengiriman
   - Kebutuhan: Integrasi untuk perhitungan ongkos kirim dan tracking

3. **Cloud Storage Provider (Cloudinary)**
   - Penyedia layanan penyimpanan gambar
   - Kebutuhan: Integrasi untuk upload dan optimasi gambar

## 7.4 User Personas

### 7.4.1 Persona Pembeli

**Persona 1: Sarah - Mahasiswa Pencari Fashion Terjangkau**

- **Demografi**: Perempuan, 22 tahun, mahasiswa, tinggal di Jakarta
- **Teknologi**: Aktif menggunakan smartphone, familiar dengan e-commerce
- **Tujuan**: Mencari produk fashion branded dengan harga terjangkau
- **Pain Points**:
  - Kesulitan menemukan produk yang sesuai dengan budget
  - Khawatir tentang kualitas produk preloved
  - Tidak yakin dengan keaslian produk
- **Kebutuhan**:
  - Filter harga yang jelas
  - Informasi kondisi produk yang detail
  - Sistem rating dan review yang dapat dipercaya
  - Foto produk yang jelas dari berbagai sudut

**Persona 2: Budi - Pekerja Muda Pencari Style Vintage**

- **Demografi**: Laki-laki, 28 tahun, pekerja kantoran, tinggal di Bandung
- **Teknologi**: Tech-savvy, sering berbelanja online
- **Tujuan**: Mencari produk fashion vintage dan unique items
- **Pain Points**:
  - Kesulitan menemukan produk vintage yang autentik
  - Tidak ada kategorisasi yang baik untuk produk vintage
- **Kebutuhan**:
  - Kategorisasi berdasarkan era/style
  - Filter berdasarkan brand vintage
  - Informasi detail tentang tahun dan kondisi produk

### 7.4.2 Persona Penjual

**Persona 1: Rina - Ibu Rumah Tangga yang Ingin Menjual Pakaian Tidak Terpakai**

- **Demografi**: Perempuan, 35 tahun, ibu rumah tangga, tinggal di Surabaya
- **Teknologi**: Menggunakan smartphone, familiar dengan media sosial, kurang familiar dengan e-commerce
- **Tujuan**: Menjual pakaian yang tidak terpakai untuk mendapatkan pendapatan tambahan
- **Pain Points**:
  - Tidak tahu cara membuat listing yang menarik
  - Kesulitan menentukan harga yang tepat
  - Tidak yakin dengan proses pengiriman
- **Kebutuhan**:
  - Proses listing yang sederhana dan mudah dipahami
  - Panduan untuk menentukan harga
  - Bantuan dalam proses pengiriman
  - Tools untuk mengelola produk

**Persona 2: Andi - Reseller Preloved Fashion**

- **Demografi**: Laki-laki, 30 tahun, reseller, tinggal di Yogyakarta
- **Teknologi**: Tech-savvy, familiar dengan berbagai platform e-commerce
- **Tujuan**: Mengelola toko preloved fashion dengan efisien
- **Pain Points**:
  - Kesulitan mengelola banyak produk
  - Perlu tools analitik untuk tracking penjualan
  - Perlu fitur promosi untuk meningkatkan penjualan
- **Kebutuhan**:
  - Dashboard yang komprehensif
  - Tools analitik dan laporan
  - Fitur promosi dan diskon
  - Bulk operations untuk mengelola banyak produk

## 7.5 Functional Requirements

### 7.5.1 Manajemen Pengguna

**FR-001: Registrasi Pengguna**

- Sistem harus memungkinkan pengguna untuk mendaftar dengan email dan password
- Sistem harus memvalidasi format email dan kekuatan password
- Sistem harus mengirim email verifikasi setelah registrasi
- Sistem harus memungkinkan registrasi melalui social login (Google, Facebook)

**FR-002: Autentikasi Pengguna**

- Sistem harus memungkinkan pengguna untuk login dengan email/password
- Sistem harus memungkinkan login melalui social login
- Sistem harus mengimplementasikan JWT untuk session management
- Sistem harus memungkinkan pengguna untuk reset password

**FR-003: Manajemen Profil**

- Sistem harus memungkinkan pengguna untuk mengupdate profil mereka
- Sistem harus memungkinkan pengguna untuk upload foto profil
- Sistem harus menyimpan informasi profil pengguna

### 7.5.2 Manajemen Produk

**FR-004: Listing Produk**

- Sistem harus memungkinkan penjual untuk membuat listing produk baru
- Sistem harus memungkinkan penjual untuk upload multiple images
- Sistem harus memungkinkan penjual untuk memasukkan informasi produk (nama, deskripsi, harga, kategori, kondisi)
- Sistem harus memvalidasi semua field yang required

**FR-005: Manajemen Varian Produk**

- Sistem harus memungkinkan penjual untuk menambahkan varian produk (ukuran, warna)
- Sistem harus memungkinkan penjual untuk mengatur harga dan stok per varian
- Sistem harus memungkinkan penjual untuk mengatur kondisi produk per varian

**FR-006: Kategorisasi Produk**

- Sistem harus menyediakan sistem kategorisasi yang hierarkis
- Sistem harus memungkinkan filtering berdasarkan kategori
- Sistem harus mendukung kategori utama (Women, Men, Kids, Accessories, Shoes, Bags)

**FR-007: Pencarian dan Filter**

- Sistem harus menyediakan fungsi pencarian berdasarkan keyword
- Sistem harus menyediakan filter berdasarkan kategori, harga, kondisi, brand, ukuran, lokasi
- Sistem harus menyediakan sorting (harga, tanggal, popularitas)

### 7.5.3 Shopping Cart dan Checkout

**FR-008: Shopping Cart**

- Sistem harus memungkinkan pengguna untuk menambahkan produk ke cart
- Sistem harus memungkinkan pengguna untuk mengupdate quantity di cart
- Sistem harus memungkinkan pengguna untuk menghapus item dari cart
- Sistem harus menyimpan cart state (persistence)

**FR-009: Checkout Process**

- Sistem harus memungkinkan pengguna untuk memilih alamat pengiriman
- Sistem harus memungkinkan pengguna untuk memilih metode pengiriman
- Sistem harus menghitung ongkos kirim secara real-time
- Sistem harus memungkinkan pengguna untuk apply voucher/diskon
- Sistem harus menampilkan ringkasan order sebelum checkout

**FR-010: Manajemen Alamat**

- Sistem harus memungkinkan pengguna untuk menambahkan multiple alamat
- Sistem harus memungkinkan pengguna untuk mengupdate dan menghapus alamat
- Sistem harus memvalidasi alamat menggunakan geocoding

### 7.5.4 Sistem Pembayaran

**FR-011: Integrasi Payment Gateway**

- Sistem harus terintegrasi dengan Midtrans untuk payment processing
- Sistem harus mendukung multiple metode pembayaran (Bank Transfer, E-Wallet, Credit Card)
- Sistem harus memverifikasi status pembayaran
- Sistem harus mengupdate status order berdasarkan status pembayaran

**FR-012: Payment Status Tracking**

- Sistem harus menampilkan status pembayaran kepada pengguna
- Sistem harus mengirim notifikasi tentang status pembayaran
- Sistem harus memproses refund jika diperlukan

### 7.5.5 Sistem Pengiriman

**FR-013: Shipping Rate Calculation**

- Sistem harus terintegrasi dengan Biteship untuk perhitungan ongkos kirim
- Sistem harus menghitung ongkos kirim secara real-time berdasarkan alamat pengiriman
- Sistem harus menyediakan multiple pilihan jasa pengiriman
- Sistem harus menampilkan estimated delivery time

**FR-014: Order Tracking**

- Sistem harus menyediakan tracking number untuk setiap pengiriman
- Sistem harus menampilkan status pengiriman secara real-time
- Sistem harus mengirim notifikasi tentang update status pengiriman

### 7.5.6 Sistem Review dan Rating

**FR-015: Product Reviews**

- Sistem harus memungkinkan pembeli untuk memberikan rating (1-5 stars)
- Sistem harus memungkinkan pembeli untuk menulis review
- Sistem harus memungkinkan pembeli untuk upload foto review
- Sistem harus menampilkan verified purchase badge untuk review dari pembeli yang telah membeli

**FR-016: Seller Reviews**

- Sistem harus memungkinkan pembeli untuk memberikan rating kepada penjual
- Sistem harus memungkinkan penjual untuk merespons review
- Sistem harus menampilkan overall rating penjual

### 7.5.7 Sistem Voucher dan Diskon

**FR-017: Voucher Management**

- Sistem harus memungkinkan admin untuk membuat voucher
- Sistem harus mendukung berbagai jenis voucher (percentage, fixed amount, free shipping)
- Sistem harus memvalidasi voucher code
- Sistem harus menerapkan batasan penggunaan voucher

**FR-018: Discount Management**

- Sistem harus memungkinkan penjual untuk membuat diskon produk
- Sistem harus memungkinkan admin untuk membuat diskon global
- Sistem harus menghitung diskon secara otomatis

### 7.5.8 Manajemen Toko

**FR-019: Store Profile**

- Sistem harus memungkinkan penjual untuk membuat dan mengelola profil toko
- Sistem harus memungkinkan penjual untuk upload banner dan logo toko
- Sistem harus menampilkan informasi toko kepada pembeli

**FR-020: Store Analytics**

- Sistem harus menyediakan dashboard untuk penjual
- Sistem harus menampilkan statistik penjualan
- Sistem harus menampilkan analitik produk
- Sistem harus menyediakan laporan penjualan

**FR-021: Order Management untuk Penjual**

- Sistem harus menampilkan semua order kepada penjual
- Sistem harus memungkinkan penjual untuk mengupdate status order
- Sistem harus memungkinkan penjual untuk membatalkan order

### 7.5.9 Sistem Notifikasi

**FR-022: In-App Notifications**

- Sistem harus menampilkan notifikasi dalam aplikasi
- Sistem harus mengkategorikan notifikasi (order, payment, shipping, review)
- Sistem harus memungkinkan pengguna untuk mark notifikasi sebagai read

**FR-023: Email Notifications**

- Sistem harus mengirim email untuk event penting (order confirmation, payment confirmation, shipping update)
- Sistem harus menggunakan template email yang menarik

### 7.5.10 Admin Panel

**FR-024: User Management**

- Sistem harus memungkinkan admin untuk melihat semua pengguna
- Sistem harus memungkinkan admin untuk memverifikasi pengguna
- Sistem harus memungkinkan admin untuk ban/unban pengguna

**FR-025: Product Management**

- Sistem harus memungkinkan admin untuk melihat semua produk
- Sistem harus memungkinkan admin untuk approve/reject produk
- Sistem harus memungkinkan admin untuk menghapus produk

**FR-026: Category Management**

- Sistem harus memungkinkan admin untuk membuat dan mengelola kategori
- Sistem harus memungkinkan admin untuk mengatur hierarki kategori

**FR-027: Voucher Management**

- Sistem harus memungkinkan admin untuk membuat dan mengelola voucher
- Sistem harus menampilkan statistik penggunaan voucher

## 7.6 Non-Functional Requirements

### 7.6.1 Performance Requirements

**NFR-001: Response Time**

- API response time harus < 200ms untuk 95% dari requests
- Page load time harus < 3 seconds untuk 95% dari page loads
- Image loading harus dioptimalkan dengan lazy loading dan compression

**NFR-002: Scalability**

- Sistem harus dapat menangani 10,000+ concurrent users
- Sistem harus dapat menangani 100,000+ produk
- Database harus dioptimalkan dengan indexing yang tepat

**NFR-003: Availability**

- Sistem harus memiliki uptime > 99.9%
- Sistem harus memiliki backup dan recovery strategy
- Sistem harus memiliki monitoring dan alerting

### 7.6.2 Security Requirements

**NFR-004: Authentication dan Authorization**

- Sistem harus menggunakan JWT untuk authentication
- Sistem harus mengimplementasikan password hashing dengan bcrypt
- Sistem harus mengimplementasikan role-based access control (RBAC)

**NFR-005: Data Protection**

- Sistem harus menggunakan HTTPS untuk semua komunikasi
- Sistem harus mengimplementasikan input validation dan sanitization
- Sistem harus melindungi terhadap SQL injection, XSS, CSRF attacks
- Sistem harus mematuhi regulasi data protection (GDPR, UU PDP)

**NFR-006: Payment Security**

- Sistem harus menggunakan payment gateway yang PCI DSS compliant
- Sistem tidak boleh menyimpan informasi kartu kredit
- Sistem harus memverifikasi semua transaksi pembayaran

### 7.6.3 Usability Requirements

**NFR-007: User Interface**

- Interface harus intuitif dan mudah digunakan
- Interface harus responsif untuk berbagai ukuran layar (mobile, tablet, desktop)
- Interface harus mengikuti accessibility guidelines (WCAG 2.1 Level AA)

**NFR-008: User Experience**

- Proses checkout harus dapat diselesaikan dalam < 5 langkah
- Error messages harus jelas dan actionable
- Loading states harus ditampilkan untuk operasi yang memakan waktu

### 7.6.4 Maintainability Requirements

**NFR-009: Code Quality**

- Kode harus mengikuti coding standards dan best practices
- Kode harus terdokumentasi dengan baik
- Kode harus menggunakan TypeScript untuk type safety

**NFR-010: Testing**

- Sistem harus memiliki unit test coverage > 80%
- Sistem harus memiliki integration tests untuk critical paths
- Sistem harus memiliki automated testing dalam CI/CD pipeline

### 7.6.5 Compatibility Requirements

**NFR-011: Browser Compatibility**

- Sistem harus kompatibel dengan modern browsers (Chrome, Firefox, Safari, Edge)
- Sistem harus mendukung browser versi terbaru dan 2 versi sebelumnya

**NFR-012: Device Compatibility**

- Sistem harus responsif untuk mobile devices (iOS, Android)
- Sistem harus responsif untuk tablets
- Sistem harus optimal untuk desktop

## 7.7 Use Cases

### 7.7.1 Use Case: Pembeli Membeli Produk

**Actor**: Pembeli

**Preconditions**:

- Pembeli telah login
- Produk tersedia di platform

**Main Flow**:

1. Pembeli mencari produk menggunakan search atau filter
2. Pembeli melihat detail produk
3. Pembeli memilih varian (ukuran, warna) jika ada
4. Pembeli menambahkan produk ke cart
5. Pembeli pergi ke cart dan review items
6. Pembeli klik checkout
7. Pembeli memilih alamat pengiriman
8. Sistem menghitung ongkos kirim
9. Pembeli memilih metode pengiriman
10. Pembeli apply voucher jika ada
11. Pembeli review order summary
12. Pembeli memilih metode pembayaran
13. Pembeli melakukan pembayaran
14. Sistem memverifikasi pembayaran
15. Sistem mengirim konfirmasi order

**Postconditions**:

- Order telah dibuat
- Pembayaran telah diverifikasi
- Notifikasi telah dikirim

### 7.7.2 Use Case: Penjual Membuat Listing Produk

**Actor**: Penjual

**Preconditions**:

- Penjual telah login
- Penjual telah membuat toko

**Main Flow**:

1. Penjual pergi ke halaman "Sell"
2. Penjual mengisi informasi produk (nama, deskripsi, harga)
3. Penjual memilih kategori
4. Penjual memilih kondisi produk
5. Penjual upload gambar produk (minimal 1, maksimal 5)
6. Penjual menambahkan varian jika ada (ukuran, warna)
7. Penjual mengatur harga dan stok per varian
8. Penjual review informasi produk
9. Penjual submit produk
10. Sistem memvalidasi data
11. Sistem menyimpan produk
12. Sistem menampilkan konfirmasi

**Postconditions**:

- Produk telah dibuat dan tersedia di platform
- Produk dapat dicari dan dibeli oleh pembeli

### 7.7.3 Use Case: Penjual Mengelola Order

**Actor**: Penjual

**Preconditions**:

- Penjual telah login
- Ada order baru untuk produk penjual

**Main Flow**:

1. Penjual melihat notifikasi order baru
2. Penjual pergi ke dashboard toko
3. Penjual melihat daftar order
4. Penjual melihat detail order
5. Penjual memverifikasi pembayaran
6. Penjual mengupdate status order menjadi "Processing"
7. Penjual mempersiapkan produk untuk dikirim
8. Penjual mengupdate status order menjadi "Shipped"
9. Penjual memasukkan tracking number
10. Sistem mengirim notifikasi kepada pembeli

**Postconditions**:

- Status order telah diupdate
- Pembeli telah diberi notifikasi
- Tracking number telah tersedia

## 7.8 Prioritas Kebutuhan

### 7.8.1 Must Have (P0 - Critical)

Fitur-fitur yang harus ada untuk MVP:

- User authentication dan registration
- Product listing dan browsing
- Shopping cart dan checkout
- Payment integration
- Shipping integration
- Basic admin panel

### 7.8.2 Should Have (P1 - High Priority)

Fitur-fitur yang penting untuk user experience:

- Product reviews dan ratings
- Voucher system
- Advanced search dan filter
- Store management untuk penjual
- Email notifications

### 7.8.3 Nice to Have (P2 - Medium Priority)

Fitur-fitur yang dapat ditambahkan di versi selanjutnya:

- Wishlist
- Product recommendations
- Social sharing
- Advanced analytics
- Mobile app

## 7.9 Kesimpulan Analisis Kebutuhan

Analisis kebutuhan telah mengidentifikasi kebutuhan fungsional dan non-fungsional yang komprehensif untuk platform Reluv App. Kebutuhan-kebutuhan ini menjadi dasar untuk perancangan sistem dan implementasi. Prioritas kebutuhan telah ditetapkan untuk memastikan bahwa fitur-fitur kritis diimplementasikan terlebih dahulu, sementara fitur-fitur tambahan dapat ditambahkan dalam iterasi selanjutnya.
