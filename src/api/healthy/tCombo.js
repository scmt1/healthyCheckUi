import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addTCombo = params => {
		return postBodyRequest('/tCombo/addTCombo',params);
	};
	export const deleteTCombo = params => {
		return postRequest('/tCombo/deleteTCombo',params);
	};
	export const updateTCombo = params => {
		return postBodyRequest('/tCombo/updateTCombo',params);
	};
	export const queryTComboList = params => {
		return getRequest('/tCombo/queryTComboList',params);
	};
	export const getTCombo = params => {
		return getRequest('/tCombo/getTCombo',params);
	};
	export const getTComboByPersonId = params => {
		return getRequest('/tCombo/getTComboByPersonId',params);
	};
	export const gethazardFactorsByGroupId = params => {
		return getRequest('/tCombo/gethazardFactorsByGroupId',params);
	};
	export const getTcomboByName = params => {
		return getRequest('/tCombo/getTcomboByName',params);
	};
