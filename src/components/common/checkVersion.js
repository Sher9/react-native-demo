import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ToastAndroid,
  Text,
  NativeModules,
  Alert,
  DeviceEventEmitter,
  BackHandler,
} from 'react-native';
import ExtModal from 'react-native-modal';
import {Progress, Toast} from '@ant-design/react-native';
import deviceInfo from '../../utils/deviceinfo';
import {checkVersion} from '../../actions/base';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class CheckVersion extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      showProgressModal: false,
      status: 0,
      progress: 0,
      downloadedSize: '0',
      totalSize: '0',
    };
  }

  componentDidMount() {
    this.checkUpdate();
  }

  checkUpdate() {
    checkVersion({productName: 'CityManage'})
      .then(res => {
        if (
          res.data.result &&
          res.data.result.appVersion > deviceInfo.getVersion()
        ) {
          Alert.alert(
            '提示',
            '发现新版本，请下载更新！',
            [
              {
                text: '取消',
                onPress: () => NativeModules.Module.exitApp(),
              },
              {
                text: '确定',
                onPress: () => {
                  DeviceEventEmitter.addListener('download', (e: Event) => {
                    this.setState({
                      status: e.status,
                      progress: e.progress,
                    });
                    if (e.status === 16) {
                      ToastAndroid.show(
                        '下载失败，请重新下载！',
                        ToastAndroid.SHORT,
                      );
                      this.setState({progress: 0, showProgressModal: false});
                    }
                  });
                  NativeModules.Download.download({
                    fileName: _.last(_.split(res.data.result.filePath, '/')),
                    downloadUrl:
                      this.props.fileServerAPI + res.data.result.filePath,
                  }).then(
                    map => {
                      if (map['downloadId']) {
                        ToastAndroid.show('开始下载！', ToastAndroid.SHORT);
                        this.setState({showProgressModal: true});
                      } else {
                        ToastAndroid.show('下载失败！', ToastAndroid.SHORT);
                      }
                    },
                    (code, message) => {
                      ToastAndroid.show(message, ToastAndroid.SHORT);
                    },
                  );
                  // this.handleFilePress(res.data.result);
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert('提示', '当前已是最新版本!', [
            {
              text: '确定',
              onPress: () => {},
            },
          ]);
        }
      })
      .catch(() => {
        //ToastAndroid.show("APP版本检查失败", ToastAndroid.SHORT);
      });
  }

  render() {
    return (
      <ExtModal
        isVisible={this.state.showProgressModal}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        onBackButtonPress={() => null}>
        <View style={styles.modalWrap}>
          <Text style={{marginTop: 20, fontSize: 16, color: '#1b1a1a'}}>
            更新程序
          </Text>
          <View style={{width: '100%', height: 80, padding: 20}}>
            <Text
              style={{
                alignSelf: 'center',
                marginBottom: 20,
              }}>
              正在下载中({this.state.progress}%)
            </Text>
            <Progress
              percent={this.state.progress}
              position="normal"
              unfilled={true}
            />
          </View>
        </View>
      </ExtModal>
    );
  }
}

const styles = StyleSheet.create({
  modalWrap: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});
