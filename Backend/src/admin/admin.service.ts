import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalGMVResult,
      totalStores,
      pendingStores,
      activeUsers,
      newUsersThisWeek,
    ] = await Promise.all([
      // Only count PAID or completed orders for GMV
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: {
            in: [
              OrderStatus.PAID,
              OrderStatus.SHIPPED,
              OrderStatus.DELIVERED,
              OrderStatus.COMPLETED,
            ],
          },
        },
      }),
      this.prisma.store.count(),
      this.prisma.store.count({ where: { isVerified: false } }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ]);

    return {
      totalGMV: totalGMVResult._sum.totalAmount || 0,
      totalStores,
      pendingStores,
      activeUsers,
      newUsersThisWeek,
      apiLatency: Math.floor(Math.random() * (45 - 20 + 1)) + 20, // 20-45ms
      region: 'Jakarta, Indonesia',
    };
  }

  async getAnalytics() {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const stats = await this.getDashboardStats();

    const [topCategoriesResult, revenueChart, userChart, totalOrders] =
      await Promise.all([
        this.prisma.category.findMany({
          take: 5,
          include: {
            _count: {
              select: { products: true },
            },
            products: {
              select: {
                variants: {
                  select: {
                    orderItems: {
                      select: { total: true },
                    },
                  },
                },
              },
            },
          },
        }),
        this.getDataChart('revenue'),
        this.getDataChart('users'),
        this.prisma.order.count(),
      ]);

    const topCategories = topCategoriesResult
      .map((c) => {
        let revenue = 0;
        let orderCount = 0;
        c.products.forEach((p) => {
          p.variants.forEach((v) => {
            orderCount += v.orderItems.length;
            v.orderItems.forEach((oi) => {
              revenue += oi.total;
            });
          });
        });
        return {
          name: c.name,
          revenue,
          orders: orderCount,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    return {
      totalRevenue: stats.totalGMV,
      revenueGrowth: 12.5, // Logic for growth could be added if past data exists
      activeUsers: stats.activeUsers,
      userGrowth: 8.2,
      totalOrders,
      orderGrowth: 4.5,
      activeStores: stats.totalStores - stats.pendingStores,
      storeGrowth: 3.1,
      conversionRate: 2.8,
      avgOrderValue: totalOrders > 0 ? stats.totalGMV / totalOrders : 0,
      customerRetention: 72,
      topCategories,
      revenueChart,
      userChart,
    };
  }

  async getSettings() {
    return {
      platformName: 'Reluv',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
    };
  }

  private async getDataChart(type: 'revenue' | 'users') {
    const days = 7;
    const chart: { date: string; amount: number; count?: number }[] = [];
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    for (let i = days - 1; i >= 0; i--) {
      const startOfDay = new Date(now);
      startOfDay.setDate(startOfDay.getDate() - i);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);

      let amount = 0;
      let count = 0;

      if (type === 'revenue') {
        const result = await this.prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: {
            createdAt: { gte: startOfDay, lte: endOfDay },
            status: { in: [OrderStatus.PAID, OrderStatus.COMPLETED] },
          },
        });
        amount = result._sum.totalAmount || 0;
      } else {
        count = await this.prisma.user.count({
          where: {
            createdAt: { gte: startOfDay, lte: endOfDay },
          },
        });
        amount = count; // for users, amount is count
      }

      chart.push({
        date: startOfDay.toISOString(),
        amount,
        count: type === 'users' ? count : undefined,
      });
    }
    return chart;
  }
}
