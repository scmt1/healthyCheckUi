import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
export const addPositiveResultList = params => {
    return postBodyRequest('/tPositiveResultList/addTPositiveResults',params);
};
export const deletePositiveResultList = params => {
    return postRequest('/tPositiveResultList/deleteTPositiveResults',params);
};
export const updatePositiveResultList = params => {
    return postBodyRequest('/tPositiveResultList/updateTPositiveResults',params);
};
export const queryPositiveResultList = params => {
    return getRequest('/tPositiveResultList/queryTPositiveResultsList',params);
};
export const getPositiveResultList = params => {
    return getRequest('/tPositiveResultList/getPositiveResultList',params);
};
export const getPositiveResult = params => {
    return getRequest('/tPositiveResultList/getTPositiveResults',params);
};
export const getPositiveResultListId = params => {
    return getRequest('/tPositiveResultList/getTPositiveResults',params);
};
export const addPositiveResultRuleList = params => {
    return postBodyRequest('/tPositiveResultList/addPositiveResultRuleList',params);
};
export const updatePositiveResultRuleList = params => {
    return postBodyRequest('/tPositiveResultList/updatePositiveResultRuleList',params);
};
export const getPositiveResultRuleId = params => {
    return getRequest('/tPositiveResultList/getPositiveResultRuleId',params);
};
export const getPositiveResultId = params => {
    return getRequest('/tPositiveResultList/getPositiveResultId',params);
};

export const deletePositiveResultRuleList = params => {
    return postRequest('/tPositiveResultList/deletePositiveResultRuleList',params);
};

export const deletePositiveResultRule = params => {
    return postRequest('/tPositiveResultList/deletePositiveResultRule',params);
};

export const getPositiveResultExaminationList = params => {
    return getRequest('/tPositiveResultList/queryPositiveResultExaminationList',params);
};

export const addPositivePerson = params => {
    return postBodyRequest('/tPositiveResultList/addPositivePerson',params);
};



