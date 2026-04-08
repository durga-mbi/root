import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatusApi } from "../../api/orders.api";
import { toast } from "sonner";

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            updateOrderStatusApi(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("Order status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update order status");
        }
    });
};
