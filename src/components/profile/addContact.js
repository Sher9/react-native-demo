import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import Icon from '../../static/font/iconfont';
import InputItem from '../common/inputItem';
import _ from 'lodash';

export default class AddContact extends Component<> {
  constructor(props) {
    super(props);
    console.log(this.props);
    let params = this.props.route.params;
    this.state = {
      name:
        params.data && params.index >= 0
          ? params.data.contacts[params.index].name
          : '',
      phone:
        params.data && params.index >= 0
          ? params.data.contacts[params.index].phone
          : '',
      group: params.data ? params.data : {},
      editGroup: params.data ? params.data : {},
      index: params.index ? params.index : 0,
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{padding: 10}} onPress={() => this.save()}>
          <Text
            style={{
              textAlign: 'center',
              textAlignVertical: 'center',
              color: '#FFF',
            }}>
            保存
          </Text>
        </TouchableOpacity>
      ),
    });
  }

  save = () => {
    if (this.state.name.length <= 0) {
      ToastAndroid.show('请输入姓名！', ToastAndroid.SHORT);
      return;
    }
    if (this.state.phone.length <= 0) {
      ToastAndroid.show('请输入电话号码！', ToastAndroid.SHORT);
      return;
    }
    if (!/^1\d{10}$/.test(this.state.phone)) {
      ToastAndroid.show('请输入正确的手机号！', ToastAndroid.SHORT);
      return;
    }
    if (!this.state.editGroup.title) {
      ToastAndroid.show('请选择分组！', ToastAndroid.SHORT);
      return;
    }
    if (this.state.group.id !== this.state.editGroup.id) {
      this.state.editGroup.contacts.push({
        name: this.state.name,
        phone: this.state.phone,
      });
      storage
        .save({
          key: 'contacts',
          id: this.state.editGroup.id,
          data: this.state.editGroup,
        })
        .then(() => {
          _.remove(this.state.group.contacts, (n, index) => {
            return index === this.state.index;
          });
          storage
            .save({
              key: 'contacts',
              id: this.state.group.id,
              data: this.state.group,
            })
            .then(() => {
              ToastAndroid.show('保存成功', ToastAndroid.SHORT);
            })
            .catch(() => {});
        })
        .catch(() => {});
    } else {
      this.state.group.contacts[this.state.index].name = this.state.name;
      this.state.group.contacts[this.state.index].phone = this.state.phone;
      storage
        .save({
          key: 'contacts',
          id: this.state.group.id,
          data: this.state.group,
        })
        .then(() => {
          ToastAndroid.show('保存成功', ToastAndroid.SHORT);
        })
        .catch(() => {});
    }
    ToastAndroid.show('保存成功', ToastAndroid.SHORT);
    this.props.route.params.callback && this.props.route.params.callback();
    this.props.navigation.goBack();
  };

  onNameChange = value => {
    this.setState({
      name: value,
    });
  };

  onPhoneChange = value => {
    this.setState({
      phone: value,
    });
  };

  render() {
    return (
      <ScrollView
        style={styles.container}
        showsHorizontalScrollIndicator={false}>
        <View style={{height: 120, backgroundColor: '#1678FF'}} />
        <Text style={styles.headPortrait}>姓名</Text>
        <InputItem
          title="姓名:"
          maxLength={4}
          value={this.state.name}
          placeholder="请输入姓名"
          onChangeText={this.onNameChange}
        />
        <InputItem
          title="电话:"
          maxLength={11}
          keyboardType="numeric"
          value={this.state.phone}
          placeholder="请输入电话号码"
          onChangeText={this.onPhoneChange}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            this.props.navigation.navigate('Grouping', {
              callback: group => this.setState({editGroup: group}),
            })
          }>
          <InputItem
            title="分组:"
            value={this.state.editGroup.title}
            editable={false}
            placeholder="请选择分组"
            extra={
              <Text
                style={{
                  flex: 1,
                  textAlign: 'right',
                  textAlignVertical: 'center',
                }}>
                <Icon name={'arrowright1'} size={12} />
              </Text>
            }
          />
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headPortrait: {
    width: 80,
    height: 80,
    color: '#fff',
    alignSelf: 'center',
    backgroundColor: '#79919c',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: -40,
    marginBottom: 40,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
