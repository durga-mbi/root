import { deviceTokenRepository } from "../../data/repositories/notification/DeviceTokenRepository";

class RegisterDeviceUsecase {
  async execute(userId: number, token: string, platform?: string) {
    return deviceTokenRepository.saveToken(userId, token, platform);
  }
}

export const registerDeviceUsecase = new RegisterDeviceUsecase();
