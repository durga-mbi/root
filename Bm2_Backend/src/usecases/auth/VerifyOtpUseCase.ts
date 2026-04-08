import { CustomerRepository } from "../../data/repositories/auth/CustomerRepository";
import AppError from "../../errors/AppError";
import jwt from "jsonwebtoken";
import config from "../../config";
import { compareOtp } from "../../util/crypto";

export class VerifyOtpUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(
    mobileInput: string,
    otpInput: string,
  ): Promise<{
    user: { id: number; mobile: string; name: string };
    tokens: { accessToken: string; refreshToken: string };
  }> {
    const mobile = mobileInput?.trim();
    if (!mobile || !otpInput) {
      throw AppError.badRequest("Mobile number and otp are required");
    }

    const customer = await this.customerRepository.findByMobile(mobile);

    if (!customer) {
      throw AppError.notFound("User not found");
    }

    if (!customer.otp || !customer.otpValidUpto) {
      throw AppError.badRequest("OTP not generated");
    }

    if (new Date() > customer.otpValidUpto) {
      throw AppError.badRequest("OTP has expired");
    }

    // Validate OTP (Hashing support)
    let isValidOtp = false;
    if (
      (config.env === "development" || config.env === "dev") &&
      otpInput === "111111"
    ) {
      isValidOtp = true;
    } else {
      isValidOtp = await compareOtp(otpInput, customer.otp);
    }

    if (!isValidOtp) {
      throw AppError.badRequest("Invalid otp");
    }

    // Clear OTP immediately after successful verification
    await this.customerRepository.updateOtp(customer.id, null, null);

    if (customer.comId === null || customer.comId === undefined) {
      throw AppError.internal(
        "Customer record is misconfigured (missing comId). Please contact support.",
      );
    }

    const accessToken = this.generateAccessToken(
      customer.id,
      customer.comId,
      customer.contactNo ?? "",
      (customer as any).role || "USER",
    );
    const refreshToken = this.generateRefreshToken(customer.id);

    // Save refresh token to database
    await this.customerRepository.saveRefreshToken(customer.id, refreshToken);

    return {
      user: {
        id: customer.id,
        mobile: customer.contactNo ?? "",
        name: customer.fullName ?? "",
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  private generateAccessToken(
    id: number,
    comId: number,
    mobile: string,
    role: string,
  ): string {
    return jwt.sign({ id, comId, mobile, role }, config.jwtAccessSecret, {
      expiresIn: "15m",
    });
  }

  private generateRefreshToken(id: number): string {
    return jwt.sign({ id }, config.jwtRefreshSecret, { expiresIn: "7d" });
  }
}
