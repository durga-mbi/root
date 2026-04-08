export type AutoMemIdMode = "STATIC" | "DYNAMIC";

export interface ConfigPayload {
  autoMemId: AutoMemIdMode;
  userRegistrationNo: number;
  prefixMemId: string;
  minLength: number;
  incomeCommission: number;
  royaltyCommission: number;
  plan_config_value?: string; // "0" for AUTO, "1" for MANUALADMIN
  tds?: number;
  admincharges?: number;
  royalPlanIds?: number[];
  activePlanIds?: number[];
  royalQualifierPlans?: any[];
}