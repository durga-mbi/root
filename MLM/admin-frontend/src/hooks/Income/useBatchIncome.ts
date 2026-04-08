import { useQuery } from "@tanstack/react-query";
import { getBatchIncomeApi } from "../../api/income.api";

export const useBatchIncome = (
    batchId: string | undefined,
    page: number,
    limit: number
) => {
    return useQuery({
        queryKey: ["batch-income", batchId, page, limit],
        queryFn: () => getBatchIncomeApi(batchId!, page, limit),
        enabled: !!batchId,
    });
};
