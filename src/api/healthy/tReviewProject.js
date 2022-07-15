import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
export const addTReviewProject = params => {
	return postBodyRequest('/tReviewProject/addTReviewProject',params);
};
export const deleteTReviewProject = params => {
	return postRequest('/tReviewProject/deleteTReviewProject',params);
};
export const updateTReviewProject = params => {
	return postBodyRequest('/tReviewProject/updateTReviewProject',params);
};
export const queryTReviewProjectList = params => {
	return getRequest('/tReviewProject/queryTReviewProjectList',params);
};
export const getTReviewProject = params => {
	return getRequest('/tReviewProject/getTReviewProject',params);
};
export const queryNoCheckReviewProject = params => {
	return getRequest('/tReviewProject/queryNoCheckReviewProject',params);
};
export const reCheckBaseProject = params => {
	return postRequest('/tReviewProject/reCheckBaseProject',params);
};
