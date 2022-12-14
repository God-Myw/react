import JsonUtils from "@/utils/JsonUtils";
import { message } from "antd";
import { MD5 } from "crypto-js";
import { forEach } from "lodash";
import moment from "moment";
import { Content, ConversationContent, ConversationMsg, ReceiveMsg } from "./ChatModels";
import { formatMessage } from 'umi-plugin-react/locale';

// Jmessage引入
const JMessage = require('../../../assets/jmessage-sdk-web.2.6.0.min.js')

export let JIM = new JMessage({
    // debug: true
});
const JIMPwd = '123456';

const effective_time = 30 * 24 * 60 * 60 * 1000 // 只获取24小时以内的离线数据

// secret key
// export const secret = "d26166cf0653da7fd9ab8c4b";  //测试用
export const secret = "a948bb3fb0ab4a491f386a97";

// app key
// export const appkey = "468f7c6d2efab233e8c9a9b4";  //测试用
export const appkey = "0373d3c9edd6b80f91070926";

// 消息体
export const GetJIMObj = () => {

    if (JIM.isInit() && JIM.isLogin()) {
        JIM.loginOut();
    }
    initJmessage();
    // const initJIM = initJmessage;
    JIM.onDisconnect(function () {
        JIM = new JMessage({});
        message.info(formatMessage({ id: 'UserMenuComponent-ChatObject.InstantMessagingDisconnected' }));
        // 重新初期化
        initJmessage();
    });
}

// 更新localstorage 消息体
export const checkSetLocalStorage = async (msgItem: any) => {
    let localData = localStorage.getItem(msgItem.content.from_id + "_" + appkey);
    let saveData: Content[] = [];

    if (localData) {
        let existdata: Content[] = JsonUtils.stringToJson(String(localData));
        if (existdata) {
            forEach((existdata), async (existContent, index) => {
                let createtime = existContent.create_time;
                if (createtime.toString().length === 10) {
                    createtime = Number(createtime + '000');
                }
                if (createtime + effective_time < getTimestamp()) {
                    return;
                }
                if (existContent.create_time === msgItem.content.create_time ||
                    (existContent.ctime_ms === msgItem.ctime_ms && msgItem.content.msg_type != 'mytemp')) {
                    // 已经存在
                    return;
                }

                saveData.push(existContent);
            })
            // 已经存在则不追加
            saveData.push(msgItem.content)
        }
        window.localStorage.setItem(msgItem.content.from_id + "_" + appkey,
            JsonUtils.mapToJson(JsonUtils.objToStrMap(saveData)));
    } else {
        saveData.push(msgItem.content);
        window.localStorage.setItem(msgItem.content.from_id + "_" + appkey,
            JsonUtils.mapToJson(JsonUtils.objToStrMap(saveData)));
    }
}

// login
export const JIMlogin = () => {
    // login Jmessage
    JIM.login({
        'username': localStorage.getItem("userId") + "_JIM",
        'password': JIMPwd
    }).onSuccess(function (data: any) {
        message.success(formatMessage({ id: 'UserMenuComponent-ChatObject.InstantMssagingSucceeded' }), 1);
        onReceivMessage();
    }).onFail(function (data: any) {
        const userId = localStorage.getItem("userId");
        if (data.code === 880103 && userId) {// 没有账户，需要注册
            JIMregister();
            initJmessage();
        } else if (data.code === 880107) {
            // do nothing 重复login
        } else {
            console.log('error:' + JSON.stringify(data));
            // message.error(formatMessage({ id: 'UserMenuComponent-ChatObject.InstantMssagingFailed' }));
        }
    });
}

const initJmessage = () => {
    const random_str = getRandomStr();
    const timestamp = getTimestamp();
    const mdstr = getMD5Str(random_str, timestamp);
    const signature = MD5(mdstr).toString() // TODO 需要改成后台生成

    // 初始化
    JIM.init({
        "appkey": appkey,
        "random_str": random_str,
        "signature": signature,
        "timestamp": timestamp,
        "flag": 1
    }).onSuccess(function (data: any) {
        JIMlogin();
    }).onFail(function (data: any) {
        console.log('error:' + JSON.stringify(data));
    });
}
// Jmessage账号注册
const JIMregister = () => {
    JIM.register({
        'username': localStorage.getItem("userId") + "_JIM",
        'password': JIMPwd,
    }).onSuccess(function (data: any) {
        // message.success("即时聊天服务接入成功！", 1);
    }).onFail(function (data: any) {
        // message.error("即时聊天服务接入失败！");
    });
}
const onReceivMessage = () => {
    if (!JIM.isLogin()) {
        message.info(formatMessage({ id: 'UserMenuComponent-ChatMsg.loggedAtAnotherLocation' }), 1);
        JIMlogin();
        return;
    }
    // 离线消息监听
    JIM.onSyncConversation(function (data: ConversationMsg[]) {
        // console.log(data);
        // 获取到所有消息，整理到Contentlist 用于传递给ChatWindow
        forEach((data), (msgItem: ConversationMsg, index) => {
            forEach((msgItem.msgs), (msgItem: ConversationContent, index) => {
                checkSetLocalStorage(msgItem);
            });
        });
    });
    // 实时消息监听
    JIM.onMsgReceive(function (data: any) {
        // console.log(data);
        // 获取到所有消息，整理到Contentlist 用于传递给ChatWindow
        forEach((data.messages), (msgItem: ReceiveMsg, index) => {
            checkSetLocalStorage(msgItem);
        });
    });

    //消息已读数变更事件实时监听
    JIM.onMsgReceiptChange(function(data: any){
        console.log('消息已读数变更事件实时监听 : ' + JSON.stringify(data));
    });
    //消息已读数变更事件同步监听
    JIM.onSyncMsgReceipt(function(data: any){
        console.log('消息已读数变更事件同步监听 : ' + JSON.stringify(data));
    });
    //会话未读数变更监听（多端在线）
    JIM.onMutiUnreadMsgUpdate(function(data: any){
        console.log('会话未读数变更监听（多端在线） : ' + JSON.stringify(data));
    });
    //消息透传监听
    JIM.onTransMsgRec(function(data: any){
        console.log('消息透传监听 : ' + JSON.stringify(data));
    });
}

// 获取当前时间戳
export const getTimestamp = () => {
    return moment(new Date()).valueOf();
}

// 获取随机数字符串
export const getRandomStr = () => {
    return Math.random().toString(36);
}

// 获取MD5字符串
export const getMD5Str = (random_str: string, timestamp: number) => {
    return "appkey=" + appkey + "&timestamp=" + timestamp + "&random_str=" + random_str + "&key=" + secret;
}