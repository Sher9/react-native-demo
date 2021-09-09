import React, {Component} from 'react';
import {View, StyleSheet, TextInput, Text, FlatList} from 'react-native';
import Icon from '../../static/font/iconfont';
import {fetchQueryRecList} from '../../actions/api';
import RecBrief from './brief';
import EmptyView from '../common/emptyView';
import LoadMore from '../common/loadMore';
import moment from 'moment';
import _ from 'lodash';
import {connect} from 'react-redux';
class QueryRecList extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      keywords: '',
      sort: {key: '', order: ''},
      errorFlag: false, //当请求出错的时候
      pageNo: 1,
      recList: [],
      refreshing: false,
      condition: this.props.route.params.condition || {},
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData({pageNo: 1});
  }

  componentWillUnmount() {
    this.flatList = undefined;
  }

  fetchData(params) {
    if (params.pageNo === 1) {
      params.refreshing = true;
      this.flatList.scrollToOffset({animated: true, offset: 0});
    }
    this.setState(params);
    fetchQueryRecList({
      ...params,
      ...this.state.condition,
      pageSize: 5,
      keywords: this.state.keywords,
      startTime: this.state.condition.startTime
        ? moment(this.state.condition.startTime)
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss')
        : '',
      endTime: this.state.condition.endTime
        ? moment(this.state.condition.endTime)
            .endOf('day')
            .format('YYYY-MM-DD HH:mm:ss')
        : '',
    })
      .then(res => {
        res.data.result.list = res.data.result.list || [];
        this.loadMore.loaded(
          params.pageNo,
          res.data.result.totalPageCount || 0,
        );
        _.forEach(res.data.result.list, item => {
          item.photos = [];
          item.medias = item.medias || [];
          _.forEach(item.medias, media => {
            media.url = media.mediaPath =
              this.props.fileServerAPI + '/UM/' + media.mediaPath;
            media.mediaType === 'photo' && item.photos.push(media);
          });
        });
        this.setState(prevState => {
          if (!params.refreshing) {
            res.data.result.list = prevState.recList.concat(
              res.data.result.list,
            );
          }
          //存储获取案件列表顺序
          this.lastRecList = res.data.result.list;
          return {
            recList: _.orderBy(
              res.data.result.list,
              [prevState.sort.key],
              [prevState.sort.order],
            ),
            refreshing: false,
            errorFlag: false,
          };
        });
      })
      .catch(error => {
        this.lastRecList =
          this.state.recList.length > 0 ? this.state.recList : [];
        this.loadMore && this.loadMore.loaded();
        this.setState({
          refreshing: false,
          errorFlag: true,
        });
      });
  }

  render() {
    return (
      <View style={styles.wrap}>
        <View style={styles.searchBarContainer}>
          <Icon
            name={'arrowleft1'}
            size={20}
            style={{paddingVertical: 10}}
            color={'#FFF'}
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={styles.searchBar}>
            <Icon name={'search'} size={16} style={{marginRight: 5}} />
            <TextInput
              style={{flex: 1}}
              onChangeText={keywords => this.setState({keywords})}
              returnKeyType={'search'}
              onSubmitEditing={() => this.fetchData({pageNo: 1})}
              placeholder={'请输入关键字'}
            />
          </View>
        </View>
        <FlatList
          data={this.state.recList}
          ref={ref => (this.flatList = ref)}
          onRefresh={() => this.fetchData({pageNo: 1})}
          refreshing={this.state.refreshing}
          keyExtractor={item => item.rec.recID.toString()}
          ListEmptyComponent={
            <EmptyView
              display={true}
              isErrorView={this.state.errorFlag}
              onPress={this.fetchData.bind(this, {pageNo: 1})}
            />
          }
          renderItem={({item}) => {
            return <RecBrief data={item} navigation={this.props.navigation} />;
          }}
          ListFooterComponent={
            <LoadMore
              ref={ref => (this.loadMore = ref)}
              style={{
                display: this.state.recList.length > 0 ? 'flex' : 'none',
              }}
              onClick={pageNo => this.fetchData({pageNo})}
            />
          }
        />
      </View>
    );
  }
}

export default connect(state => {
  return {
    fileServerAPI: state.localData.fileServerAPI,
  };
})(QueryRecList);

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  searchBarContainer: {
    backgroundColor: '#1678FF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderColor: '#1678FF',
    borderWidth: 1,
    alignItems: 'center',
    flex: 1,
    height: 40,
    paddingLeft: 10,
    borderRadius: 5,
    marginLeft: 15,
  },
});
