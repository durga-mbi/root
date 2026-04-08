import { MemIdOption } from "./../node_modules/.prisma/client/index.d";
import { AdminType, Status, KycStatus, ApproveStatus } from "@prisma/client";
import { PlanFeature } from "@/types/plan-feature.type";

export interface CreateAdminDTO {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null | undefined;
  mobile: string;
  address?: string | null;
  username?: string | null;
  password: string;
  adminType?: AdminType;
}

export interface UpdateAdminDTO {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  mobile?: string | null;
  adress?: string | null;
  username?: string | null;
  password?: string | null;
  status?: string | null;
  refreshToken?: string | null;
}

export interface loginDto {
  username?: string | null;
  password?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;

  sponsorId?: number | null;
  parentId?: number | null;
  member_Id?: string | null;

  legPosition?: "LEFT" | "RIGHT" | null;

  kycStatus?: KycStatus;

  updatedBy?: string | null;
}

export type PlanFeatureObj = {
  title: string;
  value?: string;
};

export interface CreatePlanDto {
  planName: string;
  Description: string;
  BV: number;
  price: number;
  dp_amount: number;
  status?: Status;
  features: PlanFeature[];

  createdBy?: string;
  createdByAdminId?: number;
}

export interface UpdatePlanDto {
  planName?: string;
  Description?: string;
  BV?: number;
  price?: number;
  dp_amount?: number;
  status?: Status;
  features?: PlanFeature[];

  updatedBy?: string;
  updatedByAdminId?: number;
}

export interface CreateConfigDto {
  autoMemId?: MemIdOption;
  userRegistrationNo?: number;
  prefixMemId: string;
  minLength: number;
  incomeCommission: number;
  royaltyCommission: number;
  tds?: number;
  admincharges?: number;
  deliveryCharge?: number;
  plan_config_value?: ApproveStatus;
  royalPlanIds?: number[];
  activePlanIds?: number[];
}

export interface CreateCategoryDTO {
  name: string;
  Description: string;
  image: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateCategoryDTO {
  name?: string;
  Description?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CreateSubCategoryDTO {
  categoryId: number;
  name: string;
  Description: string;
  image: string;
}

export interface UpdateSubCategoryDTO {
  name?: string;
  Description?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CreateBrandDTO {
  subcategoryId: number;
  brandname: string;
  image: string;
}

export interface UpdateBrandDTO {
  brandname?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CreateProductDTO {
  productName: string;
  categoryId: number;
  subcategoryId: number;
  brandId: number;

  sku: string;
  dp_amount: number;
  mrp_amount: number;

  description: string;
  specification: string;

  mainImage: string;
  otherImage: string;
}
