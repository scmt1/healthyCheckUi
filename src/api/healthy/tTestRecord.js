import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTTestRecord = params => {
    return postBodyRequest('/tTestRecord/addTTestRecord', params);
};
export const deleteTTestRecord = params => {
    return postRequest('/tTestRecord/deleteTTestRecord', params);
};
export const updateTTestRecord = params => {
    return postBodyRequest('/tTestRecord/updateTTestRecord', params);
};
export const queryTTestRecordList = params => {
    return getRequest('/tTestRecord/queryTTestRecordList', params);
};
export const queryTTestRecordListAll = params => {
    return getRequest('/tTestRecord/queryTTestRecordListAll', params);
};
export const getTTestRecord = params => {
    return getRequest('/tTestRecord/getTTestRecord', params);
};