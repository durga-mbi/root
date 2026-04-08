import { BASE_URL } from "../config/api.config";
import { refreshTokeApi } from "./auth.api";

// CREATE SUBCATEGORY
export const createSubCategoryApi = async (payload: any) => {
    let res = await fetch(`${BASE_URL}/v1/subcategory/create`, {
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
            res = await fetch(`${BASE_URL}/v1/subcategory/create`, {
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
        throw new Error(data?.message || "Create subcategory failed");
    }

    return data;
};

// GET SUBCATEGORIES
export const getSubCategoriesApi = async (page = 1, limit = 10) => {
    let res = await fetch(
        `${BASE_URL}/v1/subcategory/get?page=${page}&limit=${limit}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (res.status === 401) {
        try {
            await refreshTokeApi();
            res = await fetch(
                `${BASE_URL}/v1/subcategory/get?page=${page}&limit=${limit}`,
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
        throw new Error(data?.message || "Fetch subcategories failed");
    }

    return data;
};

// UPDATE SUBCATEGORY
export const updateSubCategoryApi = async (id: number, payload: any) => {
    let res = await fetch(`${BASE_URL}/v1/subcategory/update/${id}`, {
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
            res = await fetch(`${BASE_URL}/v1/subcategory/update/${id}`, {
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
        throw new Error(data?.message || "Update subcategory failed");
    }

    return data;
};

// DELETE SUBCATEGORY
export const deleteSubCategoryApi = async (id: number) => {
    let res = await fetch(`${BASE_URL}/v1/subcategory/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (res.status === 401) {
        try {
            await refreshTokeApi();
            res = await fetch(`${BASE_URL}/v1/subcategory/delete/${id}`, {
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
        throw new Error(data?.message || "Delete subcategory failed");
    }

    return data;
};