import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import AweSomeIcon from 'react-native-vector-icons/FontAwesome';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import DefaultImage from '../common/defaultImage';
import Icon from '../../static/font/iconfont';
import moment from 'moment';
import _ from 'lodash';

const RecStateDic = [
  {label: '上报', fieldName: 'recStateID', color: '#5482d6'},
  {label: '核实', fieldName: 'verifyMsgStateID', color: '#deb44d'},
  {label: '核查', fieldName: 'checkMsgStateID', color: '#88cd4a'},
];
export default class RecBrief extends Component<{}> {
  constructor(props) {
    super(props);
  }

  renderMedias() {
    return _.valuesIn(_.groupBy(this.props.data.medias, 'mediaUsage')).map(
      (medias, index) => {
        return (
          <View style={styles.mediasWrap} key={index}>
            {medias.map((item, index) => {
              switch (item.mediaType) {
                case 'voice':
                  return (
                    <TouchableOpacity
                      key={item.mediaID || index}
                      onPress={() =>
                        this.props.navigation.navigate('VideoPlayer', item)
                      }>
                      <Image
                        style={styles.imageStyle}
                        source={require('../../static/images/module_media_ic_voice_unload.png')}
                      />
                      <Text style={styles.mediaUsageText}>
                        {item.mediaUsage}
                      </Text>
                    </TouchableOpacity>
                  );
                case 'video':
                  return (
                    <TouchableOpacity
                      key={item.mediaID || index}
                      onPress={() =>
                        this.props.navigation.navigate('VideoPlayer', item)
                      }>
                      <Image
                        style={styles.imageStyle}
                        source={require('../../static/images/module_media_ic_video_unload.png')}
                      />
                      <Text style={styles.mediaUsageText}>
                        {item.mediaUsage}
                      </Text>
                    </TouchableOpacity>
                  );
                case 'photo':
                  return (
                    <TouchableOpacity
                      key={item.mediaID || index}
                      onPress={() =>
                        this.props.navigation.navigate('ImageViewer', {
                          initIndex: _.indexOf(this.props.data.photos, item),
                          data: this.props.data.photos,
                        })
                      }>
                      <DefaultImage
                        style={styles.imageStyle}
                        defaultSource={require('../../static/images/module_media_icon_loading.png')}
                        uriSource={{uri: item.mediaPath}}
                      />
                      <Text style={styles.mediaUsageText}>
                        {item.mediaUsage}
                      </Text>
                    </TouchableOpacity>
                  );
                default:
                  return null;
              }
            })}
          </View>
        );
      },
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() =>
          this.props.navigation.navigate('RecDetail', {
            recID: this.props.data.rec.recID,
            taskNum: this.props.data.rec.taskNum,
          })
        }>
        <View style={styles.recImportantWrap}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 20, color: '#414141'}}>
              {this.props.data.rec.taskNum}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#ABABAB',
                marginLeft: 15,
                marginTop: 3,
              }}>
              上报时间：{' '}
              {moment(this.props.data.rec.createTime).format(
                'YYYY-MM-DD HH:mm:ss',
              )}
            </Text>
          </View>
        </View>
        <View style={styles.recBriefWrap}>
          <View style={styles.recBriefItem}>
            <Image
              source={require('../../static/images/func_rec_icon_part.png')}
              style={{width: 15, height: 15, marginRight: 3}}
            />
            <Text
              style={{paddingRight: 10, color: '#5E5E5E'}}
              numberOfLines={1}>
              {this.props.data.rec.recTypeName
                ? this.props.data.rec.recTypeName + '-'
                : ''}
              {this.props.data.rec.mainTypeName
                ? this.props.data.rec.mainTypeName + '-'
                : ''}
              {this.props.data.rec.subTypeName}
            </Text>
          </View>
        </View>
        <Text style={{marginBottom: 5, color: '#5E5E5E'}}>
          {this.props.data.rec.recDesc}
        </Text>
        {this.renderMedias()}
        <View style={{flexDirection: 'row'}}>
          <Text
            style={styles.locationText}
            onPress={() =>
              this.props.navigation.navigate('RecMap', [this.props.data.rec])
            }>
            <AweSomeIcon name="location-arrow" size={12} />
            &nbsp;&nbsp;
            {this.props.data.rec.communityName
              ? this.props.data.rec.communityName + '-'
              : ''}
            {this.props.data.rec.address}&nbsp;&nbsp;
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

RecBrief.defaultProps = {
  data: {
    rec: {},
    photos: [],
    medias: [],
  },
  menus: [],
};

const menuOptionsStyle = {
  optionsContainer: {
    width: 100,
  },
  optionsWrapper: {
    backgroundColor: '#000',
    opacity: 0.8,
    padding: 0,
  },
  optionText: {
    color: '#fff',
    textAlign: 'center',
  },
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  recStatusTag: {
    backgroundColor: '#5482d6',
    fontSize: 9,
    color: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  recImportantWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recBriefWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  recBriefItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  triangleLeft: {
    width: 0,
    height: 0,
    marginLeft: 4,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#5482d6',
  },
  mediasWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 12,
    padding: 3,
    borderRadius: 10,
    backgroundColor: '#f6f7f8',
    textAlignVertical: 'center',
  },
  imageStyle: {
    width: 102,
    height: 102,
    margin: 2,
  },
  mediaUsageText: {
    position: 'absolute',
    right: '1.5%',
    bottom: '1.5%',
    backgroundColor: '#777777',
    color: '#fff',
    fontSize: 10,
  },
});
