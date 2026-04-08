import { BASE_URL } from "../config/api.config";
import { refreshTokeApi } from "./auth.api";

// ADD THESE PRODUCT APIS TO YOUR category.api.ts or create product.api.ts
export const createProductApi = async (payload: any) => {
    let res = await fetch(`${BASE_URL}/v1/product/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (res.status === 401) {
        await refreshTokeApi();
        res = await fetch(`${BASE_URL}/v1/product/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.msg || "Create product failed");
    }

    return data;
};

export const getProductsApi = async (page = 1, limit = 10) => {
    let res = await fetch(
        `${BASE_URL}/v1/product/get?page=${page}&limit=${limit}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (res.status === 401) {
        try {
            await refreshTokeApi();
            res = await fetch(
                `${BASE_URL}/v1/product/get?page=${page}&limit=${limit}`,
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
        throw new Error(data?.msg || "Fetch products failed");
    }

    return data;
};

export const updateProductApi = async (id: number, payload: any) => {
    let res = await fetch(`${BASE_URL}/v1/product/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (res.status === 401) {
        await refreshTokeApi();
        res = await fetch(`${BASE_URL}/v1/product/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.msg || "Update product failed");
    }

    return data;
};

export const deleteProductApi = async (id: number) => {
    let res = await fetch(`${BASE_URL}/v1/product/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (res.status === 401) {
        await refreshTokeApi();
        res = await fetch(`${BASE_URL}/v1/product/delete/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.msg || "Delete product failed");
    }

    return data;
};