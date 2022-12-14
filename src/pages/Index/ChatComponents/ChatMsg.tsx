import { MenuModelType } from '@/models/menu';
import JsonUtils from '@/utils/JsonUtils';
import { getRequest, postRequest } from '@/utils/request';
import { Button, Input, message, Modal, notification, Select } from 'antd';
import { MD5 } from 'crypto-js';
import { connect } from 'dva';
import { forEach, isNil } from 'lodash';
import React, { Fragment } from 'react';
import { AnyAction, Dispatch } from 'redux';
import { formatMessage } from 'umi-plugin-react/locale';
import ChatImg from './ChatImg';
import { Content, ReceiveMsg } from './ChatModels';
import { appkey, checkSetLocalStorage, JIM, JIMlogin, getTimestamp, getRandomStr, getMD5Str } from './ChatObject';
import ChatWindow from './ChatWindow';

// 客服头像
const PNG = require('../../Image/kefu.png');
// 默认头像
// 系统消息图像
const SYSPNG = require('../../Image/sysnotice.png');

const DefaultPNG = require('../../Image/shipowner.png');
const SHIP_OWNER_AVATAR_PNG = require('../../Image/shipowner_avatar.png');
const SHIPPER_AVATAR_PNG = require('../../Image/shipper_avatar.png');

const { Option } = Select;

