# Reluv-App Project Blueprint

## Project Overview

**Reluv-App** adalah platform e-commerce marketplace yang berfokus pada penjualan produk preloved (bekas) dan baru. Platform ini memungkinkan pengguna untuk menjual dan membeli produk fashion dengan sistem toko online yang terintegrasi.

### Tujuan dan Use Case Utama

- **Marketplace Preloved**: Platform jual-beli produk fashion bekas berkualitas
- **Multi-vendor**: Sistem toko online untuk multiple seller
- **E-commerce Complete**: Sistem lengkap dengan cart, checkout, payment, dan shipping
- **Review System**: Sistem rating dan review produk
- **Location-based**: Integrasi dengan sistem lokasi dan shipping

## Tech Stack

### Frontend

- **Framework**: Next.js 15.3.4 (React 19.1.0)
- **Styling**: TailwindCSS 4.1.10
- **UI Components**: Radix UI, Lucide React
- **State Management**: Zustand 5.0.6
- **Form Handling**: React Hook Form 7.58.1
- **Animation**: Framer Motion 12.19.1
- **Maps**: Leaflet, React Leaflet
- **Authentication**: NextAuth 4.24.11
- **HTTP Client**: Axios 1.10.0
- **Validation**: Zod 3.25.67
- **Carousel**: Embla Carousel
- **Notifications**: Sonner

### Backend

- **Framework**: NestJS 11.1.3
- **Runtime**: Node.js dengan TypeScript 5.8.3
- **Database ORM**: Prisma 6.11.0
- **Authentication**: JWT, Passport (Local, Google, Facebook)
- **File Upload**: Cloudinary 2.7.0
- **Email**: Nodemailer 7.0.5, Resend 4.6.0
- **Payment**: Midtrans Client 1.4.3
- **Validation**: Class Validator, Zod
- **Password Hashing**: bcrypt, bcryptjs
- **HTTP Client**: Axios 1.10.0

### Database

- **Primary**: PostgreSQL
- **ORM**: Prisma
- **Migration**: Prisma Migrate
- **Seeding**: TypeScript seed files

### Deployment

- **Frontend**: Vercel (recommended)
- **Backend**: Railway, Render, atau VPS
- **Database**: PostgreSQL (Supabase, Railway, atau cloud provider)
- **File Storage**: Cloudinary
- **Email Service**: Resend atau SMTP

### Tools & Library Penting

- **Development**: ESLint, Prettier, TypeScript
- **Testing**: Jest (Backend)
- **API Documentation**: Swagger (dapat ditambahkan)
- **Monitoring**: Dapat ditambahkan (Sentry, LogRocket)

## Folder Structure

### Frontend Structure

```
Frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Admin dashboard
│   │   ├── main/              # Main application pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── context/               # React contexts
│   ├── features/              # Feature-based modules
│   │   ├── auth/              # Authentication feature
│   │   ├── cart/              # Shopping cart feature
│   │   ├── products/          # Product management
│   │   ├── reviews/           # Review system
│   │   ├── sell/              # Selling feature
│   │   ├── user/              # User management
│   │   └── wishlist/          # Wishlist feature
│   └── shared/                # Shared components & utilities
│       ├── components/        # Reusable components
│       ├── hooks/             # Custom hooks
│       ├── lib/               # Utility libraries
│       ├── store/             # Global state
│       └── types/             # TypeScript types
├── public/                    # Static assets
├── components.json            # shadcn/ui config
├── middleware.ts              # Next.js middleware
├── next.config.ts             # Next.js configuration
└── package.json
```

### Backend Structure

