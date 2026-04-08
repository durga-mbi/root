import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryApi } from "../../api/category.api";

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategoryApi,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};