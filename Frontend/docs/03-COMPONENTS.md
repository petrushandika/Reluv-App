# Components

## 📦 Component Library

Reluv Frontend menggunakan Atomic Design pattern untuk component organization.

## 🧩 Component Categories

### Atoms

Basic, indivisible components.

#### Spinner
```typescript
import Spinner from '@/shared/components/atoms/Spinner';

<Spinner />
```

#### Skeleton
```typescript
import Skeleton from '@/shared/components/atoms/Skeleton';

<Skeleton className="h-4 w-full" />
```

### Molecules

Simple combinations of atoms.

#### CategorySelector
```typescript
import CategorySelector from '@/shared/components/molecules/CategorySelector';

<CategorySelector
  value={categoryId}
  onChange={(id) => setCategoryId(id)}
/>
```

**Features:**
- Nested category support
- Search functionality
- Full path display
- Custom styling

#### CustomSelect
```typescript
import CustomSelect from '@/shared/components/molecules/CustomSelect';

<CustomSelect
  options={sizeOptions}
  value={selectedSize}
  onChange={(value) => setSelectedSize(value)}
  placeholder="Select size"
/>
```

**Features:**
- Custom input untuk "OTHER" option
- Search functionality
- Keyboard navigation
- Click outside to close

#### ProductCardSkeleton
```typescript
import ProductCardSkeleton from '@/shared/components/molecules/ProductCardSkeleton';

<ProductCardSkeleton />
```

### Organisms

Complex components combining molecules and atoms.

#### Navbar
```typescript
import Navbar from '@/shared/components/organisms/Navbar';

// Used in layout.tsx
<Navbar />
```

**Features:**
- Multi-level dropdown menus
- Search functionality
- User profile dropdown
- Cart & wishlist indicators
- Responsive mobile menu

#### Footer
```typescript
import Footer from '@/shared/components/organisms/Footer';

<Footer />
```

#### ProductList
```typescript
import ProductList from '@/features/products/components/ProductList';

<ProductList
  title="Trending Now"
  products={products}
  isLoading={isLoading}
/>
```

**Features:**
- Embla carousel integration
- Loading states
- Empty states
- Responsive design

#### Banner
```typescript
import Banner from '@/shared/components/organisms/Banner';

<Banner />
```

### Feature Components

#### ProductCard
```typescript
import ProductCard from '@/features/products/components/ProductCard';

<ProductCard product={product} />
```

**Props:**
- `product`: Product object
- `onAddToCart?`: Callback function
- `onAddToWishlist?`: Callback function

#### CartItem
```typescript
import CartItem from '@/features/cart/components/CartItem';

<CartItem item={cartItem} />
```

#### ReviewCard
```typescript
import ReviewCard from '@/features/reviews/components/ReviewCard';

<ReviewCard review={review} />
```

## 🎨 Component Patterns

### Controlled Components

```typescript
const [value, setValue] = useState('');

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Uncontrolled Components

```typescript
const inputRef = useRef<HTMLInputElement>(null);

<Input ref={inputRef} />
```

### Compound Components

```typescript
<Modal>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

## 🎯 Component Best Practices

### 1. Props Interface

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  onAddToWishlist?: (productId: number) => void;
  className?: string;
}

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  className,
}: ProductCardProps) {
  // Component implementation
}
```

### 2. Default Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

function Button({
  variant = 'primary',
  size = 'md',
  children,
}: ButtonProps) {
  // Implementation
}
```

### 3. Conditional Rendering

```typescript
{isLoading ? (
  <Skeleton />
) : error ? (
  <ErrorMessage error={error} />
) : (
  <ProductList products={products} />
)}
```

### 4. Composition

```typescript
<Card>
  <Card.Header>
    <Card.Title>Product Name</Card.Title>
  </Card.Header>
  <Card.Body>
    <Card.Content>Description</Card.Content>
  </Card.Body>
  <Card.Footer>
    <Card.Actions>
      <Button>Add to Cart</Button>
    </Card.Actions>
  </Card.Footer>
</Card>
```

## 📱 Responsive Design

### Mobile-First Approach

```typescript
<div className="
  flex flex-col
  md:flex-row
  lg:grid lg:grid-cols-3
">
  {/* Content */}
</div>
```

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🌙 Dark Mode

Components support dark mode via Tailwind:

```typescript
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
">
  {/* Content */}
</div>
```

## ♿ Accessibility

### Semantic HTML

```typescript
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/">Home</a></li>
  </ul>
</nav>
```

### ARIA Labels

```typescript
<button
  aria-label="Add to cart"
  aria-describedby="cart-description"
>
  Add to Cart
</button>
```

### Keyboard Navigation

```typescript
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Clickable div
</div>
```

## 📚 Related Documentation

- [Architecture](./02-ARCHITECTURE.md)
- [Styling](./07-STYLING.md)
- [State Management](./04-STATE-MANAGEMENT.md)

