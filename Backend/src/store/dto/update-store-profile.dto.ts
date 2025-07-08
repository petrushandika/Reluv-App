import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateStoreProfileDto {
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsUrl()
  @IsOptional()
  banner?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  operational?: string;
}
