/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import Authorized from '@/utils/Authorized';
import { postRequest } from '@/utils/request';
import { isAntDesignPro } from '@/utils/utils';
import ProLayout, { BasicLayoutProps as ProLayoutProps, MenuDataItem, Settings } from '@ant-design/pro-layout';
import { HeaderViewProps } from '@ant-design/pro-layout/lib/Header';
import { Icon, Modal, PageHeader } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { connect } from 'dva';
import { isNil } from 'lodash';
import React, { useEffect } from 'react';
import { Dispatch } from 'redux';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { editBread } from './BreadSetting';
import CustomerLeft from './CustomerLeft';
import ManagerLeft from './ManagerLeft';
import RightCommon from './RightCommon';
import UserLeft from './UserLeft';

const { confirm } = Modal;
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const defaultFooterDom = (
  <div>

  </div>
);

const footerRender: BasicLayoutProps['footerRender'] = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }
  return (
    <>
      {defaultFooterDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

const menuRender = (props: HeaderViewProps, defaultDom: React.ReactNode): React.ReactNode => {
  const userType = localStorage.getItem('userType');
  if (!isNil(userType) && userType === '0') {
    return <ManagerLeft />;
  } else if (!isNil(userType) && (userType === '4' || userType === '5')) {
    return <UserLeft />;
  } else {
    return <CustomerLeft />;
  }
};
// 用户类型   0：管理员;  1：线上客服 2：线下客服  3：审核客服 4：货主 5：船东
const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, children, location } = props;
  const userType = localStorage.getItem('userType');
  var routes: Route[] = [];
  if (location && location.pathname != '/index_menu') {
    if (userType === '5' || userType === '4') {
      var routes: Route[] = [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
          }),
        },
      ];
    } else if (userType === '3') {
      var routes: Route[] = [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.auditCustomerService',
          }),
        },
      ];
    } else if (userType === '2') {
      var routes: Route[] = [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.offlineCustomerService',
          }),
        },
      ];
    } else if (userType === '1') {
      var routes: Route[] = [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.onlineCustomerService',
          }),
        },
      ];
    }
  }


  const pathname = location && location.pathname ? location.pathname : '';
  routes = editBread(pathname, routes);

  const itemRender = (route: Route, params: any, routes: Route[], paths: string[]) => {
    const last = routes.indexOf(route) === routes.length - 1;

    return last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
        <Link to={'/' + paths.join('/')}>{route.breadcrumbName}</Link>
      );
  };

  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
    }
  }, []);

  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  const logout = () => {
    return confirm({
      title: formatMessage({ id: 'menu.confirm.logout' }),
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        localStorage.clear();
        postRequest('/sys/login/out', '{type=1}', () => {
          window.location.href = `/user/admin/login`; // 没有路由传递 暂定对应方式
        });
      },
      onCancel() {
        console.log('Cancel'); // 什么都不做
      },
    });
  };
  const extraInfo = (<PageHeader
    style={{ textAlign: 'left' }}
    title=""
    extra={<span>
      <Icon style={{
        marginRight: '10px'
      }}
        type='global' />
      {'Administrators'}
      <Icon
        onClick={logout}
        style={{
          marginLeft: '10px'
        }}
        type='close-circle' /></span>}
    breadcrumb={{ itemRender: itemRender, routes: routes, separator: '>', style: { width: '50%', float: 'left' } }}
  >
    {children}
    <RightCommon />
  </PageHeader>);
  const extraNull = (<PageHeader
    style={{ textAlign: 'left' }}
    title=""
    extra={<span></span>}
    breadcrumb={{ itemRender: itemRender, routes: routes, separator: '>' }}
  >
    {children}
    <RightCommon />
  </PageHeader>);
  return (
    <ProLayout
      style={{ height: '100%' }}
      headerRender={false}
      autoHideHeader={true}
      title="道裕物流"
      // pageTitleRender={(routes, route) => {
      //   let title = '';
      //   if (routes.pathname == '/') {
      //     title = '道裕物流';
      //   } else if (routes.pageName == '/user/login') {
      //     title = '登录';
      //   } else if (routes.pathname == '/user/register') {
      //     title = '注册';
      //   } else if (routes.pathname == '/index_menu') {
      //     title = '首页';
      //   } else if (routes.pathname == '/account_manager') {
      //     title = '账号管理';
      //   }
      //   return title;
      // }}
      logo={false}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
            defaultMessage: 'Home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      menuRender={menuRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
    // className={BasicStyle.containerLeft}
    // {...settings}
    >
      {localStorage.getItem('userType') === '0' ? extraInfo : extraNull}
    </ProLayout>
  );
};

export default connect(({ settings }: ConnectState) => ({
  settings,
}))(BasicLayout);
