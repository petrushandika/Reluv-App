# Validation

## ✅ Overview

Reluv Backend menggunakan `class-validator` dan `class-transformer` untuk validation. Semua input data divalidasi sebelum diproses.

## 📝 Validation Decorators

### String Validation

```typescript
@IsString()
@IsNotEmpty()
@Length(1, 255)
name: string;
```

### Email Validation

```typescript
@IsEmail()
@IsNotEmpty()
email: string;
```

### Number Validation

```typescript
@IsInt()
@Min(0)
@Max(999999999)
price: number;
```

### Array Validation

```typescript
@IsArray()
@ArrayMinSize(1)
@IsUrl({}, { each: true })
images: string[];
```

### Optional Fields

```typescript
@IsOptional()
@IsString()
@Length(0, 500)
description?: string;
```

## 🔍 Validation Rules

### Common Rules

| Decorator             | Description         |
| --------------------- | ------------------- |
| `@IsString()`         | Must be a string    |
| `@IsNotEmpty()`       | Cannot be empty     |
| `@IsOptional()`       | Field is optional   |
| `@IsEmail()`          | Must be valid email |
| `@IsInt()`            | Must be integer     |
| `@IsNumber()`         | Must be number      |
| `@IsBoolean()`        | Must be boolean     |
| `@IsUrl()`            | Must be valid URL   |
| `@IsEnum()`           | Must be enum value  |
| `@IsArray()`          | Must be array       |
| `@Length(min, max)`   | String length       |
| `@Min(value)`         | Minimum number      |
| `@Max(value)`         | Maximum number      |
| `@ArrayMinSize(size)` | Minimum array size  |
| `@ArrayMaxSize(size)` | Maximum array size  |

## 📋 DTO Examples

### Create Product DTO

```typescript
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  slug: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10000)
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  @ArrayMinSize(1)
  images: string[];

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  categoryId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  @ArrayMinSize(1)
  variants: CreateVariantDto[];
}
```

### Create Variant DTO

```typescript
export class CreateVariantDto {
  @IsString()
  @IsOptional()
  @Length(0, 50)
  size?: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(999999999)
  price: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(999999)
  stock: number;

  @IsEnum(Condition)
  @IsNotEmpty()
  condition: Condition;
}
```

## ⚠️ Error Responses

### Validation Error Format

```json
{
  "success": false,
  "statusCode": 400,
  "message": "name must be between 1 and 255 characters, slug must be between 1 and 255 characters",
  "error": "Bad Request",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/products",
  "details": [
    {
      "property": "name",
      "constraints": {
        "length": "Product name must be between 1 and 255 characters",
        "isNotEmpty": "name should not be empty"
      }
    },
    {
      "property": "slug",
      "constraints": {
        "length": "Slug must be between 1 and 255 characters"
      }
    }
  ]
}
```

## 🔧 Global Validation

Validation diaktifkan secara global di `main.ts`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

### ValidationPipe Options

- `whitelist: true` - Strip properties yang tidak ada di DTO
- `forbidNonWhitelisted: true` - Throw error jika ada property yang tidak diizinkan
- `transform: true` - Transform payload ke DTO instance
- `enableImplicitConversion: true` - Auto convert types

## 📝 Custom Validation

### Custom Validator

```typescript
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidSlug(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidSlug',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
        },
        defaultMessage() {
          return 'Slug must be lowercase alphanumeric with hyphens';
        },
      },
    });
  };
}
```

### Usage

```typescript
export class CreateProductDto {
  @IsValidSlug()
  slug: string;
}
```

## 🔍 Query Parameter Validation

### Using DTOs

```typescript
export class QueryProductDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  search?: string;
}
```

### In Controller

```typescript
@Get()
findAll(
  @Query(new ValidationPipe({ transform: true })) queryDto: QueryProductDto,
) {
  return this.productsService.findAll(queryDto);
}
```

## 📚 Related Documentation

- [API Reference](./03-api-reference.md)
- [Response Format](./06-response-format.md)
- [Getting Started](./01-getting-started.md)
