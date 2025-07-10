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

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Body(new ValidationPipe()) createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(user, createProductDto);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(user, id, updateProductDto);
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(user, id);
  }

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) queryDto: QueryProductDto,
  ) {
    return this.productsService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post(':productId/variants')
  addVariant(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Body(new ValidationPipe()) createVariantDto: CreateVariantDto,
  ) {
    return this.productsService.addVariant(user, productId, createVariantDto);
  }

  @Patch(':productId/variants/:variantId')
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

  @Delete(':productId/variants/:variantId')
  removeVariant(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
  ) {
    return this.productsService.removeVariant(user, productId, variantId);
  }
}
