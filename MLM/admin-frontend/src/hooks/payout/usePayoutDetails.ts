import { useQuery } from "@tanstack/react-query";
import { getPayoutDetailsApi } from "../../api/payout.api";

export const usePayoutDetails = (id: string | undefined, page: number, limit: number) => {
  return useQuery({
    queryKey: ["payout-details", id, page, limit],
    queryFn: () => getPayoutDetailsApi(id!, page, limit),
    enabled: !!id,
  });
};
