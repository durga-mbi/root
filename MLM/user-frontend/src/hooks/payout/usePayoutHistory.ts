import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../config/api.config';
import { regenAccessTokenApi } from '../../api/user.api';

const fetchPayoutHistory = async () => {
    let res = await fetch(`${BASE_URL}/v1/payout`, { credentials: 'include' });
    if (res.status === 401) {
        await regenAccessTokenApi();
        res = await fetch(`${BASE_URL}/v1/payout`, { credentials: 'include' });
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch payout history');
    return data.data; // this contains { data: [], total, ... }
};

export const usePayoutHistory = () => {
  return useQuery({
    queryKey: ['payoutHistory'],
    queryFn: fetchPayoutHistory,
  });
};
