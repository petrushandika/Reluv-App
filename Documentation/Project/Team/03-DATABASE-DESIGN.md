# Database Design Document
## Reluv App - E-Commerce Platform untuk Preloved Fashion

---

## 1. PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen ini menjelaskan desain database untuk platform Reluv App, termasuk ERD, table specifications, dan relationships.

### 1.2 Database Technology

- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Migration**: Prisma Migrate

---

## 2. ENTITY RELATIONSHIP DIAGRAM (ERD)

### 2.1 Core Entities

```
User ──┬── Store (1:1)
       ├── Address (1:N)
       ├── Order (1:N)
       ├── Cart (1:1)
       ├── Wishlist (1:N)
       └── Review (1:N)

Store ──┬── Product (1:N)
        └── Voucher (1:N)

Product ──┬── Category (N:1)
          ├── ProductVariant (1:N)
          ├── ProductImage (1:N)
          ├── Review (1:N)
          └── CartItem (1:N)

Category ──┴── Category (Self-referential, N:1)

Order ──┬── OrderItem (1:N)
        ├── Payment (1:1)
        └── Shipment (1:1)
```

---

## 3. TABLE SPECIFICATIONS

### 3.1 User Table

**Table Name**: `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | User ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| password | VARCHAR(255) | NULL | Hashed password (null for OAuth) |
| firstName | VARCHAR(100) | NOT NULL | First name |
| lastName | VARCHAR(100) | NOT NULL | Last name |
| phone | VARCHAR(20) | NULL | Phone number |
| avatar | VARCHAR(500) | NULL | Avatar URL |
| emailVerified | BOOLEAN | DEFAULT false | Email verification status |
| role | ENUM | DEFAULT 'USER' | User role (USER, ADMIN) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Update timestamp |

**Indexes**:
- `idx_users_email` on `email`
- `idx_users_role` on `role`

### 3.2 Product Table

**Table Name**: `products`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Product ID |
| name | VARCHAR(255) | NOT NULL | Product name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly slug |
| description | TEXT | NULL | Product description |
| price | DECIMAL(10,2) | NOT NULL | Base price |
| categoryId | UUID | FOREIGN KEY | Category ID |
| storeId | UUID | FOREIGN KEY | Store ID |
| status | ENUM | DEFAULT 'DRAFT' | Status (DRAFT, PUBLISHED, SOLD) |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Update timestamp |

**Indexes**:
- `idx_products_slug` on `slug`
- `idx_products_category` on `categoryId`
- `idx_products_store` on `storeId`
- `idx_products_status` on `status`

### 3.3 Category Table

**Table Name**: `categories`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Category ID |
| name | VARCHAR(100) | NOT NULL | Category name |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly slug |
| parentId | UUID | FOREIGN KEY, NULL | Parent category ID |
| image | VARCHAR(500) | NULL | Category image URL |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Update timestamp |

**Indexes**:
- `idx_categories_slug` on `slug`
- `idx_categories_parent` on `parentId`

### 3.4 Order Table

**Table Name**: `orders`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Order ID |
| orderNumber | VARCHAR(50) | UNIQUE, NOT NULL | Order number |
| userId | UUID | FOREIGN KEY | User ID |
| status | ENUM | DEFAULT 'PENDING' | Order status |
| subtotal | DECIMAL(10,2) | NOT NULL | Subtotal amount |
| shippingCost | DECIMAL(10,2) | NOT NULL | Shipping cost |
| discount | DECIMAL(10,2) | DEFAULT 0 | Discount amount |
| total | DECIMAL(10,2) | NOT NULL | Total amount |
| shippingAddressId | UUID | FOREIGN KEY | Shipping address ID |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Update timestamp |

**Indexes**:
- `idx_orders_user` on `userId`
- `idx_orders_number` on `orderNumber`
- `idx_orders_status` on `status`

### 3.5 Cart Table

**Table Name**: `carts`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Cart ID |
| userId | UUID | FOREIGN KEY, UNIQUE | User ID |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Update timestamp |

### 3.6 CartItem Table

**Table Name**: `cart_items`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Cart item ID |
| cartId | UUID | FOREIGN KEY | Cart ID |
| productId | UUID | FOREIGN KEY | Product ID |
| variantId | UUID | FOREIGN KEY, NULL | Product variant ID |
| quantity | INTEGER | NOT NULL | Quantity |
| createdAt | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | DEFAULT NOW() | Update timestamp |

**Indexes**:
- `idx_cart_items_cart` on `cartId`
- `idx_cart_items_product` on `productId`

---

## 4. RELATIONSHIPS

### 4.1 One-to-Many Relationships

- **User → Orders**: Satu user dapat memiliki banyak orders
- **User → Addresses**: Satu user dapat memiliki banyak addresses
- **Store → Products**: Satu store dapat memiliki banyak products
- **Category → Products**: Satu category dapat memiliki banyak products
- **Product → Reviews**: Satu product dapat memiliki banyak reviews
- **Order → OrderItems**: Satu order dapat memiliki banyak order items

### 4.2 One-to-One Relationships

- **User → Store**: Satu user dapat memiliki satu store
- **User → Cart**: Satu user memiliki satu cart
- **Order → Payment**: Satu order memiliki satu payment record

### 4.3 Many-to-Many Relationships

- **User → Products (Wishlist)**: User dapat memiliki banyak products di wishlist
- **Product → Categories**: Product dapat memiliki multiple categories (future)

---

## 5. INDEXING STRATEGY

### 5.1 Primary Indexes

- Primary keys (automatic)

### 5.2 Foreign Key Indexes

- All foreign keys untuk join performance

### 5.3 Search Indexes

- Product name, slug
- Category slug
- User email
- Order number

### 5.4 Composite Indexes

- `(categoryId, status)` pada products untuk filtered queries
- `(userId, status)` pada orders untuk user order queries

---

## 6. DATA INTEGRITY

### 6.1 Constraints

- **NOT NULL**: Required fields
- **UNIQUE**: Email, slug, order number
- **FOREIGN KEY**: Referential integrity
- **CHECK**: Valid enum values, positive numbers

### 6.2 Cascading Rules

- **ON DELETE CASCADE**: Cart items, order items
- **ON DELETE SET NULL**: Products jika category dihapus
- **ON DELETE RESTRICT**: Orders jika user dihapus

---

## 7. MIGRATION STRATEGY

### 7.1 Prisma Migrate

- Version-controlled migrations
- Rollback capability
- Seed data untuk development

### 7.2 Migration Naming

Format: `YYYYMMDDHHMMSS_description`

Example: `20250101120000_create_users_table`

---

**Dokumen ini dibuat pada**: 01/01/2025  
**Versi**: 1.0  
**Status**: Final - Database Design Document

