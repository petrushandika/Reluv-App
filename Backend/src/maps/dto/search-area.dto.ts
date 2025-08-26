import { IsNotEmpty, IsString } from 'class-validator';

export class SearchAreaDto {
  @IsString()
  @IsNotEmpty()
  input: string;
}

export class SearchMapDto {
  @IsString()
  @IsNotEmpty()
  q: string;
}
