// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addRelationProjectRules = params => {
		return postBodyRequest('/relationProjectRules/addRelationProjectRules',params);
	};
	export const deleteRelationProjectRules = params => {
		return postRequest('/relationProjectRules/deleteRelationProjectRules',params);
	};
	export const updateRelationProjectRules = params => {
		return postBodyRequest('/relationProjectRules/updateRelationProjectRules',params);
	};
	export const queryRelationProjectRulesList = params => {
		return getRequest('/relationProjectRules/queryRelationProjectRulesList',params);
	};
	export const getRelationProjectRules = params => {
		return getRequest('/relationProjectRules/getRelationProjectRules',params);
	};
