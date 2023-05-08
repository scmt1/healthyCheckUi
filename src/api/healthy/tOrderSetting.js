import { getRequest, postBodyRequest } from "@/libs/axios";

export const importExcel = (params) => {
  return postBodyRequest("/orderSetting/importExcel", params);
};

export const getInfo = (params) => {
  return getRequest("/orderSetting/getOrderSettingInfo", params);
};

export const save = (params) => {
  return params.id ? update(params) : add(params);
};

export const update = (params) => {
  return postBodyRequest("/orderSetting/updateOrderSettingInfo", params);
};

export const add = (params) => {
  return postBodyRequest("/orderSetting/addTOrderSetting", params);
};
