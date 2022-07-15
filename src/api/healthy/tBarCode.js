// 统一请求路径前缀在libs/axios.js中修改
import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const getPersonAndProjectInfoByBarcode = params => {
    return getRequest('/tBarcode/getPersonAndProjectInfoByBarcode', params);
};
export const getBarcodeByPersonIdAndGroupItemId = params => {
    return getRequest('/tBarcode/getBarcodeByPersonIdAndGroupItemId', params);
};
export const getBarcodeByPersonIdAndTestNum = params => {
    return getRequest('/tBarcode/getBarcodeByPersonIdAndTestNum', params);
};
