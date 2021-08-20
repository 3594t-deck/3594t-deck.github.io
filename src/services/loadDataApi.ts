import type { BaseData } from '@3594t-deck/3594t-net-datalist/read-only';
import cacheFetch from '../utils/cacheFetch';

export default async (): Promise<BaseData> => {
  const baseData: BaseData = await cacheFetch(
    process.env.BASE_DATA_URL as string,
    '3594t-deck/data/base.json'
  );
  return baseData;
};
