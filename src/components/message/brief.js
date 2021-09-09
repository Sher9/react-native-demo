/**
 * Created by xh on 2019/7/23.
 */
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import { SwipeAction } from "@ant-design/react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import timeUtil from "../../utils/timeUtil";
import Icon from "../../static/font/iconfont";
import { fetchChatLog, deleteMember, deleteSession } from "../../actions/api";
import { connect } from "react-redux";
class Brief extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isError: false,
    };
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  onTriggerPress() {
    this.setState({ visible: true });
  }
  onBackdropPress() {
    this.setState({ visible: false });
  }
  handleMenuClick(item) {
    Alert.alert("", "确定删除此聊天？", [
      { text: "取消" },
      {
        text: "确定",
        onPress: () => {
          if (this.props.data.chatSession.sessionType === 1) {
            deleteSession({
              sessionID: this.props.data.chatSession.sessionID,
            }).then(() => {
              this.setState({ visible: false });
              this.props.fetchData();
            });
          } else {
            deleteMember({
              sessionID: this.props.data.chatSession.sessionID,
              userIDs: this.props.userInfo.userID,
            }).then(() => {
              this.setState({ visible: false });
              this.props.fetchData();
            });
          }
        },
      },
    ]);
  }
  jumpChat() {
  }
  render() {
    let source = {
      uri: `${this.props.fileServerAPI}/UM/User/${this.props.data.userID}/HeadImg.jpg`,
    };
    if (this.state.isError) {
      source = require("../../static/images/photo_unknown.jpg");
    }
    return (
      <View style={styles.container}>
        <SwipeAction
          style={{
            backgroundColor: "#fff",
            borderBottomWidth: 0.5,
            borderBottomColor: "#F4F4F4",
          }}
          autoClose
          right={[
            {
              text: "删除",
              onPress: () => this.handleMenuClick(),
              style: {
                backgroundColor: "#F4333C",
                color: "white",
                paddingBottom: 10,
              },
            },
          ]}
          onOpen={() => {}}
          onClose={() => {}}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => this.jumpChat()}
            style={styles.chatContainer}
          >
            {this.props.data.chatSession.sessionType === 1 ? (
              <Image
                source={source}
                style={styles.personPhoto}
                onError={() => {
                  this.setState({
                    isError: true,
                  });
                }}
              ></Image>
            ) : (
              <View style={styles.groupIcon}>
                <Icon name={"ranks"} size={30} style={{ color: "#FFF" }} />
              </View>
            )}
            {this.props.data.hasUnreadMsgFlag === 1 && (
              <View style={styles.dot}>
                <Text style={styles.dotText}>
                  {this.props.data.unreadMsgCount > 99
                    ? "99+"
                    : this.props.data.unreadMsgCount}
                </Text>
              </View>
            )}
            <View style={styles.personInfo}>
              <View style={styles.personInfoColumn}>
                <Text
                  style={[
                    styles.personInfoText,
                    { fontSize: 18, color: "#000000" },
                  ]}
                  numberOfLines={1}
                >
                  {this.props.data.chatSession.sessionName}
                </Text>
                <Text style={[styles.time, { fontSize: 12, color: "#B8BABC" }]}>
                  {timeUtil.getFormattedTime(
                    this.props.data.chatSession.updateTime
                  )}
                </Text>
              </View>
              <View style={styles.personInfoColumn}>
                <Text
                  style={[
                    styles.messageInfoText,
                    { color: "#B3B3B3", marginBottom: 5 },
                  ]}
                  numberOfLines={1}
                >
                  {this.props.data.lastestChatLog &&
                    this.props.data.lastestChatLog.content}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </SwipeAction>
      </View>
    );
  }
}
export default connect((state) => {
  return {
    userInfo: state.localData.userInfo,
    fileServerAPI: state.localData.fileServerAPI,
  };
})(Brief);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  dot: {
    backgroundColor: "#FF0000",
    width: 20,
    height: 20,
    borderRadius: 90,
    position: "absolute",
    top: 10,
    left: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  dotText: {
    color: "#fff",
    fontSize: 12,
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: 80,
    marginHorizontal: 15,
    backgroundColor: "#1678FF",
    alignItems: "center",
    justifyContent: "center",
  },
  personPhoto: {
    width: 50,
    height: 50,
    borderRadius: 80,
    marginHorizontal: 15,
  },
  personInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 60,
  },
  personInfoColumn: {
    flexDirection: "row",
    marginBottom: 2,
    minHeight: 20,
  },
  personInfoText: {
    color: "#888888",
    marginRight: 5,
    fontSize: 14,
    width: 200,
  },
  messageInfoText: {
    color: "#888888",
    paddingRight: 10,
    fontSize: 14,
  },
  time: {
    position: "absolute",
    marginTop: 5,
    right: 10,
  },
  menuOptionText: {
    paddingLeft: 5,
    textAlign: "left",
    textAlignVertical: "center",
    fontSize: 16,
    color: "#A9A9A9",
    paddingVertical: 1,
    borderRadius: 5,
  },
});