```
Backend/
├── src/
│   ├── auth/                  # Authentication module
│   ├── cart/                  # Shopping cart module
│   ├── categories/            # Product categories
│   ├── cloudinary/            # File upload service
│   ├── common/                # Shared utilities
│   ├── configs/               # Configuration files
│   ├── email/                 # Email service
│   ├── facebook/              # Facebook OAuth
│   ├── geocode/               # Geocoding service
│   ├── google/                # Google OAuth
│   ├── locations/             # Location management
│   ├── maps/                  # Maps integration
│   ├── notifications/         # Notification system
│   ├── orders/                # Order management
│   ├── payments/              # Payment processing
│   ├── prisma/                # Database service
│   ├── products/              # Product management
│   ├── reviews/               # Review system
│   ├── shipments/             # Shipping management
│   ├── shipping-rates/        # Shipping rates
│   ├── store/                 # Store management
│   ├── templates/             # Email templates
│   ├── upload/                # File upload
│   ├── users/                 # User management
│   ├── utils/                 # Utility functions
│   ├── vouchers/              # Voucher system
│   ├── wishlist/              # Wishlist management
│   ├── app.module.ts          # Main app module
│   └── main.ts                # Application entry point
├── prisma/
│   ├── migrations/            # Database migrations
│   ├── data/                  # Seed data
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
├── test/                      # E2E tests
└── package.json
```

## Environment Variables (.env)

### Frontend (.env.local)

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# OAuth Providers
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Maps & Location
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Payment
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your-midtrans-client-key

# File Upload
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/reluv_app?schema=public"

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
RESEND_API_KEY=your-resend-api-key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Payment Gateway
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false

# Shipping Integration
BITESHIP_API_KEY=your-biteship-api-key
BITESHIP_BASE_URL=https://api.biteship.com/v1

# Maps & Geocoding
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# App Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Business Flow / Alur Sistem

### Alur Pengguna (Customer)

1. **Registration/Login**

   - Register dengan email atau OAuth (Google/Facebook)
   - Email verification
   - Login dan mendapat JWT token

2. **Browse & Search Products**

   - Browse kategori produk
   - Search dan filter produk
   - View detail produk dan review

3. **Shopping Process**

   - Add to cart atau wishlist
   - Manage cart items
   - Checkout process
   - Select shipping address
   - Choose payment method
   - Complete payment

4. **Order Management**
   - Track order status
   - View order history
   - Receive notifications
   - Write product reviews

### Alur Seller/Store Owner

1. **Store Setup**

   - Create store profile
   - Setup store information
   - Add store location

2. **Product Management**

   - Add new products
   - Manage product variants
   - Upload product images
   - Set pricing and stock

3. **Order Fulfillment**

   - Receive order notifications
   - Process orders
   - Arrange shipping
   - Update order status

4. **Store Analytics**
   - View sales reports
   - Manage reviews
   - Track store performance

### Alur Admin

1. **User Management**

   - Manage user accounts
   - Handle user verification
   - Moderate content

2. **Product Moderation**

   - Review new products
   - Moderate product content
   - Manage categories

3. **Order Oversight**

   - Monitor all orders
   - Handle disputes
   - Manage refunds

4. **System Management**
   - Manage vouchers
   - Configure shipping rates
   - System analytics

### Relasi Antar Entitas

- **User** → **Store** (One-to-One)
- **Store** → **Products** (One-to-Many)
- **Product** → **Variants** (One-to-Many)
- **User** → **Orders** (One-to-Many)
- **Order** → **OrderItems** (One-to-Many)
- **Order** → **Payment** (One-to-One)
- **Order** → **Shipment** (One-to-One)
- **User** → **Reviews** (One-to-Many)
- **Product** → **Reviews** (One-to-Many)

## Database Schema & Relasi

### Tabel Utama

#### Users

- **Primary Key**: id (Int)
- **Fields**: googleId, facebookId, firstName, lastName, email, password, phone, role, isActive, isVerified
- **Relations**: locations, products, reviews, orders, cart, profile, wishlist, notifications, store

#### Products

- **Primary Key**: id (Int)
- **Fields**: name, slug, description, images, isPublished, isPreloved, isActive, viewCount
- **Relations**: seller (User), category, store, variants, reviews, wishlist

#### Orders

- **Primary Key**: id (Int)
- **Fields**: orderNumber, totalAmount, itemsAmount, shippingCost, discountAmount, status
- **Relations**: buyer (User), location, items, payment, shipment

