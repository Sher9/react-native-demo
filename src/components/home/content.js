import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  ToastAndroid,
  Image,
  DeviceEventEmitter,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {
  fetchMenus,
  clickMenu,
  fetchRecListCount,
  fetchDisposeRecListCount,
} from '../../actions/index';
import Icon from '../../static/font/iconfont';
const {width, height} = Dimensions.get('window');
import {connect} from 'react-redux';
import _ from 'lodash';
export default class Content extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      recCount: 0,
      disposeRecCount: 0,
    };
  }

  componentDidMount() {
    this.recListListener = DeviceEventEmitter.addListener(
      'notifyTaskCountRefresh',
      () => {
        this.fetchMenus();
      },
    );
    this.fetchMenus();
  }

  fetchMenus() {
    let tempArray = [];
    fetchMenus()
      .then(res => {
        _.forEach(res.data.result, item => {
          tempArray = _.union(tempArray, item.list);
        });
        this.setState({menus: _.take(tempArray, 8)}, () => {
          this.fetchRecListCount();
        });
      })
      .catch(error => {});
  }

  componentWillUnmount() {
    this.recListListener && this.recListListener.remove();
  }

  fetchRecListCount() {
    fetchRecListCount({reportType: 'all'})
      .then(res => {
        this.setState({recCount: res.data.result || 0});
      })
      .catch(error => {});
  }

  fetchDisposeRecListCount() {
    fetchDisposeRecListCount({idCode: 'rec_mylist'})
      .then(res => {
        this.setState({disposeRecCount: res.data.result || 0});
      })
      .catch(error => {});
  }

  onClickItem(item) {
    clickMenu({idCode: item.idCode})
      .then(() => {
        this.props.navigation.navigate('Knowledge');
      })
      .catch(error => {
        this.props.navigation.navigate(item.url);
      });
  }

  render() {
    const {width} = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <View style={styles.menusContent}>
          {this.state.menus.map((item, index) => {
            return (
              <TouchableNativeFeedback
                key={index}
                onPress={() => this.onClickItem(item)}>
                <View style={[styles.menuItem, {width: width / 3.3}]}>
                  {this.state.recCount > 0 && item.url === 'Task' && (
                    <View style={styles.dot}>
                      <Text style={styles.dotText}>{this.state.recCount}</Text>
                    </View>
                  )}
                  <Icon
                    name={item.mobileIcon || 'viewopinion'}
                    size={30}
                    style={{color: item.bgColor || '#e5a646'}}
                  />
                  <Text style={{fontSize: 14, color: '#333', marginTop: 3}}>
                    {item.label}
                  </Text>
                </View>
              </TouchableNativeFeedback>
            );
          })}
          <TouchableNativeFeedback
            onPress={() => this.props.navigation.navigate('MoreMenus')}>
            <View style={[styles.menuItem, {width: width / 3.3}]}>
              <Image
                source={require('../../static/images/all.png')}
                style={{width: 28, height: 28}}
              />
              <Text style={{fontSize: 14, color: '#333', marginTop: 3}}>
                全部
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  menusTitle: {
    width: width,
    flexDirection: 'row',
    marginLeft: 10,
    marginVertical: 10,
  },
  menusContent: {
    borderRadius: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFF',
    marginHorizontal: 10,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dot: {
    backgroundColor: '#FF0000',
    width: 18,
    height: 18,
    borderRadius: 90,
    position: 'absolute',
    right: 22,
    top: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});
