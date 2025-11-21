import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @Length(0, 100, { message: 'First name must be at most 100 characters' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100, { message: 'Last name must be at most 100 characters' })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must be at most 255 characters' })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20, { message: 'Phone must be at most 20 characters' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of: USER, ADMIN, SELLER' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
