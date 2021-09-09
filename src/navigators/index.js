import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomNavigator from './tabs';
import Login from '../components/login/index';
import Knowledge from '../components/knowledge/index';
import KnowledgeDetail from '../components/knowledge/detail';
import MoreMenus from '../components/home/more';
import Notice from '../components/notice/index';
import QueryRecList from '../components/query/list';
import Grouping from '../components/profile/grouping';
import AboutProgram from '../components/profile/aboutProgram';
import AddContact from '../components/profile/addContact';
import Contacts from '../components/profile/contacts';

const Stack = createStackNavigator();

class Navigators extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const routeName = this.props.initialRouteName;
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={routeName}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1678FF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontSize: 18,
              color: '#fff',
              flex: 1,
              textAlign: 'center',
              marginRight: 25,
            },
          }}>
          <Stack.Screen
            name="BottomNavigator"
            component={BottomNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Knowledge"
            component={Knowledge}
            options={{
              title: '知识库',
            }}
          />
          <Stack.Screen
            name="KnowledgeDetail"
            component={KnowledgeDetail}
            options={{
              title: '知识库详情',
            }}
          />
          <Stack.Screen
            name="MoreMenus"
            component={MoreMenus}
            options={{
              title: '全部应用',
            }}
          />
          <Stack.Screen
            name="Notice"
            component={Notice}
            options={{
              title: '全部消息',
            }}
          />
          <Stack.Screen
            name="QueryRecList"
            component={QueryRecList}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Contacts"
            component={Contacts}
            options={{
              title: '通讯录',
            }}
          />
          <Stack.Screen
            name="AddContact"
            component={AddContact}
            options={{
              title: '新增人员',
            }}
          />
          <Stack.Screen
            name="Grouping"
            component={Grouping}
            options={{
              title: '分组管理',
            }}
          />
          <Stack.Screen
            name="AboutProgram"
            component={AboutProgram}
            options={{
              title: '关于程序',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({});

export default Navigators;
