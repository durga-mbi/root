import { BASE_URL } from "../config/api.config";

export const getAllOrdersApi = async (page: number, limit: number) => {
  const res = await fetch(`${BASE_URL}/v1/orders?page=${page}&limit=${limit}`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const getOrderByIdApi = async (id: number) => {
  const res = await fetch(`${BASE_URL}/v1/orders/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const updateOrderStatusApi = async (id: number, status: string) => {
  const res = await fetch(`${BASE_URL}/v1/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  return res.json();
};
