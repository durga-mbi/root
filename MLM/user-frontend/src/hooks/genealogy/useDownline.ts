// useDownline.ts
import { useQuery } from "@tanstack/react-query";
import { getDownlineApi } from "../../api/genealogy.api";
import { useUserProfile } from "../../hooks/profile/useProfile"; 

export const useDownline = () => {
  const { data: profile } = useUserProfile();                    
  const userId = profile?.data?.uId || profile?.data?.id || null;

  return useQuery({
    queryKey: ["downline", userId],                              
    queryFn: getDownlineApi,
    enabled: !!userId,                                                                  
  });
};