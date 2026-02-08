# BAB 4

# PENUTUP

## 4.1. Kesimpulan

Berdasarkan dari penelitian yang telah dibuat dengan judul "Perancangan dan Implementasi Website E-Commerce Reluv untuk Jual Beli Produk Fashion Preloved Menggunakan Next.js, NestJS, dan PostgreSQL" dapat ditarik kesimpulan bahwa website berhasil dibuat dan berjalan baik sesuai dengan harapan yaitu dapat membantu dalam melakukan transaksi jual beli produk fashion preloved secara online, mengelola toko dan produk, serta memfasilitasi pembayaran dan pengiriman dengan integrasi layanan pihak ketiga.

Website Reluv telah berhasil mengimplementasikan fitur-fitur utama yang diperlukan untuk platform e-commerce modern, termasuk sistem autentikasi dengan OAuth (Google dan Facebook), manajemen produk dengan upload gambar ke Cloudinary, sistem keranjang belanja, proses checkout yang terintegrasi dengan Midtrans untuk pembayaran dan Biteship untuk pengiriman, serta sistem review dan rating produk. Seluruh data telah terintegrasi dengan database PostgreSQL melalui Neon DB sehingga penjual dapat mengelola toko mereka secara efisien tanpa harus melakukan pencatatan manual.

Website Reluv melewati ujicoba lintas browser menggunakan Chrome v131.0, Firefox v133.0, dan Edge v131.0. Berdasarkan hasil pengujian menggunakan Google Lighthouse, kecepatan yang paling tinggi ada pada browser Microsoft Edge dengan kecepatan akses halaman utama 1.2 detik dan skor Performance 84%. Ujicoba black box menunjukkan hasil bekerja dengan baik pada semua fitur untuk tiga role pengguna (Superadmin, Store/Penjual, dan User/Pembeli). Website Reluv dapat dilihat sudah dapat diakses secara online melalui deployment di Vercel dengan backend yang terhubung ke Neon DB sebagai database PostgreSQL serverless. Website Reluv dapat diakses menggunakan link https://fe-reluv-app.vercel.app/

Implementasi teknologi modern seperti Next.js untuk frontend dengan Server-Side Rendering (SSR) dan Static Site Generation (SSG), NestJS untuk backend API yang modular dan scalable, serta integrasi dengan layanan eksternal seperti Midtrans, Biteship, dan Cloudinary telah berhasil meningkatkan performa dan user experience dari platform Reluv. Skor SEO yang mencapai 100% pada semua browser menunjukkan bahwa website telah dioptimalkan dengan baik untuk mesin pencari, sementara skor Accessibility yang mencapai 94-96% menunjukkan komitmen terhadap inklusivitas pengguna.

## 4.2. Saran

Dalam pembuatan website Reluv masih memiliki beberapa kekurangan dan area yang dapat dikembangkan lebih lanjut. Berikut adalah beberapa saran untuk pengembangan di masa mendatang:

Pertama, fitur chat real-time antara pembeli dan penjual belum diimplementasikan. Penambahan fitur chat menggunakan teknologi WebSocket atau Socket.IO akan meningkatkan interaksi dan komunikasi antara pembeli dan penjual, sehingga dapat meningkatkan kepercayaan dan mempercepat proses transaksi.

Kedua, sistem notifikasi real-time masih dapat ditingkatkan dengan implementasi push notification menggunakan Firebase Cloud Messaging (FCM) atau Web Push API. Hal ini akan membantu pengguna untuk mendapatkan update terkini tentang status pesanan, pembayaran, dan pengiriman secara langsung tanpa harus membuka aplikasi.

Ketiga, fitur rekomendasi produk berbasis machine learning belum diimplementasikan. Penambahan algoritma rekomendasi seperti collaborative filtering atau content-based filtering akan meningkatkan personalisasi pengalaman pengguna dan berpotensi meningkatkan penjualan.

Keempat, dashboard analytics untuk penjual masih dapat diperkaya dengan visualisasi data yang lebih komprehensif, seperti grafik penjualan per kategori produk, analisis performa produk, dan insight tentang perilaku pembeli. Implementasi library seperti Chart.js atau Recharts dengan data real-time akan sangat membantu penjual dalam mengambil keputusan bisnis.

