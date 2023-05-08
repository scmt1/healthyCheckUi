import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addTPacsData = params => {
		return postBodyRequest('/tPacsData/addTPacsData',params);
	};
	export const deleteTPacsData = params => {
		return postRequest('/tPacsData/deleteTPacsData',params);
	};
	export const updateTPacsData = params => {
		return postBodyRequest('/tPacsData/updateTPacsData',params);
	};
	export const queryTPacsDataList = params => {
		return getRequest('/tPacsData/queryTPacsDataList',params);
	};
	export const getTPacsData = params => {
		return getRequest('/tPacsData/getTPacsData',params);
	};
