// import { Upload, Icon, Modal, Form, Row, Steps } from 'antd';
import getRequest from '@/utils/request';
import { Col, Form, Input, Row, Button, Card, Divider } from 'antd';
import { isNil } from 'lodash';
import React from 'react';
import commonCss from '../../Common/css/CommonCss.less';
// import { formatMessage } from 'umi-plugin-react/locale';
import ShipCertificationFormProps from './ShipCertificationFormInterface';
const { TextArea } = Input;
class AucTionView extends React.Component<ShipCertificationFormProps> {
  state = {
    identity: '',
    shipAge: '',
    budget: '',
    shipType: '',
    classificationSociety: '',
    voyageArea: '',
    shipName: '',
    dwt: '',
    dwtMax: '',
    name: '',
    contacter: '',
    phone: '',
    remark: '',
    email: '',
    isLoanRequired: '',
    requiredCount: '',
    financialSupport: '',
    current: 0,
  };
  componentDidMount() {
    this.getsource(this.props.match.params.guid);
  }
  getsource = (id: any) => {
    let param: Map<string, any> = new Map();
    param.set('guid', id || '');
    // param.set('listType', 1);
    getRequest(
      '/business/ShipTransactionBuyer/getShipPurchaseDetailForWeb',
      param,
      (response: any) => {
        if (response.status === 200 && response.data) {
          if (!isNil(response)) {
            this.setState({
              // shipAge: response.data.data.shipSellerDto.shipAge || '',
              identity: response.data.identity == 1 ? '买方' : '买方中介',
              budget: response.data.budgetType == 1 ? response.data.budget + '万元' : '面议',
              shipType: response.data.shipType || '',
              classificationSociety: response.data.classificationSociety || '',
              voyageArea: response.data.voyageArea || '',
              shipName: response.data.shipName || '',
              dwt: response.data.dwt || '',
              dwtMax: response.data.dwtMax || '',
              name: response.data.name || '',
              contacter: response.data.contacter || '',
              phone: response.data.phone || '',
              remark: response.data.remark || '',
              email: response.data.email || '',
              isLoanRequired: response.data.isLoanRequired || '',
              requiredCount: response.data.requiredCount || '',
              financialSupport: response.data.financialSupport || '',
            });
          }
        }
      },
    );
  };
  guanbi = () => {
    this.props.history.push('/ShipTrading/list');
  };
  render() {
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className="clearfix">
        <div className={commonCss.container} style={{ width: '100%' }}>
          <div className={commonCss.title}>
            <span className={commonCss.text}>{'船舶购买需求信息'}</span>
          </div>
          <Card bordered={false}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="交易身份">
                    <Input value={this.state.identity} disabled></Input>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="预算">
                    <Input value={this.state.budget} disabled></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="船舶类型">
                    <Input value={this.state.shipType} disabled></Input>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="船龄">
                    <Input value={this.state.shipAge} disabled></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="船级社">
                    <Input value={this.state.classificationSociety} disabled></Input>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="载重吨">
                    <Input value={this.state.dwt + '-' + this.state.dwtMax} disabled></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="航区">
                    <Input value={this.state.voyageArea} disabled></Input>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="公司名称">
                    <Input value={this.state.name} disabled></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="联系人">
                    <Input value={this.state.contacter} disabled></Input>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="联系方式">
                    <Input value={this.state.phone} disabled></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="备注说明">
                    <TextArea value={this.state.remark} rows={4} disabled></TextArea>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="邮箱">
                    <Input value={this.state.email} disabled></Input>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <div className={commonCss.title}>
            <span className={commonCss.text}>{'交易贷款帮助'}</span>
          </div>
          <Card bordered={false}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="是否需要贷款">
                    <Input value={this.state.isLoanRequired} disabled></Input>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="希望贷款金额">
                    <Input value={this.state.requiredCount} disabled></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="第三方贷款支持">
                    <Input value={this.state.financialSupport} disabled></Input>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Divider />
          <Row gutter={24}>
            <Col span={24}>
              <div style={{ width: '100%', height: '80px', textAlign: 'center' }}>
                <Button
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#1890FF',
                    borderColor: '#1890FF',
                  }}
                  onClick={this.guanbi}
                >
                  关闭
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const ShipCertificationView_Form = Form.create({ name: 'ShipCertificationView_Form' })(AucTionView);
export default ShipCertificationView_Form;
