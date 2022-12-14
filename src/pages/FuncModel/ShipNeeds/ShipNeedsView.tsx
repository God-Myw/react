import getRequest from '@/utils/request';
import { Col, Form, Input, Row, Select } from 'antd';
import { isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { ShipNeedsFormInterface } from './ShipNeedsFormInterface';
import { getDictDetail } from '@/utils/utils';
import TextArea from 'antd/lib/input/TextArea';
class ShipTradeView extends React.Component<ShipNeedsFormInterface, ShipNeedsFormInterface> {
  constructor(props: ShipNeedsFormInterface) {
    super(props);
  }

  //初始化事件
  componentDidMount() {
    this.setState({
      contacter: '',
      phoneCode: '',
      phoneNumber: '',
      remark: '',
    });
    let guid = this.props.match.params['guid'];
    let param: Map<string, string> = new Map();
    param.set('type', '3');
    getRequest('/business/shipTrade/' + guid, param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            tradeType: response.data.shipTrade.tradeType,
            shipType: response.data.shipTrade.shipType,
            tonNumber: response.data.shipTrade.tonNumber,
            shipAge: response.data.shipTrade.shipAge,
            classificationSociety: response.data.shipTrade.classificationSociety,
            voyageArea: response.data.shipTrade.voyageArea,
            contacter: response.data.shipTrade.contacter,
            phoneCode: response.data.shipTrade.phoneCode,
            phoneNumber: response.data.shipTrade.phoneNumber,
            remark: response.data.shipTrade.remark,
            userName: response.data.shipTrade.userName,
            email: response.data.shipTrade.email,
            status: response.data.shipTrade.status,
          });
        }
      }
    });
    console.log(this.props.state);
  }

  onBack = () => {
    this.props.history.push('/shipneeds');
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="查看船舶交易信息" event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="交易身份">
                  {getFieldDecorator('tradeType', {
                    initialValue:
                      this.state == null || this.state.tradeType == null
                        ? ''
                        : this.state.tradeType,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('trade_type').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="船舶类型">
                  {getFieldDecorator('shipType', {
                    initialValue:
                      this.state == null || this.state.shipType == null
                        ? ''
                        : this.state.shipType,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('ship_type').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="载重吨">
                  {getFieldDecorator('tonNumber', {
                    initialValue:
                      this.state == null || this.state.tonNumber == null
                        ? ''
                        : this.state.tonNumber,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="船龄">
                  {getFieldDecorator('shipAge', {
                    initialValue:
                      this.state == null || this.state.shipAge == null
                        ? ''
                        : this.state.shipAge,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('ship_age').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船级社">
                  {getFieldDecorator('classificationSociety', {
                    initialValue:
                      this.state == null || this.state.classificationSociety == null
                        ? ''
                        : this.state.classificationSociety,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('classification_society').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="航区">
                  {getFieldDecorator('voyageArea', {
                    initialValue:
                      this.state == null || this.state.voyageArea == null
                        ? ''
                        : this.state.voyageArea,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('voyage_area').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系人">
                  {getFieldDecorator('contacter', {
                    initialValue:
                      this.state == null || this.state.contacter == null
                        ? ''
                        : this.state.contacter,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系方式">
                  <Input
                    disabled
                    placeholder="+86"
                    style={{ width: '10%' }}
                    value={
                      isNil(this.state) || isNil(this.state.phoneCode) ? '' : this.state.phoneCode
                    }
                  />
                  <Input
                    disabled
                    style={{ width: '86%', marginLeft: '4%' }}
                    value={
                      isNil(this.state) || isNil(this.state.phoneNumber)
                        ? ''
                        : this.state.phoneNumber
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="邮箱">
                  {getFieldDecorator('email', {
                    initialValue:
                      this.state == null || this.state.email == null ? '' : this.state.email,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="其他说明"></Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('remark', {
                    initialValue:
                      this.state == null || this.state.remark == null ? '' : this.state.remark,
                  })(<TextArea style={{height:90}} disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="CloseButton"
                  text="关闭"
                  event={() => this.onBack()}
                  disabled={false}
                />
              </Col>
              <Col span={12}>
                {isNil(this.state) || isNil(this.state.status) || this.state.status === 0 ? (
                  <Col></Col>
                ) : (
                  <Col span={12} push={12}>
                    <div className={commonCss.picTopAndBottom}>
                      <img src={require('../../Image/close.png')} className={commonCss.imgWidth} />
                    </div>
                  </Col>
                )}
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const ShipTradeView_Form = Form.create({ name: 'shipTradeView_Form' })(ShipTradeView);

export default ShipTradeView_Form;
