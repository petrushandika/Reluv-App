# Styling

## 🎨 Overview

Reluv Frontend menggunakan Tailwind CSS 4.x untuk styling. Tailwind adalah utility-first CSS framework yang memungkinkan rapid UI development.

## 🎯 Tailwind CSS

### Configuration

**Location:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
    },
  },
  plugins: [],
};

export default config;
```

### Basic Usage

```typescript
<div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
  Content
</div>
```

## 🌙 Dark Mode

### Theme Toggle

**Location:** `shared/components/organisms/ThemeToggle.tsx`

```typescript
import { useThemeStore } from '@/shared/store/theme.store';

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
```

### Using Dark Mode Classes

```typescript
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  border-gray-200 dark:border-gray-700
">
  Content
</div>
```

## 📱 Responsive Design

### Breakpoints

Tailwind default breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach

```typescript
<div className="
  flex flex-col          // Mobile: column
  md:flex-row            // Tablet+: row
  lg:grid lg:grid-cols-3 // Desktop: grid
">
  Content
</div>
```

### Responsive Utilities

```typescript
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop Only</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile Only</div>

// Responsive text size
<h1 className="text-2xl md:text-4xl lg:text-6xl">Title</h1>
```

## 🎨 Custom Styles

### Global Styles

**Location:** `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white dark:bg-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
  }
}
```

### Custom Utilities

```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

## 🧩 Component Styling Patterns

### Conditional Classes

```typescript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function Button({ variant, className, ...props }) {
  return (
    <button
      className={twMerge(
        clsx(
          'px-4 py-2 rounded',
          {
            'bg-blue-600 text-white': variant === 'primary',
            'bg-gray-200 text-gray-900': variant === 'secondary',
          },
          className
        )
      )}
      {...props}
    />
  );
}
```

### Style Variants

```typescript
const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

function Button({ variant = 'primary', ...props }) {
  return (
    <button
      className={clsx('px-4 py-2 rounded', buttonVariants[variant])}
      {...props}
    />
  );
}
```

## 🎭 Animations

### Using Framer Motion

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Tailwind Transitions

```typescript
<div className="
  transition-all duration-300
  hover:scale-105 hover:shadow-lg
">
  Hover me
</div>
```

## 🎯 Styling Best Practices

### 1. Utility Classes
- Prefer utility classes over custom CSS
- Use `@apply` untuk repeated patterns
- Keep components focused

### 2. Responsive Design
- Mobile-first approach
- Test di berbagai screen sizes
- Use responsive utilities

### 3. Dark Mode
- Always consider dark mode
- Test both themes
- Use semantic color names

### 4. Performance
- Purge unused styles (automatic dengan Tailwind)
- Minimize custom CSS
- Use CSS variables untuk theming

## 📚 Related Documentation

- [Components](./03-COMPONENTS.md)
- [Architecture](./02-ARCHITECTURE.md)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

