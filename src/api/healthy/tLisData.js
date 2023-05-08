import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addTLisData = params => {
		return postBodyRequest('/tLisData/addTLisData',params);
	};
	export const deleteTLisData = params => {
		return postRequest('/tLisData/deleteTLisData',params);
	};
	export const updateTLisData = params => {
		return postBodyRequest('/tLisData/updateTLisData',params);
	};
	export const queryTLisDataList = params => {
		return getRequest('/tLisData/queryTLisDataList',params);
	};
	export const getTLisData = params => {
		return getRequest('/tLisData/getTLisData',params);
	};
