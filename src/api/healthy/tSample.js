// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

export const addTSample = params => {
    return postRequest('/tSample/addTSample', params);
};
export const deleteTSample = params => {
    return postRequest('/tSample/deleteTSample', params);
};
export const updateTSample = params => {
    return postRequest('/tSample/updateTSample', params);
};
export const queryTSampleList = params => {
    return getRequest('/tSample/queryTSampleList', params);
};
export const queryAllTSampleList = params => {
    return getRequest('/tSample/queryAllTSampleList', params);
};
export const getTSample = params => {
    return getRequest('/tSample/getTSample', params);
};
export const getOrderNum = params => {
    return getRequest('/tSample/getOrderNum', params);
};
