import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100, {
    message: 'First name must be between 1 and 100 characters',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(0, 100, { message: 'Last name must be at most 100 characters' })
  lastName?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must be at most 255 characters' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
    minLength: 6,
    maxLength: 100,
    format: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, { message: 'Password must be at most 100 characters' })
  password: string;

  @ApiProperty({
    description: 'Password confirmation (must match password)',
    example: 'SecurePassword123!',
    minLength: 6,
    maxLength: 100,
    format: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'Confirm password must be at least 6 characters long',
  })
  @MaxLength(100, {
    message: 'Confirm password must be at most 100 characters',
  })
  confirmPassword: string;
}
