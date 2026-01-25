import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Length,
} from 'class-validator';

export class ResetDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 500, { message: 'Token must be between 1 and 500 characters' })
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, { message: 'Password must be at most 100 characters' })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(100, {
    message: 'Confirm password must be at most 100 characters',
  })
  confirmNewPassword: string;
}
