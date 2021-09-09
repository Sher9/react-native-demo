import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ToastAndroid,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  NativeModules,
  ImageBackground,
  StatusBar,
  ScrollView,
} from 'react-native';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import {
  syncToken,
  syncAPIs,
  syncUserInfo,
  initLocalData,
  userLogin,
} from '../../actions';
import {connect} from 'react-redux';
import Icon from '../../static/font/iconfont';
import Setting from '../common/setting';
import CheckVersion from '../common/checkVersion';
import md5 from 'crypto-js/md5';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loginState: false,
    };
  }

  componentDidMount() {
    this.props.initLocalData(this.props.localData);
  }

  login() {
    if (!this.state.username || !this.state.password) {
      ToastAndroid.show('账号或密码不能为空', ToastAndroid.SHORT);
      return;
    }
    if (this.state.loginState) {
      ToastAndroid.show('正在登录，请稍后', ToastAndroid.SHORT);
      return;
    }
    this.setState({lomeoginState: true});
    userLogin({
      username: this.state.username,
      password: md5(this.state.password).toString(),
    })
      .then(res => {
        this.props.syncToken(res.data.result.token);
        this.props.syncUserInfo(res.data.result.userInfo);
        this.props.navigation.navigate('BottomNavigator');
      })
      .catch(err => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
        this.setState({loginState: false});
      });
  }

  render() {
    return (
      <ImageBackground style={styles.container} resize={'scale'}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        <View style={styles.headerSetting}>
          <Menu>
            <MenuTrigger>
              <Icon
                name="setup"
                size={14}
                style={{padding: 18, color: '#CCCCCC'}}
              />
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsWrapper: {backgroundColor: '#000', opacity: 0.8},
                optionsContainer: {width: 100},
              }}>
              <MenuOption onSelect={() => this.globalSetting.open()}>
                <Text
                  style={{
                    paddingVertical: 5,
                    color: '#fff',
                    textAlign: 'center',
                  }}>
                  服务端地址
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
        <ScrollView behavior={'padding'} style={{flex: 2}}>
          <View style={styles.logo}>
            <Image
              style={{height: 100, width: 100}}
              resizeMethod={'scale'}
              source={require('../../static/images/about_logo.jpg')}
            />
          </View>
          <View style={styles.title}>
            <Text style={{color: '#737373', fontSize: 24}}>智管通</Text>
          </View>
          <View style={styles.loginInputItem}>
            <Image
              style={{height: 20, width: 20}}
              source={require('../../static/images/app_icon_login_username.png')}
            />
            <TextInput
              style={styles.itemInput}
              underlineColorAndroid="transparent"
              placeholder="请输入账号"
              placeholderTextColor="#B8B8B8"
              value={this.state.username}
              onChangeText={text => this.setState({username: text})}
            />
          </View>
          <View style={styles.loginInputItem}>
            <Image
              style={{height: 20, width: 20}}
              source={require('../../static/images/app_icon_login_pwd.png')}
            />
            <TextInput
              style={styles.itemInput}
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              placeholder="请输入密码"
              placeholderTextColor="#B8B8B8"
              value={this.state.password}
              onChangeText={text => this.setState({password: text})}
            />
          </View>
          <TouchableHighlight
            style={styles.loginButton}
            onPress={() => this.login()}
            underlayColor={'#9cabb7'}>
            <View style={styles.loginWrap}>
              <Text style={styles.loginButtonText}>
                {this.state.loginState ? '登录中' : '登录'}
              </Text>
              <ActivityIndicator
                animating={true}
                color={'#fff'}
                style={{display: this.state.loginState ? 'flex' : 'none'}}
              />
            </View>
          </TouchableHighlight>
        </ScrollView>
        <Setting
          ref={ref => (this.globalSetting = ref)}
          syncAPIs={this.props.syncAPIs}
          serverAPI={this.props.localData.serverAPI}
          staticPagePath={this.props.localData.staticPagePath}
          websocketAPI={this.props.localData.websocketAPI}
          fileServerAPI={this.props.localData.fileServerAPI}
        />
        {/* <CheckVersion fileServerAPI={this.props.localData.fileServerAPI} /> */}
      </ImageBackground>
    );
  }
}

export default connect(
  state => {
    return {
      user: state.localData.userInfo,
      localData: state.localData,
    };
  },
  dispatch => {
    return {
      syncToken: token => dispatch(syncToken(token)),
      syncAPIs: (serverAPI, fileServerAPI, staticPagePath, websocketAPI) =>
        dispatch(
          syncAPIs(serverAPI, fileServerAPI, staticPagePath, websocketAPI),
        ),
      syncUserInfo: userInfo => dispatch(syncUserInfo(userInfo)),
      initLocalData: localData => dispatch(initLocalData(localData)),
    };
  },
)(Login);

const MenuProviderStyles = {
  backdrop: {
    backgroundColor: '#000',
    opacity: 0.5,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSetting: {
    justifyContent: 'center',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconFont: {
    fontFamily: 'iconfont',
    fontSize: 22,
    color: '#fff',
  },
  logo: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginInputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E4E4E4',
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingBottom: 2,
    marginLeft: 40,
    marginRight: 40,
    marginBottom: 20,
  },
  itemInput: {
    fontSize: 16,
    flex: 1,
    padding: 0,
    color: '#262626',
    lineHeight: 20,
    paddingLeft: 10,
  },
  loginButton: {
    backgroundColor: '#1678FF',
    borderRadius: 4,
    marginHorizontal: 35,
  },
  loginWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
    marginRight: 5,
  },
});
