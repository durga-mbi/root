import {
  createConfigRepo,
  getConfigRepo,
} from "@/data/repositories/Admin.config.repo";
import { CreateConfigDto } from "@/dto";

export const saveAdminConfigUsecase = async (data: CreateConfigDto) => {
  return await createConfigRepo(data);
};

export const getAdminConfigUsecase = async () => {
  return await getConfigRepo();
};
