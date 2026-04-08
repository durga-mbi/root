import prisma from "../../../prisma-client";
import { UserAddress as PrismaUserAddress, Prisma } from "@prisma/client";

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: number | null;
}

export interface CreateUserAddressData {
  customerId?: number;
  address?: string;
  townCity?: string;
  pincode?: string;
  receiversName?: string;
  receiversNumber?: string;
  saveAs?: string;
  createdBy?: number;
}

export interface UpdateUserAddressData {
  customerId?: number;
  address?: string;
  townCity?: string;
  pincode?: string;
  receiversName?: string;
  receiversNumber?: string;
  saveAs?: string;
  updatedBy?: number;
}

export const getUserAddressById = async (
  id: number,
): Promise<PrismaUserAddress | null> => {
  return prisma.userAddress.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          emailId: true,
        },
      },
    },
  });
};

export const getUserAddressesByCustomerId = async (
  customerId: number,
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<PrismaUserAddress>> => {
  const take = limit + 1;

  const where: Prisma.UserAddressWhereInput = { userId: customerId };
  const addresses = await prisma.userAddress.findMany({
    where: cursor ? { ...where, id: { lt: cursor } } : where,
    orderBy: { createdAt: "desc" },
    take,
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          emailId: true,
        },
      },
    },
  });

  const hasMore = addresses.length > limit;
  const data = hasMore ? addresses.slice(0, limit) : addresses;
  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return { data, nextCursor };
};

export const getAllUserAddresses = async (
  limit: number = 20,
  cursor?: number,
): Promise<CursorPaginationResult<PrismaUserAddress>> => {
  const take = limit + 1;

  const addresses = await prisma.userAddress.findMany({
    where: cursor ? { id: { lt: cursor } } : undefined,
    orderBy: { createdAt: "desc" },
    take,
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          emailId: true,
        },
      },
    },
  });

  const hasMore = addresses.length > limit;
  const data = hasMore ? addresses.slice(0, limit) : addresses;
  const nextCursor =
    hasMore && data.length > 0 ? data[data.length - 1].id : null;

  return { data, nextCursor };
};

export const createUserAddress = async (
  data: CreateUserAddressData,
): Promise<PrismaUserAddress> => {
  return prisma.userAddress.create({
    data: {
      userId: data.customerId,
      address: data.address,
      townCity: data.townCity,
      pincode: data.pincode,
      receiversName: data.receiversName,
      receiversNumber: data.receiversNumber,
      saveAs: data.saveAs,
      createdBy: data.createdBy,
    },
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          emailId: true,
        },
      },
    },
  });
};

export const updateUserAddress = async (
  id: number,
  data: UpdateUserAddressData,
): Promise<PrismaUserAddress> => {
  return prisma.userAddress.update({
    where: { id },
    data: {
      userId: data.customerId,
      address: data.address,
      townCity: data.townCity,
      pincode: data.pincode,
      receiversName: data.receiversName,
      receiversNumber: data.receiversNumber,
      saveAs: data.saveAs,
      updatedBy: data.updatedBy,
    },
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          emailId: true,
        },
      },
    },
  });
};

export const deleteUserAddress = async (
  id: number,
): Promise<PrismaUserAddress> => {
  return prisma.userAddress.delete({
    where: { id },
  });
};
