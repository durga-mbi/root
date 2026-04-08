import { useQuery } from "@tanstack/react-query";
import { AdminDashboardApi } from "../../api/dashboard.api";

export const GetDashboardData = () => {
    return useQuery({
        queryKey: ["dash-data"],
        queryFn: AdminDashboardApi,
    });
};