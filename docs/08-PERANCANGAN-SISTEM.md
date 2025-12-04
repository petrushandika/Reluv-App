# Perancangan Sistem

## 8.1 Pendahuluan

Perancangan sistem merupakan tahap penting dalam pengembangan platform Reluv App yang bertujuan untuk merancang arsitektur, komponen, dan struktur sistem secara detail sebelum implementasi. Perancangan yang baik memastikan bahwa sistem dapat memenuhi kebutuhan fungsional dan non-fungsional, serta dapat dikembangkan dan dirawat dengan mudah.

## 8.2 Arsitektur Sistem

### 8.2.1 Arsitektur Umum

Platform Reluv App menggunakan arsitektur **Client-Server** dengan pemisahan yang jelas antara frontend dan backend:

```
┌─────────────────┐
│   Frontend      │
│  (Next.js 16)   │
│   React 19      │
└────────┬────────┘
         │
         │ HTTP/REST API
         │
┌────────▼────────┐
│    Backend      │
│  (NestJS 11)    │
│   TypeScript    │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│   Database      │
│  (PostgreSQL)   │
└─────────────────┘
```

### 8.2.2 Layered Architecture

Backend menggunakan **Layered Architecture** dengan pemisahan concerns:

1. **Presentation Layer (Controllers)**

   - Menangani HTTP requests dan responses
   - Validasi input
   - Authentication dan authorization

2. **Business Logic Layer (Services)**

   - Menangani logika bisnis
   - Validasi business rules
   - Koordinasi antara berbagai services

3. **Data Access Layer (Repositories/Prisma)**

   - Interaksi dengan database
   - Query optimization
   - Data mapping

4. **Database Layer**
   - PostgreSQL database
   - Data storage
   - Data integrity

### 8.2.3 Frontend Architecture

Frontend menggunakan **Component-Based Architecture** dengan Next.js App Router:

1. **Pages (App Router)**

   - Route handlers
   - Server components
   - Client components

2. **Features**

   - Feature-based organization
   - Isolated modules
   - Reusable components

3. **Shared Components**
   - Common UI components
   - Utilities
   - Types

## 8.3 Perancangan Database

### 8.3.1 Entity Relationship Diagram (ERD)

Database terdiri dari beberapa entitas utama:

**Core Entities:**

- User (Pengguna)
- Product (Produk)
- Category (Kategori)
- Order (Pesanan)
- OrderItem (Item Pesanan)
- Cart (Keranjang)
- CartItem (Item Keranjang)
- Review (Review)
- Store (Toko)
- Address (Alamat)
- Voucher (Voucher)
- Notification (Notifikasi)

**Relationships:**

- User 1:N Store (Satu user dapat memiliki satu toko)
- User 1:N Order (Satu user dapat memiliki banyak order)
- User 1:N Review (Satu user dapat membuat banyak review)
- Product N:1 Category (Banyak produk dalam satu kategori)
- Product N:1 Store (Banyak produk dari satu toko)
- Order 1:N OrderItem (Satu order memiliki banyak item)
- Product 1:N Review (Satu produk dapat memiliki banyak review)

### 8.3.2 Database Schema Design

**User Table:**

```sql
- id: UUID (Primary Key)
- email: String (Unique)
- password: String (Hashed)
- name: String
- phone: String (Optional)
- avatar: String (URL)
- role: Enum (USER, SELLER, ADMIN)
- emailVerified: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

**Product Table:**

```sql
- id: UUID (Primary Key)
- name: String
- description: Text
- price: Decimal
- condition: Enum (NEW, LIKE_NEW, GOOD, FAIR, POOR)
- categoryId: UUID (Foreign Key)
- storeId: UUID (Foreign Key)
- images: String[] (Array of URLs)
- status: Enum (ACTIVE, INACTIVE, SOLD)
- createdAt: DateTime
- updatedAt: DateTime
```

**Order Table:**

```sql
- id: UUID (Primary Key)
- userId: UUID (Foreign Key)
- total: Decimal
- shippingCost: Decimal
- discount: Decimal
- status: Enum (PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- paymentMethod: String
- paymentStatus: Enum (PENDING, PAID, FAILED, REFUNDED)
- shippingAddress: JSON
- trackingNumber: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

### 8.3.3 Indexing Strategy

Indexing diterapkan pada:

- Foreign keys untuk mempercepat joins
- Email untuk mempercepat login
- Product name dan description untuk search
- Order status dan userId untuk filtering
- CreatedAt untuk sorting

## 8.4 Perancangan API

### 8.4.1 RESTful API Design

API mengikuti prinsip RESTful dengan struktur URL yang konsisten:

**Base URL:** `/api/v1`

**Endpoints:**

**Authentication:**

- `POST /auth/register` - Registrasi pengguna
- `POST /auth/login` - Login pengguna
- `POST /auth/logout` - Logout pengguna
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Request reset password
- `POST /auth/reset-password` - Reset password

**Products:**

- `GET /products` - Get all products (with pagination, filter, search)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Seller only)
- `PUT /products/:id` - Update product (Seller only)
- `DELETE /products/:id` - Delete product (Seller only)

