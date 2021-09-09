/**
 * 负责接收数据然后放入store中存储
 */

import {combineReducers} from 'redux';
import action_types from './types';
const initLocalData = {
  serverAPI: 'http://192.168.6.122:8083',
  fileServerAPI: 'http://192.168.6.112:8090',
  websocketAPI: 'http://59.208.39.5:7888/im',
  staticPagePath: 'http://59.208.39.5:8080/qjcg',
  userInfo: {
    userName: '监督员1',
    unitName: '',
  },
  msgCount: 5,
  token: '',
  map: {
    partSwitch: false,
    partTypes: [],
    layerUsage: {},
  },
};
//初始化字典表数据
const initDicData = {
  regions: [],
};

/**
 * 更新本地数据
 * @param state
 * @param action
 */
const localDataReducer = (state = initLocalData, action) => {
  switch (action.type) {
    case action_types.INIT_LOCAL_DADA:
      return {
        ...state,
        ...action.localData,
      };
    case action_types.SYNC_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    //存储个人信息
    case action_types.SYNC_USER:
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case action_types.SYNC_BASE_API:
      return {
        ...state,
        serverAPI: action.serverAPI,
        fileServerAPI: action.fileServerAPI,
        staticPagePath: action.staticPagePath,
        websocketAPI: action.websocketAPI,
      };
    //保存要展示的部件
    case action_types.SAVE_PART_TYPE:
      return {
        ...state,
        map: {
          ...state.map,
          partTypes: action.partTypes,
        },
      };

    //图层开关
    case action_types.SAVE_LAYER_SWITCH:
      return {
        ...state,
        map: {
          ...state.map,
          ...action.layerSwitch,
        },
      };
    //图层用途
    case action_types.SAVE_LAYER_USAGE:
      return {
        ...state,
        map: {
          ...state.map,
          layerUsage: action.layerUsage,
        },
      };
    default:
      return state;
  }
};

/**
 * 暂存大小类
 * @param state
 * @param action
 * @returns {Array}
 */
const recTypesReducer = (state = [], action) => {
  if (action.type === action_types.STASH_TYPES) {
    return action.data;
  } else {
    return state;
  }
};

/**
 * 定位当前的位置
 * @param state
 * @param action
 */
const locateReducer = (state = {cellInfo: {}}, action) => {
  switch (action.type) {
    case action_types.LOCATE:
      return {
        ...state,
        address: action.address,
        lat: action.lat,
        lng: action.lng,
        cellInfo: action.cellInfo,
      };
    case action_types.EDIT_ADDRESS:
      return {
        ...state,
        address: action.address,
      };
    default:
      return state;
  }
};

/**
 * 更新字典表数据
 * @param state
 * @param action
 */
const dicDataReducer = (state = initDicData, action) => {
  switch (action.type) {
    case action_types.SYNC_DIC_DATA:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

/**
 * 用户状态
 * @param state
 * @param action
 * @returns {{isOnLine: boolean}}
 */
const userStatusReducer = (state = {isOnLine: false}, action) => {
  switch (action.type) {
    case action_types.UPDATE_ONLINE_STATUS:
      return {
        ...state,
        isOnLine: action.isOnLine,
      };
    default:
      return state;
  }
};

export default new combineReducers({
  location: locateReducer,
  localData: localDataReducer,
  recTypes: recTypesReducer,
  dicData: dicDataReducer,
  userStatus: userStatusReducer,
});
