import { getRequest, postRequest, putRequest, postBodyRequest, getNoAuthRequest, postNoAuthRequest } from '@/libs/axios';
	export const addTCertificateManage = params => {
		return postBodyRequest('/tCertificateManage/addTCertificateManage',params);
	};
	export const deleteTCertificateManage = params => {
		return postRequest('/tCertificateManage/deleteTCertificateManage',params);
	};
	export const updateTCertificateManage = params => {
		return postBodyRequest('/tCertificateManage/updateTCertificateManage',params);
	};
	export const queryTCertificateManageList = params => {
		return getRequest('/tCertificateManage/queryTCertificateManageList',params);
	};
	export const getTCertificateManage = params => {
		return getRequest('/tCertificateManage/getTCertificateManage',params);
	};

//查询全部
export const queryTCertificateManageAll = params => {
	return getRequest('/tCertificateManage/queryTCertificateManageAll',params);
};