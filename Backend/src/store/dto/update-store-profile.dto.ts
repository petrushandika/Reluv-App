import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateStoreProfileDto {
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  @IsOptional()
  avatar?: string;

  @IsUrl({}, { message: 'Banner must be a valid URL' })
  @IsOptional()
  banner?: string;

  @IsString()
  @IsOptional()
  @Length(0, 500, { message: 'Bio must be at most 500 characters' })
  bio?: string;

  @IsString()
  @IsOptional()
  @Length(0, 200, { message: 'Operational hours must be at most 200 characters' })
  operational?: string;
}
