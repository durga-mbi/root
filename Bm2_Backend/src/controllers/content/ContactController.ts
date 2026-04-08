import { Request, Response } from "express";
import { AdminContentRepository } from "../../data/repositories/content/AdminContentRepository";

const repo = new AdminContentRepository();

export class ContactController {
  /**
   * GET /v1/contact/info
   */
  static async getInfo(req: Request, res: Response): Promise<void> {
    try {
      const content = await repo.getContentBySlug("contact-info");
      let data = {};
      if (content?.content) {
        try {
          data = JSON.parse(content.content);
        } catch (e) {
          data = { raw: content.content };
        }
      }

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /v1/contact/enquiry
   */
  static async submitEnquiry(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email, phone, subject, message } = req.body;

      if (!fullName || !email || !message) {
        res.status(400).json({
          success: false,
          message: "Full name, email, and message are required.",
        });
        return;
      }

      await repo.saveEnquiry({ fullName, email, phone, subject, message });

      res.status(201).json({
        success: true,
        message:
          "Enquiry submitted successfully. We will get back to you soon.",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
