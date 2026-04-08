import { useQuery } from "@tanstack/react-query";
import { getAllOrdersApi } from "../../api/orders.api";

export const useGetOrders = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ["orders", page, limit],
        queryFn: () => getAllOrdersApi(page, limit),
    });
};
