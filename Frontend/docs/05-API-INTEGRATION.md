# API Integration

## 🌐 Overview

Frontend menggunakan Axios untuk komunikasi dengan backend API. Semua API calls dikonfigurasi dengan base URL, interceptors, dan error handling.

## 🔧 Axios Configuration

### Base Configuration

**Location:** `shared/lib/axios.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or from Zustand store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export { api };
```

## 📡 API Structure

### Feature-Based API

Setiap feature memiliki API layer di `features/{feature}/api/`:

#### Products API

**Location:** `features/products/api/productsApi.ts`

```typescript
import { api } from '@/shared/lib/axios';
import { Product, QueryProductParams } from '../types';

export const getProducts = async (
  params?: QueryProductParams
): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products', { params });
  return response.data.data; // Extract data from response wrapper
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data.data;
};
```

#### Auth API

**Location:** `features/auth/api/authApi.ts`

```typescript
import { api } from '@/shared/lib/axios';
import { LoginData, RegisterData, AuthResponse } from '../types';

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data.data;
};
```

## 🎯 Usage Patterns

### In Components

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/features/products/api/productsApi';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) return <Spinner />;
  
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### In Custom Hooks

```typescript
// features/products/hooks/useProduct.ts
import { useState, useEffect } from 'react';
import { getProducts } from '../api/productsApi';
import { Product } from '../types';

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
};
```

### In Stores

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

## 🔄 Response Handling

### Success Response

Backend mengembalikan response dengan format:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": { ... }
}
```

Extract data:
```typescript
const response = await api.get('/products');
const products = response.data.data; // Extract data field
```

### Error Handling

```typescript
try {
  const products = await getProducts();
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const message = error.response.data.message;
      
      if (status === 401) {
        // Unauthorized - redirect to login
        router.push('/auth/login');
      } else if (status === 404) {
        // Not found
        toast.error('Resource not found');
      } else {
        // Other errors
        toast.error(message || 'An error occurred');
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      // Error setting up request
      toast.error('An unexpected error occurred');
    }
  }
}
```

## 🔐 Authentication

### Token Management

Token disimpan di Zustand store dan localStorage:

```typescript
// Login
const { login } = useAuthStore();
await login(email, password);
// Token automatically saved to store and localStorage

// API calls automatically include token via interceptor
const products = await getProducts(); // Token injected automatically
```

### Token Refresh

Jika diperlukan token refresh:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        router.push('/auth/login');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

## 📊 Data Fetching Patterns

### Server Components (Next.js 13+)

```typescript
// app/products/page.tsx
import { getProducts } from '@/features/products/api/productsApi';

export default async function ProductsPage() {
  const products = await getProducts(); // Server-side fetch
  
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Client Components

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/features/products/api/productsApi';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);
  
  // Render products
}
```

## 🎯 Best Practices

### 1. Error Handling
- Always handle errors
- Show user-friendly messages
- Log errors untuk debugging

### 2. Loading States
- Show loading indicators
- Use skeletons untuk better UX
- Handle empty states

### 3. Caching
- Cache API responses when appropriate
- Use React Query atau SWR jika diperlukan
- Invalidate cache on mutations

### 4. Type Safety
- Define TypeScript interfaces untuk responses
- Use type guards untuk runtime validation
- Leverage TypeScript untuk compile-time checks

## 📚 Related Documentation

- [State Management](./04-STATE-MANAGEMENT.md)
- [Components](./03-COMPONENTS.md)
- [Backend API Documentation](../../Backend/docs/03-API-REFERENCE.md)

