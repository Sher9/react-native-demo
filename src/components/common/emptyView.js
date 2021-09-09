import React, {Component} from 'react';

import {View, StyleSheet, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import PropTypes from 'prop-types';


export default class EmptyView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {height} = Dimensions.get('window');
        return (this.props.display ?
            <View style={[styles.container, {height: height - 40}]}>
                <Image style={{width: 100, height: 100}}
                       source={this.props.isErrorView ? require('../../static/images/empty_error.jpg') : require('../../static/images/empty_data.jpg')}/>
                <Text style={{color: '#adadad'}}>{this.props.isErrorView ? "数据加载失败" : "没有数据"}</Text>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{display: this.props.isErrorView ? 'flex' : 'none'}}
                    onPress={this.props.onPress}>
                    <Text style={styles.loadAgain}>重新加载</Text>
                </TouchableOpacity>
            </View> : null)

    }
}
EmptyView.propTypes = {
    isErrorView: PropTypes.bool,
    onPress: PropTypes.func,
    display: PropTypes.bool,
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3eded',
    },
    loadAgain: {
        color: '#fff',
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 50,
        backgroundColor: '#f4626f',
    },
});