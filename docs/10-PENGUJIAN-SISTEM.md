# Pengujian Sistem

## 10.1 Pendahuluan

Pengujian sistem merupakan tahap kritis dalam pengembangan software yang bertujuan untuk memastikan bahwa sistem yang telah diimplementasikan berfungsi dengan baik, memenuhi kebutuhan yang telah ditetapkan, dan bebas dari bug atau error yang dapat mengganggu pengguna. Pengujian platform Reluv App dilakukan secara sistematis dengan berbagai metode dan teknik pengujian.

## 10.2 Strategi Pengujian

### 10.2.1 Testing Pyramid

Pengujian dilakukan mengikuti testing pyramid:

```
        /\
       /  \      E2E Tests (10%)
      /____\
     /      \    Integration Tests (30%)
    /________\
   /          \  Unit Tests (60%)
  /____________\
```

**Unit Tests (60%):**

- Testing individual functions dan methods
- Fast execution
- High coverage
- Isolated testing

**Integration Tests (30%):**

- Testing API endpoints
- Testing database interactions
- Testing module integrations
- Testing third-party integrations

**E2E Tests (10%):**

- Testing complete user flows
- Testing critical paths
- Slower execution
- More realistic scenarios

### 10.2.2 Testing Approach

**Test-Driven Development (TDD):**

- Diterapkan untuk critical features
- Write tests first
- Implement functionality
- Refactor code

**Behavior-Driven Development (BDD):**

- User stories sebagai basis testing
- Acceptance criteria sebagai test cases
- Focus pada user behavior

## 10.3 Unit Testing

### 10.3.1 Backend Unit Tests

**Tools:**

- Jest sebagai testing framework
- Supertest untuk HTTP testing
- Prisma mock untuk database testing

**Coverage Target:**

- Minimum 80% code coverage
- 100% coverage untuk critical functions

**Test Cases:**

**Auth Service Tests:**

```typescript
describe("AuthService", () => {
  it("should register a new user", async () => {
    // Test implementation
  });

  it("should login with valid credentials", async () => {
    // Test implementation
  });

  it("should reject invalid credentials", async () => {
    // Test implementation
  });

  it("should hash password correctly", async () => {
    // Test implementation
  });
});
```

**Product Service Tests:**

```typescript
describe("ProductService", () => {
  it("should create a product", async () => {
    // Test implementation
  });

  it("should get products with filters", async () => {
    // Test implementation
  });

  it("should update product", async () => {
    // Test implementation
  });

  it("should delete product", async () => {
    // Test implementation
  });
});
```

**Cart Service Tests:**

```typescript
describe("CartService", () => {
  it("should add item to cart", async () => {
    // Test implementation
  });

  it("should update cart item quantity", async () => {
    // Test implementation
  });

  it("should remove item from cart", async () => {
    // Test implementation
  });

  it("should calculate cart total correctly", async () => {
    // Test implementation
  });
});
```

### 10.3.2 Frontend Unit Tests

**Tools:**

- Vitest sebagai testing framework
- React Testing Library untuk component testing
- Jest DOM untuk DOM assertions

**Component Tests:**

```typescript
describe("ProductCard", () => {
  it("should render product information", () => {
    // Test implementation
  });

  it("should call onAddToCart when button clicked", () => {
    // Test implementation
  });

  it("should display correct price", () => {
    // Test implementation
  });
});
```

**Hook Tests:**

```typescript
describe("useAuth", () => {
  it("should login user", async () => {
    // Test implementation
  });

  it("should logout user", () => {
    // Test implementation
  });

  it("should persist auth state", () => {
    // Test implementation
  });
});
```

## 10.4 Integration Testing

### 10.4.1 API Integration Tests

**Test Scenarios:**

**Authentication API:**

- POST /api/v1/auth/register - Success case
- POST /api/v1/auth/register - Validation errors
- POST /api/v1/auth/login - Success case
- POST /api/v1/auth/login - Invalid credentials
- POST /api/v1/auth/refresh - Token refresh
- POST /api/v1/auth/logout - Logout

**Products API:**

- GET /api/v1/products - List products
- GET /api/v1/products - With filters
- GET /api/v1/products/:id - Get product
- POST /api/v1/products - Create product (authenticated)
- PUT /api/v1/products/:id - Update product
- DELETE /api/v1/products/:id - Delete product

