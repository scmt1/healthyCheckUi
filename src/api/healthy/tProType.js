import {
    getRequest,
    postRequest,
    postBodyRequest,
    putRequest,
    deleteRequest,
    importRequest,
    uploadFileRequest,
    postRequestJson
} from '@/libs/axios';

export const addTProType = params => {
    return postBodyRequest('/tProType/addTProType', params);
};
export const deleteTProType = params => {
    return postRequest('/tProType/deleteTProType', params);
};
export const updateTProType = params => {
    return postBodyRequest('/tProType/updateTProType', params);
};
export const queryTProTypeList = params => {
    return getRequest('/tProType/queryTProTypeList', params);
};
export const getTProType = params => {
    return getRequest('/tProType/getTProType', params);
};
export const getAllProTypeByTree = params => {
    return getRequest('/tProType/getAllProTypeByTree', params);
};
export const queryProTypeByTypeCode = params => {
    return getRequest('/tProType/queryProTypeByTypeCode', params);
};

