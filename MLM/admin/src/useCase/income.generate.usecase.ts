import {
  genincomeGenrepo,
  getIncomeByBatchRepo,
  getIncomeGenarateRepo,
  incomeHistoryRepo,
} from "@/data/repositories/Admin.genIncome.repo";

export const inocomeGenerateUsecase = async () => {
  return await getIncomeGenarateRepo();
};

export const getIncomeByBatchUsecase = async (
  batchId: number,
  page: number,
  limit: number,
) => {
  if (!page || page < 1) page = 1;
  if (!limit) limit = 10;
  return await getIncomeByBatchRepo(batchId, page, limit);
};

export const genincomeUsecase = async (page: number, limit: number) => {
  if (!page || page < 1) page = 1;
  if (!limit) limit = 10;
  if (limit > 100) limit = 100;
  return await genincomeGenrepo(page, limit);
};

export const incomeHistoryUsecase = async (page: number, limit: number) => {
  if (!page || page < 1) page = 1;
  if (!limit) limit = 10;
  if (limit > 100) limit = 100;
  return await incomeHistoryRepo(page, limit);
};
