import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateProductApi } from "../../api/product.api";
import { toast } from "sonner";


export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: any) => updateProductApi(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("product updated successfully");
        },
    });
};