import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTOrderGroup = params => {
    return postBodyRequest('/tOrderGroup/addTOrderGroup', params);
};
export const deleteTOrderGroup = params => {
    return postRequest('/tOrderGroup/deleteTOrderGroup', params);
};
export const updateTOrderGroup = params => {
    return postBodyRequest('/tOrderGroup/updateTOrderGroup', params);
};
export const queryTOrderGroupList = params => {
    return getRequest('/tOrderGroup/queryTOrderGroupList', params);
};
export const getTOrderGroup = params => {
    return getRequest('/tOrderGroup/getTOrderGroup', params);
};
export const getTOrderGroupByGroupOrderId = params => {
    return getRequest('/tOrderGroup/getTOrderGroupByGroupOrderId', params);
};
export const getTOrderGroupByGroupUnitId = params => {
    return getRequest('/tOrderGroup/getTOrderGroupByGroupUnitId', params);
};
export const queryCheckProjectAndHazardFactors = params => {
    return getRequest('/tOrderGroup/queryCheckProjectAndHazardFactors', params);
};
export const queryCheckProjectAndHazardFactorsList = params => {
    return getRequest('/tOrderGroup/queryCheckProjectAndHazardFactorsList', params);
};
export const queryCheckProjectAndHazardFactorsComboList = params => {
    return getRequest('/tOrderGroup/queryCheckProjectAndHazardFactorsComboList', params);
};
export const queryCheckResultAndHazardFactorsList = params => {
    return getRequest('/tOrderGroup/queryCheckResultAndHazardFactorsList', params);
};
export const queryCheckResultReview = params => {
    return getRequest('/tOrderGroup/queryCheckResultReview', params);
};
export const queryRegistDateReview = params => {
    return getRequest('/tOrderGroup/queryRegistDateReview', params);
};
export const queryRegistDate = params => {
    return getRequest('/tOrderGroup/queryRegistDate', params);
};
export const queryCheckResultByOrderId = params => {
    return getRequest('/tOrderGroup/queryCheckResultByOrderId', params);
};
export const queryReviewResultByOrderId = params => {
    return getRequest('/tOrderGroup/queryReviewResultByOrderId', params);
};
export const queryTOrderGroupListByOrderId = params => {
    return postRequest('/tOrderGroup/queryTOrderGroupListByOrderId', params);
};
