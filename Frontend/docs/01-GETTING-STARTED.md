# Getting Started

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** (v18 atau lebih tinggi)
- **npm** atau **yarn**
- **Git**
- **Backend API** running (lihat Backend documentation)

## 🚀 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd Reluv-App/Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Buat file `.env.local` di root directory Frontend:

```bash
cp .env.example .env.local
```

Edit file `.env.local` dengan konfigurasi yang sesuai (lihat [Configuration](#configuration)).

### 4. Start Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `https://fe-reluv-app.vercel.app`
# Aplikasi akan berjalan di `http://localhost:3099`

## ⚙️ Configuration

### Required Environment Variables

Buat file `.env.local`:

```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Optional Environment Variables

```env
# NextAuth (jika digunakan)
NEXTAUTH_URL=https://fe-reluv-app.vercel.app
# NEXTAUTH_URL=http://localhost:3099
NEXTAUTH_SECRET=your-secret-key

# Cloudinary (jika diperlukan di frontend)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## 📦 Available Scripts

### Development

```bash
# Start development server
npm run dev

# Start dengan Turbopack (faster)
npm run dev --turbo
```

### Production

```bash
# Build untuk production
npm run build

# Start production server
npm run start
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code (jika ada)
npm run format
```

## ✅ Verification

Setelah setup, verifikasi bahwa semuanya berjalan dengan baik:

1. **Check server running**

   - Buka browser: `https://fe-reluv-app.vercel.app`
   # - Buka browser: `http://localhost:3099`
   - Halaman home harus muncul

2. **Check API connection**

   - Buka browser console
   - Check network requests ke backend API
   - Verify tidak ada CORS errors

3. **Test navigation**
   - Klik menu items
   - Verify routing bekerja

## 🏗 Project Structure

```
Frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/               # Authentication pages
│   │   ├── product/            # Product pages
│   │   ├── cart/               # Cart page
│   │   ├── checkout/           # Checkout page
│   │   └── ...
│   ├── features/               # Feature modules
│   │   ├── auth/               # Auth feature
│   │   ├── products/            # Products feature
│   │   ├── cart/               # Cart feature
│   │   └── ...
│   ├── shared/                 # Shared utilities
│   │   ├── components/          # Reusable components
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilities
│   │   └── store/              # Shared stores
│   └── context/                # React contexts
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── next.config.js              # Next.js config
└── tailwind.config.ts          # Tailwind config
```

## 🔧 Troubleshooting

### Port Already in Use

Jika port 3099 sudah digunakan:

```bash
# Windows
netstat -ano | findstr :3099
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3099 | xargs kill -9
```

Atau gunakan port lain:

```bash
npm run dev -- -p 3001
```

### Module Not Found

```bash
# Clear cache dan reinstall
rm -rf node_modules .next
npm install
```

### API Connection Error

1. Verify backend API is running
2. Check `NEXT_PUBLIC_API_URL` di `.env.local`
3. Check CORS settings di backend
4. Verify network connectivity

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📚 Next Steps

- Baca [Architecture Documentation](./02-ARCHITECTURE.md) untuk memahami struktur aplikasi
- Lihat [Components Documentation](./03-COMPONENTS.md) untuk reusable components
- Pelajari [State Management](./04-STATE-MANAGEMENT.md) untuk Zustand stores
- Baca [API Integration](./05-API-INTEGRATION.md) untuk data fetching

## 🆘 Need Help?

- Check [Troubleshooting Guide](./10-TROUBLESHOOTING.md)
- Lihat [Main README](../README.md)
- Buat issue di repository
