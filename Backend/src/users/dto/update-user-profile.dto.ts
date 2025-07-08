import { IsDateString, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserProfileDto {
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsUrl()
  @IsOptional()
  banner?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsDateString()
  @IsOptional()
  birth?: Date;

  @IsString()
  @IsOptional()
  gender?: string;
}
