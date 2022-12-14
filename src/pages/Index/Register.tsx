import { getRequest, postRequest } from '@/utils/request';
import { dicts } from '@/utils/utils';
import { Button, Checkbox, Col, Form, Icon, Input, message, Modal, Radio, Row, Select, Typography } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { isNil } from 'lodash';
import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import { getLocale, setLocale, FormattedMessage } from 'umi-plugin-react/locale';
import {registration_agreement} from '../FuncModel/Protocol/protocols';

const { Title, Text } = Typography;
let a = 1;
interface RegisterFormStates extends FormComponentProps {
  accountId: string;
  history: any;
  password: string;
  newPassowrd: string;
  modalVisible: boolean;
  agreePro: boolean;
  buttonDisabled: boolean;
  timeCount: number;
  submitPassword: string;

  phoneCode: string;
  phoneNumber: string;
  verifyCode: string;
  languageType: number;
  userType: number;
  vcodeBase64: string;
  buttonText: string;
  verifyButton: boolean;
  verifyButtonState: boolean;

  phoneCodeDict: any;
  pwdFlag: boolean;
}
//注册页面
class RegisterForm extends React.Component<RegisterFormStates, RegisterFormStates> {
  constructor(prop: RegisterFormStates) {
    super(prop);
  }

  private timeChange: NodeJS.Timeout | null = null;

  componentWillMount = () => {
    this.getDictData();
  }

  // 初期化
  componentDidMount = () => {
    this.setState({
      accountId: '',
      password: '',
      phoneCode: '+86',
      phoneNumber: '',
      verifyCode: '',
      userType: 4,
      languageType: 0,
      modalVisible: false,
      agreePro: false,
      buttonDisabled: true,
      timeCount: 60,
      submitPassword: '',
      vcodeBase64: '',
      buttonText: formatMessage({ id: 'user-login.login.message-get-verifycode' }),
      verifyButton: true, //控制获取验证码的按钮显示
      verifyButtonState:true,
      phoneCodeDict: []
    });
  };

