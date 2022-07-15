// 统一请求路径前缀在libs/axios.js中修改
import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTSectionOffice = params => {
    return postBodyRequest('/tSectionOffice/addTSectionOffice', params);
};
export const deleteTSectionOffice = params => {
    return postRequest('/tSectionOffice/deleteTSectionOffice', params);
};
export const updateTSectionOffice = params => {
    return postBodyRequest('/tSectionOffice/updateTSectionOffice', params);
};
export const queryTSectionOfficeList = params => {
    return getRequest('/tSectionOffice/queryTSectionOfficeList', params);
};
export const getTSectionOffice = params => {
    return getRequest('/tSectionOffice/getTSectionOffice', params);
};
export const queryAllSectionOfficeData = params => {
    return getRequest('/tSectionOffice/queryAllSectionOfficeData', params);
};
export const getAllSectionOffice = params => {
	return getRequest('/tSectionOffice/getAllSectionOffice', params);
};
