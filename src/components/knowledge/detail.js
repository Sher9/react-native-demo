import React, { Component } from "react";
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native";
import Icon from "../../static/font/iconfont";
import EmptyView from "../common/emptyView";
import { getRecConditions } from "../../actions/api";
const { width, height } = Dimensions.get("window");
export default class KnowledgeDetail extends Component<> {
  constructor(props) {
    super(props);
    this.state = {
      animating: false,
      emptyDisplay: false,
      recType: this.props.route.params.data,
      conditions: [],
    };
  }

  componentDidMount() {
    getRecConditions({ subTypeID: this.state.recType.recTypeID }).then(
      (res) => {
        if (res.data.result && res.data.result.length > 0) {
          this.setState({ conditions: res.data.result });
        }
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <EmptyView
          display={this.state.emptyDisplay}
          isErrorView={true}
          onPress={() => {
            this.setState({ emptyDisplay: false, animating: true });
          }}
        />
        <ScrollView>
          <View style={styles.contentWrap}>
            <Icon
              name={"viewopinion"}
              size={18}
              style={{ marginRight: 15, color: "#E98C8B" }}
            />
            <Text style={styles.contentText}>
              <Text style={styles.contentTitle}>小类名称：</Text>
              {this.state.recType.recTypeName}
            </Text>
          </View>
          <View style={styles.contentWrap}>
            <Icon
              name={"seturgent"}
              size={18}
              style={{ marginRight: 15, color: "#FFECA9" }}
            />

            <Text style={styles.contentText}>
              <Text style={styles.contentTitle}>类型代码：</Text>
              {this.state.recType.recTypeCode}
            </Text>
          </View>
          <View style={styles.contentWrap}>
            <Icon
              name={"organizatio_case"}
              size={18}
              style={{ marginRight: 15, color: "#7DD5BA" }}
            />

            <Text style={styles.contentText}>
              <Text style={styles.contentTitle}>权属部门：</Text>
              {this.state.recType.department}
            </Text>
          </View>
          <View style={styles.contentWrap}>
            <Icon
              name={"case_handling"}
              size={18}
              style={{ marginRight: 15, color: "#B2EB9E" }}
            />
            <Text style={styles.contentText}>
              <Text style={styles.contentTitle}>责任部门：</Text>
              {this.state.recType.dealUnit}
            </Text>
          </View>
          <View style={styles.contentWrap}>
            <Icon
              name={"majorcase"}
              size={18}
              style={{ marginRight: 15, color: "#8CE26F" }}
            />
            <Text style={styles.contentText}>
              <Text style={styles.contentTitle}>管理标准：</Text>
              {this.state.recType.criterion}
            </Text>
          </View>
          <View style={styles.contentWrap}>
            <Icon
              name={"exchange"}
              size={18}
              style={{ marginRight: 15, color: "#B2D2FF" }}
            />

            <Text style={styles.contentText}>
              <Text style={styles.contentTitle}>管理流程：</Text>
              {this.state.recType.flow}
            </Text>
          </View>
          <View style={styles.contentWrap}>
            <Icon
              name={"analysis"}
              size={18}
              style={{ marginRight: 15, color: "#EDCAF2" }}
            />

            <Text style={styles.contentText}>
              <Text style={styles.contentTitle}>备注：</Text>
              {this.state.recType.note}
            </Text>
          </View>
          {this.state.conditions.map((item, index) => {
            return (
              <View style={styles.conditionWrap} key={index.toString()}>
                <View style={styles.condition}>
                  <Icon
                    name={"service"}
                    size={18}
                    style={{
                      marginRight: 15,
                      color: "#0070FE",
                    }}
                  />

                  <Text style={[styles.contentText, { paddingRight: 15 }]}>
                    <Text style={styles.contentTitle}>立案条件：</Text>
                    {item.establishCond}
                  </Text>
                </View>
                <View style={styles.condition}>
                  <Icon
                    name={"acceptance"}
                    size={18}
                    style={{
                      marginRight: 15,
                      color: "#9ED38D",
                    }}
                  />
                  <Text style={[styles.contentText, { paddingRight: 15 }]}>
                    <Text style={styles.contentTitle}>结案条件：</Text>
                    {item.archiveCond}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentWrap: {
    paddingHorizontal: 15,
    paddingRight: 15,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  contentText: {
    color: "#B6B6B6",
    marginRight: 20,
    fontSize: 16,
  },
  contentTitle: {
    color: "#404040",
    paddingRight: 5,
    fontSize: 16,
  },
  conditionWrap: {
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: "column",
    backgroundColor: "#F9F9F9",
    borderRadius: 5,
  },
  condition: {
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 5,
    flexDirection: "row",
  },
});
