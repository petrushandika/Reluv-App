import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateUserProfileDto {
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
