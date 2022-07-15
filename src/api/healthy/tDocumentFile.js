import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addTDocumentFile = params => {
		return postBodyRequest('/tDocumentFile/addTDocumentFile',params);
	};
	export const deleteTDocumentFile = params => {
		return postRequest('/tDocumentFile/deleteTDocumentFile',params);
	};
	export const updateTDocumentFile = params => {
		return postBodyRequest('/tDocumentFile/updateTDocumentFile',params);
	};
	export const queryTDocumentFileList = params => {
		return getRequest('/tDocumentFile/queryTDocumentFileList',params);
	};
	export const getTDocumentFile = params => {
		return getRequest('/tDocumentFile/getTDocumentFile',params);
	};
