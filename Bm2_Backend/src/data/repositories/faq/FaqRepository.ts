import prisma from "../../../prisma-client";

export class FaqRepository {
  async getAllFaqs() {
    return (prisma as any).faq.findMany({
      where: { isActive: true },
      orderBy: [{ priority: "desc" }, { id: "asc" }],
    });
  }

  async getCategories() {
    const categories = await (prisma as any).faq.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
    });
    return categories.map((c: any) => c.category);
  }
}
