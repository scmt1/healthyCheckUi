import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTdTjBhk = params => {
    return postBodyRequest('/tdTjBhk/addTdTjBhk', params);
};
export const deleteTdTjBhk = params => {
    return postRequest('/tdTjBhk/deleteTdTjBhk', params);
};
export const updateTdTjBhk = params => {
    return postBodyRequest('/tdTjBhk/updateTdTjBhk', params);
};
export const queryTdTjBhkList = params => {
    return getRequest('/tdTjBhk/queryTdTjBhkList', params);
};
export const getTdTjBhk = params => {
    return getRequest('/tdTjBhk/getTdTjBhk', params);
};
export const queryCompanyList = params => {
    return getRequest('/tdTjBhk/queryCompanyList', params);
};
