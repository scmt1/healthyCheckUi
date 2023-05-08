// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest,putRequestWithConfig, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

// 获取文件数据
export function getFieldData(tableName) {
  return getRequest('/genConfig/' + tableName);
}

//更新文件数据
export function update(data) {
  return putRequestWithConfig('/genConfig', data);
}

//获取配置文件
export function getConfig(tableName) {
  return getRequest('/genConfig/' + tableName);
}
