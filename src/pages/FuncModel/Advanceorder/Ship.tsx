import HrComponent from '@/pages/Common/Components/HrComponent';
import { getRequest } from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Col, Form, Input, Row } from 'antd';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import commonCss from '../../Common/css/CommonCss.less';
import AdvanceorderFormProps, { VoyagePort } from './AdvanceorderFormInterface';

class AdvanceorderAdd extends React.Component<AdvanceorderFormProps, AdvanceorderFormProps> {
  certification = '';
  constructor(props: AdvanceorderFormProps) {
    super(props);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState(
      {
        previewVisible: false,
        previewImage: '',
      },
      () => {
        let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
        if (uid) {
          let param: Map<string, string> = new Map();
          param.set('type', '1');
          getRequest('/business/order/' + uid, param, (response: any) => {
            if (response.status === 200) {
              if (!isNil(response.data)) {
                //  if (response.data.userDataChecks.guid === id) {
                this.setState({
                  voyage: response.data.orderVoyage.voyage, //航次对象
                  voyagePort: response.data.orderVoyage.voyagePort, //航线途径港
                  pallet: response.data.orderPallet.pallet, //货盘对象
                  order: response.data.order, //订单对象
                  ship: response.data.orderVoyage.ship, //船舶对象
                  voyageLineName: response.data.orderVoyage.voyageLineName,
                  attachments: response.data.attachments, //附件
                  checkRemark: response.data.checkRemark ? response.data.checkRemark : '',
                });
              }
            }
          });
        }
      },
    );
  }

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    let voyagePortList =
      isNil(this.state) || isNil(this.state.voyagePort) ? null : this.state.voyagePort;
    const elements: JSX.Element[] = [];
    forEach(voyagePortList, (item: VoyagePort, key) => {
      elements.push(
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item {...formlayout} label={item.portTypeName}>
              <Input disabled className="OnlyRead" value={item.portName} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item {...formlayout} label={'ETA'}>
              <Input
                disabled
                className="OnlyRead"
                value={moment(Number(item.arriveDate)).format('YYYY/MM/DD')}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item {...formlayout} label={'ETD'}>
              <Input
                disabled
                className="OnlyRead"
                value={moment(Number(item.leaveDate)).format('YYYY/MM/DD')}
              />
            </Form.Item>
          </Col>
        </Row>,
      );
    });
    return (
      <div>
        <div className={commonCss.title}>
          <span className={commonCss.text}>航次信息</span>
        </div>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船舶名称">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.shipName)
                        ? ''
                        : this.state.ship.shipName
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="船型">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.shipDeck)
                        ? ''
                        : getTableEnumText('ship_deck', this.state.ship.shipDeck)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船舶类型">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.shipType)
                        ? ''
                        : getTableEnumText('ship_type', this.state.ship.shipType)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="建造年份">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                        isNil(this.state.ship) ||
                        isNil(this.state.ship.buildParticularYear)
                        ? ''
                        : this.state.ship.buildParticularYear
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="载重吨">
                  <Input
                    disabled
                    suffix="吨"
                    value={
                      isNil(this.state) ||
                        isNil(this.state.ship) ||
                        isNil(this.state.ship.tonNumber)
                        ? ''
                        : this.state.ship.tonNumber
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="船吊">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                        isNil(this.state.ship) ||
                        isNil(this.state.ship.shipCrane)
                        ? ''
                        : this.state.ship.shipCrane
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船舶吃水">
                  <Input
                    disabled
                    suffix="m"
                    value={
                      isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.draft)
                        ? ''
                        : this.state.ship.draft
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="所在港口">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                        isNil(this.state.voyage) ||
                        isNil(this.state.voyage.voyageStartPort)
                        ? ''
                        : getTableEnumText('port', this.state.voyage.voyageStartPort)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系人">
                  <Input
                    disabled
                    value={
                      isNil(this.state) ||
                        isNil(this.state.voyage) ||
                        isNil(this.state.voyage.contacter)
                        ? ''
                        : this.state.voyage.contacter
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系方式">
                  <Input
                    disabled
                    placeholder="+86"
                    style={{ width: '15%' }}
                    value={
                      isNil(this.state) ||
                        isNil(this.state.voyage) ||
                        isNil(this.state.voyage.phoneCode)
                        ? ''
                        : this.state.voyage.phoneCode
                    }
                  />
                  <Input
                    disabled
                    style={{ width: '85%' }}
                    value={
                      isNil(this.state) ||
                        isNil(this.state.voyage) ||
                        isNil(this.state.voyage.contactPhone)
                        ? ''
                        : this.state.voyage.contactPhone}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="可接受体积">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="m³"
                    value={
                      isNil(this.state) ||
                        isNil(this.state.voyage) ||
                        isNil(this.state.voyage.acceptCapacity)
                        ? ''
                        : this.state.voyage.acceptCapacity
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="可接受吨位">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="吨"
                    value={
                      isNil(this.state) ||
                        isNil(this.state.voyage) ||
                        isNil(this.state.voyage.acceptTon)
                        ? ''
                        : this.state.voyage.acceptTon
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船舶航程">
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="海里"
                    value={
                      isNil(this.state) ||
                        isNil(this.state.voyage) ||
                        isNil(this.state.voyage.shipVoyage)
                        ? ''
                        : this.state.voyage.shipVoyage
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="已定航线">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.voyageLineName)
                        ? ''
                        : this.state.voyageLineName
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ background: 'rgba(244,244,244,1)' }}>{elements}</div>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const ShipForm = Form.create({ name: 'ShipForm' })(AdvanceorderAdd);

export default ShipForm;
