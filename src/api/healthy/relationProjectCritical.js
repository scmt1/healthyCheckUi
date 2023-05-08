// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addRelationProjectCritical = params => {
		return postBodyRequest('/relationProjectCritical/addRelationProjectCritical',params);
	};
	export const deleteRelationProjectCritical = params => {
		return postRequest('/relationProjectCritical/deleteRelationProjectCritical',params);
	};
	export const updateRelationProjectCritical = params => {
		return postBodyRequest('/relationProjectCritical/updateRelationProjectCritical',params);
	};
	export const queryRelationProjectCriticalList = params => {
		return getRequest('/relationProjectCritical/queryRelationProjectCriticalList',params);
	};
	export const getRelationProjectCritical = params => {
		return getRequest('/relationProjectCritical/getRelationProjectCritical',params);
	};
