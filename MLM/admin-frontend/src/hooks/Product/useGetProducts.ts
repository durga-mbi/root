import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../../api/product.api";

export const useGetProducts = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ["products", page, limit],
        queryFn: () => getProductsApi(page, limit),
    });
};
