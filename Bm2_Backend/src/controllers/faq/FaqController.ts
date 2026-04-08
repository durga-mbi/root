import { Request, Response } from "express";
import { FaqRepository } from "../../data/repositories/faq/FaqRepository";

const repo = new FaqRepository();

export class FaqController {
  /**
   * GET /v1/faq
   */
  static async getFaqs(req: Request, res: Response): Promise<void> {
    try {
      const faqs = await repo.getAllFaqs();
      res.status(200).json({
        success: true,
        data: faqs,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /v1/faq/categories
   */
  static async getFaqCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await repo.getCategories();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
