# PENDAHULUAN

## 1.1 Latar belakang

Pertumbuhan pesat pasar barang bekas (preloved) didorong oleh meningkatnya kesadaran akan ekonomi sirkular dan kebutuhan akan alternatif belanja yang lebih hemat. Seiring dengan itu, perilaku konsumen telah bergeser secara masif ke platform digital untuk mencari, memvalidasi, dan membeli barang. 

Hal ini menjadikan website e-commerce bukan lagi sekadar pilihan, melainkan sebuah kebutuhan strategis untuk menciptakan pasar yang terstruktur dan tepercaya bagi komunitas penjual dan pembeli barang preloved. Sebuah platform yang efektif harus mampu memfasilitasi transaksi sekaligus membangun citra merek yang andal dan aman bagi penggunanya.

Tantangan untuk beradaptasi di era digital ini sejalan dengan pandangan para ahli. Menurut Mochtar Riady yang dikutip oleh Rohimah (2019), perubahan sosial di era digital tidak dapat dihindari, sehingga pelaku usaha harus peka terhadap teknologi agar tetap relevan. Hal ini diperkuat oleh Rhenald Khasali yang dikutip oleh Rohimah (2019), yang menyebutkan bahwa teknologi memperpendek jarak antara penjual dan pembeli. 

Kegagalan dalam mengadopsi platform yang tepat akan menyebabkan sebuah bisnis, termasuk marketplace preloved, ditinggalkan oleh penggunanya yang beralih ke solusi yang lebih modern dan efisien.

Masalah utama yang sering dijumpai pada banyak platform e-commerce preloved saat ini adalah performa teknis yang kurang optimal. Website yang lambat, struktur yang tidak terorganisir, dan terutama, kelemahan dalam optimasi mesin pencari (SEO) menjadi kendala serius. 

Produk preloved seringkali bersifat unik dan sangat bergantung pada penemuan melalui kata kunci spesifik di mesin pencari. Tanpa SEO yang efektif dan kecepatan muat halaman yang baik, visibilitas produk menurun drastis dan potensi transaksi pun hilang.

Untuk menjawab tantangan tersebut, perancangan ini mengusulkan solusi berbasis teknologi modern dengan mengimplementasikan Server-Side Rendering (SSR). Teknologi frontend akan dibangun menggunakan framework Next.js, yang secara inheren dirancang untuk SSR guna menghasilkan waktu muat yang sangat cepat dan keunggulan SEO yang signifikan. Sementara itu, sisi backend akan dikelola oleh NestJS, sebuah framework Node.js yang kokoh dan terstruktur, ideal untuk membangun API dan logika bisnis yang skalabel untuk sebuah platform e-commerce.

## 1.2 Ruang Lingkup

Ruang lingkup pada pembahasan ini berfokus pada perancangan dan pembangunan sistem e-commerce barang preloved yang komprehensif dan terintegrasi, mencakup seluruh alur krusial dari pengguna hingga administrator. Proyek ini akan mengimplementasikan sistem autentikasi pengguna yang aman dan berbasis peran, di mana terdapat proses registrasi, login, dan manajemen profil untuk membedakan hak akses antara pembeli dan penjual.

Setelah pengguna terautentikasi, sistem akan memfasilitasi siklus transaksi secara penuh dengan mengintegrasikan sistem pembayaran (payment gateway) yang andal. Proses checkout dan pembayaran dapat diproses secara otomatis dan aman langsung di dalam platform. 

Guna meningkatkan transparansi dan kepercayaan, akan dikembangkan juga fungsionalitas pelacakan pesanan (order tracking), yang membuat pembeli dan penjual dapat memantau setiap tahapan status pesanan secara real-time.

Seluruh aktivitas vital ini akan diawasi dan dikelola melalui sebuah dashboard admin yang terpusat dan kuat. Dashboard ini memberikan administrator kemampuan untuk melakukan manajemen pengguna, memonitor dan memvalidasi transaksi pembayaran, melacak semua status pesanan yang berjalan, mengelola konten produk, serta menganalisis data untuk mengawasi kesehatan operasional platform secara keseluruhan.

## 1.3 Tujuan Penelitian

Tujuan utama dari penelitian ini adalah merancang dan membangun sebuah website e-commerce barang preloved yang berkinerja tinggi dengan mengimplementasikan arsitektur Server-Side Rendering (SSR) menggunakan Next.js untuk frontend dan NestJS untuk backend.

Secara spesifik, penelitian ini bertujuan untuk:

