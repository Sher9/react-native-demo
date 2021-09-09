import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ToastAndroid,
  NativeModules,
} from 'react-native';
import {connect} from 'react-redux';
import {List} from '@ant-design/react-native';
import Icon from '../../static/font/iconfont';
import {syncAPIs, syncToken, logOut, fetchRecTypes} from '../../actions/api';
import Settings from '../common/setting';

class About extends Component<{}> {
  constructor(props) {
    super(props);
    this.listItem = [
      {
        name: '修改密码',
        icon: 'password',
        color: '#7f97ff',
        onClick: () => {},
      },
      {
        name: '服务地址',
        icon: 'app_service',
        color: '#43baff',
        onClick: () => this.globalSetting.open(),
      },
      {
        name: '清理缓存',
        icon: 'reset',
        color: '#ff7765',
        onClick: () => {},
      },
      {
        name: '关于程序',
        icon: 'app_about',
        color: '#ffbe0f',
        marginBottom: 10,
        onClick: () =>
          this.props.navigation.navigate('AboutProgram', {
            fileServerAPI: this.props.fileServerAPI,
          }),
      },
      {
        name: '切换用户',
        icon: 'delete',
        color: '#ff7765',
        onClick: () => {
          this.logOut();
        },
      },
      {
        name: '退出系统',
        icon: 'app_exit',
        color: '#37cfd9',
        onClick: () => this.exit(),
      },
    ];
    this.exit = this.exit.bind(this);
    this.clearCache = this.clearCache.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
  }

  exit() {
    Alert.alert('', '是否退出系统', [
      {
        text: '取消',
      },
      {
        text: '确定',
        onPress: () => {
          //保存数据并退出
          storage
            .save({key: 'localData', data: this.props.localData})
            .then(() => {
              NativeModules.Module.exitApp();
            })
            .catch(() => {
              NativeModules.Module.exitApp();
            });
        },
      },
    ]);
  }

  clearCache() {
    Alert.alert('确定清除？', '缓存清除后无法恢复', [
      {text: '取消'},
      {
        text: '确定',
        onPress: () => {
          storage.remove({key: 'regions'});
          this.props.fetchRecTypes();
          {
            CacheManager.clearCache();
            ToastAndroid.show('清理完成！', ToastAndroid.SHORT);
          }
        },
      },
    ]);
  }

  logOut() {
    Alert.alert('', '是否退出当前用户', [
      {
        text: '取消',
      },
      {
        text: '确定',
        onPress: () => {
          logOut().then(res => {
            this.props.navigation.navigate("Login")
            this.props.syncToken();
          });
        },
      },
    ]);
  }

  renderListItem() {
    return this.listItem.map((item, index) => {
      return (
        <List.Item
          extra={
            <View>
              <Icon name={'arrowright1'} size={16} style={{color: '#BEC7CF'}} />
            </View>
          }
          key={index.toString()}
          onClick={item.onClick}>
          <View style={styles.menuItem}>
            <Icon name={item.icon} color={item.color} size={18} />
            <Text style={{fontSize: 15, marginLeft: 10, color: '#3A3A3A'}}>
              {item.name}
            </Text>
          </View>
        </List.Item>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderListItem()}
        <Settings
          ref={ref => (this.globalSetting = ref)}
          serverAPI={this.props.serverAPI}
          syncAPIs={this.props.syncAPIs}
          websocketAPI={this.props.websocketAPI}
          staticPagePath={this.props.staticPagePath}
          fileServerAPI={this.props.fileServerAPI}
        />
      </View>
    );
  }
}

export default connect(
  state => {
    return {
      localData: state.localData,
      userInfo: state.localData.userInfo,
      serverAPI: state.localData.serverAPI,
      websocketAPI: state.localData.websocketAPI,
      fileServerAPI: state.localData.fileServerAPI,
      staticPagePath: state.localData.staticPagePath,
    };
  },
  dispatch => {
    return {
      syncAPIs: (serverAPI, fileServerAPI, staticPagePath, websocketAPI) =>
        dispatch(
          syncAPIs(serverAPI, fileServerAPI, staticPagePath, websocketAPI),
        ),
      configWebSocket: idCode =>
        dispatch(WebSocketHelper.configWebSocket(idCode)),
      fetchRecTypes: () => dispatch(fetchRecTypes()),
      syncToken: () => dispatch(syncToken('')),
    };
  },
)(About);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proImage: {
    borderRadius: 80,
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  userInfo: {
    color: '#fff',
    marginTop: 5,
  },
  onLineIcon: {
    position: 'absolute',
    paddingHorizontal: 3,
    paddingVertical: 2,
    borderRadius: 10,
    bottom: 5,
    right: 5,
  },
  connectBtn: {
    padding: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    fontSize: 10,
    opacity: 0.3,
    color: '#fff',
    marginBottom: 5,
    marginTop: 5,
  },
  proText: {
    color: '#fff',
    fontSize: 16,
    paddingBottom: 5,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  menuItem: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
