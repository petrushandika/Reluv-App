import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) {}

  async applyVoucher(user: User, code: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code },
      include: { _count: { select: { usages: true } } },
    });

    if (!voucher || !voucher.isActive || voucher.expiry < new Date()) {
      throw new NotFoundException('Voucher is not valid or has expired.');
    }
    if (voucher.usageLimit && voucher._count.usages >= voucher.usageLimit) {
      throw new BadRequestException('Voucher has reached its usage limit.');
    }

    const userHasUsed = await this.prisma.voucherUsage.findUnique({
      where: { userId_voucherId: { userId: user.id, voucherId: voucher.id } },
    });
    if (userHasUsed) {
      throw new BadRequestException('You have already used this voucher.');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: { include: { variant: true } } },
    });
    const subtotal =
      cart?.items.reduce(
        (sum, item) => sum + item.variant.price * item.quantity,
        0,
      ) || 0;
    if (voucher.minPurchase && subtotal < voucher.minPurchase) {
      throw new BadRequestException(
        `Minimum purchase of Rp${voucher.minPurchase.toLocaleString(
          'id-ID',
        )} is required.`,
      );
    }

    let discountAmount = 0;
    if (voucher.type === 'PERCENTAGE') {
      discountAmount = subtotal * voucher.value;
      if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else if (voucher.type === 'FIXED_AMOUNT') {
      discountAmount = voucher.value;
    }

    return {
      message: 'Voucher applied successfully.',
      code: voucher.code,
      type: voucher.type,
      discountAmount: Math.floor(discountAmount),
    };
  }

  async validateAndCalculateDiscount(
    user: User,
    code: string,
    subtotal: number,
  ): Promise<{ discountAmount: number; voucherId: number }> {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code },
      include: { _count: { select: { usages: true } } },
    });

    if (!voucher || !voucher.isActive || voucher.expiry < new Date()) {
      throw new BadRequestException('Voucher is not valid or has expired.');
    }
    if (voucher.usageLimit && voucher._count.usages >= voucher.usageLimit) {
      throw new BadRequestException('Voucher has reached its usage limit.');
    }
    const userHasUsed = await this.prisma.voucherUsage.findUnique({
      where: { userId_voucherId: { userId: user.id, voucherId: voucher.id } },
    });
    if (userHasUsed) {
      throw new BadRequestException('You have already used this voucher.');
    }
    if (voucher.minPurchase && subtotal < voucher.minPurchase) {
      throw new BadRequestException(
        `Minimum purchase of Rp${voucher.minPurchase.toLocaleString(
          'id-ID',
        )} is required.`,
      );
    }

    let discountAmount = 0;
    if (voucher.type === 'PERCENTAGE') {
      discountAmount = subtotal * voucher.value;
      if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else if (voucher.type === 'FIXED_AMOUNT') {
      discountAmount = voucher.value;
    }

    return {
      discountAmount: Math.floor(discountAmount),
      voucherId: voucher.id,
    };
  }

  findAllActive() {
    return this.prisma.voucher.findMany({
      where: {
        isActive: true,
        expiry: { gt: new Date() },
      },
    });
  }

  create(createVoucherDto: CreateVoucherDto) {
    return this.prisma.voucher.create({ data: createVoucherDto });
  }

  update(id: number, updateVoucherDto: UpdateVoucherDto) {
    return this.prisma.voucher.update({
      where: { id },
      data: updateVoucherDto,
    });
  }

  remove(id: number) {
    return this.prisma.voucher.delete({ where: { id } });
  }
}
