import prisma from "../../../prisma-client";

export class AdminContentRepository {
  async getContentBySlug(slug: string) {
    return (prisma as any).appContent.findUnique({
      where: { slug },
    });
  }

  async saveEnquiry(data: {
    fullName: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) {
    return (prisma as any).enquiry.create({
      data: {
        ...data,
        status: "PENDING",
      },
    });
  }
}
