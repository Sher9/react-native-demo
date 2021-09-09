import axios from 'axios';
import {ToastAndroid} from 'react-native';
import action_types from '../reducers/types';
import qs from 'qs';
import _ from 'lodash';
/**
 * 案件自处置
 * @param params
 */

export const selfdeal = params =>
  axios.post(
    '/ma/rec/selfdeal.htm',
    qs.stringify({rec: JSON.stringify(params)}),
  );

/**
 * 获取案件列表（任务和历史）
 * @param params
 */
export const fetchRecList = params => {
  if (params.routeName === 'Task') {
    return axios.get('/ma/rec/task/list.htm', {params});
  } else if (params.routeName === 'History') {
    return axios.get('/ma/rec/task/historylist.htm', {params});
  }
};

/**
 * 获取任务详情
 * @param params
 */
export const fetchRecDetail = params =>
  axios.get('/mis/rec/getrecdetail.htm', {params});

/**
 * 获取部件信息字段
 */
export const fetchPartField = () => axios.get('/ma/rec/partfield.htm');

/**
 * 核实/核查反馈
 */
export const feedback = params =>
  axios.post('/ma/rec/feedback.htm', qs.stringify(params));

/**
 * 获取案件办理进度
 * @param params
 */
export const fetchRecProcess = params =>
  axios.get('/mis/wf/process.htm', {params});

/**
 * 保存案件
 * @param params
 */
export const saveCase = params =>
  axios.post('/mis/rec/save.htm', qs.stringify(params));

/**
 * 获取大小类立案条件
 * @param subTypeID
 */
export const getRecContions = subTypeID =>
  axios.get('/mis/rec/getreccontions.htm', {params: {subTypeID}});

/**
 * 获取案件工作项
 * @param params
 */
export const fetchRecWorkItems = params =>
  axios.get('/ma/wf/getwfworkitems.htm', {params});

/**
 * 获取区划数据（案件筛选时候用的）
 * @returns {function(*)}
 */
export const fetchRegions = () => {
  return dispatch => {
    storage
      .load({key: 'regions'})
      .then(data => {
        dispatch({
          type: action_types.SYNC_DIC_DATA,
          data: {
            regions: data,
          },
        });
      })
      .catch(error => {
        axios
          .get('/region/cascaders?regionType=4')
          .then(res => {
            _.forEach(res.data.result, root => {
              _.forEach(root.children, area => {
                _.forEach(area.children, street => {
                  street.children = [
                    ...[
                      {
                        label: '全部社区',
                        value: street.value,
                        children: [],
                        attributes: street.attributes,
                      },
                    ],
                    ...street.children,
                  ];
                });
                area.children = [
                  ...[
                    {
                      label: '全部街道',
                      value: area.value,
                      children: [],
                      attributes: area.attributes,
                    },
                  ],
                  ...area.children,
                ];
              });
              root.children = [
                ...[
                  {
                    label: '全部区',
                    value: root.value,
                    children: [],
                    attributes: root.attributes,
                  },
                ],
                ...root.children,
              ];
            });
            storage.save({key: 'regions', data: res.data.result});
            dispatch({
              type: action_types.SYNC_DIC_DATA,
              data: {
                regions: res.data.result,
              },
            });
          })
          .catch(err => {
            ToastAndroid.show(
              err.message || '区划数据获取失败',
              ToastAndroid.SHORT,
            );
          });
      });
  };
};

/**
 * 获取惯用语列表
 * @param params
 */
export const fetchPhrase = params => axios.get('/ma/phrase/list.htm', {params});

/**
 * 保存惯用语
 * @param params
 */
export const savePhrase = params =>
  axios.post('/ma/phrase/save.htm', qs.stringify(params));

/**
 * 更新惯用语
 * @param params
 */
export const updatePhrase = params =>
  axios.post('/ma/phrase/update.htm', qs.stringify(params));

/**
 * 删除惯用语
 * @param params
 */
export const deletePhrase = params =>
  axios.post('/ma/phrase/delete.htm', qs.stringify(params));

/**
 * 获取已上报、已立案、已作废案件统计数量
 * @param params
 */
export const fetchConditionRecStat = params =>
  axios.get('/ma/rec/task/stat.htm', {params});

/**
 * 获取已上报、已立案、已作废案件反查列表
 * @param params
 */
export const fetchConditionRecList = params => {
  //考评上报历史列表
  if (params.idCode === 'assessment') {
    return axios.get('/ma/task/rec/getrec.htm', {params});
  } else {
    return axios.get('/ma/rec/task/getrec.htm', {params});
  }
};

/**
 * 待办数目
 * @param {*} params
 */
export const fetchRecListCount = params =>
  axios.get('/ma/reclist/patrol/todo/count', {params});

/**
 * 处置通待办数目
 * @param {*} params
 */
export const fetchDisposeRecListCount = params =>
  axios.get('/ma/reclist/dispose/todo/count', {params});
