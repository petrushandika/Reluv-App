# Design System - Konsistensi UI/UX

## 📐 Standar Konsistensi

### 1. Typography

#### Heading Styles
- **H1 (Page Title)**: `text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold`
- **H2 (Section Title)**: `text-lg sm:text-xl md:text-2xl font-bold`
- **H3 (Subsection Title)**: `text-base sm:text-lg md:text-xl font-semibold`
- **H4 (Card Title)**: `text-sm sm:text-base md:text-lg font-semibold`

#### Body Text
- **Body (Default)**: `text-xs sm:text-sm md:text-base`
- **Small Text**: `text-xs sm:text-sm`
- **Caption**: `text-xs`

#### Text Colors
- **Primary Text**: `text-gray-900 dark:text-white`
- **Secondary Text**: `text-gray-600 dark:text-gray-400`
- **Muted Text**: `text-gray-500 dark:text-gray-500`
- **Link Text**: `text-sky-600 dark:text-sky-400`

### 2. Colors

#### Primary Colors
- **Sky (Primary)**: `sky-600 dark:sky-500`
- **Sky Hover**: `sky-700 dark:sky-600`
- **Sky Light**: `sky-50 dark:sky-900/20`

#### Background Colors
- **Page Background**: `bg-white dark:bg-gray-900`
- **Card/Surface**: `bg-white dark:bg-gray-800`
- **Card with Blur**: `bg-white/90 dark:bg-gray-800/90 backdrop-blur-md`

#### Border Colors
- **Default Border**: `border-gray-200 dark:border-gray-700`
- **Light Border**: `border-gray-200/50 dark:border-gray-700/50`

### 3. Spacing

#### Container Padding
- **Standard**: `px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40`
- **Section Padding**: `py-8 sm:py-10 md:py-12 lg:py-14`

#### Element Spacing
- **Gap**: `gap-2 sm:gap-3 md:gap-4`
- **Padding**: `p-3 sm:p-4 md:p-6`
- **Margin**: `mb-4 sm:mb-6 md:mb-8`

### 4. Buttons

#### Primary Button
```tsx
className="text-xs sm:text-sm md:text-base 
  py-2.5 sm:py-3 md:py-4 
  px-3 sm:px-4 md:px-6 
  bg-sky-600 dark:bg-sky-500 
  hover:bg-sky-700 dark:hover:bg-sky-600 
  text-white 
  font-semibold 
  rounded-lg 
  transition-all 
  cursor-pointer"
```

#### Secondary Button
```tsx
className="text-xs sm:text-sm 
  py-2 sm:py-2.5 
  px-2.5 sm:px-3 
  border border-gray-300 dark:border-gray-600 
  bg-transparent 
  hover:bg-gray-50 dark:hover:bg-gray-700 
  text-gray-700 dark:text-gray-300 
  font-medium 
  rounded-lg 
  transition-colors 
  cursor-pointer"
```

#### Outline Button
```tsx
className="text-xs sm:text-sm md:text-base 
  py-2.5 sm:py-3 md:py-4 
  px-3 sm:px-4 md:px-6 
  border-2 border-sky-600 dark:border-sky-500 
  bg-transparent 
  hover:bg-sky-50 dark:hover:bg-sky-900/20 
  text-sky-600 dark:text-sky-400 
  font-semibold 
  rounded-lg 
  transition-all 
  cursor-pointer"
```

### 5. Icons

#### Icon Sizes
- **Small**: `w-3.5 h-3.5 sm:w-4 sm:h-4`
- **Medium**: `w-4 h-4 sm:w-5 sm:h-5`
- **Large**: `w-5 h-5 sm:w-6 sm:h-6`
- **Extra Large**: `w-6 h-6 sm:w-8 sm:h-8`

#### Icon Colors
- **Default**: `text-gray-600 dark:text-gray-400`
- **Primary**: `text-sky-600 dark:text-sky-400`
- **Accent**: `text-yellow-400 fill-yellow-400` (for stars)

### 6. Cards

#### Card Container
```tsx
className="bg-white dark:bg-gray-800 
  rounded-lg 
  border border-gray-200 dark:border-gray-700 
  shadow-sm 
  p-3 sm:p-4 md:p-6"
```

#### Card with Blur
```tsx
className="bg-white/90 dark:bg-gray-800/90 
  backdrop-blur-md 
  rounded-lg 
  border border-gray-200/50 dark:border-gray-700/50 
  shadow-sm 
  p-3 sm:p-4 md:p-6"
```

### 7. Forms

#### Input Fields
```tsx
className="w-full 
  px-3 sm:px-4 
  py-2 
  text-xs sm:text-sm 
  border border-gray-300 dark:border-gray-600 
  rounded-lg 
  bg-white dark:bg-gray-700 
  text-gray-900 dark:text-white 
  focus:ring-2 focus:ring-sky-500 
  focus:border-sky-500 
  transition-all"
```

#### Labels
```tsx
className="text-xs sm:text-sm 
  font-medium 
  text-gray-700 dark:text-gray-300 
  mb-1 sm:mb-2"
```

### 8. Badges & Tags

#### Badge
```tsx
className="text-xs sm:text-sm 
  font-semibold 
  px-2 sm:px-3 
  py-1 
  rounded-full 
  bg-sky-100 dark:bg-sky-900/30 
  text-sky-700 dark:text-sky-300"
```

### 9. Responsive Breakpoints

- **sm**: 640px (Mobile landscape)
- **md**: 768px (Tablet)
- **lg**: 1024px (Desktop)
- **xl**: 1280px (Large desktop)
- **2xl**: 1536px (Extra large desktop)

### 10. Transitions & Animations

#### Standard Transition
```tsx
className="transition-all duration-200"
```

#### Hover Effects
```tsx
className="hover:bg-gray-50 dark:hover:bg-gray-700 
  transition-colors 
  cursor-pointer"
```

#### Scale on Active
```tsx
className="active:scale-[0.98] 
  transition-transform"
```

## ✅ Checklist Konsistensi

Saat membuat komponen baru atau memperbaiki yang ada, pastikan:

- [ ] Typography mengikuti standar (H1-H4, Body, Small, Caption)
- [ ] Colors menggunakan palette yang konsisten
- [ ] Spacing mengikuti container dan element spacing
- [ ] Buttons menggunakan style yang sesuai (Primary/Secondary/Outline)
- [ ] Icons menggunakan size yang konsisten
- [ ] Cards menggunakan style yang sesuai
- [ ] Forms menggunakan input style yang konsisten
- [ ] Responsive di semua breakpoint (sm, md, lg, xl, 2xl)
- [ ] Dark mode support untuk semua elemen
- [ ] Transitions dan animations konsisten

## 📝 Catatan Penting

1. **Mobile First**: Selalu mulai dengan style mobile, lalu tambahkan breakpoint untuk ukuran lebih besar
2. **Konsistensi Warna**: Gunakan warna dari palette yang sudah ditentukan
3. **Spacing**: Gunakan spacing yang proporsional dan konsisten
4. **Typography**: Pastikan hierarchy jelas dan mudah dibaca
5. **Accessibility**: Pastikan kontras warna cukup untuk readability

