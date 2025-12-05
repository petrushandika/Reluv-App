# Reluv Frontend Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Features](#features)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Components](#components)
- [Routing](#routing)
- [Styling](#styling)
- [Deployment](#deployment)

## 🎯 Overview

Reluv Frontend adalah aplikasi e-commerce preloved fashion yang dibangun dengan Next.js 16, React 19, dan TypeScript. Aplikasi ini menyediakan interface yang modern dan responsif untuk browsing produk, manajemen cart, checkout, dan berbagai fitur lainnya.

## 🛠 Tech Stack

- **Framework**: Next.js 16.x (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Carousel**: Embla Carousel
- **Maps**: Leaflet, React Leaflet
- **Notifications**: Sonner
- **UI Components**: Radix UI

## 📦 Prerequisites

- Node.js (v18 atau lebih tinggi)
- npm atau yarn
- Backend API running (lihat Backend README)

## 🚀 Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd Reluv-App/Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

4. **Configure environment variables** (lihat [Configuration](#configuration))

5. **Run the application**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3099`
# Aplikasi akan berjalan di `http://localhost:3099`

## ⚙️ Configuration

Buat file `.env` di root directory Frontend:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# NextAuth (jika digunakan)
NEXTAUTH_URL=http://localhost:3099
NEXTAUTH_SECRET=your-secret-key

# Cloudinary (jika diperlukan di frontend)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

## ▶️ Running the Application

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/               # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot/
│   │   │   ├── reset/
│   │   │   └── confirm/
│   │   ├── product/            # Product detail pages
│   │   │   └── [id]/
│   │   ├── women/              # Women category pages
│   │   ├── men/                # Men category pages
│   │   ├── kids/               # Kids category pages
│   │   ├── brands/             # Brands page
│   │   ├── cart/               # Cart page
│   │   ├── checkout/           # Checkout page
│   │   ├── sell/               # Sell product page
│   │   ├── wishlist/           # Wishlist page
│   │   ├── profile/            # User profile pages
│   │   │   ├── me/
│   │   │   ├── orders/
│   │   │   └── address/
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── features/               # Feature-based modules
│   │   ├── auth/               # Authentication feature
│   │   │   ├── api/            # API calls
│   │   │   ├── components/     # Auth components
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── store/          # Zustand store
│   │   │   └── types/          # TypeScript types
│   │   ├── products/           # Products feature
│   │   ├── cart/               # Cart feature
│   │   ├── wishlist/           # Wishlist feature
│   │   ├── reviews/            # Reviews feature
│   │   ├── sell/               # Sell product feature
│   │   ├── categories/         # Categories feature
│   │   └── user/               # User feature
│   ├── shared/                 # Shared utilities
│   │   ├── components/          # Reusable components
│   │   │   ├── atoms/          # Basic components
│   │   │   ├── molecules/      # Composite components
│   │   │   ├── organisms/      # Complex components
│   │   │   ├── templates/      # Page templates
│   │   │   └── ui/             # UI primitives
│   │   ├── hooks/              # Shared hooks
│   │   ├── lib/                # Utilities
│   │   ├── store/              # Shared stores
│   │   └── types/              # Shared types
│   ├── context/                # React contexts
│   └── public/                 # Static assets
├── .env                        # Environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
└── package.json
```

## 🏗 Architecture

### Feature-Based Structure

Aplikasi menggunakan struktur feature-based dimana setiap fitur memiliki:
- **api/**: API integration layer
- **components/**: Feature-specific components
- **hooks/**: Custom React hooks
- **store/**: Zustand state management
- **types/**: TypeScript type definitions

### Component Hierarchy

```
Atoms → Molecules → Organisms → Templates → Pages
```

- **Atoms**: Basic building blocks (Button, Input, Spinner)
- **Molecules**: Simple combinations (Form, Card, Modal)
- **Organisms**: Complex components (Navbar, Footer, ProductList)
- **Templates**: Page layouts (AuthTemplate)
- **Pages**: Full page components

## ✨ Features

### Authentication
- User registration dengan email verification
- Login dengan email/password
- Social login (Google, Facebook)
- Password reset
- Protected routes

### Product Management
- Product listing dengan filters
- Product detail page
- Category browsing (Women, Men, Kids, Brands)
- Search functionality
- Product variants (size, color)

### Shopping Cart
- Add/remove items
- Update quantities
- Cart persistence
- Cart summary

### Checkout
- Address management
- Shipping rate calculation
- Payment integration (Midtrans)
- Order confirmation

### User Profile
- Profile management
- Order history
- Address management
- Wishlist management

### Sell Product
- Product listing form
- Image upload (Cloudinary)
- Category selection
- Variant management

### Reviews & Ratings
- Product reviews
- Rating system
- Review images

## 🔄 State Management

Aplikasi menggunakan **Zustand** untuk state management.

### Stores

#### Auth Store (`features/auth/store/auth.store.ts`)
```typescript
- user: User | null
- token: string | null
- isAuthenticated: boolean
- login()
- logout()
- register()
```

#### Cart Store (`features/cart/store/cart.store.ts`)
```typescript
- items: CartItem[]
- itemCount: number
- total: number
- addItem()
- removeItem()
- updateQuantity()
- clearCart()
```

#### Wishlist Store (`features/wishlist/store/wishlist.store.ts`)
```typescript
- items: WishlistItem[]
- addToWishlist()
- removeFromWishlist()
- isInWishlist()
```

### Usage Example

```typescript
import { useAuthStore } from '@/features/auth/store/auth.store';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.firstName}!</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

## 🌐 API Integration

### Axios Configuration

API client dikonfigurasi di `shared/lib/axios.ts`:

```typescript
import { api } from '@/shared/lib/axios';

// GET request
const products = await api.get('/products');

// POST request
const newProduct = await api.post('/products', data);

// With authentication (token di-inject otomatis)
```

### API Structure

Setiap feature memiliki API layer di `features/{feature}/api/`:

```typescript
// features/products/api/productsApi.ts
export const getProducts = async (params?: QueryParams) => {
  const response = await api.get('/products', { params });
  return response.data;
};
```

### Error Handling

Error handling dilakukan di axios interceptor:

```typescript
// Auto-redirect ke login jika 401
// Show toast notification untuk errors
// Log errors untuk debugging
```

## 🧩 Components

### Shared Components

#### Atoms
- `Spinner` - Loading spinner
- `Skeleton` - Loading skeleton

#### Molecules
- `CategorySelector` - Category dropdown dengan nested categories
- `CustomSelect` - Custom dropdown untuk size/color
- `ProductCardSkeleton` - Product card loading state
- `AuthForm` - Reusable auth form wrapper

#### Organisms
- `Navbar` - Main navigation dengan dropdown menus
- `Footer` - Footer dengan links
- `ProductList` - Product listing dengan carousel
- `Banner` - Hero banner
- `Categories` - Category showcase

### Feature Components

#### Products
- `ProductCard` - Product card component
- `ProductList` - Product list dengan Embla carousel

#### Cart
- `CartItem` - Cart item component
- `CartSummary` - Cart summary dengan totals

#### Reviews
- `ReviewCard` - Review card component
- `ReviewList` - Review list
- `ReviewForm` - Review form

## 🛣 Routing

Aplikasi menggunakan Next.js App Router:

### Public Routes
- `/` - Home page
- `/women`, `/men`, `/kids` - Category pages
- `/product/[id]` - Product detail
- `/brands` - Brands page

### Protected Routes
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/sell` - Sell product
- `/wishlist` - Wishlist
- `/profile/*` - User profile

### Auth Routes
- `/auth/login` - Login
- `/auth/register` - Register
- `/auth/forgot` - Forgot password
- `/auth/reset` - Reset password

### Route Guards

Route protection dilakukan di `shared/components/guards/RouteGuards.tsx`:

```typescript
<RouteGuard>
  <ProtectedPage />
</RouteGuard>
```

## 🎨 Styling

### Tailwind CSS

Aplikasi menggunakan Tailwind CSS 4.x untuk styling.

### Theme

- **Light Mode**: Default theme
- **Dark Mode**: Dark theme dengan toggle
- **Responsive**: Mobile-first approach

### Custom Classes

Custom utility classes di `globals.css`:

```css
/* Custom animations */
/* Custom utilities */
/* Theme variables */
```

### Component Styling

Components menggunakan:
- Tailwind utility classes
- Conditional classes dengan `clsx` dan `tailwind-merge`
- CSS modules untuk complex styling (jika diperlukan)

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Pastikan semua environment variables di-set di production:
- `NEXT_PUBLIC_API_URL`
- Other required variables

### Deployment Options

- **Vercel** (Recommended untuk Next.js)
- **Netlify**
- **AWS Amplify**
- **Self-hosted** dengan Node.js

## 📝 Best Practices

### Code Organization
- Feature-based structure
- Separation of concerns
- Reusable components
- Type safety dengan TypeScript

### Performance
- Image optimization dengan Next.js Image
- Code splitting otomatis
- Lazy loading untuk components
- API response caching

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

## 🧪 Testing

```bash
# Run tests (jika ada)
npm run test

# Linting
npm run lint
```

## 📄 License

Private - All rights reserved
