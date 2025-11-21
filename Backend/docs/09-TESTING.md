# Testing

## 🧪 Overview

Panduan untuk testing Reluv Backend menggunakan Jest testing framework.

## 📦 Setup

### Install Dependencies

Testing dependencies sudah termasuk di `package.json`:
- `jest`
- `@nestjs/testing`
- `supertest`

### Test Configuration

Jest configuration ada di `package.json`:

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

## 🧪 Running Tests

### Run All Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:cov
```

### Run E2E Tests

```bash
npm run test:e2e
```

## 📝 Writing Tests

### Unit Tests

#### Service Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];

      jest.spyOn(prisma.product, 'findMany').mockResolvedValue(mockProducts);

      const result = await service.findAll({});

      expect(result).toEqual(mockProducts);
      expect(prisma.product.findMany).toHaveBeenCalled();
    });
  });
});
```

### Integration Tests

#### Controller Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
```

### E2E Tests

#### E2E Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Products (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## 🎯 Test Best Practices

### 1. Test Structure

```
describe('Feature', () => {
  describe('Method', () => {
    it('should do something', () => {
      // Test implementation
    });
  });
});
```

### 2. Test Naming

- Use descriptive test names
- Follow pattern: "should [expected behavior]"
- Example: "should return product by id"

### 3. Arrange-Act-Assert

```typescript
it('should create product', async () => {
  // Arrange
  const createProductDto = {
    name: 'Test Product',
    slug: 'test-product',
    // ...
  };

  // Act
  const result = await service.create(user, createProductDto);

  // Assert
  expect(result).toBeDefined();
  expect(result.name).toBe(createProductDto.name);
});
```

### 4. Mocking

```typescript
// Mock Prisma
jest.spyOn(prisma.product, 'create').mockResolvedValue(mockProduct);

// Mock external services
jest.spyOn(cloudinaryService, 'uploadFile').mockResolvedValue({
  secure_url: 'https://example.com/image.jpg',
  public_id: 'image-id',
});
```

### 5. Test Isolation

- Each test should be independent
- Use `beforeEach` untuk setup
- Use `afterEach` untuk cleanup
- Don't rely on test execution order

## 📊 Coverage

### View Coverage Report

```bash
npm run test:cov
```

Coverage report akan di-generate di folder `coverage/`.

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 🔧 Test Utilities

### Test Database

Untuk integration tests, gunakan test database:

```typescript
const testDatabaseUrl = process.env.TEST_DATABASE_URL || 'postgresql://...';
```

### Test Helpers

Buat helper functions untuk common test scenarios:

```typescript
export async function createTestUser(prisma: PrismaService) {
  return prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'hashedpassword',
      // ...
    },
  });
}
```

## 🚨 Common Issues

### Module Not Found

```bash
# Clear jest cache
npm test -- --clearCache
```

### Database Connection

Pastikan test database URL sudah di-set di environment variables.

### Async Tests

Selalu use `async/await` atau return promises:

```typescript
it('should handle async', async () => {
  const result = await service.method();
  expect(result).toBeDefined();
});
```

## 📚 Related Documentation

- [Getting Started](./01-GETTING-STARTED.md)
- [Architecture](./02-ARCHITECTURE.md)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

