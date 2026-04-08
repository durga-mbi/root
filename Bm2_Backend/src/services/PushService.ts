import admin from "../config/firebase";

class PushService {
  async sendPush(tokens: string[], title: string, body: string) {
    if (!tokens.length) return;

    const message = {
      notification: {
        title,
        body,
      },
      tokens,
    };

    return admin.messaging().sendEachForMulticast(message);
  }
}

export const pushService = new PushService();
