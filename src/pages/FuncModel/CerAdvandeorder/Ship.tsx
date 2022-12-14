import { Col, Form, Input, Row } from 'antd';
import { forEach } from 'lodash';
import React from 'react';
import commonCss from '../../Common/css/CommonCss.less';
import AdvanceorderFormProps, { VoyagePort, Ship, Voyage } from './AdvanceorderFormInterface';
import HrComponent from '@/pages/Common/Components/HrComponent';
import { getTableEnumText } from '@/utils/utils';
import moment from 'moment';

interface IProps {
  voyagePort: Array<VoyagePort>;
  ship: Ship;
  voyage: Voyage;
  voyageLineName: string;
}

class voyage extends React.Component<IProps, AdvanceorderFormProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const smallerFormItemLayout = {
      labelCol: { span: 18 },
      wrapperCol: { span: 6 },
    };
    const { voyage, ship, voyagePort, voyageLineName } = this.props;
    let voyagePortList = voyagePort == null ? null : voyagePort;
    const elements: JSX.Element[] = [];
    forEach(voyagePortList, (item: VoyagePort, key) => {
      elements.push(
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item required {...formlayout} label={item.portTypeName}>
              <Input disabled className="OnlyRead" value={item.portName} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item required {...formlayout} label={'ETA'}>
              <Input
                disabled
                className="OnlyRead"
                value={moment(Number(item.arriveDate)).format('YYYY/MM/DD')}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item required {...formlayout} label={'ETD'}>
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
    if (voyage == null || voyagePort == null) {
      return null;
    } else {
      return (
        <div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>航次信息</span>
          </div>
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="船舶名称">
                    <Input disabled value={ship.shipName} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="船型">
                    <Input disabled value={getTableEnumText('ship_deck', ship.shipDeck)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="船舶类型">
                    <Input disabled value={getTableEnumText('ship_type', ship.shipType)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="建造年份">
                    <Input disabled value={ship.buildParticularYear} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="载重吨">
                    <Input disabled suffix="吨" value={ship.tonNumber} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="船吊">
                    <Input disabled value={ship.shipCrane} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="船舶吃水">
                    <Input disabled suffix="m" value={ship.draft} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="所在港口">
                    <Input disabled value={getTableEnumText('port', voyage.voyageStartPort)} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="联系人">
                    <Input disabled value={voyage.contacter} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="联系方式">
                  <Input
                    disabled
                    placeholder="+86"
                    style={{ width: '15%' }}
                    value={voyage.phoneCode}
                  />
                  <Input
                    disabled
                    style={{ width: '85%' }}
                    value={voyage.contactPhone}
                  />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="可接受体积">
                    <Input
                      disabled
                      className="OnlyRead"
                      suffix="m³"
                      value={voyage.acceptCapacity}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="可接受吨位">
                    <Input disabled className="OnlyRead" suffix="吨" value={voyage.acceptTon} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="船舶航程">
                    <Input disabled className="OnlyRead" suffix="海里" value={voyage.shipVoyage} />
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
                  <Form.Item required {...formlayout} label="已定航线">
                    <Input disabled className="OnlyRead" value={voyageLineName} />
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
}

const ShipForm = Form.create({ name: 'ShipForm' })(voyage);

export default ShipForm;
