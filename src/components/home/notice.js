import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  DeviceEventEmitter,
} from 'react-native';
//import NavigateHelper from "../../util/navigateHelper";
import Icon from '../../static/font/iconfont';
import {fetchNoticeCount, clickMenu} from '../../actions/index';
export default class Common extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      noticeCount: [],
    };
  }

  componentDidMount() {
    this.fetchData();
    this.listener = DeviceEventEmitter.addListener(
      'notifyNoticeCountRefresh',
      () => {
        this.fetchData();
      },
    );
  }

  componentWillUnmount() {
    this.listener && this.listener.remove();
  }

  fetchData() {
    fetchNoticeCount()
      .then(res => {
        this.setState({noticeCount: res.data.result || 0});
      })
      .catch(error => {});
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#F4F4F4'}}>
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.props.navigation.navigate('Notice')}>
          <View style={styles.logo}>
            <Image
              resizeMode={'contain'}
              style={{height: 60, width: 80}}
              source={require('../../static/images/home_icon_1.png')}
            />
          </View>
          <View>
            <Text style={styles.title}>今日提示</Text>
            <Text style={styles.content}>
              您有{this.state.noticeCount}条新的未读消息
            </Text>
          </View>
          <Icon
            name={'arrowright1'}
            size={16}
            style={{position: 'absolute', right: 10, color: '#C4C4C4'}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: '#F0F0F0',
    backgroundColor: '#FFF',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  logo: {
    marginLeft: 10,
    marginHorizontal: 15,
  },
  title: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#FFB867',
  },
  content: {
    color: '#7C7C7B',
    marginHorizontal: 10,
  },
});
