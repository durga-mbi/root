import { BASE_URL, USER_BASE_URL } from "../config/api.config";
import { refreshTokeApi } from "./auth.api";
import type { ConfigPayload } from "../types/config";

export const postConfigApi = async (
  payload?: Partial<ConfigPayload>
) => {
  let res = await fetch(`${BASE_URL}/v1/config/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload ?? {}),
  });

  if (res.status === 401) {
    await refreshTokeApi();
    res = await fetch(`${BASE_URL}/v1/config/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload ?? {}),
    });
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.msg || "Config request failed");
  }

  return json.data;
  };

  export const resetDatabaseApi = async (payload: any) => {
    let res = await fetch(`${USER_BASE_URL}/v1/setup/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    const json = await res.json();
  
    if (!res.ok) {
      throw new Error(json?.message || "Reset request failed");
    }
  
    return json.data;
  };

  export const getUserUplineApi = async (id: number) => {
    let res = await fetch(`${BASE_URL}/v1/user/upline/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.status === 401) {
      await refreshTokeApi();
      res = await fetch(`${BASE_URL}/v1/user/upline/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    }
  
    const json = await res.json();
  
    if (!res.ok) {
      throw new Error(json?.message || "Failed to fetch upline");
    }
  
    return json.data;
  };

  export const getUserDirectsApi = async (id: number) => {
    let res = await fetch(`${BASE_URL}/v1/user/directs/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.status === 401) {
      await refreshTokeApi();
      res = await fetch(`${BASE_URL}/v1/user/directs/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    }
  
    const json = await res.json();
  
    if (!res.ok) {
      throw new Error(json?.message || "Failed to fetch directs");
    }
  
    return json.data;
  };

  export const getConfigApi = async () => {
  let res = await fetch(`${BASE_URL}/v1/config/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (res.status === 401) {
    await refreshTokeApi();
    res = await fetch(`${BASE_URL}/v1/config/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.msg || "Failed to fetch config");
  }

  return json.data;
  };