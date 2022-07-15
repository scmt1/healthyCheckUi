// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, putRequestWithConfig,postBodyRequest, getNoAuthRequest, postNoAuthRequest ,postRequestWithBlob} from '@/libs/axios';

export function getAllTable() {
  return getRequest("/generator/tables/all");
}

export function generator(tableName, type) {
  return postRequest('/generator/' + tableName + '/' + type,type);
}

export function save(data) {
  return putRequestWithConfig("/generator",data);
}

export function sync(tables) {
  return postBodyRequest('/generator/sync',tables);
}

export const queryTablesList = params => {//查询所有的表
  return getRequest('/generator/tables', params);
};

export async function getFieldData(data) {
  return await getRequest('/generator/columns?tableName=' + data);
}
