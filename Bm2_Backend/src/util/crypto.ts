// src/util/crypto.ts
import crypto from "crypto";

/**
 * Generate 6 digit OTP
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash OTP using SHA256
 */
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/**
 * Compare raw OTP with hashed OTP
 */
export function compareOtp(otpInput: string, hashedOtp: string): boolean {
  return hashOtp(otpInput) === hashedOtp;
}
