import { getRequest } from "@/libs/axios";

export const query = (params) => {
  return getRequest("/tOrderRecord/queryTOrderRecordList", params);
};
