# Implementasi Sistem

## 9.1 Pendahuluan

Implementasi sistem merupakan tahap realisasi dari perancangan yang telah dibuat sebelumnya. Pada tahap ini, semua komponen sistem yang telah dirancang diimplementasikan menjadi kode program yang dapat dijalankan. Implementasi platform Reluv App dilakukan dengan menggunakan teknologi modern dan best practices dalam pengembangan software.

## 9.2 Lingkungan Pengembangan

### 9.2.1 Development Environment Setup

**Tools yang Digunakan:**

1. **Node.js 18+**

   - Runtime environment untuk JavaScript/TypeScript
   - Package manager: npm atau yarn
   - Version management: nvm (Node Version Manager)

2. **PostgreSQL 14+**

   - Database management system
   - GUI Tools: pgAdmin, DBeaver, atau Prisma Studio

3. **Code Editor**

   - Visual Studio Code dengan extensions:
     - ESLint
     - Prettier
     - Prisma
     - TypeScript
     - Tailwind CSS IntelliSense

4. **Version Control**
   - Git untuk version control
   - GitHub/GitLab untuk repository hosting

### 9.2.2 Konfigurasi Environment Variables

**Backend (.env):**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/reluv_db"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Midtrans
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_IS_PRODUCTION=false

# Biteship
BITESHIP_API_KEY="your-api-key"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"

# Application
PORT=8000
NODE_ENV=development
FRONTEND_URL="https://fe-reluv-app.vercel.app"
# FRONTEND_URL="http://localhost:3099"
```

**Frontend (.env.local):**

```env
NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="your-client-key"
```

## 9.3 Implementasi Backend

### 9.3.1 Struktur Modul Backend

Backend menggunakan arsitektur modular dengan NestJS, di mana setiap fitur diorganisir dalam modul terpisah:

**Auth Module:**

- Implementasi JWT authentication
- Social login (Google, Facebook)
- Password hashing dengan bcrypt
- Email verification
- Password reset functionality

**Products Module:**

- CRUD operations untuk produk
- Image upload ke Cloudinary
- Variant management
- Product filtering dan search
- Category association

**Categories Module:**

- Hierarchical category structure
- Category CRUD operations
- Category tree navigation

**Cart Module:**

- Add/remove items
- Update quantities
- Cart persistence
- Cart validation

**Orders Module:**

- Order creation
- Order status management
- Order history
- Order tracking

**Payments Module:**

- Midtrans integration
- Payment verification
- Payment status tracking
- Refund processing

**Shipments Module:**

- Biteship integration
- Shipping rate calculation
- Tracking number management
- Delivery status updates

**Reviews Module:**

- Product reviews
- Rating system
- Review moderation
- Verified purchase badge

**Vouchers Module:**

- Voucher creation dan management
- Voucher validation
- Voucher usage tracking
- Discount calculation

**Store Module:**

- Store creation dan management
- Store profile
- Store analytics
- Store verification

### 9.3.2 Database Implementation

**Prisma Schema:**

Database schema diimplementasikan menggunakan Prisma ORM dengan model-model berikut:

- User & UserProfile
- Store & StoreProfile
- Product & ProductVariant
- Category (hierarchical)
- Cart & CartItem
- Order & OrderItem
- Review
- Voucher & VoucherUsage
- Location
- Notification
- Wishlist
- Badge
- Discount
- Promotion

**Migrations:**

Database migrations dilakukan menggunakan Prisma Migrate:

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migration
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

**Seeding:**

Data awal diisi menggunakan Prisma seed:

```bash
npx prisma db seed
```

### 9.3.3 API Implementation

**RESTful API Endpoints:**

Semua endpoint mengikuti konvensi RESTful dengan struktur:

```
GET    /api/v1/resource          # List resources
GET    /api/v1/resource/:id      # Get resource by ID
POST   /api/v1/resource          # Create resource
PUT    /api/v1/resource/:id      # Update resource
DELETE /api/v1/resource/:id      # Delete resource
```

**Response Format:**

Semua responses menggunakan format konsisten dengan interceptor:

```typescript
{
  success: boolean;
  statusCode: number;
  message: string;
  data?: any;
  errors?: ValidationError[];
  timestamp: string;
  path: string;
}
```

**Error Handling:**

Error handling diimplementasikan menggunakan exception filters:

- Validation errors (400)
- Unauthorized errors (401)
- Forbidden errors (403)
- Not found errors (404)
- Internal server errors (500)

### 9.3.4 Authentication & Authorization

**JWT Implementation:**

- Access token dengan expiration 24 jam
- Refresh token mechanism
- Token stored in HTTP-only cookies
- Token verification middleware

**Role-Based Access Control:**

- USER: Basic user permissions
- SELLER: User + seller permissions
- ADMIN: Full system access

**Guards Implementation:**

- JwtAuthGuard: Verifikasi JWT token
- RolesGuard: Verifikasi user role
- Custom decorators untuk role checking

### 9.3.5 Third-Party Integrations

**Midtrans Payment Gateway:**

```typescript
// Payment creation
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const transaction = await snap.createTransaction({
  transaction_details: {
    order_id: orderId,
    gross_amount: totalAmount,
  },
  // ... other parameters
});
```

**Biteship Shipping:**

```typescript
// Shipping rate calculation
const response = await axios.post(
  "https://api.biteship.com/v1/rates/couriers",
  {
    origin_latitude: originLat,
    origin_longitude: originLng,
    destination_latitude: destLat,
    destination_longitude: destLng,
    items: items,
  },
  {
    headers: {
      authorization: process.env.BITESHIP_API_KEY,
    },
  }
);
```

**Cloudinary Image Upload:**

```typescript
// Image upload
const result = await cloudinary.uploader.upload(file.path, {
  folder: "reluv/products",
  transformation: [
    { width: 800, height: 800, crop: "limit" },
    { quality: "auto" },
  ],
});
```

## 9.4 Implementasi Frontend

### 9.4.1 Struktur Komponen Frontend

Frontend menggunakan Next.js 16 dengan App Router dan component-based architecture:

**Pages (App Router):**

- `/` - Home page
- `/products` - Product listing
- `/products/[id]` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/auth/login` - Login page
- `/auth/register` - Register page
- `/profile` - User profile
- `/sell` - Sell product (Seller)
- `/dashboard` - Seller dashboard
- `/admin` - Admin panel

