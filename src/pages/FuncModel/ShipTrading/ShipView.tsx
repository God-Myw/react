// import { Upload, Icon, Modal, Form, Row, Steps } from 'antd';
import getRequest from '@/utils/request';
import { Col, Form, Input, Row, Button, Steps, Card, Divider, Select } from 'antd';
import { isNil } from 'lodash';
import React from 'react';
import commonCss from '../../Common/css/CommonCss.less';
// import { formatMessage } from 'umi-plugin-react/locale';
import ShipCertificationFormProps from './ShipCertificationFormInterface';
// const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
class ShipView extends React.Component<ShipCertificationFormProps> {
  state = {
    identityType: '',
    orderNumber: '',
    shipName: '',
    price: '',
    shipType: '',
    dwt: '',
    classificationSociety: '',
    imo: '',
    voyageArea: '',
    draft: '',
    netWeight: '',
    hatchesNumber: '',
    buildAddress: '',
    buildParticularYear: '',
    companyName: '',
    phoneNumber: '',
    previewImage: '',
    contacter: '',
    mail: '',
    remark: '',
    auth: '',
    aliWxPay: '',
    payMoney: '',
    insuId: '',
    createDate: '',
    shipCertificate: [],
    current: 0,
  };
  componentDidMount() {
    this.getsource(this.props.match.params.guid);
  }
  getsource = (id: any) => {
    let param: Map<string, any> = new Map();
    param.set('guid', id || '');
    param.set('listType', 1);
    getRequest('/business/shipSelling/getShipSellingDetailForWeb', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response)) {
          this.setState({
            identityType: response.data.data.shipSellerDto.identityType == 3 ? '卖方' : '卖方中介',
            orderNumber: response.data.data.shipSellerDto.orderNumber || '',
            shipName: response.data.data.shipSellerDto.shipName || '',
            price: response.data.data.shipSellerDto.price || '',
            shipType: response.data.data.shipSellerDto.shipType || '',
            dwt: response.data.data.shipSellerDto.dwt || '',
            classificationSociety: response.data.data.shipSellerDto.classificationSociety || '',
            imo: response.data.data.shipSellerDto.imo || '',
            voyageArea: response.data.data.shipSellerDto.voyageArea || '',
            draft: response.data.data.shipSellerDto.draft || '',
            netWeight: response.data.data.shipSellerDto.netWeight || '',
            hatchesNumber: response.data.data.shipSellerDto.hatchesNumber || '',
            buildAddress: response.data.data.shipSellerDto.buildAddress || '',
            buildParticularYear: response.data.data.shipSellerDto.buildParticularYear || '',
            companyName: response.data.data.shipSellerDto.companyName || '',
            phoneNumber: response.data.data.shipSellerDto.phoneNumber || '',
            previewImage: response.data.data.shipSellerDto.previewImage || '',
            contacter: response.data.data.shipSellerDto.price || '',
            mail: response.data.data.shipSellerDto.mail || '',
            remark: response.data.data.shipSellerDto.remark || '',
            auth:
              response.data.data.shipSellerDto.auth == '1'
                ? '体验套餐'
                : response.data.data.shipSellerDto.auth == '2'
                ? 'VIP套餐'
                : '尊享套餐',
            aliWxPay:
              response.data.data.shipSellerDto.aliWxPay == '1'
                ? '支付宝'
                : response.data.data.shipSellerDto.aliWxPay == '1'
                ? '微信'
                : '0元购',
            payMoney: response.data.data.shipSellerDto.payMoney || '',
            insuId: response.data.data.shipSellerDto.insuId || '',
            createDate: response.data.data.shipSellerDto.createDate || '',
            shipCertificate: response.data.data.shipSellerDto.shipCertificate || '',
          });
        }
      }
    });
  };

  guanbi = () => {
    this.props.history.push('/ShipTrading/list');
  };
  onChange = (current: any) => {
    this.setState({ current: current });
  };
  render() {
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
    };
    const formlayout3 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 24 },
    };
    return (
      <div className="clearfix">
        <Card bordered={false} style={{ paddingTop: 20 }}>
          <Steps current={this.state.current} onChange={this.onChange} labelPlacement={'vertical'}>
            <Step title={'船舶挂牌'} description="" />
            <Step title={'已成交-设置支付服务费'} description="" />
            <Step title={'交易完成'} description="" />
          </Steps>
        </Card>
        <div className={commonCss.container} style={{ width: '100%' }}>
          {!isNil(this.state) && this.state.current != 1 ? (
            <>
              <div className={commonCss.title}>
                <span className={commonCss.text}>{'船舶信息'}</span>
              </div>
              <Card bordered={false}>
                <Form labelAlign="left">
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="交易身份">
                        <Input value={this.state.identityType} disabled></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="编号">
                        <Input value={this.state.orderNumber} disabled></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="船名">
                        <Input value={this.state.shipName} disabled></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="意向售价">
                        <Input value={this.state.price} disabled></Input>
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
                      <Form.Item {...formlayout} label="载重吨">
                        <Input value={this.state.dwt} disabled></Input>
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
                      <Form.Item {...formlayout} label="IMO号">
                        <Input value={this.state.imo} disabled></Input>
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
                      <Form.Item {...formlayout} label="吃水">
                        <Input value={this.state.draft} disabled></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="空船重量">
                        <Input value={this.state.netWeight} disabled></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="舱口数量">
                        <Input value={this.state.hatchesNumber} disabled></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="建造地点">
                        <Input value={this.state.buildAddress} disabled></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="建造时间">
                        <Input value={this.state.buildParticularYear} disabled></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="公司名称">
                        <Input value={this.state.companyName} disabled></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="联系方式">
                        <Input value={this.state.phoneNumber} disabled></Input>
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
                      <Form.Item {...formlayout} label="邮箱">
                        <Input value={this.state.mail} disabled></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="备注">
                        <TextArea rows={4} value={this.state.remark} disabled></TextArea>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
              <div className={commonCss.title}>
                <span className={commonCss.text}>{'挂牌套餐'}</span>
              </div>
              <Card bordered={false}>
                <Form labelAlign="left">
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...{ formlayout }} label="船舶证书">
                        <img
                          src={this.state.shipCertificate[0] || '#'}
                          alt=""
                          width="200px"
                          height="120px"
                        />
                        <img src="#" alt="" width="200px" height="120px" />
                        <img src="#" alt="" width="200px" height="120px" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...{ formlayout }} label="船舶所有权证书（选填）">
                        <img src="#" alt="" width="200px" height="120px" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={4}>
                      <Form.Item {...{ formlayout }} label="船舶载重线证书（选填）">
                        <img src="#" alt="" width="100%" height="120px" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item {...{ formlayout }} label="船舶规范（选填）">
                        <img src="#" alt="" width="100%" height="120px" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item {...{ formlayout }} label="船舶适航证书（选填）">
                        <img src="#" alt="" width="100%" height="120px" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item {...formlayout3} label="船舶照片">
                        <img src="#" alt="" width="200px" height="120px" />
                        <img src="#" alt="" width="200px" height="120px" />
                        <img src="#" alt="" width="200px" height="120px" />
                        <img src="#" alt="" width="200px" height="120px" />
                        <img src="#" alt="" width="200px" height="120px" />
                        <img src="#" alt="" width="200px" height="120px" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
              <div className={commonCss.title}>
                <span className={commonCss.text}>{'船舶证书和图片'}</span>
              </div>
              <Card bordered={false}>
                <Form labelAlign="left">
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="套餐类型">
                        <Input value={this.state.auth} disabled></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="支付方式">
                        <Input value={this.state.aliWxPay} disabled></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="套餐金额">
                        <Input value={this.state.payMoney} disabled></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="支付编号">
                        <Input value={this.state.insuId} disabled></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="套餐到期时间">
                        <Input value={this.state.shipType} disabled></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="支付时间">
                        <Input value={this.state.createDate} disabled></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
              {this.state.current == 2 ? (
                <>
                  <div className={commonCss.title}>
                    <span className={commonCss.text}>{'费用&流水单'}</span>
                  </div>
                  <Card bordered={false}>
                    <Form labelAlign="left">
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item {...formlayout} label="船舶成交价">
                            <Input value={this.state.auth} disabled></Input>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item {...formlayout} label="服务费金额">
                            <Input value={this.state.aliWxPay} disabled></Input>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item {...formlayout} label="费用名称">
                            <Input value={this.state.payMoney} disabled></Input>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item {...formlayout} label="查看流水单">
                            <Input.TextArea
                              style={{
                                display: 'inline-block',
                                height: '200px',
                                width: '200px',
                                position: 'absolute',
                              }}
                              value={this.state.insuId}
                              disabled
                            ></Input.TextArea>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item {...formlayout} label="道裕收款帐号">
                            <Input value={this.state.shipType} disabled></Input>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item {...formlayout} label="账户">
                            <Input value={this.state.shipType} disabled></Input>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item {...formlayout} label="开户行">
                            <Input value={this.state.shipType} disabled></Input>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item {...formlayout} label="支付时间">
                            <Input value={this.state.shipType} disabled></Input>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </>
              ) : null}
            </>
          ) : (
            <>
              <div className={commonCss.title}>
                <span className={commonCss.text}>{'设置支付服务费'}</span>
              </div>
              <Card bordered={false}>
                <Form labelAlign="left">
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="共管收款银行账号">
                        <Input value={this.state.identityType} disabled></Input>
                      </Form.Item>
                      <Form.Item {...formlayout} label=" ">
                        <Input value={this.state.identityType} disabled></Input>
                      </Form.Item>
                      <Form.Item {...formlayout} label=" ">
                        <Input value={this.state.identityType} disabled></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="船舶交易成交价">
                        <Input value={this.state.shipName} disabled></Input>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item {...formlayout} label=" ">
                        <Select value={'万美元'} disabled>
                          <Select.Option value={'万美元'}>{'万美元'}</Select.Option>
                          <Select.Option value={'万元'}>{'万元'}</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="需支付服务费">
                        <Input value={this.state.shipName} disabled></Input>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item {...formlayout} label=" ">
                        <Select value={'万美元'} disabled>
                          <Select.Option value={'万美元'}>{'万美元'}</Select.Option>
                          <Select.Option value={'万元'}>{'万元'}</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </>
          )}
          <Divider />
          <Row gutter={24}>
            <Col span={24}>
              <div style={{ width: '100%', height: '80px', textAlign: 'center' }}>
                {this.state.current == 1 ? (
                  <>
                    <Button
                      style={{
                        marginRight: '110px',
                        backgroundColor: '#ffffff',
                        color: '#1890FF',
                        borderColor: '#1890FF',
                      }}
                      onClick={() => {
                        this.setState({ current: this.state.current - 1 });
                      }}
                    >
                      上一步
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      style={{
                        marginRight: '110px',
                        backgroundColor: '#ffffff',
                        color: '#1890FF',
                        borderColor: '#1890FF',
                      }}
                      onClick={this.guanbi}
                    >
                      关闭
                    </Button>
                  </>
                )}
                {this.state.current == 0 ? (
                  <>
                    <Button
                      style={{ backgroundColor: '#1890FF', color: '#FFFFFF' }}
                      onClick={() => {
                        this.setState({ current: this.state.current + 1 });
                      }}
                    >
                      下一步
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      style={{ backgroundColor: '#1890FF', color: '#FFFFFF' }}
                      onClick={() => {
                        this.setState({ current: this.state.current + 1 });
                      }}
                    >
                      确认提交
                    </Button>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const ShipCertificationView_Form = Form.create({ name: 'ShipCertificationView_Form' })(ShipView);
export default ShipCertificationView_Form;
