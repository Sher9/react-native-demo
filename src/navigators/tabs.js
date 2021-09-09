import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../components/home/index';
import Query from '../components/query/index';
import Message from '../components/message/index';
import Profile from '../components/profile/index';
import Icon from '../static/font/iconfont';

const Tab = createBottomTabNavigator();
function BottomNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#0691ff',
        inactiveTintColor: '#24242a',
        style: {
          backgroundColor: '#fff',
        },
        labelStyle: {
          marginTop: -6,
          fontSize: 12,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({color}) => (
            <Icon name="location_house" size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Query"
        component={Query}
        options={{
          tabBarLabel: '查询',
          tabBarIcon: ({color}) => (
            <Icon name="search" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          tabBarLabel: '消息',
          tabBarIcon: ({color}) => (
            <Icon name="communication" size={20} color={color} />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({color}) => (
            <Icon name="username" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigator;
