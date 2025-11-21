# State Management

## 🔄 Overview

Reluv Frontend menggunakan **Zustand** untuk global state management. Zustand adalah library yang lightweight, simple, dan powerful untuk state management di React.

## 📦 Stores

### Auth Store

**Location:** `features/auth/store/auth.store.ts`

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  hydrate: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
  // ... actions
}));
```

**Usage:**
```typescript
import { useAuthStore } from '@/features/auth/store/auth.store';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.firstName}!</p>
      ) : (
        <button onClick={() => login(email, password)}>Login</button>
      )}
    </div>
  );
}
```

### Cart Store

**Location:** `features/cart/store/cart.store.ts`

```typescript
interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemCount: 0,
  total: 0,
  // ... actions
}));
```

**Usage:**
```typescript
import { useCartStore } from '@/features/cart/store/cart.store';

function CartButton() {
  const { itemCount, addItem } = useCartStore();
  
  return (
    <button onClick={() => addItem(productId, 1)}>
      Add to Cart ({itemCount})
    </button>
  );
}
```

### Wishlist Store

**Location:** `features/wishlist/store/wishlist.store.ts`

```typescript
interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  fetchWishlist: () => Promise<void>;
}
```

### Theme Store

**Location:** `shared/store/theme.store.ts`

```typescript
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
```

## 🎯 Store Patterns

### 1. Basic Store

```typescript
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

### 2. Async Actions

```typescript
const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const products = await getProducts();
      set({ products, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
```

### 3. Persistence

```typescript
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      // ... other state
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
```

### 4. Selectors

```typescript
// Select specific state
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// Select multiple
const { user, isAuthenticated } = useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
}));
```

## 🔄 State Flow

### Update Flow

```
User Action
    ↓
Component Event Handler
    ↓
Store Action
    ↓
API Call (if needed)
    ↓
Update Store State
    ↓
Components Re-render
```

### Example: Add to Cart

```typescript
// Component
function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  
  const handleAddToCart = async () => {
    await addItem(product.id, 1);
    toast.success('Added to cart');
  };
  
  return <button onClick={handleAddToCart}>Add to Cart</button>;
}

// Store
const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: async (productId, quantity) => {
    // API call
    await addToCart({ productId, quantity });
    
    // Update state
    const newItem = { productId, quantity, /* ... */ };
    set((state) => ({
      items: [...state.items, newItem],
      itemCount: state.itemCount + quantity,
    }));
  },
}));
```

## 🎨 Best Practices

### 1. Store Organization

- One store per feature
- Keep stores focused
- Share common stores di `shared/store/`

### 2. State Structure

- Keep state flat when possible
- Use selectors untuk derived state
- Avoid nested state updates

### 3. Actions

- Keep actions pure when possible
- Handle errors in actions
- Return promises untuk async operations

### 4. Performance

- Use selectors untuk prevent unnecessary re-renders
- Memoize expensive computations
- Split large stores into smaller ones

## 📚 Related Documentation

- [Architecture](./02-ARCHITECTURE.md)
- [API Integration](./05-API-INTEGRATION.md)
- [Components](./03-COMPONENTS.md)

