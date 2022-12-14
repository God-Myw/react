import getRequest from '@/utils/request';
import { Col, Divider, Form, Input, Row } from 'antd';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import VoyageFormProps, { VoyagePort } from './VoyageDynamicsFormInterface';
import { isNil, forEach } from 'lodash';
import { formatMessage } from 'umi-plugin-locale';
import { getTableEnumText } from '@/utils/utils';
import moment from 'moment';

class VoyageDynamicsView extends React.Component<VoyageFormProps, VoyageFormProps> {
  constructor(props: VoyageFormProps) {
    super(props);
  }

  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let params: Map<string, string> = new Map();
    params.set('type', '1');
    getRequest('/business/voyage/' + uid, params, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            shipName: response.data.ship.shipName,
            shipDeck: getTableEnumText('ship_deck', response.data.ship.shipDeck),
            shipType: getTableEnumText('ship_type', response.data.ship.shipType),
            buildParticularYear: response.data.ship.buildParticularYear,
            tonNumber: response.data.ship.tonNumber,
            shipCrane: response.data.ship.shipCrane,
            draft: response.data.ship.draft,
            portNameCn: getTableEnumText('port', response.data.voyage.voyageStartPort),
            contacter: response.data.voyage.contacter,
            contactPhone: response.data.voyage.contactPhone,
            phoneCode: response.data.voyage.phoneCode,
            acceptTon: response.data.voyage.acceptTon,
            acceptCapacity: response.data.voyage.acceptCapacity,
            shipVoyage: response.data.voyage.shipVoyage,
            voyageLineName: response.data.voyageLineName,
            voyagePort: response.data.voyagePort,
          });
        }
      }
    });
  }
  onBack = () => {
    if (localStorage.getItem('userType') === '3') {
      this.props.history.push('/customervoyagedynamics');
    } else {
      this.props.history.push('/voyagedynamics');
    }
  }

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    let voyagePortList =
      isNil(this.state) || isNil(this.state.voyagePort) ? [] : this.state.voyagePort;
    const elements: JSX.Element[] = [];
    forEach(voyagePortList, (item: VoyagePort, key) => {
      elements.push(
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              {...formlayout}
              label={item.portTypeName}
            >
              <Input disabled className="OnlyRead" value={item.portName} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              {...formlayout}
              label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.ETA' })}
            >
              <Input disabled className="OnlyRead" value={moment(Number(item.arriveDate)).format('YYYY/MM/DD')} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              {...formlayout}
              label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.ETD' })}
            >
              <Input disabled className="OnlyRead" value={moment(Number(item.leaveDate)).format('YYYY/MM/DD')} />
            </Form.Item>
          </Col>
        </Row>,
      );
    });
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.checkVoyage' })}
          event={() => {
            this.onBack();
          }}
        /><div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.shipType' })}
                >
                  <Input
                    disabled
                    value={isNil(this.state) || isNil(this.state.shipType) ? '' : this.state.shipType}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.shipDeck' })}
                >
                  <Input
                    disabled
                    value={isNil(this.state) || isNil(this.state.shipDeck) ? '' : this.state.shipDeck}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.deadWeightTon' })}
                >
                  <Input
                    disabled
                    suffix={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.ton' })}
                    value={
                      isNil(this.state) || isNil(this.state.tonNumber) ? '' : this.state.tonNumber
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.buildYear' })}
                >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.buildParticularYear)
                        ? ''
                        : this.state.buildParticularYear
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.shipDraught' })}
                >
                  <Input
                    disabled
                    suffix={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.m' })}
                    value={isNil(this.state) || isNil(this.state.draft) ? '' : this.state.draft}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.shipCrane' })}
                >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.shipCrane) ? '' : this.state.shipCrane
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.acceptableVolume' })}
                >
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix="m³"
                    value={
                      isNil(this.state) || isNil(this.state.acceptCapacity)
                        ? ''
                        : this.state.acceptCapacity
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.fixedAtThePort' })}
                >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.portNameCn) ? '' : this.state.portNameCn
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.shipVoyage' })}
                >
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.seaMile' })}
                    value={
                      isNil(this.state) || isNil(this.state.shipVoyage) ? '' : this.state.shipVoyage
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.acceptableTon' })}
                >
                  <Input
                    disabled
                    className="OnlyRead"
                    suffix={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.ton' })}
                    value={
                      isNil(this.state) || isNil(this.state.acceptTon) ? '' : this.state.acceptTon
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider dashed />
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.shipRouter' })}
                >
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
              <Col span={12}></Col>
            </Row>
            <div style={{ width: '100%', background: 'rgba(244,244,244,1)' }}>
              {elements}
            </div>

            <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="CloseButton"
                  text={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.shutDown' })}
                  event={() => {
                    this.onBack();
                  }}
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

const VoyageDynamicsView_Form = Form.create({ name: 'VoyageDynamicsView_Form' })(
  VoyageDynamicsView,
);

export default VoyageDynamicsView_Form;
