import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

global.storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  //size: 1000,
  //设置存储引擎，如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,
  defaultExpires: null,
  // 读写时在内存中缓存数据。默认启用。
  //enableCache: true,
});

//用于存储全局变量
global.AppData = {
  //熄屏的时候记住状态
  offLine: {
    state: false,
    message: '',
  },
  //用于防止返回101多次弹出Alert
  AlertFlag: false,
};
