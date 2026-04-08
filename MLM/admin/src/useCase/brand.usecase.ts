import {
  createBrandRepo,
  deleteBrandRepo,
  getBrandRepo,
  updateBrandRepo,
} from "@/data/repositories/Brand.repo";
import { CreateBrandDTO } from "@/dto";

export const createBrandUsecase = async (data: CreateBrandDTO) => {
  return await createBrandRepo(data);
};
export const getBrandUsecase = async (page: number, limit: number) => {
  const result = await getBrandRepo(page, limit);

  return {
    page,
    limit,
    total: result.total,
    data: result.data,
  };
};

export const updateBrandusease = async (id: number, data: any) => {
  const brand = await updateBrandRepo(id, data);

  return {
    message: "Brand updated successfully",
    data: brand,
  };
};

export const deleteBrandusecase = async (id: number) => {
  return await deleteBrandRepo(id);
};
