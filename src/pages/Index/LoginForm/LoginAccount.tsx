import getRequest, { postRequest } from '@/utils/request';
import { Button, Col, Form, Icon, Row, message as messageWarn, message } from 'antd';
import Input from 'antd/es/input';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './LoginAccount.less';
import LoginAccountFormProps from './LoginFormInterface';
import { isNil } from 'lodash';
import { formatMessage, setLocale } from 'umi-plugin-locale';
import { getLocale } from 'umi-plugin-react/locale';

type LoginProps = LoginAccountFormProps & RouteComponentProps;

class UserLoginAccount extends React.Component<LoginAccountFormProps, LoginProps> {
  constructor(props: LoginAccountFormProps) {
    super(props);
  }

  componentDidMount = () => {
    let langType = getLocale() === 'en-US'? 1 : 0;
    this.setState({
      type: 1,
      randomUUID: '',
      accountId: this.props.accountId,
      password: this.props.password,
      verifyCode: this.props.verifyCode,
      phoneCode: '',
      phoneNumber: '',
      languageType: langType,
      channelId: '3',
      deviceSn: '',
      history: this.props.history,
      vcodeBase64: this.props.vcodeBase64,
    });
    this.getNewVcode();

  };

  // 获取新的验证码
  getNewVcode = () => {
    // 参数定义
    let param: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    param.set('type', '1');
    // 获取验证码
    getRequest('/sys/verify/code', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        this.setState({
          vcodeBase64: response.data.JPGBase64,
          randomUUID: response.data.randomUUID,
        });
      }
    });
  }

  // Account  Login
  handleAccountLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let requestData = {};
    this.props.form.validateFields(
      ['accountId', 'password', 'verifyCode'],
      (err: any, values: any) => {
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
              if (String(response.data.user.userType) === '0') {
                message.warning("管理员登录URL不正");
                this.props.history.push('/user/login');
                return;
              }
              localStorage.setItem('ownerType', response.data.user.ownerType);
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('accountId', response.data.user.accountId);
              localStorage.setItem('userType', response.data.user.userType);
              localStorage.setItem('checkStatus', response.data.user.checkStatus);
              localStorage.setItem('payStatus', response.data.user.payStatus);
              localStorage.setItem('username', response.data.user.firstName + ' ' + response.data.user.lastName);
              localStorage.setItem('userId', response.data.user.guid);

              if (response.data.user.languageType === 0) {
                // 设置为 zh-CN
                setLocale('zh-CN');
              } else {
                // 设置为 en-US
                setLocale('en-US');
              }

              let params: Map<string, string> = new Map();
              // 初期化固定是PC账号密码登录
              params.set('type', '1');
              // 缓存获取字典一览
              getRequest('/sys/dict/all', params, (response: any) => {
                if (response.code === '0000') {
                  localStorage.setItem('dictData', JSON.stringify(response.data));
                  // 跳转首页
                  this.props.history.push('/index_menu');
                }
              });
            } else {
              messageWarn.error(response.message);
            }
          });
        }
      },
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleAccountLogin}>
        <Row gutter={25}>
          <Col span={23}>
            <Form.Item>
              {getFieldDecorator('accountId', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'user-login.login.pls-input-accountid-null' }),
                  },
                ],
              })(
                <Input
                  className="inputStyle"
                  placeholder={formatMessage({ id: 'user-login.login.pls-input-accountid' })}
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
                  placeholder={formatMessage({ id: 'user-login.login.pls-input-password' })}
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
                    message: formatMessage({ id: 'user-login.login.pls-input-verifycode-null' }),
                  },
                  {
                    min: 4,
                    message: formatMessage({ id: 'user-login.login.pls-input-min-verifycode' }),
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
                  isNil(this.state) || isNil(this.state.vcodeBase64) ? '' : this.state.vcodeBase64
                }
                style={{ width: '100%', height: 35, cursor: 'pointer' }}
                onClick={this.getNewVcode}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={25}>
          <Col span={23}>
            <Form.Item>
              <Button type="primary" block htmlType="submit">
                {' '}
                {formatMessage({ id: 'user-login.login' })}{' '}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={25}>
          <Col span={15}></Col>
          <Col span={8}>
            <Form.Item style={{ marginTop: -20 }}>
              <Button style={{ color: 'white' }} type="link" block href="/user/findPass">
                {' '}
                {formatMessage({ id: 'user-login.login.forget.password' })}?{' '}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const LoginAccountForm = Form.create({ name: 'user_login_account' })(UserLoginAccount);
export default LoginAccountForm;
