import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetShippingRatesDto } from './dto/get-shipping-rates.dto';
import { UpsertShippingRateDto } from './dto/upsert-shipping-rate.dto';

@Injectable()
export class ShippingRatesService {
  constructor(private prisma: PrismaService) {}

  findAvailableRates(query: GetShippingRatesDto) {
    const { originAreaId, destinationAreaId, weight } = query;
    return this.prisma.shippingRate.findMany({
      where: {
        originAreaId,
        destinationAreaId,
        minWeight: { lte: weight },
        maxWeight: { gte: weight },
      },
      orderBy: {
        price: 'asc',
      },
    });
  }

  upsertRate(dto: UpsertShippingRateDto) {
    const {
      originAreaId,
      destinationAreaId,
      courierCode,
      serviceCode,
      ...updateData
    } = dto;

    return this.prisma.shippingRate.upsert({
      where: {
        originAreaId_destinationAreaId_courierCode_serviceCode: {
          originAreaId,
          destinationAreaId,
          courierCode,
          serviceCode,
        },
      },
      update: updateData,
      create: dto,
    });
  }

  async removeRate(id: number) {
    const rate = await this.prisma.shippingRate.findUnique({ where: { id } });
    if (!rate) {
      throw new NotFoundException(`Shipping rate with ID ${id} not found.`);
    }
    await this.prisma.shippingRate.delete({ where: { id } });
    return { message: `Shipping rate with ID ${id} has been deleted.` };
  }
}
