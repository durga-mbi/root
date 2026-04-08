import { useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteSubCategoryApi } from "../../api/subcategory.api";
import { toast } from "sonner";

export const useDeleteSubCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSubCategoryApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subcategories"] });
            toast.success("subcategory deleted successfully");
        },
    });
};