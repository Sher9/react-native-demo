import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  DeviceEventEmitter,
} from 'react-native';
import {fetchNoticeList} from '../../actions/api';
import EmptyView from '../common/emptyView';
import CollapsibleText from '../common/collapsibleText';
import moment from 'moment';
import LoadMore from '../common/loadMore';
export default class Notice extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      noticeList: [],
      startTime: moment().format('YYYY-MM-DD'),
      endTime: moment().format('YYYY-MM-DD'),
      refreshing: false,
      emptyDisplay: false,
      isError: false,
    };
    this.renderNoticeDetail = this.renderNoticeDetail.bind(this);
  }

  componentDidMount() {
    this.fetchData({pageNo: 1});
    this.listener = DeviceEventEmitter.addListener(
      'notifyNoticeListRefresh',
      () => {
        this.fetchData({pageNo: 1});
      },
    );
  }

  componentWillUnmount() {
    this.listener && this.listener.remove();
  }

  fetchData = params => {
    if (params.pageNo === 1) {
      params.refreshing = true;
      this.flatList.scrollToOffset({animated: true, offset: 0});
    }
    fetchNoticeList({
      ...params,
    })
      .then(res => {
        DeviceEventEmitter.emit('notifyNoticeCountRefresh');
        res.data.result.list = res.data.result.list || [];
        this.loadMore.loaded(
          params.pageNo,
          res.data.result.totalPageCount || 0,
        );
        this.setState(prevState => {
          if (!params.refreshing) {
            res.data.result.list = prevState.noticeList.concat(
              res.data.result.list,
            );
          }
          return {
            noticeList: res.data.result.list,
            refreshing: false,
            emptyDisplay: res.data.result.list.length <= 0,
            isError: false,
          };
        });
      })
      .catch(error => {
        this.loadMore && this.loadMore.loaded();
        this.setState({refreshing: false, emptyDisplay: true, isError: true});
      });
  };

  renderNoticeDetail({item}) {
    return (
      <View style={styles.listItem}>
        <View style={styles.listContent}>
          <Text style={styles.textTitle}>{item.title}</Text>
          <Text style={styles.textUser}>{item.patrolNames}</Text>
          <CollapsibleText style={styles.textContent} numberOfLines={3}>
            {item.content}
          </CollapsibleText>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <EmptyView
          display={this.state.emptyDisplay}
          isErrorView={this.state.isError}
          onPress={() => {
            this.setState({emptyDisplay: false, refreshing: true});
            this.fetchData({pageNo: 1});
          }}
        />
        <FlatList
          ref={ref => (this.flatList = ref)}
          renderItem={this.renderNoticeDetail}
          style={[styles.list, this.state.emptyDisplay && {display: 'none'}]}
          refreshing={this.state.refreshing}
          keyExtractor={(item, index) => item.noticeID.toString()}
          onRefresh={() => {
            this.fetchData({pageNo: 1});
          }}
          data={this.state.noticeList}
          ListFooterComponent={
            <LoadMore
              ref={ref => (this.loadMore = ref)}
              style={{
                display: this.state.noticeList.length > 0 ? 'flex' : 'none',
              }}
              onClick={pageNo => this.fetchData({pageNo})}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  list: {
    marginBottom: 10,
  },
  listItem: {
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  listContent: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 10,
    borderRadius: 2,
    borderColor: '#dddddd',
    borderWidth: 0.5,
  },
  textDate: {
    alignSelf: 'center',
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#dddddd',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 2,
  },
  textTitle: {
    fontSize: 14,
    color: 'black',
  },
  textUser: {
    fontSize: 12,
    marginTop: 3,
  },
  textContent: {
    fontSize: 12,
    marginTop: 10,
  },
});
