import { CustomerRepository } from "../../data/repositories/auth/CustomerRepository";
import AppError from "../../errors/AppError";
import { generateOtp, hashOtp } from "../../util/crypto";
import config from "../../config";
import { mailer } from "../../services/mailer";

export class ResendOtpUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(mobileInput: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const mobile = mobileInput?.trim();

    if (!mobile) {
      throw AppError.badRequest("mobile number is required");
    }

    const customer = await this.customerRepository.findByMobile(mobile);

    if (!customer) {
      throw AppError.notFound("user not found");
    }

    //  STRICT RATE LIMIT (60 seconds)
    if (customer.otpValidUpto) {
      const timeSinceLastOtp =
        Date.now() - (customer.otpValidUpto.getTime() - 10 * 60000);

      if (timeSinceLastOtp < 60 * 1000) {
        throw AppError.tooManyRequests(
          "please wait 60 seconds before requesting a new otp",
        );
      }
    }

    const otp =
      config.env === "development" || config.env === "dev"
        ? "111111"
        : generateOtp();

    const hashedOtp = hashOtp(otp);
    const otpValidUpto = new Date(Date.now() + 10 * 60000);

    await this.customerRepository.updateOtp(
      customer.id,
      hashedOtp,
      otpValidUpto,
    );

    if (customer.emailId) {
      try {
        await mailer.send({
          to: customer.emailId,
          subject: "Your BM2MALL OTP (Resend)",
          text: `Your new OTP is ${otp}. It is valid for 10 minutes.`,
          html: `<p>Your new OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
        });
      } catch (err) {
        console.error("Failed to send resend OTP email:", err);
      }
    }

    console.log(`[MOCK SMS] Resend OTP for ${mobile} is ${otp}`);

    return {
      success: true,
      message: " OTP resent successfully",
    };
  }
}
