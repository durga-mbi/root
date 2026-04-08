import { deviceTokenRepository } from "../../data/repositories/notification/DeviceTokenRepository";

class SendNotificationUsecase {
  async execute(title: string, message: string) {
    const tokens = await deviceTokenRepository.getAllTokens();
    // Firebase/Push removed as requested
    console.log(`Notification trigger: ${title} - ${message} (Target tokens: ${tokens.length})`);
    return { success: true, message: "Notification triggered (FCM disabled)" };
  }
}

export const sendNotificationUsecase = new SendNotificationUsecase();
