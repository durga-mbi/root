import prisma from "../../../prisma-client";
import { Customer, aa13_customer_db_status, Prisma } from "@prisma/client";

export class CustomerRepository {
  async findByMobile(mobile: string): Promise<Customer | null> {
    return prisma.customer.findFirst({
      where: { contactNo: mobile },
    });
  }

  async create(data: Partial<Customer>): Promise<Customer> {
    return prisma.customer.create({
      data: data as any,
    });
  }

  async findById(id: number): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { id },
    });
  }

  async updateOtp(
    id: number,
    otp: string | null,
    otpValidUpto: Date | null,
  ): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data: {
        otp,
        otpValidUpto,
      },
    });
  }

  async saveRefreshToken(
    id: number,
    refreshToken: string | null,
  ): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data: { refreshToken } as Prisma.CustomerUpdateInput,
    });
  }

  async clearRefreshToken(id: number): Promise<void> {
    await prisma.customer.update({
      where: { id },
      data: { refreshToken: null } as Prisma.CustomerUpdateInput,
    });
  }

  async createCustomerWithoutOtp(data: {
    contactNo: string;
    fullName: string;
    email: string;
  }): Promise<Customer> {
    const uniqueComId = Math.floor(Math.random() * 2100000000); // Max safe 32-bit integer workaround

    return prisma.customer.create({
      data: {
        comId: uniqueComId,
        contactNo: data.contactNo,
        fullName: data.fullName,
        emailId: data.email,
        indate: new Date(),
        status: aa13_customer_db_status.ONE,
      } as Prisma.CustomerCreateInput,
    });
  }

  async updateProfile(
    id: number,
    data: {
      fullName?: string;
      email?: string;
      mobile?: string;
      profileImage?: string;
    },
  ): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data: {
        fullName: data.fullName,
        emailId: data.email,
        contactNo: data.mobile,
        profileImage: data.profileImage,
        status: aa13_customer_db_status.ONE,
      } as any,
    });
  }
}
