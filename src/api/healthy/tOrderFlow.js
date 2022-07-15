import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addTOrderFlow = params => {
		return postBodyRequest('/tOrderFlow/addTOrderFlow',params);
	};
	export const deleteTOrderFlow = params => {
		return postRequest('/tOrderFlow/deleteTOrderFlow',params);
	};
	export const updateTOrderFlow = params => {
		return postBodyRequest('/tOrderFlow/updateTOrderFlow',params);
	};
	export const approve = params => {
		return postBodyRequest('/tReviewContent/approve',params);
	};
	export const getTReviewContent = params => {
		return getRequest('/tReviewContent/getTReviewContent',params);
	};
	export const queryTOrderFlowList = params => {
		return getRequest('/tOrderFlow/queryTOrderFlowList',params);
	};
	export const queryAllTOrderFlowList = params => {
		return getRequest('/tOrderFlow/queryAllTOrderFlowList',params);
	};
	export const getTOrderAndFlowData = params => {
		return getRequest('/tOrderFlow/getTOrderAndFlowData',params);
	};
	export const getTOrderFlow = params => {
		return getRequest('/tOrderFlow/getTOrderFlow',params);
	};
