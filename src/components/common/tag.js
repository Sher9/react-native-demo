import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import _ from 'lodash';

export default class ScTag extends Component<> {
  constructor(props) {
    super(props);
    let selectedItemIndex = _.findIndex(props.data, {
      value: props.defaultValue,
    });
    this.state = {
      selectedIndex: selectedItemIndex,
      value: props.defaultValue,
      label:
        props.data[selectedItemIndex] && props.data[selectedItemIndex].value,
    };
    this.reset = this.reset.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.selectedIndex !== this.state.selectedIndex;
  }

  set(index) {
    this.setState({
      selectedIndex: index,
      value: this.props.data[index] && this.props.data[index].value,
      label: this.props.data[index] && this.props.data[index].label,
    });
  }

  reset() {
    this.setState({selectedIndex: -1, value: null, label: ''});
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
        {this.props.data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.wrap,
              this.state.selectedIndex === index && styles.wrapActive,
            ]}
            onPress={() => {
              if (index === this.state.selectedIndex) {
                this.reset();
                this.props.onClick && this.props.onClick({});
              } else {
                this.setState({
                  selectedIndex: index,
                  value: item.value,
                  label: item.label,
                });
                this.props.onClick && this.props.onClick(item);
              }
            }}>
            <Text
              style={[
                styles.label,
                this.state.selectedIndex === index && styles.labelActive,
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    padding: 10,
  },
  wrap: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#E5E5E5',
    color: '#878787',
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  label: {
    textAlign: 'center',
    fontSize: 12,
    paddingHorizontal: 2,
  },
  wrapActive: {
    borderColor: '#1777FF',
    backgroundColor: '#1777FF',
  },
  labelActive: {
    color: '#FFF',
  },
});
