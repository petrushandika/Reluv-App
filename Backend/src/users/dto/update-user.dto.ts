import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  })
  birth?: Date;
}
