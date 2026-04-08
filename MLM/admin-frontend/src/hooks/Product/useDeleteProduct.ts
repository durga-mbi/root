import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteProductApi } from "../../api/product.api";
import { toast } from "sonner";

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProductApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product deleted successfully");
        },
    });
};