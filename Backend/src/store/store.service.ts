import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UpdateStoreProfileDto } from './dto/update-store-profile.dto';
import { AdminCreateStoreDto } from './dto/admin-create-store.dto';
import { Prisma, UserRole } from '@prisma/client';
import { QueryStoreDto } from './dto/query-store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createStoreDto: CreateStoreDto) {
    const { locationId, ...storeData } = createStoreDto;

    const [user, existingStore, storeWithSameSlug] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true },
      }),
      this.prisma.store.findUnique({
        where: { userId },
        select: { id: true },
      }),
      this.prisma.store.findUnique({
        where: { slug: storeData.slug },
        select: { id: true },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.role !== UserRole.USER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only users with USER or ADMIN role can create a store.',
      );
    }

    if (existingStore) {
      throw new ConflictException('User already owns a store.');
    }

    if (storeWithSameSlug) {
      throw new ConflictException('Store slug is already taken.');
    }

    return this.prisma.store.create({
      data: {
        ...storeData,
        user: { connect: { id: userId } },
        location: locationId ? { connect: { id: locationId } } : undefined,
        profile: { create: {} },
      },
    });
  }

  async createStoreForUser(adminCreateStoreDto: AdminCreateStoreDto) {
    const { userId, locationId, ...storeData } = adminCreateStoreDto;

    const [userToOwnStore, existingStore] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      }),
      this.prisma.store.findUnique({
        where: { userId },
        select: { id: true },
      }),
    ]);

    if (!userToOwnStore) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (existingStore) {
      throw new ConflictException(
        `User with ID ${userId} already owns a store.`,
      );
    }

    return this.prisma.store.create({
      data: {
        ...storeData,
        user: { connect: { id: userId } },
        location: locationId ? { connect: { id: locationId } } : undefined,
        profile: { create: {} },
      },
    });
  }

  async findAllPublic(queryDto: QueryStoreDto) {
    const { page = 1, limit = 12, search } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.StoreWhereInput = {
      isActive: true,
      isVerified: true,
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const [stores, total] = await this.prisma.$transaction([
      this.prisma.store.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          totalProducts: true,
          totalSales: true,
          rating: true,
          createdAt: true,
          profile: {
            select: { avatar: true, banner: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.store.count({ where }),
    ]);

    return {
      data: stores,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        isVerified: true,
        totalProducts: true,
        totalSales: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            avatar: true,
            banner: true,
            bio: true,
            operational: true,
          },
        },
        location: {
          select: {
            id: true,
            city: true,
            province: true,
            district: true,
            subDistrict: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        products: {
          where: { isPublished: true, isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            images: true,
            isPreloved: true,
            viewCount: true,
            createdAt: true,
            variants: {
              where: { isActive: true },
              orderBy: { price: 'asc' },
              select: {
                id: true,
                size: true,
                color: true,
                price: true,
                compareAtPrice: true,
                stock: true,
                condition: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!store) {
      throw new NotFoundException(`Store with slug "${slug}" not found.`);
    }
    return store;
  }

  async findMyStore(userId: number) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        isVerified: true,
        totalProducts: true,
        totalSales: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            avatar: true,
            banner: true,
            bio: true,
            operational: true,
          },
        },
        location: {
          select: {
            id: true,
            label: true,
            city: true,
            province: true,
            district: true,
            subDistrict: true,
            postalCode: true,
            address: true,
          },
        },
      },
    });
    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }
    return store;
  }

  async updateMyStore(userId: number, updateStoreDto: UpdateStoreDto) {
    const myStore = await this.findMyStore(userId);
    const { locationId, ...storeData } = updateStoreDto;

    return this.prisma.store.update({
      where: { id: myStore.id },
      data: {
        ...storeData,
        location: locationId ? { connect: { id: locationId } } : undefined,
      },
    });
  }

  async updateMyStoreProfile(
    userId: number,
    updateStoreProfileDto: UpdateStoreProfileDto,
  ) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store to update.');
    }

    return this.prisma.storeProfile.update({
      where: { storeId: store.id },
      data: updateStoreProfileDto,
      select: {
        id: true,
        avatar: true,
        banner: true,
        bio: true,
        operational: true,
      },
    });
  }

  // Store Dashboard Methods

  async getAnalytics(userId: number) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        slug: true,
        isVerified: true,
        rating: true,
        createdAt: true,
        profile: {
          select: { avatar: true, banner: true },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get all products for this store
    const products = await this.prisma.product.findMany({
      where: { storeId: store.id },
      select: {
        id: true,
        name: true,
        images: true,
        isPublished: true,
        isActive: true,
        variants: {
          select: { stock: true, isActive: true },
        },
      },
    });

    const activeProducts = products.filter(p => p.isPublished && p.isActive);
    const draftProducts = products.filter(p => !p.isPublished);
    const outOfStockProducts = products.filter(p => 
      p.isActive && p.variants.every(v => v.stock === 0)
    );
    const lowStockProducts = products
      .filter(p => p.isActive && p.variants.some(v => v.stock > 0 && v.stock < 5))
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        name: p.name,
        stock: Math.min(...p.variants.filter(v => v.stock > 0).map(v => v.stock)),
        image: p.images[0] || null,
      }));

    // Get orders containing this store's products
    const ordersWithStoreProducts = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            variant: {
              product: { storeId: store.id },
            },
          },
        },
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        buyer: {
          select: { firstName: true, lastName: true },
        },
        items: {
          where: {
            variant: {
              product: { storeId: store.id },
            },
          },
          select: {
            total: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingOrders = ordersWithStoreProducts.filter(o => o.status === 'PENDING');
    const paidOrders = ordersWithStoreProducts.filter(o => o.status === 'PAID');
    const shippedOrders = ordersWithStoreProducts.filter(o => o.status === 'SHIPPED');
    const completedOrders = ordersWithStoreProducts.filter(o => o.status === 'COMPLETED');
    const cancelledOrders = ordersWithStoreProducts.filter(o => o.status === 'CANCELLED');

    // Calculate revenue (only from completed/paid orders)
    const revenueOrders = ordersWithStoreProducts.filter(
      o => ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(o.status)
    );
    const totalRevenue = revenueOrders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.total, 0), 0
    );
    const thisMonthRevenue = revenueOrders
      .filter(o => o.createdAt >= startOfMonth)
      .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.total, 0), 0);
    const lastMonthRevenue = revenueOrders
      .filter(o => o.createdAt >= startOfLastMonth && o.createdAt <= endOfLastMonth)
      .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.total, 0), 0);
    const todayRevenue = revenueOrders
      .filter(o => o.createdAt >= startOfToday)
      .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.total, 0), 0);

    // Get reviews for store products
    const reviews = await this.prisma.review.findMany({
      where: {
        product: { storeId: store.id },
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        reply: true,
        createdAt: true,
        product: { select: { name: true } },
        author: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const unrepliedReviews = reviews.filter(r => !r.reply);
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    // Rating distribution
    const ratingDistribution = {
      star1: reviews.filter(r => r.rating === 1).length,
      star2: reviews.filter(r => r.rating === 2).length,
      star3: reviews.filter(r => r.rating === 3).length,
      star4: reviews.filter(r => r.rating === 4).length,
      star5: reviews.filter(r => r.rating === 5).length,
    };

    // Get vouchers and discounts count
    const [vouchers, discounts, promotions] = await Promise.all([
      this.prisma.voucher.findMany({
        where: { storeId: store.id },
        select: { id: true, isActive: true, expiry: true, code: true },
      }),
      this.prisma.discount.findMany({
        where: { storeId: store.id },
        select: { id: true, isActive: true, endDate: true, name: true },
      }),
      this.prisma.promotion.findMany({
        where: { storeId: store.id },
        select: { id: true, isActive: true },
      }),
    ]);

    const activeVouchers = vouchers.filter(v => v.isActive && v.expiry > now);
    const activeDiscounts = discounts.filter(d => d.isActive && d.endDate > now);
    const activePromotions = promotions.filter(p => p.isActive);

    const expiringVouchers = vouchers
      .filter(v => v.isActive && v.expiry > now && v.expiry < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000))
      .slice(0, 3)
      .map(v => ({ id: v.id, code: v.code, expiry: v.expiry.toISOString() }));

    const expiringDiscounts = discounts
      .filter(d => d.isActive && d.endDate > now && d.endDate < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000))
      .slice(0, 3)
      .map(d => ({ id: d.id, name: d.name, endDate: d.endDate.toISOString() }));

    return {
      store,
      stats: {
        totalProducts: products.length,
        activeProducts: activeProducts.length,
        draftProducts: draftProducts.length,
        outOfStockProducts: outOfStockProducts.length,
        totalOrders: ordersWithStoreProducts.length,
        pendingOrders: pendingOrders.length,
        paidOrders: paidOrders.length,
        shippedOrders: shippedOrders.length,
        completedOrders: completedOrders.length,
        cancelledOrders: cancelledOrders.length,
        totalRevenue,
        thisMonthRevenue,
        lastMonthRevenue,
        todayRevenue,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        unrepliedReviews: unrepliedReviews.length,
        totalVouchers: vouchers.length,
        activeVouchers: activeVouchers.length,
        totalDiscounts: discounts.length,
        activeDiscounts: activeDiscounts.length,
        totalPromotions: promotions.length,
        activePromotions: activePromotions.length,
      },
      alerts: {
        lowStockProducts,
        pendingOrders: pendingOrders.slice(0, 5).map(o => ({
          id: o.id,
          orderNumber: o.orderNumber,
          totalAmount: o.items.reduce((s, i) => s + i.total, 0),
          createdAt: o.createdAt.toISOString(),
        })),
        unrepliedReviews: unrepliedReviews.slice(0, 5).map(r => ({
          id: r.id,
          productName: r.product.name,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt.toISOString(),
        })),
        expiringVouchers,
        expiringDiscounts,
      },
      recentOrders: ordersWithStoreProducts.slice(0, 5).map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        totalAmount: o.items.reduce((s, i) => s + i.total, 0),
        buyer: o.buyer,
        createdAt: o.createdAt.toISOString(),
      })),
      recentReviews: reviews.slice(0, 5).map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        productName: r.product.name,
        authorName: `${r.author.firstName || ''} ${r.author.lastName || ''}`.trim(),
        hasReply: !!r.reply,
        createdAt: r.createdAt.toISOString(),
      })),
      ratingDistribution,
      orderStatusChart: {
        pending: pendingOrders.length,
        paid: paidOrders.length,
        shipped: shippedOrders.length,
        completed: completedOrders.length,
        cancelled: cancelledOrders.length,
      },
    };
  }

  async getStoreProducts(userId: number, query: any) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }

    const { page = 1, limit = 10, search, status, categoryId, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      storeId: store.id,
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
      ...(status === 'active' && { isPublished: true, isActive: true }),
      ...(status === 'draft' && { isPublished: false }),
      ...(categoryId && { categoryId }),
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          images: true,
          isPublished: true,
          isActive: true,
          createdAt: true,
          category: { select: { id: true, name: true } },
          variants: {
            select: {
              id: true,
              price: true,
              compareAtPrice: true,
              stock: true,
              isActive: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Add computed fields
    const productsWithStats = products.map(p => {
      const activeVariants = p.variants.filter(v => v.isActive);
      const totalStock = activeVariants.reduce((sum, v) => sum + v.stock, 0);
      const minPrice = activeVariants.length > 0 ? Math.min(...activeVariants.map(v => v.price)) : 0;
      const maxPrice = activeVariants.length > 0 ? Math.max(...activeVariants.map(v => v.price)) : 0;
      
      let productStatus = 'active';
      if (!p.isPublished) productStatus = 'draft';
      else if (totalStock === 0) productStatus = 'out_of_stock';
      
      return {
        ...p,
        totalStock,
        minPrice,
        maxPrice,
        status: productStatus,
      };
    });

    // Filter by out_of_stock status if needed
    let filteredProducts = productsWithStats;
    if (status === 'out_of_stock') {
      filteredProducts = productsWithStats.filter(p => p.status === 'out_of_stock');
    }

    return {
      data: filteredProducts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStoreOrders(userId: number, query: any) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }

    const { page = 1, limit = 10, search, status, dateFrom, dateTo, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      items: {
        some: {
          variant: {
            product: { storeId: store.id },
          },
        },
      },
      ...(search && {
        orderNumber: { contains: search, mode: 'insensitive' },
      }),
      ...(status && { status }),
      ...(dateFrom && { createdAt: { gte: new Date(dateFrom) } }),
      ...(dateTo && { createdAt: { lte: new Date(dateTo) } }),
    };

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          shippingCost: true,
          discountAmount: true,
          createdAt: true,
          buyer: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          location: {
            select: { city: true, province: true },
          },
          items: {
            where: {
              variant: {
                product: { storeId: store.id },
              },
            },
            select: {
              id: true,
              quantity: true,
              price: true,
              total: true,
              variant: {
                select: {
                  id: true,
                  size: true,
                  color: true,
                  product: {
                    select: { id: true, name: true, images: true },
                  },
                },
              },
            },
          },
          payment: {
            select: { status: true, method: true },
          },
          shipment: {
            select: { status: true, trackingNumber: true, courier: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.order.count({ where }),
    ]);

    // Calculate store-specific totals
    const ordersWithStoreTotals = orders.map(o => ({
      ...o,
      storeItemsTotal: o.items.reduce((sum, i) => sum + i.total, 0),
      itemsCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
    }));

    return {
      data: ordersWithStoreTotals,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStoreReviews(userId: number, query: any) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }

    const { page = 1, limit = 10, rating, hasReply, productId, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {
      product: { storeId: store.id },
      ...(rating && { rating }),
      ...(hasReply === true && { reply: { not: null } }),
      ...(hasReply === false && { reply: null }),
      ...(productId && { productId }),
    };

    const [reviews, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          rating: true,
          comment: true,
          images: true,
          reply: true,
          replyAuthorId: true,
          helpfulCount: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profile: { select: { avatar: true } },
            },
          },
          product: {
            select: { id: true, name: true, slug: true, images: true },
          },
          order: {
            select: { id: true, orderNumber: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStoreVouchers(userId: number) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }

    return this.prisma.voucher.findMany({
      where: { storeId: store.id },
      include: {
        _count: { select: { usages: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStoreDiscounts(userId: number) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }

    return this.prisma.discount.findMany({
      where: { storeId: store.id },
      include: {
        product: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStorePromotions(userId: number) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }

    return this.prisma.promotion.findMany({
      where: { storeId: store.id },
      include: {
        products: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStoreProduct(userId: number, productId: number) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
      include: {
        category: { select: { id: true, name: true } },
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            condition: true,
            image: true,
            isActive: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found or does not belong to your store.');
    }

    return product;
  }

  async toggleProductStatus(userId: number, productId: number) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found or does not belong to your store.');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { isPublished: !product.isPublished },
      select: {
        id: true,
        name: true,
        isPublished: true,
        isActive: true,
      },
    });
  }

  async getStoreOrder(userId: number, orderId: number) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        items: {
          some: {
            variant: {
              product: { storeId: store.id },
            },
          },
        },
      },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        location: true,
        items: {
          where: {
            variant: {
              product: { storeId: store.id },
            },
          },
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    images: true,
                  },
                },
              },
            },
          },
        },
        payment: true,
        shipment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found or does not contain your products.');
    }

    return order;
  }

  async replyToReview(userId: number, reviewId: number, reply: string) {
    const store = await this.prisma.store.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!store) {
      throw new NotFoundException('You do not have a store yet.');
    }

    const review = await this.prisma.review.findFirst({
      where: {
        id: reviewId,
        product: { storeId: store.id },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found or does not belong to your store products.');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        reply,
        replyAuthorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }
}
