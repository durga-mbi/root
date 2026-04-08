// useUpdateBrand.ts
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateBrandApi } from "../../api/brand.api";
import { toast } from "sonner";

export const useUpdateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: any }) =>
            updateBrandApi(id, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            toast.success("Brand updated successfull");
        },
    });
};