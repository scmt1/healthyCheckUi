import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTOrderGroupItemProject = params => {
    return postBodyRequest('/tOrderGroupItemProject/addTOrderGroupItemProject', params);
};
export const deleteTOrderGroupItemProject = params => {
    return postRequest('/tOrderGroupItemProject/deleteTOrderGroupItemProject', params);
};
export const updateTOrderGroupItemProject = params => {
    return postBodyRequest('/tOrderGroupItemProject/updateTOrderGroupItemProject', params);
};
export const queryTOrderGroupItemProjectList = params => {
    return getRequest('/tOrderGroupItemProject/queryTOrderGroupItemProjectList', params);
};
export const getTOrderGroupItemProject = params => {
    return getRequest('/tOrderGroupItemProject/getTOrderGroupItemProject', params);
};

//获取选中项目 根据组合项目id
export const getSelectedBaseItemByItemId = params => {
	return getRequest('/tOrderGroupItemProject/getSelectedBaseItemByItemId', params);
};
//获取未检查项目 根据人员id和订单id
export const queryNoCheckTOrderGroupItemProjectList = params => {
    return getRequest('/tOrderGroupItemProject/queryNoCheckTOrderGroupItemProjectList', params);
};
//获取弃检项目 根据人员id和订单id
export const queryAbandonTOrderGroupItemProjectList = params => {
    return getRequest('/tOrderGroupItemProject/queryAbandonTOrderGroupItemProjectList', params);
};


