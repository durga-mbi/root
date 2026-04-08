import { BASE_URL } from "../config/api.config";
import { refreshTokeApi } from "./auth.api";

// CREATE CATEGORY
export const createCategoryApi = async (payload: any) => {
    let res = await fetch(`${BASE_URL}/v1/category/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (res.status === 401) {
        await refreshTokeApi();
        res = await fetch(`${BASE_URL}/v1/category/create`, {
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
        throw new Error(data?.msg || "Create category failed");
    }

    return data;
};

export const getCategoryApi = async (page = 1, limit = 10) => {
    let res = await fetch(
        `${BASE_URL}/v1/category/get?page=${page}&limit=${limit}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (res.status === 401) {
        try {
            await refreshTokeApi();
            res = await fetch(
                `${BASE_URL}/v1/category/get?page=${page}&limit=${limit}`,
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
        throw new Error(data?.msg || "Fetch category failed");
    }

    return data;
};

// UPDATE CATEGORY
export const updateCategoryApi = async (id: number, payload: any) => {
    let res = await fetch(`${BASE_URL}/v1/category/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (res.status === 401) {
        await refreshTokeApi();
        res = await fetch(`${BASE_URL}/v1/category/update/${id}`, {
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
        throw new Error(data?.msg || "Update category failed");
    }

    return data;
};

// DELETE CATEGORY
export const deleteCategoryApi = async (id: number) => {
    let res = await fetch(`${BASE_URL}/v1/category/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (res.status === 401) {
        await refreshTokeApi();
        res = await fetch(`${BASE_URL}/v1/categories/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.msg || "Delete category failed");
    }

    return data;
};