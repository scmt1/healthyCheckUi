import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';

export const getWebSocket = params => {
    return getRequest('/webSocket/getWebSocket',params);
};
