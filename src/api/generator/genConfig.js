// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest,putRequestWithConfig, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

export function getFieldData(tableName) {
  return getRequest('/genConfig/' + tableName);
}

export function update(data) {
  return putRequestWithConfig('/genConfig', data);
}

export function getConfig(tableName) {
  return getRequest('/genConfig/' + tableName);
}
