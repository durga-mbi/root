import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/ecommerce.api";
import { toast } from "sonner";

export const useProducts = (filters?: any) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => api.getProductsApi(filters),
  });
};

export const useProductDetails = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProductDetailsApi(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategoriesApi(),
  });
};

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => api.getCartApi(),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      api.addToCartApi(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item added to cart");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add to cart");
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      api.updateCartItemApi(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => api.removeFromCartApi(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
  });
};

export const useAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => api.getAddressesApi(),
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.addAddressApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added successfully");
    },
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.placeOrderApi(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      return res;
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to place order");
    },
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => api.getMyOrdersApi(),
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => api.getOrderDetailsApi(id),
    enabled: !!id,
  });
};

export const useMyPayouts = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["my-payouts", page, limit],
    queryFn: () => api.getMyPayoutsApi(page, limit),
  });
};

export const useConfig = () => {
  return useQuery({
    queryKey: ["config"],
    queryFn: () => api.getConfigApi(),
  });
};