  //获取验证码
  getVerifyCode() {
    this.setState({
      verifyButton: true,
      verifyButtonState:false,
    })
    // 参数定义
    let param: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    param.set('type', '2');
    // phoneCode中'+'需要转码
    param.set(
      'phoneCode',
      this.state.phoneCode);
    param.set('phoneNumber', this.state.phoneNumber);
    //短信场景：1、身份验证；2、登录确认3、登录异常；4、用户注册；5、修改密码；6、信息变更
    param.set('templateCode', '4');
    param.set('languageType', '0');
    // 获取验证码
    getRequest('/sys/verify/code', param, (response: any) => {
      if (response.status === 200) {
        this.setState({
          buttonText: formatMessage({ id: 'Index-FindPass-20s Send' }),
        });
      }
      // 每隔一秒执行一次clock方法
      this.timeChange = setInterval(this.count, 1000);
    });
  }

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
        verifyButton: false,
        verifyButtonState:true,
        timeCount: 60,
        buttonText: formatMessage({ id: 'Index-FindPass-getVerificationCode' }),
      });
    }
  };

  // 同意协议
  agreeChange = (e: { target: { checked: any } }) => {
    this.setState({
      agreePro: e.target.checked,
      buttonDisabled: !e.target.checked,
    });
  };

  // 协议modelOK按下事件
  handleOk = () => {
    this.setState({
      modalVisible: false,
      agreePro: true,
      buttonDisabled: false,
    });
  };

  // 协议model取消按下事件
  handleCancel = () => {
    this.setState({
      modalVisible: false,
      agreePro: false,
      buttonDisabled: true,
    });
  };

  //密码验证
  checkPassWord (name: string, password: any, callback: any) {
    var str = password;
    var reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/);
    if (!isNil(str) && str !== '' && str.length < 8) {
      this.setState({pwdFlag : false,});
      callback(formatMessage({ id: 'user-login.login.pls-input-length-check', }));
    } else if (!reg.test(str)) {
      this.setState({pwdFlag : false,});
      callback(formatMessage({ id: 'user-login.login.pls-input-input-check', }));
    } else {
      this.setState({pwdFlag : true,});
      callback();
    }
  };

  // 输入密码一致
  checkSamePassword(password: string, rule: any, value: any, callback: any) {
    a = 1;
    if (value !== '' && password !== '' && a === 1 && this.state.pwdFlag) {
      a = 2;
      if (value !== password) {
        a = 1;
        callback(formatMessage({ id: 'Index-FindPass-contrastNewOldPass' }));
      } else {
        this.props.form.resetFields(['password', 'submitPassword']);
        this.props.form.setFieldsValue({ password: password });
        this.props.form.setFieldsValue({ submitPassword: password });
        callback();
      }
    } else {
      callback();
    }
  }

  //协议model展示
  showProtocol = () => {
    this.setState({
      modalVisible: true,
    });
  };

  sendCode = () => {
    this.getVerifyCode();
  };

  // 角色的选择改变事件
  roleChange() {
    // this.setState({
    //   buttonDisabled: false,
    // });
  }

  // 注册提交数据
  handRegisterForm = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let requestData = {
          type: 1,
          accountId: this.state.accountId,
          password: this.state.password,
          phoneCode: values.phoneCode,
          phoneNumber: this.state.phoneNumber,
          verifyCode: this.state.verifyCode,
          userType: this.state.userType,
          languageType: this.state.languageType,
        };
        postRequest('/sys/user/register', JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {
            this.props.history.push('/user/login');
            message.success(formatMessage({ id: 'Index-register.registerSuccess' }), 2);
          } else {
            message.error(response.message, 2);
          }
        });
      }
    });
  };

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

  changePhoneNumber(e: any) {
    if(this.state.verifyButtonState){
    this.setState(
      {
        phoneNumber: e.target.value,
      },
      () => {
        if (
          isNil(this.props.form.getFieldValue('phoneNumber')) ||
          this.props.form.getFieldValue('phoneNumber').length < 11
        ) {
          this.setState({
            verifyButton: true,
          });
        } else {
          this.setState({
            verifyButton: false,
          });
        }
      },
    );}
  }
  CheckAccountId = (name: string, password: any, callback: any) => {
    var str = password;
    var reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/);
    if (!isNil(str) && str !== '' && str.length < 8) {
      callback(formatMessage({ id: 'user-login.login.account-input-length-check', }));
    } else if (!reg.test(str)) {
      callback(formatMessage({ id: 'user-login.login.account-input-input-check', }));
    } else {
      callback();
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

  // 切换语言
  changeLanuage = (value: any) => {
    // 获取当前语言
    this.setState({ languageType: value })
    if (value === '0') {
      // 设置为 zh-CN
      setLocale('zh-CN');
    } else {
      // 设置为 en-US
      setLocale('en-US');
    }
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
      <div>
        <div className="containerRegister">
          <div className="registerPanel">
            <Title>{formatMessage({ id: 'Index-register.registerAccount' })}</Title>
            <Form onSubmit={this.handRegisterForm}>
              <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={12} style={{float:'left',textAlign:'left'}}>
                  <Text style={{ color: 'white' }}>
                    {formatMessage({ id: 'Index-register.before' })}
                  </Text>
                  <Button href="/user/login" type="link">
                    {formatMessage({ id: 'Index-register.after' })} 
                  </Button>
                </Col>
                <Col span={6}></Col>
              </Row>
              <Row gutter={24}>
                <Col span={6}></Col>
                  <Col span={12}>
                    <Form.Item>
                    {getFieldDecorator('languageType', {
                      initialValue:getLocale() === 'en-US'? "1" : "0",
                      })(
                      <Select onChange={this.changeLanuage}>
                          <option value="0" ><Icon type="global" style={{paddingRight:5}}/>{formatMessage({ id: 'Index-register.chinese' })}</option>
                          <option value="1"><Icon type="global" style={{paddingRight:5}}/>{formatMessage({ id: 'Index-register.english' })}</option>
                      </Select>
                    )}
                    </Form.Item>
                  </Col>
                <Col span={6}></Col>
              </Row>
              <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={12}>
                  <Form.Item>
                    {getFieldDecorator('accountId', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.accountId)
                          ? ''
                          : this.state.accountId,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'Index-register.nullAccount' }),
                        },
                        {
                          validator: this.CheckAccountId.bind(this),
                        },
                      ],
                    })(
                      <Input
                        maxLength={15}
                        placeholder={formatMessage({ id: 'Index-register.setAccount' })}
                        prefix={<Icon type="user" />}
                        onChange={e => this.setState({ accountId: e.target.value })}
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
                    {getFieldDecorator('password', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.password) ? '' : this.state.password,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'Index-register.nullPass' }),
                        },
                        {
                          validator: this.checkPassWord.bind(this),
                        },
                        {
                          validator: this.checkSamePassword.bind(
                            this,
                            isNil(this.state) || isNil(this.state.submitPassword)
                              ? ''
                              : this.state.submitPassword,
                          ),
                        },
                      ],
                    })(
                      <Input
                        maxLength={16}
                        placeholder={formatMessage({ id: 'Index-register.setPass' })}
                        prefix={<Icon type="lock" />}
                        type="password"
                        onChange={e => this.setState({ password: e.target.value })}
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
                    {getFieldDecorator('submitPassword', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.submitPassword)
                          ? ''
                          : this.state.submitPassword,
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'Index-register.nullPass' }),
                        },
                        {
                          validator: this.checkSamePassword.bind(
                            this,
                            isNil(this.state) || isNil(this.state.password)
                              ? ''
                              : this.state.password,
                          ),
                        },
                      ],
                    })(
                      <Input
                        maxLength={128}
                        placeholder={formatMessage({ id: 'Index-register.setPassAgain' })}
                        prefix={<Icon type="lock" />}
                        type="password"
                        onChange={e => this.setState({ submitPassword: e.target.value })}
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
                    {getFieldDecorator('phoneNumber', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'Index-register.nullPhone' }),
                        },
                        {
                          pattern: new RegExp(/^[0-9]\d*$/),
                          message: formatMessage({ id: 'insuranceForShipper-insuranceAdd.phonenumber.enter.correct' }),
                        },
                      ],
                    })(
                      <Input
                        addonBefore={prefixSelector}
                        placeholder={formatMessage({ id: 'Index-register.inputPhone' })}
                        prefix={<Icon type="user" />}
                        maxLength={20}
                        onChange={e => {
                          this.changePhoneNumber(e);
                        }}
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
                    {getFieldDecorator('verifyCode', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({
                            id: 'user-login.login.pls-input-verifycode-null',
                          }),
                        },
                        {
                          min: 6,
                          message: formatMessage({
                            id: 'user-login.login.pls-input-min-phone-verifycode',
                          }),
                        },
                      ],
                    })(
                      <Input
                        placeholder={formatMessage({ id: 'Index-register.inputVerification' })}
                        onChange={e => this.setState({ verifyCode: e.target.value })}
                        maxLength={6}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: '4px' }}>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    disabled={
                      !isNil(this.state) && this.state.verifyButton
                        ? this.state.verifyButton
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
                <Col span={5}></Col>
                <Col span={6}>
                  <Text style={{ color: 'white' }}>
                    {formatMessage({ id: 'Index-register.inputRegisterType' })}
                  </Text>
                </Col>
                <Col span={12}></Col>
              </Row>

              <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={12}>
                  <Form.Item>
                    <Radio.Group
                      name="radiogroup"
                      defaultValue={4}
                      onChange={e => this.setState({ userType: e.target.value })}
                    >
                      <Radio value={4}>{formatMessage({ id: 'Index-register.consignor' })}</Radio>
                      <Radio value={5}>{formatMessage({ id: 'Index-register.shipowner' })}</Radio>
                    </Radio.Group>
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
                      disabled={
                        isNil(this.state) || isNil(this.state.buttonDisabled)
                          ? true
                          : this.state.buttonDisabled
                      }
                      htmlType="submit"
                    >
                      {' '}
                      {formatMessage({ id: 'Index-register.register' })}{' '}
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={6}></Col>
              </Row>

              <Row gutter={24} style={{ fontSize: 20 }}>
                <Col span={6}></Col>
                <Col span={12}>
                  <Form.Item>
                    <Checkbox
                      checked={
                        isNil(this.state) || isNil(this.state.agreePro)
                          ? false
                          : this.state.agreePro
                      }
                      onChange={this.agreeChange}
                    >
                      {' '}
                      {formatMessage({ id: 'Index-register.iagree' })}{' '}
                      <Button type="link" href="#" onClick={this.showProtocol}>
                        {formatMessage({ id: 'Index-register.daoyuAgreement' })}
                      </Button>{' '}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={6}></Col>
              </Row>
            </Form>
          </div>

          <Modal className="protocolModal"
            title={formatMessage({ id: 'Index-register.daoyuAgreementText' })}
            visible={
              isNil(this.state) || isNil(this.state.modalVisible) ? false : this.state.modalVisible
            }
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
            >
              <p style={{textAlign:"left"}} dangerouslySetInnerHTML={{__html:registration_agreement}}></p>
              <Button key="submit" type="primary" style={{textAlign:"center",top:"10px",width:"180px"}} onClick={()=>this.setState({modalVisible:false})}>
                <FormattedMessage id="Index-UserMenu.confirm" />
              </Button>
          </Modal>
        </div>
      </div>
    );
  }
}
const Register = Form.create({ name: 'user_register' })(RegisterForm);
export default Register;
