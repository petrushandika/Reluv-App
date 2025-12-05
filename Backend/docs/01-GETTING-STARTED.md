# Getting Started

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** (v18 atau lebih tinggi)
- **PostgreSQL** (v14 atau lebih tinggi)
- **npm** atau **yarn**
- **Git**

## 🚀 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd Reluv-App/Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Buat file `.env` di root directory Backend:

```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi yang sesuai (lihat [Configuration](#configuration)).

### 4. Database Setup

#### Create Database

```sql
CREATE DATABASE reluv_db;
```

#### Run Migrations

```bash
npx prisma migrate dev
```

#### Seed Database (Optional)

```bash
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run start:dev
```

Server akan berjalan di `http://localhost:8000/api/v1`

## ⚙️ Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/reluv_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=8000
NODE_ENV=development
FRONTEND_URL=https://fe-reluv-app.vercel.app
# FRONTEND_URL=http://localhost:3099
```

### Optional Environment Variables

```env
# Cloudinary (untuk image upload)
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

# Midtrans (Payment)
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION=false

# Biteship (Shipping)
BITESHIP_API_KEY="your-biteship-api-key"
```

## 📦 Available Scripts

### Development

```bash
# Start development server dengan hot reload
npm run start:dev

# Start dengan debug mode
npm run start:debug

# Start production server
npm run start:prod
```

### Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database (HATI-HATI: akan menghapus semua data)
npx prisma migrate reset

# Open Prisma Studio (GUI untuk database)
npx prisma studio

# Seed database
npx prisma db seed
```

### Build

```bash
# Build untuk production
npm run build

# Format code
npm run format
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests dengan watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## ✅ Verification

Setelah setup, verifikasi bahwa semuanya berjalan dengan baik:

1. **Check server running**

   ```bash
   curl http://localhost:8000/api/v1
   ```

   Response:

   ```json
   {
     "success": true,
     "statusCode": 200,
     "message": "Data retrieved successfully",
     "data": {
       "message": "Welcome to Reluv API",
       "version": "1.0.0",
       "status": "running"
     }
   }
   ```

2. **Check database connection**

   ```bash
   npx prisma studio
   ```

   Prisma Studio akan membuka browser dengan GUI database.

3. **Test API endpoint**
   ```bash
   curl http://localhost:8000/api/v1/categories
   ```

## 🔧 Troubleshooting

### Port Already in Use

Jika port 8000 sudah digunakan:

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

Atau ubah PORT di `.env` file.

### Database Connection Error

1. Pastikan PostgreSQL running
2. Check DATABASE_URL di `.env`
3. Pastikan database sudah dibuat
4. Check firewall settings

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Migration Errors

```bash
# Reset migrations (HATI-HATI)
npx prisma migrate reset

# Atau create migration baru
npx prisma migrate dev --name fix_migration
```

## 📚 Next Steps

- Baca [Architecture Documentation](./02-ARCHITECTURE.md) untuk memahami struktur aplikasi
- Lihat [API Reference](./03-API-REFERENCE.md) untuk dokumentasi endpoints
- Pelajari [Authentication](./04-AUTHENTICATION.md) untuk setup auth
- Baca [Response Format](./06-RESPONSE-FORMAT.md) untuk memahami format response

## 🆘 Need Help?

- Check [Troubleshooting Guide](./10-TROUBLESHOOTING.md)
- Lihat [Main README](../README.md)
- Buat issue di repository
