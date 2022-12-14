import { Button, Col, Divider, Form, Row, Tabs } from 'antd';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { formatMessage } from 'umi-plugin-locale';
import './Login.less';
import LoginAccountForm from './LoginForm/LoginAccount';
import LoginAccountFormProps from './LoginForm/LoginFormInterface';
import LoginPhoneForm from './LoginForm/LoginPhone';
import { postRequest } from '@/utils/request';

const { TabPane } = Tabs;
const logoicon = require('../Image/LoginImage/logo.png');
const loginicon = require('../Image/LoginImage/login.png');

interface LoginFormProps extends LoginAccountFormProps {}
type LoginProps = LoginFormProps & RouteComponentProps;

class UserLogin extends React.Component<LoginProps, LoginFormProps> {
  constructor(prop: LoginProps) {
    super(prop);
  }

  callback = (e: any) => {
    this.setState({
      type: e,
    });
  };

  render() {
    if (localStorage.length > 1) {
      postRequest('/sys/login/out', '{type=1}', () => {
        localStorage.clear();
      });
    }
    return (
      <div>
        <div className="containerCenter">
          <div className="containerLeft">
            <img className="logoClass" src={logoicon}></img>
            <img className="loginClass" src={loginicon}></img>
          </div>
          <div className="containerright">
            <div className="containerTab">
              <Tabs
                defaultActiveKey="1"
                size={'small'}
                hideAdd={true}
                onChange={this.callback}
                tabBarStyle={{ width: '95%' }}
              >
                <TabPane
                  tab={formatMessage({ id: 'user-login.login.accountid' })}
                  key="1"
                  className="containerTabPane"
                >
                  <LoginAccountForm {...this.props} />
                </TabPane>
                <TabPane tab={formatMessage({ id: 'user-login.login.phone' })} key="2">
                  <LoginPhoneForm {...this.props} />
                </TabPane>
              </Tabs>
              <Row gutter={25}>
                <Col span={23}>
                  <Divider className="registerClass">
                    <Button href="/user/register" type="link" block>
                      {formatMessage({ id: 'user-login.login.regist-now' })}
                    </Button>

                    {/* <Button onClick={this.changeLanuage} type="link" block>
                      切换语言
                    </Button> */}
                  </Divider>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const LoginForm = Form.create({ name: 'user_login' })(UserLogin);
export default LoginForm;
