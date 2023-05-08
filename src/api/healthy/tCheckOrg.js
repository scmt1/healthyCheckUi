import { postBodyRequest, getRequest, postRequest } from "@/libs/axios";

export const save = (params) => {
  return params.id ? update(params) : create(params);
};

export const create = (params) => {
  return postBodyRequest("/tCheckOrg/addTCheckOrg", params);
};

export const update = (params) => {
  return postBodyRequest("/tCheckOrg/updateTCheckOrg", params);
};

export const get = (id) => {
  return getRequest("/tCheckOrg/getTCheckOrg", { id });
};

export const query = (params) => {
  return getRequest("/tCheckOrg/queryTCheckOrgList", params);
};

export const destroy = (ids) => {
  return postRequest("/tCheckOrg/deleteTCheckOrg", {
    ids,
  });
};

export const getAllCheckOrg = () => {
  return getRequest("/tCheckOrg/getAllCheckOrg");
};

export const getComBos = (params) => {
  return getRequest("/tCheckOrg/getOrgAndComboData", params);
};
