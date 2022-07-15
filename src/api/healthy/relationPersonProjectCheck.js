import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addRelationPersonProjectCheck = params => {
		return postBodyRequest('/relationPersonProjectCheck/addRelationPersonProjectCheck',params);
	};
	export const deleteRelationPersonProjectCheck = params => {
		return postRequest('/relationPersonProjectCheck/deleteRelationPersonProjectCheck',params);
	};
	export const updateRelationPersonProjectCheck = params => {
		return postBodyRequest('/relationPersonProjectCheck/updateRelationPersonProjectCheck',params);
	};
	export const queryRelationPersonProjectCheckList = params => {
		return getRequest('/relationPersonProjectCheck/queryRelationPersonProjectCheckList',params);
	};
	export const queryRelationPersonProjectCheckAll = params => {
		return getRequest('/relationPersonProjectCheck/queryRelationPersonProjectCheckAll',params);
	};
	export const getRelationPersonProjectCheck = params => {
		return getRequest('/relationPersonProjectCheck/getRelationPersonProjectCheck',params);
	};
