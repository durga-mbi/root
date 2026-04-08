import { CartRepository } from "../../data/repositories/cart/CartRepository";

export class DeleteCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute(comId: number, ItemId: number) {
    return this.cartRepository.removeCartItem(comId, ItemId);
  }
}
