import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addTPositivePerson = params => {
		return postBodyRequest('/tPositivePerson/addTPositivePerson',params);
	};
	export const deleteTPositivePerson = params => {
		return postRequest('/tPositivePerson/deleteTPositivePerson',params);
	};
	export const updateTPositivePerson = params => {
		return postBodyRequest('/tPositivePerson/updateTPositivePerson',params);
	};
	export const queryTPositivePersonList = params => {
		return getRequest('/tPositivePerson/queryTPositivePersonList',params);
	};
	export const getTPositivePerson = params => {
		return getRequest('/tPositivePerson/getTPositivePerson',params);
	};
export const getTPositivePersonId = params => {
	return getRequest('/tPositivePerson/getTPositivePersonId',params);
};
