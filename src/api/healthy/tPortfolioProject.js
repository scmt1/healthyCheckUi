// 统一请求路径前缀在libs/axios.js中修改
import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';

export const addTPortfolioProject = params => {
    return postBodyRequest('/tPortfolioProject/addTPortfolioProject', params);
};
export const deleteTPortfolioProject = params => {
    return postRequest('/tPortfolioProject/deleteTPortfolioProject', params);
};
export const updateTPortfolioProject = params => {
    return postBodyRequest('/tPortfolioProject/updateTPortfolioProject', params);
};
export const queryTPortfolioProjectList = params => {
    return getRequest('/tPortfolioProject/queryTPortfolioProjectList', params);
};
export const getTPortfolioProject = params => {
    return getRequest('/tPortfolioProject/getTPortfolioProject', params);
};
export const queryTPortfolioProjectListByOfficeId = params => {
    return getRequest('/tPortfolioProject/queryTPortfolioProjectListByOfficeId', params);
};
export const queryAllPortfolioProjectList = params => {
    return getRequest('/tPortfolioProject/queryAllPortfolioProjectList', params);
};

//只查询基础项目 无结果
export const getBaseProjectByPortfolioId = params => {
    return getRequest('/tPortfolioProject/getBaseProjectByPortfolioId', params);
};
