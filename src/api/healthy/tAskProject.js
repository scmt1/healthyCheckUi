import {
    getRequest,
    postRequest,
    postBodyRequest
} from '@/libs/axios';

export const addTAskProject = params => {
    return postBodyRequest('/tAskProject/addTAskProject', params);
};
export const deleteTAskProject = params => {
    return postRequest('/tAskProject/deleteTAskProject', params);
};
export const updateTAskProject = params => {
    return postBodyRequest('/tAskProject/updateTAskProject', params);
};
export const queryTAskProjectList = params => {
    return getRequest('/tAskProject/queryTAskProjectList', params);
};
export const getTAskProject = params => {
    return getRequest('/tAskProject/getTAskProject', params);
};
export const getTAskProjectByHazardId = params => {
    return getRequest('/tAskProject/getTAskProjectByHazardId', params);
};
export const getAskProjectByFactor = params => {
    return getRequest('/tAskProject/getAskProjectByFactor', params);
};
