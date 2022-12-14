import getRequest, { postRequest } from '@/utils/request';
import { Menu, Modal, Icon } from 'antd';
import { connect } from 'dva';
import { isNil, forEach } from 'lodash';
import React, { Component } from 'react';
import { AnyAction, Dispatch } from 'redux';
import { formatMessage } from 'umi-plugin-locale';
import './BasicLayout';
import { Link } from 'umi';
import Data from '../pages/Image/MenuIcon/data.svg';
import Auth from '../pages/Image/MenuIcon/auth.svg';
import Port from '../pages/Image/MenuIcon/port.svg';
import Message from '../pages/Image/MenuIcon/message.svg';
import Insurance from '../pages/Image/MenuIcon/insurance.svg';
import Iconclass from '../pages/Image/MenuIcon/icon.svg';

const { confirm } = Modal;
const { SubMenu } = Menu;

export interface MenuListState {
  guid: number;
  needAuthen: number;
  funcModel: number;
  menuType: number;
  parentId: number;
  menuName: string;
  menuUrl: string;
  icon: string;
  childList: MenuListState[];
}

class ManagerLeft extends Component<
  { dispatch: Dispatch<AnyAction> },
  MenuListState & { visible: boolean; menuTreeNode: any; openKeys: string[]; selectedKeys: string[]; }
  > {
  rootSubmenuKeys: number[] = [];

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
  onItemClick = (e: any) => {
    const selectedKeys: string[] = [];
    selectedKeys.push(e.key)
    this.setState({
      selectedKeys: selectedKeys,
    });
  }

  // 点击时切换展开项
  onOpenChange = (openKeys: string[]) => {
    // const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    // if (this.rootSubmenuKeys.includes(Number(latestOpenKey))) {
      this.setState({ openKeys });
    // } else {
    //   this.setState({
    //     openKeys: latestOpenKey ? [latestOpenKey + ''] : [],
    //   });
    // }
  };

  // 初期化加载menu树结构
  componentWillMount() {
    const openKeys: string[] = [];
    const selectedKeys: string[] = [];
    let params: Map<string, string> = new Map();
    params.set('type', '1');
    getRequest('/sys/menu', params, (response: any) => {
      if (response.code === '0000') {
        const menuTreeNode = this.renderMenu(response.data.leftMenu);
        if (response.data.leftMenu.length > 0) {
          forEach(response.data.leftMenu, (item, index) => {
            if (Number(index) === 0 && item.childList.length > 0) {
              selectedKeys.push(item.childList[0].guid.toString());
            }
            openKeys.push(item.guid.toString());
          });

        }
        this.setState({
          menuTreeNode: menuTreeNode,
          openKeys: openKeys,
          visible: false,
          selectedKeys: selectedKeys,
        });
      }
    })
  }
  // 左边导航栏渲染（原理，通过递归的方式进行渲染）
  renderMenu = (data: MenuListState[]): any => {
    return data.map((item) => {
      if (item.childList) {
        if (item.menuName === '基础数据') {
          return <SubMenu key={item.guid.toString()} title={
            <span style={{ fontSize: '18px' }}>
              <Icon
                component={() => <Data style={{verticalAlign: 'text-bottom'}} fill="#FFFFFF" width='24px' height='24px' />}
              />
              <span>{item.menuName}</span>
            </span>
          }>
            {this.renderMenu(item.childList)}
          </SubMenu>
        } else if (item.menuName === '权限管理') {
          return <SubMenu key={item.guid.toString()} title={
            <span style={{ fontSize: '18px' }}>
              <Icon
                component={() => <Auth style={{verticalAlign: 'text-bottom'}} fill="#FFFFFF" width='24px' height='24px' />}
              />
              <span>{item.menuName}</span>
            </span>
          }>
            {this.renderMenu(item.childList)}
          </SubMenu>
        } else if (item.menuName === '港口管理') {
          return <SubMenu key={item.guid.toString()} title={
            <span style={{ fontSize: '18px' }}>
              <Icon
                component={() => <Port style={{verticalAlign: 'text-bottom'}} fill="#FFFFFF" width='24px' height='24px' />}
              />
              <span>{item.menuName}</span>
            </span>
          }>
            {this.renderMenu(item.childList)}
          </SubMenu>
        } else if (item.menuName === '站内消息') {
          return <SubMenu key={item.guid.toString()} title={
            <span style={{ fontSize: '18px' }}>
              <Icon
                component={() => <Message style={{verticalAlign: 'text-bottom'}} fill="#FFFFFF" width='24px' height='24px' />}
              />
              <span>{item.menuName}</span>
            </span>
          }>
            {this.renderMenu(item.childList)}
          </SubMenu>
        } else if (item.menuName === '保险管理') {
          return <SubMenu key={item.guid.toString()} title={
            <span style={{ fontSize: '18px' }}>
              <Icon
                component={() => <Insurance style={{verticalAlign: 'text-bottom'}} fill="#FFFFFF" width='24px' height='24px' />}
              />
              <span>{item.menuName}</span>
            </span>
          }>
            {this.renderMenu(item.childList)}
          </SubMenu>
        }

      }
      return <Menu.Item key={item.guid.toString()} title={item.menuName}>
        <Link style={{ color: 'rgba(255,255,255,1)' }} to={item.menuUrl}>
        </Link>
        <span style={{ fontSize: '14px', marginLeft: '-30px' }}>
          {formatMessage({ id: item.menuName })}
        </span>
      </Menu.Item>
    })
  };

  // 登出
  logout = () => {
    confirm({
      title: formatMessage({ id: 'menu.confirm.logout' }),
      content: '',
      okText: '确定',
      cancelText: '取消',
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

  backMenu = () => {
    window.location.href = `/manager_menu`;
  };

  render() {
    return (
      <div style={{ minWidth: '12%', background: 'rgba(23,51,71,1)' }}>
        <div className="logo">
          <img src="" alt="" />
          {/* TODO */}
          <h1
            onClick={() => { }}
            style={{ fontFamily: 'HYXingKaiJ', lineHeight: '71px', color: 'rgba(255,255,255,1)' }}
          >
            <Icon
              component={() => <Iconclass fill="#FFFFFF" width='36px' height='36px' />}
            />
            道裕物流
          </h1>
        </div>
        <Menu
          selectable={false}
          selectedKeys={isNil(this.state) || isNil(this.state.selectedKeys) ? [] : this.state.selectedKeys}
          theme="dark"
          style={{ background: 'rgba(23,51,71,1)', margin: '0 0 0 0', textAlign: 'center' }}
          mode="inline"
          openKeys={isNil(this.state) || isNil(this.state.openKeys) ? [] : this.state.openKeys}
          onOpenChange={this.onOpenChange}
          onClick={this.onItemClick.bind(this)}
        >
          {isNil(this.state) || isNil(this.state.menuTreeNode) ? '' : this.state.menuTreeNode}
        </Menu>
      </div >
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

export default connect(mapStateToProps)(ManagerLeft);
