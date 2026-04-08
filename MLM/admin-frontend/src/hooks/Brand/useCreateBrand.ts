import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrandApi } from "../../api/brand.api";
import { toast } from "sonner";

export const useCreateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBrandApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            toast.success("Brand creation successfull")
        },
        onError: () => {
            toast.error("Brand creation failed");
        }
    });
};