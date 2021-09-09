import React, {Component} from 'react';
import {StyleSheet, View, TouchableHighlight, Text, FlatList, InteractionManager, TextInput} from 'react-native';
import {Menu, MenuTrigger, MenuOptions, renderers} from 'react-native-popup-menu';
import Icon from '../../static/font/iconfont';
import PropTypes from 'prop-types';
import _ from 'lodash';

const {SlideInMenu} = renderers;

export default class PickerView extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            keywords: ''
        };
        this.renderListItem = this.renderListItem.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleItemPress = this.handleItemPress.bind(this);
        this.highLightItem = this.highLightItem.bind(this);
        this.renderLabel = this.renderLabel.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        let tempObj;
        if (props.multiple) {
            if (!state.prevDefaultValue ||
                state.prevDefaultValue.toString() !== props.defaultValue.toString() ||
                props.data.length !== state.prevData.length) {
                tempObj = _.filter(props.data, item => props.defaultValue.indexOf(item[props.keyValue.value]) > -1);
                return {
                    selectedItem: tempObj,
                    highLightItem: tempObj,
                    prevDefaultValue: props.defaultValue,
                    prevData: props.data
                }
            }
        } else {
            if (state.prevDefaultValue !== props.defaultValue || props.data.length !== state.prevData.length) {
                let index = _.findIndex(props.data, item => item[props.keyValue.value] === props.defaultValue);
                tempObj = props.data[index] || {};
                return {
                    selectedItem: tempObj,
                    highLightItem: tempObj,
                    initScrollIndex: index,
                    prevDefaultValue: props.defaultValue,
                    prevData: props.data
                }
            }
        }
        return state;
    }

    handleItemPress(item) {
        //如果已经选中 再次点击就取消选中
        if (this.props.multiple) {
            let tempArray = _.filter(this.state.highLightItem, tempItem => {
                return item[this.props.keyValue.value] !== tempItem[this.props.keyValue.value]
            });
            if (tempArray.length === this.state.highLightItem.length) {
                this.setState({highLightItem: this.state.highLightItem.concat([item])});
            } else {
                this.setState({highLightItem: tempArray});
            }
        } else {
            if (this.state.highLightItem[this.props.keyValue.value] === item[this.props.keyValue.value]) {
                this.setState({highLightItem: {}});
            } else {
                this.setState({highLightItem: item});
            }
        }
    }

    highLightItem(item) {
        if (this.props.multiple) {
            return _.findIndex(this.state.highLightItem, {[this.props.keyValue.value]: item[this.props.keyValue.value]}) > -1 && {color: '#27b8f3'};
        } else {
            return item[this.props.keyValue.value] === this.state.highLightItem[this.props.keyValue.value] && {color: '#27b8f3'}
        }
    }


    renderListItem({item}) {
        return (
            <TouchableHighlight underlayColor={'#cacaca'} onPress={() => this.handleItemPress(item)}>
                <Text numberOfLines={1} style={[styles.dicItemText, this.highLightItem(item)]}>
                    {item[this.props.keyValue.label]}
                </Text>
            </TouchableHighlight>
        )
    };

    //处理确定按钮事件
    handleConfirm() {
        this.pickerMenu.close();
        if (this.props.multiple) {
            InteractionManager.runAfterInteractions(() => {
                this.setState({selectedItem: this.state.highLightItem});
                this.props.onSelected(this.state.highLightItem);
            });
        } else {
            if (this.state.highLightItem[this.props.keyValue.value] !== this.state.selectedItem[this.props.keyValue.value]) {
                this.setState({
                    selectedItem: this.state.highLightItem,
                    initScrollIndex: _.findIndex(this.props.data, {[this.props.keyValue.value]: this.state.highLightItem[this.props.keyValue.value]})
                });
                InteractionManager.runAfterInteractions(() => {
                    this.props.onSelected(this.state.highLightItem);
                });
            }
        }
    }

    handleCancel() {
        this.pickerMenu.close();
        if (this.state.highLightItem[this.props.keyValue.value] !== this.state.selectedItem[this.props.keyValue.value]) {
            this.setState({highLightItem: this.state.selectedItem})
        }
    }

    renderLabel() {
        if (this.props.multiple) {
            return this.state.selectedItem.length > 0 ? _.map(this.state.selectedItem, `${this.props.keyValue.label}`).join(',') : '请选择';
        } else {
            return this.state.selectedItem[this.props.keyValue.label] || '请选择'
        }
    }

    filterData = () => {
        if (this.state.keywords) {
            return _.filter(this.props.data, item => {
                return item[this.props.keyValue.label].indexOf(this.state.keywords) > -1
            })
        } else {
            return this.props.data
        }
    };

    render() {
        return (
            <View>
                <TouchableHighlight onPress={() => {
                    this.props.editable && this.pickerMenu.open();
                }} underlayColor={'#cacaca'}>
                    <View style={styles.wrap}>
                        <Text style={styles.formLabel}>{this.props.title}
                            {this.props.badge && <Text style={{color: 'red'}}>*</Text>}</Text>
                        <Text style={[styles.extraLabel, !this.props.editable && {color: '#878787'}]}
                              numberOfLines={1}>
                            {this.renderLabel()}
                        </Text>
                        <Icon name={'arrowright1'} color={'#BEC7CF'} size={15}/>
                    </View>
                </TouchableHighlight>

                <Menu renderer={SlideInMenu} ref={ref => this.pickerMenu = ref}>
                    <MenuTrigger/>
                    <MenuOptions>
                        <View style={styles.titleWrap}>
                            <TouchableHighlight onPress={this.handleCancel} underlayColor={'#cacaca'}>
                                <Text style={styles.titleBtnLabel}>取消</Text>
                            </TouchableHighlight>
                            <Text style={{fontSize: 18}}>{this.props.title}</Text>
                            <TouchableHighlight underlayColor={'#cacaca'} onPress={this.handleConfirm}>
                                <Text style={styles.titleBtnLabel}>确定</Text>
                            </TouchableHighlight>
                        </View>
                        {
                            this.props.filterable &&
                            <View style={styles.searchBar}>
                                <Icon name={'search'} size={16} style={{marginRight: 5}}/>
                                <TextInput
                                    style={{flex: 1}}
                                    value={this.state.keywords}
                                    onChangeText={keywords => this.setState({keywords})}
                                    placeholder={'请输入关键字'}
                                />
                            </View>
                        }
                        <FlatList
                            style={{height: 240}}
                            data={this.filterData()}
                            getItemLayout={(data, index) => ({length: 42, offset: 42 * index, index})}
                            removeClippedSubviews={false}
                            keyExtractor={item => item[[this.props.keyValue.value]].toString()}
                            renderItem={this.renderListItem}
                            extraData={this.state.selectedItem}
                        />
                    </MenuOptions>
                </Menu>
            </View>
        )
    }
}