**Components:**

Mengikuti Atomic Design Pattern:

- **Atoms**: Button, Input, Label, Icon, Spinner
- **Molecules**: FormField, ProductCard, CartItem, SearchBar
- **Organisms**: Navbar, Footer, ProductList, CartSummary, CheckoutForm
- **Templates**: AuthTemplate, DashboardTemplate, ProductDetailTemplate

### 9.4.2 State Management

**Zustand Stores:**

1. **Auth Store:**

   - User state
   - Authentication status
   - Login/logout functions
   - Token management

2. **Cart Store:**

   - Cart items
   - Cart operations (add, remove, update)
   - Cart persistence

3. **Wishlist Store:**

   - Wishlist items
   - Wishlist operations

4. **UI Store:**
   - Modal states
   - Loading states
   - Notification states

### 9.4.3 API Integration

**Axios Configuration:**

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**API Services:**

Setiap feature memiliki service file untuk API calls:

- `auth.service.ts` - Authentication API
- `products.service.ts` - Products API
- `cart.service.ts` - Cart API
- `orders.service.ts` - Orders API
- `reviews.service.ts` - Reviews API

### 9.4.4 Form Handling

**React Hook Form + Zod:**

Semua form menggunakan React Hook Form dengan Zod validation:

```typescript
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### 9.4.5 UI/UX Implementation

**Tailwind CSS:**

Styling menggunakan Tailwind CSS dengan custom configuration:

- Custom color palette
- Responsive breakpoints
- Custom components
- Dark mode support (future)

**Responsive Design:**

- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Flexible grid system
- Responsive images dengan Next.js Image component

**Accessibility:**

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

## 9.5 Implementasi Fitur-Fitur Utama

### 9.5.1 User Authentication

**Registrasi:**

1. User mengisi form registrasi
2. Validasi input dengan Zod
3. Password di-hash dengan bcrypt
4. Email verification token dibuat
5. Email verifikasi dikirim
6. User dapat login setelah verifikasi

**Login:**

1. User memasukkan email dan password
2. Validasi credentials
3. JWT token dibuat
4. Token disimpan di cookie
5. User state diupdate

**Social Login:**

1. User klik social login button
2. Redirect ke OAuth provider
3. Callback dengan authorization code
4. Exchange code untuk user info
5. Create atau update user
6. Generate JWT token

### 9.5.2 Product Management

**Product Listing:**

1. Penjual mengisi form listing
2. Upload multiple images ke Cloudinary
3. Pilih kategori
4. Set kondisi produk
5. Tambahkan varian jika ada
6. Submit produk
7. Produk muncul di platform

**Product Browsing:**

1. User browse produk dengan filter
2. Search produk dengan keyword
3. Filter berdasarkan kategori, harga, kondisi
4. Sort berdasarkan relevansi, harga, tanggal
5. Pagination untuk performa

### 9.5.3 Shopping Cart & Checkout

**Add to Cart:**

1. User pilih produk dan varian
2. Klik "Add to Cart"
3. Item ditambahkan ke cart store
4. Cart persistence di localStorage
5. Cart count diupdate di navbar

**Checkout Process:**

1. User review cart items
2. Pilih alamat pengiriman
3. Sistem hitung shipping rate dari Biteship
4. User pilih courier
5. Apply voucher jika ada
6. Review order summary
7. Pilih metode pembayaran
8. Redirect ke Midtrans
9. User melakukan pembayaran
10. Webhook update order status

### 9.5.4 Payment Processing

**Payment Flow:**

1. Order dibuat dengan status PENDING
2. Payment request dibuat ke Midtrans
3. Midtrans return payment token
4. Frontend redirect ke payment page
5. User complete payment
6. Midtrans send webhook
7. Backend verify payment
8. Order status updated to PAID
9. Notification sent to user dan seller

### 9.5.5 Shipping Management

**Shipping Rate Calculation:**

1. User pilih alamat pengiriman
2. Backend get coordinates dari geocoding
3. Request shipping rates dari Biteship
4. Biteship return rates dari berbagai courier
5. Frontend display options
6. User pilih courier
7. Shipping cost ditambahkan ke order

**Order Tracking:**

1. Seller update order status to SHIPPED
2. Seller input tracking number
3. System create shipment di Biteship
4. Biteship provide tracking updates
5. User dapat track order di platform
6. Notifications sent untuk setiap update

### 9.5.6 Review System

**Product Review:**

1. User yang telah membeli dapat review
2. User beri rating (1-5 stars)
3. User tulis review text
4. User dapat upload review images
5. Review ditampilkan dengan verified badge
6. Rating average diupdate

## 9.6 Optimasi dan Performance

### 9.6.1 Database Optimization

- Indexing pada kolom yang sering di-query
- Query optimization dengan Prisma select
- Connection pooling
- Database caching untuk data statis

### 9.6.2 API Optimization

- Response caching untuk data yang jarang berubah
- Pagination untuk list endpoints
- Lazy loading untuk images
- Compression (gzip) untuk responses

### 9.6.3 Frontend Optimization

- Code splitting dengan Next.js
- Image optimization dengan Next.js Image
- Lazy loading untuk components
- Service worker untuk caching (PWA)

## 9.7 Security Implementation

### 9.7.1 Authentication Security

- Password hashing dengan bcrypt (salt rounds: 10)
- JWT dengan expiration time
- Rate limiting untuk login attempts
- Email verification required

### 9.7.2 Data Security

- HTTPS untuk semua komunikasi
- Input validation dan sanitization
- SQL injection prevention (Prisma ORM)
- XSS prevention (React auto-escape)
- CSRF protection (SameSite cookies)

### 9.7.3 API Security

- API rate limiting
- CORS configuration
- Request validation dengan DTOs
- Error handling yang tidak expose sensitive info

## 9.8 Testing Implementation

### 9.8.1 Unit Testing

- Testing individual functions dan methods
- Coverage target: >80%
- Tools: Jest untuk backend

### 9.8.2 Integration Testing

- Testing API endpoints
- Testing database interactions
- Testing third-party integrations (mocked)

### 9.8.3 E2E Testing

- Testing complete user flows
- Tools: Playwright atau Cypress (future)

## 9.9 Deployment

### 9.9.1 Frontend Deployment

- Deploy ke Vercel (optimized untuk Next.js)
- CDN untuk static assets
- Environment variables configuration
- Automatic deployments dari Git

### 9.9.2 Backend Deployment

- Deploy ke cloud platform (Railway, Render, atau AWS)
- Environment variables configuration
- Database hosting terpisah (managed PostgreSQL)
- Health check endpoints

### 9.9.3 CI/CD Pipeline

**Stages:**

1. **Build**: Compile TypeScript, build Next.js
2. **Test**: Run unit tests dan integration tests
3. **Deploy to Staging**: Deploy ke staging environment
4. **E2E Test**: Run end-to-end tests
5. **Deploy to Production**: Deploy ke production setelah approval

## 9.10 Monitoring dan Logging

### 9.10.1 Error Tracking

- Sentry untuk error tracking
- Error notifications
- Error analytics

### 9.10.2 Performance Monitoring

- Application performance monitoring
- Response time tracking
- Database query performance
- API endpoint monitoring

### 9.10.3 User Analytics

- User behavior tracking
- Conversion tracking
- Feature usage analytics

## 9.11 Kesimpulan Implementasi

Implementasi platform Reluv App telah dilakukan dengan menggunakan teknologi modern dan best practices. Semua fitur utama telah diimplementasikan dan terintegrasi dengan baik. Sistem telah siap untuk deployment dan testing lebih lanjut. Implementasi ini menjadi dasar untuk pengujian sistem dan evaluasi terhadap kebutuhan yang telah ditetapkan sebelumnya.
