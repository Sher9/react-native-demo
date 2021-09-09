import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  NativeModules,
  ToastAndroid,
} from 'react-native';
import {Accordion, SwipeAction} from '@ant-design/react-native';
import Icon from '../../static/font/iconfont';
import _ from 'lodash';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';

export default class Contacts extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      contactsList: [],
    };
    this.props.navigation.setParams({
      openPage: this.openPage.bind(this),
    });
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <Menu>
          <MenuTrigger>
            <Icon
              style={{
                paddingVertical: 8,
                paddingHorizontal: 20,
                marginRight: 10,
              }}
              name="setup"
              size={14}
              color={'#FFF'}
            />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsWrapper: {backgroundColor: '#000', opacity: 0.8},
              optionsContainer: {width: 100},
            }}>
            <MenuOption
              customStyles={{
                optionWrapper: {
                  borderBottomColor: '#fff',
                  borderBottomWidth: 0.5,
                },
              }}
              onSelect={() =>
                this.props.navigation.navigate('AddContact', '添加成员')
              }>
              <Text
                style={{
                  paddingVertical: 5,
                  color: '#fff',
                  textAlign: 'center',
                }}>
                <Icon name="responsible" size={14} />
                &nbsp;&nbsp;添加成员
              </Text>
            </MenuOption>
            <MenuOption
              onSelect={() => this.props.navigation.navigate('Grouping')}>
              <Text
                style={{
                  paddingVertical: 5,
                  color: '#fff',
                  textAlign: 'center',
                }}>
                <Icon name="guards" size={14} />
                &nbsp;&nbsp;分组管理
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      ),
    });
    this.fetchData();
  }

  fetchData() {
    storage
      .getAllDataForKey('contacts')
      .then(contactsList => {
        this.setState({contactsList: contactsList});
      })
      .catch(() => {});
  }

  openPage = (name, title, contacts, index) => {
    this.props.navigation.navigate(name, {
      title: title,
      data: contacts,
      index: index,
      onBack: () => this.fetchData(),
    });
  };

  onChange = key => {};

  render() {
    return (
      <View style={styles.container}>
        <Accordion accordion openAnimation={{}} onChange={this.onChange}>
          {this.state.contactsList.map((item, index) => {
            return (
              <Accordion.Panel header={item.title} key={index}>
                <View>
                  {item.contacts.map((item2, index2) => {
                    return (
                      <SwipeAction
                        style={{backgroundColor: '#fff'}}
                        ref={'' + index + index2}
                        key={index2}
                        autoClose
                        right={[
                          {
                            text: '编辑',
                            onPress: () =>
                              this.openPage(
                                'AddContact',
                                '编辑成员',
                                item,
                                index2,
                              ),
                            style: {backgroundColor: '#ddd', color: 'white'},
                          },
                          {
                            text: '删除',
                            onPress: () => {
                              _.remove(
                                this.state.contactsList[index].contacts,
                                (n, contactsIndex) => {
                                  return contactsIndex === index2;
                                },
                              );
                              storage
                                .save({
                                  key: 'contacts',
                                  id: this.state.contactsList[index].id,
                                  data: this.state.contactsList[index],
                                })
                                .then(() => {
                                  ToastAndroid.show(
                                    '删除成功',
                                    ToastAndroid.SHORT,
                                  );
                                })
                                .catch(() => {});
                              this.setState({
                                contactsList: this.state.contactsList,
                              });
                            },
                            style: {backgroundColor: '#F4333C', color: 'white'},
                          },
                        ]}
                        onOpen={() => console.log('global open')}
                        onClose={() => console.log('global close')}>
                        <TouchableOpacity
                          style={styles.contactItem}
                          activeOpacity={0.8}
                          onPress={() =>
                            NativeModules.Module.call({phone: item2.phone})
                          }>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={styles.headPortrait}>
                              {item2.name}
                            </Text>
                            <View>
                              <Text style={{color: '#333333'}}>
                                {item2.name}
                              </Text>
                              <Text>{item2.phone}</Text>
                            </View>
                          </View>
                          <Image
                            style={{width: 17, height: 19}}
                            source={require('../../static/images/app_more_icon_phone_pictrue.png')}
                          />
                        </TouchableOpacity>
                        {index2 !== item.contacts.length - 1 && (
                          <View
                            style={{
                              height: 1,
                              backgroundColor: '#dedede',
                              marginLeft: 30,
                            }}
                          />
                        )}
                      </SwipeAction>
                    );
                  })}
                </View>
              </Accordion.Panel>
            );
          })}
        </Accordion>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  headPortrait: {
    width: 50,
    height: 50,
    color: '#fff',
    backgroundColor: '#79919c',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 50,
    marginLeft: 20,
    marginRight: 10,
  },
});
