import { BASE_URL } from "../config/api.config";

const getHeaders = () => ({
  "Content-Type": "application/json",
});

// --- Products ---
export const getProductsApi = async (params?: any) => {
  const query = params ? new URLSearchParams(params).toString() : "";
  const res = await fetch(`${BASE_URL}/v1/products?${query}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch products");
  return data;
};

export const getProductDetailsApi = async (id: number) => {
  const res = await fetch(`${BASE_URL}/v1/products/${id}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch product details");
  return data;
};

export const getCategoriesApi = async () => {
  const res = await fetch(`${BASE_URL}/v1/products/categories`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch categories");
  return data;
};

// --- Cart ---
export const getCartApi = async () => {
  const res = await fetch(`${BASE_URL}/v1/cart`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch cart");
  return data;
};

export const addToCartApi = async (productId: number, quantity: number) => {
  const res = await fetch(`${BASE_URL}/v1/cart/add`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify({ productId, quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to add to cart");
  return data;
};

export const updateCartItemApi = async (productId: number, quantity: number) => {
  const res = await fetch(`${BASE_URL}/v1/cart/update`, {
    method: "PUT",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify({ productId, quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to update cart");
  return data;
};

export const removeFromCartApi = async (productId: number) => {
  const res = await fetch(`${BASE_URL}/v1/cart/remove/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to remove item");
  return data;
};

// --- Address ---
export const getAddressesApi = async () => {
  const res = await fetch(`${BASE_URL}/v1/address`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch addresses");
  return data;
};

export const addAddressApi = async (data: any) => {
  const res = await fetch(`${BASE_URL}/v1/address`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData.error?.message || "Failed to add address");
  return responseData;
};

// --- Orders ---
export const placeOrderApi = async (data: any) => {
  const res = await fetch(`${BASE_URL}/v1/order`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData.error?.message || "Failed to place order");
  return responseData;
};

export const getMyOrdersApi = async () => {
  const res = await fetch(`${BASE_URL}/v1/order`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch orders");
  return data;
};

export const getOrderDetailsApi = async (id: number) => {
  const res = await fetch(`${BASE_URL}/v1/order/${id}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch order details");
  return data;
};

// --- Reviews ---
export const addReviewApi = async (data: any) => {
  const res = await fetch(`${BASE_URL}/v1/products/review`, {
    method: "POST",
    headers: getHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  if (!res.ok) throw new Error(responseData.error?.message || "Failed to add review");
  return responseData;
};

export const getMyPayoutsApi = async (page: number, limit: number) => {
  const res = await fetch(`${BASE_URL}/v1/payout?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch payouts");
  return data;
};

export const getConfigApi = async () => {
  const res = await fetch(`${BASE_URL}/v1/config`, {
    method: "GET",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Failed to fetch config");
  return data;
};
