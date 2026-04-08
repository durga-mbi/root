import { useQuery } from "@tanstack/react-query";
import { getBrandsApi } from "../../api/brand.api";

export const useGetBrands = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ["brands", page, limit],
        queryFn: () => getBrandsApi(page, limit),
    });
};