import getRequest, { putRequest } from '@/utils/request';
import { Col, Form, Input, Modal, Row, message, Button } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil, forEach, filter } from 'lodash';
// 导出引入xlsx
import { exportExcel } from 'xlsx-oc'
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import ShipCertificationFormProps from './ShipCertificationFormInterface';
import { linkHref } from '@/utils/utils';
import { FileModel } from './FileModel';
import { getLocale } from 'umi-plugin-react/locale';

const { TextArea } = Input;

type CertificationProps = ShipCertificationFormProps & RouteComponentProps;

class ShipCertificationView extends React.Component<ShipCertificationFormProps, CertificationProps> {
  changeSrc = '';
  certification = '';
  constructor(props: ShipCertificationFormProps) {
    super(props);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    console.log(this.props)
    this.setState(
      {
        previewVisible: false,
        visible: false,
        previewImage: '',
      },
      () => {
        const param: Map<string, string> = new Map();
        param.set('id', this.props.match.params.guid);
        getRequest(`/business/invoiceNew/getInvoiceNewByOrderId/`, param, (response: any) => {
          console.log(response)
          if (response.status === 200) {
            if (!isNil(response.data)) {
              this.setState({
                // 定金
                orderData: response.data.orders,
              })
            }
          }
        });
      },
    );
  }
  // 返回
  onBack = () => {
    console.log(this.props)
    // 得到当前审核状态
    const guid = this.props.match.params.guid ? this.props.match.params.guid : '';
    // 跳转首页
    this.props.history.push(`/orderFlow/view/${guid}/${this.props.match.params.attachId}/${this.props.match.params.status}`);
  };
  // 导出
  export = () => {
    //定义表头
    const list = []
      for (let i = 0; i < this.state.orderData.length; i++) {
        const item = this.state.orderData[i]
        list.push({
          key: i,
          invoiceType: item.invoiceType == 0 ? '增值发票' : item.invoiceType == 1 ? '普通发票': item.invoiceType == 2 ? 'Debit Note': '',
          name: item.name,
          invoiceHeader: item.invoiceHeader == 0 ? '单位' : '个人',
          phone: item.phone,
          taxpayerIdentificationCode: item.taxpayerIdentificationCode,
          address: item.address,
          invoiceContent: item.invoiceContent == 0 ? '服务明细' : '',
          type: item.type == 0 ? '尾款' : '服务费',
        })
      }
    const header = [{ k: 'invoiceType', v: '发票类型' }, { k: 'name', v: '收票人姓名' }, 
    { k: 'invoiceHeader', v: '发票抬头' }, { k: 'phone', v: '收票人手机' }, { k: 'taxpayerIdentificationCode', v: '纳税人识别码' },
    { k: 'address', v: '收票人地址' },{ k: 'invoiceContent', v: '发票内容' },{ k: 'type', v: '支付类型' }]
    const fileName = '开票信息.xlsm'
    exportExcel(header, list, fileName)
  }
  render() {
    // Form.Item的布局格式
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };

    // const { getFieldDecorator } = this.props.form;
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="客户填写开票信息" event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          {isNil(this.state) || isNil(this.state.orderData) ? '' : (this.state.orderData.map(item => (
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="发票类型">
                    <Input readOnly disabled value={ item.invoiceType == 0
                      ? '增值发票' : item.invoiceType == 1 ? '普通发票': item.invoiceType == 2 ? 'Debit Note': '' } />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="收票人姓名">
                    <Input disabled readOnly value={isNil(this.state)
                      ? ''
                      : item.name} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="发票抬头">
                    <Input readOnly disabled value={item.invoiceHeader == 0
                      ? '单位'
                      : '个人'} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="收票人手机">
                    <Input disabled readOnly value={isNil(this.state)
                      ? ''
                      : item.phone} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="纳税人识别码">
                    <Input readOnly disabled value={isNil(this.state)
                      ? ''
                      : item.taxpayerIdentificationCode} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="收票人地址">
                    <Input disabled readOnly value={isNil(this.state)
                      ? ''
                      : item.address} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="发票内容">
                    <Input readOnly disabled value={item.invoiceContent == 0
                      ? '服务明细'
                      : ''} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="支付类型">
                    <Input disabled readOnly value={item.type == 0
                      ? '尾款'
                      : '服务费'} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}><div style={{ width: '100%',borderTop: '1px solid rgba(0, 0, 0, 0.2)',height: '1px',marginBottom: '30px',marginTop: '10px' }}  ></div></Row>
             </Form>
          )))}
        </div> 
        <div>
          <Form labelAlign="left">
            <Row className={commonCss.rowTop}>
              <Col span={11} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="TurnDown"
                    text="关闭"
                    event={() => this.onBack()}
                    disabled={false}
                  />
              </Col>
              <Col span={1} >
              
              </Col>
              <Col span={11} className={commonCss.lastButtonAlignLight}>
                  <ButtonOptionComponent
                    type="Approve"
                    text="导出开票信息"
                    event={() => this.export()}
                    disabled={false}
                  />
                </Col>
              
            </Row>
     
          </Form>
        </div>
      </div>
    );
  }
}

const ShipCertificationView_Form = Form.create({ name: 'ShipCertificationView_Form' })(
  ShipCertificationView,
);
export default ShipCertificationView_Form;
