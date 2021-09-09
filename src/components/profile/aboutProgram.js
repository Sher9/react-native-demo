import React, {Component} from 'react';
import {Image, View, StyleSheet, Text} from 'react-native';
import DeviceInfo from '../../utils/deviceinfo';
import {List} from '@ant-design/react-native';
const ListItem = List.Item;
import CheckVersion from '../common/checkVersion';

export default class AboutProgram extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      version: DeviceInfo.getVersion(),
      appName: DeviceInfo.getAppName(),
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{marginBottom: 30}}>
          <Image
            style={styles.logo}
            source={require('../../static/images/about_logo.jpg')}
          />
          <View style={styles.appInfo}>
            <Text style={styles.appName}>
              {this.state.appName}&nbsp;&nbsp;V
            </Text>
            <Text style={styles.appVersion}>{this.state.version}</Text>
          </View>
        </View>
        <ListItem
          platform="android"
          onPress={() => this.checkVersion.checkUpdate()}>
          <View style={styles.listItemView}>
            <Text style={{color: '#333333'}}> 检查更新</Text>
          </View>
        </ListItem>
        <CheckVersion
          autoCheck={false}
          ref={ref => (this.checkVersion = ref)}
          fileServerAPI={this.props.route.params.fileServerAPI}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 80,
    alignSelf: 'center',
  },
  appInfo: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#abbad2',
  },
  appName: {
    alignSelf: 'center',
    color: '#949c9f',
  },
  appVersion: {
    alignSelf: 'center',
    color: '#949c9f',
  },
  info: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    color: '#949c9f',
  },
});
