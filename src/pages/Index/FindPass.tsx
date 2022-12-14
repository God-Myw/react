import getRequest, { putRequest } from '@/utils/request';
import { dicts } from '@/utils/utils';
import { CheckPassWord } from '@/utils/validator';
import { Button, Col, Form, Icon, Input, message, Row, Select, Typography } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { isNil } from 'lodash';
import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import { getLocale } from 'umi-plugin-react/locale';

const { Title } = Typography;

let a = 1;
interface FindPassFormStates extends FormComponentProps {

  history: any;
  phoneVerifyCode: string;
  verifyCode: string;
  newPassword: string;
  repeatPassword: string;
  buttonText: string;
  buttonDisabled: boolean,
  timeCount: number;
  randomUUID: string;
  phoneCode: string;
  phoneNumber: string;
  vcodeBase64: string;
  phoneCodeDict: any[];
}
//注册页面
class FindPassForm extends React.Component<FindPassFormStates, FindPassFormStates> {
  constructor(prop: FindPassFormStates) {
    super(prop);
  }

  private timeChange: NodeJS.Timeout | null = null;

  // 初期化
  componentDidMount = () => {
    this.setState({
      phoneVerifyCode: '',
      newPassword: '',
      repeatPassword: '',
      verifyCode: '',
      buttonText: formatMessage({ id: 'Index-FindPass-getVerificationCode' }),
      buttonDisabled: true,
      timeCount: 60,
      randomUUID: '',
      phoneCode: '+86',
      phoneNumber: '',
      vcodeBase64: '',
      phoneCodeDict: []
    });
    this.getVerifyCode();
    this.getDictData();
  };

