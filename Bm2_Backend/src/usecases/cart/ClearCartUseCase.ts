import { CartRepository } from "../../data/repositories/cart/CartRepository";

export class ClearCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute(comId: number) {
    return this.cartRepository.clearCart(comId);
  }
}