1. Menghasilkan platform yang fungsional secara menyeluruh guna menjawab tantangan performa dan visibilitas SEO.
2. Menyediakan siklus transaksi yang lengkap mulai dari sistem autentikasi pengguna, integrasi pembayaran, hingga fungsionalitas pelacakan pesanan.
3. Membangun sebuah dashboard administrasi yang terpusat dan efisien, yang dirancang untuk memberikan kemudahan bagi administrator dalam mengelola seluruh aktivitas pengguna, transaksi, dan produk secara efektif.

## 1.4 Metode Penelitian

Metode yang digunakan dalam perancangan dan pembangunan aplikasi website e-commerce barang preloved ini adalah Software Development Life Cycle (SDLC) dengan menerapkan pendekatan Agile. Pendekatan ini dipilih untuk memastikan fleksibilitas dalam pengembangan dan kemampuan untuk beradaptasi dengan perubahan kebutuhan.

Terdapat 5 tahapan utama dalam SDLC yang diterapkan pada proyek ini, yaitu:

1. **Perencanaan**: Menentukan tujuan dan ruang lingkup utama website, yaitu untuk membangun sebuah platform e-commerce preloved yang fungsional. Platform ini mencakup fitur autentikasi pengguna, manajemen produk oleh pengguna, integrasi pembayaran, dan pelacakan pesanan. Dilakukan juga pemilihan teknologi, dengan menetapkan Next.js (dengan SSR) untuk frontend, NestJS untuk backend, Tailwind CSS untuk desain antarmuka yang responsif, dan database PostgreSQL dengan Prisma ORM untuk manajemen data yang efisien.
2. **Analisis**: Melakukan analisis kebutuhan fungsional dan non-fungsional sistem secara mendalam. Kebutuhan fungsional mencakup alur registrasi pengguna, proses unggah produk, mekanisme pencarian, hingga alur transaksi pembayaran dan pelacakan pesanan. 

Kebutuhan non-fungsional yang menjadi prioritas adalah performa (kecepatan muat halaman yang tinggi berkat SSR), keamanan (terutama pada transaksi dan data pengguna), serta optimasi struktur untuk Search Engine Optimization (SEO).
3. **Perancangan**: Merancang arsitektur sistem secara keseluruhan. Ini mencakup perancangan antarmuka pengguna dan pengalaman pengguna (UI/UX) untuk pembeli, penjual, dan administrator. 

Dirancang pula arsitektur headless di mana frontend (Next.js) berkomunikasi dengan backend (NestJS) melalui RESTful API, serta perancangan skema database untuk mengelola data pengguna, produk, dan transaksi secara terstruktur.
4. **Implementasi**: Mengembangkan aplikasi berdasarkan hasil perancangan. Tim frontend membangun komponen antarmuka yang dinamis dan responsif menggunakan Next.js dengan menerapkan Server-Side Rendering pada halaman-halaman krusial seperti halaman detail produk. 

Sementara itu, tim backend membangun RESTful API menggunakan NestJS untuk menangani seluruh logika bisnis, otentikasi, dan interaksi dengan database.
5. **Uji Coba**: Melakukan pengujian sistem secara menyeluruh untuk memastikan semua fitur berfungsi sesuai harapan dan bebas dari bug. Pengujian mencakup fungsionalitas utama seperti alur transaksi dari awal hingga akhir, pengujian performa untuk memvalidasi kecepatan akses yang dihasilkan oleh SSR, pengujian keamanan pada sistem autentikasi dan pembayaran, serta pengujian SEO untuk memastikan halaman dapat diindeks dengan baik oleh mesin pencari.

## 1.5 Sistematika Tulisan Ilmiah

Pada penulisan ilmiah ini, sistematika penulisan disusun dalam beberapa bagian yang terdiri dari empat bab utama, yaitu Pendahuluan, Tinjauan Pustaka, Pembahasan, dan Penutup.

- **Bab Pendahuluan** akan menguraikan pokok persoalan yang meliputi latar belakang, ruang lingkup, tujuan penelitian, metode penelitian yang digunakan, serta sistematika penulisan ini.
- **Bab Tinjauan Pustaka** akan membahas landasan teori yang relevan, mencakup konsep e-commerce untuk model marketplace preloved, teknologi Server-Side Rendering (SSR), serta pembahasan mengenai framework Next.js dan NestJS.
- **Bab Pembahasan** akan menjelaskan secara rinci dan teknis seluruh proses perancangan dan pembangunan sistem, mulai dari tahap analisis, perancangan arsitektur, implementasi kode, hingga hasil pengujian fungsionalitas dan performa website.
- **Bab Penutup** akan disajikan kesimpulan dari keseluruhan hasil penelitian serta saran untuk pengembangan platform di masa mendatang.
