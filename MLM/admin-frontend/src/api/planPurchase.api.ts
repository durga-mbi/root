import { BASE_URL } from "../config/api.config";
import { refreshTokeApi } from "./auth.api";

export const getPendingPlanPurchasesApi = async () => {
  let res = await fetch(`${BASE_URL}/v1/admin/planpurchase/pending`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (res.status === 401) {
    await refreshTokeApi();
    res = await fetch(`${BASE_URL}/v1/admin/planpurchase/pending`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error?.message || json.message || "Failed to fetch pending purchases");
  }

  return json;
};

export const approvePlanPurchaseApi = async (id: number) => {
  let res = await fetch(`${BASE_URL}/v1/admin/planpurchase/approve/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (res.status === 401) {
    await refreshTokeApi();
    res = await fetch(`${BASE_URL}/v1/admin/planpurchase/approve/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error?.message || json.message || "Failed to approve purchase");
  }

  return json;
};

export const rejectPlanPurchaseApi = async (id: number) => {
  let res = await fetch(`${BASE_URL}/v1/admin/planpurchase/reject/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (res.status === 401) {
    await refreshTokeApi();
    res = await fetch(`${BASE_URL}/v1/admin/planpurchase/reject/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error?.message || json.message || "Failed to reject purchase");
  }

  return json;
};