**Categories:**

- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category (Admin only)
- `PUT /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Delete category (Admin only)

**Cart:**

- `GET /cart` - Get user cart
- `POST /cart` - Add item to cart
- `PUT /cart/:itemId` - Update cart item
- `DELETE /cart/:itemId` - Remove cart item
- `DELETE /cart` - Clear cart

**Orders:**

- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create order
- `PUT /orders/:id` - Update order status

**Reviews:**

- `GET /reviews/product/:productId` - Get reviews for product
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### 8.4.2 API Response Format

Semua API responses menggunakan format konsisten:

**Success Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products"
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/auth/register"
}
```

### 8.4.3 Authentication dan Authorization

**Authentication:**

- Menggunakan JWT (JSON Web Token)
- Token disimpan di HTTP-only cookie atau localStorage
- Token expiration: 24 hours
- Refresh token untuk memperpanjang session

**Authorization:**

- Role-based access control (RBAC)
- Roles: USER, SELLER, ADMIN
- Middleware untuk memverifikasi role
- Guards untuk melindungi routes

## 8.5 Perancangan Frontend

### 8.5.1 Component Architecture

Frontend menggunakan **Atomic Design Pattern**:

**Atoms:**

- Button
- Input
- Label
- Icon
- Spinner

**Molecules:**

- FormField (Input + Label + Error)
- ProductCard
- CartItem
- SearchBar

**Organisms:**

- Navbar
- Footer
- ProductList
- CartSummary
- CheckoutForm

**Templates:**

- AuthTemplate
- DashboardTemplate
- ProductDetailTemplate

**Pages:**

- HomePage
- ProductListPage
- ProductDetailPage
- CartPage
- CheckoutPage

### 8.5.2 State Management

Menggunakan **Zustand** untuk state management:

**Auth Store:**

```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}
```

**Cart Store:**

```typescript
interface CartStore {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product, variant?: Variant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}
```

### 8.5.3 Routing

Menggunakan Next.js App Router:

**Routes:**

