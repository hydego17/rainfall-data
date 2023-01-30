import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

interface StationResponse {
  sum: number;
  output: Array<{
    id: string;
    station_name: string;
    station_number?: string;
  }>;
}

export const useGetStation = () => {
  return useQuery(['Station'], async () => {
    return http
      .get<StationResponse>('/api/station', {
        baseURL: '/',
      })
      .then((res) => res.data);
  });
};
