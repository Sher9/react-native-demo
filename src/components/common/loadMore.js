import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, ProgressBarAndroid} from 'react-native';
import PropTypes from 'prop-types';

export default class LoadMore extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pageNo: 1,
            totalPageCount: 0,
        };
        this.reachEnd = this.reachEnd.bind(this);
        this.loaded = this.loaded.bind(this);
    }

    componentWillUnmount() {
    }

    /**
     * 在加载下一页的数据完成后调用此方法
     * @param pageNo
     * @param totalPageCount
     */
    loaded(pageNo, totalPageCount) {
        this.setState({
            pageNo: pageNo || this.state.pageNo,
            totalPageCount: totalPageCount || this.state.totalPageCount,
            loading: false
        })
    }

    reachEnd() {
        return this.state.pageNo >= this.state.totalPageCount
    }


    render() {
        return <TouchableOpacity style={[styles.touchWrap, this.props.style]}
                                 disabled={this.state.loading}
                                 onPress={() => {
                                     if (!this.reachEnd()) {
                                         this.setState({loading: true});
                                         this.props.onClick(this.state.pageNo + 1)
                                     }
                                 }}>
            <Text style={styles.loadingText}>
                {this.reachEnd() ? '没有更多数据' : '点击加载更多'}
            </Text>
            <ProgressBarAndroid
                style={(!this.state.loading || this.reachEnd()) && {display: 'none'}}
                color="black"
                styleAttr="Small"/>
        </TouchableOpacity>
    }
}

LoadMore.propTypes = {
    onClick: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    touchWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        borderTopColor: '#ddd',
        borderTopWidth: 1
    },
    loadingText: {
        alignSelf: 'center',
        marginRight: 5
    }
});
