import { deviceTokenRepository } from "../../data/repositories/notification/DeviceTokenRepository";
import { notificationRepository } from "../../data/repositories/notification/NotificationRepository";

class SendUserNotificationUsecase {
  async execute(userId: number, title: string, message: string, type: string) {
    const tokens = await deviceTokenRepository.getTokensByUser(userId);
    // Firebase/Push removed as requested
    console.log(`User notification trigger: ${title} for user ${userId} (Target tokens: ${tokens.length})`);

    return notificationRepository.createNotification(
      userId,
      title,
      message,
      type,
    );
  }
}

export const sendUserNotificationUsecase = new SendUserNotificationUsecase();
