# System Design Document
## Reluv App - E-Commerce Platform untuk Preloved Fashion

---

## 1. PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen ini menjelaskan arsitektur sistem, desain komponen, dan teknologi yang digunakan dalam pengembangan platform Reluv App. Dokumen ini digunakan sebagai acuan teknis untuk development team dalam membangun sistem.

### 1.2 Ruang Lingkup

Dokumen ini mencakup:
- System Architecture
- Technology Stack
- Component Design
- Database Design Overview
- API Design Overview
- Security Design
- Deployment Architecture

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Arsitektur Umum

Reluv App menggunakan arsitektur **3-Tier Architecture** dengan pemisahan yang jelas antara:

1. **Presentation Layer** (Frontend)
   - Next.js 16 dengan React 19
   - Client-side rendering dan server-side rendering
   - Static site generation untuk halaman tertentu

2. **Application Layer** (Backend)
   - NestJS 11 RESTful API
   - Business logic dan processing
   - Authentication dan authorization

3. **Data Layer** (Database)
   - PostgreSQL untuk data persistence
   - Prisma ORM untuk database access
   - Cloudinary untuk file storage

### 2.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│              Next.js Frontend Application                │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     │
┌────────────────────▼────────────────────────────────────┐
│              API GATEWAY / LOAD BALANCER                 │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼────────┐    ┌────────▼────────┐
│   FRONTEND       │    │    BACKEND      │
│   (Vercel)       │    │  (Railway/Render)│
│                  │    │                 │
│  Next.js 16      │    │  NestJS 11      │
│  React 19        │    │  TypeScript      │
└──────────────────┘    └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
            ┌───────▼───┐  ┌─────▼─────┐  ┌──▼──────────┐
            │ PostgreSQL │  │ Cloudinary│  │  Midtrans   │
            │  Database  │  │   Storage  │  │  Payment    │
            └────────────┘  └────────────┘  └────────────┘
```

### 2.3 Architecture Patterns

#### 2.3.1 MVC Pattern (Model-View-Controller)

- **Model**: Database entities dan business logic (Prisma models, Services)
- **View**: React components (Frontend)
- **Controller**: API endpoints (NestJS Controllers)

#### 2.3.2 RESTful API

- Menggunakan REST principles untuk API design
- Stateless communication
- Resource-based URLs

#### 2.3.3 Microservices-Ready

- Arsitektur modular yang dapat dipecah menjadi microservices di masa depan
- Loose coupling antara komponen
- API-first approach

---

## 3. TECHNOLOGY STACK

### 3.1 Frontend Technology

#### 3.1.1 Core Framework

- **Next.js 16**: React framework dengan App Router
  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - API routes untuk serverless functions

- **React 19**: UI library
  - Component-based architecture
  - Hooks untuk state management
  - Virtual DOM untuk performa optimal

- **TypeScript**: Type-safe JavaScript
  - Static type checking
  - Better IDE support
  - Reduced runtime errors

#### 3.1.2 Styling

- **Tailwind CSS 4**: Utility-first CSS framework
  - Rapid UI development
  - Responsive design utilities
  - Custom theme configuration

#### 3.1.3 State Management

- **Zustand**: Lightweight state management
  - Simple API
  - No boilerplate
  - Good performance

#### 3.1.4 Form Handling

- **React Hook Form**: Performant form library
- **Zod**: Schema validation
  - Type-safe validation
  - Runtime type checking

#### 3.1.5 HTTP Client

- **Axios**: Promise-based HTTP client
  - Request/response interceptors
  - Automatic JSON transformation
  - Error handling

### 3.2 Backend Technology

#### 3.2.1 Core Framework

- **NestJS 11**: Progressive Node.js framework
  - Modular architecture
  - Dependency injection
  - Built-in TypeScript support

- **TypeScript**: Type-safe development
- **Node.js 18+**: JavaScript runtime

#### 3.2.2 Database

- **PostgreSQL 14+**: Relational database
  - ACID compliance
  - Advanced features (JSON, Full-text search)
  - Scalability

- **Prisma ORM**: Next-generation ORM
  - Type-safe database client
  - Migration system
  - Query builder

#### 3.2.3 Authentication

- **JWT (JSON Web Token)**: Stateless authentication
  - Access tokens
  - Refresh tokens
  - Token expiration

- **Passport.js**: Authentication middleware
  - OAuth strategies (Google, Facebook)
  - Local strategy (email/password)

#### 3.2.4 File Storage

- **Cloudinary**: Cloud-based image management
  - Image upload
  - Image transformation
  - CDN delivery

### 3.3 Third-Party Integrations

#### 3.3.1 Payment Gateway

- **Midtrans**: Payment processing
  - Multiple payment methods
  - Payment notifications
  - Transaction management

#### 3.3.2 Shipping

- **Biteship**: Shipping integration
  - Real-time shipping cost calculation
  - Multiple courier options
  - Tracking integration

---

## 4. COMPONENT DESIGN

### 4.1 Frontend Components Structure

```
Frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── products/          # Product pages
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── features/         # Feature components
├── lib/                  # Utilities
├── hooks/                # Custom hooks
├── store/                # Zustand stores
└── types/                # TypeScript types
```

### 4.2 Backend Modules Structure

```
Backend/
├── src/
│   ├── auth/             # Authentication module
│   ├── users/            # User management
│   ├── products/         # Product management
│   ├── categories/       # Category management
│   ├── cart/             # Shopping cart
│   ├── orders/           # Order management
│   ├── payments/         # Payment integration
│   ├── shipments/        # Shipping integration
│   ├── reviews/          # Reviews & ratings
│   ├── vouchers/         # Voucher system
│   ├── wishlist/         # Wishlist
│   ├── store/            # Store management
│   ├── locations/        # Address management
│   ├── notifications/     # Notifications
│   ├── upload/           # File upload
│   └── common/           # Shared utilities
```

### 4.3 Key Components

#### 4.3.1 Authentication Module

- **AuthService**: Handle authentication logic
- **AuthController**: Authentication endpoints
- **JwtStrategy**: JWT validation strategy
- **GoogleStrategy**: Google OAuth
- **FacebookStrategy**: Facebook OAuth

#### 4.3.2 Product Module

- **ProductService**: Product business logic
- **ProductController**: Product API endpoints
- **ProductRepository**: Database operations

#### 4.3.3 Order Module

- **OrderService**: Order processing logic
- **OrderController**: Order API endpoints
- **OrderStatus**: Order status management

---

## 5. DATABASE DESIGN OVERVIEW

### 5.1 Database Schema

Database menggunakan PostgreSQL dengan struktur relasional. Prisma digunakan sebagai ORM untuk:
- Type-safe database access
- Migration management
- Query optimization

### 5.2 Key Entities

- **User**: User accounts dan profiles
- **Product**: Product listings
- **Category**: Product categories (hierarchical)
- **Order**: Orders dan transactions
- **Cart**: Shopping cart items
- **Review**: Product reviews dan ratings
- **Address**: User addresses
- **Store**: Seller stores
- **Voucher**: Discount vouchers

### 5.3 Relationships

- User → Products (One-to-Many)
- User → Orders (One-to-Many)
- Product → Category (Many-to-One)
- Product → Reviews (One-to-Many)
- Order → OrderItems (One-to-Many)
- User → Store (One-to-One)

---

## 6. API DESIGN OVERVIEW

### 6.1 API Architecture

Backend menggunakan RESTful API dengan struktur berikut:

- **Base URL**: `https://api.reluv.app` (production)
- **Versioning**: `/api/v1/`
- **Authentication**: JWT Bearer Token
- **Response Format**: JSON

