import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTUnitReport = params => {
    return postBodyRequest('/tUnitReport/addTUnitReport', params);
};
export const deleteTUnitReport = params => {
    return postRequest('/tUnitReport/deleteTUnitReport', params);
};
export const updateTUnitReport = params => {
    return postBodyRequest('/tUnitReport/updateTUnitReport', params);
};
export const queryTUnitReportList = params => {
    return getRequest('/tUnitReport/queryTUnitReportList', params);
};
export const getTUnitReport = params => {
    return getRequest('/tUnitReport/getTUnitReport', params);
};

//查询全部
export const queryTUnitReportAll = params => {
    return getRequest('/tUnitReport/queryTUnitReportAll', params);
};
export const checkThePeopleStatisticsTable = params => {
	return getRequest('/tUnitReport/checkThePeopleStatisticsTable', params);
};
export const getTUnitReportByOrderId = params => {
	return getRequest('/tUnitReport/getTUnitReportByOrderId', params);
};