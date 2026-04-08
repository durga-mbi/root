import { useQuery } from "@tanstack/react-query";
import { getCategoryApi } from "../../api/category.api";

export const useGetCategories = (page: number, limit: number) => {
    return useQuery({
        queryKey: ["categories", page, limit],
        queryFn: () => getCategoryApi(page, limit),
    });
};