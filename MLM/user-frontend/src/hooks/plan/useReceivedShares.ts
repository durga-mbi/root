import { useQuery } from '@tanstack/react-query';
import { getReceivedShares } from '../../api/plan.api';

export const useReceivedShares = () => {
    return useQuery({
        queryKey: ['received-shares'],
        queryFn: getReceivedShares,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};
