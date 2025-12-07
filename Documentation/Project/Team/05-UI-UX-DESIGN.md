# UI/UX Design Document
## Reluv App - E-Commerce Platform untuk Preloved Fashion

---

## 1. PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen ini menjelaskan desain UI/UX untuk platform Reluv App, termasuk design guidelines, user flows, dan component library.

### 1.2 UI/UX Designer

**Designer**: Farhan Fathurrahman

Tanggung jawab:
- UI/UX design dan mockups
- Design system dan component library
- User flow dan wireframes
- Design review dan approval

### 1.3 Design Principles

- **User-Centered**: Fokus pada kebutuhan dan pengalaman pengguna
- **Simplicity**: Interface yang sederhana dan mudah dipahami
- **Consistency**: Konsistensi dalam design patterns dan components
- **Accessibility**: Dapat diakses oleh semua pengguna
- **Responsive**: Optimal di berbagai device

---

## 2. DESIGN SYSTEM

### 2.1 Color Palette

#### Primary Colors

- **Primary**: `#2563EB` (Blue) - Untuk CTA buttons dan links
- **Secondary**: `#10B981` (Green) - Untuk success states
- **Accent**: `#F59E0B` (Orange) - Untuk highlights dan badges

#### Neutral Colors

- **Background**: `#FFFFFF` (White) - Background utama
- **Surface**: `#F9FAFB` (Light Gray) - Background cards
- **Text Primary**: `#111827` (Dark Gray) - Text utama
- **Text Secondary**: `#6B7280` (Medium Gray) - Text sekunder
- **Border**: `#E5E7EB` (Light Gray) - Borders

### 2.2 Typography

#### Font Family

- **Primary**: Inter (Sans-serif)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto

#### Font Sizes

- **Heading 1**: 32px / 2rem
- **Heading 2**: 24px / 1.5rem
- **Heading 3**: 20px / 1.25rem
- **Body**: 16px / 1rem
- **Small**: 14px / 0.875rem
- **Caption**: 12px / 0.75rem

#### Font Weights

- **Bold**: 700
- **Semibold**: 600
- **Medium**: 500
- **Regular**: 400

### 2.3 Spacing

Menggunakan 4px base unit:

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### 2.4 Border Radius

- **sm**: 4px
- **md**: 8px
- **lg**: 12px
- **xl**: 16px
- **full**: 9999px (circle)

### 2.5 Shadows

- **sm**: `0 1px 2px rgba(0, 0, 0, 0.05)`
- **md**: `0 4px 6px rgba(0, 0, 0, 0.1)`
- **lg**: `0 10px 15px rgba(0, 0, 0, 0.1)`
- **xl**: `0 20px 25px rgba(0, 0, 0, 0.1)`

---

## 3. COMPONENT LIBRARY

### 3.1 Buttons

#### Primary Button

```tsx
<Button variant="primary" size="md">
  Add to Cart
</Button>
```

- Background: Primary color
- Text: White
- Hover: Darker shade
- Active: Pressed state

#### Secondary Button

```tsx
<Button variant="secondary" size="md">
  Cancel
</Button>
```

- Background: Transparent
- Border: Primary color
- Text: Primary color

#### Button Sizes

- **sm**: Height 32px
- **md**: Height 40px
- **lg**: Height 48px

### 3.2 Input Fields

#### Text Input

```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
/>
```

- Border: Light gray
- Focus: Primary color border
- Error: Red border + error message

### 3.3 Cards

#### Product Card

```tsx
<ProductCard
  image={product.image}
  title={product.name}
  price={product.price}
  rating={product.rating}
  store={product.store}
/>
```

- Image: Aspect ratio 1:1
- Hover: Shadow elevation
- Clickable: Cursor pointer

### 3.4 Navigation

#### Header Navigation

- Logo (left)
- Search bar (center)
- User menu (right)
- Cart icon with badge

#### Footer Navigation

- Links organized by category
- Social media links
- Copyright information

---

## 4. USER FLOWS

### 4.1 User Registration Flow

```
Landing Page
    ↓
Click "Sign Up"
    ↓
Registration Form
    ↓
Email Verification
    ↓
Login Page
    ↓
Dashboard
```

### 4.2 Product Purchase Flow

```
Product Listing
    ↓
Product Detail
    ↓
Add to Cart
    ↓
Shopping Cart
    ↓
Checkout
    ↓
Payment
    ↓
Order Confirmation
```

### 4.3 Seller Product Listing Flow

```
Dashboard
    ↓
"My Products"
    ↓
"Add Product"
    ↓
Product Form
    ↓
Upload Images
    ↓
Save Product
    ↓
Product Published
```

---

## 5. RESPONSIVE DESIGN

### 5.1 Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### 5.2 Mobile Design

- Single column layout
- Bottom navigation
- Hamburger menu
- Touch-friendly buttons (min 44x44px)

### 5.3 Tablet Design

- Two column layout untuk product grid
- Sidebar navigation
- Optimized spacing

### 5.4 Desktop Design

- Multi-column layout
- Full navigation bar
- Hover states
- Keyboard navigation

---

## 6. ACCESSIBILITY

### 6.1 WCAG Compliance

- **Level AA** compliance target
- Color contrast ratio minimum 4.5:1
- Keyboard navigation support
- Screen reader compatibility

### 6.2 Accessibility Features

- Alt text untuk images
- ARIA labels untuk interactive elements
- Focus indicators
- Skip navigation links

---

## 7. DESIGN MOCKUPS

### 7.1 Key Pages

1. **Landing Page**: Hero section, featured products, categories
2. **Product Listing**: Grid layout, filters, sorting
3. **Product Detail**: Images, description, reviews, add to cart
4. **Shopping Cart**: Item list, quantity, checkout button
5. **Checkout**: Address, payment, shipping, order summary
6. **Dashboard**: Overview, orders, products, analytics

---

**Dokumen ini dibuat pada**: 01/01/2025  
**Versi**: 1.0  
**Status**: Final - UI/UX Design Document

