import React, {Component} from 'react';
import {View, StyleSheet, Text, TextInput, ToastAndroid} from 'react-native';
import {Button} from '@ant-design/react-native';
import Modal from 'react-native-modal';
import Icon from '../../static/font/iconfont';

export default class Settings extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      serverAPI: this.props.serverAPI,
      fileServerAPI: this.props.fileServerAPI,
      staticPagePath: this.props.staticPagePath,
      websocketAPI: this.props.websocketAPI,
      visible: false,
    };
  }

  //保存全局配置
  saveGlobalConfig() {
    if (!this.state.serverAPI) {
      ToastAndroid.show('服务端地址不能为空', ToastAndroid.SHORT);
      return;
    }
    this.setState({visible: false});
    this.props.syncAPIs(
      this.state.serverAPI,
      this.state.fileServerAPI,
      this.state.staticPagePath,
      this.state.websocketAPI,
    );
    ToastAndroid.show('保存成功', ToastAndroid.SHORT);
  }

  open() {
    this.setState({visible: true});
  }

  render() {
    return (
      <Modal
        isVisible={this.state.visible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        onBackdropPress={() => this.setState({visible: false})}
        onBackButtonPress={() => this.setState({visible: false})}>
        <View style={styles.globalConfigContainer}>
          <Text style={styles.globalConfigTitle}>全局设置</Text>
          <View style={styles.globalConfigItem}>
            <Icon name={'app_service'} size={15} color={'#000'} />
            <TextInput
              style={{flex: 1, fontSize: 15, padding: 0, marginLeft: 10}}
              placeholder={'请填写服务端地址'}
              value={this.state.serverAPI}
              underlineColorAndroid={'transparent'}
              onChangeText={text => this.setState({serverAPI: text})}
            />
          </View>
          <View style={styles.globalConfigItem}>
            <Icon name={'file_comparison'} size={15} color={'#000'} />
            <TextInput
              style={{flex: 1, fontSize: 15, padding: 0, marginLeft: 10}}
              placeholder={'请填写文件服务器地址'}
              value={this.state.fileServerAPI}
              underlineColorAndroid={'transparent'}
              onChangeText={text => this.setState({fileServerAPI: text})}
            />
          </View>
          <View style={styles.globalConfigItem}>
            <Icon name={'sendcheckmsg'} size={15} color={'#000'} />
            <TextInput
              keyboardType="numeric"
              style={{flex: 1, fontSize: 15, padding: 0, marginLeft: 10}}
              placeholder={'请填写消息推送服务器地址'}
              value={this.state.websocketAPI}
              onChangeText={text => this.setState({websocketAPI: text})}
            />
          </View>
          <View style={styles.globalConfigItem}>
            <Icon name={'location2'} size={15} color={'#000'} />
            <TextInput
              style={{flex: 1, fontSize: 15, padding: 0, marginLeft: 10}}
              placeholder={'请填写地图页面地址'}
              value={this.state.staticPagePath}
              underlineColorAndroid={'transparent'}
              onChangeText={text => this.setState({staticPagePath: text})}
            />
          </View>
          <View
            style={[
              styles.globalConfigItem,
              {padding: 10, borderBottomWidth: 0},
            ]}>
            <Button
              type={'primary'}
              style={{flex: 1}}
              onPress={() => this.saveGlobalConfig()}>
              确定
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  globalConfigContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 5,
  },
  globalConfigItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    margin: 10,
  },
  globalConfigTitle: {
    fontSize: 17,
    textAlign: 'center',
  },
});