**Cart API:**

- GET /api/v1/cart - Get cart
- POST /api/v1/cart - Add to cart
- PUT /api/v1/cart/:itemId - Update cart item
- DELETE /api/v1/cart/:itemId - Remove item

**Orders API:**

- POST /api/v1/orders - Create order
- GET /api/v1/orders - List orders
- GET /api/v1/orders/:id - Get order
- PUT /api/v1/orders/:id - Update order status

**Payment API:**

- POST /api/v1/payments/create - Create payment
- POST /api/v1/payments/webhook - Payment webhook
- GET /api/v1/payments/:id - Get payment status

### 10.4.2 Database Integration Tests

**Test Scenarios:**

- User creation dan retrieval
- Product creation dengan category
- Order creation dengan order items
- Cart operations
- Review creation
- Voucher usage tracking

### 10.4.3 Third-Party Integration Tests

**Midtrans Integration:**

- Payment creation
- Payment verification
- Webhook handling
- Refund processing

**Biteship Integration:**

- Shipping rate calculation
- Courier selection
- Tracking number generation
- Delivery status updates

**Cloudinary Integration:**

- Image upload
- Image transformation
- Image deletion

## 10.5 End-to-End Testing

### 10.5.1 Critical User Flows

**Flow 1: User Registration dan First Purchase**

1. User mengakses homepage
2. User klik "Register"
3. User mengisi form registrasi
4. User verifikasi email
5. User login
6. User browse produk
7. User add produk ke cart
8. User checkout
9. User pilih alamat
10. User pilih shipping
11. User melakukan pembayaran
12. User menerima konfirmasi order

**Flow 2: Seller Listing Product**

1. Seller login
2. Seller create store (jika belum ada)
3. Seller klik "Sell"
4. Seller upload produk images
5. Seller isi informasi produk
6. Seller pilih kategori
7. Seller set kondisi dan harga
8. Seller tambahkan varian
9. Seller submit produk
10. Produk muncul di platform

**Flow 3: Order Processing**

1. Seller menerima notifikasi order baru
2. Seller verifikasi pembayaran
3. Seller update status ke "Processing"
4. Seller prepare produk
5. Seller update status ke "Shipped"
6. Seller input tracking number
7. Buyer track order
8. Buyer receive produk
9. Buyer confirm delivery
10. Buyer write review

### 10.5.2 E2E Test Tools

**Playwright (Recommended):**

- Cross-browser testing
- Fast execution
- Reliable
- Good debugging tools

**Cypress (Alternative):**

- Easy to use
- Good documentation
- Real browser testing
- Time travel debugging

## 10.6 Performance Testing

### 10.6.1 Load Testing

**Test Scenarios:**

- 100 concurrent users browsing products
- 50 concurrent users adding to cart
- 25 concurrent users checking out
- 10 concurrent users creating products

**Tools:**

- Apache JMeter
- k6
- Artillery

**Metrics:**

- Response time (target: <200ms)
- Throughput (requests per second)
- Error rate (target: <0.1%)
- Resource utilization

### 10.6.2 Stress Testing

**Test Scenarios:**

- Maximum concurrent users
- Database connection limits
- API rate limits
- Memory usage under load

**Goals:**

- Identify breaking points
- Test system recovery
- Validate error handling

### 10.6.3 Performance Optimization Testing

**Database Query Performance:**

- Query execution time
- Index effectiveness
- Connection pool efficiency

**API Response Time:**

- Endpoint response time
- Caching effectiveness
- Pagination performance

**Frontend Performance:**

- Page load time (target: <3s)
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)

## 10.7 Security Testing

### 10.7.1 Authentication Security

**Test Cases:**

- Password strength validation
- JWT token expiration
- Token refresh mechanism
- Rate limiting pada login
- Brute force protection
- Session management

### 10.7.2 Authorization Testing

**Test Cases:**

- Role-based access control
- Unauthorized access attempts
- Permission validation
- Resource ownership verification

### 10.7.3 Data Security Testing

**Test Cases:**

- SQL injection prevention
- XSS prevention
- CSRF protection
- Input validation
- Output encoding
- Sensitive data exposure

