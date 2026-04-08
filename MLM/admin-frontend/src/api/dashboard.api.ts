import { BASE_URL } from "../config/api.config";
import { refreshTokeApi } from "./auth.api";

export const AdminDashboardApi = async () => {
    try {
        let res = await fetch(`${BASE_URL}/v1/admin/dashboard`, {
            method: "GET",
            credentials: "include",
        });

        if (res.status === 401) {
            try {
                await refreshTokeApi();
                res = await fetch(`${BASE_URL}/v1/admin/dashboard`, {
                    method: "GET",
                    credentials: "include",
                });
            } catch (err) {
                window.location.href = "/login";
                throw new Error("Session Expired");
            }
        }

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data?.msg || "Dashboard API cannot be fetched...");
        }
        return data;
    } catch (err) {
        throw new Error("internal server error");
    }
}