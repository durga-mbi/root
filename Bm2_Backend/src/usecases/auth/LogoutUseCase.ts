import { CustomerRepository } from "../../data/repositories/auth/CustomerRepository";
import AppError from "../../errors/AppError";

export class LogoutUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(
    userId: number,
  ): Promise<{ success: boolean; message: string }> {
    if (!userId) {
      throw AppError.unauthorized("invalid session");
    }

    await this.customerRepository.clearRefreshToken(userId);

    return {
      success: true,
      message: "Logged out successfully",
    };
  }
}
