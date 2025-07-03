import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FacebookDto {
  @IsString()
  @IsNotEmpty()
  facebookId: string;

  @IsEmail()
  @IsOptional()
  email: string | null;

  @IsString()
  @IsOptional()
  firstName: string | null;

  @IsString()
  @IsOptional()
  lastName: string | null;
}
