import getRequest, { postRequest } from '@/utils/request';
import { dicts } from '@/utils/utils';
import { Button, Col, Form, Icon, message, Row, Select } from 'antd';
import Input from 'antd/es/input';
import { RouteComponentProps } from 'dva/router';
import { isNil } from 'lodash';
import React from 'react';
import { formatMessage, setLocale } from 'umi-plugin-locale';
import './LoginAccount.less';
import LoginAccountFormProps from './LoginFormInterface';

interface LoginPhoneFormStates extends LoginAccountFormProps {
  accountId: string;
  verifyCode: string;
  history: any;
  loginType: number;
  timeCount: number;
  buttonText: string;
  buttonDisabled: boolean;
  clearInterval: boolean;
  phoneCode: string;
  phoneCodeDict: any[];
}

type LoginProps = LoginPhoneFormStates & RouteComponentProps;

class UserLoginPhone extends React.Component<LoginProps, LoginPhoneFormStates> {
  constructor(props: LoginProps) {
    super(props);
  }

  private timeChange: NodeJS.Timeout | null = null;

  private readonly defaultButtonText = formatMessage({
    id: 'user-login.login.message-get-verifycode',
  });

  componentDidMount = () => {
    this.setState({
      type: this.props.type,
      timeCount: 60, // 验证码发送间隔时间
      randomUUID: '',
      accountId: this.props.accountId,
      password: this.props.password,
      verifyCode: this.props.verifyCode,
      phoneCode: '+86',
      phoneNumber: this.props.phoneNumber,
      languageType: 0,
      channelId: '3', //1、安卓；2、IOS；3、web
      deviceSn: '',
      history: this.props.history,
      buttonDisabled: true,
      buttonText: '',
      phoneCodeDict: []
    });
    this.getDictData();
  };

  // Account  Login
  handlePhoneLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    let requestData = {};
    const {
      form: { validateFields },
    } = this.props;
    // 只校验当前字段，防止校验账号密码的域
    validateFields(['phoneCode', 'phoneNumber', 'phoneVerifyCode'], (err: any, values: any) => {
      if (err) {
        return;
      } else {
        this.setState({
          phoneCode: values.phoneCode,
          phoneNumber: values.phoneNumber,
          verifyCode: values.verifyCode,
        });
        requestData = {
          type: 2,
          randomUUID: this.state.randomUUID,
          accountId: this.props.accountId,
          password: this.props.password,
          verifyCode: values.phoneVerifyCode,
          phoneCode: values.phoneCode,
          phoneNumber: values.phoneNumber,
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
            this.props.history.push('/index_menu');
          } else {
            message.error(response.message);
          }
        });
      }
    });
  };

  sendCode = () => {
    message.success(formatMessage({ id: 'user-login.login.message-get-verifycode-success' }));
    // 参数定义
    let param: Map<string, string> = new Map();
    // 初期化固定是手机账号密码登录
    param.set('type', '2');
    // phoneCode中'+'需要转码
    param.set('phoneCode', this.state.phoneCode);
    param.set('phoneNumber', this.state.phoneNumber);
    //短信场景：1、身份验证；2、登录确认 3、登录异常；4、用户注册；5、修改密码；6、信息变更
    param.set('templateCode', '2');
    param.set('languageType', '0');
    //  发送短信验证码 这里不需要知道API发送的是什么验证码
    getRequest('/sys/verify/code', param, (response: any) => { });
    this.setState({
      buttonDisabled: true,
      buttonText: formatMessage({ id: 'Index-user-login-60s Send' }),
    });
    // 每隔一秒执行一次clock方法
    this.timeChange = setInterval(this.count, 1000);
  };

  count = () => {
    let ti = this.state.timeCount;
    if (ti > 0) {
      // 当ti>0时执行更新方法
      ti -= 1;
      this.setState({
        timeCount: ti,
        buttonText: formatMessage({ id: 'user-login.login.message-send-after' }, { second: ti }),
      });
    } else {
      // 当ti=0时执行终止循环方法
      clearInterval(Number(this.timeChange));
      this.setState({
        buttonDisabled: false,
        timeCount: 60,
        buttonText: formatMessage({ id: 'user-login.login.message-get-verifycode' }),
      });
    }
  };

  handleChange = (e: any) => {
    if (this.state.timeCount >= 60) {
      this.setState({
        phoneNumber: e.target.value,
      }, () => {
        if (isNil(this.props.form.getFieldValue('phoneNumber')) || this.props.form.getFieldValue('phoneNumber').length < 11) {
          this.setState({
            buttonDisabled: true,
          })
        } else {
          this.setState({
            buttonDisabled: false,
          })
        }
      }
      );
    }
  };

  //获取手机号段
  getDictData = () => {
    let params: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    // 缓存获取字典一览
    getRequest('/sys/dict/all', params, (response: any) => {
      if (response.status === 200) {
        response.data['zh'].map((item: dicts) => {
          if ('phone_code' === item.name) {
            this.setState({ phoneCodeDict: item.items })
            return;
          }
        });
      }
    });
  }

  //号段选择框
  selectPhoneCode = (id: any, option: any) => {
    this.setState({
      phoneCode: id,
    });
    focus();
  };

  serach = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const phoneCodeDict = isNil(this.state) || isNil(this.state.phoneCodeDict) ? [] : this.state.phoneCodeDict;
    // 国家区号
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: '+86',
    })(
      <Select
        showSearch
        optionFilterProp="children"
        onSelect={this.selectPhoneCode}
        filterOption={this.serach}
        style={{ minWidth: '80px' }}
      >
        {phoneCodeDict.map((item: any) => (
          <Select.Option value={item.textValue}>{item.textValue}</Select.Option>
        ))}
      </Select>,
    );

    return (
      <Form className="login-form" onSubmit={this.handlePhoneLogin}>
        <Row gutter={25}>
          <Col span={23}>
            <Form.Item>
              {getFieldDecorator('phoneNumber', {
                initialValue:
                  isNil(this.state) || isNil(this.state.phoneNumber)
                    ? ''
                    : this.state.phoneNumber,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'user-login.login.pls-input-phonenumber-null' }),
                  },
                  {
                    pattern: new RegExp(/^[0-9]\d*$/),
                    message: formatMessage({ id: 'insuranceForShipper-insuranceAdd.phonenumber.enter.correct' }),
                  },
                ],
              })(
                <Input
                  addonBefore={prefixSelector}
                  onChange={this.handleChange}
                  placeholder={formatMessage({ id: 'user-login.login.pls-input-phonenumber' })}
                  prefix={<Icon type="user" />}
                  maxLength={20}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={25}>
          <Col span={11}>
            <Form.Item>
              {getFieldDecorator('phoneVerifyCode', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'user-login.login.pls-input-verifycode-null' }),
                  },
                  {
                    min: 6,
                    message: formatMessage({ id: 'user-login.login.pls-input-min-phone-verifycode' }),
                  },
                ],
              })(
                <Input
                  className="inputPadding"
                  placeholder={formatMessage({ id: 'user-login.login.verifycode' })}
                  prefix={<Icon type="safety-certificate" />}
                  maxLength={6}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <Button
                style={{ width: '100%' }}
                type="primary"
                disabled={
                  this.state == null || this.state.buttonDisabled == null
                    ? true
                    : this.state.buttonDisabled
                }
                onClick={this.sendCode}
              >
                {this.state == null || this.state.buttonText == ''
                  ? this.defaultButtonText
                  : this.state.buttonText}
              </Button>
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

const LoginPhoneForm = Form.create({ name: 'user_login_phone' })(UserLoginPhone);
export default LoginPhoneForm;
