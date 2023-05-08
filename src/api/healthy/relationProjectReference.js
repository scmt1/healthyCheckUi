// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addRelationProjectReference = params => {
		return postBodyRequest('/relationProjectReference/addRelationProjectReference',params);
	};
	export const deleteRelationProjectReference = params => {
		return postRequest('/relationProjectReference/deleteRelationProjectReference',params);
	};
	export const updateRelationProjectReference = params => {
		return postBodyRequest('/relationProjectReference/updateRelationProjectReference',params);
	};
	export const queryRelationProjectReferenceList = params => {
		return getRequest('/relationProjectReference/queryRelationProjectReferenceList',params);
	};
	export const getRelationProjectReference = params => {
		return getRequest('/relationProjectReference/getRelationProjectReference',params);
	};
