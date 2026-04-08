import { useQuery } from "@tanstack/react-query";
import { getUplineApi } from "../../api/genealogy.api";
import { useUserProfile } from "../../hooks/profile/useProfile";

export const useUpline = () => {
    const { data: profile } = useUserProfile();
    const userId = profile?.data?.uId || profile?.data?.id || null;

    return useQuery({
        queryKey: ["upline", userId],
        queryFn: getUplineApi,
        enabled: !!userId,
    });
};