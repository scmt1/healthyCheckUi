import {getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest} from '@/libs/axios';
import axios from "axios";



export const uploadEmployeeInfo = params => {
    return postRequest('/professionalUpload/uploadEmployeeInfo',params);
};

export const uploadPvHlthExamRst = params => {
    return postRequest('/professionalUpload/uploadPvHlthExamCert',params);
};

export const uploadPvHlthExamCert = params => {
    return postRequest('/professionalUpload/uploadPvHlthExamCert',params);
};
