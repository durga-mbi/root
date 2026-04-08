import { useQuery } from "@tanstack/react-query";
import { getSubCategoriesApi } from "../../api/subcategory.api";

export const useGetSubCategories = (page: number, limit: number) => {
    return useQuery({
        queryKey: ["subcategories", page, limit],
        queryFn: () => getSubCategoriesApi(page, limit),
    });
};