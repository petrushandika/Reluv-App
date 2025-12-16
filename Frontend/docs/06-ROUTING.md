# Routing

## Overview

Reluv App uses Next.js 14+ App Router with **route groups** for clean organization and layout management.

## Route Groups

Route groups organize routes without affecting the URL structure:

### (main) - Public Routes

**Layout**: Navbar + Footer + BackToTop

```
app/(main)/
├── layout.tsx              # Main layout
├── page.tsx                # Redirects to /home
├── home/page.tsx           # Homepage
├── men/page.tsx            # Men category
├── women/page.tsx          # Women category
├── kids/page.tsx           # Kids category
├── brands/page.tsx         # Brands
├── product/[slug]/         # Product detail
│   ├── page.tsx
│   └── reviews/page.tsx
├── cart/page.tsx           # Shopping cart
├── checkout/page.tsx       # Checkout
├── wishlist/page.tsx       # Wishlist
├── profile/                # User profile
│   ├── page.tsx
│   ├── me/page.tsx
│   ├── address/page.tsx
│   ├── orders/page.tsx
│   └── products/page.tsx
└── sell/page.tsx           # Sell product
```

**URLs**:

- `/` → redirects to `/home`
- `/home` - Homepage
- `/men` - Men category
- `/product/nike-air-max` - Product detail
- `/cart` - Shopping cart

### (auth) - Authentication Routes

**Layout**: Minimal (NO Navbar/Footer)

```
app/(auth)/
├── layout.tsx              # Minimal layout
├── login/page.tsx          # Login
├── register/page.tsx       # Register
├── forgot/page.tsx         # Forgot password
├── reset/page.tsx          # Reset password
├── confirm/page.tsx        # Email confirmation
├── verification/page.tsx   # Email verification
└── callback/page.tsx       # OAuth callback
```

**URLs**:

- `/login` - Login page
- `/register` - Register page
- `/forgot` - Forgot password

### (admin) - Admin Routes

**Layout**: Admin sidebar

```
app/(admin)/
├── layout.tsx              # Admin layout
└── store/                  # Store management
    ├── layout.tsx          # Store dashboard layout
    ├── page.tsx            # Dashboard
    ├── products/page.tsx   # Products
    ├── orders/page.tsx     # Orders
    ├── reviews/page.tsx    # Reviews
    └── settings/page.tsx   # Settings
```

**URLs**:

- `/store` - Store dashboard
- `/store/products` - Manage products
- `/store/orders` - Manage orders

## Dynamic Routes

### Product Detail

```typescript
// app/(main)/product/[slug]/page.tsx
export default function ProductDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  // slug = "nike-air-max"
}
```

**URL**: `/product/nike-air-max`

### Category Pages

```typescript
// app/(main)/men/[category]/page.tsx
export default function MenCategory({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;
  // category = "shoes"
}
```

**URL**: `/men/shoes`

## Navigation

### Using Link Component

```typescript
import Link from "next/link";

<Link href="/product/nike-air-max">View Product</Link>;
```

### Programmatic Navigation

```typescript
"use client";

import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/cart");
  };

  return <button onClick={handleClick}>Go to Cart</button>;
}
```

### With Query Parameters

```typescript
// Navigate with query params
router.push("/products?category=shoes&color=red");

// Access query params
import { useSearchParams } from "next/navigation";

const searchParams = useSearchParams();
const category = searchParams.get("category"); // "shoes"
```

## Route Protection

### Public Routes

No authentication required:

- `/home`
- `/men`, `/women`, `/kids`
- `/product/[slug]`
- `/brands`

### Protected Routes

Require authentication:

- `/cart`
- `/checkout`
- `/wishlist`
- `/profile/*`
- `/sell`

### Admin Routes

Require store ownership:

- `/store/*`

### Implementation

```typescript
// shared/components/guards/RouteGuards.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated()) {
    return <Spinner />;
  }

  return <>{children}</>;
}
```

**Usage**:

```typescript
// app/(main)/cart/page.tsx
import { ProtectedRoute } from "@/shared/components/guards/RouteGuards";

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
```

## Layouts

### Root Layout

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppInitializer>
            <Toaster />
            {children}
          </AppInitializer>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Main Layout

```typescript
// app/(main)/layout.tsx
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-20 md:pt-24 lg:pt-36">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
```

### Auth Layout

```typescript
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
```

## Redirects

### Root Page Redirect

```typescript
// app/(main)/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return null;
}
```

### Conditional Redirects

```typescript
// app/(main)/checkout/page.tsx
export default function CheckoutPage() {
  const { items } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // ...
}
```

## Middleware

### Authentication Middleware

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ["/cart", "/checkout", "/profile", "/sell"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## Route Prefetching

Next.js automatically prefetches routes in viewport:

```typescript
// Prefetch on hover
<Link href="/product/nike-air-max" prefetch={true}>
  Product
</Link>;

// Programmatic prefetch
const router = useRouter();
router.prefetch("/checkout");
```

## Loading States

### Loading UI

```typescript
// app/(main)/product/[slug]/loading.tsx
export default function Loading() {
  return <ProductDetailSkeleton />;
}
```

### Error Handling

```typescript
// app/(main)/product/[slug]/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Not Found

```typescript
// app/(main)/product/[slug]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>Product Not Found</h2>
      <Link href="/">Go Home</Link>
    </div>
  );
}
```

## Route Handlers (API Routes)

```typescript
// app/api/products/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const products = await fetchProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const product = await createProduct(body);
  return NextResponse.json(product);
}
```

## Best Practices

1. **Use route groups** for layout organization
2. **Implement loading states** for better UX
3. **Handle errors gracefully** with error boundaries
4. **Protect sensitive routes** with guards
5. **Prefetch important routes** for performance
6. **Use dynamic imports** for code splitting
7. **Implement proper redirects** for auth flows

## Complete Route Map

```
/                           → /home (redirect)
/home                       → Homepage
/men                        → Men category
/men/[category]             → Men subcategory
/women                      → Women category
/women/[category]           → Women subcategory
/kids                       → Kids category
/kids/[category]            → Kids subcategory
/brands                     → Brands page
/product/[slug]             → Product detail
/product/[slug]/reviews     → Product reviews
/cart                       → Shopping cart (protected)
/checkout                   → Checkout (protected)
/wishlist                   → Wishlist (protected)
/profile                    → Profile redirect
/profile/me                 → User profile (protected)
/profile/address            → Address management (protected)
/profile/orders             → Order history (protected)
/profile/products           → User products (protected)
/sell                       → Sell product (protected)
/login                      → Login
/register                   → Register
/forgot                     → Forgot password
/reset                      → Reset password
/store                      → Store dashboard (admin)
/store/create               → Create store (protected)
/store/products             → Manage products (admin)
/store/orders               → Manage orders (admin)
/privacy                    → Privacy policy
/terms                      → Terms of service
/help                       → Help center
/contact                    → Contact us
```

---

**Next**: [Styling](./07-STYLING.md)
