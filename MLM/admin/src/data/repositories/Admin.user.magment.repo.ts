import { UpdateUserDto } from "@/dto";
import prisma from "@/prisma-client";
import { Status } from "@prisma/client";

export const getUsersRepo = async (search?: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { memberId: { contains: search } },
          { email: { contains: search } },
          { mobile: { contains: search } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      memberId: true,
      email: true,
      mobile: true,
      status: true,
      kycStatus: true,
      createdAt: true,
    },
  });

  const total = await prisma.user.count({ where });

  return { users, total };
};

export const userStatusRepo = (id: number, status: Status) => {
  return prisma.user.update({
    where: { id },
    data: { status },
  });
};

export const updateUserRepo = (id: number, data: UpdateUserDto) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const getUserHierarchyRepo = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      memberId: true,
      firstName: true,
      lastName: true,
      mobile: true,
      email: true,
      lineagePath: true,
      sponsorId: true,
      parentId: true,
      leftChildId: true,
      rightChildId: true,
      sponsor: {
        select: { id: true, memberId: true, firstName: true, lastName: true },
      },
      parent: {
        select: { id: true, memberId: true, firstName: true, lastName: true },
      },
      leftChild: {
        select: { id: true, memberId: true, firstName: true, lastName: true },
      },
      rightChild: {
        select: { id: true, memberId: true, firstName: true, lastName: true },
      },
    },
  });
};

export const getUserDirectsRepo = async (userId: number) => {
  return prisma.user.findMany({
    where: { sponsorId: userId },
    select: {
      id: true,
      memberId: true,
      firstName: true,
      lastName: true,
      mobile: true,
      status: true,
      createdAt: true,
    },
  });
};

export const getUsersByIdsRepo = async (ids: number[]) => {
  return prisma.user.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      memberId: true,
      firstName: true,
      lastName: true,
      mobile: true,
      status: true,
    },
  });
};