#### Payments

- **Primary Key**: id (Int)
- **Fields**: method, amount, status, midtrans integration fields
- **Relations**: order (One-to-One)

### Enum Types

- **UserRole**: USER, ADMIN
- **Condition**: NEW, LIKE_NEW, GOOD, FAIR, POOR
- **OrderStatus**: PENDING, PAID, SHIPPED, DELIVERED, COMPLETED, CANCELLED, REFUNDED
- **PaymentStatus**: PENDING, PAID, FAILED, REFUNDED, EXPIRED, CANCELLED
- **ShipmentStatus**: AWAITING_PICKUP, PICKED_UP, IN_TRANSIT, DELIVERED, RETURNED, CANCELLED

## API Structure (Backend)

### Authentication Endpoints

```
POST /auth/register          # User registration
POST /auth/login             # User login
POST /auth/logout            # User logout
POST /auth/refresh           # Refresh JWT token
POST /auth/forgot-password   # Forgot password
POST /auth/reset-password    # Reset password
POST /auth/verify-email      # Email verification
GET  /auth/profile           # Get user profile
```

### User Management

```
GET    /users               # Get all users (Admin)
GET    /users/:id           # Get user by ID
PUT    /users/:id           # Update user
DELETE /users/:id           # Delete user
GET    /users/profile       # Get current user profile
PUT    /users/profile       # Update current user profile
```

### Product Management

```
GET    /products            # Get all products (with filters)
GET    /products/:id        # Get product by ID
POST   /products            # Create new product
PUT    /products/:id        # Update product
DELETE /products/:id        # Delete product
GET    /products/search     # Search products
GET    /products/category/:categoryId  # Get products by category
```

### Store Management

```
GET    /store              # Get current user's store
POST   /store              # Create new store
PUT    /store              # Update store
GET    /store/:slug        # Get store by slug
GET    /store/:id/products # Get store products
```

### Cart Management

```
GET    /cart               # Get user cart
POST   /cart/items         # Add item to cart
PUT    /cart/items/:id     # Update cart item
DELETE /cart/items/:id     # Remove cart item
DELETE /cart               # Clear cart
```

### Order Management

```
GET    /orders             # Get user orders
GET    /orders/:id         # Get order by ID
POST   /orders             # Create new order
PUT    /orders/:id/status  # Update order status
GET    /orders/seller      # Get seller orders
```

### Payment Integration

```
POST   /payments/create    # Create payment
POST   /payments/callback  # Payment callback (Midtrans)
GET    /payments/:id       # Get payment status
```

### Example Request & Response

#### POST /auth/register

**Request:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+6281234567890"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification.",
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "USER",
      "isVerified": false
    }
  }
}
```

#### GET /products

**Request:**

```
GET /products?page=1&limit=10&category=fashion&condition=LIKE_NEW&minPrice=50000&maxPrice=500000
```

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Vintage Denim Jacket",
        "slug": "vintage-denim-jacket",
        "description": "Classic vintage denim jacket in excellent condition",
        "images": ["image1.jpg", "image2.jpg"],
        "isPreloved": true,
        "category": {
          "id": 1,
          "name": "Fashion",
          "slug": "fashion"
        },
        "variants": [
          {
            "id": 1,
            "size": "M",
            "color": "Blue",
            "price": 150000,
            "condition": "LIKE_NEW",
            "stock": 1
          }
        ],
        "store": {
          "id": 1,
          "name": "Vintage Store",
          "slug": "vintage-store"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

## Frontend Flow

### Routing Halaman

```
/                           # Homepage
/auth/login                 # Login page
/auth/register              # Registration page
/auth/forgot                # Forgot password
/auth/reset                 # Reset password
/auth/confirm               # Email confirmation

/main                       # Main marketplace
/main/men                   # Men's category
/main/women                 # Women's category
/main/kids                  # Kids category
/main/brands                # Brands page
/main/product/[slug]        # Product detail
/main/cart                  # Shopping cart
/main/checkout              # Checkout process
/main/wishlist              # User wishlist
/main/sell                  # Sell product

