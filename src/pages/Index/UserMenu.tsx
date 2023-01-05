import { MenuModelType } from '@/models/menu';
import { getRequest } from '@/utils/request';
import { Modal, notification, message, Icon, Button } from 'antd';
import { connect } from 'dva';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import { AnyAction, Dispatch } from 'redux';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { GetJIMObj } from './ChatComponents/ChatObject';
import './Index.less';

const { confirm } = Modal;
let isopen = false;
let websocket_connected_count = 0;
let tryTime = 0;
const icon: any = require('../../pages/Image/MenuIcon/msgnotice.png');
const notice_pic: any = require('../../pages/Image/notice_pic.png');
let websocket: any = null;
let unReadMsgInterval: any = null;

interface fathers {
  guid: number;
  needAuthen: number;
  funcModel: number;
  menuType: number;
  parentId: number;
  menuName: string;
  menuIcon: string;
  menuUrl: string;
  childList: fathers[];
}
interface MenuListState {
  webService: fathers[];
  webSearch: fathers[];
  modalVisible: boolean;
  content: string;
  status: string;
  title: string;
}

interface Models {
  isShow: boolean;
  visible: boolean;
}

type MenuModelProps = Models & RouteComponentProps;

@connect((menuModel: MenuModelType) => ({
  menuModel: menuModel,
}))
class IndexMenu extends React.Component<
  MenuModelProps & { dispatch?: Dispatch<AnyAction> },
  MenuListState
