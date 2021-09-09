import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '../../static/font/iconfont';
import {clickMenu} from '../../actions/index';

export default class Common extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {};
    this.homeMenu = [
      {
        name: '知识库',
        icon: require('../../static/images/home_icon_2.png'),
        color: '#0A9CFE',
        onClick: () => this.props.navigation.navigate('Knowledge'),
      },
      {
        name: '地图',
        icon: require('../../static/images/home_icon_3.png'),
        color: '#B497F0',
        onClick: () => this.props.navigation.navigate('ShowMap'),
      },
    ];
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#F4F4F4', paddingBottom: 10}}>
        {this.homeMenu.map(item => {
          return (
            <TouchableOpacity
              onPress={item.onClick}
              key={item.name}
              style={styles.container}>
              <View style={styles.logo}>
                <Image
                  style={{height: 68, width: 170}}
                  resizeMode={'contain'}
                  source={item.icon}
                />
              </View>
              <Text style={[styles.title, {color: item.color}]}>
                {item.name}
              </Text>
              <Icon
                name={'arrowright1'}
                size={16}
                style={{position: 'absolute', right: 10, color: '#C4C4C4'}}
              />
            </TouchableOpacity>
          );
        })}
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
    marginLeft: 15,
    paddingLeft: 15,
    borderRadius: 50,
    marginHorizontal: 15,
  },
  title: {
    marginHorizontal: 10,
    fontSize: 18,
    color: '#636363',
  },
});
