import { CartRepository } from "../../data/repositories/cart/CartRepository";

export class UpdateCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute(comId: number, ItemId: number, quantity: number) {
    return this.cartRepository.updateQuantity(comId, ItemId, quantity);
  }
}
