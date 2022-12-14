import getRequest, { putRequest } from '@/utils/request';
import { Button, Col, Form, Input, message, Row, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'dva/router';
import { isNil } from 'lodash';
import React from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi-plugin-react/locale';
import { default as ButtonOptionComponent, default as QueryButton } from '../../Common/Components/ButtonOptionComponent';
import LabelTitle from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import '../../Index/Index.less';
import { checkEmail } from '@/utils/validator';


type AccountProps = FormComponentProps & RouteComponentProps;

class AccountView extends React.Component<AccountProps> {
  state = {
    accountId: '',
    password: '         ',
    firstName: '',
    lastName: '',
    userType: '',
    languageType: '',
    phoneNumber: '',
    inputType: 'password',
    guid: '',
    phoneCode: '',
    address: '',
    disable: true,
    hasEmail: false,
  };

  //跳转修改密码页面
  callToPw = () => {
    this.props.history.push('/account_manager/modiPw/' + this.state.guid);
  };

  //跳转修改手机号码页面
  callToPhone = (num: string, code: string) => {
    let param: Map<string, any> = new Map();
    // 初期化固定是手机账号密码登录
    param.set('type', 2);
    param.set('phoneCode', code);
    param.set('phoneNumber', num);
    param.set('templateCode', 6);
    if (getLocale() === 'zh-CN') {
      param.set('languageType', 0);
    } else {
      param.set('languageType', 1);
    }
    getRequest('/sys/verify/code', param, (response: any) => {
      if (response.status === 200) {
        this.props.history.push('/account_manager/sendOldPhone/' + this.state.guid + '/' + num + '/' + code);
      }
    });
  };

  //跳转邮箱绑定页面
  callToEmail = () => {
    this.props.form.validateFields(['address'], (err: any, values: any) => {
      if (!err) {
        let param: Map<string, string> = new Map();
        // 初期化固定是手机账号密码登录
        param.set('email', this.state.address);
        getRequest('/sys/verify/mailVerification', param, (response: any) => { });
        this.props.history.push('/account_manager/sendNewEmail/' + this.state.guid + '/' + this.state.address);
      }
    });
  };

  //跳转修改邮箱页面
  sendEmialMessage = () => {
    let param: Map<string, string> = new Map();
    // 初期化固定是手机账号密码登录
    param.set('email', this.state.address);
    getRequest('/sys/verify/mailVerification', param, (response: any) => { });
    this.props.history.push('/account_manager/sendOldEmail/' + this.state.guid + '/' + this.state.address);
  };

  //邮箱绑定按钮活性
  emailChange = (e: any) => {
    if (e.target.value.length === 0) {
      this.setState({
        disable: true,
      });
    } else {
      this.setState({
        address: e.target.value,
      }, () => {
        this.props.form.validateFields(['address'], (err: any, values: any) => {
          if (!err) {
            this.setState({
              disable: false,
            });
          } else {
            this.setState({
              disable: true,
            });
          }
        });
      });
    }
  }

  //保存
  handleSubmit() {
    this.props.form.validateFields(['firstName', 'lastName'], (err: any, values: any) => {
      if (!err) {
        let requestData = {};
        requestData = {
          type: 3,
          guid: this.state.guid,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
        };
        // 修改请求
        putRequest('/sys/user', JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {
            message.success(formatMessage({ id: 'AccountManagement-ModifyPassword.name.correct' }));
            this.initData();
          } else {
            message.error(formatMessage({ id: 'AccountManagement-AccountView.save.failed' }));
          }
        });
      }
    });
  }

  //初期化事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    this.getPalletList();
  }

  //获取数据
  getPalletList() {
    let guid = localStorage.getItem('userId');
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    // 初期化获取数据
    getRequest('/sys/user/' + guid, param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            guid: response.data.user.guid,
            accountId: response.data.user.accountId,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            phoneNumber: response.data.user.phoneNumber,
            phoneCode: response.data.user.phoneCode,
            userType: response.data.user.userType,
            languageType: response.data.user.languageType,
            address: response.data.user.email ? response.data.user.email : '',
            hasEmail: response.data.user.email ? true : false,
          });
        }
      }
    });
  }

  render() {
    const back = () => {
      this.props.history.push('/index_menu');
    };
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={commonCss.container}>
        <LabelTitle text={formatMessage({ id: 'AccountManagement-AccountView.account.management' })} event={() => back()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={11}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'AccountManagement-AccountView.name' })} required>
                  <Input
                    value={this.state.accountId}
                    disabled />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'AccountManagement-AccountView.password' })} required>
                  <Input
                    placeholder={formatMessage({ id: 'AccountManagement-AccountView.password' })}
                    type={this.state.inputType}
                    value={this.state.password}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item {...formItemLayout}>
                  <QueryButton
                    text={formatMessage({ id: 'AccountManagement-AccountView.update' })}
                    type="Edit"
                    event={() => this.callToPw()}
                    disabled={false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={11}>
                <Col span={12}>
                  <Form.Item {...smallFormItemLayout} label={formatMessage({ id: 'AccountManagement-AccountView.first.name' })} required>
                    {getFieldDecorator('firstName', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'AccountManagement-AccountView.first.name.null' })
                        },
                      ],
                      initialValue: this.state.firstName,
                    })(
                      <Input
                        maxLength={32}
                        placeholder={formatMessage({ id: 'AccountManagement-AccountView.first.name.enter' })}
                        onChange={e => this.setState({ firstName: e.target.value })}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...smallFormItemLayout} label={formatMessage({ id: 'AccountManagement-AccountView.name.really' })} required>
                    {getFieldDecorator('lastName', {
                      rules: [
                        {
                          required: true,
                          message: formatMessage({ id: 'AccountManagement-AccountView.name.null' })
                        },
                      ],
                      initialValue: this.state.lastName,
                    })(
                      <Input
                        maxLength={32}
                        placeholder={formatMessage({ id: 'AccountManagement-AccountView.name.enter' })}
                        onChange={e => this.setState({ lastName: e.target.value })}
                      />
                    )}

                  </Form.Item>
                </Col>
              </Col>
              <Col span={11}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'index-accountManager-phonenumber' })} required>
                <Input
                    disabled
                    placeholder="+86"
                    style={{ width: '15%' }}
                    value={
                      isNil(this.state) || isNil(this.state.phoneCode)
                        ? ''
                        : this.state.phoneCode
                    }
                  />
                  <Input
                    disabled
                    style={{ width: '85%' }}
                    placeholder={formatMessage({ id: 'AccountManagement-AccountView.phonenumber' })}
                    value={
                      isNil(this.state) || isNil(this.state.phoneNumber)
                        ? ''
                        : this.state.phoneNumber
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  <QueryButton
                    text={formatMessage({ id: 'AccountManagement-AccountView.update' })}
                    type="Edit"
                    event={() => this.callToPhone(this.state.phoneNumber, this.state.phoneCode)}
                    disabled={false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={11}>
                <Col span={21}>
                  {this.state.hasEmail ? (<Form.Item {...formItemLayout} label={formatMessage({ id: 'AccountManagement-AccountView.email' })} required>
                    <Input
                      placeholder={formatMessage({ id: 'AccountManagement-AccountView.email.enter' })}
                      value={this.state.address}
                      disabled
                    />
                  </Form.Item>) : (<Form.Item {...formItemLayout} label={formatMessage({ id: 'AccountManagement-AccountView.email' })} required>
                    {getFieldDecorator('address', {
                      rules: [
                        {
                          validator: checkEmail.bind(this, formatMessage({ id: 'AccountManagement-AccountView.email' })),
                        },
                      ],
                      initialValue: '',
                    })(
                      <Input
                        maxLength={32}
                        placeholder={formatMessage({ id: 'AccountManagement-AccountView.email.enter' })}
                        style={{ width: '95%' }}
                        // value={this.state.address}
                        onChange={this.emailChange}
                      />
                    )}
                  </Form.Item>
                    )}
                </Col>
                <Col span={3}>
                  <Form.Item>
                    {this.state.hasEmail ? (<Button
                      icon="form"
                      onClick={this.sendEmialMessage}
                      size="small"
                      style={{ backgroundColor: '#EBC46D', color: '#FFFFFF' }}
                    >
                      <FormattedMessage id="AccountManagement-AccountView.update" />
                    </Button>) : (<Button type="primary"
                      icon="form"
                      onClick={this.callToEmail}
                      disabled={this.state.disable}
                      size="small"
                    >
                      <FormattedMessage id="AccountManagement-AccountView.binding" />
                    </Button>)}
                  </Form.Item>
                </Col>
              </Col>
              <Col span={13}></Col>
            </Row>
            <Row>
              <Col span={10}></Col>
              <Col span={2} style={{ marginBottom: '20px' }}>
                <ButtonOptionComponent
                  type="Save"
                  text={formatMessage({ id: 'AccountManagement-AccountView.save' })}
                  event={() => {
                    this.handleSubmit();
                  }}
                  disabled={false}
                />
              </Col>
              <Col
                span={2}
                style={{ marginBottom: '20px', textAlign: 'left', width: '45%', paddingLeft: '2%' }}
              >
                <Button type="primary" onClick={back}>
                  <FormattedMessage id="AccountManagement-AccountView.close" />
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const AccountView_Form = Form.create({ name: 'AccountView_Form' })(AccountView);

export default AccountView_Form;
