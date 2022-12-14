import getRequest from '@/utils/request';
import { getDictDetail } from '@/utils/utils';
import { Col, Form, Input, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { isNil } from 'lodash';
import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { ShipownerShipTradeFormProps } from './ShipownerShipTradeFormInterface';

class ShipownerShipTradeView extends React.Component<ShipownerShipTradeFormProps, ShipownerShipTradeFormProps> {
  constructor(props: ShipownerShipTradeFormProps) {
    super(props);
  }

  //初始化事件111
  componentDidMount() {
    this.setState({
      contacter: '',
      phoneCode: '',
      phoneNumber: '',
      remark: '',
    });
    let guid = this.props.match.params['guid'];
    let param: Map<string, string> = new Map();
    param.set('type', '1');
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
            email: response.data.shipTrade.email
          });
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/ShipownerShipTrade');
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.examineShipTradeInformation' })} event={() => this.onBack()} />

        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>

                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.tradeType' })}>

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
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.shipType' })}>

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
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.tonnage' })}>

                  {getFieldDecorator('tonNumber', {
                    initialValue:
                      this.state == null || this.state.tonNumber == null
                        ? ''
                        : this.state.tonNumber,

                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.shipAge' })}>

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

                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.classificationSociety' })}>

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

                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.voyageArea' })}>
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
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.contacter' })}>

                  {getFieldDecorator('contacter', {
                    initialValue:
                      this.state == null || this.state.contacter == null
                        ? ''
                        : this.state.contacter,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.phoneNumber' })}>

                  <Input
                    disabled
                    placeholder="+86"
                    style={{ width: '15%' }}
                    value={
                      isNil(this.state) || isNil(this.state.phoneCode) ? '' : this.state.phoneCode
                    }
                  />
                  <Input
                    disabled
                    style={{ width: '85%' }}
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
                <Form.Item {...formlayout} label={formatMessage({ id: 'index-accountManager-email' })}>
                  {getFieldDecorator('email', {
                    initialValue:
                      this.state == null || this.state.email == null
                        ? ''
                        : this.state.email,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.otherDescription' })}></Form.Item>
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
            <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="CloseButton"
                  text={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.shutDown' })}
                  event={() => this.onBack()}
                  disabled={false}
                />

              </Col>
              <Col span={12}></Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const ShipTradeView_Form = Form.create({ name: 'shipTradeView_Form' })(ShipownerShipTradeView);

export default ShipTradeView_Form;
