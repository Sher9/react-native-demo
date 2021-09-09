import axios from "axios";
import qs from "qs";

/**
 * 办理
 */
export const assign = params => axios.post('/mis/wf/assign.htm', qs.stringify(params));

/**
 * 撤销办理
 */
export const cancelAssign = params => axios.post('/mis/wf/cancelassign.htm', qs.stringify(params));

/**
 * 回复督办
 */
export const replySupervise = params => axios.post('/mis/wf/replysupervise.htm', qs.stringify(params));

/**
 * 批转
 */
export const transit = params => axios.post('/mis/wf/transit.htm', qs.stringify(params));

/**
 * 申请授权
 */
export const replyAccredit = params => axios.post('/mis/wf/accreditandreply.htm', qs.stringify(params));

/**
 * 回退
 */
export const rollback = params => axios.post('/mis/wf/rollback.htm', qs.stringify(params));


/**
 * 获取批转对象
 * @param params
 */
export const fetchTansitObject = params => axios.get('/mis/wf/getworkflows.htm', {params});

/**
 * 获取回退对象
 * @param params
 */
export const fetchRollback = params => axios.get('/mis/wf/getrollbackroleandpart.htm', {params});

/**
 * 获取授权人
 * @param params
 */
export const fetchAccreditPart = params => axios.get('/mis/wf/getaccreditpart.htm', {params});

/**
 * 获取督办列表
 * @param params
 */
export const fetchSuperviseList = params => axios.get('/mis/wf/superviselist.htm', {params});

/**
 * 批转页面获取是否上传
 * @param {*} params 
 */
export const fetchIsMediaMustUpload = params => axios.get('/ma/rec/sysconfig', {params});

/**
 * 工作项-是否有管理多媒体的权限
 * @param param
 */
export const fetchUserToRight = () => axios.get('mis/rec/getusertoright.htm');