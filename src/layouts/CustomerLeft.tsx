import { postRequest } from '@/utils/request';
import { Button, Icon, Menu, Modal, Divider } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import React, { Component } from 'react';
import { Link } from 'umi';
import { getLocale, setLocale, formatMessage } from 'umi-plugin-locale';
import './BasicLayout';
import { connect } from 'dva';
import './BasicLayout.less';
import { isNil } from 'lodash';
import UserIcon from '../pages/Image/MenuIcon/user.svg';
import CloseIcon from '../pages/Image/MenuIcon/close.svg';

const { confirm } = Modal;

const timg = require('../pages/Image/MenuIcon/kefu-menu.png'); // 用户类型   0：管理员;  1：线上客服 2：线下客服  3：审核客服 4：货主 5：船东

class CustomerLeft extends Component<
  { dispatch: Dispatch<AnyAction>; unreadCount: number },
  { visible: boolean; openKeys: string[]; userType: string; username: string; isCn: boolean }
> {
  rootSubmenuKeys: number[] = [];
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

  // 初期化加载
  componentWillMount() {
    this.setState({
      openKeys: [],
      visible: false,
      userType: String(localStorage.getItem('userType')),
      username: String(localStorage.getItem('accountId')),
    });
  }

  // 登出
  logout = () => {
    confirm({
      title: formatMessage({ id: 'menu.confirm.logout' }),
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        postRequest('/sys/login/out', '{type=1}', () => {
          window.location.href = `/user/service/login`; // 没有路由传递 暂定对应方式
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
    // 获取当前语言
    if (getLocale() === 'en-US') {
      // 设置为 zh-CN
      setLocale('zh-CN');
    } else {
      // 设置为 en-US
      setLocale('en-US');
    }
  };

  render() {
    const { unreadCount } = this.props;
    const username = isNil(this.state) || isNil(this.state.username) ? '' : this.state.username;
    const userType = isNil(this.state) || isNil(this.state.userType) ? '' : this.state.userType;
    const title =
      userType === '1'
        ? formatMessage({ id: 'menu.onlineCustomerService' })
        : userType === '2'
        ? formatMessage({ id: 'menu.offlineCustomerService' })
        : formatMessage({ id: 'menu.auditCustomerService' });
    const titleMenu = (
      <Menu.Item style={{ marginBottom: '-8px' }} title={title} key={1}>
        <span style={{ fontSize: '16px' }}>
          <Link style={{ color: 'rgba(255,255,255,1)' }} to="/account_manager">
            {title}
          </Link>
        </span>
      </Menu.Item>
    );
    const nameTitle = (
      <Menu.Item style={{ marginBottom: '-8px' }} title={username} key={2}>
        <span style={{ fontSize: '16px' }}>
          <Link style={{ color: 'rgba(255,255,255,1)' }} to="">
            {username}
          </Link>
        </span>
      </Menu.Item>
    );
    const hyphen = (
      <Menu.Item key={3} disabled style={{ display: 'inline-block', width: '80%' }}>
        <Divider style={{ opacity: '0.5' }} />
      </Menu.Item>
    );
    const accountMenu = (
      <Menu.Item
        style={{ marginBottom: '-8px' }}
        title={formatMessage({ id: 'menu.account_manager' })}
        key={4}
      >
        <Icon component={() => <UserIcon fill="#FFFFFF" width="18px" height="18px" />} />
        <span style={{ fontSize: '16px' }}>
          <Link style={{ color: 'rgba(255,255,255,1)' }} to="/account_manager">
            {formatMessage({ id: 'menu.account_manager' })}
          </Link>
        </span>
      </Menu.Item>
    );
    return (
      <div style={{ minWidth: '200px', background: 'rgba(23,51,71,1)', position: 'relative' }}>
        <div
          className="logo"
          style={{
            position: 'fixed',
            top: '0',
            left: '20px',
          }}
        >
          <img src="" alt="" />
          <h1>
            <Link
              to="/"
              style={{
                fontFamily: 'HYXingKaiJ',
                lineHeight: '71px',
                fontSize: '40px',
                color: 'rgba(255,255,255,1)',
              }}
            >
              道裕物流
            </Link>
            <p key={0} style={{ color: 'white', fontSize: '16px' }}>
              www.dylnet.cn
            </p>
          </h1>
          <Menu
            selectable={false}
            theme="dark"
            style={{
              background: 'rgba(23,51,71,1)',
              margin: '26% 0 0 0',
              textAlign: 'center',
            }}
            mode="inline"
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
          >
            {titleMenu}
            {nameTitle}
            {hyphen}
            {accountMenu}
            {hyphen}
          </Menu>
        </div>
        <div className="menuBottom">
          <Menu
            selectable={false}
            theme="dark"
            style={{ background: 'rgba(23,51,71,1)', margin: '26% 0 0 0', textAlign: 'center' }}
            mode="inline"
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
          >
            <Menu.Item
              style={{ height: '100px' }}
              title={formatMessage({ id: 'menu.expert.online' })}
              key="88"
            >
              <img
                onClick={this.isShow}
                className="customerClass"
                style={{ maxWidth: '92px' }}
                src={timg}
              />
              {unreadCount ? <span className="redpoint">{unreadCount}</span> : ''}
            </Menu.Item>
            <Menu.Item title={formatMessage({ id: 'menu.logout' })} key="99">
              <Icon component={() => <CloseIcon fill="#FFFFFF" width="18px" height="18px" />} />
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

export default connect(mapStateToProps)(CustomerLeft);
