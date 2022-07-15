// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest ,postRequestWithBlob} from '@/libs/axios';

export function getDicts() {
  return getRequest("/dict/all");
}

export function add(data) {
  return postRequest('/dict',data);
}

export function del(id) {
  return request({
    url: '/api/dict/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return putRequest("/dict",data);
}

export default { add, edit, del }
