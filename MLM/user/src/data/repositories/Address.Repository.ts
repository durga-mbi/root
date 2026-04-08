import prisma from "../../prisma-client";

export const createUserAddress = async (data: {
  userId: number;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  type?: string;
  isDefault?: boolean;
}) => {
  const existingCount = await prisma.userAddress.count({
    where: { userId: data.userId },
  });

  const shouldBeDefault = data.isDefault || existingCount === 0;

  if (shouldBeDefault) {
    await prisma.userAddress.updateMany({
      where: { userId: data.userId },
      data: { isDefault: false },
    });
  }

  return prisma.userAddress.create({
    data: {
      ...data,
      isDefault: shouldBeDefault,
    },
  });
};

export const getUserAddresses = async (userId: number) => {
  return prisma.userAddress.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getAddressById = async (id: number) => {
  return prisma.userAddress.findUnique({
    where: { id },
  });
};

export const updateAddress = async (id: number, data: any) => {
  if (data.isDefault) {
    const address = await prisma.userAddress.findUnique({ where: { id } });
    if (address) {
      await prisma.userAddress.updateMany({
        where: { userId: address.userId },
        data: { isDefault: false },
      });
    }
  }
  return prisma.userAddress.update({
    where: { id },
    data,
  });
};

export const deleteAddress = async (id: number) => {
  return prisma.userAddress.delete({
    where: { id },
  });
};
