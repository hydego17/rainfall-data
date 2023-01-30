import type { NextApiRequest, NextApiResponse } from 'next';
import { http } from '@/lib/http';
import { createPayload } from '@/utils';
import NodeCache from 'node-cache';

const CACHE_TTL = 24 * 60 * 60; // 24 Hours
const CHECK_PERIOD = 60 * 60; // 1 Hours

const MyCache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: CHECK_PERIOD });

interface StationResponse {
  sum: number;
  output: Array<{
    id: string;
    station_name: string;
    station_number?: string;
  }>;
}

export default async function ApiStation(req: NextApiRequest, res: NextApiResponse) {
  // try to get the data from the cache
  let station = MyCache.get<StationResponse>('STATION');

  // if data does not exist in the cache, retrieve it from the original source and store it in the cache
  if (station === undefined) {
    station = await http
      .post(
        '/data_iklim/get_station_name',
        createPayload({
          page: 1,
          maxViewData: 1000,
          type: '',
          idrefprovince: '',
          idrefregency: '',
        })
      )
      .then((res) => {
        let text = res.data as string;
        let parsed = text.split('<script')?.[0] ?? text;
        return JSON.parse(parsed);
      });

    MyCache.set('STATION', station, CACHE_TTL);
  }

  // send cached response
  res.status(200).send(station);
}
