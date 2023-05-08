import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addTReviewRecord = params => {
		return postBodyRequest('/tReviewRecord/addTReviewRecord',params);
	};
	export const deleteTReviewRecord = params => {
		return postRequest('/tReviewRecord/deleteTReviewRecord',params);
	};
	export const updateTReviewRecord = params => {
		return postBodyRequest('/tReviewRecord/updateTReviewRecord',params);
	};
	export const queryTReviewRecordList = params => {
		return getRequest('/tReviewRecord/queryTReviewRecordList',params);
	};
	export const queryTReviewRecordAll = params => {
		return getRequest('/tReviewRecord/queryTReviewRecordAll',params);
	};
	export const getTReviewRecord = params => {
		return getRequest('/tReviewRecord/getTReviewRecord',params);
	};
	export const getCheckProjectByPersonId = params => {
		return getRequest('/tReviewRecord/getCheckProjectByPersonId',params);
	};
	export const updateTReviewRecordById = params => {
		return postBodyRequest('/tReviewRecord/updateTReviewRecordById',params);
	};
	export const approveTReviewRecordById = params => {
		return postBodyRequest('/tReviewRecord/approveTReviewRecordById',params);
	};
