import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {List} from '@ant-design/react-native';
import About from './about';
import Icon from '../../static/font/iconfont';
import DefaultImage from '../common/defaultImage';
import {verifyOnLineStatus, fetchLastLoginRecord} from '../../actions/api';
import moment from 'moment';
const {width, height} = Dimensions.get('window');

class Index extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      loginRecord: {},
    };
  }

  checkOnLineStatus() {
    this.props.verifyOnLineStatus({
      idCode: 'inspect',
      userID: this.props.user.userID,
    });
  }

  componentDidMount() {
    fetchLastLoginRecord()
      .then(res => {
        this.setState({loginRecord: res.data.result || {}});
      })
      .catch(() => {});
  }

  render() {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ImageBackground style={styles.bannerContainer}>
          <View style={styles.proImageContainer}>
            <DefaultImage
              style={styles.proImage}
              isCircle={true}
              defaultSource={require('../../static/images/photo_man.jpg')}
              uriSource={{
                uri: `${this.props.fileServerAPI}/UM/User/${
                  this.props.user.userID
                }/HeadImg.jpg`,
              }}
            />
          </View>
          <View style={styles.userInfoContainer}>
            <View style={styles.loginInfo}>
              <Image
                source={require('../../static/images/time.png')}
                style={{width: 14, height: 14, marginTop: 3}}
              />
              <Text style={styles.loginInfoText}>
                最近登录时间：
                {this.state.loginRecord.updateTime
                  ? moment(this.state.loginRecord.updateTime).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )
                  : ''}
              </Text>
            </View>
          </View>
        </ImageBackground>
        <List.Item
          extra={
            <View>
              <Icon name={'arrowright1'} size={16} style={{color: '#BEC7CF'}} />
            </View>
          }
          onClick={() => this.props.navigation.navigate('Contacts')}>
          <View style={styles.menuItem}>
            <Icon name={'app_address_list'} color={'#ff7765'} size={18} />
            <Text style={{fontSize: 15, marginLeft: 10, color: '#3A3A3A'}}>
              通讯录
            </Text>
          </View>
        </List.Item>
        <View style={styles.separator} />
        <About navigation={this.props.navigation} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#1678FF',
  },
  proImageContainer: {
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  proImage: {
    borderRadius: 80,
    width: 60,
    height: 60,
  },
  userInfoContainer: {
    justifyContent: 'center',
  },
  userInfoView: {
    flexDirection: 'row',
  },
  userInfo: {
    color: '#F2F6FD',
    fontSize: 18,
    marginVertical: 5,
  },
  loginInfo: {
    flexDirection: 'row',
  },
  loginInfoText: {
    marginLeft: 5,
    color: '#B9CEFF',
  },
  onLineIcon: {
    position: 'absolute',
    paddingHorizontal: 3,
    paddingVertical: 2,
    borderRadius: 10,
    bottom: 15,
    right: 5,
  },
  connectBtn: {
    padding: 4,
    backgroundColor: '#00C305',
    borderRadius: 2,
    fontSize: 10,
    color: '#fff',
    height: 20,
    marginLeft: 10,
    marginTop: 8,
  },
  menuItem: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: width,
    height: 15,
    backgroundColor: '#F4F4F4',
  },
});

export default connect(
  state => {
    return {
      user: state.localData.userInfo,
      serverAPI: state.localData.serverAPI,
      fileServerAPI: state.localData.fileServerAPI,
      onLineStatus: state.userStatus.isOnLine,
    };
  },
  dispatch => {
    return {
      verifyOnLineStatus: params => dispatch(verifyOnLineStatus(params)),
    };
  },
)(Index);
