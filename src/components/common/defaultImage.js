import React, {Component} from 'react';
import {Image} from 'react-native';
export default class DefaultImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uriSource: this.props.uriSource,
      initUri: this.props.uriSource.uri, //记住上次props穿过来的uriSource的uri
    };
  }

  //当props的uriSource的uri变化时，应该要重置uriSource和记住更改的uri
  componentWillReceiveProps(nextProps) {
    if (nextProps.uriSource.uri !== this.state.initUri) {
      this.setState({
        uriSource: nextProps.uriSource,
        initUri: nextProps.uriSource.uri,
      });
    }
  }

  render() {
    return (
      <Image
        onError={() => this.setState({uriSource: this.props.defaultSource})}
        source={this.state.uriSource}
        {...this.props}
      />
    );
  }
}
