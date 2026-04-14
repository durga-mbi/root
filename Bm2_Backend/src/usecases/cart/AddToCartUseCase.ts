import { CartRepository } from "../../data/repositories/cart/CartRepository";

export class AddToCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute(comId: number, ProductId: number, quantity: number) {
    if (!ProductId) throw new Error("Product ID required");

    return this.cartRepository.addToCart(comId, ProductId, quantity);
  }
}
