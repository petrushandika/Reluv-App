# Frontend Documentation

Complete documentation for the Reluv App frontend.

## 📚 Table of Contents

1. [Getting Started](./01-GETTING-STARTED.md)

   - Installation
   - Development setup
   - Environment variables
   - Running the app

2. [Architecture](./02-ARCHITECTURE.md)

   - Project structure
   - Route groups
   - Separation of concerns
   - Import rules
   - Data flow

3. [Components](./03-COMPONENTS.md)

   - Component organization
   - Layout components
   - Feature components
   - Shared components
   - Best practices

4. [State Management](./04-STATE-MANAGEMENT.md)

   - Zustand stores
   - Global state
   - Local state
   - State patterns

5. [API Integration](./05-API-INTEGRATION.md)

   - API client setup
   - Feature APIs
   - Error handling
   - Authentication

6. [Routing](./06-ROUTING.md)

   - Route groups
   - Dynamic routes
   - Navigation
   - Route protection
   - Layouts

7. [Styling](./07-STYLING.md)

   - Tailwind CSS
   - Dark mode
   - Responsive design
   - Animations

8. [Forms & Validation](./08-FORMS-VALIDATION.md)

   - Form handling
   - Zod validation
   - Error messages
   - Form patterns

9. [Deployment](./09-DEPLOYMENT.md)

   - Build process
   - Environment setup
   - Deployment platforms
   - Production optimization

10. [Troubleshooting](./10-TROUBLESHOOTING.md)
    - Common issues
    - Debug tips
    - Performance optimization
    - FAQ

## 🎯 Quick Reference

### Project Structure

```
Frontend/src/
├── app/                    # Pages & Layouts
│   ├── (main)/            # Public pages (Navbar + Footer)
│   ├── (auth)/            # Auth pages (minimal layout)
│   └── (admin)/           # Admin pages
│
├── features/              # Business Logic
│   ├── (main)/           # Public features
│   ├── (auth)/           # Authentication
│   └── (admin)/          # Admin features
│
├── shared/               # Shared Resources
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── types/
│
└── context/              # React contexts
```

### Import Patterns

```typescript
// From app pages
import { Component } from "@/features/(main)/feature/components/Component";
import Navbar from "@/shared/components/layout/Navbar";

// From features
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { api } from "@/shared/lib/axios";

// From shared
import { cn } from "@/shared/lib/utils";
```

### Route Groups

- **(main)**: Public pages with Navbar + Footer
- **(auth)**: Authentication pages (minimal layout)
- **(admin)**: Admin/seller pages

### Key Commands

```bash
# Development
npm run dev

# Type check
npx tsc --noEmit

# Build
npm run build

# Production
npm start
```

## 🔑 Key Concepts

### 1. Separation of Concerns

- **app/**: ONLY pages and layouts
- **features/**: Business logic and components
- **shared/**: Reusable code

### 2. Feature Organization

Each feature has:

- `api/` - API calls
- `components/` - Feature components
- `hooks/` - Feature hooks
- `store/` - State management
- `types/` - TypeScript types

### 3. Layout Hierarchy

```
Root Layout
├── Main Layout (Navbar + Footer)
├── Auth Layout (Minimal)
└── Admin Layout (Sidebar)
```

## 📖 Documentation Guidelines

When reading the docs:

1. **Start with Getting Started** for setup
2. **Read Architecture** to understand structure
3. **Refer to specific guides** as needed
4. **Check Troubleshooting** for issues

## 🤝 Contributing to Docs

When updating documentation:

1. Keep it concise and clear
2. Include code examples
3. Update all related docs
4. Test code examples
5. Use consistent formatting

## 📝 Documentation Standards

### Code Examples

```typescript
// ✅ Good: Clear, complete example
import { useAuthStore } from "@/features/(auth)/store/auth.store";

export default function Component() {
  const { user, login } = useAuthStore();

  return <div>{user?.name}</div>;
}

// ❌ Bad: Incomplete or unclear
const { user } = useAuthStore();
```

### File Paths

Always use absolute paths from project root:

```
✅ src/app/(main)/home/page.tsx
✅ src/features/(main)/products/api/productsApi.ts
✅ src/shared/components/layout/Navbar.tsx

❌ app/home/page.tsx
❌ features/products/api/productsApi.ts
❌ components/Navbar.tsx
```

### Import Examples

Always show full import paths:

```typescript
✅ import { ProductCard } from '@/features/(main)/products/components/ProductCard';
✅ import Navbar from '@/shared/components/layout/Navbar';

❌ import { ProductCard } from '../products/components/ProductCard';
❌ import Navbar from '../../components/Navbar';
```

## 🔄 Keeping Docs Updated

When making changes to the codebase:

1. **Update relevant docs** immediately
2. **Add new sections** for new features
3. **Remove outdated** information
4. **Test all examples** before committing

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

---

**Happy coding! 🚀**
