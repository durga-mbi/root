import { BASE_URL } from "../config/api.config";

export interface IncomeQuery {
    period?: "LAST_7_DAYS" | "LAST_30_DAYS" | "THIS_MONTH";
    fromDate?: string;
    toDate?: string;
}

export const getIncomeApi = async (query: IncomeQuery) => {
    try {
        // Construct query string
        const params = new URLSearchParams();
        if (query.period) params.append("period", query.period);
        if (query.fromDate) params.append("fromDate", query.fromDate);
        if (query.toDate) params.append("toDate", query.toDate);

        let res = await fetch(`${BASE_URL}/v1/systemincome/getincome?${params.toString()}`, {
            method: "GET",
            credentials: "include",
        });

        if (res.status === 401) {
            throw new Error("Session expired...");
        }

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data?.message || "Income fetch failed...");
        }

        return data;
    } catch (err) {
        console.error("Income fetch failed:", err);
        throw err;
    }
};