Kelima, fitur wishlist sharing dan social commerce belum diimplementasikan. Penambahan fitur untuk membagikan wishlist atau produk favorit ke media sosial akan meningkatkan viral marketing dan memperluas jangkauan platform Reluv.

Keenam, sistem verifikasi penjual dan produk dapat ditingkatkan dengan implementasi KYC (Know Your Customer) yang lebih ketat dan verifikasi produk melalui foto atau video untuk memastikan kualitas dan keaslian produk preloved yang dijual.

Ketujuh, optimasi performa pada browser Firefox masih perlu ditingkatkan mengingat skor Performance yang hanya mencapai 48% dibandingkan dengan Chrome (82%) dan Edge (84%). Hal ini dapat dilakukan dengan optimasi bundle size, lazy loading, dan code splitting yang lebih baik.

Kedelapan, implementasi Progressive Web App (PWA) akan meningkatkan pengalaman pengguna mobile dengan kemampuan offline-first, install to home screen, dan performa yang lebih cepat. Hal ini sangat penting mengingat mayoritas pengguna e-commerce mengakses platform melalui perangkat mobile.

---

# DAFTAR PUSTAKA

## Jurnal dan Paper Akademik:

Ariani Susanto, Rosa., & Shalahuddin, M. (2018). _Rekayasa Perangkat Lunak Terstruktur dan Berorientasi Objek_. INFORMATIKA.

Febiharsa, D., Sudana, I. M., & Hudallah, N. (2019). Uji Fungsionalitas (Blackbox Testing) Sistem Informasi Lembaga Sertifikasi Profesi (SILSP) Batik Dengan Appperfect Web Test dan Uji Pengguna. _Joined Journal Jurnal Of Information Edukation_, 1(2), 117-126. https://doi.org/10.31331/joined.v1i2.752

Handayani, V. R., & Pratama, N. P. (2019). Sistem Informasi Penjualan Gula Merah Serbuk Berbasis Web Pada Home Industri Gula Merah Serbuk Dalban Permana Purbalingga. _Vembria Rose Handayani_, 7(2), 28–35.

Julianto, S., & Setiawan, S. (2019). Perancangan Sistem Informasi Pemesanan Tiket Bus Pada Po. Handoyo Berbasis Online. _Simatupang, Julianto Sianturi, Setiawan_, 3(2), 11–25. https://journal.amikmahaputra.ac.id/index.php/JIT/article/view/56/48

Kaur, M., & Singh, K. (2024). A Comparative Analysis of Next.js, SvelteKit, and Astro for E-commerce Web Development. _DiVA Portal - Digitala Vetenskapliga Arkivet_. https://www.diva-portal.org/smash/record.jsf?pid=diva2%3A1865432

Novendri, M. S., Saputra, A., & Firman, C. E. (2019). Aplikasi Inventaris Barang Pada MTS Nurul Islam Dumai Menggunakan PHP Dan MySQL. _Lentera Dumai_, 10(2), 46–57.

Ramadhan, R. F., & Mukhaiyar, R. (2020). Penggunaan Database Mysql dengan Interface PhpMyAdmin sebagai Pengontrolan Smarthome Berbasis Raspberry Pi. _JTEIN: Jurnal Teknik Elektro Indonesia_, 1(2).

Rizki, M. A. K., & Ferico, A. (2021). Rancang Bangun Aplikasi E-Cuti Pegawai Berbasis Website (Studi Kasus: Pengadilan Tata Usaha Negara). _Jurnal Teknologi Dan Sistem Informasi (JTSI)_, 2(3), 1–13. http://jim.teknokrat.ac.id/index.php/JTSI

Rochman, A., Hanafri, M. I., & Wandira, A. (2020). Implementasi Website Profil SMK Kartini Sebagai Media Promosi dan Informasi Berbasis Open Source. _Academic Journal of Computer Science Research_, 2(1), 46–51. https://doi.org/10.38101/ajcsr.v2i1.272

Rohimah, A. (2019). Era Digitalisasi Media Pemasaran Online dalam Gugurnya Pasar Ritel Konvensional. _KANAL: Jurnal Ilmu Komunikasi_, 6(2), 91. https://doi.org/10.21070/kanal.v6i2.1931

