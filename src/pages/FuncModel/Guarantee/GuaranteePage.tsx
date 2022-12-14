import React from 'react';
import { Button, Form, Row, Col, Checkbox, Modal } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import { RouteComponentProps } from 'dva/router';

class GuaranteePage extends React.Component<RouteComponentProps> {
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
    agreePro: false, // 是否已勾选同意协议
    modalVisible: false, // 弹出框是否显示
    buttonDisabled: true, // 按钮是否可用
  };

  // 改变checkbox的状态事件
  agreeChange = (e: { target: { checked: any } }) => {
    this.setState({
      agreePro: e.target.checked,
      buttonDisabled: !e.target.checked,
    });
  };

  showProtocol = () => {
    this.setState({
      modalVisible: true,
    });
  };

  // modal click OK
  handleOk = () => {
    this.setState({
      modalVisible: false,
    });
  };
  render() {
    const formlayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 21 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="保证金" event={() => {}} />
        <div className={commonCss.AddForm}>
          <Form {...formlayout} labelAlign="left">
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="">
                  <label style={{ fontWeight: 'bolder' }}>我是货主001，加入保证金计划</label>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22}>
                <Form.Item label="保证费用：">
                  <label style={{ color: 'red' }}>¥500，00</label>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={2}></Col>
              <Col span={22}>
                <Form.Item>
                  <Checkbox checked={this.state.agreePro} onChange={this.agreeChange}>
                    {' '}
                    我同意并接受
                    <Button type="link" href="#" onClick={this.showProtocol}>
                      《道裕物流保证金协议》
                    </Button>{' '}
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={2}></Col>
              <Col span={22}>
                <Form.Item>
                  <Button type="primary" disabled={this.state.buttonDisabled} htmlType="submit">
                    {' '}
                    支付保证金{' '}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Modal title="道裕物流保证金协议" visible={this.state.modalVisible} onOk={this.handleOk}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}

const GuaranteePage_Form = Form.create({ name: 'GuaranteePage_Form' })(GuaranteePage);
export default GuaranteePage_Form;
