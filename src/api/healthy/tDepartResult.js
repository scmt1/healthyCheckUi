import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTDepartResult = params => {
    return postBodyRequest('/tDepartResult/addTDepartResult', params);
};
export const deleteTDepartResult = params => {
    return postRequest('/tDepartResult/deleteTDepartResult', params);
};
export const updateTDepartResult = params => {
    return postRequest('/tDepartResult/updateTDepartResult', params);
};
export const queryTDepartResultList = params => {
    return getRequest('/tDepartResult/queryTDepartResultList', params);
};
export const getTDepartResult = params => {
    return getRequest('/tDepartResult/getTDepartResult', params);
};
export const getBaseProjectByGroupId = params => {
	return getRequest('/tDepartResult/getBaseProjectByGroupId', params);
};
// 根据分组id获取分组项目
export const getItemByGroupId = params => {
	return getRequest('/tDepartResult/getItemByGroupId', params);
};
//根据组合项目获取基础体检项目
export const getBaseProjectByPortfolioProjectId = params => {
    return getRequest('/tDepartResult/getBaseProjectByPortfolioProjectId', params);
};
//根据人员id和组合项目id查询体检结果
export const getDepartResultDataByPersonIdAndPortfolioProId = params => {
    return getRequest('/tDepartResult/getDepartResultDataByPersonIdAndPortfolioProId', params);
};
//根据人员和组合项目找组合体检结果
export const getDepartResultByPerIdAndItemId = params => {
    return getRequest('/tDepartResult/getDepartResultByPerIdAndItemId', params);
};
export const queryPersonCheckOffice = params => {
    return getRequest('/tDepartResult/queryPersonCheckOffice', params);
};
export const queryPersonCheckProject = params => {
    return getRequest('/tDepartResult/queryPersonCheckProject', params);
};
export const queryTDepartResultListAndOfficeName = params => {
    return getRequest('/tDepartResult/queryTDepartResultListAndOfficeName', params);
};
export const getGroupByOfficeId = params => {
    return getRequest('/tDepartResult/getGroupByOfficeId', params);
};
export const updateResultAndItemResult = params => {
    return postBodyRequest('/tDepartResult/updateResultAndItemResult', params);
};
export const addOrderGroupItemPorjectByExtra = params => {
    return postRequest('/tDepartResult/addOrderGroupItemPorjectByExtra', params);
};
export const queryTDepartResultByPersonId = params => {
    return postBodyRequest('/tDepartResult/queryTDepartResultByPersonId', params);
};
