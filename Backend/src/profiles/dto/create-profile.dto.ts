import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsUrl()
  @IsOptional()
  banner?: string;
}
