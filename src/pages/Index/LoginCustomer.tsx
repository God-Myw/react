import getRequest, { postRequest } from '@/utils/request';
import { Button, Col, Divider, Form, Icon, Input, Row, message } from 'antd';
import Title from 'antd/lib/typography/Title';
import { isNil } from 'lodash';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './Login.less';
import LoginAccountFormProps from './LoginForm/LoginFormInterface';
import { setLocale, formatMessage } from 'umi-plugin-locale';

const logoicon = require('../Image/LoginImage/logo.png');
const loginicon = require('../Image/LoginImage/login.png');

interface LoginFormProps extends LoginAccountFormProps { }
type LoginProps = LoginFormProps & RouteComponentProps;

class UserLoginCustomer extends React.Component<LoginProps, LoginFormProps> {
  constructor(prop: LoginProps) {
    super(prop);
  }

  componentDidMount = () => {
    this.setState({
      type: 1,
      randomUUID: '',
      accountId: this.props.accountId,
      password: this.props.password,
      verifyCode: this.props.verifyCode,
      phoneCode: '',
      phoneNumber: '',
      languageType: 0,
      channelId: '3',
      deviceSn: '',
      history: this.props.history,
      vcodeBase64: this.props.vcodeBase64,
    });
    this.getVerifyCode();
  };

  //获取验证码
  getVerifyCode() {
    // 参数定义
    let param: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    param.set('type', '1');
    // 获取验证码
    getRequest('/sys/verify/code', param, (response: any) => {
      if (response.status === 200) {
        this.setState({
          vcodeBase64: response.data.JPGBase64,
          randomUUID: response.data.randomUUID
        });
      }
    });
  };

  // Account  Login
  handleAccountLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let requestData = {};
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.setState({
          accountId: values.accountId,
          password: values.password,
          verifyCode: values.verifyCode,
        });

        requestData = {
          type: this.state.type,
          randomUUID: this.state.randomUUID,
          accountId: values.accountId,
          password: values.password,
          verifyCode: values.verifyCode,
          phoneCode: this.state.phoneCode,
          phoneNumber: this.state.phoneNumber,
          languageType: this.state.languageType,
          channelId: this.state.channelId,
          deviceSn: this.state.deviceSn,
        };
        // 登录请求
        postRequest('/sys/login/in', JSON.stringify(requestData), (response: any) => {
          
          if (response.status === 200) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('accountId', response.data.user.accountId);
            localStorage.setItem('userType', response.data.user.userType);
            localStorage.setItem('checkStatus', response.data.user.checkStatus);
            localStorage.setItem('payStatus', response.data.user.payStatus);
            localStorage.setItem('username', response.data.user.firstName + ' ' + response.data.user.lastName);
            localStorage.setItem('userId', response.data.user.guid);
            localStorage.setItem('signature', response.data.signature);
            
            if (response.data.user.languageType === 0) {
              // 设置为 zh-CN
              setLocale('zh-CN');
            } else {
              // 设置为 en-US
              setLocale('en-US');
            }
            const loginResponse = response;
            let params: Map<string, string> = new Map();
            // 初期化固定是PC账号密码登录
            params.set('type', '1');
            // 缓存获取字典一览
            getRequest('/sys/dict/all', params, (response: any) => {
              if (response.code === '0000') {
                localStorage.setItem('dictData', JSON.stringify(response.data));

                if (loginResponse.data.user.userType !== 0) {
                  // 跳转非管理员首页
                  this.props.history.push('/index_menu');
                } else {
                  // 跳转管理员首页
                  this.props.history.push('/dicttype');
                }
              }
            });
          } else {
            message.error(response.message);
          }
        });
      }
    });
  };

  render() {
    if (localStorage.length > 0) {
      postRequest('/sys/login/out', '{type=1}', () => {
        localStorage.clear();
      });
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div className="containerCenter">
          <div className="containerLeft">
            <img className="logoClass" src={logoicon}></img>
            <img className="loginClass" src={loginicon}></img>
          </div>
          <div className="containerright">
            <div className="containerTab">
              <div>
                <Title style={{ color: 'white' }} className="titleClass" level={3}>
                  {formatMessage({ id: 'user-login.login' })}
                </Title>
                <Form onSubmit={this.handleAccountLogin}>
                  <Row gutter={25}>
                    <Col span={23}>
                      <Form.Item>
                        {getFieldDecorator('accountId', {
                          rules: [
                            {
                              required: true,
                              message: formatMessage({ id: 'user-login.login.pls-input-workid-null' }),
                            },
                          ],
                        })(
                          <Input
                            className="inputStyle"
                            placeholder={formatMessage({ id: 'user-login.login.pls-input-workid' })}
                            prefix={<Icon type="user" />}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={25}>
                    <Col span={23}>
                      <Form.Item>
                        {getFieldDecorator('password', {
                          rules: [
                            {
                              required: true,
                              message: formatMessage({ id: 'user-login.login.pls-input-password-null' }),
                            },
                          ],
                        })(
                          <Input
                            type='password'
                            placeholder={formatMessage({
                              id: 'user-login.login.pls-input-password',
                            })}
                            prefix={<Icon type="lock" />}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={25}>
                    <Col span={10}>
                      <Form.Item>
                        {getFieldDecorator('verifyCode', {
                          rules: [
                            {
                              required: true,
                              message: formatMessage({
                                id: 'user-login.login.pls-input-verifycode-null',
                              }),
                            },
                          ],
                        })(
                          <Input
                            placeholder={formatMessage({ id: 'user-login.login.verifycode' })}
                            prefix={<Icon type="safety-certificate" />}
                            maxLength={4}
                          />,
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={13}>
                      <Form.Item>
                        <img
                          src={
                            isNil(this.state) || isNil(this.state.vcodeBase64)
                              ? ''
                              : this.state.vcodeBase64
                          }
                          style={{ width: '100%', height: 35, cursor: 'pointer' }}
                          onClick={() => this.getVerifyCode()}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={25}>
                    {/* <Col span={6}></Col> */}
                    <Col span={23}>
                      <Form.Item>
                        <Button type="primary" block htmlType="submit">
                          {' '}
                          {formatMessage({ id: 'user-login.login' })}{' '}
                        </Button>
                      </Form.Item>
                    </Col>
                    {/* <Col span={6}></Col> */}
                  </Row>
                </Form>
              </div>
              <Row gutter={25}>
                {/* <Col span={23}>
                  <Divider className="registerClass">
                    <Button type="link" href="/user/findPass">
                      {formatMessage({ id: 'user-login.login.forget.password' })}
                    </Button>
                  </Divider>
                </Col> */}
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const LoginCustomerForm = Form.create({ name: 'user_login' })(UserLoginCustomer);
export default LoginCustomerForm;
