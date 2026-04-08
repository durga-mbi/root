import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/authenticate-user";
import { registerDeviceUsecase } from "../../usecases/notification/RegisterDeviceUseCase";
import { sendNotificationUsecase } from "../../usecases/notification/SendNotificationUseCase";

export class NotificationController {
  static async registerDevice(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { token, platform } = req.body;

      const result = await registerDeviceUsecase.execute(
        userId,
        token,
        platform,
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error in registerDevice:", error);
      res.status(500).json({
        success: false,
        message: "Failed to register device token",
      });
    }
  }

  static async sendNotification(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { title, message } = req.body;

      const result = await sendNotificationUsecase.execute(title, message);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("Error in sendNotification:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send notification",
      });
    }
  }
}
