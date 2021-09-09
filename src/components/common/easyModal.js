import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  BackHandler,
} from "react-native";
import * as Animatable from "react-native-animatable";
import PropTypes from "prop-types";

export default class EasyModal extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.toggle = this.toggle.bind(this);
    this.onPressBack = this.onPressBack.bind(this);
  }

  toggle(visible) {
    if (visible === undefined) {
      this.setState({ visible: !this.state.visible });
    } else {
      this.setState({ visible: visible });
    }
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onPressBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onPressBack);
  }

  onPressBack() {
    if (this.state.visible) {
      this.setState({ visible: false });
      return true;
    } else {
      return false;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.visible !== nextState.visible ||
      this.props.children !== nextProps.children
    );
  }

  render() {
    if (this.state.visible) {
      return (
        <View style={[styles.container, this.props.containerStyle]}>
          <Animatable.View
            duration={this.props.duration || 1000}
            useNativeDriver={true}
            style={[styles.wrap, this.props.style]}
          >
            {this.props.children}
          </Animatable.View>
          <TouchableWithoutFeedback
            disabled={this.props.isNotPress}
            onPress={() => this.setState({ visible: false })}
          >
            <View style={[styles.modal]} />
          </TouchableWithoutFeedback>
        </View>
      );
    } else {
      return null;
    }
  }
}

EasyModal.propTypes = {
    isNotPress: PropTypes.bool
};
EasyModal.defaultProps = {
    isNotPress: false,
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 8,
  },
  modal: {
    position: "absolute",
    backgroundColor: "#000",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
    zIndex: 1,
  },
  wrap: {
    backgroundColor: "#fff",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 2,
  },
});
