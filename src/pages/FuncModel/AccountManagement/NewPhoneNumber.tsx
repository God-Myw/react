import getRequest from '@/utils/request';
import { getDictDetail } from '@/utils/utils';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'dva/router';
import React from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi-plugin-react/locale';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';


type NewPhoneNumberProps = FormComponentProps & RouteComponentProps;

class NewPhoneNumber extends React.Component<NewPhoneNumberProps> {
  //返回
  onBack = () => {
    this.props.history.push('/account_manager/view');
  };

  state = {
    num: '',
    code: '+86',
    verifyButton: true,
  };

  //确认手机号码发送验证码
  submit = () => {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let param: Map<string, any> = new Map();
        param.set('type', 2);
        param.set('phoneCode', values.phoneCode);
        param.set('phoneNumber', this.state.num);
        param.set('templateCode', 6);
        if (getLocale() === 'zh-CN') {
          param.set('languageType', 0);
        } else {
          param.set('languageType', 1);
        }
        getRequest('/sys/verify/code', param, (response: any) => {
          if (response.status = 200) {
            this.props.history.push(
              '/account_manager/sendNewPhone/' + this.props.match.params['guid'] + '/' + this.state.num + '/' + this.state.code,
            );
          }
        });
      }
    });
  };

  //判断手机号码是否重复
  check(rule: any, value: any, callback: any) {
    // 修改请求
    let param: Map<string, any> = new Map();
    param.set('type', 1);
    param.set('phoneCode', this.state.code);
    param.set('phoneNumber', value);
    getRequest('/sys/user/checkPhone', param, (response: any) => {
      if (response.status === null) {
        callback(new Error(formatMessage({ id: 'AccountManagement-NewPhoneNumber.repeat' })));
      } else {
        this.setState({
          verifyButton: false,
        })
        callback();
      }
    });
  }

  //号段选择框
  selectPhoneCode = (id: any, option: any) => {
    this.setState({
      code: id,
    });
    focus();
  };

  serach = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  render() {
    const smallFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { getFieldDecorator } = this.props.form;
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
        {getDictDetail("phone_code").map((item: any) => (
          <Select.Option value={item.textValue}>{item.textValue}</Select.Option>
        ))}
      </Select>,
    );
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={formatMessage({ id: 'AccountManagement-NewPhoneNumber.update' })} event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item style={{ textAlign: 'center' }} label="">
                  <span style={{ fontWeight: 'bolder', fontSize: '15px' }}>
                    <FormattedMessage id="AccountManagement-NewPhoneNumber.enter" />
                  </span>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}></Col>
              <Col span={12} {...smallFormItemLayout}>
                <Form.Item>
                  {getFieldDecorator('phoneNumber', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Index-FindPass-inputPhone-null' }),
                      },
                      {
                        pattern: new RegExp(/^[0-9]\d*$/),
                        message: formatMessage({ id: 'insuranceForShipper-insuranceAdd.phonenumber.enter.correct' }),
                      },
                      {
                        validator: this.check.bind(this)
                      },
                    ],
                    getValueFromEvent: (event: any) => {
                      return event.target.value.replace(/\D/g, '');
                    },
                    initialValue: '',
                  })(
                    <Input
                      autoFocus
                      addonBefore={prefixSelector}
                      onChange={e => this.setState({ num: e.target.value })}
                      placeholder={formatMessage({ id: 'AccountManagement-AccountView.phonenumber' })}
                      maxLength={20}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item style={{ textAlign: 'center' }} label="">
                  <Button type="primary" onClick={this.submit} disabled={this.state.verifyButton}>
                    <FormattedMessage id="Common-Button.button.submit" />
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const NewPhoneNumber_Form = Form.create({ name: 'NewPhoneNumber_Form' })(NewPhoneNumber);
export default NewPhoneNumber_Form;
