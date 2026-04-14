import { CartRepository } from "../../data/repositories/cart/CartRepository";

export class UpdateCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute(comId: number, ProductId: number, quantity: number) {
    return this.cartRepository.updateQuantity(comId, ProductId, quantity);
  }
}
