import { getRequest, postRequest, putRequest } from '@/utils/request';
import { Button, Divider, Icon, Menu, Modal } from 'antd';
import { connect } from 'dva';
import { isNil } from 'lodash';
import React, { Component } from 'react';
import { AnyAction, Dispatch } from 'redux';
import { Link } from 'umi';
import { formatMessage, getLocale, setLocale } from 'umi-plugin-locale';
import Auth from '../pages/Image/MenuIcon/auth1.svg';
import CloseIcon from '../pages/Image/MenuIcon/close.svg';
import DataAuthIcon from '../pages/Image/MenuIcon/dataAuth.svg';
import LanguageIcon from '../pages/Image/MenuIcon/language.svg';
import UserIcon from '../pages/Image/MenuIcon/user.svg';
import './BasicLayout';
import "./BasicLayout.less";

const { confirm } = Modal;

const timg = require('../pages/Image/MenuIcon/kefu-menu.png'); // 用户类型   0：管理员;  1：线上客服 2：线下客服  3：审核客服 4：货主 5：船东

class UserLeft extends Component<
  { dispatch: Dispatch<AnyAction>; unreadCount: number },
  { visible: boolean; openKeys: string[]; userType: string; checkStatus: string; payStatus: string; username: string; isCn: boolean; }
  > {
  rootSubmenuKeys: number[] = [];

  // 点击时切换展开项
  onOpenChange = (openKeys: string[]) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.includes(Number(latestOpenKey))) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey + ''] : [],
      });
    }
  };

  isShow = () => {
    this.props.dispatch({
      type: 'menu/changeShowChat',
      payload: {
        isShow: true,
        visible: true,
      },
    });
    this.setState({
      visible: true,
    });
  };

  componentWillMount() {
    this.setState({
      openKeys: [],
      visible: false,
    })
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    getRequest(`/sys/user/${localStorage.getItem('userId')}`, param, response => {
      if (response.status === 200) {
        this.setState({
          userType: String(localStorage.getItem("userType")),
          checkStatus: JSON.stringify(response.data.user.checkStatus),
          payStatus: JSON.stringify(response.data.user.payStatus),
          username: String(localStorage.getItem("accountId")),
          isCn: getLocale() === 'zh-CN',
        });
      }
    })
  };

  // 登出
  logout = () => {
    confirm({
      title: formatMessage({ id: 'menu.confirm.logout' }),
      content: '',
      okText: formatMessage({ id: 'menu.confirm' }),
      cancelText: formatMessage({ id: 'menu.cancel' }),
      onOk() {
        postRequest('/sys/login/out', '{type=1}', () => {
          window.location.href = `/user/login`; // 没有路由传递 暂定对应方式
          localStorage.clear();
        });
      },
      onCancel() {
        console.log('Cancel'); // 什么都不做
      },
    });
  };

  // 切换语言
  changeLanuage = () => {
    let param = {};
    // 获取当前语言
    if (getLocale() === 'en-US') {
      param = { type: 1, languageType: 0 }
      putRequest('/sys/user/lang/switch', JSON.stringify(param), (response: any) => {
        if (response.status === 200) {
          // 设置为 zh-CN
          setLocale('zh-CN');
        }
      });
    } else {
      param = { type: 1, languageType: 1 }
      putRequest('/sys/user/lang/switch', JSON.stringify(param), (response: any) => {
        if (response.status === 200) {
          // 设置为 en-US
          setLocale('en-US');
        }
      });
    }
  };

  render() {
    const { unreadCount } = this.props;
    const localCheckStatus = !isNil(localStorage.getItem('checkStatus'))?localStorage.getItem('checkStatus'):null;
    const localPayStatus = !isNil(localStorage.getItem('payStatus'))?localStorage.getItem('payStatus'):null;
    const username = isNil(this.state) || isNil(this.state.username) ? '' : this.state.username;
    const checkStatus = !isNil(localCheckStatus)?localCheckStatus:(isNil(this.state) || isNil(this.state.checkStatus) ? '' : this.state.checkStatus);
    const payStatus = !isNil(localPayStatus)?localPayStatus:(isNil(this.state) || isNil(this.state.payStatus) ? '' : this.state.payStatus);
    const isCn = isNil(this.state) || isNil(this.state.isCn) ? false : this.state.isCn;
    const title = !isNil(checkStatus) && checkStatus === '2' && payStatus === '1' ? formatMessage({ id: 'left-menu.authenticated' }) : formatMessage({ id: 'left-menu.no-authenticated' });
    const titleMenu = (<Menu.Item style={{ marginBottom: '-8px' }} title={username} key={1}>
      <span style={{ fontSize: '16px' }}>
        <Link style={{ color: 'rgba(255,255,255,1)' }} to='/account_manager'>
          {username}
        </Link>
      </span>
    </Menu.Item>
    );

    const certificationTitle = (<Menu.Item style={{ marginBottom: '-8px' }}
      title={title}
      key={2} >
      < span style={{ fontSize: '16px', color: 'rgba(255,255,255,1)' }}>
        <Icon
          component={() => <Auth fill="#FFFFFF" width='20px' height='20px' />}
        />
        {title}
      </span >
    </Menu.Item >);
    const hyphen = (<Menu.Item key={3} disabled style={{ display: 'inline-block', width: '80%' }}>
      <Divider style={{ opacity: '0.5' }} />
    </Menu.Item>);
    const accountMenu = (
      <Menu.Item style={{ marginBottom: '-8px' }} title={formatMessage({ id: 'menu.account_manager' })} key={4}>
        <Icon
          component={() => <UserIcon fill="#FFFFFF" width='20px' height='20px' />}
        />
        <span style={{ fontSize: '16px' }}>
          <Link style={{ color: 'rgba(255,255,255,1)' }} to='/account_manager'>
            {formatMessage({ id: 'menu.account_manager' })}
          </Link>
        </span>
      </Menu.Item>
    );
    const certificationMenu = (<Menu.Item style={{ marginBottom: '-8px' }} title={formatMessage({ id: 'menu.profile_certification' })} key={4}>
      <Icon
        component={() => <LanguageIcon fill="#FFFFFF" width='20px' height='20px' />}
      />
      <span style={{ fontSize: '16px' }}>
        <Link style={{ color: 'rgba(255,255,255,1)' }} to='/profile_certification/0'>
          {formatMessage({ id: 'menu.profile_certification' })}
        </Link>
      </span>
    </Menu.Item>);
    const languageMenu = (<Menu.Item style={{ marginBottom: '-8px' }}
      title={isCn ? formatMessage({ id: 'menu.international_en' }) : formatMessage({ id: 'menu.international_zn' })} key={4}>
      <Icon
        component={() => <DataAuthIcon fill="#FFFFFF" width='20px' height='20px' />}
      />
      <Button
        style={{ padding: '0px 0px', fontSize: '16px', color: 'rgba(255,255,255,1)' }}
        onClick={this.changeLanuage}
        type="link"
      >
        {isCn ? formatMessage({ id: 'menu.international_en' }) : formatMessage({ id: 'menu.international_zn' })}
      </Button>
    </Menu.Item>);
    return (
      <div style={{ minWidth: '200px', background: 'rgba(23,51,71,1)', position: 'relative' }}>
        <div className="logo">
          <img src="" alt="" />
          <h1>
            <Link to="/"
              style={{ fontFamily: 'HYXingKaiJ', lineHeight: '71px', fontSize: '40px', color: 'rgba(255,255,255,1)' }}>
              道裕物流
            </Link>
            <p key={0} style={{ color: 'white', fontSize: '16px' }}>
              www.dylnet.cn
            </p>
          </h1>
        </div>
        <Menu
          selectable={false}
          theme="dark"
          style={{ background: 'rgba(23,51,71,1)', margin: '26% 0 0 0', textAlign: 'center' }}
          mode="inline"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
        >
          {titleMenu}
          {certificationTitle}
          {hyphen}
          {accountMenu}
          {certificationMenu}
          {languageMenu}
          {hyphen}
        </Menu>
        <div className="menuBottom">
          <Menu
            selectable={false}
            theme="dark"
            style={{ background: 'rgba(23,51,71,1)', margin: '26% 0 0 0', textAlign: 'center' }}
            mode="inline"
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
          >
            <Menu.Item style={{ height: '100px' }} title={formatMessage({ id: 'menu.expert.online' })} key="88">
              <img onClick={this.isShow} className="customerClass" style={{ maxWidth: '92px' }} src={timg} />
              {unreadCount ? <span className="redpoint">{unreadCount}</span> : ''}
            </Menu.Item >
            <Menu.Item title={formatMessage({ id: 'menu.logout' })} key="99">
              <Icon
                component={() => <CloseIcon fill="#FFFFFF" width='18px' height='18px' />}
              />
              <Button
                style={{ padding: '0px 0px', fontSize: '16px', color: 'rgba(255,255,255,1)' }}
                onClick={this.logout}
                type="link"
              >
                {formatMessage({ id: 'menu.logout' })}
              </Button>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: { menu: { isShow: boolean; visible: boolean, unreadCount: number } }) {
  const { isShow, visible, unreadCount } = state.menu;
  return {
    isShow,
    visible,
    unreadCount
  };
}

export default connect(mapStateToProps)(UserLeft);
