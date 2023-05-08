import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest,postBodyNoTypeRequest} from '@/libs/axios';

export const addTGroupOrder = params => {
    return postBodyRequest('/tGroupOrder/addTGroupOrder', params);
};
export const deleteTGroupOrder = params => {
    return postRequest('/tGroupOrder/deleteTGroupOrder', params);
};
export const updateTOrderHistoryStateById = params => {
    return postRequest('/tGroupOrder/updateTOrderHistoryStateById', params);
};
export const updateTGroupOrder = params => {
    return postBodyRequest('/tGroupOrder/updateTGroupOrder', params);
};
export const updatePayStatus = params => {
    return postRequest('/tGroupOrder/updatePayStatus', params);
};
export const queryTGroupOrderList = params => {
    return getRequest('/tGroupOrder/queryTGroupOrderList', params);
};
export const queryAllTGroupOrderList = params => {
    return getRequest('/tGroupOrder/queryAllTGroupOrderList', params);
};
export const getTGroupOrder = params => {
    return getRequest('/tGroupOrder/getTGroupOrder', params);
};
export const getTGroupOrderNumByCreateId = params => {
    return getRequest('/tGroupOrder/getTGroupOrderNumByCreateId', params);
};
export const getTGroupOrderByIdWithLink = params => {
	return getRequest('/tGroupOrder/getTGroupOrderByIdWithLink', params);
};
export const updateTGroupOrderState = params => {
    return postBodyRequest('/tGroupOrder/updateTGroupOrderState', params);
};
export const queryTGroupOrderListByStatus = params => {
    return getRequest('/tGroupOrder/queryTGroupOrderListByStatus', params);
};
//查询审批订单
export const queryApproveTGroupOrderList = params => {
    return getRequest('/tGroupOrder/queryApproveTGroupOrderList', params);
};
export const addPracticeTGroupOrder = params => {
    return postBodyRequest('/tGroupOrder/addPracticeTGroupOrder', params);
};
export const updatePracticeTGroupOrder = params => {
    return postBodyRequest('/tGroupOrder/updatePracticeTGroupOrder', params);
};
export const updateTGroupOrderInfo = params => {
    return postBodyRequest('/tGroupOrder/updateTGroupOrderInfo', params);
};
export const getTGroupOrderList = params => {
    return getRequest('/tGroupOrder/getTGroupOrderList', params);
};


//订单合并
export const consolidatedOrder = params => {
    return postRequest('/tGroupOrder/consolidatedOrder', params);
};
//上传订单附件
export const uploadorderFile = params => {
    return postBodyNoTypeRequest('/tGroupOrder/uploadorderFile', params);
};