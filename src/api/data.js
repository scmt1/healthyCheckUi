import { getRequest, postRequest, putRequest,getRequestWithBlob, postBodyRequest,postRequestWithBlob, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
import qs from 'qs'

export function initData(url, params) {
  return getRequest(url + "?"+qs.stringify(params,{indices:false}));
}

export function download(url, params) {
  return getRequestWithBlob(url + '?' + qs.stringify(params, { indices: false }),)
}
