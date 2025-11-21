import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must be at most 255 characters' })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Password cannot be empty' })
  @MaxLength(100, { message: 'Password must be at most 100 characters' })
  password: string;
}
