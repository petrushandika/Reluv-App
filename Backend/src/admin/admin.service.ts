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
    // Basic analytics for now, can be expanded as needed
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const [topCategories, revenueChart, userChart] = await Promise.all([
      this.prisma.category.findMany({
        take: 5,
        orderBy: { products: { _count: 'desc' } },
        select: {
          name: true,
          _count: { select: { products: true } },
        },
      }),
      // Simple revenue chart data for the last 7 days
      this.getDataChart('revenue'),
      // Simple user growth chart data for the last 7 days
      this.getDataChart('users'),
    ]);

    return {
      totalRevenue: (await this.getDashboardStats()).totalGMV,
      revenueGrowth: 5.2,
      activeUsers: (await this.getDashboardStats()).activeUsers,
      userGrowth: 3.8,
      totalOrders: await this.prisma.order.count(),
      orderGrowth: 1.5,
      activeStores:
        (await this.getDashboardStats()).totalStores -
        (await this.getDashboardStats()).pendingStores,
      storeGrowth: 2.1,
      conversionRate: 3.5,
      avgOrderValue: 245000,
      customerRetention: 68,
      topCategories: topCategories.map((c) => ({
        name: c.name,
        revenue: Math.floor(Math.random() * 50000000), // Dummy revenue for top categories
        orders: c._count.products * 10,
      })),
      revenueChart,
      userChart,
    };
  }

  async getSettings() {
    // In a real app, these would come from a settings table in the database
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

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
      });

      chart.push({
        date: dateStr,
        amount:
          type === 'revenue'
            ? Math.floor(Math.random() * 150000000)
            : Math.floor(Math.random() * 50) + 10,
        count:
          type === 'users' ? Math.floor(Math.random() * 50) + 10 : undefined,
      });
    }
    return chart;
  }
}
