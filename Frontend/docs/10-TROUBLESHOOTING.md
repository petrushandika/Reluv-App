# Troubleshooting

## 🔧 Common Issues and Solutions

### Build Issues

#### Module Not Found

**Error:**
```
Module not found: Can't resolve '@/...'
```

**Solutions:**
1. Check `tsconfig.json` paths:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. Restart development server
3. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

#### Type Errors

**Error:**
```
Type error: Property does not exist
```

**Solutions:**
1. Check TypeScript configuration
2. Verify type definitions
3. Run type check:
   ```bash
   npx tsc --noEmit
   ```

### Runtime Issues

#### Hydration Errors

**Error:**
```
Hydration failed because the initial UI does not match
```

**Solutions:**
1. Check for client/server mismatch
2. Use `suppressHydrationWarning` jika diperlukan
3. Ensure consistent rendering

#### API Connection Errors

**Error:**
```
Network Error
CORS Error
```

**Solutions:**
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check backend CORS settings
3. Verify backend is running
4. Check network connectivity

### State Management Issues

#### Store Not Updating

**Solutions:**
1. Check store actions are called correctly
2. Verify store subscriptions
3. Check for state mutations (should be immutable)
4. Use Zustand devtools untuk debugging

#### Hydration Mismatch

**Solutions:**
1. Use `useEffect` untuk client-only state
2. Check localStorage access (client-only)
3. Use `isHydrated` flag

### Component Issues

#### Styling Not Applied

**Solutions:**
1. Check Tailwind classes are correct
2. Verify `tailwind.config.ts` content paths
3. Check for CSS conflicts
4. Restart dev server

#### Images Not Loading

**Solutions:**
1. Check image paths
2. Verify Next.js Image component usage
3. Check image domain di `next.config.js`
4. Verify image files exist

### Performance Issues

#### Slow Page Load

**Solutions:**
1. Check bundle size
2. Optimize images
3. Implement code splitting
4. Use dynamic imports
5. Check API response times

#### Memory Leaks

**Solutions:**
1. Cleanup event listeners
2. Cancel API requests on unmount
3. Clear intervals/timeouts
4. Use React DevTools Profiler

## 🐛 Debugging Tips

### Browser DevTools

1. **Console**: Check for errors
2. **Network**: Monitor API calls
3. **React DevTools**: Inspect components
4. **Performance**: Profile rendering

### Next.js Debugging

```bash
# Enable debug mode
DEBUG=* npm run dev

# Check build output
npm run build
```

### Zustand DevTools

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools((set) => ({
    // Store implementation
  }))
);
```

## 🔍 Common Patterns

### Check Authentication

```typescript
const { isAuthenticated, isHydrated } = useAuthStore();

if (!isHydrated) {
  return <Loading />;
}

if (!isAuthenticated) {
  return <LoginPrompt />;
}
```

### Handle Loading States

```typescript
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getData();
      setData(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);
```

### Error Boundaries

```typescript
'use client';

import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <MyComponent />
</ErrorBoundary>
```

## 📞 Getting Help

### Check Documentation

1. [Getting Started](./01-GETTING-STARTED.md)
2. [Architecture](./02-ARCHITECTURE.md)
3. [Components](./03-COMPONENTS.md)

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### Create Issue

Jika masalah belum teratasi:
1. Check existing issues
2. Create new issue dengan:
   - Error message
   - Steps to reproduce
   - Environment details
   - Screenshots/logs

## 📚 Related Documentation

- [Getting Started](./01-GETTING-STARTED.md)
- [Deployment](./09-DEPLOYMENT.md)
- [API Integration](./05-API-INTEGRATION.md)

