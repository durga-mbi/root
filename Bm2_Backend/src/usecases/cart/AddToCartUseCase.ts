import { CartRepository } from "../../data/repositories/cart/CartRepository";

export class AddToCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute(comId: number, ItemId: number, quantity: number) {
    if (!ItemId) throw new Error("Product ID required");

    return this.cartRepository.addToCart(comId, ItemId, quantity);
  }
}
