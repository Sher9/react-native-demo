import React from 'react';
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  DatePickerAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from '../../static/font/iconfont';
const {width, height} = Dimensions.get('window');
import _ from 'lodash';
import moment from 'moment';
import {List} from '@ant-design/react-native';
const Item = List.Item;
import PickerView from '../common/picker';
import InputItem from '../common/inputItem';
import ScTag from '../common/tag';
import {locate} from '../../actions/api';
const quickTimeSelections = [
  {
    label: '本日',
    value: 'day',
    startTime: moment().format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
  },
  {
    label: '本周',
    value: 'week',
    startTime: moment()
      .weekday(1)
      .format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
  },
  {
    label: '本月',
    value: 'month',
    startTime: moment()
      .date(1)
      .format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
  },
  {
    label: '本季',
    value: 'quarter',
    startTime: moment()
      .startOf('quarter')
      .format('YYYY-MM-DD'),
    endTime: moment()
      .endOf('quarter')
      .format('YYYY-MM-DD'),
  },
  {
    label: '本年',
    value: 'year',
    startTime: moment()
      .startOf('year')
      .format('YYYY-MM-DD'),
    endTime: moment()
      .endOf('year')
      .format('YYYY-MM-DD'),
  },
];

class Query extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeType: '',
      startTime: '',
      endTime: '',
      taskNum: '',
      selectedIndex: 0,
      recTypeID: '',
      mainTypeID: '',
      subTypeID: '',
      recDesc: '',
      coordX: '',
      coordY: '',
      address: '',
      subTypes: [],
      mainTypes: [],
      statusList: [],
    };
    this.handleQuickTimeSelect = this.handleQuickTimeSelect.bind(this);
    this.openDatePicker = this.openDatePicker.bind(this);
  }

  componentDidMount() {
    this.props.locate({lng: 0, lat: 0});
  }

  /*
   * 自定义时间选择
   */
  openDatePicker(type) {
    DatePickerAndroid.open({
      date: moment(this.state[type]).toDate(),
      maxDate: new Date(),
    })
      .then(({action, year, month, day}) => {
        if (action !== DatePickerAndroid.dismissedAction) {
          let date = moment()
            .set({year: year, month: month, date: day})
            .format('YYYY-MM-DD');
          let tempState = {};
          tempState[type] = date;
          this.setState(tempState);
          this.timeTypeTag.set(
            _.findIndex(quickTimeSelections, item => {
              return (
                item.startTime === this.state.startTime &&
                item.endTime === this.state.endTime
              );
            }),
          );
        }
      })
      .catch(() => {});
  }
  /**
   * 时间快捷方式选择处理
   */
  handleQuickTimeSelect(item) {
    this.setState({
      startTime: item.startTime,
      endTime: item.endTime,
    });
  }
  handleStatus(statusCode) {
    let tempStatus = _.clone(this.state.statusList);
    if (tempStatus.indexOf(statusCode) > -1) {
      let tempArry = _.difference(tempStatus, [statusCode]);
      this.setState({statusList: tempArry});
    } else {
      let tempArry = _.union(tempStatus, [statusCode]);
      this.setState({statusList: tempArry});
    }
  }
  handleRecType(item) {
    if (item) {
      if (item.children && item.children.length > 0) {
        this.setState({recTypeID: item.value, mainTypes: item.children});
      } else {
        this.setState({recTypeID: item.value});
      }
    } else {
      this.setState({recTypeID: ''});
    }
  }
  handleMainType(item) {
    if (item) {
      if (item.children && item.children.length > 0) {
        this.setState({mainTypeID: item.value, subTypes: item.children});
      } else {
        this.setState({mainTypeID: item.value});
      }
    } else {
      this.setState({mainTypeID: ''});
    }
  }
  handleSubType(item) {
    if (item) {
      this.setState({subTypeID: item.value});
    } else {
      this.setState({subTypeID: ''});
    }
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>查询</Text>
          <Text
            style={styles.titleButtton}
            onPress={() => {
              this.timeTypeTag.reset();
              this.props.locate({lng: 0, lat: 0});
              this.setState({
                timeType: '',
                startTime: '',
                endTime: '',
                taskNum: '',
                selectedIndex: 0,
                recTypeID: '',
                mainTypeID: '',
                subTypeID: '',
                recDesc: '',
                coordX: '',
                coordY: '',
                address: '',
                subTypes: [],
                mainTypes: [],
                statusList: [],
              });
            }}>
            重置
          </Text>
        </View>
        <ScTag
          data={quickTimeSelections}
          defaultValue={this.state.timeType}
          onClick={this.handleQuickTimeSelect}
          ref={ref => (this.timeTypeTag = ref)}
        />
        <Item
          extra={
            <View style={styles.listItemExtraView}>
              <Text style={styles.listItemExtraText}>
                {this.state.startTime || '不限'}&nbsp;&nbsp;
                <Icon
                  name={'arrowright1'}
                  size={16}
                  style={styles.listItemIcon}
                />
              </Text>
            </View>
          }
          platform="android"
          onPress={this.openDatePicker.bind(this, 'startTime')}>
          <View style={styles.listItemView}>
            <Text style={styles.listItemText}> 开始日期</Text>
          </View>
        </Item>

        <Item
          // extra={this.state.endTime || '不限'}
          extra={
            <View style={styles.listItemExtraView}>
              <Text style={styles.listItemExtraText}>
                {this.state.endTime || '不限'}&nbsp;&nbsp;
                <Icon
                  name={'arrowright1'}
                  size={16}
                  style={styles.listItemIcon}
                />
              </Text>
            </View>
          }
          platform="android"
          onPress={this.openDatePicker.bind(this, 'endTime')}>
          <View style={styles.listItemView}>
            <Text style={styles.listItemText}> 结束日期</Text>
          </View>
        </Item>
        <InputItem
          title={'任务号'}
          maxLength={18}
          value={this.state.taskNum}
          onChangeText={taskNum => this.setState({taskNum})}
        />
        <PickerView
          title={'类型'}
          defaultValue={this.state.recTypeID}
          data={this.props.recTypes}
          onSelected={item => this.handleRecType(item)}
        />
        <PickerView
          title={'大类'}
          defaultValue={this.state.mainTypeID}
          data={this.state.mainTypes}
          onSelected={item => this.handleMainType(item)}
        />
        <PickerView
          title={'小类'}
          defaultValue={this.state.subTypeID}
          data={this.state.subTypes}
          onSelected={item => this.handleSubType(item)}
        />
        <View style={styles.queryView}>
          <Text style={styles.queryTitle}>案件状态</Text>
          <View style={styles.recStatus}>
            <Text
              onPress={() => this.handleStatus('03')}
              style={[
                styles.recStatusLabel,
                this.state.statusList.indexOf('03') > -1 &&
                  styles.recStatusActive,
              ]}>
              处理中
            </Text>
            <Text
              onPress={() => this.handleStatus('01')}
              style={[
                styles.recStatusLabel,
                this.state.statusList.indexOf('01') > -1 &&
                  styles.recStatusActive,
              ]}>
              结案
            </Text>
            <Text
              onPress={() => this.handleStatus('02')}
              style={[
                styles.recStatusLabel,
                this.state.statusList.indexOf('02') > -1 &&
                  styles.recStatusActive,
              ]}>
              作废
            </Text>
          </View>
        </View>
        <InputItem
          title={'问题描述'}
          multiline={true}
          maxLength={100}
          value={this.state.recDesc}
          onChangeText={recDesc => this.setState({recDesc})}
        />
        <TouchableOpacity
          style={styles.queryButton}
          onPress={() =>
            this.props.navigation.navigate('QueryRecList', {
              condition: {
                startTime: this.state.startTime,
                endTime: this.state.endTime,
                taskNum: this.state.taskNum,
                recTypeID: this.state.recTypeID,
                mainTypeID: this.state.mainTypeID,
                subTypeID: this.state.subTypeID,
                recDesc: this.state.recDesc,
                actpropertyIDs: this.state.statusList.join(','),
                coordX: this.state.coordX
                  ? this.state.coordX
                  : this.props.location.lng,
                coordY: this.state.coordY
                  ? this.state.coordY
                  : this.props.location.lat,
              },
            })
          }>
          <View style={styles.queryWrap}>
            <Text style={styles.queryButtonText}>查询</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

export default connect(
  state => {
    return {
      location: state.location,
      recTypes: state.recTypes,
    };
  },
  dispatch => {
    return {
      locate: (coordinate, callback) => dispatch(locate(coordinate, callback)),
    };
  },
)(Query);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },
  titleView: {
    width: width,
    height: 50,
    backgroundColor: '#1678FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#fff',
    fontSize: 18,
  },
  titleButtton: {
    position: 'absolute',
    right: 10,
    color: '#fff',
    fontSize: 14,
  },
  recStatusActive: {
    borderColor: '#108ee9',
    color: '#108ee9',
  },
  queryView: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    borderBottomColor: '#E9E9E9',
  },
  queryTitle: {
    color: '#565656',
    marginLeft: 5,
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  recStatus: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 15,
  },
  recStatusLabel: {
    borderWidth: 0.3,
    borderColor: '#9C9C9C',
    color: '#9C9C9C',
    height: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  queryButton: {
    backgroundColor: '#1678FF',
    borderRadius: 4,
    marginHorizontal: 15,
    marginVertical: 5,
  },
  queryWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  queryButtonText: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
    marginRight: 5,
  },
  listItemExtraView: {
    position: 'absolute',
    right: 15,
  },
  listItemExtraText: {
    fontSize: 16,
  },
  listItemIcon: {
    color: '#BEC7CF',
    marginLeft: 15,
  },
  listItemText: {
    color: '#333',
    fontSize: 16,
  },
});