### 6.2 API Endpoints Structure

```
/api/v1/
├── auth/              # Authentication endpoints
├── users/             # User management
├── products/          # Product management
├── categories/        # Category management
├── cart/              # Shopping cart
├── orders/            # Order management
├── payments/          # Payment processing
├── shipments/         # Shipping management
├── reviews/           # Reviews & ratings
├── vouchers/          # Voucher system
├── wishlist/          # Wishlist
├── store/             # Store management
└── upload/            # File upload
```

### 6.3 API Response Format

Semua API responses mengikuti format standar:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { ... }
  }
}
```

---

## 7. SECURITY DESIGN

### 7.1 Authentication & Authorization

#### 7.1.1 JWT Authentication

- **Access Token**: Short-lived (24 hours)
- **Refresh Token**: Long-lived (7 days)
- Token stored in httpOnly cookies untuk security

#### 7.1.2 Password Security

- Password hashing menggunakan bcrypt
- Minimum password length: 8 characters
- Password complexity requirements

#### 7.1.3 OAuth Integration

- Google OAuth 2.0
- Facebook OAuth 2.0
- Secure token exchange

### 7.2 Data Protection

#### 7.2.1 Encryption

- HTTPS untuk semua komunikasi
- Sensitive data encryption at rest
- Environment variables untuk secrets

#### 7.2.2 Input Validation

- Input sanitization
- SQL injection prevention
- XSS prevention
- CSRF protection

### 7.3 API Security

- Rate limiting
- CORS configuration
- Request validation
- Error message sanitization

---

## 8. DEPLOYMENT ARCHITECTURE

### 8.1 Frontend Deployment

**Platform**: Vercel

- Automatic deployments dari Git
- Edge network untuk CDN
- Serverless functions untuk API routes
- Environment variables management

### 8.2 Backend Deployment

**Platform**: Railway atau Render

- Container-based deployment
- Auto-scaling capabilities
- Database connection pooling
- Health check endpoints

### 8.3 Database

**Platform**: Managed PostgreSQL

- Automated backups
- Point-in-time recovery
- Connection pooling
- Monitoring dan alerts

### 8.4 CI/CD Pipeline

- **GitHub Actions** untuk automation
- Automated testing sebelum deployment
- Staging environment untuk testing
- Production deployment dengan approval

---

## 9. PERFORMANCE OPTIMIZATION

### 9.1 Frontend Optimization

- Code splitting
- Image optimization (Next.js Image component)
- Lazy loading untuk components
- Caching strategies
- Static generation untuk static pages

### 9.2 Backend Optimization

- Database query optimization
- Caching dengan Redis (opsional)
- Connection pooling
- API response compression
- Pagination untuk large datasets

### 9.3 Database Optimization

- Indexing strategy
- Query optimization
- Connection pooling
- Database monitoring

---

## 10. MONITORING AND LOGGING

### 10.1 Application Monitoring

- Error tracking (Sentry atau similar)
- Performance monitoring
- Uptime monitoring
- User analytics

### 10.2 Logging

- Structured logging
- Log levels (error, warn, info, debug)
- Log aggregation
- Error alerting

---

## 11. SCALABILITY CONSIDERATIONS

### 11.1 Horizontal Scaling

- Stateless API design
- Load balancer ready
- Database read replicas (future)

### 11.2 Vertical Scaling

- Resource optimization
- Efficient algorithms
- Database query optimization

---

**Dokumen ini dibuat pada**: 01/01/2025  
**Versi**: 1.0  
**Status**: Final - System Design Document

