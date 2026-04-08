import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateSubCategoryApi } from "../../api/subcategory.api";
import { toast } from "sonner";

export const useUpdateSubCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: any }) =>
            updateSubCategoryApi(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subcategories"] });
            toast.success("subcategory updated successfully");
        },
    });
};