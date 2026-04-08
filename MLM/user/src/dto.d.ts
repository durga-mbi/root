import { Prisma } from "@prisma/client";

//user dto
export interface UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  memberId: string | null;

  sponsorId: number | null;
  parentId: number | null;
  legPosition: "LEFT" | "RIGHT" | null;

  leftChildId?: number;
  rightChildId?: number;
  lastLeftId?: number;
  lastRightId?: number;

  lineagePath: string;
  directCount: number;

  kycStatus: "PENDING" | "APPROVED" | "REJECT";
  status: "ACTIVE" | "INACTIVE";

  createdAt: Date;
  updatedAt: Date;

  sponsor?: {
    id: number;
    fullName: string;
    email: string;
  } | null;

  parent?: {
    id: number;
    fullName: string;
    email: string;
  } | null;
}

//user by id repsonse dto
export interface getUserByIdResDTO {
  id: number;
  uId: number | null;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  memberId: string;
  legPosition: string;
  status: "ACTIVE" | "INACTIVE";
  kycStatus: "PENDING" | "APPROVED" | "REJECT";
  //useShare?: boolean;
  // firstname,lastname , mobile, email,memberid,legposition,status
}

//kyc dto
export interface KycResponseDto {
  id: number;
  userId: number;

  aadharNo: string;
  aadharImgUrl: string;

  panNo: string;
  panImageUrl: string;

  bankName: string;
  accountNo: string;
  ifscCode: string;
  branchName: string;
  bankProofImgUrl: string;

  status: "PENDING" | "APPROVED" | "REJECT";
  rejectReason: string | null;

  createdAt: Date;
  updatedAt: Date;

  user?: {
    id: number;
    fullName: string;
    email: string;
    mobile: string;
  } | null;
}

//planmaster
export interface PlansMasterResponseDto {
  id: number;
  planName: string;
  Description: string;

  BV: Prisma.Decimal;
  price: Prisma.Decimal;
  dp_amount: Prisma.Decimal;

  status: "ACTIVE" | "INACTIVE";

  createdAt: Date;
  updatedAt: Date;

  purchasesCount?: number;
}

//plan purchase
export interface PlanPurchaseResponseDto {
  id: number;

  plan_id: number;
  user_id: number;

  BV: Prisma.Decimal;
  plan_amount: Prisma.Decimal;
  dp_amount: Prisma.Decimal;

  payment_mode: string;
  payment_proof_uri: string;

  purchase_type: "FIRST_PURCHASE" | "REPURCHASE" | "SHARE_PURCHASE";
  is_income_generated: "YES" | "NO";
  status: "PENDING" | "APPROVED" | "REJECTED";

  approved_by: number | null;
  approved_at: Date;

  createdAt: Date;
  updatedAt: Date;

  createdBy: string;
  updatedBy: string;

  plan?: {
    id: number;
    planName: string;
    plan_amount: Prisma.Decimal;
    BV: Prisma.Decimal;
  } | null;

  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
  } | null;

  approvedByAdmin?: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
}

//user activity
export interface CreateUserActivityLogDTO {
  userId?: number | null;
  action?: string | null;
  details?: string | null;
}

export interface GetLogsDTO {
  userId?: number;
  action?: string | null;
  skip?: number;
  take?: number;
}
