import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createProductApi } from "../../api/product.api";
import { toast } from "sonner";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProductApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product created successfully");
        },
    });
};