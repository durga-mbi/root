import { CustomerRepository } from "../../data/repositories/auth/CustomerRepository";
import AppError from "../../errors/AppError";

export class GetProfileUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(userId: number) {
    const user = await this.customerRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("User not found");
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.emailId,
      mobile: user.contactNo,
      profileImage: (user as any).profileImage,
    };
  }
}
