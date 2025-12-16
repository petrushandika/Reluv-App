# Architecture

## 🏗 System Architecture

Reluv Backend menggunakan arsitektur modular dengan NestJS framework yang mengikuti prinsip SOLID dan best practices.

## 📁 Project Structure

```
Backend/
├── src/
│   ├── auth/              # Authentication & Authorization
│   ├── products/          # Product Management
│   ├── categories/        # Category Management
│   ├── cart/              # Shopping Cart
│   ├── orders/            # Order Processing
│   ├── payments/          # Payment Integration
│   ├── shipments/         # Shipping Management
│   ├── reviews/           # Reviews & Ratings
│   ├── vouchers/          # Voucher System
│   ├── wishlist/          # Wishlist Feature
│   ├── users/             # User Management
│   ├── store/             # Store Management
│   ├── locations/         # Address Management
│   ├── notifications/     # Notification System
│   ├── uploads/            # File Upload (Cloudinary)
│   ├── maps/              # Maps Integration
│   ├── geocode/           # Geocoding Services
│   ├── shipping-rates/    # Shipping Rate Calculation
│   ├── common/            # Shared Utilities
│   │   ├── decorators/    # Custom Decorators
│   │   ├── filters/       # Exception Filters
│   │   ├── guards/       # Authentication Guards
│   │   ├── interceptors/   # Response Interceptors
│   │   └── interfaces/    # TypeScript Interfaces
│   ├── prisma/            # Prisma Service
│   ├── cloudinary/        # Cloudinary Service
│   ├── email/             # Email Service
│   ├── configs/           # Configuration
│   ├── utils/             # Utility Functions
│   ├── app.module.ts      # Root Module
│   └── main.ts            # Application Entry Point
├── prisma/
│   ├── schema.prisma      # Database Schema
│   ├── seed.ts            # Database Seeder
│   └── data/              # Seed Data
└── test/                  # Test Files
```

## 🎯 Design Patterns

### 1. Module Pattern

Setiap feature adalah module yang independen:

```typescript
@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### 2. Service Pattern

Business logic berada di service layer:

```typescript
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, createProductDto: CreateProductDto) {
    // Business logic here
  }
}
```

### 3. DTO Pattern

Data Transfer Objects untuk validation dan type safety:

```typescript
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;
}
```

### 4. Guard Pattern

Authentication dan authorization menggunakan guards:

```typescript
@UseGuards(JwtAuthGuard, AdminGuard)
@Post()
create() { }
```

## 🔄 Request Flow

```
Client Request
    ↓
Middleware (CORS, Compression, JSON Parser)
    ↓
Guards (Authentication, Authorization)
    ↓
Interceptors (Request Transformation)
    ↓
ValidationPipe (DTO Validation)
    ↓
Controller (Route Handler)
    ↓
Service (Business Logic)
    ↓
Prisma Service (Database Access)
    ↓
Database
    ↓
Response Interceptor (Format Response)
    ↓
Exception Filter (Error Handling)
    ↓
Client Response
```

## 🛡 Security Layers

### 1. Authentication

- JWT tokens
- Passport.js strategies
- Token expiration
- Refresh token (optional)

### 2. Authorization

- Role-based access control (RBAC)
- Admin guards
- Resource ownership checks

### 3. Validation

- Input validation dengan class-validator
- Type safety dengan TypeScript
- SQL injection prevention (Prisma)

### 4. Error Handling

- Global exception filter
- Consistent error responses
- No sensitive data exposure

## 📊 Data Flow

### Create Product Flow

```
1. Client → POST /api/v1/products
2. JwtAuthGuard → Verify token
3. ValidationPipe → Validate CreateProductDto
4. ProductsController.create()
5. ProductsService.create()
6. Prisma → Create product in database
7. TransformInterceptor → Format response
8. Client ← Success response
```

### Error Flow

```
1. Error occurs in Service
2. Throws HttpException
3. HttpExceptionFilter catches
4. Formats error response
5. Client ← Error response
```

## 🔌 Integration Points

### External Services

1. **Cloudinary** - Image upload dan storage
2. **Midtrans** - Payment gateway
3. **Biteship** - Shipping rate calculation
4. **Email Service** - Transactional emails
5. **Google/Facebook** - OAuth authentication

### Internal Services

1. **Prisma** - Database ORM
2. **JWT** - Token generation/verification
3. **Passport** - Authentication strategies

## 📦 Module Dependencies

```
AppModule
├── AuthModule
│   ├── JwtModule
│   ├── PassportModule
│   └── EmailModule
├── ProductsModule
│   ├── PrismaModule
│   └── CloudinaryModule
├── OrdersModule
│   ├── ProductsModule
│   ├── PaymentsModule
│   └── ShipmentsModule
└── ...
```

## 🎨 Best Practices

### 1. Separation of Concerns

- Controllers: Handle HTTP requests/responses
- Services: Business logic
- Repositories: Data access (via Prisma)

### 2. Dependency Injection

- All dependencies injected via constructor
- Easy to test dan maintain

### 3. Type Safety

- TypeScript untuk type checking
- DTOs untuk request/response validation

### 4. Error Handling

- Consistent error responses
- Proper HTTP status codes
- Detailed error messages

### 5. Code Organization

- Feature-based modules
- Shared utilities di common/
- Clear naming conventions

## 🔍 Key Components

### Controllers

- Handle HTTP requests
- Use decorators untuk routing
- Validate input dengan DTOs
- Return responses

### Services

- Contain business logic
- Interact with database via Prisma
- Handle external API calls
- Throw exceptions untuk errors

### Guards

- Protect routes
- Verify authentication
- Check authorization
- Return 401/403 jika tidak authorized

### Interceptors

- Transform responses
- Add metadata
- Handle logging
- Modify request/response

### Filters

- Catch exceptions
- Format error responses
- Log errors
- Return consistent error format

## 📚 Related Documentation

- [Getting Started](./01-GETTING-STARTED.md)
- [API Reference](./03-API-REFERENCE.md)
- [Authentication](./04-AUTHENTICATION.md)
- [Database](./05-DATABASE.md)
