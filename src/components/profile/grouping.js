import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {Modal, Provider, SwipeAction} from '@ant-design/react-native';

export default class Grouping extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      groupingList: [],
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{width: 80, paddingLeft: 10}}
          onPress={() => this.add()}>
          <Text style={{textAlign: 'center', color: '#FFF'}}>新增</Text>
        </TouchableOpacity>
      ),
    });
    this.fetchData();
  }

  fetchData() {
    storage
      .getAllDataForKey('contacts')
      .then(groupingList => {
        this.setState({groupingList: groupingList});
      })
      .catch(() => {
        this.setState({recList: [], emptyDisplay: true});
      });
  }

  /**
   * 新增分组
   */
  add() {
    Modal.prompt(
      '分组名称',
      '请输入分组名称',
      [
        {text: '取消'},
        {
          text: '确定',
          onPress: value => {
            storage
              .save({
                key: 'contacts',
                id: '' + new Date().getTime(),
                data: {
                  id: '' + new Date().getTime(),
                  title: value,
                  contacts: [],
                },
              })
              .then(() => {
                this.fetchData();
                ToastAndroid.show('保存成功', ToastAndroid.SHORT);
              })
              .catch(() => {});
          },
        },
      ],
      'default',
      null,
    );
  }

  render() {
    return (
      <Provider>
        <ScrollView style={styles.container}>
          {this.state.groupingList.map((item, index) => {
            return (
              <SwipeAction
                style={{backgroundColor: '#fff'}}
                ref={index}
                key={index}
                autoClose
                right={[
                  {
                    text: '编辑',
                    onPress: () =>
                      Modal.prompt(
                        '分组名称',
                        '请输入分组名称',
                        [
                          {text: '取消'},
                          {
                            text: '确定',
                            onPress: value => {
                              this.state.groupingList[index].title = value;
                              this.setState({
                                groupingList: this.state.groupingList,
                              });
                            },
                          },
                        ],
                        'default',
                        item.title,
                      ),
                    style: {backgroundColor: '#ddd', color: 'white'},
                  },
                  {
                    text: '删除',
                    onPress: () => {
                      storage
                        .remove({
                          key: 'contacts',
                          id: item.id,
                        })
                        .then(() => {
                          this.fetchData();
                          ToastAndroid.show('删除成功', ToastAndroid.SHORT);
                        })
                        .catch(() => {});
                    },
                    style: {backgroundColor: '#F4333C', color: 'white'},
                  },
                ]}
                onOpen={() => console.log('global open')}
                onClose={() => console.log('global close')}>
                <TouchableOpacity
                  onPress={() => {
                    if (this.props.route.params.callback) {
                      this.props.route.params.callback(item);
                      this.props.navigation.goBack();
                    }
                  }}>
                  <Text style={{padding: 10, color: '#333333'}}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
                {index !== item.length - 1 && (
                  <View style={{height: 1, backgroundColor: '#dedede'}} />
                )}
              </SwipeAction>
            );
          })}
        </ScrollView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F1',
  },
});
