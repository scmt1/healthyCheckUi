import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';
import axios from "axios";

export const queryTConclusionList = params => {
    return getRequest('/tConclusion/queryTConclusionList', params);
};
export const syncTConclusion = params => {
    return axios({
        method: 'get',
        // url: `/spiderUrl/spider/run?id=${params.id}`,
        url: `/spiderUrl/rest/run/${params.id}`,
        header: {
            'Content-Type': 'application/json;utf-8'
        }
    });
};


export const runSpiderTask = params => {
    return axios({
        method: 'post',
        url: `/spiderUrl/rest/run/4a25b537b5794f7b9f0be1584e09e6e7`,
        data: params,
        header: {
            'Content-Type': 'application/json;utf-8'
        }
    });
};