> {
  constructor(props: MenuModelProps) {
    super(props);
  }

  private localAuthStatus: string = '';
  private localUserType: string = '';
  private localPayStatus: string = '';

  // private ws_url: string = 'ws://172.19.15.152:8011/websocket/websocket/' + String(localStorage.getItem('token')).replace(/-/g,"");//  本地调试使用websocket
  private ws_url: string =
    'ws://58.33.34.10:10443/ws/' + String(localStorage.getItem('token')).replace(/-/g, ''); //  线上使用websocket

  componentDidMount() {
    localStorage.currentPage = 1
    let param: Map<string, any> = new Map();
    param.set('type', '1');
    getRequest(`/sys/user/${localStorage.getItem('userId')}`, param, response => {
      if (response.status === 200) {
        localStorage.setItem('payStatus', JSON.stringify(response.data.user.payStatus));
        localStorage.setItem('checkStatus', JSON.stringify(response.data.user.checkStatus));
        localStorage.setItem('userType', JSON.stringify(response.data.user.userType));
        this.localAuthStatus = JSON.stringify(response.data.user.checkStatus);
        this.localUserType = JSON.stringify(response.data.user.userType);
        this.localPayStatus = JSON.stringify(response.data.user.payStatus);
      }
      const { history }: any = this.props;
      let needPmiTitle = '';
      let needPmiContent = '';
      let markStyle = {};
      let pushUrl = '';

      if (!isopen) {
        if (this.localAuthStatus !== '2') {
          var box = document.getElementsByTagName('li')[4];
          const position = box.getBoundingClientRect();
          needPmiTitle = formatMessage({ id: 'Index-UserMenu.welcome' });
          needPmiContent = formatMessage({ id: 'Index-UserMenu.authentication' });
          markStyle = {
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
            opacity: 0.9,
            border: '3px dashed white',
          };
          pushUrl = '/profile_certification/0';
        } else if (this.localPayStatus !== '1' && this.localPayStatus !== '2') {
          needPmiTitle = formatMessage({ id: 'Index-UserMenu.thanks' });
          needPmiContent = formatMessage({ id: 'Index-UserMenu.pay' });
          markStyle = { opacity: 0 };
          if (this.localUserType === '4') {
            pushUrl = '/depositpayment';
          } else if (this.localUserType === '5') {
            pushUrl = '/depositpaymentowner';
          }
        }
        if (
          (this.localAuthStatus !== '2' ||
            (this.localPayStatus !== '1' && this.localPayStatus !== '2')) &&
          (this.localUserType === '4' || this.localUserType === '5')
        ) {
          confirm({
            title: needPmiTitle,
            content: needPmiContent,
            okText: formatMessage({ id: 'Index-UserMenu.confirm' }),
            cancelText: formatMessage({ id: 'Index-UserMenu.cancel' }),
            maskClosable: false,
            icon: null,
            centered: true,
            mask: true,
            maskStyle: markStyle,
            onOk() {
              history.push(pushUrl);
            },
            onCancel() {
              // 什么都不做
            },
          });
          isopen = true;
        }
      }
    });
    GetJIMObj(); // 初期化Jmessage连接
    // this.getUnReadMsgs();
    this.initData();
    this.newWebSocket();
    if (!unReadMsgInterval) {
      unReadMsgInterval = setInterval(this.getUnReadMsgs, 5000);
    }
  }

  // websocket连接
  newWebSocket() {
    var self = this;
    // 判断当前环境是否支持websocket
    // console.log('new==>');
    if (window.WebSocket) {
      console.log('window.WebSocket');
      if (!websocket || websocket.readyState == 3) {
        console.log('!websocket');
        websocket = new WebSocket(this.ws_url);
      }
    } else {
      message.error(formatMessage({ id: 'Index-UserMenu.no.support.websocket' }), 2);
    }

    // 连接成功建立的回调方法
    websocket.onopen = function (e: any) {
      console.log('连接成功');
      tryTime = 0;
      heartCheck.reset().start(); // 成功建立连接后，重置心跳检测
    };
    // 连接发生错误，连接错误时会继续尝试发起连接（尝试5次）
    websocket.onerror = function (e: any) {
      websocket.close();
      console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean);
      console.log(e);
      websocket_connected_count++;
      if (websocket_connected_count <= 5) {
        self.newWebSocket();
      }
    };
    // 接受到消息的回调方法
    websocket.onmessage = function (e: any) {
      heartCheck.reset().start(); // 如果获取到消息，说明连接是正常的，重置心跳检测
      var message = e.data;
      if (message && message != 'true') {
        message = JSON.parse(message);
        // console.log(message)
        if (message.type === 2) {
          let params = message.params;
          let content = '';
          let title = '';
          let status = '';
          switch (params) {
            case 1:
              content = formatMessage({ id: 'Index-UserMenu.shipowner.certification.success' });
              title = formatMessage({ id: 'Index-UserMenu.Authenticated' });
              status = '1';
              break;
            case 2:
              content = formatMessage({ id: 'Index-UserMenu.Shipper.certification.success' });
              title = formatMessage({ id: 'Index-UserMenu.Authenticated' });
              status = '1';
              break;
            case 3:
              content = formatMessage({ id: 'Index-UserMenu.shipowner.payment.success' });
              title = formatMessage({ id: 'Index-UserMenu.Margin.paid.success' });
              status = '2';
              break;
            case 4:
              content = formatMessage({ id: 'Index-UserMenu.Shipper.payment.success' });
              title = formatMessage({ id: 'Index-UserMenu.Margin.paid.success' });
              status = '2';
              break;
            default:
              content = '';
          }
          self.setState(
            {
              modalVisible: true,
              content: content,
              status: status,
              title: title,
            },
            () => {
              localStorage.setItem('checkStatus', '2');
              if (status === '2') {
                localStorage.setItem('payStatus', '1');
              }
            },
          );
        } else {
          //执行接收到消息的操作 右上角通知
          notification.open({
            message: message.title,
            description: message.content,
            duration: 5,
            icon: (
              <Icon
                component={() => (
                  <img style={{ width: '22px', display: 'flex' }} src={icon} alt="icon" />
                )}
              ></Icon>
            ),
          });
        }
      }
    };

    // 接受到服务端关闭连接时的回调方法
    websocket.onclose = function (e: any) {
      console.log('onclose断开连接' + e.code + ' ' + e.reason + ' ' + e.wasClean);
      // 重试10次，每次之间间隔10秒
      if (tryTime < 10) {
        console.log('重连....');
        setTimeout(function () {
          tryTime++;
          self.newWebSocket();
        }, 3 * 1000);
      } else {
        console.log('重连失败');
      }
    };
    // 监听窗口事件，当窗口关闭时，主动断开websocket连接，防止连接没断开就关闭窗口，server端报错
    window.onbeforeunload = function () {
      websocket.close();
    };

    // 心跳检测, 每隔一段时间检测连接状态，如果处于连接中，就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连。
    var heartCheck = {
      timeout: 540000,
      serverTimeoutObj: null,
      reset: function () {
        // clearTimeout(this.timeout);
        clearTimeout(this.serverTimeoutObj);
        return this;
      },
      start: function () {
        this.serverTimeoutObj = setTimeout(function () {
          console.log(websocket.readyState);
          if (websocket.readyState == 1) {
            console.log('连接状态，发送消息保持连接');
            websocket.send('true');
            heartCheck.reset().start(); // 如果获取到消息，说明连接是正常的，重置心跳检测
          } else {
            console.log('断开状态，尝试重连');
            self.newWebSocket();
          }
        }, this.timeout);
      },
    };
  }

  // 获取未读消息数
  getUnReadMsgs = () => {
    // 参数定义
    let params: Map<string, string> = new Map();
    params.set('type', '1');
    // 系统消息未读数
    let counts = 0;
    //查询未读消息数量
    getRequest('/sys/chat/counts', params, response => {
      if (!isNil(response) && response.status === 200) {
        counts = counts + response.data.unReadCounts;
        if (this.props.dispatch) {
          this.props.dispatch({
            type: 'menu/counter',
            payload: {
              unreadCount: counts,
            },
          });
        }
      }
    });
  };

  //获取menu一览
  initData = () => {
    let params: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录

    getRequest('/sys/menu', params, (response: any) => {
      if (response.status === 200) {
        this.setState({
          webService: response.data.webService,
          webSearch: response.data.webSearch,
          modalVisible: false,
          status: '',
        });
      }
    });
    params.set('type', '1');
    // 缓存获取字典一览
    getRequest('/sys/dict/all', params, (response: any) => {
      if (response.status === 200) {
        localStorage.setItem('dictData', JSON.stringify(response.data));
      }
    });
  };

  // 跳保证金页面
  goDepositpayment() {
    let pushUrl = '';
    // console.log(this.localUserType)
    if (this.localUserType === '4') {
      pushUrl = '/depositpayment';
    } else if (this.localUserType === '5') {
      pushUrl = '/depositpaymentowner';
    }
    this.props.history.push(pushUrl);
  }

  goPage() {
    let pushUrl = '';
    if (this.localUserType === '4') {
      // 货主--->  货盘发布页面
      pushUrl = '/pallet';
    } else if (this.localUserType === '5') {
      // 船东--->  首页
      pushUrl = '/index';
    }
    this.props.history.push(pushUrl);
  }

  onClick() {
    const { status } = this.state;
    if (status === '1') {
      this.goDepositpayment();
    } else {
      this.goPage();
    }
  }

  render() {
    const webServiceElements: JSX.Element[] = [];
    const webSearchElements: JSX.Element[] = [];
    // 在线业务
    let webService = !this.state || !this.state.webService ? [] : this.state.webService;
    // 在线查询
    let webSearch = !this.state || !this.state.webSearch ? [] : this.state.webSearch;

    let authStatus = false;
    // div 背景色
    let divStyle = {};
    // 认证文言
    let spanStyle = {};
    // 点击事件
    let clickEvent = () => { };
    // 在线业务
    let eachMenu: JSX.Element[] = [];
    forEach(webService, (menu, key) => {
      authStatus = false;
      // 需要认证，去判断用户是否认证
      if (menu.needAuthen === 1 && (this.localUserType === '4' || this.localUserType === '5')) {
        if (menu.menuName === '保证金' || menu.menuName === 'Cash deposit') {
          authStatus = this.localAuthStatus === '2';
        } else {
          authStatus = this.localAuthStatus === '2' && this.localPayStatus === '1';
        }
      } else {
        authStatus = true;
      }

      // if (menu.needAuthen === 1 && (this.localUserType === '4' || this.localUserType === '5')) {
      //   authStatus = this.localAuthStatus === '2' && this.localPayStatus === '1';
      // } else {
      //   authStatus = true;
      // }
      // if (menu.menuName === '保证金' || menu.menuName === 'Cash deposit') {
      //   authStatus = this.localAuthStatus === '2';
      // }

      // div 背景色
      divStyle = authStatus ? {} : { background: 'rgba(20,64,95,1)' };
      // 认证文言
      spanStyle = authStatus ? (
        ''
      ) : (
        <a
          style={{
            fontSize: '18px',
            fontFamily: 'PingFang SC',
            marginTop: '70px',
            width: '100%',
            height: '100%',
          }}
        >
          <FormattedMessage id="Index-UserMenu.after.certification" />
        </a>
      );
      clickEvent = authStatus
        ? () => {
          menu.menuUrl == '/qrCodeUpload'
            ? this.props.history.push('/ShipTrading')
            : this.props.history.push(menu.menuUrl);
        }
        : () => {
          ('javascript:void(0)');
        };
      eachMenu.push(
        <div key={key} className="noNeedAuth" onClick={clickEvent} style={divStyle}>
          <img className="img" src={menu.menuIcon} />
          <a> {menu.menuName == '二维码上传' ? '船舶交易' : menu.menuName}</a>
          {spanStyle}
        </div>,
      );
    });

    webServiceElements.push(
      <div key={99} id="areaOne">
        <p className="funcModelName">
          <FormattedMessage id="Index-UserMenu.online.business" />
        </p>
        {eachMenu}
      </div>,
    );
    // div 背景色
    divStyle = {};
    // 认证文言
    spanStyle = {};
    // 在线查询
    eachMenu = [];
    forEach(webSearch, (menu, key) => {
      // console.log(menu);
      // console.log(key);
      authStatus = false;
      //需要认证，去判断用户是否认证
      if (menu.needAuthen === 1 && (this.localUserType === '4' || this.localUserType === '5')) {
        authStatus = this.localAuthStatus === '2' && this.localPayStatus === '1';
      } else {
        authStatus = true;
      }

      if (menu.menuName === '保证金' || menu.menuName === 'Cash deposit') {
        authStatus = this.localAuthStatus === '2';
      }
      // div 背景色
      divStyle = authStatus ? {} : { background: 'rgba(20,64,95,1)' };
      // 认证文言
      spanStyle = authStatus ? (
        ''
      ) : (
        <a
          style={{
            fontSize: '18px',
            fontFamily: 'PingFang SC',
            marginTop: '70px',
            width: '100%',
            height: '100%',
          }}
        >
          <FormattedMessage id="Index-UserMenu.after.certification" />
        </a>
      );

      clickEvent = authStatus
        ? () => {
          this.props.history.push(menu.menuUrl);
        }
        : () => {
          ('javascript:void(0)');
        };
      eachMenu.push(
        <div key={key} className="noNeedAuth" onClick={clickEvent} style={divStyle}>
          <img className="img" src={menu.menuIcon} />
          <a>{menu.menuName}</a>
          {spanStyle}
        </div>,
      );
    });

    webSearchElements.push(
      <div key={98} id="areaTwo">
        <p className="funcModelName">
          <FormattedMessage id="Index-UserMenu.online.expert" />
        </p>
        {eachMenu}
      </div>,
    );
    const content = isNil(this.state) || isNil(this.state.content) ? '' : this.state.content;
    const title = isNil(this.state) || isNil(this.state.title) ? '' : this.state.title;
    return (
      <div>
        {webServiceElements}
        {webSearchElements}
        <Modal
          visible={
            isNil(this.state) || isNil(this.state.modalVisible) ? false : this.state.modalVisible
          }
          onCancel={() => {
            this.setState({ modalVisible: false });
          }}
          // onOk={!isNil(this.state) && !isNil(this.state.status) && this.state.status==="1"?this.goDepositpayment:this.goPage}
          footer={null}
        >
          <img alt="example" style={{ width: '70%' }} src={notice_pic} />
          <h1 style={{ color: '#000000' }}>{title}</h1>
          <h3 style={{ fontSize: '15px', color: '#333333', display: 'block' }}>{content}</h3>
          <Button
            key="submit"
            type="primary"
            style={{ textAlign: 'center', top: '10px', width: '180px' }}
            onClick={() => this.onClick()}
          >
            <FormattedMessage id="Index-UserMenu.confirm" />
          </Button>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state: {
  menu: { isShow: boolean; visible: boolean; unreadCount: number };
}) {
  const { isShow, visible, unreadCount } = state.menu;
  return {
    isShow,
    visible,
    unreadCount,
  };
}

export default connect(mapStateToProps)(IndexMenu);
