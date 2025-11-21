# Architecture

## 🏗 System Architecture

Reluv Frontend menggunakan Next.js 16 dengan App Router, React 19, dan TypeScript. Aplikasi mengikuti feature-based architecture dengan separation of concerns yang jelas.

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (routes)/           # Route groups
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── features/               # Feature modules
│   │   ├── auth/               # Authentication
│   │   │   ├── api/            # API calls
│   │   │   ├── components/     # Feature components
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── store/          # Zustand store
│   │   │   └── types/          # TypeScript types
│   │   ├── products/           # Products
│   │   ├── cart/               # Shopping cart
│   │   └── ...
│   ├── shared/                 # Shared code
│   │   ├── components/          # Reusable components
│   │   │   ├── atoms/          # Basic components
│   │   │   ├── molecules/      # Composite components
│   │   │   ├── organisms/      # Complex components
│   │   │   └── templates/      # Page templates
│   │   ├── hooks/              # Shared hooks
│   │   ├── lib/                # Utilities
│   │   ├── store/              # Shared stores
│   │   └── types/              # Shared types
│   └── context/                # React contexts
└── public/                     # Static assets
```

## 🎯 Design Patterns

### 1. Feature-Based Architecture

Setiap feature adalah module independen dengan:
- **api/**: API integration layer
- **components/**: Feature-specific components
- **hooks/**: Custom React hooks
- **store/**: Zustand state management
- **types/**: TypeScript type definitions

### 2. Component Hierarchy

```
Atoms → Molecules → Organisms → Templates → Pages
```

- **Atoms**: Basic building blocks (Button, Input, Spinner)
- **Molecules**: Simple combinations (Form, Card, Modal)
- **Organisms**: Complex components (Navbar, Footer, ProductList)
- **Templates**: Page layouts (AuthTemplate)
- **Pages**: Full page components

### 3. State Management

- **Zustand** untuk global state
- **React State** untuk local component state
- **URL State** untuk shareable state (filters, search)

### 4. Data Fetching

- **Server Components** untuk initial data
- **Client Components** dengan hooks untuk dynamic data
- **React Query** pattern (jika diperlukan)

## 🔄 Data Flow

### Component Data Flow

```
Page Component
    ↓
Feature Hook (useProduct, useCart, etc.)
    ↓
API Layer (productsApi, cartApi, etc.)
    ↓
Axios Instance (shared/lib/axios.ts)
    ↓
Backend API
    ↓
Response → Store → Component Update
```

### State Flow

```
User Action
    ↓
Event Handler
    ↓
Store Action (Zustand)
    ↓
API Call
    ↓
Update Store
    ↓
Component Re-render
```

## 🎨 Component Architecture

### Atomic Design

#### Atoms
Basic, indivisible components:
- `Button`
- `Input`
- `Spinner`
- `Skeleton`

#### Molecules
Simple combinations:
- `CategorySelector`
- `CustomSelect`
- `ProductCardSkeleton`
- `AuthForm`

#### Organisms
Complex components:
- `Navbar`
- `Footer`
- `ProductList`
- `Banner`
- `Categories`

#### Templates
Page layouts:
- `AuthTemplate`

#### Pages
Full page components:
- `app/page.tsx` (Home)
- `app/product/[id]/page.tsx` (Product Detail)

## 🔌 Integration Points

### Backend API

- Base URL: `NEXT_PUBLIC_API_URL`
- Axios instance: `shared/lib/axios.ts`
- Auto token injection
- Error handling

### External Services

- **Cloudinary**: Image optimization
- **Maps**: Leaflet untuk location picker
- **Payment**: Midtrans integration (via backend)

## 📦 Key Technologies

### Core
- **Next.js 16**: Framework dengan App Router
- **React 19**: UI library
- **TypeScript**: Type safety

### State & Data
- **Zustand**: State management
- **Axios**: HTTP client
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### UI & Styling
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animations
- **Lucide React**: Icons
- **Radix UI**: Accessible components

### Other
- **Embla Carousel**: Product carousels
- **Sonner**: Toast notifications
- **Leaflet**: Maps integration

## 🎯 Best Practices

### 1. Code Organization
- Feature-based structure
- Separation of concerns
- Reusable components
- Type safety

### 2. Performance
- Image optimization dengan Next.js Image
- Code splitting otomatis
- Lazy loading
- API response caching

### 3. Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

### 4. SEO
- Server-side rendering
- Meta tags
- Structured data
- Sitemap

## 📚 Related Documentation

- [Getting Started](./01-GETTING-STARTED.md)
- [Components](./03-COMPONENTS.md)
- [State Management](./04-STATE-MANAGEMENT.md)
- [API Integration](./05-API-INTEGRATION.md)