- `/` - Home page
- `/products` - Product listing
- `/products/[id]` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/auth/login` - Login
- `/auth/register` - Register
- `/profile` - User profile
- `/sell` - Sell product (Seller only)
- `/dashboard` - Seller dashboard (Seller only)
- `/admin` - Admin panel (Admin only)

### 8.5.4 UI/UX Design

**Design Principles:**

- **Simplicity**: Desain yang sederhana dan tidak membingungkan
- **Consistency**: Konsistensi dalam warna, typography, spacing
- **Accessibility**: Mengikuti WCAG 2.1 guidelines
- **Responsiveness**: Responsif untuk semua device sizes

**Color Palette:**

- Primary: Brand color untuk CTA buttons
- Secondary: Supporting colors
- Neutral: Grays untuk text dan backgrounds
- Success: Green untuk success states
- Error: Red untuk error states
- Warning: Yellow untuk warning states

**Typography:**

- Heading fonts: Bold, untuk headings
- Body fonts: Regular, untuk body text
- Font sizes: Responsive scale

## 8.6 Perancangan Integrasi Third-Party

### 8.6.1 Payment Gateway Integration (Midtrans)

**Flow:**

1. User melakukan checkout
2. Backend membuat payment request ke Midtrans
3. Midtrans mengembalikan payment token
4. Frontend redirect ke Midtrans payment page
5. User melakukan pembayaran
6. Midtrans mengirim webhook ke backend
7. Backend memverifikasi payment
8. Backend mengupdate order status

**Security:**

- Server key disimpan di environment variables
- Webhook verification menggunakan signature
- Payment status selalu diverifikasi dari server

### 8.6.2 Shipping Integration (Biteship)

**Flow:**

1. User memilih alamat pengiriman
2. Backend mengirim request ke Biteship dengan origin dan destination
3. Biteship mengembalikan shipping rates dari berbagai courier
4. Frontend menampilkan pilihan courier dan rates
5. User memilih courier
6. Setelah order dibuat, backend membuat shipment di Biteship
7. Biteship mengembalikan tracking number
8. Backend menyimpan tracking number dan mengirim notifikasi

### 8.6.3 Image Upload Integration (Cloudinary)

**Flow:**

1. User upload image di frontend
2. Frontend mengirim image ke backend
3. Backend mengupload image ke Cloudinary
4. Cloudinary mengembalikan URL
5. Backend menyimpan URL di database
6. Frontend menampilkan image dari Cloudinary URL

**Optimization:**

- Image compression sebelum upload
- Multiple image sizes (thumbnail, medium, large)
- Lazy loading untuk images

## 8.7 Perancangan Keamanan

### 8.7.1 Authentication Security

- Password hashing menggunakan bcrypt dengan salt rounds 10
- JWT dengan expiration time
- Refresh token mechanism
- Rate limiting untuk login attempts
- Email verification untuk registrasi

### 8.7.2 Data Security

- HTTPS untuk semua komunikasi
- Input validation dan sanitization
- SQL injection prevention (menggunakan Prisma ORM)
- XSS prevention (React auto-escapes)
- CSRF protection (SameSite cookies)

### 8.7.3 API Security

- API rate limiting
- CORS configuration
- Request validation menggunakan DTOs
- Error handling yang tidak expose sensitive information

## 8.8 Perancangan Performa

### 8.8.1 Database Optimization

- Indexing pada kolom yang sering di-query
- Query optimization dengan Prisma
- Connection pooling
- Database caching untuk data yang jarang berubah

### 8.8.2 API Optimization

- Response caching untuk data yang tidak sering berubah
- Pagination untuk list endpoints
- Lazy loading untuk images
- Compression untuk responses (gzip)

### 8.8.3 Frontend Optimization

- Code splitting dengan Next.js
- Image optimization dengan Next.js Image component
- Lazy loading untuk components
- Service worker untuk caching (PWA features)

## 8.9 Perancangan Testing

### 8.9.1 Unit Testing

- Testing individual functions dan methods
- Coverage target: >80%
- Tools: Jest untuk backend, Vitest untuk frontend

### 8.9.2 Integration Testing

- Testing API endpoints
- Testing database interactions
- Testing third-party integrations (mocked)

### 8.9.3 End-to-End Testing

- Testing complete user flows
- Tools: Playwright atau Cypress (future)

## 8.10 Perancangan Deployment

### 8.10.1 Deployment Architecture

**Frontend:**

- Deploy ke Vercel (optimized untuk Next.js)
- CDN untuk static assets
- Environment variables untuk configuration

**Backend:**

- Deploy ke cloud platform (Railway, Render, atau AWS)
- Environment variables untuk configuration
- Database hosting terpisah (managed PostgreSQL)

### 8.10.2 CI/CD Pipeline

**Stages:**

1. **Build**: Compile TypeScript, build Next.js
2. **Test**: Run unit tests dan integration tests
3. **Deploy**: Deploy ke staging environment
4. **E2E Test**: Run end-to-end tests
5. **Deploy to Production**: Deploy ke production setelah approval

### 8.10.3 Monitoring dan Logging

- Error tracking dengan Sentry
- Application performance monitoring
- Server monitoring
- Database monitoring
- User analytics

## 8.11 Kesimpulan Perancangan

Perancangan sistem telah mencakup semua aspek penting dari platform Reluv App, mulai dari arsitektur umum, perancangan database, API design, frontend architecture, integrasi third-party, keamanan, performa, testing, hingga deployment. Perancangan ini menjadi blueprint untuk implementasi sistem dan memastikan bahwa sistem dapat dikembangkan dengan baik, aman, dan scalable.
