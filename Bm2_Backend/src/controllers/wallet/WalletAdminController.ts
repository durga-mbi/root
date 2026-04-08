import { Request, Response } from "express";
import { WalletRepository } from "../../data/repositories/wallet/WalletRepository";
import { WalletService } from "../../services/WalletService";

const repo = new WalletRepository();
const service = new WalletService();

export class WalletAdminController {
  /**
   * GET /v1/admin/wallet/config
   */
  static async getConfig(req: Request, res: Response): Promise<void> {
    try {
      const config = await repo.getActiveConfig();
      res.status(200).json({ success: true, data: config });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * PUT /v1/admin/wallet/config
   */
  static async updateConfig(req: Request, res: Response): Promise<void> {
    try {
      const {
        minEligibleAmount,
        maxEligibleAmount,
        rewardPercentMin,
        rewardPercentMax,
        maxCoinsPerOrder,
        redeemPercentLimit,
        returnPeriodDays,
      } = req.body;

      if (rewardPercentMax < rewardPercentMin) {
        res.status(400).json({
          success: false,
          message: "Max percent cannot be less than min percent",
        });
        return;
      }

      const nextConfig = await repo.createConfig({
        minEligibleAmount: parseFloat(minEligibleAmount),
        maxEligibleAmount: parseFloat(maxEligibleAmount),
        rewardPercentMin: parseFloat(rewardPercentMin),
        rewardPercentMax: parseFloat(rewardPercentMax),
        maxCoinsPerOrder: parseInt(maxCoinsPerOrder),
        redeemPercentLimit: parseFloat(redeemPercentLimit),
        returnPeriodDays: parseInt(returnPeriodDays),
      });

      res.status(200).json({
        success: true,
        message: "Config updated to new version",
        data: nextConfig,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /v1/admin/wallet/analytics
   */
  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = await repo.getLiabilityMetrics();
      res.status(200).json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /v1/admin/wallet/negative-accounts
   */
  static async getNegativeAccounts(req: Request, res: Response): Promise<void> {
    try {
      const accounts = await repo.getNegativeAccounts();
      res.status(200).json({ success: true, data: accounts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /v1/admin/wallet/trigger-activation
   */
  static async triggerActivation(req: Request, res: Response): Promise<void> {
    try {
      const count = await service.activatePendingCoins();
      res
        .status(200)
        .json({ success: true, message: `Processed ${count} activations` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
