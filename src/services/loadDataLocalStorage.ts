import type {
  BaseData,
  MemberData,
} from '@3594t-deck/3594t-net-datalist/read-only';

/* eslint-disable camelcase */
export interface SavedLocalData {
  base_data: BaseData;
  member_data?: MemberData;
  save_date?: string;
}
/* eslint-enable camelcase */

export default async (): Promise<SavedLocalData | null> => {
  const datalist = localStorage.getItem('3594t.net/datalist');
  if (!datalist) {
    return null;
  }
  const data: SavedLocalData = JSON.parse(datalist);
  return data;
};