  //获取图片验证码
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
          randomUUID: response.data.randomUUID,
        });
      }
    });
  };

  // 输入密码一致
  checkSamePassword(password: string, rule: any, value: any, callback: any) {
    a = 1;
    if (value !== '' && password !== '' && a === 1) {
      a = 2;
      if (value !== password) {
        a = 1;
        callback(formatMessage({ id: 'Index-FindPass-contrastNewOldPass' }));
      } else {
        this.props.form.resetFields(['newPassword', 'repeatPassword']);
        this.props.form.setFieldsValue({ newPassword: password });
        this.props.form.setFieldsValue({ repeatPassword: password });
        callback();
      }
    } else {
      callback();
    }
  }

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

  handlePhoneCodeSelect = (value: any) => {
    this.setState({
      phoneCode: value,
    });
  };

  // 注册提交数据
  handRegisterForm = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let requestData = {
          type: 1,
          phoneCode: values.phoneCode,
          phoneNumber: values.phoneNumber,
          phoneVerifyCode: values.phoneVerifyCode,
          randomUUID: this.state.randomUUID,
          newPassword: values.newPassword,
          repeatPassword: values.repeatPassword,
          verifyCode: values.verifyCode,
        };
        putRequest('/sys/user/password/find', JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {
            message.success('密码重设成功!');
            this.props.history.push('/user/login');
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
    param.set('templateCode', '5');
    if (getLocale() === 'zh-CN') {
      param.set('languageType', '0');
    } else {
      param.set('languageType', '1');
    }
    //  发送短信验证码 这里不需要知道API发送的是什么验证码
    getRequest('/sys/verify/code', param, (response: any) => { });
    this.setState({
      buttonDisabled: true,
      buttonText: formatMessage({ id: 'Index-FindPass-20s Send' })
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
        buttonText: ti + formatMessage({ id: 'Index-FindPass-s Send' }),
      });
    } else {
      // 当ti=0时执行终止循环方法
      clearInterval(Number(this.timeChange));
      this.setState({
        buttonDisabled: false,
        timeCount: 60,
        buttonText: formatMessage({ id: 'Index-FindPass-getVerificationCode' }),
      });
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
      <div>
        <div className="containerRegister">
          <div className="registerPanel">
            <Title>{formatMessage({ id: 'Index-FindPass-title' })}</Title>
            <Form onSubmit={this.handRegisterForm}>
              <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={12}>
                  <Form.Item>
                    {getFieldDecorator('phoneNumber', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.phoneNumber)
                          ? ''
                          : this.state.phoneNumber,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'Index-FindPass-inputPhone-null' }),
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
                        placeholder={formatMessage({ id: 'Index-FindPass-inputPhone' })}
                        prefix={<Icon type="user" />}
                        maxLength={20}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}></Col>
              </Row>
              <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={6}>
                  <Form.Item>
                    {getFieldDecorator('phoneVerifyCode', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.phoneVerifyCode)
                          ? ''
                          : this.state.phoneVerifyCode,
                      rules: [{
                        required: true,
                        message: formatMessage({ id: 'user-login.login.pls-input-verifycode-null' }),
                      },
                      {
                        min: 6,
                        message: formatMessage({ id: 'user-login.login.pls-input-min-phone-verifycode' }),
                      }],
                    })(
                      <Input
                        placeholder={formatMessage({ id: 'Index-FindPass-inputVerificationCode' })}
                        prefix={<Icon type="safety-certificate" />}
                        maxLength={6}
                        onChange={e => this.setState({ phoneVerifyCode: e.target.value })}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    disabled={
                      !isNil(this.state) && this.state.buttonDisabled
                        ? this.state.buttonDisabled
                        : false
                    }
                    onClick={this.sendCode}
                  >
                    {isNil(this.state) || isNil(this.state.buttonText) ? '' : this.state.buttonText}
                  </Button>
                </Col>
                <Col span={6}></Col>
              </Row>
              <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={6}>
                  <Form.Item>
                    {getFieldDecorator('verifyCode', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.verifyCode)
                          ? ''
                          : this.state.verifyCode,
                      rules: [{
                        required: true,
                        message: formatMessage({ id: 'user-login.login.pls-input-verifycode-null' }),
                      },
                      {
                        min: 4,
                        message: formatMessage({ id: 'user-login.login.pls-input-min-verifycode' }),
                      },],
                    })(
                      <Input
                        placeholder={formatMessage({ id: 'Index-FindPass-inputVerificationCode' })}
                        prefix={<Icon type="safety-certificate" />}
                        maxLength={4}
                        onChange={e => this.setState({ verifyCode: e.target.value })}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <img
                    src={
                      isNil(this.state) || isNil(this.state.vcodeBase64)
                        ? ''
                        : this.state.vcodeBase64
                    }
                    style={{ width: '100%', height: 35, cursor: 'pointer' }}
                    onClick={() => this.getVerifyCode()}
                  />
                </Col>
                <Col span={6}></Col>
              </Row>
              <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={12}>
                  <Form.Item>
                    {getFieldDecorator('newPassword', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.newPassword) ? '' : this.state.newPassword,
                      rules: [{ required: true, message: formatMessage({ id: 'Index-FindPass-passNotNull' }) },
                      {
                        validator: CheckPassWord.bind(this),
                      },
                      {
                        validator: this.checkSamePassword.bind(
                          this,
                          isNil(this.state) || isNil(this.state.repeatPassword)
                            ? ''
                            : this.state.repeatPassword,
                        ),
                      }],
                    })(
                      <Input
                        maxLength={16}
                        placeholder={formatMessage({ id: 'Index-FindPass-setYoutpass' })}
                        prefix={<Icon type="lock" />}
                        type='password'
                        onChange={e => this.setState({ newPassword: e.target.value })}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}></Col>
              </Row>
              <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={12}>
                  <Form.Item>
                    {getFieldDecorator('repeatPassword', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.repeatPassword)
                          ? ''
                          : this.state.repeatPassword,
                      rules: [
                        { required: true, message: formatMessage({ id: 'Index-FindPass-setPassagain' }) },
                        {
                          validator: this.checkSamePassword.bind(
                            this,
                            isNil(this.state) || isNil(this.state.newPassword)
                              ? ''
                              : this.state.newPassword,
                          ),
                        },
                      ],
                    })(
                      <Input
                        maxLength={16}
                        placeholder={formatMessage({ id: 'Index-FindPass-setPassagain' })}
                        prefix={<Icon type="lock" />}
                        type='password'
                        onChange={e => this.setState({ repeatPassword: e.target.value })}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}></Col>
              </Row>
              <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={12}>
                  <Form.Item>
                    <Button
                      type="primary"
                      block
                      htmlType="submit"
                    >
                      {' '}
                      {formatMessage({ id: 'Index-FindPass-submit' })}{' '}
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={6}></Col>
              </Row>

            </Form>
          </div>
        </div>
      </div>
    );
  }
}
const FindPass = Form.create({ name: 'user_findpass' })(FindPassForm);
export default FindPass;
