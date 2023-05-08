import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTOfficeTerm = params => {
    return postBodyRequest('/tOfficeTerm/addTOfficeTerm', params);
};
export const deleteTOfficeTerm = params => {
    return postRequest('/tOfficeTerm/deleteTOfficeTerm', params);
};
export const updateTOfficeTerm = params => {
    return postBodyRequest('/tOfficeTerm/updateTOfficeTerm', params);
};
export const queryTOfficeTermList = params => {
    return getRequest('/tOfficeTerm/queryTOfficeTermList', params);
};
export const getTOfficeTerm = params => {
    return getRequest('/tOfficeTerm/getTOfficeTerm', params);
};
export const queryAllOfficeTermData = params => {
    return getRequest('/tOfficeTerm/queryAllOfficeTermData', params);
};
export const queryAllByOfficeId = params => {
	return getRequest('/tOfficeTerm/queryAllByOfficeId', params);
};
