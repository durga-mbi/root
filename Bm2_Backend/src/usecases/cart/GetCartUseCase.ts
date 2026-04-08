import { CartRepository } from "../../data/repositories/cart/CartRepository";

export class GetCartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async execute(comId: number) {
    return this.cartRepository.getCartByComId(comId);
  }
}
