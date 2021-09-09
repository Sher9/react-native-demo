import React, {Component} from 'react';
import {NativeModules, View, Text, Alert, ToastAndroid} from 'react-native';
import {verifyLoginState} from './actions/index';
import Router from './navigators/index.js';
import store from './store/index';
import {Provider} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {MenuProvider} from 'react-native-popup-menu';

export default class App extends Component<{}> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isStoreLoading: false,
      initialRouteName: 'Login',
    };
  }
  componentDidMount() {
    NativeModules.SplashScreen.hide();
    //监听网络状态
    NetInfo.addEventListener(state => {
      if (state.type === 'none' || state.type === 'unknown') {
        ToastAndroid.show('当前网络状态不可用', ToastAndroid.SHORT);
      }
    });
  }

  render() {
    return (
      <Provider store={store}>
        <MenuProvider backHandler={true} customStyles={MenuProviderStyles}>
          <Router initialRouteName={this.state.initialRouteName} />
        </MenuProvider>
      </Provider>
    );
  }
}

const MenuProviderStyles = {
  backdrop: {
    backgroundColor: '#000',
    opacity: 0.5,
  },
};
