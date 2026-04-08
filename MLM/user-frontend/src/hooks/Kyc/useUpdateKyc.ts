import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKyc } from "../../api/kyc.api";

export const useUpdateKyc = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            kycId,
            kycData,
        }: {
            kycId: string;
            kycData: any;
        }) => updateKyc(kycId, kycData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["kyc", "list"],
            });
        },
    });
};