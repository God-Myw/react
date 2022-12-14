import { putRequest } from '@/utils/request';
import { Checkbox, Col, Form, Input, message, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'dva/router';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { default as ButtonOptionComponent } from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { CheckPassWord } from '@/utils/validator';

type PasswordProps = FormComponentProps & RouteComponentProps;

class ModifyPassword extends React.Component<PasswordProps> {
  //返回
  onBack = () => {
    this.props.history.push('/account_manager/view');
  };

  state = {
    checkSelect: false,
    password: '',
    oldPassword: '',
    newPassword: '',
    repeatPassword: '',
    inputType: 'password',
    okSure: true,
    yes: true
  };

  //密码显示
  checkChange = (e: { target: { checked: any } }) => {
    this.setState({
      inputType: e.target.checked ? 'text' : 'password',
    });
  };

  //修改密码
  handleSubmit(type: string) {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err && this.state.oldPassword && this.state.newPassword && this.state.repeatPassword) {
        let requestData = {};
        requestData = {
          type: type,
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword,
          repeatPassword: this.state.repeatPassword,
        };
        // 修改请求
        putRequest('/sys/user/pwd/reset', JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {
            // 跳转首页
            message.success(
              formatMessage({ id: 'AccountManagement-ModifyPassword.password.update.successful' }),
            );
            this.props.history.push('/account_manager');
          } else {
            message.error(
              formatMessage({ id: 'AccountManagement-ModifyPassword.password.update.failed' }),
            );
            this.props.history.push('/account_manager/modiPw');
          }
        });
      }
    });
  }

  //判断两次密码是否输入一致
  checkPsd(rule: any, value: any, callback: any) {
    let password = this.props.form.getFieldValue('password');
    if (password && password !== value) {
      callback(
        new Error(formatMessage({ id: 'AccountManagement-ModifyPassword.password.different' })),
      );
      this.setState({ okSure: true });
    } else {
      //必输项验证通过后设置按钮活化
      this.setState({ okSure: false });
      callback();
    }
  }

  //判断旧密码是否输入正确
  check(rule: any, value: any, callback: any) {
    if (value != 0) {
      let requestData = {};
      requestData = {
        oldPassword: value
      };
      // 修改请求
      putRequest('/sys/user/oldPassword/check', JSON.stringify(requestData), (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          callback();
          this.setState({ yes: false });
        } else {
          callback(
            new Error(formatMessage({ id: 'AccountManagement-ModifyPassword.old.passwd.error' })),
          );
          this.setState({ yes: true });
        }
      });
    } else {
      callback();
      this.setState({ yes: true });
    }
  }

  //校验新密码
  checkNew(rule: any, value: any, callback: any) {
    if (value.length === 0) {
      callback(new Error(formatMessage({ id: 'AccountManagement-ModifyPassword.password.empty' })));
      this.setState({ okSure: true });
    } else {
      const reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,16}$/;
      let oldPassword = this.props.form.getFieldValue('oldPassword');
      if (value == oldPassword) {
        callback(
          new Error(formatMessage({ id: 'AccountManagement-ModifyPassword.same' })),
        );
        this.setState({ okSure: true });
      } else if (!reg.test(value)) {
        callback(
          new Error(formatMessage({ id: 'AccountManagement-ModifyPassword.password.format.error' })),
        );
        this.setState({ okSure: true });
      } else {
        callback();
        this.setState({ okSure: true });
      }
    }
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'AccountManagement-ModifyPassword.passwd.update' })}
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form {...formlayout} labelAlign="left">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="">
                  <Checkbox value={this.state.checkSelect} onChange={this.checkChange}>
                    <FormattedMessage id="AccountManagement-ModifyPassword.passwd.view" />
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'AccountManagement-ModifyPassword.old.passwd.enter' })}
                  required
                >
                  {getFieldDecorator('oldPassword', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'AccountManagement-ModifyPassword.old.passwd.enter',
                        }),
                      },
                      {
                        validator: CheckPassWord.bind(this),
                      },
                      {
                        validator: (rule: any, value: any, callback: any) => {
                          this.check(rule, value, callback);
                        },
                      },
                    ],
                  })(
                    <Input
                      maxLength={16}
                      type={this.state.inputType}
                      placeholder={formatMessage({
                        id: 'AccountManagement-ModifyPassword.old.case',
                      })}
                      onChange={e => this.setState({ oldPassword: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'AccountManagement-ModifyPassword.new.passwd.enter' })}
                  required
                >
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        validator: CheckPassWord.bind(this),
                      },
                      {
                        validator: (rule: any, value: any, callback: any) => {
                          this.checkNew(rule, value, callback);
                        },
                      },
                    ],
                  })(
                    <Input
                      maxLength={16}
                      type={this.state.inputType}
                      placeholder={formatMessage({
                        id: 'AccountManagement-ModifyPassword.Alphanumeric',
                      })}
                      onChange={e => this.setState({ newPassword: e.target.value, repeatPassword: '' })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'AccountManagement-ModifyPassword.enter.again' })}
                  required
                >
                  {getFieldDecorator('password2', {
                    rules: [
                      {
                        validator: CheckPassWord.bind(this),
                      },
                      {
                        validator: (rule: any, value: any, callback: any) => {
                          this.checkPsd(rule, value, callback);
                        },
                      },
                    ],
                  })(
                    <Input
                      maxLength={16}
                      type={this.state.inputType}
                      placeholder={formatMessage({
                        id: 'AccountManagement-ModifyPassword.Alphanumeric',
                      })}
                      onChange={e => this.setState({ repeatPassword: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row justify="space-around" type="flex">
              <Col>
                <Form.Item>
                  <ButtonOptionComponent
                    type="Approve"
                    text={formatMessage({ id: 'AccountManagement-ModifyPassword.confirm' })}
                    event={() => {
                      this.handleSubmit('1');
                    }}
                    disabled={this.state.okSure === false && this.state.yes === false ? false : true}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const ModiPassWord_Form = Form.create({ name: 'ModiPassWord_Form' })(ModifyPassword);
export default ModiPassWord_Form;
