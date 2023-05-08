import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addTDiseaseDiagnosis = params => {
		return postBodyRequest('/tDiseaseDiagnosis/addTDiseaseDiagnosis',params);
	};
	export const deleteTDiseaseDiagnosis = params => {
		return postRequest('/tDiseaseDiagnosis/deleteTDiseaseDiagnosis',params);
	};
	export const updateTDiseaseDiagnosis = params => {
		return postBodyRequest('/tDiseaseDiagnosis/updateTDiseaseDiagnosis',params);
	};
	export const queryTDiseaseDiagnosisList = params => {
		return getRequest('/tDiseaseDiagnosis/queryTDiseaseDiagnosisList',params);
	};
	export const getTDiseaseDiagnosis = params => {
		return getRequest('/tDiseaseDiagnosis/getTDiseaseDiagnosis',params);
	};
