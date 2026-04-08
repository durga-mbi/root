import { CustomerRepository } from "../../data/repositories/auth/CustomerRepository";
import AppError from "../../errors/AppError";
import { generateOtp, hashOtp } from "../../util/crypto";
import config from "../../config";
import { mailer } from "../../services/mailer";

export class SendOtpUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(
    mobileInput: string,
  ): Promise<{ success: boolean; message: string }> {
    const mobile = mobileInput?.trim();
    if (!mobile) {
      throw AppError.badRequest("Mobile number is required");
    }

    // Check if user exists
    const customer = await this.customerRepository.findByMobile(mobile);

    if (!customer) {
      throw AppError.notFound(
        "Mobile number not registered. please signup first.",
      );
    }

    // Check for active OTP (Rate limiting - reduced to 1 minute for better UX)
    if (customer.otpValidUpto) {
      const oneMinuteAgo = new Date(Date.now() + 9 * 60000); // 1 minute from creation if total is 10m
      // Actually simpler: allow resend if more than 1 minute has passed since generation
      // But current logic uses validity (10m). Let's just use a fixed 1 min buffer.
      const timeUntilExpiry = customer.otpValidUpto.getTime() - Date.now();
      if (timeUntilExpiry > 9 * 60000) {
        // If more than 9 mins left (means only <1 min passed)
        throw AppError.tooManyRequests(
          "Please wait 60 seconds before requesting a new otp.",
        );
      }
    }

    // Generate OTP
    const otp =
      config.env === "development" || config.env === "dev"
        ? "111111"
        : generateOtp();

    // Hash OTP before storing
    const hashedOtp = await hashOtp(otp);
    const otpValidUpto = new Date(Date.now() + 10 * 60000); // 10 minutes

    await this.customerRepository.updateOtp(
      customer.id,
      hashedOtp,
      otpValidUpto,
    );

    // Send OTP via Email if email exists
    if (customer.emailId) {
      try {
        await mailer.send({
          to: customer.emailId,
          subject: "Your BM2MALL Login OTP",
          text: `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
          html: `<p>Your OTP for login is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
        });
      } catch (err) {
        console.error("Failed to send OTP email:", err);
      }
    }

    // Mock SMS
    console.log(`[MOCK SMS] OTP for ${mobile} is ${otp}`);

    return {
      success: true,
      message: "OTP sent successfully",
    };
  }
}
