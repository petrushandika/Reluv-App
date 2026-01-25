import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ApplyVoucherDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50, {
    message: 'Voucher code must be between 1 and 50 characters',
  })
  code: string;
}
