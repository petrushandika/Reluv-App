import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryNotificationDto } from './dto/query-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: number, queryDto: QueryNotificationDto) {
    const { page = 1, limit = 15 } = queryDto;
    const skip = (page - 1) * limit;

    const [notifications, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          body: true,
          type: true,
          data: true,
          isRead: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(userId: number, notificationId: number) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
      select: { id: true, isRead: true },
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification with ID ${notificationId} not found for this user.`,
      );
    }

    if (notification.isRead) {
      return this.prisma.notification.findUnique({
        where: { id: notificationId },
        select: {
          id: true,
          title: true,
          body: true,
          type: true,
          data: true,
          isRead: true,
          createdAt: true,
        },
      });
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
      select: {
        id: true,
        title: true,
        body: true,
        type: true,
        data: true,
        isRead: true,
        createdAt: true,
      },
    });
  }

  async markAllAsRead(userId: number) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return {
      message: `${result.count} notifications marked as read.`,
    };
  }
}
