import getRequest from '@/utils/request';
import { Col, Form, Input, Row, Select } from 'antd';
import { isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import ShipTradeFormProps from './ShipperShiptradeFormInterface';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import TextArea from 'antd/lib/input/TextArea';
import { formatMessage } from 'umi-plugin-locale';
class ShipperShiptradeView extends React.Component<ShipTradeFormProps, ShipTradeFormProps> {
  constructor(props: ShipTradeFormProps) {
    super(props);
  }
  //初始化事件
  componentDidMount() {
    this.setState({
      remark: '',
    });
    let guid = this.props.match.params['guid'];
    let param: Map<string, string> = new Map();
    param.set('type', '2');
    getRequest('/business/shipTrade/' + guid, param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            shipType: getTableEnumText('ship_type', response.data.shipTrade.shipType),
            shipAge: getTableEnumText('ship_age', response.data.shipTrade.shipAge),
            tradeType: getTableEnumText('trade_type', response.data.shipTrade.tradeType),
            voyageArea: getTableEnumText('voyage_area', response.data.shipTrade.voyageArea),
            classificationSociety: getTableEnumText('classification_society', response.data.shipTrade.classificationSociety),
            tonNumber: response.data.shipTrade.tonNumber,
            remark: response.data.shipTrade.remark,
            email: response.data.shipTrade.email
          });
          // console.log(this.state.shipType);
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/shiptradequery');
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeView.examineShipTradeInformation' })} event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.tradeType' })}>
                  {getFieldDecorator('tradeType', {
                    initialValue:
                      this.state == null || this.state.tradeType == null
                        ? ''
                        : this.state.tradeType.toString(),
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
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.shipType' })}>
                  {getFieldDecorator('shipType', {
                    initialValue:
                      this.state == null || this.state.shipType == null
                        ? ''
                        : this.state.shipType.toString(),
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
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.tonNumber' })}>
                  {getFieldDecorator('tonNumber', {
                    initialValue:
                      this.state == null || this.state.tonNumber == null
                        ? ''
                        : this.state.tonNumber,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.shipAge' })}>
                  {getFieldDecorator('shipAge', {
                    initialValue:
                      this.state == null || this.state.shipAge == null
                        ? ''
                        : this.state.shipAge.toString(),
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
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.classificationSociety' })}>
                  {getFieldDecorator('classificationSociety', {
                    initialValue:
                      this.state == null || this.state.classificationSociety == null
                        ? ''
                        : this.state.classificationSociety.toString(),
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
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.voyageArea' })}>
                  {getFieldDecorator('voyageArea', {
                    initialValue:
                      this.state == null || this.state.voyageArea == null
                        ? ''
                        : this.state.voyageArea.toString(),
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
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeView.otherDescription' })}></Form.Item>
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
                  text={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeView.shutDown' })}
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

const ShipTradeView_Form = Form.create({ name: 'ShipTradeView_Form' })(ShipperShiptradeView);

export default ShipTradeView_Form;
