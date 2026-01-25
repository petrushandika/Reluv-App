import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SearchAreaDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, {
    message: 'Search input must be between 1 and 255 characters',
  })
  input: string;
}

export class SearchMapDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255, {
    message: 'Search query must be between 1 and 255 characters',
  })
  q: string;
}
