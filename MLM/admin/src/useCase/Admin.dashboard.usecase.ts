import { getDashboardStatsRepo } from "@/data/repositories/Admin.dashboard.repo";

export const dasbordUsecase = async () => {
  return await getDashboardStatsRepo();
};
