import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 500, { message: 'Token must be between 1 and 500 characters' })
  token: string;
}
