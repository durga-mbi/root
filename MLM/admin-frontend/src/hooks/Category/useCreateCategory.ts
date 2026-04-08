import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryApi } from "../../api/category.api";

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCategoryApi,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};