import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTDepartItemResult = params => {
    return postBodyRequest('/tDepartItemResult/addTDepartItemResult', params);
};
export const deleteTDepartItemResult = params => {
    return postRequest('/tDepartItemResult/deleteTDepartItemResult', params);
};
export const updateTDepartItemResult = params => {
    return postBodyRequest('/tDepartItemResult/updateTDepartItemResult', params);
};
export const queryTDepartItemResultList = params => {
    return getRequest('/tDepartItemResult/queryTDepartItemResultList', params);
};
export const getTDepartItemResult = params => {
    return getRequest('/tDepartItemResult/getTDepartItemResult', params);
};
export const queryAllTDepartItemResultList = params => {
    return getRequest('/tDepartItemResult/queryAllTDepartItemResultList', params);
};
export const querySummaryResultList = params => {
    return getRequest('/tDepartItemResult/querySummaryResultList', params);
};
export const querySummaryResultListReview = params => {
    return getRequest('/tDepartItemResult/querySummaryResultListReview', params);
};
export const queryAllAbnormalItemResultList = params => {
    return getRequest('/tDepartItemResult/queryAllAbnormalItemResultList', params);
};
export const getAbnormalResultList = params => {
    return getRequest('/tDepartItemResult/getAbnormalResultList', params);
};
