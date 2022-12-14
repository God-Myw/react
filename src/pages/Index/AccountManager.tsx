import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import '../Index/Index.less';
import commonCss from '../Common/css/CommonCss.less';
import ButtonOptionComponent from '../Common/Components/ButtonOptionComponent';
import { RouteComponentProps } from 'dva/router';
import { formatMessage } from 'umi-plugin-locale';


class HorizontalLoginForm extends React.Component<RouteComponentProps> {
  componentDidMount() {
    // To disabled submit button at the beginning.
    // this.props.form.validateFields();
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  redirectModiPassWordPage = e => {
    this.props.router.push('/mod_password');
  };

  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    // const usernameError = isFieldTouched('username') && getFieldError('username');
    // const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <div className={commonCss.container}>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="ID">
                  {getFieldDecorator(`accountID`, {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'index-accountManager-id.null' }),
                      },
                    ],
                  })(<Input placeholder="ID" />)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'index-accountManager-password' })}>
                  <Input placeholder={formatMessage({ id: 'index-accountManager-password' })} readOnly />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={6}>
                <Form.Item {...smallFormItemLayout} label={formatMessage({ id: 'index-accountManager-family.name' })}>
                  {getFieldDecorator(`firstName`, {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'index-accountManager-family.name.null' }),
                      },
                    ],
                  })(<Input placeholder={formatMessage({ id: 'index-accountManager-family.name' })} />)}
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item {...smallFormItemLayout} label={formatMessage({ id: 'index-accountManager-name' })}>
                  {getFieldDecorator(`lastName`, {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'index-accountManager-name.null' }),
                      },
                    ],
                  })(<Input placeholder={formatMessage({ id: 'index-accountManager-name' })} />)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'index-accountManager-email' })}>
                  {getFieldDecorator(`email`, {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'index-accountManager-email.null' }),
                      },
                    ],
                  })(<Input placeholder={formatMessage({ id: 'index-accountManager-email' })} />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label={formatMessage({ id: 'index-accountManager-phonenumber' })}>
                  {getFieldDecorator(`cellphone`, {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'index-accountManager-phonenumber.null' }),
                      },
                    ],
                  })(<Input placeholder={formatMessage({ id: 'index-accountManager-phonenumber' })} />)}
                </Form.Item>
              </Col>

              <Col span={12}></Col>
            </Row>
            <Row>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent type="Save" text={formatMessage({ id: 'index-accountManager-submit' })} event={() => {}} />
              </Col>
              <Col span={12}>
                <ButtonOptionComponent type="ResetPassword" text={formatMessage({ id: 'index-accountManager-reset.password' })} event={() => {}} />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);

export default WrappedHorizontalLoginForm;
