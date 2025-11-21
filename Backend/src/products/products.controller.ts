import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ValidationPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @GetUser() user: User,
    @Body(new ValidationPipe()) createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(user, createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(user, id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(user, id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query(new ValidationPipe({ transform: true })) queryDto: QueryProductDto,
  ) {
    return this.productsService.findAll(queryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':productId/variants')
  @HttpCode(HttpStatus.CREATED)
  addVariant(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Body(new ValidationPipe()) createVariantDto: CreateVariantDto,
  ) {
    return this.productsService.addVariant(user, productId, createVariantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':productId/variants/:variantId')
  @HttpCode(HttpStatus.OK)
  updateVariant(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body(new ValidationPipe()) updateVariantDto: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(
      user,
      productId,
      variantId,
      updateVariantDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId/variants/:variantId')
  @HttpCode(HttpStatus.OK)
  removeVariant(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
  ) {
    return this.productsService.removeVariant(user, productId, variantId);
  }
}
