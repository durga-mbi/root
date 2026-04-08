import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../config/api.config';
import { regenAccessTokenApi } from '../../api/user.api';

const fetchIncomeHistory = async () => {
    let res = await fetch(`${BASE_URL}/v1/planpurchase/income/my-history`, { credentials: 'include' });
    if (res.status === 401) {
        await regenAccessTokenApi();
        res = await fetch(`${BASE_URL}/v1/planpurchase/income/my-history`, { credentials: 'include' });
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch income history');
    return data.data;
};

export const useIncomeHistory = () => {
  return useQuery({
    queryKey: ['incomeHistory'],
    queryFn: fetchIncomeHistory,
  });
};
