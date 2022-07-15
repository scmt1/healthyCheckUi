import {
	getRequest,
	postRequest,
	putRequest,
	postBodyRequest,
	getNoAuthRequest,
	postNoAuthRequest,
	postBodyNoTypeRequest,
	downloadPost,
	downloadPostData
} from '@/libs/axios';
export const addTTemplate = params => {
	return postBodyNoTypeRequest('/tTemplate/addTTemplate', params);
};
export const deleteTTemplate = params => {
	return postRequest('/tTemplate/deleteTTemplate', params);
};
export const updateTTemplate = params => {
	return postBodyNoTypeRequest('/tTemplate/updateTTemplate', params);
};
export const queryTTemplateList = params => {
	return getRequest('/tTemplate/queryTTemplateList', params);
};
//查询所有文档
export const queryAllTTemplateList = params => {
	return getRequest('/tTemplate/queryAllTTemplateList', params);
};

export const getTTemplate = params => {
	return getRequest('/tTemplate/getTTemplate', params);
};
//预览模板信息
export const getTemplatePreview = params => {
	return postRequest('/tTemplate/getTemplatePreview', params);
};

//批量导入模板导出
export const exportTemplate= (params) => {
	return downloadPost('/tTemplate/downloadTemplate', params);
};

export const exportWord= (params) => {
	return downloadPost('/tTemplate/exportTemplate', params);
};

export const exportTemplatePdf= (params) => {
	return downloadPost('/tTemplate/exportTemplatePdf', params);
};

export const exportTemplatePdfZip= (params) => {
	return downloadPost('/tTemplate/exportTemplatePdfZip', params);
};
export const exportTemplatePdfBatch= (params) => {
	return downloadPostData('/tTemplate/exportTemplatePdfBatch', params);
};
//预览模板信息带数据
export const getTemplatePreviewData= (params) => {
	return postBodyRequest('/tTemplate/getTemplatePreviewData', params);
};
//生成体检报告
export const generatePhysicalExaminationReport= (params) => {
	return postRequest('/tTemplate/generatePhysicalExaminationReport', params);
};
//生成体检报告(先合并word 再 转pdf)
export const generateWordReport= (params) => {
	return postBodyRequest('/tTemplate/generateWordReport', params);
};
export const getReportWordBatch= (params) => {
	return postBodyRequest('/tTemplate/getReportWordBatch', params);
};

//生成体检报告(先合并word 再 转pdf)
export const generateWordReportHealthy= (params) => {
	return postBodyRequest('/tTemplate/generateWordReportHealthy', params);
};
//生成体检报告
export const generateReportByPersonId= (params) => {
	return getRequest('/tTemplate/generateReportByPersonId', params);
};
//生成体检报告
export const generateReportByPersonIds= (params) => {
	return postBodyRequest('/tTemplate/generateReportByPersonIds', params);
};
//生成体检报告(复查报告)
export const generateReportByPersonIdsFC= (params) => {
	return postBodyRequest('/tTemplate/generateReportByPersonIdsFC', params);
};
//生成体检报告(告知书)
export const generateReportByPersonIdsNotice= (params) => {
	return postBodyRequest('/tTemplate/generateReportByPersonIdsNotice', params);
};
//生成体检报告(封面)
export const generateReportByPersonIdsfirstPage= (params) => {
	return postBodyRequest('/tTemplate/generateReportByPersonIdsfirstPage', params);
};

//预览模板信息带数据(健康证)
export const getTemplatePreviewHealthyData= (params) => {
	return postBodyRequest('/tTemplate/getTemplatePreviewHealthyData', params);
};
//获取委托协议相关数据(检查的单位、订单、人员、项目信息)
export const getEntrustData = params => {
	return getRequest('/tTemplate/getEntrustData',params);
};


