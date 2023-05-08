// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

	export const addTBaseProject = params => {
		return postBodyRequest('/tBaseProject/addTBaseProject',params);
	};
	export const deleteTBaseProject = params => {
		return postRequest('/tBaseProject/deleteTBaseProject',params);
	};
	export const updateTBaseProject = params => {
		return postBodyRequest('/tBaseProject/updateTBaseProject',params);
	};
	export const queryTBaseProjectList = params => {
		return getRequest('/tBaseProject/queryTBaseProjectList',params);
	};
	export const getTBaseProject = params => {
		return getRequest('/tBaseProject/getTBaseProject',params);
	};
	export const queryAllTBaseProject = params => {
		return getRequest('/tBaseProject/queryAllTBaseProject',params);
	};
