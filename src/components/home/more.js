import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  TouchableNativeFeedback,
  ToastAndroid,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Icon from '../../static/font/iconfont';
import {fetchMenus, clickMenu} from '../../actions/index';
const {width, height} = Dimensions.get('window');
import {connect} from 'react-redux';
import _ from 'lodash';
export default class MoreMenus extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      menus: [],
    };
  }

  componentDidMount() {
    fetchMenus({idCode: 'more'})
      .then(res => {
        this.setState({menus: res.data.result});
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {this.state.menus.map((item, index) => {
          return (
            <View key={index}>
              <View style={styles.menusContent}>
                {item.list.map((childItem, childIndex) => {
                  return (
                    <TouchableNativeFeedback
                      key={childIndex}
                      onPress={() => this.onClickItem(childItem)}>
                      <View style={[styles.menuItem, {width: width / 4}]}>
                        <Icon
                          name={childItem.mobileIcon || 'viewopinion'}
                          size={30}
                          style={{color: childItem.bgColor || '#e5a646'}}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#888888',
                            marginTop: 3,
                          }}>
                          {childItem.label}
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  menusTitle: {
    width: width,
    flexDirection: 'row',
    marginLeft: 15,
    marginVertical: 10,
  },
  menusContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomColor: '#E9E9E9',
    borderBottomWidth: 0.3,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
