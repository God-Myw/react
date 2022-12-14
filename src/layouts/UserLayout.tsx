// import SelectLang from '@/components/SelectLang';
import { ConnectProps, ConnectState } from '@/models/connect';
import { MenuDataItem } from '@ant-design/pro-layout';
import { connect } from 'dva';
// import Link from 'umi/link';
import React from 'react';

// import logo from '../assets/logo.svg';
// import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: { [path: string]: MenuDataItem };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
  } = props;
  const { children } = props;
  // const { breadcrumb } = getMenuData(routes);

  return <div>{children}</div>;
};

export default connect(({ settings }: ConnectState) => ({
  ...settings,
}))(UserLayout);
