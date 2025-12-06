# Forms & Validation

## 📝 Overview

Reluv Frontend menggunakan React Hook Form untuk form handling dan Zod untuk schema validation. Kombinasi ini memberikan type-safe forms dengan excellent performance.

## 🎯 React Hook Form

### Basic Form

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof formSchema>;

export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## ✅ Zod Validation

### Schema Definition

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type LoginData = z.infer<typeof loginSchema>;
```

### Complex Schemas

```typescript
const productSchema = z.object({
  name: z.string().min(1).max(255),
  price: z.number().min(0).max(999999999),
  categoryId: z.number().int().positive(),
  images: z.array(z.string().url()).min(1),
  variants: z.array(
    z.object({
      size: z.string().optional(),
      color: z.string().optional(),
      price: z.number().min(0),
      stock: z.number().int().min(0),
    })
  ).min(1),
});
```

## 📋 Form Examples

### Login Form

**Location:** `features/auth/components/LoginForm.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginData } from '../types';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      await login(data);
      router.push('/');
    } catch (error) {
      toast.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('email')} type="email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      
      <div>
        <input {...register('password')} type="password" />
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Product Listing Form

**Location:** `features/sell/components/ListingForm.tsx`

```typescript
const listingSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(10000),
  price: z.string().regex(/^\d+\.?\d*$/, 'Invalid price format'),
  categoryId: z.number().int().positive(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']),
  // ... more fields
});

const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
} = useForm<ListingData>({
  resolver: zodResolver(listingSchema),
});
```

## 🎨 Form Components

### Custom Input Component

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  register: any;
}

function Input({ label, error, register, ...props }: InputProps) {
  return (
    <div>
      <label>{label}</label>
      <input
        {...register}
        {...props}
        className={clsx(
          'border rounded px-3 py-2',
          error && 'border-red-500'
        )}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
```

### Usage

```typescript
<Input
  label="Email"
  type="email"
  register={register('email')}
  error={errors.email?.message}
/>
```

## 🔄 Form State Management

### Controlled vs Uncontrolled

React Hook Form menggunakan uncontrolled components by default untuk better performance:

```typescript
// Uncontrolled (default) - Better performance
<input {...register('name')} />

// Controlled - When needed
<input
  value={watch('name')}
  onChange={(e) => setValue('name', e.target.value)}
/>
```

### Watch Values

```typescript
const watchedPrice = watch('price');
const allValues = watch(); // Watch all fields

// Conditional rendering based on watched value
{watchedPrice && <div>Price: {watchedPrice}</div>}
```

## ✅ Validation Patterns

### Client-Side Validation

```typescript
const validateForm = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!formData.name.trim()) {
    errors.push('Name is required');
  }
  
  if (formData.price < 0) {
    errors.push('Price must be positive');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

### Server-Side Validation

Backend juga melakukan validation. Handle errors dari API:

```typescript
try {
  await createProduct(data);
} catch (error) {
  if (axios.isAxiosError(error) && error.response?.status === 400) {
    const validationErrors = error.response.data.details;
    // Display validation errors
  }
}
```

## 🎯 Best Practices

### 1. Schema Validation
- Define schemas dengan Zod
- Use TypeScript types dari schemas
- Keep validation rules consistent dengan backend

### 2. Error Handling
- Show errors near fields
- Use clear, user-friendly messages
- Handle both client dan server errors

### 3. Form Performance
- Use uncontrolled components when possible
- Debounce expensive validations
- Avoid unnecessary re-renders

### 4. User Experience
- Show loading states
- Disable submit button saat submitting
- Provide clear feedback

## 📚 Related Documentation

- [Components](./03-COMPONENTS.md)
- [API Integration](./05-API-INTEGRATION.md)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

