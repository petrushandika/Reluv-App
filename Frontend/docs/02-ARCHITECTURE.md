# Architecture

## Overview

Reluv App follows a **clean architecture** pattern with clear separation of concerns using Next.js 14+ App Router and route groups.

## Core Principles

### 1. Separation of Concerns

```
app/        → Pages & Layouts ONLY
features/   → Business Logic & Components
shared/     → Reusable Code
```

### 2. Route Groups

Route groups organize code by domain without affecting URLs:

- **(main)**: Public pages with Navbar + Footer
- **(auth)**: Authentication pages (minimal layout)
- **(admin)**: Admin/seller pages

### 3. Feature-Based Organization

Each feature is self-contained with its own:

- API calls
- Components
- Hooks
- State management
- Types

## Directory Structure

### App Directory (`src/app/`)

**Purpose**: Pages and layouts ONLY

```
app/
├── (main)/                  # Public pages
│   ├── layout.tsx          # Navbar + Footer + BackToTop
│   ├── page.tsx            # Redirects to /home
│   ├── home/page.tsx       # Homepage content
│   ├── men/page.tsx        # Men category
│   ├── product/[slug]/     # Product detail
│   └── ...
│
├── (auth)/                  # Auth pages
│   ├── layout.tsx          # Minimal layout
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (admin)/                 # Admin pages
│   ├── layout.tsx          # Admin layout
│   └── store/
│       ├── layout.tsx      # Store dashboard layout
│       └── page.tsx        # Store dashboard
│
├── layout.tsx              # Root layout
└── globals.css             # Global styles
```

**Rules**:

- ✅ ONLY pages (`page.tsx`) and layouts (`layout.tsx`)
- ❌ NO business logic
- ❌ NO API calls
- ❌ NO complex components

### Features Directory (`src/features/`)

**Purpose**: Business logic and feature-specific code

```
features/
├── (main)/                  # Public features
│   ├── products/
│   │   ├── api/            # Product API calls
│   │   ├── components/     # Product components
│   │   ├── hooks/          # Product hooks
│   │   ├── store/          # Product state (Zustand)
│   │   └── types/          # Product types
│   │
│   ├── cart/               # Shopping cart
│   ├── wishlist/           # Wishlist
│   ├── checkout/           # Checkout
│   ├── orders/             # Orders
│   ├── reviews/            # Reviews
│   ├── categories/         # Categories
│   ├── user/               # User profile
│   ├── address/            # Address
│   └── sell/               # Sell product
│
├── (auth)/                  # Authentication
│   ├── api/                # Auth API
│   ├── components/         # Login, Register forms
│   ├── hooks/              # useAuth
│   ├── store/              # Auth state
│   └── types/              # Auth types
│
└── (admin)/                 # Admin features
    └── store/              # Store management
        ├── api/            # Store API
        ├── components/     # Store components
        ├── guards/         # Store guards
        └── types/          # Store types
```

**Rules**:

- ✅ Business logic here
- ✅ API calls here
- ✅ Feature components here
- ❌ NO pages (use app/ for pages)

### Shared Directory (`src/shared/`)

**Purpose**: Reusable code across features

```
shared/
├── components/
│   ├── layout/             # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── BackToTop.tsx
│   │   ├── Sidebar.tsx
│   │   ├── AppInitializer.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ProfileSidebar.tsx
│   │
│   ├── organisms/          # Page-specific complex components
│   │   ├── Banner.tsx
│   │   ├── Categories.tsx
│   │   ├── Promotion.tsx
│   │   ├── CategoryHero.tsx
│   │   ├── GeoSearch.tsx
│   │   └── MapPicker.tsx
│   │
│   ├── common/             # Common reusable components
│   │   ├── Spinner.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   └── ...
│   │
│   ├── ui/                 # UI primitives
│   └── guards/             # Route guards
│
├── hooks/                  # Shared hooks
├── lib/                    # Utilities
│   ├── axios.ts           # API client
│   └── utils.ts           # Helper functions
├── types/                  # Shared types
└── constants/              # Constants
```

