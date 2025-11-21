import { IsOptional, IsString, Length, IsEnum } from 'class-validator';

export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  @Length(0, 500, { message: 'Bio must be at most 500 characters' })
  bio?: string;

  @IsString()
  @IsOptional()
  @Length(0, 20, { message: 'Gender must be at most 20 characters' })
  gender?: string;
}
