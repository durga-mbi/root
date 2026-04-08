import { deviceTokenRepository } from "../../data/repositories/notification/DeviceTokenRepository";
import { pushService } from "../../services/PushService";

class SendNotificationUsecase {
  async execute(title: string, message: string) {
    const tokens = await deviceTokenRepository.getAllTokens();

    return pushService.sendPush(tokens, title, message);
  }
}

export const sendNotificationUsecase = new SendNotificationUsecase();
