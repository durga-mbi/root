import { BASE_URL } from "../config/api.config";
import { refreshTokeApi } from "./auth.api";

// CREATE BRAND
export const createBrandApi = async (payload: any) => {
    let res = await fetch(`${BASE_URL}/v1/brand/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (res.status === 401) {
        try {
            await refreshTokeApi();
            res = await fetch(`${BASE_URL}/v1/brand/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });
        } catch {
            window.location.href = "/login";
            throw new Error("Session expired");
        }
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.msg || "Create brand failed");
    }

    return data;
};

// GET BRANDS
export const getBrandsApi = async (page = 1, limit = 10) => {
    let res = await fetch(
        `${BASE_URL}/v1/brand/get?page=${page}&limit=${limit}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (res.status === 401) {
        try {
            await refreshTokeApi();
            res = await fetch(
                `${BASE_URL}/v1/brand/get?page=${page}&limit=${limit}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
        } catch {
            window.location.href = "/login";
            throw new Error("Session expired");
        }
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.msg || "Fetch brands failed");
    }

    return data;
};

// UPDATE BRAND
export const updateBrandApi = async (id: number, payload: any) => {
    let res = await fetch(`${BASE_URL}/v1/brand/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (res.status === 401) {
        try {
            await refreshTokeApi();
            res = await fetch(`${BASE_URL}/v1/brand/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });
        } catch {
            window.location.href = "/login";
            throw new Error("Session expired");
        }
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.msg || "Update brand failed");
    }

    return data;
};

// DELETE BRAND
export const deleteBrandApi = async (id: number) => {
    let res = await fetch(`${BASE_URL}/v1/brand/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (res.status === 401) {
        try {
            await refreshTokeApi();
            res = await fetch(`${BASE_URL}/v1/brand/delete/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
        } catch {
            window.location.href = "/login";
            throw new Error("Session expired");
        }
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.msg || "Delete brand failed");
    }

    return data;
};