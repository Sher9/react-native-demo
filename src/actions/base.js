/**一些基础通用的接口，可直接复制到新项目中*/
import axios from 'axios';
import {Alert, PermissionsAndroid, ToastAndroid} from 'react-native';
import action_types from '../reducers/types';
//import NavigateHelper from '../utils/navigationUtil';
import {Toast} from '@ant-design/react-native';
// import WebSocketHelper from '../actions/ws';
import moment from 'moment';
import qs from 'qs';
import _ from 'lodash';
axios.defaults.timeout = 30000; //超时时间
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
//监听当前位置的timer
let positionWatch;

//用于批量生成取消请求的
const CancelToken = axios.CancelToken;

//请求拦截器
axios.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

//响应拦截器
axios.interceptors.response.use(
  function(response) {
    if (response.data.code === 0) {
      global.AppData.AlertFlag = false;
      return response;
    } else if (response.data.code === -1) {
      global.AppData.AlertFlag = false;
      return Promise.reject({
        code: -1,
        message: response.data.msg || '服务器正忙，请稍后再试',
      });
    } else if (response.data.code === 101 && !global.AppData.AlertFlag) {
      Alert.alert(
        '',
        '当前用户信息已失效，请点击确定重新登录',
        [
          {
            text: '确定',
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
      global.AppData.AlertFlag = true; //防止多次弹窗
      navigator.geolocation.clearWatch(positionWatch); //清除位置监听事件
      return Promise.reject('用户未登录');
    } else {
      global.AppData.AlertFlag = false;
      return Promise.reject({
        code: response.data.code,
        message: response.data.msg || '服务器正忙，请稍后再试',
      });
    }
  },
  function(error) {
    global.AppData.AlertFlag = false;
    if (error === 'ECONNABORTED') {
      return Promise.reject({code: 'ECONNABORTED', msg: '登录状态检验超时'});
    } else {
      return Promise.reject(error);
    }
  },
);

/**
 * 同步文件服务器、服务端基础地址
 * @param serverAPI
 * @param fileServerAPI
 * @param staticPagePath
 */
export const syncAPIs = (
  serverAPI,
  fileServerAPI,
  staticPagePath,
  websocketAPI,
) => {
  axios.defaults.baseURL = serverAPI;
  return {
    type: action_types.SYNC_BASE_API,
    serverAPI,
    fileServerAPI,
    staticPagePath,
    websocketAPI,
  };
};

/**
 * 同步token
 * @param token
 * @returns {{type: string, token: *}}
 */
export const syncToken = token => {
  axios.defaults.headers['token'] = token;
  return {
    type: action_types.SYNC_TOKEN,
    token,
  };
};

/**
 * 同步用户信息
 * @param userInfo
 * @returns {{type: string, userInfo: *}}
 */
export const syncUserInfo = userInfo => {
  return {
    type: action_types.SYNC_USER,
    userInfo,
  };
};

/**
 * 初始化本地数据
 * @param localData
 * @returns {{type: string, localData: *}}
 */
export const initLocalData = localData => {
  axios.defaults.baseURL = localData.serverAPI;
  axios.defaults.headers['token'] = localData.token;
  return {
    type: action_types.INIT_LOCAL_DADA,
    localData,
  };
};

/**
 * 退出登录
 */

export const logOut = () => axios.post('/logout');

/**
 * 修改密码
 */
export const resetPassword = params =>
  axios.post('/ma/patrol/modifypwd.htm', qs.stringify(params));

/**
 * 用户登录
 * @param params
 */
export const userLogin = params =>
  axios.post(
    '/login',
    qs.stringify({
      ...params,
      idcode: 'inspect',
      useragent: 'android',
    }),
  );

/**
 * 检测登录状态是否过期
 */
export const verifyLoginState = () => {
  //当网络状态不好的时候取消请求
  let source = CancelToken.source();
  let cancelTimer = setTimeout(() => {
    source.cancel('ECONNABORTED');
    clearTimeout(cancelTimer);
  }, 3000);
  return axios.post('verify', null, {cancelToken: source.token});
};

/**
 * 上传多媒体
 */
export const uploadMedias = (url, medias, extraParams) => {
  extraParams.callback = axios.defaults.baseURL + extraParams.callback;
  return new Promise((resolve, reject) => {
    Toast.loading('正在上传多媒体', 0);
    _.forEach(medias, (item, index) => {
      let data = new FormData();
      let failedCount = 0;
      _.mapKeys(extraParams, (value, key) => data.append(key, value));
      data.append('file', {
        uri: item.mediaPath,
        type: item.mimeType,
        name: encodeURI(item.mediaName),
      });
      //因为上报和处置是一个页面，把mediaUsage放在了media里，但处置和核查放在extraParams里，故此处做此判断
      item.mediaUsage && data.append('usage', item.mediaUsage);
      data.append('showOrder', item.mediaUsage === '处置后' ? 2 : 1);
      axios
        .post(url + '/upload', data, {timeout: 30000})
        .then(() => {
          if (index === medias.length - 1) {
            Toast.success(
              `本次上传${medias.length}个文件，成功 ${medias.length -
                failedCount} 个，失败 ${failedCount} 个`,
              1,
            );
            resolve();
          }
        })
        .catch(() => {
          failedCount += 1;
          if (index === medias.length - 1) {
            reject();
          }
        });
    });
  });
};

/**
 * 删除多媒体
 */
export const removeMedia = (url, params) => {
  params.callback = axios.defaults.baseURL + params.callback;
  return axios.post(url + '/remove', qs.stringify(params), {timeout: 10000});
};

/**
 * 根据坐标点设置坐标的网格数据和区划信息（cellInfo）
 * @param coordinate
 * @param callback
 * @returns {function(*)}
 */
export const setCellInfo = (coordinate, callback) => {
  return dispatch => {
    if (!coordinate.lng || !coordinate.lat) {
      dispatch({
        type: action_types.LOCATE,
        address: '前往地图选取位置',
      });
      return;
    } else {
      dispatch({
        type: action_types.LOCATE,
        address: '正在获取当前位置的区划和网格信息',
        ...coordinate,
      });
    }
    getAddressByxy({
      x: coordinate.lng,
      y: coordinate.lat,
    })
      .then(res => {
        dispatch({
          type: action_types.LOCATE,
          ...coordinate,
          address: res.data.result.address,
          cellInfo: res.data.result.cellInfo,
        });
        callback && callback(res.data.result.address);
      })
      .catch(err => {
        ToastAndroid.show(
          err.message || '区划和网格信息获取失败',
          ToastAndroid.SHORT,
        );
        dispatch({
          type: action_types.LOCATE,
          address: '网格信息获取失败',
          ...coordinate,
        });
      });
  };
};

/**
 * 设置位置描述
 */
export const setAddress = address => {
  return dispatch => {
    dispatch({
      type: action_types.EDIT_ADDRESS,
      address: address,
    });
  };
};

/**
 * 设置位置详细信息
 */
export const setLocation = location => {
  return dispatch => {
    dispatch({
      type: action_types.LOCATE,
      lng: location.coordX,
      lat: location.coordY,
      address: location.address,
      cellInfo: location.cellInfo,
    });
  };
};

/**
 * 根据xy获取address
 * @param params
 */
export const getAddressByxy = params =>
  axios.get('/gis/gis/getaddressbyxy.htm', {params});

/**
 * 根据xy获取附近兴趣点
 * @param params
 */
export const getPOIListyxy = params =>
  axios.get('/gis/gis/getaddresslistbyxy.htm', {params});

/**
 * 获取大小类
 * @returns {{type: string, data: *}}
 */
export const fetchRecTypes = () => {
  return (dispatch, getState) => {
    //if (!getState().recTypes || getState().recTypes.length === 0) {
    axios
      .get('/mis/rec/getrectypes.htm')
      .then(res => {
        dispatch({
          type: action_types.STASH_TYPES,
          data: res.data.result,
        });
      })
      .catch(err => {
        ToastAndroid.show('大小类获取失败', ToastAndroid.SHORT);
      });
    //}
  };
};

/**
 * 检查更新
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const checkVersion = params =>
  axios.get('/ma/checkversion.htm', {params});

/**
 * 获取兴趣点列表
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const fetchPOIList = params =>
  axios.get('/gis/gis/getpoisbyname.htm', {params});

/**
 * 通过gps或地图中心点定位当前位置 传coordinate代表定位地图中心点
 * @param coordinate
 * @param callback
 * @returns {{type: string, coordinate: object}}
 */
export const locate = (coordinate, callback) => {
  if (coordinate) {
    return {
      type: action_types.LOCATE,
      ...coordinate,
    };
  } else {
    Toast.loading('GPS定位中', 0);
    return dispatch => {
      dispatch({
        type: action_types.LOCATE,
        address: '正在获取位置',
      });
      navigator.geolocation.getCurrentPosition(
        location => {
          dispatch({
            type: action_types.LOCATE,
            lng: location.coords.longitude,
            lat: location.coords.latitude,
          });
          callback &&
            callback({
              lng: location.coords.longitude,
              lat: location.coords.latitude,
            });
          Toast.hide();
        },
        err => {
          Toast.hide();
          if (err.code === 2) {
            ToastAndroid.show('GPS开关未开启', ToastAndroid.SHORT);
          } else if (err.code === 3) {
            //高精度定位失败后，就用网络位置
            ToastAndroid.show(
              '当前位置gps信号弱,将使用网络位置',
              ToastAndroid.SHORT,
            );
            navigator.geolocation.getCurrentPosition(
              location => {
                dispatch({
                  type: action_types.LOCATE,
                  lng: location.coords.longitude,
                  lat: location.coords.latitude,
                });
                callback &&
                  callback({
                    lng: location.coords.longitude,
                    lat: location.coords.latitude,
                  });
              },
              () =>
                ToastAndroid.show(
                  '当前位置网络信号弱，请检查设备网络状态',
                  ToastAndroid.SHORT,
                ),
              {timeout: 5000},
            );
          } else {
            ToastAndroid.show(err.message, ToastAndroid.SHORT);
          }
        },
        {enableHighAccuracy: true, timeout: 3000, maximumAge: 0},
      );
    };
  }
};

/**
 * 监听上传位置
 * @param userID
 */
export const watchPosition = userID => {
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  )
    .then(granted => {
      if (granted === 'granted') {
        let positions = [];
        positionWatch = navigator.geolocation.watchPosition(
          data => {
            positions.push({
              coordL: data.coords.longitude,
              coordB: data.coords.latitude,
              patrolID: userID,
              updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            });

            if (positions.length >= 10) {
              axios
                .post(
                  '/ma/patrol/position/save.htm',
                  qs.stringify({patrolPos: JSON.stringify(positions)}),
                )
                .then(() => {
                  positions = [];
                  ToastAndroid.show('轨迹上传成功', ToastAndroid.SHORT);
                })
                .catch(() => {
                  positions = [];
                });
            }
          },
          () => {},
          {
            distanceFilter: 10,
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          },
        );
      } else if (granted === 'denied') {
        ToastAndroid.show(
          '实时监控位置失败，请去系统设置里授权APP定位权限',
          ToastAndroid.SHORT,
        );
      }
    })
    .catch(() => {
      ToastAndroid.show(
        '实时监控位置失败，请去系统设置里授权APP定位权限',
        ToastAndroid.SHORT,
      );
    });
};

/**
 * 上传当前位置到服务器
 * @param userID
 * @param location
 */
export const uploadCurrentPosition = (userID, location) => {
  let positions = [];
  positions.push({
    coordL: location.lng,
    coordB: location.lat,
    patrolID: userID,
    updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  });
  axios
    .post(
      '/ma/patrol/position/save.htm',
      qs.stringify({patrolPos: JSON.stringify(positions)}),
    )
    .then(() => {
      positions = [];
    })
    .catch(err => {
      positions = [];
      ToastAndroid.show('上传当前位置失败，请重试', ToastAndroid.SHORT);
    });
};

/**
 * 验证当前登录人员是否在线
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const verifyOnLineStatus = params => {
  return dispatch => {
    axios
      .get('/ma/ws/connected.htm', {params})
      .then(res => {
        dispatch({
          type: action_types.UPDATE_ONLINE_STATUS,
          isOnLine: res.data.result,
        });
      })
      .catch(err => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      });
  };
};
