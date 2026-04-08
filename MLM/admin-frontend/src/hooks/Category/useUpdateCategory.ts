import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryApi } from "../../api/category.api";
import { toast } from "sonner";

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: any) =>
            updateCategoryApi(id, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category updated successfully");
        },
    });
};