import axios from 'axios';
import {getStore, setStore} from '@/libs/storage';
// 统一请求路径前缀
let base = '/lis';
export const getSynchronizationRequest = (params) => {
    let accessToken = getStore('accessToken');
    let url="/FtpClient/synchronization";
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        timeout: 60000*10,//超时10分钟
    });

};