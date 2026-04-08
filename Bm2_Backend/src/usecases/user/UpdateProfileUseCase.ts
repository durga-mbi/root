import { CustomerRepository } from "../../data/repositories/auth/CustomerRepository";
import AppError from "../../errors/AppError";

interface UpdateProfileInput {
  fullName?: string;
  email?: string;
  profileImage?: string;
}

export class UpdateProfileUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(userId: number, data: UpdateProfileInput) {
    // 1. Check if user exists
    const user = await this.customerRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("User not found");
    }

    // 2. Mobile number cannot be updated via this API
    // if (data.mobile && data.mobile !== user.contactNo) { ... }

    // 3. Update profile
    const updatedUser = await this.customerRepository.updateProfile(userId, {
      fullName: data.fullName,
      email: data.email,
      profileImage: data.profileImage,
    });

    return {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.emailId,
      mobile: updatedUser.contactNo,
      profileImage: (updatedUser as any).profileImage,
    };
  }
}
