# Database

## 🗄 Overview

Reluv Backend menggunakan PostgreSQL sebagai database dan Prisma sebagai ORM.

## 📊 Database Schema

### Core Models

#### User

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  firstName String?
  lastName  String?
  password  String
  role      UserRole @default(USER)
  // ... relations
}
```

#### Product

```prisma
model Product {
  id               Int      @id @default(autoincrement())
  name             String
  slug             String   @unique
  description      String
  categoryId       Int
  parentCategoryId Int?
  childCategoryId  Int?
  // ... relations
}
```

#### Category

```prisma
model Category {
  id          Int       @id @default(autoincrement())
  name        String
  slug        String    @unique
  parentId    Int?
  // ... relations
}
```

## 🔄 Migrations

### Create Migration

```bash
npx prisma migrate dev --name migration_name
```

### Apply Migrations

```bash
npx prisma migrate deploy
```

### Reset Database

**⚠️ WARNING: Ini akan menghapus semua data!**

```bash
npx prisma migrate reset
```

## 🌱 Seeding

### Seed Database

```bash
npx prisma db seed
```

### Seed Data

Seed data tersimpan di `prisma/data/`:

- `categories.json` - Category hierarchy

## 🔍 Prisma Studio

GUI untuk melihat dan mengedit database:

```bash
npx prisma studio
```

Akan membuka browser di `http://localhost:5555`

## 📝 Using Prisma

### In Service

```typescript
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        variants: true,
      },
    });
  }
}
```

### Common Queries

#### Find Many

```typescript
const products = await this.prisma.product.findMany({
  where: {
    categoryId: 1,
  },
  include: {
    category: true,
  },
});
```

#### Find Unique

```typescript
const product = await this.prisma.product.findUnique({
  where: { id: 1 },
  include: {
    category: true,
    variants: true,
  },
});
```

#### Create

```typescript
const product = await this.prisma.product.create({
  data: {
    name: 'New Product',
    slug: 'new-product',
    categoryId: 1,
  },
});
```

#### Update

```typescript
const product = await this.prisma.product.update({
  where: { id: 1 },
  data: {
    name: 'Updated Product',
  },
});
```

#### Delete

```typescript
await this.prisma.product.delete({
  where: { id: 1 },
});
```

## 🔗 Relations

### One-to-Many

```prisma
model Product {
  categoryId Int
  category   Category @relation(fields: [categoryId], references: [id])
}

model Category {
  products Product[]
}
```

### Many-to-Many

```prisma
model Product {
  wishlists Wishlist[]
}

model User {
  wishlists Wishlist[]
}

model Wishlist {
  productId Int
  userId    Int
  product   Product @relation(fields: [productId], references: [id])
  user      User    @relation(fields: [userId], references: [id])
}
```

## 📊 Indexes

Indexes didefinisikan di schema untuk performance:

```prisma
model Product {
  @@index([categoryId])
  @@index([parentCategoryId])
  @@index([childCategoryId])
}
```

## 🔒 Constraints

### Unique Constraints

```prisma
model User {
  email String @unique
}

model Product {
  slug String @unique
}
```

### Foreign Key Constraints

```prisma
model Product {
  categoryId Int
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)
}
```

## 🛠 Maintenance

### Backup Database

```bash
pg_dump -U username -d reluv_db > backup.sql
```

### Restore Database

```bash
psql -U username -d reluv_db < backup.sql
```

### Check Database Size

```sql
SELECT pg_size_pretty(pg_database_size('reluv_db'));
```

## 📚 Related Documentation

- [Getting Started](./01-getting-started.md)
- [Architecture](./02-architecture.md)
- [Prisma Documentation](https://www.prisma.io/docs)
