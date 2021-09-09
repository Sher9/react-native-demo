import axios from 'axios';
import qs from 'qs';

/**
 * 今日提示列表
 */
export const fetchNoticeList = params =>
  axios.get(`/ma/patrol/notice/list.htm`, {params});

/**
 * 获取今日提示数目
 * @param {*} params
 */
export const fetchNoticeCount = () => axios.get(`/ma/patrol/notice/count.htm`);

/**
 * 获取行政区域
 * @param params
 */
export const fetchRegion = params => axios.get('/region/trees', {params});

/**
 * 获取菜单
 */
export const fetchMenus = params => axios.get('/ma/usernavitem.htm', {params});

/**
 *
 * @param {*} subTypeID
 */
export const clickMenu = params => axios.get('ma/addclicks.htm', {params});

/**
 * 获取立案条件
 * @param subTypeID
 */
export const getRecConditions = params =>
  axios.get('/mis/rec/getreccontions.htm', {params});

/**
 * 登录记录列表
 */
export const fetchLastLoginRecord = () =>
  axios.get(`/ma/patrol/login/lastlogin.htm`);

/**
 * 查询页面案件列表
 * @param {} params
 */
export const fetchQueryRecList = params =>
  axios.get(`/ma/rec/reclist.htm`, {params});
