import getRequest from '@/utils/request';
import { Form } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil } from 'lodash';
import React from 'react';
import commonCss from '../../Common/css/CommonCss.less';
import MessageFormProps from './MessageFormInterface';
import moment from 'moment';
type MessageProps = MessageFormProps & RouteComponentProps;

const SHIP_OWNER_AVATAR_PNG = require('../../Image/shipowner_avatar.png');
const SHIPPER_AVATAR_PNG = require('../../Image/shipper_avatar.png');
class MessageDetail extends React.Component<MessageProps> {
  state = {
    currentPage: -1,
    pageSize: -1,
    messages: [
      {
        sendId: 0,
        sendInfo: '',
        sendUserType: 0,
        guid: 0,
        isSend: 0,
        receiveInfo: '',
        type: 0,
        content: '',
        url: '',
        sendTime: '',
        receiveId: 0,
        receiveUserType: 0,
      },
    ],
  };

  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    this.getHistoryMessageList();
  }

  //检索事件
  search() {
    this.getHistoryMessageList();
  }

  //获取表格数据
  getHistoryMessageList() {
    let onlineId = this.props.match.params['onlineId'];
    let serviceId = this.props.match.params['serviceId']
      ? this.props.match.params['serviceId']
      : '';
    let param: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    param.set('type', '1');
    param.set('content', serviceId);
    param.set('currentPage', this.state.currentPage.toString());
    param.set('pageSize', this.state.pageSize.toString());
    getRequest('/sys/chat/message/station/' + onlineId, param, (response: any) => {
      // console.log(response.data.messages);
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            messages: response.data.messages,
          });
        }
      }
    });
  }

  render() {
    let displayResult = [];
    let i = 0;
    let length = this.state.messages.length;
    let serviceId = this.props.match.params['serviceId']
      ? this.props.match.params['serviceId']
      : '';
    for (let messages of this.state.messages) {
      let imgHeadSend = '';
      let sendUserType = messages.sendUserType;
      if (String(sendUserType) === '4') {
        imgHeadSend = SHIPPER_AVATAR_PNG;
      } else if (String(sendUserType) === '5') {
        imgHeadSend = SHIP_OWNER_AVATAR_PNG;
      }
      i = i + 1;
      if (messages.sendInfo === serviceId) {
        i === length
          ? displayResult.push(
              <li>
                <hr
                  style={{
                    borderTop: '2px solid #e5e5e5',
                    width: '40%',
                    display: 'inline',
                    float: 'left',
                  }}
                />
                <span style={{ textAlign: 'center', marginLeft: '6%' }}>
                  {moment(Number(messages.sendTime)).format('YYYY/MM/DD HH:mm:ss')}
                </span>
                <hr
                  style={{
                    borderTop: '2px solid #e5e5e5',
                    width: '40%',
                    display: 'inline',
                    float: 'right',
                  }}
                />
                {messages.isSend!==1?(
                  <div className="chatItem" style={{float:'right'}}>
                  <div className="msg-render" style={{maxWidth:'100%'}} >
                    {messages.content ? <p>{messages.content}</p> : null}
                    {messages.url ? (
                      <img
                        alt="example"
                        style={{ width: '100%', height: '100%', padding: '10px' }}
                        src={messages.url}
                      />
                    ) : null}
                  </div>
                  <div className="userImg">
                    <img src={require('../../Image/shipowner.png')} className="" />
                  </div>
                </div>
                ):(
                  <div className="chatItem">
                  <div className="userImg">
                    <img src={imgHeadSend} className="" />
                  </div>
                  <div className="msg-render" >
                    {messages.content ? <p>{messages.content}</p> : null}
                    {messages.url ? (
                      <img
                        alt="example"
                        style={{ width: '100%', height: '100%', padding: '10px' }}
                        src={messages.url}
                      />
                    ) : null}
                  </div>
                </div>
                )}
              </li>,
            )
          : displayResult.push(
              <li>
                {messages.isSend!==1?(
                  <div className="chatItem" style={{float:'right'}}>
                  <div className="msg-render" style={{maxWidth:'100%'}} >
                    {messages.content ? <p>{messages.content}</p> : null}
                    {messages.url ? (
                      <img
                        alt="example"
                        style={{ width: '100%', height: '100%', padding: '10px' }}
                        src={messages.url}
                      />
                    ) : null}
                  </div>
                  <div className="userImg">
                    <img src={require('../../Image/shipowner.png')} className="" />
                  </div>
                </div>
                ):(
                  <div className="chatItem">
                  <div className="userImg">
                    <img src={imgHeadSend} className="" />
                  </div>
                  <div className="msg-render" >
                    {messages.content ? <p>{messages.content}</p> : null}
                    {messages.url ? (
                      <img
                        alt="example"
                        style={{ width: '100%', height: '100%', padding: '10px' }}
                        src={messages.url}
                      />
                    ) : null}
                  </div>
                </div>
                )}
              </li>,
            );
      } else {
        i === length
          ? displayResult.push(
              <li>
                <hr
                  style={{
                    borderTop: '2px solid #e5e5e5',
                    width: '40%',
                    display: 'inline',
                    float: 'left',
                  }}
                />
                <span style={{ textAlign: 'center', marginLeft: '6%' }}>
                  {moment(Number(messages.sendTime)).format('YYYY/MM/DD HH:mm:ss')}
                </span>
                <hr
                  style={{
                    borderTop: '2px solid #e5e5e5',
                    width: '40%',
                    display: 'inline',
                    float: 'right',
                  }}
                />
                {messages.isSend!==1?(
                  <div className="chatItem" style={{float:'right'}}>
                  <div className="msg-render" style={{maxWidth:'100%'}}>
                    {messages.content ? <p>{messages.content}</p> : null}
                    {messages.url ? (
                      <img
                        alt="example"
                        style={{ width: '100%', height: '100%', padding: '10px' }}
                        src={messages.url}
                      />
                    ) : null}
                  </div>
                  <div className="userImg">
                    <img src={require('../../Image/staff.png')} className="" />
                  </div>
                </div>
                ):(
                  <div className="chatItem">
                  <div className="userImg">
                    <img src={imgHeadSend} className="" />
                  </div>
                  <div className="msg-render" >
                    {messages.content ? <p>{messages.content}</p> : null}
                    {messages.url ? (
                      <img
                        alt="example"
                        style={{ width: '100%', height: '100%', padding: '10px' }}
                        src={messages.url}
                      />
                    ) : null}
                  </div>
                </div>
                )}
              </li>,
            )
          : displayResult.push(
              <li>
                {messages.isSend!==1?(
                  <div className="chatItem" style={{float:'right'}}>
                  <div className="msg-render" style={{maxWidth:'100%'}}>
                    {messages.content ? <p>{messages.content}</p> : null}
                    {messages.url ? (
                      <img
                        alt="example"
                        style={{ width: '100%', height: '100%', padding: '10px' }}
                        src={messages.url}
                      />
                    ) : null}
                  </div>
                  <div className="userImg">
                    <img src={require('../../Image/staff.png')} className="" />
                  </div>
                </div>
                ):(
                  <div className="chatItem">
                  <div className="userImg">
                    <img src={imgHeadSend} className="" />
                  </div>
                  <div className="msg-render" >
                    {messages.content ? <p>{messages.content}</p> : null}
                    {messages.url ? (
                      <img
                        alt="example"
                        style={{ width: '100%', height: '100%', padding: '10px' }}
                        src={messages.url}
                      />
                    ) : null}
                  </div>
                </div>
                )}
              </li>,
            );
      }
    }
    let sty = this.props.sty;
    return (
      <div className={commonCss.container}>
        <div style={sty}>
          <div className="chatBox">
            <div className="layout-right" style={{ width: '100%' }}>
              <div className="chat-wrapper">
                <div className="chat-content" style={{ height: '860px' }}>
                  <ul className="list">{displayResult}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const MessageDetail_Form = Form.create({ name: 'MessageDetail_Form' })(MessageDetail);

export default MessageDetail_Form;
