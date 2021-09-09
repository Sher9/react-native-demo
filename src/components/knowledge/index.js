import React, {Component} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Accordion from '../common/accordion';
import {connect} from 'react-redux';
import Icon from '../../static/font/iconfont';
const {width, height} = Dimensions.get('window');
class Knowledge extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      recTypeIndex: 0,
      subTypes: this.props.recTypes[0].children || [],
    };
    this.accordionHeader = this.accordionHeader.bind(this);
    this.accordionContent = this.accordionContent.bind(this);
  }

  componentDidMount() {}
  accordionHeader(section, key, activeSection) {
    return (
      <View style={styles.AccordionTitle}>
        <Text style={{width: '90%', color: '#2A2A2A', fontSize: 16}}>
          {section.label}
        </Text>
        <Icon
          name={activeSection ? 'arrowbottom1' : 'arrowright1'}
          size={16}
          style={{marginRight: 4, color: '#E9E9E9'}}
        />
      </View>
    );
  }

  accordionContent(section) {
    return section.children.map((item, index) => {
      return (
        <TouchableOpacity
          style={styles.AccordionContent}
          key={index}
          onPress={() =>
            this.props.navigation.navigate('KnowledgeDetail', {
              data: item.attributes,
            })
          }>
          <Text>{item.label}</Text>
        </TouchableOpacity>
      );
    });
  }

  selectRecType(item, index) {
    this.setState({
      recTypeIndex: index,
      subTypes: item.children,
    });
  }

  render() {
    if (this.props.recTypes.length > 0) {
      return (
        <View style={styles.container}>
          <View style={styles.leftNavContainer}>
            {this.props.recTypes.map((item, index) => {
              if (this.state.recTypeIndex === index) {
                return (
                  <TouchableOpacity
                    key={index.toString()}
                    style={styles.leftNavActiveView}>
                    <View style={styles.leftNavActive} />
                    <Text style={styles.leftNavActiveText}>{item.label}</Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={index.toString()}
                    onPress={() => this.selectRecType(item, index)}
                    style={styles.leftNavView}>
                    <Text style={styles.leftNavText}>{item.label}</Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
          <ScrollView
            style={styles.rightNavContainer}
            showsVerticalScrollIndicator={false}>
            <Accordion
              sections={this.state.subTypes}
              underlayColor="#f6f7f8"
              renderHeader={this.accordionHeader}
              renderContent={this.accordionContent}
            />
            <View style={styles.separator} />
          </ScrollView>
        </View>
      );
    } else {
      return null;
    }
  }
}
export default connect(state => {
  return {
    recTypes: state.recTypes,
  };
})(Knowledge);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
  },
  leftNavContainer: {
    height: height,
    width: width * 0.2,
    backgroundColor: '#F6F7FB',
    flexDirection: 'column',
  },
  leftNavView: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftNavText: {
    fontSize: 16,
    color: '#2E2E30',
  },
  leftNavActiveView: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    flexDirection: 'row',
  },
  leftNavActive: {
    position: 'absolute',
    left: 0,
    width: 3,
    height: 40,
    backgroundColor: '#1678FF',
  },
  leftNavActiveText: {
    fontSize: 16,
    color: '#1678FF',
  },
  rightNavContainer: {
    height: height,
    width: width * 0.8,
    backgroundColor: '#FFF',
  },
  AccordionTitle: {
    padding: 10,
    marginHorizontal: 20,
    color: '#333',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.3,
    borderTopColor: '#E9E9E9',
  },
  AccordionContent: {
    padding: 5,
    marginHorizontal: 25,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#F9F9F9',
    color: '#5D5D5D',
  },
  separator: {
    height: 0.3,
    backgroundColor: '#E9E9E9',
    marginHorizontal: 15,
  },
});
