import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addTInspectionRecord = params => {
		return postBodyRequest('/tInspectionRecord/addTInspectionRecord',params);
	};
	export const deleteTInspectionRecord = params => {
		return postRequest('/tInspectionRecord/deleteTInspectionRecord',params);
	};
	export const updateTInspectionRecord = params => {
		return postBodyRequest('/tInspectionRecord/updateTInspectionRecord',params);
	};
	export const queryTInspectionRecordList = params => {
		return getRequest('/tInspectionRecord/queryTInspectionRecordList',params);
	};
	export const getTInspectionRecord = params => {
		return getRequest('/tInspectionRecord/getTInspectionRecord',params);
	};
	export const getTInspectionRecordByPersonId = params => {
		return getRequest('/tInspectionRecord/getTInspectionRecordByPersonId',params);
	};
	export const batchAddTInspectionRecord = params => {
		return postBodyRequest('/tInspectionRecord/batchAddTInspectionRecord', params);
	};
	export const CancelGeneralInspection = params => {
		return postRequest('/tInspectionRecord/CancelGeneralInspection', params);
	};
