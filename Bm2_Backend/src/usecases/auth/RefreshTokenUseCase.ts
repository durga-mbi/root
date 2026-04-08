import { CustomerRepository } from "../../data/repositories/auth/CustomerRepository";
import AppError from "../../errors/AppError";
import jwt from "jsonwebtoken";
import config from "../../config";

export class RefreshTokenUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(incomingRefreshToken: string): Promise<{
    user: { id: number; mobile: string; name: string };
    tokens: { accessToken: string; refreshToken: string };
  }> {
    if (!incomingRefreshToken) {
      throw AppError.unauthorized("Refresh token is missing");
    }

    let decoded: any;

    try {
      decoded = jwt.verify(incomingRefreshToken, config.jwtRefreshSecret);
    } catch {
      throw AppError.unauthorized("Invalid or expired refresh token");
    }

    const userId = decoded.id;

    const customer = await this.customerRepository.findById(userId);

    if (!customer) {
      throw AppError.unauthorized("User not found");
    }

    //  verify refresh token from DB
    if (customer.refreshToken !== incomingRefreshToken) {
      throw AppError.unauthorized("Invalid refresh token");
    }

    /**
     *   ACCESS TOKEN MUST CONTAIN:
     * id + comId + mobile + role
     */
    const newAccessToken = this.generateAccessToken(
      customer.id,
      customer.comId,
      customer.contactNo ?? "",
      (customer as any).role || "USER",
    );

    const newRefreshToken = this.generateRefreshToken(customer.id);

    await this.customerRepository.saveRefreshToken(
      customer.id,
      newRefreshToken,
    );

    return {
      user: {
        id: customer.id,
        mobile: customer.contactNo ?? "",
        name: customer.fullName ?? "",
      },
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  /**
   *   ACCESS TOKEN
   */
  private generateAccessToken(
    id: number,
    comId: number,
    mobile: string,
    role: string,
  ): string {
    return jwt.sign(
      {
        id,
        comId,
        mobile,
        role,
      },
      config.jwtAccessSecret,
      { expiresIn: "15m" },
    );
  }

  /**
   *   REFRESH TOKEN
   */
  private generateRefreshToken(id: number): string {
    return jwt.sign({ id }, config.jwtRefreshSecret, { expiresIn: "7d" });
  }
}