Sagita, R. A., & Sugiharto, H. (2016). Penerapan Metode Waterfall Pada Sistem Informasi Penjualan Furniture Berbasis Web. _Indonesian Journal of Network and Security_, 5(4), 49–55.

Suryawan, I. P. A. (2023). Development of Backend Server Based on REST API Architecture in E-Wallet Transfer System. _Universitas Islam Indonesia_. https://dspace.uii.ac.id/handle/123456789/44891

Szymański, M., & Sapiński, T. (2024). Performance Evaluation of REST and GraphQL API Approaches in Data Retrieval Scenarios Using NestJS. _Politechnika Lubelska_. https://bc.pollub.pl/Content/6882/PDF/szymanski_marcin_praca_inz.pdf

Utami, A. A. (2018). Analisis model bisnis pada bisnis. 5(2), 2538–2546.

Wahyudi, K., Dewi, L. P., & Wibowo, A. (2017). Sistem Informasi Manajemen Pekerjaan Panel Listrik Berbasis Web di PT. Yoel Tricitra. _Jurnal Infra_, 5(1), 73–77.

W3Techs. (2024). Usage statistics of JavaScript libraries for websites. https://w3techs.com/technologies/overview/javascript_library

## Dokumentasi Resmi dan Referensi Teknis:

Biteship. (2024). _Biteship API Documentation - Shipping and Logistics API_. https://biteship.com/docs

Cloudinary. (2024). _Cloudinary Documentation - Image and Video Management_. https://cloudinary.com/documentation

GitHub. (2024). _GitHub Documentation_. https://docs.github.com/

Google Developers. (2024). _Google OAuth 2.0 Documentation_. https://developers.google.com/identity/protocols/oauth2

Leaflet. (2024). _Leaflet - An open-source JavaScript library for mobile-friendly interactive maps_. https://leafletjs.com/

Meta Platforms, Inc. (2024). _React - A JavaScript library for building user interfaces_. https://react.dev/

Midtrans. (2024). _Midtrans Payment Gateway Documentation_. https://docs.midtrans.com/

Mozilla Developer Network. (2024). _JavaScript - MDN Web Docs_. https://developer.mozilla.org/en-US/docs/Web/JavaScript

Neon. (2024). _Neon - Serverless Postgres_. https://neon.tech/

NestJS. (2024). _NestJS - A progressive Node.js framework_. https://nestjs.com/

Next.js. (2024). _Next.js by Vercel - The React Framework for the Web_. https://nextjs.org/

Node.js. (2024). _Node.js Documentation_. https://nodejs.org/docs/

PostgreSQL. (2024). _PostgreSQL Documentation_. https://www.postgresql.org/docs/

Prisma. (2024). _Prisma - Next-generation ORM for Node.js and TypeScript_. https://www.prisma.io/

Prisma. (2024). _Prisma with PostgreSQL - Getting Started Guide_. https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql

Shadcn UI. (2024). _Shadcn UI - Beautifully designed components built with Radix UI and Tailwind CSS_. https://ui.shadcn.com/

Tailwind Labs. (2024). _Tailwind CSS - Rapidly build modern websites without ever leaving your HTML_. https://tailwindcss.com/

TypeScript. (2024). _TypeScript - JavaScript with syntax for types_. https://www.typescriptlang.org/

Vercel. (2024). _Vercel - Develop. Preview. Ship. For the best frontend teams_. https://vercel.com/

Zustand. (2024). _Zustand - A small, fast and scalable bearbones state-management solution_. https://zustand-demo.pmnd.rs/

## Buku dan Referensi Tambahan:

FATHANSYAH. (2018). _Basis Data Edisi Revisi Ketiga_ (Cet 1). Bandung: Informatika Bandung.

Riri Fitri Sari, A. U. (2021). _Rekayasa Perangkat Lunak Berorientasi Objek Menggunakan PHP_. Andi.

Saputra, A. (2019). _Buku Sakti HTML, CSS, Dan JavaScript: Pemrograman Web Itu Gampang_. Yogyakarta: Star Up Yogyakarta. http://perpus.smktelkomjkt.com/index.php?p=show_detail&id=162&keywords=

Vivian Siahaan, R. H. S. (2020). _Buku Pintar JavaScript_. Balige. https://books.google.co.id/books?id=qovWDwAAQBAJ
