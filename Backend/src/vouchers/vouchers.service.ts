import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
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
      discountAmount = Math.floor((subtotal * voucher.value) / 100);
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
      discountAmount: discountAmount,
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
      discountAmount = Math.floor((subtotal * voucher.value) / 100);
      if (voucher.maxDiscount && discountAmount > voucher.maxDiscount) {
        discountAmount = voucher.maxDiscount;
      }
    } else if (voucher.type === 'FIXED_AMOUNT') {
      discountAmount = voucher.value;
    }

    return {
      discountAmount: discountAmount,
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

  async create(user: User, createVoucherDto: CreateVoucherDto) {
    const { storeId, ...voucherData } = createVoucherDto as any;

    if (!storeId) {
      throw new BadRequestException(
        'storeId is required. Only stores can create vouchers.',
      );
    }

    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, userId: true },
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found.`);
    }

    if (store.userId !== user.id) {
      throw new ForbiddenException(
        'You are not the owner of this store. Only the store owner can create vouchers for this store.',
      );
    }

    const existingVoucher = await this.prisma.voucher.findUnique({
      where: { code: voucherData.code },
    });

    if (existingVoucher) {
      throw new BadRequestException(
        `Voucher with code '${voucherData.code}' already exists.`,
      );
    }

    const data: Prisma.VoucherCreateInput = {
      name: voucherData.name,
      code: voucherData.code,
      description: voucherData.description,
      type: voucherData.type,
      value: voucherData.value,
      maxDiscount: voucherData.maxDiscount,
      minPurchase: voucherData.minPurchase,
      usageLimit: voucherData.usageLimit,
      expiry: voucherData.expiry,
      store: { connect: { id: storeId } },
    };

    return this.prisma.voucher.create({ data });
  }

  findAll() {
    return this.prisma.voucher.findMany({ where: { isActive: true } });
  }

  findOne(id: number) {
    return this.prisma.voucher.findUnique({ where: { id } });
  }

  async update(user: User, id: number, updateVoucherDto: UpdateVoucherDto) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id },
      include: { store: { select: { userId: true } } },
    });

    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found.`);
    }

    if (voucher.storeId && voucher.store?.userId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to update this voucher.',
      );
    }

    return this.prisma.voucher.update({
      where: { id },
      data: updateVoucherDto,
    });
  }

  async remove(user: User, id: number) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id },
      include: { store: { select: { userId: true } } },
    });

    if (!voucher) {
      throw new NotFoundException(`Voucher with ID ${id} not found.`);
    }

    if (voucher.storeId && voucher.store?.userId !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this voucher.',
      );
    }

    return this.prisma.voucher.delete({ where: { id } });
  }
}
