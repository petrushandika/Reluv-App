# Routing

## 🛣 Overview

Reluv Frontend menggunakan Next.js 16 App Router untuk routing. App Router menyediakan file-system based routing dengan support untuk layouts, loading states, dan error handling.

## 📁 File-System Routing

### Basic Routes

Routes dibuat berdasarkan struktur folder di `app/`:

```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── products/
│   └── page.tsx          → /products
└── product/
    └── [id]/
        └── page.tsx      → /product/:id
```

### Dynamic Routes

#### Single Dynamic Segment

```typescript
// app/product/[id]/page.tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return <div>Product ID: {params.id}</div>;
}
```

#### Multiple Dynamic Segments

```typescript
// app/category/[category]/[subcategory]/page.tsx
export default function CategoryPage({
  params,
}: {
  params: { category: string; subcategory: string };
}) {
  return (
    <div>
      Category: {params.category}, Subcategory: {params.subcategory}
    </div>
  );
}
```

### Catch-All Routes

```typescript
// app/shop/[...slug]/page.tsx
export default function ShopPage({ params }: { params: { slug: string[] } }) {
  return <div>Shop: {params.slug.join("/")}</div>;
}
```

## 🎯 Route Structure

### Public Routes

```
/                    → Home page
/women               → Women category
/men                 → Men category
/kids                → Kids category
/brands              → Brands page
/product/[id]        → Product detail
```

### Protected Routes

```
/cart                → Shopping cart (Auth required)
/checkout            → Checkout (Auth required)
/sell                → Sell product (Auth required)
/wishlist            → Wishlist (Auth required)
/profile/*           → User profile (Auth required)
```

### Auth Routes

```
/auth/login          → Login page
/auth/register       → Register page
/auth/forgot         → Forgot password
/auth/reset           → Reset password
/auth/confirm         → Email confirmation
```

## 🔒 Route Protection

### Using Route Guards

**Location:** `shared/components/guards/RouteGuards.tsx`

```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

### Usage in Pages

```typescript
// app/cart/page.tsx
import RouteGuard from "@/shared/components/guards/RouteGuards";

export default function CartPage() {
  return (
    <RouteGuard>
      <div>Cart Content</div>
    </RouteGuard>
  );
}
```

## 🧭 Navigation

### Using Next.js Link

```typescript
import Link from 'next/link';

<Link href="/products">Products</Link>
<Link href={`/product/${productId}`}>View Product</Link>
```

### Programmatic Navigation

```typescript
"use client";

import { useRouter } from "next/navigation";

function MyComponent() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/products");
  };

  return <button onClick={handleClick}>Go to Products</button>;
}
```

### Navigation with Query Params

```typescript
const router = useRouter();

// Navigate with query params
router.push("/products?category=1&search=shirt");

// Or use URLSearchParams
const params = new URLSearchParams({ category: "1", search: "shirt" });
router.push(`/products?${params.toString()}`);
```

## 📄 Layouts

### Root Layout

**Location:** `app/layout.tsx`

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

### Nested Layouts

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

### Route Groups

```typescript
// app/(auth)/login/page.tsx
// app/(auth)/register/page.tsx
// Group routes tanpa mempengaruhi URL
```

## ⚡ Loading States

### Loading UI

```typescript
// app/products/loading.tsx
export default function Loading() {
  return <div>Loading products...</div>;
}
```

### Suspense Boundaries

```typescript
import { Suspense } from "react";

<Suspense fallback={<Loading />}>
  <ProductList />
</Suspense>;
```

## ❌ Error Handling

### Error Boundaries

```typescript
// app/products/error.tsx
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
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Not Found Pages

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <Link href="/">Go Home</Link>
    </div>
  );
}
```

## 🔄 Route Transitions

### Prefetching

Next.js automatically prefetches links yang terlihat di viewport:

```typescript
<Link href="/products" prefetch={true}>
  Products
</Link>
```

### Disable Prefetching

```typescript
<Link href="/products" prefetch={false}>
  Products
</Link>
```

## 📊 Route Metadata

### Static Metadata

```typescript
// app/products/page.tsx
export const metadata = {
  title: "Products",
  description: "Browse our product collection",
};
```

### Dynamic Metadata

```typescript
// app/product/[id]/page.tsx
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return {
    title: product.name,
    description: product.description,
  };
}
```

## 🎯 Best Practices

### 1. Route Organization

- Group related routes
- Use route groups untuk shared layouts
- Keep routes shallow when possible

### 2. Code Splitting

- Next.js automatically code splits
- Use dynamic imports untuk large components
- Lazy load heavy dependencies

### 3. SEO

- Add metadata untuk setiap page
- Use semantic HTML
- Implement structured data

### 4. Performance

- Enable prefetching untuk important links
- Use loading states
- Optimize images dengan Next.js Image

## 📚 Related Documentation

- [Architecture](./02-ARCHITECTURE.md)
- [Components](./03-COMPONENTS.md)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
