import getRequest, { putRequest } from '@/utils/request';
import { Col, Form, Icon, Input, message, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'dva/router';
import { isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { contract_CN } from '../Protocol/protocols';

interface AdvanceorderFormProps extends FormComponentProps {
}

const { TextArea } = Input;

type AdvanceorderProps = AdvanceorderFormProps & RouteComponentProps;

class AdvanceorderView extends React.Component<AdvanceorderProps> {
  //初期化状态（API为准）
  state = {
    message: '',
  };

  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    this.getPalletList();
  }

  // 返回
  onBack = () => {
    this.props.history.push('/advanceorder/list/'+this.props.match.params['status']);
  };

  getPalletList = () => {
    let orderNumber = this.props.match.params['orderNumber'];
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    param.set('orderNumber',orderNumber);
    // 初期化获取数据
    getRequest('/business/contract' , param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            message: response.data.contract.extraItem,
          });
        }
      }
    });
  }

  save = () => {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let requestData = {};
        requestData = {
          type: 1,
          orderNumber: this.props.match.params['orderNumber'],
          extraItem: this.state.message,
        };
        // 修改请求
        putRequest('/business/contract', JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {
            message.success('保存成功');
          } else {
            message.error('保存失败');
          }
        });
      }
    });
  }

  createPrintArea = () => {
    return (
      <div>
        <span style={{ wordBreak: 'normal', fontSize: '16px', fontWeight: 'bolder', color: 'black' }}>{this.state.message}</span>
      </div>);
  }

  render() {
    const print = () => {
      const win = window.open('', 'printwindow');
      const print = window.document.getElementById('printArea');
      if (win && print) {
        win.document.write(print.innerHTML);
        win.print();
        win.close();
      }
    };
    return (
      <div className={commonCss.container}>
        <div className={commonCss.title}>
        <span className={commonCss.text} style={{fontWeight:'bolder',fontSize:'16px'}}>我的订单</span>
        <Icon className={commonCss.icon} type="close-circle" onClick={this.onBack} />
      </div>
        <div className={commonCss.AddForm}>
          <Row gutter={24}>
            <Col span={1}></Col>
            <Col span={22}>
              <Form>
                <div id='printArea' style={{ border: 'solid', height: 'auto', borderWidth: '1px' }}>
                  <div style={{ padding: '16.5px' }}>

                    <p style={{textAlign:"left"}} dangerouslySetInnerHTML={{__html:contract_CN}}></p>
                    {/* <h3 style={{ textAlign: 'center', fontSize: '33px' }}>某某某合同</h3>
                    <span style={{ float: 'left', fontSize: '16px', fontWeight: 'bolder', color: 'black' }}>委托方:_______________(以下简称“甲方”)</span>
                    <span style={{ float: 'right', fontSize: '16px', fontWeight: 'bolder', color: 'black' }}>受托方:_______________(以下简称“乙方”)</span>
                    <br></br>
                    <br></br>
                    <br></br>
                    <span style={{ wordBreak: 'normal', fontSize: '16px', fontWeight: 'bolder', color: 'black' }}>甲、乙双方为更好地开展海运进出口业务，双方经友好协商，根据《中华人民共和国合同法》和《中华人民共和国海商法》等法规的有关规定，现甲方委托乙方作为其代理人代理货物出口的配舱、装船、进栈、报关等一系列货运代理工作，达成如下协议，以便共同遵守。</span>
                    <br></br>
                    <br></br>
                    <br></br>
                    <span style={{ wordBreak: 'normal', fontSize: '16px', fontWeight: 'bolder', color: 'black' }}>一、甲、乙双方均持有有效营业执照、并且严格按照营业执照中的营业范围展开业务。由于甲方的违法经营行为给乙方造成的一切损失与不利后果，甲方应当承担赔偿责任。</span>
                    <br></br>
                    <br></br>
                    <br></br>
                    <span style={{ wordBreak: 'normal', fontSize: '16px', fontWeight: 'bolder', color: 'black' }}>二、甲方同意将其揽取的或其生产的货物委托乙方代理安排运输。</span> */}
                    <br></br>
                    <br></br>
                    <br></br>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{this.createPrintArea()}</div>
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={1}></Col>
            <Col span={22}>
              <Form.Item>
                <TextArea id='printArea' onBlur={this.save} style={{ marginTop: '20px', borderColor: 'black', whiteSpace: 'pre' }} rows={4} value={this.state.message} placeholder="请输入您想添加的条款内容&#10;1.请输入您的添加条款&#10;2.请输入您的添加条款&#10;3.请输入您的添加条款" disabled={this.props.match.params['status'] === '0' || this.props.match.params['status'] === '2' ? false : true} onChange={e => this.setState({ message: e.target.value })} />
              </Form.Item>
            </Col>
          </Row>
          <Row className={commonCss.rowTop}>
            <Col span={12} className={commonCss.lastButtonAlignRight}>
              <ButtonOptionComponent
                type="Approve"
                text="下载或打印"
                event={print
                }
                disabled={false}
              />
            </Col>
          </Row>
        </div>

      </div>
    );
  }
}

const AdvanceorderView_Form = Form.create({ name: 'AdvanceorderView_Form' })(AdvanceorderView);
export default AdvanceorderView_Form;
