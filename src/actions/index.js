import axios from 'axios';
import qs from 'qs';
import action_types from '../reducers/types';
import _ from 'lodash';
import {ToastAndroid} from 'react-native';

export * from './base';

export * from './rec';

export * from './message';

export * from './home';

export * from './wf';

/**
 * 保存部件列表s
 * @param partTypes
 * @returns {{type: string, partTypes: *}}
 */
export const savePartTypes = partTypes => {
  return {
    type: action_types.SAVE_PART_TYPE,
    partTypes,
  };
};

/**
 * 保存图层开关
 * @param layerSwitch
 * @returns {{type: string, layerSwitch: *}}
 */
export const saveLayerSwitch = layerSwitch => {
  return {
    type: action_types.SAVE_LAYER_SWITCH,
    layerSwitch,
  };
};

/**
 * 获取图层用途数据（在部件上报获取partID需要用到）
 * @returns {{type: string, layerUsage: *}}
 */
export const fetchLayerUsage = () => {
  return (dispatch, getState) => {
    if (_.isEmpty(getState().localData.map.layerUsage)) {
      axios
        .get('/ma/rec/layerusage.htm')
        .then(res => {
          dispatch({
            type: action_types.SAVE_LAYER_USAGE,
            layerUsage: res.data.result || {},
          });
        })
        .catch(err => {
          ToastAndroid.show('图层用途获取失败', ToastAndroid.SHORT);
        });
    }
  };
};
