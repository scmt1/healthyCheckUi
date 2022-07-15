import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addTGroupUnit = params => {
		return postBodyRequest('/tGroupUnit/addTGroupUnit',params);
	};
	export const deleteTGroupUnit = params => {
		return postRequest('/tGroupUnit/deleteTGroupUnit',params);
	};
	export const updateTGroupUnit = params => {
		return postBodyRequest('/tGroupUnit/updateTGroupUnit',params);
	};
	export const queryTGroupUnitList = params => {
		return getRequest('/tGroupUnit/queryTGroupUnitList',params);
	};
	export const queryAllTGroupUnitList = params => {
		return getRequest('/tGroupUnit/queryAllTGroupUnitList',params);
	};
	export const getTGroupUnit = params => {
		return getRequest('/tGroupUnit/getTGroupUnit',params);
	};