PickerView.propTypes = {
    title: PropTypes.string,
    data: PropTypes.array,
    keyValue: PropTypes.object,
    defaultValue: PropTypes.any,
    //红色标记
    badge: PropTypes.bool,
    // 是否可编辑
    editable: PropTypes.bool,
    //是否多选
    multiple: PropTypes.bool,
    onSelected: PropTypes.func,
    //是否可过滤
    filterable: PropTypes.bool,
    //过滤方法
    filterFunc: PropTypes.func
};

PickerView.defaultProps = {
    data: [],
    defaultValue: '',
    keyValue: {value: 'value', label: 'label'},
    badge: false,
    editable: true,
    multiple: false,
    filterable: false,
    onSelected: () => {
    }
};

const styles = StyleSheet.create({
    wrap: {
        borderBottomColor: '#E9E9E9',
        borderBottomWidth: 0.3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight:15,
        paddingLeft:20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    formLabel: {
        fontSize: 16,
        color: '#565656',
        flex: 1
    },
    extraWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    extraLabel: {
        fontSize: 16,
        marginRight: 5,
        maxWidth: '50%',
        textAlign: 'right'
    },
    titleWrap: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: 0.3,
        borderBottomColor: "#E9E9E9",
        alignItems: 'center'
    },
    titleBtnLabel: {
        fontSize: 16,
        color: '#1678FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    dicItemText: {
        borderBottomWidth: 0.3,
        borderBottomColor: "#E9E9E9",
        padding: 10,
        fontSize: 16,
        textAlign: 'center'
    },
    searchBar: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderBottomColor: '#DBDBDC',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 40,
        paddingLeft: 10,
        borderRadius: 5,
    },
});