/dashboard                  # Admin dashboard
/dashboard/users            # User management
/dashboard/products         # Product management
/dashboard/orders           # Order management
/dashboard/reviews          # Review management
/dashboard/settings         # Settings
```

### Komponen Penting

#### Shared Components

- **UI Components**: Button, Input, Modal, Card, etc.
- **Layout Components**: Header, Footer, Sidebar
- **Form Components**: LoginForm, RegisterForm, ProductForm
- **Product Components**: ProductCard, ProductGrid, ProductDetail
- **Cart Components**: CartItem, CartSummary
- **Navigation**: Navbar, Breadcrumb, Pagination

#### Feature Components

- **AuthGuard**: Route protection
- **ProductFilter**: Product filtering
- **SearchBar**: Product search
- **ImageUpload**: File upload component
- **PaymentForm**: Payment processing
- **OrderTracking**: Order status tracking

### State Management

#### Zustand Stores

```typescript
// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

// Cart Store
interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

// Product Store
interface ProductState {
  products: Product[];
  filters: ProductFilters;
  loading: boolean;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
}
```

## Rules & Roles

### Role Permissions

#### USER Role

- Browse and search products
- Manage personal profile
- Create and manage store
- Add products to store
- Place orders
- Write reviews
- Manage cart and wishlist

#### ADMIN Role

- All USER permissions
- Manage all users
- Moderate products
- Manage categories
- View all orders
- Manage vouchers
- System configuration
- Access analytics

### Validasi Token dan Login

#### JWT Token Structure

```typescript
interface JWTPayload {
  sub: number; // User ID
  email: string; // User email
  role: UserRole; // User role
  iat: number; // Issued at
  exp: number; // Expires at
}
```

#### Authentication Guards

- **JwtAuthGuard**: Validates JWT token
- **RolesGuard**: Checks user roles
- **OwnershipGuard**: Validates resource ownership

#### Frontend Route Protection

```typescript
// Protected route example
const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
```

## Deployment & CI/CD

### Environment Production

#### Frontend (Vercel)

```env
NEXT_PUBLIC_APP_URL=https://reluv-app.vercel.app
NEXT_PUBLIC_API_URL=https://api.reluv-app.com
NEXTAUTH_URL=https://reluv-app.vercel.app
NEXTAUTH_SECRET=production-secret-key
# ... other production variables
```

#### Backend (Railway/Render)

```env
DATABASE_URL=postgresql://prod-db-url
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://reluv-app.vercel.app
# ... other production variables
```

### Deployment Tools

#### Frontend - Vercel

1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Enable automatic deployments

#### Backend - Railway

1. Connect GitHub repository
2. Configure environment variables
3. Set start command: `npm run start:prod`
4. Configure PostgreSQL database
5. Set up custom domain

#### Alternative Backend - Render

1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `npm run build`
4. Set start command: `npm run start:prod`
5. Configure PostgreSQL database

### CI/CD Pipeline

#### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        uses: railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

### Database Migration Strategy

1. **Development**: Run migrations locally
2. **Staging**: Auto-migrate on deployment
3. **Production**: Manual migration review and execution

### Monitoring & Logging

- **Error Tracking**: Sentry integration
- **Performance**: Vercel Analytics, Railway metrics
- **Logs**: Structured logging with Winston
- **Uptime**: UptimeRobot or similar service

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm atau yarn

### Installation

1. **Clone Repository**

```bash
git clone <repository-url>
cd reluv-app
```

2. **Backend Setup**

```bash
cd Backend
npm install
cp .env.example .env
# Configure environment variables
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

3. **Frontend Setup**

```bash
cd Frontend
npm install
cp .env.local.example .env.local
# Configure environment variables
npm run dev
```

### Development Workflow

1. Create feature branch
2. Develop and test locally
3. Create pull request
4. Code review
5. Merge to main
6. Automatic deployment

---

_Dokumentasi ini akan terus diperbarui seiring dengan perkembangan project._
