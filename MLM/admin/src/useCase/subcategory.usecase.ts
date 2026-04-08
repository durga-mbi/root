import {
  createSubCategoryRepo,
  deleteSubCategoryRepo,
  getSubCategoryRepo,
  updateSubCategoryRepo,
} from "@/data/repositories/subcategory.repo";
import { CreateSubCategoryDTO, UpdateSubCategoryDTO } from "@/dto";

export const createSubCategoryUsecase = async (data: CreateSubCategoryDTO) => {
  const subcategory = await createSubCategoryRepo(data);

  return {
    message: "SubCategory created successfully",
    data: subcategory,
  };
};

export const getSubCategoryusecase = async (page: number, limit: number) => {
  const result = await getSubCategoryRepo(page, limit);

  return {
    page,
    limit,
    total: result.total,
    data: result.data,
  };
};

export const updateSubCategoryUsecase = async (
  id: number,
  data: UpdateSubCategoryDTO,
) => {
  const subcategory = await updateSubCategoryRepo(id, data);

  return {
    message: "SubCategory updated successfully",
    data: subcategory,
  };
};
export const deleteSubcategoryUsecase = async (id: number) => {
  return await deleteSubCategoryRepo(id);
};
