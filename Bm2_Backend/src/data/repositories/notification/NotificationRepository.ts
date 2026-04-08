import { Prisma } from "@prisma/client";
import prisma from "../../../prisma-client";

export class NotificationRepository {
  async createNotification(
    userId: number,
    title: string,
    message: string,
    type: string,
  ) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });
  }

  async getNotificationsByUser(userId: number, skip = 0, take = 20) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  async getUnreadCount(userId: number) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: number, userId: number) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: number) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async deleteNotification(id: number, userId: number) {
    return prisma.notification.deleteMany({
      where: { id, userId },
    });
  }
}

export const notificationRepository = new NotificationRepository();