**Rules**:

- ✅ Reusable components
- ✅ Utilities and helpers
- ❌ NO imports from features/
- ❌ NO imports from app/

## Data Flow

```
┌─────────────────────────────────────────────┐
│                   User                       │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│              App (Pages)                     │
│  - Renders UI                                │
│  - Handles routing                           │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│           Features (Logic)                   │
│  - Business logic                            │
│  - API calls                                 │
│  - State management                          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│          Shared (Utilities)                  │
│  - Reusable components                       │
│  - Helper functions                          │
│  - API client                                │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│              Backend API                     │
└─────────────────────────────────────────────┘
```

## Import Rules

### ✅ Allowed Imports

```typescript
// App can import from features and shared
// app/(main)/page.tsx
import { ProductCard } from "@/features/(main)/products/components/ProductCard";
import Navbar from "@/shared/components/layout/Navbar";

// Features can import from other features and shared
// features/(main)/cart/components/CartItem.tsx
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { api } from "@/shared/lib/axios";

// Shared can import from other shared
// shared/components/common/Modal.tsx
import { cn } from "@/shared/lib/utils";
```

### ❌ Forbidden Imports

```typescript
// Shared CANNOT import from features
// ❌ shared/components/common/Button.tsx
import { useCart } from "@/features/(main)/cart/hooks/useCart"; // WRONG!

// Shared CANNOT import from app
// ❌ shared/components/layout/Navbar.tsx
import HomePage from "@/app/(main)/home/page"; // WRONG!

// Features should NOT import from app
// ❌ features/(main)/products/components/ProductCard.tsx
import HomePage from "@/app/(main)/home/page"; // WRONG!
```

## Layout Hierarchy

```
Root Layout (app/layout.tsx)
├── Providers (Auth, Theme)
├── Global Styles
└── Toaster
    │
    ├── Main Layout (app/(main)/layout.tsx)
    │   ├── Navbar
    │   ├── Main Content (children)
    │   ├── Footer
    │   └── BackToTop
    │
    ├── Auth Layout (app/(auth)/layout.tsx)
    │   └── Main Content (children)
    │       └── Minimal layout
    │
    └── Admin Layout (app/(admin)/layout.tsx)
        └── Store Layout (app/(admin)/store/layout.tsx)
            ├── StoreSidebar
            └── Main Content (children)
```

## State Management

### Global State (Zustand)

```typescript
// features/(auth)/store/auth.store.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: async (credentials) => {
    /* ... */
  },
  logout: () => {
    /* ... */
  },
}));
```

### Local State (React)

```typescript
// app/(main)/product/[slug]/page.tsx
const [quantity, setQuantity] = useState(1);
```

### Server State (React Query - Future)

```typescript
// features/(main)/products/hooks/useProducts.ts
export const useProducts = () => {
  return useQuery(["products"], fetchProducts);
};
```

## API Integration

### API Client

```typescript
// shared/lib/axios.ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

### Feature API

```typescript
// features/(main)/products/api/productsApi.ts
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};
```

### Usage in Components

```typescript
// app/(main)/home/page.tsx
import { useProduct } from "@/features/(main)/products/hooks/useProduct";

export default function HomePage() {
  const { products, isLoading } = useProduct();
  // ...
}
```

## Benefits

### 1. **Scalability**

- Easy to add new features
- Clear boundaries between domains
- Independent feature development

### 2. **Maintainability**

- Easy to find code
- Clear responsibility
- Consistent patterns

### 3. **Testability**

- Features are isolated
- Easy to mock dependencies
- Clear data flow

### 4. **Team Collaboration**

- Multiple developers can work on different features
- Less merge conflicts
- Clear ownership

## Best Practices

1. **Keep app/ clean**: Only pages and layouts
2. **Feature isolation**: Features should be self-contained
3. **Shared utilities**: Extract common code to shared/
4. **Type safety**: Use TypeScript everywhere
5. **Consistent naming**: Follow established patterns
6. **Documentation**: Document complex logic

---

**Next**: [Components](./03-COMPONENTS.md)
