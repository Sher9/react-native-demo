import React from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {fetchRecTypes} from '../../actions/index';
import {connect} from 'react-redux';
import Content from './content';
import Common from './common';
import Notice from './notice';

const {width, height} = Dimensions.get('window');
class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //获取大小类
    this.props.fetchRecTypes();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#1678FF" barStyle="dark-content" />
        <Image
          resizeMode={'stretch'}
          style={styles.bannerContainer}
          source={require('../../static/images/home_banner.jpg')}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Content navigation={this.props.navigation} />
          <Notice navigation={this.props.navigation} />
          <Common navigation={this.props.navigation} />
        </ScrollView>
      </View>
    );
  }
}

export default connect(
  state => {
    return {};
  },
  dispatch => {
    return {
      fetchRecTypes: () => dispatch(fetchRecTypes()),
    };
  },
)(Home);

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerContainer: {
    width: width,
    height: 160,
  },
});
