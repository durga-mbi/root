import { useQuery } from "@tanstack/react-query";
import { getWalletHistory } from "../../api/wallet.api";

export const useWalletHistory = () => {
  return useQuery({
    queryKey: ["walletHistory"],
    queryFn: async () => {
      const response = await getWalletHistory();
      if (response?.success) {
        return response.data;
      }
      return [];
    },
  });
};
