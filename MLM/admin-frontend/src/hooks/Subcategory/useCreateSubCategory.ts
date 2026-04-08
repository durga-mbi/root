import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubCategoryApi } from "../../api/subcategory.api";
import { toast } from "sonner";

export const useCreateSubCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubCategoryApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subcategories"] });
            toast.success("subcategory created successfully");
        },
    });
};