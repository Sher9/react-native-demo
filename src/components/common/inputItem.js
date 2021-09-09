import React, {Component} from 'react';

import {View, StyleSheet, Text, TextInput} from 'react-native';

export default class InputItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[
          styles.inputItem,
          this.props.editable === false && {backgroundColor: '#fbfbfb'},
        ]}>
        <Text style={styles.title}>
          {this.props.title}
          {this.props.badge && <Text style={{color: 'red'}}>*</Text>}
        </Text>
        <View style={styles.textInputWrap}>
          <TextInput
            style={[
              styles.textInputStyle,
              {
                textAlignVertical: this.props.multiline ? 'top' : 'auto',
                textAlign: this.props.textAlign,
                width: this.props.extra ? '70%' : '100%',
              },
            ]}
            {...this.props}
          />
          {this.props.extra}
        </View>
      </View>
    );
  }
}

InputItem.defaultProps = {
  textAlign: 'left',
  badge: false,
};

const styles = StyleSheet.create({
  inputItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.3,
    backgroundColor: '#fff',
  },
  title: {
    color: '#333',
    fontSize: 16,
    maxWidth: '35%',
    paddingTop: 3,
    marginLeft: 3,
  },
  textInputWrap: {
    flex: 1,
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 16,
    padding: 0,
    flex: 1,
  },
});
