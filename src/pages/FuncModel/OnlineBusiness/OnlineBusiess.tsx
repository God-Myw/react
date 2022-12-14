import React from 'react';
import { Card, Form, Input, Button, Select, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import '../../Index/Index.less';
const { Option } = Select;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class OnlineBus extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
      }
    });
  };

  redirectModiPassWordPage = e => {
    this.props.router.push('/mod_password');
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return <div>在线业务员</div>;
  }
}

const OnlineBusForm = Form.create({ name: 'OnlineBus_Form' })(OnlineBus);

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <OnlineBusForm />
    </Card>
  </PageHeaderWrapper>
);
