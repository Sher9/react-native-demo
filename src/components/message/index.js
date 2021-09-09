/**
 * Created by xh on 2019/7/23.
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  TouchableHighlight,
  ToastAndroid,
  DeviceEventEmitter,
} from 'react-native';
import {fetchSessionList} from '../../actions/api';
import Icon from '../../static/font/iconfont';
import EmptyView from '../common/emptyView';
import MessageBrief from './brief';
import _ from 'lodash';

export default class Message extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      keywords: '',
      messageList: [],
      refreshing: true,
      errorFlag: false,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData({size: 500});
    this.listener = DeviceEventEmitter.addListener(
      'notifyConversationListRefresh',
      () => {
        this.fetchData({size: 500});
      },
    );

    //已读某段对话，刷新
    this.readlistener = DeviceEventEmitter.addListener('resetChatList', () => {
      this.fetchData({size: 500});
    });
  }

  componentWillUnmount() {
    this.listener && this.listener.remove();
    this.readlistener && this.readlistener.remove();
  }

  fetchData(params) {
    fetchSessionList({
      keywords: this.state.keywords,
      ...params,
    })
      .then(res => {
        let messages = res.data.result || [];
        _(messages).forEach(item => {
          switch (item.lastestChatLog && item.lastestChatLog.msgType) {
            case 'video-chat':
              item.lastestChatLog.content = '[视频通话]';
              break;
            case 'image':
              item.lastestChatLog.content = '[图片]';
              break;
            case 'audio':
              item.lastestChatLog.content = '[音频]';
              break;
            case 'video':
              item.lastestChatLog.content = '[视频]';
              break;
            case 'doc':
              item.lastestChatLog.content = '[文档]';
              break;
          }
        });
        this.setState({
          messageList: messages,
          refreshing: false,
          errorFlag: false,
        });
      })
      .catch(() => {
        this.setState({
          messageList: [],
          refreshing: false,
          errorFlag: true,
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Icon name={'search'} size={16} style={{marginRight: 5}} />
            <TextInput
              style={{flex: 1}}
              returnKeyType={'search'}
              value={this.state.keywords}
              onChangeText={keywords => this.setState({keywords})}
              onSubmitEditing={() => this.fetchData({size: 500})}
              placeholder={'搜索'}
            />
          </View>
          <TouchableOpacity>
            <View style={styles.addView}>
              <Icon
                name={'linked_add'}
                size={12}
                style={{marginLeft: 8, color: '#FFF'}}
              />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.messageList}
          ref={ref => (this.flatList = ref)}
          refreshing={this.state.refreshing}
          onRefresh={() => this.fetchData({size: 500})}
          keyExtractor={(item, index) =>
            item.sessionID ? item.sessionID.toString() : index.toString()
          }
          ListEmptyComponent={
            <EmptyView
              display={true}
              isErrorView={this.state.errorFlag}
              onPress={this.fetchData.bind(this, {size: 500})}
            />
          }
          renderItem={({item}) => (
            <MessageBrief
              data={item}
              navigation={this.props.navigation}
              fetchData={() => this.fetchData({size: 500})}
              onBack={() => this.fetchData({size: 500})}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1678FF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dfe0e1',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingLeft: 10,
    borderRadius: 5,
    marginLeft: 15,
  },
  addView: {
    backgroundColor: '#1678FF',
    height: 30,
    width: 30,
    borderColor: '#EDEDED',
    borderWidth: 1,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 50,
  },
  addedText: {
    fontSize: 16,
    color: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
