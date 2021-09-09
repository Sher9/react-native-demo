import axios from "axios";
import qs from "qs";
/**
 * 创建聊天会话
 */
export const createSession = (params) =>
  axios.post("/im/chatsession/create.htm", qs.stringify(params));

/**
 * 删除聊天会话
 */
export const deleteSession = (params) =>
  axios.post("/im/chatsession/delete.htm", qs.stringify(params));

/**
 * 获取聊天回话列表
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const fetchSessionList = (params) =>
  axios.get("/im/chatsession/list.htm", { params });

/**
 * 获取聊天回话详情
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const fetchSession = (params) =>
  axios.get("/im/chatsession/detail.htm", { params });

/**
 * 获取聊天回话详情
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const fetchMemberList = (params) =>
  axios.get("/im/chatsession/member.htm", { params });

/**
 * 获取聊天记录
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const fetchChatLog = (params) =>
  axios.get("/im/chatsession/chatlog.htm", { params });

/**
 * 修改群名称
 * @param {} params
 */
export const updateChatlog = (params) =>
  axios.post("/im/chatsession/update.htm", qs.stringify(params));

/**
 * 读取会话列表
 * @param {} params
 */
export const readChatlog = (params) =>
  axios.post("/im/chatlog/read.htm", qs.stringify(params));

/**
 * 获取群聊
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const fetchGroups = (params) =>
  axios.get("/im/chatsession/group.htm", { params });

/**
 * 获取视频聊天地址
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const fetchVedioChatUrl = (params) =>
  axios.get("/im/chatsession/video.htm", { params });

/**
 * 获取联系人
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const fetchContacts = (params) =>
  axios.get("/im/unit/contact.htm", { params });

/**
 * 获取未读消息总数
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const fetchMessageCount = (params) =>
  axios.get("/im/chatsession/unreadtotalcount.htm", { params });

/**
 * 获取用户是否是群主
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const fetchIsOwner = (params) =>
  axios.get("/im/chatsession/useridentity.htm", { params });

/**
 * 邀请群成员
 * @param {} params
 */
export const addMember = (params) =>
  axios.post("/im/chatsession/addmember.htm", qs.stringify(params));

/**
 * 删除群成员
 * @param {} params
 */
export const deleteMember = (params) =>
  axios.post("/im/chatsession/deletemember.htm", qs.stringify(params));

/**
 * 案件讨论
 * @param {*} params
 */
export const discussRec = (params) =>
  axios.post("/im/rec/discuss", qs.stringify(params));

/**
 * 获取案件详情
 * @param {*} params
 */
export const fetchRecBySessionID = (params) =>
  axios.get("/im/chatsession/getrecbysession.htm", { params });
