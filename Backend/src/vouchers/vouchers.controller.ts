import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { User } from '@prisma/client';
import { ApplyVoucherDto } from './dto/apply-voucher.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get()
  findAllActive() {
    return this.vouchersService.findAllActive();
  }

  @UseGuards(JwtAuthGuard)
  @Post('apply')
  applyVoucher(
    @GetUser() user: User,
    @Body(new ValidationPipe()) applyVoucherDto: ApplyVoucherDto,
  ) {
    return this.vouchersService.applyVoucher(user, applyVoucherDto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin')
  create(@Body(new ValidationPipe()) createVoucherDto: CreateVoucherDto) {
    return this.vouchersService.create(createVoucherDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateVoucherDto: UpdateVoucherDto,
  ) {
    return this.vouchersService.update(id, updateVoucherDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.remove(id);
  }
}
