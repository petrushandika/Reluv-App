# Swagger API Documentation

## Overview

Swagger (OpenAPI) documentation has been implemented for the Reluv API to provide interactive API documentation. This allows developers to:

- View all available endpoints
- Test API endpoints directly from the browser
- See request/response schemas
- Understand authentication requirements
- View example requests and responses

## Accessing Swagger UI

### Local Development

When running the backend locally, access Swagger UI at:

```
http://localhost:8000/api/docs
```

### Production

Access the production Swagger documentation at:

```
https://api-reluv-app.vercel.app/api/docs
```

## Features

### 1. Interactive API Testing

- Click on any endpoint to expand it
- Click "Try it out" to test the endpoint
- Fill in the required parameters
- Click "Execute" to send the request
- View the response directly in the browser

### 2. Authentication

For endpoints that require authentication:

1. Click the "Authorize" button at the top right
2. Enter your JWT token in the format: `Bearer <your-token>`
3. Click "Authorize"
4. All subsequent requests will include the authorization header

### 3. Request/Response Schemas

Each endpoint displays:

- Request body schema with validation rules
- Response schema for different status codes
- Example values for all fields
- Field descriptions and constraints

### 4. Tags Organization

Endpoints are organized by tags:

- **auth**: Authentication endpoints
- **users**: User management
- **products**: Product management
- **categories**: Category management
- **cart**: Shopping cart
- **orders**: Order management
- **payments**: Payment processing
- **shipments**: Shipment tracking
- **reviews**: Product reviews
- **wishlist**: Wishlist management
- **store**: Store management
- **locations**: Location management
- **vouchers**: Voucher management
- **discounts**: Discount management
- **promotions**: Promotion management

## Configuration

### Swagger Setup (main.ts)

```typescript
const config = new DocumentBuilder()
  .setTitle('Reluv API')
  .setDescription(
    'API Documentation for Reluv - E-Commerce Platform for Preloved Fashion Items',
  )
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addServer('http://localhost:8000', 'Local Development')
  .addServer('https://api-reluv-app.vercel.app', 'Production')
  .build();
```

### Controller Decorators

```typescript
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  register(@Body() registerDto: RegisterDto) {
    // ...
  }
}
```

### DTO Decorators

```typescript
export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
    maxLength: 255,
  })
  @IsEmail()
  email: string;
}
```

## Best Practices

### 1. Always Add Descriptions

```typescript
@ApiOperation({ summary: 'Short description of what this endpoint does' })
```

### 2. Document All Response Codes

```typescript
@ApiResponse({ status: 200, description: 'Success' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 404, description: 'Not Found' })
```

### 3. Use Meaningful Examples

```typescript
@ApiProperty({
  description: 'User email address',
  example: 'john.doe@example.com', // Good example
  // NOT: example: 'string'
})
```

### 4. Add Security Decorators

For protected endpoints:

```typescript
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
```

### 5. Group Related Endpoints

Use consistent tags:

```typescript
@ApiTags('products')
```

## Customization

### Custom CSS

The Swagger UI has been customized to hide the top bar:

```typescript
SwaggerModule.setup('api/docs', app, document, {
  customCss: '.swagger-ui .topbar { display: none }',
});
```

### Persist Authorization

Authorization tokens are persisted across page refreshes:

```typescript
swaggerOptions: {
  persistAuthorization: true,
}
```

### Sorting

Endpoints and tags are sorted alphabetically:

```typescript
swaggerOptions: {
  tagsSorter: 'alpha',
  operationsSorter: 'alpha',
}
```

## Troubleshooting

### Swagger UI Not Loading

1. Check that the backend server is running
2. Verify the URL: `http://localhost:8000/api/docs`
3. Check browser console for errors

### Authentication Not Working

1. Make sure you're using the correct format: `Bearer <token>`
2. Verify the token is valid and not expired
3. Check that the endpoint requires authentication

### Schema Not Showing

1. Ensure DTOs have `@ApiProperty()` decorators
2. Check that the DTO is referenced in `@ApiBody()` or `@ApiResponse()`
3. Restart the server after making changes

## Next Steps

To add Swagger documentation to other controllers:

1. Import Swagger decorators:

   ```typescript
   import {
     ApiTags,
     ApiOperation,
     ApiResponse,
     ApiBody,
   } from '@nestjs/swagger';
   ```

2. Add `@ApiTags()` to the controller

3. Add `@ApiOperation()` to each endpoint

4. Add `@ApiResponse()` for all possible responses

5. Add `@ApiProperty()` to all DTO properties

6. For protected endpoints, add `@ApiBearerAuth('JWT-auth')`

## Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
