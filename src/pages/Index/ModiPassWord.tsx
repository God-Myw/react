import { Checkbox, Col, Form, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'dva/router';
import React from 'react';
import QueryButton from '../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../Common/Components/LabelTitleComponent';
import commonCss from '../Common/css/CommonCss.less';

type LoginProps = FormComponentProps & RouteComponentProps;

class ModiPassWord extends React.Component<LoginProps> {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  state = {
    checkSelect: false,

    inputType: 'password',
  };

  checkChange = (e: { target: { checked: any } }) => {
    this.setState({
      inputType: e.target.checked ? 'text' : 'password',
    });
  };
  render() {
    const formlayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="重置密码" event={() => {}} />
        <div className={commonCss.AddForm}>
          <Form {...formlayout} labelAlign="left">
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="">
                  <Checkbox value={this.state.checkSelect} onChange={this.checkChange}>
                    显示密码
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="请输入旧的密码">
                  <Input type={this.state.inputType} placeholder="旧密码" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="请输入新的密码">
                  <Input type={this.state.inputType} placeholder="新密码" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="请重复新的密码">
                  <Input type={this.state.inputType} placeholder="确认新密码" />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="space-around" type="flex">
              <Col>
                <Form.Item>
                  <QueryButton type="SaveAndCommit" text="确认" event={() => {}}></QueryButton>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const ModiPassWord_Form = Form.create({ name: 'horizontal_login' })(ModiPassWord);
export default ModiPassWord_Form;
