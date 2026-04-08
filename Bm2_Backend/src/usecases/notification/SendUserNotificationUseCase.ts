import { deviceTokenRepository } from "../../data/repositories/notification/DeviceTokenRepository";
import { pushService } from "../../services/PushService";
import { notificationRepository } from "../../data/repositories/notification/NotificationRepository";

class SendUserNotificationUsecase {
  async execute(userId: number, title: string, message: string, type: string) {
    const tokens = await deviceTokenRepository.getTokensByUser(userId);

    await pushService.sendPush(tokens, title, message);

    return notificationRepository.createNotification(
      userId,
      title,
      message,
      type,
    );
  }
}

export const sendUserNotificationUsecase = new SendUserNotificationUsecase();
