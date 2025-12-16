# Reluv App - Frontend

Modern e-commerce platform for buying and selling luxury fashion items, built with Next.js 14+ App Router.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3099`

## 📁 Project Structure

```
Frontend/src/
├── app/                         # Next.js App Router (Pages & Layouts ONLY)
│   ├── (main)/                  # Public pages with Navbar + Footer
│   │   ├── layout.tsx          # Main layout (Navbar, Footer, BackToTop)
│   │   ├── page.tsx            # Redirects to /home
│   │   ├── home/               # Homepage
│   │   ├── men/, women/, kids/ # Category pages
│   │   ├── product/[slug]/     # Product detail
│   │   ├── cart/, checkout/    # Shopping flow
│   │   ├── wishlist/           # Wishlist
│   │   ├── profile/            # User profile
│   │   └── sell/               # Sell product
│   │
│   ├── (auth)/                  # Auth pages (NO Navbar/Footer)
│   │   ├── layout.tsx          # Minimal auth layout
│   │   ├── login/, register/   # Authentication
│   │   └── forgot/, reset/     # Password recovery
│   │
│   ├── (admin)/                 # Admin pages
│   │   ├── layout.tsx          # Admin layout
│   │   └── store/              # Store dashboard
│   │
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
│
├── features/                    # Business Logic (NO Pages!)
│   ├── (main)/                  # Public features
│   │   ├── products/           # Product browsing
│   │   ├── cart/               # Shopping cart
│   │   ├── wishlist/           # Wishlist
│   │   ├── checkout/           # Checkout
│   │   ├── orders/             # Order tracking
│   │   ├── reviews/            # Product reviews
│   │   ├── categories/         # Categories
│   │   ├── user/               # User profile
│   │   ├── address/            # Address management
│   │   └── sell/               # Sell product
│   │
│   ├── (auth)/                  # Authentication
│   │   ├── api/                # Auth API
│   │   ├── components/         # Auth components
│   │   ├── hooks/              # Auth hooks
│   │   ├── store/              # Auth state
│   │   └── types/              # Auth types
│   │
│   └── (admin)/                 # Admin features
│       └── store/              # Store management
│           ├── api/            # Store API
│           ├── components/     # Store components
│           ├── guards/         # Store guards
│           └── types/          # Store types
│
├── shared/                      # Shared Resources
│   ├── components/
│   │   ├── layout/             # Layout components (Navbar, Footer)
│   │   ├── organisms/          # Page-specific components (Banner, Categories)
│   │   ├── common/             # Reusable components (Spinner, Modal)
│   │   ├── ui/                 # UI primitives
│   │   └── guards/             # Route guards
│   ├── hooks/                  # Shared hooks
│   ├── lib/                    # Utilities (axios, utils)
│   ├── types/                  # Shared types
│   └── constants/              # Constants
│
└── context/                     # React contexts
    └── AuthContext.tsx
```

## 🎯 Architecture Principles

### 1. **Separation of Concerns**

- **app/**: ONLY pages and layouts
- **features/**: Business logic, components, API calls
- **shared/**: Reusable components and utilities

### 2. **Route Groups**

- **(main)**: Public pages with Navbar + Footer
- **(auth)**: Authentication pages (minimal layout)
- **(admin)**: Admin/seller pages

### 3. **Feature Organization**

Each feature follows this structure:

```
feature-name/
├── api/            # API calls
├── components/     # Feature components
├── hooks/          # Feature hooks
├── store/          # State management (Zustand)
└── types/          # TypeScript types
```

## 📝 Import Patterns

### From App Pages

```typescript
// Import from features
import { ProductCard } from "@/features/(main)/products/components/ProductCard";
import { useCart } from "@/features/(main)/cart/hooks/useCart";
import { useAuthStore } from "@/features/(auth)/store/auth.store";

// Import from shared
import Navbar from "@/shared/components/layout/Navbar";
import Banner from "@/shared/components/organisms/Banner";
import Spinner from "@/shared/components/common/Spinner";
```

### From Features

```typescript
// Features can import from other features and shared
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { api } from "@/shared/lib/axios";
```

### From Shared

```typescript
// Shared should NOT import from features or app
import { cn } from "@/shared/lib/utils";
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Validation**: Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🔑 Key Features

### Public Features

- Product browsing & search
- Shopping cart & wishlist
- Checkout & payment
- Order tracking
- Product reviews
- Category browsing

### Authentication

- Login & Registration
- Password recovery
- Email verification
- Social login (Google, Facebook)

### User Features

- Profile management
- Address management
- Order history
- Sell products

### Store Management

- Store dashboard
- Product management
- Order management
- Analytics

## 🎨 Styling

- **Dark Mode**: Fully supported
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions
- **Theme**: Sky blue primary color

## 📱 Routes

### Public Routes (with Navbar + Footer)

- `/` → redirects to `/home`
- `/home` - Homepage
- `/men`, `/women`, `/kids` - Categories
- `/product/[slug]` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/wishlist` - Wishlist
- `/profile/*` - User profile

### Auth Routes (minimal layout)

- `/login` - Login
- `/register` - Register
- `/forgot` - Forgot password
- `/reset` - Reset password

### Admin Routes

- `/store` - Store dashboard
- `/store/create` - Create store

## 🔐 Environment Variables

Create a `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3099
```

## 📚 Documentation

Detailed documentation available in `/docs`:

1. [Getting Started](./docs/01-GETTING-STARTED.md)
2. [Architecture](./docs/02-ARCHITECTURE.md)
3. [Components](./docs/03-COMPONENTS.md)
4. [State Management](./docs/04-STATE-MANAGEMENT.md)
5. [API Integration](./docs/05-API-INTEGRATION.md)
6. [Routing](./docs/06-ROUTING.md)
7. [Styling](./docs/07-STYLING.md)
8. [Forms & Validation](./docs/08-FORMS-VALIDATION.md)
9. [Deployment](./docs/09-DEPLOYMENT.md)
10. [Troubleshooting](./docs/10-TROUBLESHOOTING.md)

## 🧪 Development

### Adding a New Feature

1. Create feature folder in appropriate route group:

```bash
mkdir src/features/(main)/new-feature
mkdir src/features/(main)/new-feature/{api,components,hooks,store,types}
```

2. Create page in app:

```bash
mkdir src/app/(main)/new-feature
touch src/app/(main)/new-feature/page.tsx
```

3. Import from features:

```typescript
import { Component } from "@/features/(main)/new-feature/components/Component";
```

### Adding a Shared Component

```bash
# Layout component
touch src/shared/components/layout/NewLayout.tsx

# Common component
touch src/shared/components/common/NewComponent.tsx
```

## 🚀 Build & Deploy

```bash
# Type check
npx tsc --noEmit

# Build
npm run build

# Start production
npm start
```

## 📊 Build Statistics

- **Total Routes**: 34
- **Static Pages**: 30
- **Dynamic Pages**: 4
- **Build Time**: ~17s

## 🤝 Contributing

1. Follow the established folder structure
2. Use TypeScript for type safety
3. Follow import patterns
4. Write clean, maintainable code
5. Test thoroughly before committing

## 📄 License

MIT

---

**Built with ❤️ using Next.js**