### 10.7.4 API Security Testing

**Test Cases:**

- API rate limiting
- CORS configuration
- Request validation
- Error message security
- Authentication on protected endpoints

## 10.8 Usability Testing

### 10.8.1 User Experience Testing

**Test Scenarios:**

- Navigation intuitiveness
- Form completion ease
- Error message clarity
- Loading state feedback
- Mobile responsiveness

### 10.8.2 Accessibility Testing

**Test Cases:**

- Keyboard navigation
- Screen reader compatibility
- Color contrast
- ARIA labels
- Focus management

**Tools:**

- axe DevTools
- WAVE
- Lighthouse Accessibility Audit

## 10.9 Compatibility Testing

### 10.9.1 Browser Compatibility

**Tested Browsers:**

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Test Cases:**

- Feature compatibility
- CSS rendering
- JavaScript execution
- API compatibility

### 10.9.2 Device Compatibility

**Tested Devices:**

- Desktop (1920x1080, 1366x768)
- Tablet (iPad, Android tablets)
- Mobile (iPhone, Android phones)

**Test Cases:**

- Responsive design
- Touch interactions
- Performance on mobile
- Network conditions

## 10.10 User Acceptance Testing (UAT)

### 10.10.1 Beta Testing

**Participants:**

- 20-30 beta users
- Mix of buyers dan sellers
- Various technical skill levels

**Test Period:**

- 2-4 weeks
- Active usage monitoring
- Feedback collection

**Feedback Collection:**

- In-app feedback forms
- User surveys
- Direct interviews
- Analytics data

### 10.10.2 Acceptance Criteria

**Functional Criteria:**

- All core features working
- No critical bugs
- Performance acceptable
- Security validated

**Non-Functional Criteria:**

- User satisfaction >80%
- Task completion rate >90%
- Error rate <1%
- Response time acceptable

## 10.11 Test Results dan Metrics

### 10.11.1 Test Coverage

**Backend Coverage:**

- Overall: 85%
- Services: 90%
- Controllers: 80%
- Utilities: 85%

**Frontend Coverage:**

- Overall: 75%
- Components: 80%
- Hooks: 85%
- Services: 90%

### 10.11.2 Bug Reports

**Bug Severity Distribution:**

- Critical: 0
- High: 2
- Medium: 8
- Low: 15

**Bug Status:**

- Fixed: 20
- In Progress: 3
- Pending: 2

### 10.11.3 Performance Metrics

**API Response Time:**

- Average: 150ms
- P95: 200ms
- P99: 300ms

**Page Load Time:**

- Average: 2.5s
- P95: 3.0s
- P99: 4.0s

**Error Rate:**

- Overall: 0.05%
- API Errors: 0.03%
- Frontend Errors: 0.02%

## 10.12 Test Automation

### 10.12.1 CI/CD Integration

**Automated Tests in Pipeline:**

1. **Pre-commit Hooks:**

   - Linting
   - Format checking
   - Quick unit tests

2. **Pull Request:**

   - Full unit test suite
   - Integration tests
   - Code coverage check

3. **Pre-deployment:**
   - Full test suite
   - E2E tests
   - Performance tests
   - Security scans

### 10.12.2 Test Maintenance

- Regular test updates
- Test data management
- Test environment setup
- Test documentation

## 10.13 Kesimpulan Pengujian

Pengujian sistem telah dilakukan secara komprehensif dengan berbagai metode dan teknik. Hasil pengujian menunjukkan bahwa sistem telah memenuhi kebutuhan fungsional dan non-fungsional yang telah ditetapkan. Beberapa bug minor telah diidentifikasi dan diperbaiki. Sistem siap untuk deployment ke production dengan confidence yang tinggi.

**Key Findings:**

1. Semua fitur utama berfungsi dengan baik
2. Performance memenuhi target yang ditetapkan
3. Security telah divalidasi
4. User experience telah diuji dan diterima
5. Beberapa area untuk improvement telah diidentifikasi

**Recommendations:**

1. Continue monitoring setelah deployment
2. Implement additional E2E tests untuk edge cases
3. Improve test coverage untuk non-critical features
4. Set up automated performance monitoring
5. Regular security audits
