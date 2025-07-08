import { IsNotEmpty, IsString } from 'class-validator';

export class SearchAreaDto {
  @IsString()
  @IsNotEmpty()
  input: string;
}
