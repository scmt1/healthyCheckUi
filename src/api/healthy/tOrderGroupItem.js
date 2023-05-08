import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTOrderGroupItem = params => {
    return postBodyRequest('/tOrderGroupItem/addTOrderGroupItem', params);
};
export const deleteTOrderGroupItem = params => {
    return postRequest('/tOrderGroupItem/deleteTOrderGroupItem', params);
};
export const updateTOrderGroupItem = params => {
    return postBodyRequest('/tOrderGroupItem/updateTOrderGroupItem', params);
};
export const queryTOrderGroupItemList = params => {
    return getRequest('/tOrderGroupItem/queryTOrderGroupItemList', params);
};
export const getTOrderGroupItem = params => {
    return getRequest('/tOrderGroupItem/getTOrderGroupItem', params);
};
//获取订单检查项目 根据订单id、分组id
export const queryOrderGroupItemList = params => {
    return getRequest('/tOrderGroupItem/queryOrderGroupItemList', params);
};
//获取订单检查项目 根据订单id、分组id
export const deleteGroupItem = params => {
    return getRequest('/tOrderGroupItem/deleteGroupItem', params);
};
