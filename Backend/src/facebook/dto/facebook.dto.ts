import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class FacebookDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, { message: 'Facebook ID must be between 1 and 255 characters' })
  facebookId: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  @MaxLength(255, { message: 'Email must be at most 255 characters' })
  email: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 100, { message: 'First name must be at most 100 characters' })
  firstName: string | null;

  @IsString()
  @IsOptional()
  @Length(0, 100, { message: 'Last name must be at most 100 characters' })
  lastName: string | null;
}
