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
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { User } from '@prisma/client';
import { ApplyVoucherDto } from './dto/apply-voucher.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAllActive(@Query('storeId') storeId?: string) {
    const parsedStoreId = storeId ? parseInt(storeId, 10) : undefined;
    return this.vouchersService.findAllActive(parsedStoreId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('apply')
  @HttpCode(HttpStatus.OK)
  applyVoucher(
    @GetUser() user: User,
    @Body(new ValidationPipe()) applyVoucherDto: ApplyVoucherDto,
  ) {
    return this.vouchersService.applyVoucher(user, applyVoucherDto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @GetUser() user: User,
    @Body(new ValidationPipe()) createVoucherDto: CreateVoucherDto,
  ) {
    return this.vouchersService.create(user, createVoucherDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateVoucherDto: UpdateVoucherDto,
  ) {
    return this.vouchersService.update(user, id, updateVoucherDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.remove(user, id);
  }
}
