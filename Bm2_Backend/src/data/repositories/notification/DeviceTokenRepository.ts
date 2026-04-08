import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class DeviceTokenRepository {
  async saveToken(userId: number, token: string, platform?: string) {
    return prisma.deviceToken.upsert({
      where: { token },
      update: {
        userId,
        platform,
      },
      create: {
        userId,
        token,
        platform,
      },
    });
  }

  async getTokensByUser(userId: number) {
    const devices = await prisma.deviceToken.findMany({
      where: { userId },
    });

    return devices.map((d) => d.token);
  }

  async getAllTokens() {
    const devices = await prisma.deviceToken.findMany();

    return devices.map((d) => d.token);
  }
}

export const deviceTokenRepository = new DeviceTokenRepository();
