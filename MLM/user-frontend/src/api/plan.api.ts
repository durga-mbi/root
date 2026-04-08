import { BASE_URL } from "../config/api.config";
import { regenAccessTokenApi } from "./user.api";

export interface Purchase {
  id: string;
  planName: string;
  amount: number;
  status: "APPROVED" | "REJECTED" | "PENDING";
  createdAt: string;
}

export interface GetPurchasesResponse {
  success: boolean;
  purchases: Purchase[];
  total: number;
}

// Get all plans
export const getPlans = async () => {
  try {
    let res = await fetch(`${BASE_URL}/v1/package`, {
      method: "GET",
      credentials: "include",
    });

    // Retry if access token expired
    if (res.status === 401) {
      try {
        await regenAccessTokenApi();
        res = await fetch(`${BASE_URL}/v1/package`, {
          method: "GET",
          credentials: "include",
        });
      } catch {
        window.location.href = "/login";
        throw new Error("Session expired");
      }
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to fetch plans");

    return data.data;
  } catch (err: any) {
    console.error("getPlans error:", err.message || err);
    throw err;
  }
};

// Get purchases by user
export const getPurchasesByUser = async (): Promise<GetPurchasesResponse> => {
  try {
    let res = await fetch(`${BASE_URL}/v1/planpurchase/my-purchases`, {
      method: "GET",
      credentials: "include",
    });

    // Retry if access token expired
    if (res.status === 401) {
      try {
        await regenAccessTokenApi();
        res = await fetch(`${BASE_URL}/v1/planpurchase/my-purchases`, {
          method: "GET",
          credentials: "include",
        });
      } catch {
        window.location.href = "/login";
        throw new Error("Session expired");
      }
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to fetch purchases");

    return data;
  } catch (err: any) {
    console.error("getPurchasesByUser error:", err.message || err);
    throw err;
  }
};

// Get available shares for sponsor
export const getAvailableShares = async () => {
  try {
    let res = await fetch(`${BASE_URL}/v1/planpurchase/available-shares`, {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 401) {
      await regenAccessTokenApi();
      res = await fetch(`${BASE_URL}/v1/planpurchase/available-shares`, {
        method: "GET",
        credentials: "include",
      });
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to fetch available shares");
    return data.data;
  } catch (err: any) {
    throw err;
  }
};

// Share plan to direct
export const sharePlanToDirect = async (purchaseId: number, directId: number) => {
  try {
    let res = await fetch(`${BASE_URL}/v1/planpurchase/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseId, directId }),
      credentials: "include",
    });
    if (res.status === 401) {
      await regenAccessTokenApi();
      res = await fetch(`${BASE_URL}/v1/planpurchase/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId, directId }),
        credentials: "include",
      });
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to share plan");
    return data;
  } catch (err: any) {
    throw err;
  }
};

// Get shared plans for user (received)
export const getReceivedShares = async () => {
  try {
    let res = await fetch(`${BASE_URL}/v1/planpurchase/received-shares`, {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 401) {
      await regenAccessTokenApi();
      res = await fetch(`${BASE_URL}/v1/planpurchase/received-shares`, {
        method: "GET",
        credentials: "include",
      });
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to fetch received shares");
    return data.data;
  } catch (err: any) {
    throw err;
  }
};

// Accept shared plan
export const acceptSharedPlan = async (purchaseId: number) => {
  try {
    let res = await fetch(`${BASE_URL}/v1/planpurchase/accept-share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseId }),
      credentials: "include",
    });
    if (res.status === 401) {
      await regenAccessTokenApi();
      res = await fetch(`${BASE_URL}/v1/planpurchase/accept-share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseId }),
        credentials: "include",
      });
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to accept plan");
    return data;
  } catch (err: any) {
    throw err;
  }
};