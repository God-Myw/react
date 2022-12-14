import { forEach, isNil } from 'lodash';
import React, { ReactNode } from 'react';
import { Redirect } from 'umi';
import { router } from '../../config/router.config';

class Authorized extends React.Component<{ to: string; children: ReactNode }, {}> {
  // 根据route信息判断url是否有访问权限
  render() {
    const rePath = '/' + this.props.to.split('/')[1];
    const userType = localStorage.getItem('userType');
    const checkStatus = localStorage.getItem('checkStatus');
    const payStatus = localStorage.getItem('payStatus');

    let isAuthed = true;
    router.map(route => {
      if (route.path === '/') {
        forEach(route.routes, (childRoute, index) => {
          if (childRoute['path'] === '/') {
            forEach(childRoute['routes'], (childItem, index) => {
              if (rePath === childItem['path']) {
                if (isNil(childItem['userType'])) {
                  return;
                }
                // 不是对应角色
                if (String(childItem['userType']) !== userType) {
                  isAuthed = false;
                  return;
                }
                // 保证金 只要资料认证之后就可以访问
                if (rePath.startsWith('/depositpayment')) {
                  // 资料未认证
                  if (childItem['authStatus'] && checkStatus !== '2') {
                    isAuthed = false;
                    return;
                  } else {
                    return;
                  }
                }
                // 未认证
                if (childItem['authStatus'] && (checkStatus !== '2' || payStatus !== '1')) {
                  isAuthed = false;
                  return;
                }
              }
            });
          }
        });
      }
    });
    return <div>{isAuthed ? this.props.children : <Redirect to="/403"></Redirect>}</div>;
  }
}

export default Authorized;
