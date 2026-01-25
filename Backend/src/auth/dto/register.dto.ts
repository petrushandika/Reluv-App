import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Length,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100, {
    message: 'First name must be between 1 and 100 characters',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 100, { message: 'Last name must be at most 100 characters' })
  lastName?: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must be at most 255 characters' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, { message: 'Password must be at most 100 characters' })
  password: string;

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
