import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteBrandApi } from "../../api/brand.api";
import { toast } from "sonner";

export const useDeleteBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteBrandApi(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            toast.success("Brand deletion successfull");
        },
    });
};