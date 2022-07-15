import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTComboItem = params => {
    return postBodyRequest('/tComboItem/addTComboItem', params);
};
export const deleteTComboItem = params => {
    return postRequest('/tComboItem/deleteTComboItem', params);
};
export const updateTComboItem = params => {
    return postBodyRequest('/tComboItem/updateTComboItem', params);
};
export const queryTComboItemList = params => {
    return getRequest('/tComboItem/queryTComboItemList', params);
};
export const getTComboItem = params => {
    return getRequest('/tComboItem/getTComboItem', params);
};
export const getComboItemByComboId = params => {
	return getRequest('/tComboItem/getComboItemByComboId', params);
};