@connect((menuModel: MenuModelType) => ({
  menuModel: menuModel,
}))
class ChatMsg extends React.Component<
{ isShow: boolean; visible: boolean; sty: React.CSSProperties; dispatch?: Dispatch<AnyAction> },
{}
> {

  state = {
    data: [{
      value: '0',
      text: formatMessage({ id: 'UserMenuComponent-ChatMsg.SystemMessage' })//系统消息
    }],  // 搜索框
    value: undefined, // 搜索框
    currentData: {
      value: '',
      text: ''
    }, // 搜索结果
    loading: false,
    visible: false,
    isSending:false,//防止快速发送
    sendMsg: '',  // 发送消息内容
    messages: [],  // 当前聊天对象消息
    chatData: [], // 所有聊天对象数据
    targets: [], // 当前聊天对象一览
    target_username: '', // 当前聊天对象
    target_accountid: '', // 当前聊天对象
    target_li: <Fragment />, // 当前聊天对象
    current: -1, // 左侧聊天对象 高亮index
    target_mymsg: '',
    onlineId: 0,  // 聊天对象关联主键
    msgType: 1, // 消息类型 1文本 2图片
    sysmsgs: [],
    sysUnreads: 0,
    hasSysMsg: false, // 是否有系统消息
    targetUnreads:0,
    imgHead: PNG,
    showSendMsg: false
  };

  // 初期化
  componentDidMount = () => {
    const self = this;
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
      message.loading('Progressing..', 1, () => {
        if (!JIM.isLogin()) {
          JIMlogin();
        }
        // 消息监听
        self.onMsgReceive();
        // 获取聊天对象
        self.getChatTarget();
        // 显示当期聊天对象消息
        // self.changeChatTarget(0, 0);
      }).then(() => message.success(''), () => { });
    }).onFail(function (data: any) {
      console.log('error:' + JSON.stringify(data));
    });
  }

  //TODO 消息提醒
  // hasMessagePush(messages:any){
  //     notification.warning({
  //       message: null,
  //       description:messages,
  //       duration:null,
  //     })
  // };

  // 消息监听
  onMsgReceive = () => {
    const self = this;
    if (!JIM.isLogin()) {
      message.info(formatMessage({ id: 'UserMenuComponent-ChatMsg.loggedAtAnotherLocation' }), 1);
      JIMlogin();
      return;
    }
    // 实时消息监听
    JIM.onMsgReceive(function (data: any) {
      self.getChatTarget();
      // self.hasMessagePush("您有新的消息请注意查收");
      // 获取到所有消息，整理到Contentlist 用于传递给ChatWindow
      forEach((data.messages), (msgItem: ReceiveMsg, index) => {
        checkSetLocalStorage(msgItem);
      });

      // if(当前打开着的窗口就是对应的聊天对象的话)
      if (String(data.messages[0].from_username) === String(self.state.target_username) ||
            String(data.messages[0].from_username)===String(localStorage.getItem("userId") + "_JIM")) {
        self.changeChatTarget(Number(self.state.target_username.split('_')[0]), self.state.onlineId, '');
      }
    });
  }

  // 切换聊天对象 && 展示消息
  changeChatTarget = (target_username: number, onlineId: number, imgHead: string, accountId?: string) => {
    if (target_username === 0) {
      this.setState({showSendMsg: false});
      this.getSystemMsgs();
      return;
    }
    let toMyMsgs = localStorage.getItem(target_username + "_JIM_" + appkey)
    let fromMyMsgs = localStorage.getItem(localStorage.getItem("userId") + "_JIM_" + appkey)
    if (!toMyMsgs && !fromMyMsgs) {
      // 修改聊天对象和聊天内容，以及聊天关联ID
      this.setState({
        target_username: target_username + '_JIM',
        onlineId: onlineId,
        targetUnreads:0,
        sysmsgs: [],
        showSendMsg: true
      })
      return;
    }

    let params: Map<string, string> = new Map();
    params.set('type', '1');
    params.set('currentPage', '-1');
    params.set('pageSize', '-1');
    //查询某用户聊天记录
    getRequest('/sys/chat/' + onlineId, params, (response: any) => {
      if (response.status === 200) {
        this.getChatTarget()
        // this.setState({targetUnreads:0})
      }
    })

    const toMymsgContents: Content[] = JsonUtils.stringToJson(String(toMyMsgs));
    const fromMymsgContents: Content[] = JsonUtils.stringToJson(String(fromMyMsgs));

    let paramContents: Content[] = [];

    // 对方发给我的
    forEach((toMymsgContents), (msg: Content, index) => {
      if ((String(msg.from_id) === String(target_username + '_JIM') &&
        String(msg.target_id) === String(localStorage.getItem("userId") + "_JIM"))) {
        paramContents.push(msg);
      }
    })

    // 我发给对方的
    forEach((fromMymsgContents), (msg: Content, index) => {
      if ((String(msg.from_id) === String(localStorage.getItem("userId") + "_JIM") &&
        String(msg.target_id) === String(target_username + '_JIM'))) {
        paramContents.push(msg);
      }
    })

    paramContents = this.orderMsgs(paramContents);

    // 修改聊天对象和聊天内容，以及聊天关联ID
    let imgHeadState = this.state.imgHead;
    if (imgHead !== '') {
      imgHeadState = imgHead
    }
    this.setState({
      messages: paramContents,
      target_username: target_username + '_JIM',
      onlineId: onlineId,
      target_accountid: accountId ? accountId : this.state.target_accountid,
      sysmsgs: [],
      targetUnreads:0,
      imgHead: imgHeadState,
      showSendMsg: true
    })
  }

  // 根据消息时间排序
  orderMsgs = (paramContents: Content[]) => {
    const len = paramContents.length;
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        let createtimepre = paramContents[j].create_time;
        let createtimenext = paramContents[j + 1].create_time;
        if (createtimepre.toString().length === 10) {
          createtimepre = Number(createtimepre + '000');
        }
        if (createtimenext.toString().length === 10) {
          createtimenext = Number(createtimenext + '000');
        }
        if (createtimepre > createtimenext) {// TODO 统一按照ctime_ms排序
          let temp = paramContents[j + 1];
          paramContents[j + 1] = paramContents[j];
          paramContents[j] = temp;
        }
      }
    }
    return paramContents;
  }

  // 获取系统消息
  getSystemMsgs = (flag?:number) => {
    // 参数定义
    let param: Map<string, string> = new Map();
    param.set('type','1');
    param.set('currentPage','-1');
    param.set('pageSize','-1');
    let getData: any[] = [];
    let unreads = 0;
    getRequest('/sys/chat/message/system', param, (response) => {
      if (response.status === 200) {
        forEach(response.data.list, (item, index) => {
          getData.push(item);
          unreads = unreads + (item.isRead===1?0:1);
          // if(item.isRead===0){
          //   this.hasMessagePush(item.content)
          // }
        })
        if(flag===1){
          this.setState({
            sysUnreads: unreads
          })
        }else{
          this.setState({
            sysmsgs: getData.sort(function(a,b){
              return a.sendTime - b.sendTime;
            }),
            sysUnreads: unreads,
            target_accountid:formatMessage({ id: 'UserMenuComponent-ChatMsg.SystemMessage' })
          })
        }
      }
    });
  }

  // 控制聊天对象选中样式
  getHoverIndex = (e: any) => {
    const _this = this;
    const ul_menu = e.currentTarget;

    const li_list = !isNil(ul_menu) ? ul_menu.getElementsByTagName("li") : [];
    for (let i = 0, len = li_list.length; i < len; i++) {
      li_list[i].className = '';
      li_list[i].index = i;
      li_list[i].onclick = function () {
        _this.setState({
          current: this.index,
        });
      }
      if (this.state.current > -1) {
        li_list[this.state.current].className = 'active';
      }
    }
  }

  // 输入需要发送的消息
  onChangeBindMsgBox = (e: any) => {
    this.setState({
      sendMsg: e.target.value
    })
  }

  // 发送消息
  sendMsg = () => {

    if(this.state.isSending){
      return;
    }

    if(isNil(this.state.sendMsg)
      || this.state.sendMsg===''
      ||this.state.sendMsg.replace(new RegExp('\n', 'g'), '')===''
      ||this.state.sendMsg.replace(new RegExp('\n', 'g'), '').replace(new RegExp(' ', 'g'), '')===''
    ){
      message.error(formatMessage({ id: 'UserMenuComponent-ChatMsg.input-text' }), 1);
      this.state.sendMsg='';
      return;
    }
    if(isNil(this.state.target_username)|| this.state.target_username===''){
      message.error(formatMessage({ id: 'UserMenuComponent-ChatMsg.choose-chat-object' }), 1);
      return;
    }
    const self = this;
    const mymsg = this.state.sendMsg;
    if (!JIM.isLogin()) {
      message.info(formatMessage({ id: 'UserMenuComponent-ChatMsg.loggedAtAnotherLocation' }), 1);
      JIMlogin();
      return;
    }

    self.state.isSending=true;
    const sendSingleMessage = function(){
      JIM.sendSingleMsg({
      'target_username': self.state.target_username,
      'target_nickname':String(localStorage.getItem("accountId")),
      'content': self.state.sendMsg,
      'need_receipt': true
    }).onSuccess(function (data: any) {
      console.log('onSuccess')

      self.state.isSending=false;
      const from_username = localStorage.getItem("userId") + "_JIM";
      let mycontent: Content = {
        ctime_ms: data.ctime_ms,
        create_time: data.ctime_ms,
        from_id: from_username,
        from_name: from_username,
        target_id: self.state.target_username,
        msg_body: {
          text: mymsg
        },
        msg_type: 'mytemp' // 临时数据 用完需要清理
      };

      let msgItem: ReceiveMsg = {
        from_username: from_username,
        content: mycontent
      };
      checkSetLocalStorage(msgItem);
      self.changeChatTarget(Number(self.state.target_username.split('_')[0]), self.state.onlineId, '');
      // 发送API新增一条消息
      self.creatMsgOnBackEnd(mycontent);

      self.setState({
        sendMsg: '',
      })
    }).onFail(function (data: any) {
      self.state.isSending=false;
      message.error(formatMessage({ id: 'UserMenuComponent-ChatImg.Messagefailed' }));
    })
  }

    JIM.updateSelfInfo({
      'nickname' : String(localStorage.getItem("accountId"))
    }).onSuccess(function(data) {
      console.log('nickname')
      sendSingleMessage();
      console.log('sendSingleMessage')
    }).onFail(function(data) {
      sendSingleMessage();
    });
  }

  creatMsgOnBackEnd = (content: Content) => {
    const requestBody = {
      onlineId: this.state.onlineId,
      userId: localStorage.getItem("userId"),
      content: this.state.sendMsg,
      url: "",
      type: 1,
      sendTime: content.create_time,
      msgType: this.state.msgType
    }

    postRequest('/sys/chat/', JsonUtils.jsonToString(requestBody), (response: any) => {
      if (response.status !== 200) { message.error(formatMessage({ id: 'UserMenuComponent-ChatMsg.MessageCenterFailed' })); }
    });
  }

  // 获取聊天对象
  getChatTarget = () => {
    // 参数定义
    let param: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    param.set('type', '1');
    let targetsList: JSX.Element[] = [];
    let imgHead = PNG;
    let userTypes = localStorage.getItem('userType');
    console.log(userTypes)
    const data: { value: any; text: any; }[] = [];
    if(userTypes != '2' ){
      getRequest('/sys/chat/list', param, (response: any) => {
        console.log(response)
        if (response.status === 200) {
          let target_accountid = this.state.target_accountid;
          let default_target_accountid = '';
          forEach(response.data.msgList, (target, index) => {
            if (target_accountid === '' && Number(index) === 0) {
              default_target_accountid = target.accountId;
            } else {
              default_target_accountid = target_accountid;
            }
            if (String(target.userType) === '4') {
              imgHead = SHIPPER_AVATAR_PNG;
            } else if (String(target.userType) === '5') {
              imgHead = SHIP_OWNER_AVATAR_PNG;
            } else if (String(target.userType) !== '1' && String(target.userType) !== '3' && String(target.userType) !== '2') {
              imgHead = DefaultPNG;
            }
            target.imgHead = imgHead;
            // let count = 0;
            // const unReadMsg = localStorage.getItem(appkey + target.userId + '_JIM');
            // if (unReadMsg) {
            //   count = JsonUtils.stringToJson(String(unReadMsg)).unread_msg_count;
            // }
            this.setState({
              //聊天对象未读消息
              targetUnreads:target.unReadCounts
            },()=>{
              targetsList.push(<li key={target.userId}
                onClick={(e) => this.changeChatTarget(target.userId, target.guid, target.imgHead, target.accountId)}>
                <div className="personBg">
                  <div className="avatarImg">
                    {this.state.targetUnreads === 0 ? '' : <span className="newsNumber">{this.state.targetUnreads}</span>}
                    <img src={imgHead} className="" />
                  </div>
                  <div className="content">
                    <p className="personName">{target.accountId}</p>
                    <p className="chatMessgae"> {target.latestMessage}</p>
                  </div>
                </div>
              </li>)
              data.push({
                value: target.userId,
                text: target.accountId,
              })
            })
          });
          if(response.data.isSysMsg){
            this.getSystemMsgs(1);
            if (target_accountid === '') {
              // 默认无需赋值
              // default_target_accountid = formatMessage({ id: 'UserMenuComponent-ChatMsg.SystemMessage' });
            } else {
              default_target_accountid = target_accountid;
            }
          }
          this.setState({
            data: data,
            target_li: targetsList,
            hasSysMsg: response.data.isSysMsg,
            target_accountid: default_target_accountid
          })
        }
      });
    }else{
      getRequest('/sys/chat/xxlist', param, (response: any) => {
        console.log(response)
        if (response.status === 200) {
          let target_accountid = this.state.target_accountid;
          let default_target_accountid = '';
          forEach(response.data.msgList, (target, index) => {
            if (target_accountid === '' && Number(index) === 0) {
              default_target_accountid = target.accountId;
            } else {
              default_target_accountid = target_accountid;
            }
            if (String(target.userType) === '4') {
              imgHead = SHIPPER_AVATAR_PNG;
            } else if (String(target.userType) === '5') {
              imgHead = SHIP_OWNER_AVATAR_PNG;
            } else if (String(target.userType) !== '1' && String(target.userType) !== '3' && String(target.userType) !== '2') {
              imgHead = DefaultPNG;
            }
            target.imgHead = imgHead;
            // let count = 0;
            // const unReadMsg = localStorage.getItem(appkey + target.userId + '_JIM');
            // if (unReadMsg) {
            //   count = JsonUtils.stringToJson(String(unReadMsg)).unread_msg_count;
            // }
            this.setState({
              //聊天对象未读消息
              targetUnreads:target.unReadCounts
            },()=>{
              targetsList.push(<li key={target.userId}
                onClick={(e) => this.changeChatTarget(target.userId, target.guid, target.imgHead, target.accountId)}>
                <div className="personBg">
                  <div className="avatarImg">
                    {this.state.targetUnreads === 0 ? '' : <span className="newsNumber">{this.state.targetUnreads}</span>}
                    <img src={imgHead} className="" />
                  </div>
                  <div className="content">
                    <p className="personName">{target.accountId}</p>
                    <p className="chatMessgae"> {target.latestMessage}</p>
                  </div>
                </div>
              </li>)
              data.push({
                value: target.userId,
                text: target.accountId,
              })
            })
          });
          if(response.data.isSysMsg){
            this.getSystemMsgs(1);
            if (target_accountid === '') {
              // 默认无需赋值
              // default_target_accountid = formatMessage({ id: 'UserMenuComponent-ChatMsg.SystemMessage' });
            } else {
              default_target_accountid = target_accountid;
            }
          }
          this.setState({
            data: data,
            target_li: targetsList,
            hasSysMsg: response.data.isSysMsg,
            target_accountid: default_target_accountid
          })
          console.log(this.state.data)
        }
      });
    }


  }

  // 点击显示弹出框，同时修改dva状态
  showModal = () => {
    if (this.props.dispatch) {
      this.props.dispatch({
        type: 'menu/changeShowChat', // menu modal里面的changeShowChat方法
        payload: {
          isShow: this.props.isShow,
          visible: true,
        },
      });
    }
  };

  // 关闭弹出框
  handleCancel = () => {
    if (this.props.dispatch) {
      this.props.dispatch({
        type: 'menu/changeShowChat',
        payload: {
          isShow: this.props.isShow,
          visible: false,
        },
      });
    }
  };

  fetch = (value: string, type: number) => {
    let searchResult: { value: string; text: string; }[] = [];
    let targetsList: any[] = [];
    forEach((this.state.data), (data, index) => {
      //根据text搜索
      if (type === 1) {
        if (data.text.includes(value)) {
          searchResult.push(data);
        }
        //根据code搜索
      } else {
        if (String(data.value) === value) {
          searchResult.push(data);
        }
      }
    });
    if (searchResult.length > 0) {
      this.setState({
        data: searchResult
      });
    }

    forEach((this.state.target_li), (li, index) => {
      forEach((searchResult), (result, index) => {
        if (String(li.key) === String(result.value)) {
          targetsList.push(li);
        }
      })
    })
    this.setState({
      target_li: targetsList
    });
  }
  // 搜索框
  handleSearch = (value: string) => {
    if (value) {
      this.fetch(value, 1);
    } else {
      this.getChatTarget();
    }
  };
  // 搜索框change
  handleChange = (value: string) => {
    if (value) {
      this.fetch(value, 2);
    } else {
      this.getChatTarget();
    }
    this.setState({ value });
  };

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.ctrlKey && e.keyCode === 13) {
      this.sendMsg();
   }
  }

  render() {
    let sty = this.props.sty;

    const { visible } = this.props;

    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);

    return (
      <div style={sty}>
        <Button onClick={this.showModal}>{this.state.target_accountid ? this.state.target_accountid : formatMessage({ id: 'UserMenuComponent-ChatMsg.SystemMessage' })}</Button>
        <Modal
          visible={visible}
          title={formatMessage({ id: 'UserMenuComponent-ChatMsg.OnlineConsultation' })}
          onCancel={this.handleCancel}
          footer={null}
          width="86%"
          style={{ margin: '0 2% 0 12%', top: '40px' }}
          className="chatModal"
        >
          <div className="chatBox">
            <div className="layout-left">
              <div className="searchBox">
                <Select
                  showSearch
                  value={this.state.value}
                  allowClear={true}
                  placeholder={formatMessage({ id: 'UserMenuComponent-ChatMsg.search' })}
                  defaultActiveFirstOption={false}
                  style={{ width: '90%' }}
                  showArrow={false}
                  filterOption={false}
                  onSearch={this.handleSearch}
                  onChange={this.handleChange}
                  notFoundContent={null}
                >
                  {options}
                </Select>
                {/* <Input className="searchInput" placeholder={formatMessage({ id: 'UserMenuComponent-ChatMsg.search' })} /> */}
              </div>
              <div className="personList">
                <ul id='target-list' onMouseOver={(e) => this.getHoverIndex(e)}>
                  {this.state.hasSysMsg ? <li onClick={(e) => this.changeChatTarget(0, 0, '')}>
                    <div className="personBg">
                      <div className="avatarImg">
                        {this.state.sysUnreads > 0 ? <span className="newsNumber">{this.state.sysUnreads}</span> : ''}
                        <img src={SYSPNG} className="" />
                      </div>
                      <div className="content">
                        <p className="personName">{formatMessage({ id: 'UserMenuComponent-ChatMsg.SystemMessage' })}</p>
                        <p className="chatMessgae"></p>
                      </div>
                    </div>
                  </li> : ''}
                  {this.state.target_li}
                </ul>
              </div>
            </div>
            <div className="layout-right">
              <div className="chat-wrapper">
                <ChatWindow sysmsgs={this.state.sysmsgs} myself={localStorage.getItem("userId") + "_JIM"} msgs={this.state.messages} headPng={this.state.imgHead} targetUser={this.state.target_accountid}/>
                {this.state.showSendMsg ? <div className="imput-msg">
                  <div className="toolbox">
                    <ChatImg changeChatTarget={this.changeChatTarget.bind(this)} onlineId={this.state.onlineId} JIM={JIM} target_name={this.state.target_username} />
                    <ChatImg changeChatTarget={this.changeChatTarget.bind(this)} onlineId={this.state.onlineId} JIM={JIM} target_name={this.state.target_username} />
                  </div>
                  <Input.TextArea onChange={(e) => this.onChangeBindMsgBox(e)} value={this.state.sendMsg} onKeyUp={this.keyUp} maxLength={512}></Input.TextArea>
                  <Button htmlType="submit" className="send" block onClick={this.sendMsg} >
                    {formatMessage({ id: 'UserMenuComponent-ChatMsg.Send' })}
                  </Button><span style={{float:'right',marginTop:'5px'}}>(&nbsp;Ctrl+Enter&nbsp;)&nbsp;&nbsp;</span>
                </div> : ''}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state: { menu: { isShow: boolean; visible: boolean } }) {
  const { isShow, visible } = state.menu;
  return {
    isShow,
    visible,
  };
}

export default connect(mapStateToProps)(ChatMsg);
