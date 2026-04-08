import prisma from "../../prisma-client";

export const addToCart = async (userId: number, productId: number, quantity: number) => {
  return prisma.cart.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      userId,
      productId,
      quantity,
    },
  });
};

export const updateCartItem = async (userId: number, productId: number, quantity: number) => {
  return prisma.cart.update({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    data: { quantity },
  });
};

export const removeFromCart = async (userId: number, productId: number) => {
  return prisma.cart.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};

export const clearCart = async (userId: number) => {
  return prisma.cart.deleteMany({
    where: { userId },
  });
};

export const getCartItems = async (userId: number) => {
  return prisma.cart.findMany({
    where: { userId },
    include: {
      product: true,
    },
  });
};
