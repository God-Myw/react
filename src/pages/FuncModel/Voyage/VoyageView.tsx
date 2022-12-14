import { getRequest } from '@/utils/request';
import { Col, Divider, Form, Input, Row, DatePicker } from 'antd';
import { forEach, isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import VoyageFormProps, { VoyagePort } from '../VoyageDynamics/VoyageDynamicsFormInterface';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import { getTableEnumText } from '@/utils/utils';

//船东航次新增页面
class VoyageView extends React.Component<VoyageFormProps, VoyageFormProps> {
  constructor(props: VoyageFormProps) {
    super(props);
  }

  componentDidMount() {
    let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    if (guid) {
      let params: Map<string, string> = new Map();
      params.set('type', '1');
      //通过ID获取投保信息
      getRequest('/business/voyage/' + guid, params, (response: any) => {
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            let shipData = response.data.ship;
            let voyageData = response.data.voyage;
            let voyagePort = response.data.voyagePort;

            this.setState({
              shipName: shipData.shipName,
              shipType: getTableEnumText('ship_type', shipData.shipType),
              shipDeck: getTableEnumText('ship_deck', shipData.shipDeck),
              buildParticularYear: shipData.buildParticularYear,
              tonNumber: shipData.tonNumber,
              shipCrane: shipData.shipCrane,
              draft: shipData.draft,
              contacter: voyageData.contacter,
              contactPhone: voyageData.contactPhone,
              phoneCode: voyageData.phoneCode,
              acceptTon: voyageData.acceptTon,
              acceptCapacity: voyageData.acceptCapacity,
              shipVoyage: voyageData.shipVoyage,
              voyageStartPort: getTableEnumText('port', voyageData.voyageStartPort),
              voyageLineName: response.data.voyageLineName,
              voyagePort: voyagePort,
            });

            //通过船舶ID获取船舶港口信息
            let param: Map<string, string> = new Map();
            param.set('type', '1');
            getRequest('/business/ship/' + guid, param, (response: any) => {
              if (response.status === 200) {
                //把查询到的信息data赋值给页面
                if (!isNil(response.data)) {
                  this.setState({
                    anchoredPort: getTableEnumText('port', shipData.anchoredPort),
                  });
                }
              }
            });
          }
        }
      });
    }
  }

  onBack = () => {
    this.props.history.push('/voyage/list');
  };

  //渲染
  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    //获取港口list
    let voyagePortList =
      isNil(this.state) || isNil(this.state.voyagePort) ? [] : this.state.voyagePort;
    const elements: JSX.Element[] = [];
    forEach(voyagePortList, (item: VoyagePort, key) => {
      elements.push(
        <Row gutter={24}>
          <Col span={8} style={{ marginLeft: '16px' }}>
            <Form.Item {...formlayout} label={item.portTypeName}>
              <Input disabled className="OnlyRead" value={item.portName} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item {...formlayout} label={formatMessage({ id: 'Voyage-VoyageAdd.ETA' })}>
              <DatePicker
                disabled
                format={'YYYY/MM/DD'}
                className="OnlyRead"
                value={moment(Number(item.arriveDate))}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item {...formlayout} label={formatMessage({ id: 'Voyage-VoyageAdd.ETD' })}>
              <DatePicker
                disabled
                format={'YYYY/MM/DD'}
                className="OnlyRead"
                value={moment(Number(item.leaveDate))}
              />
            </Form.Item>
          </Col>
        </Row>,
      );
    });
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'Voyage-VoyageView.voyageDetail' })}
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageList.shipName' })}
                >
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.shipName) ? '' : this.state.shipName
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.shipDeck' })}
                >
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.shipDeck) ? '' : this.state.shipDeck
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageList.shipType' })}
                >
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.shipType) ? '' : this.state.shipType
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.buildYear' })}
                >
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.buildParticularYear)
                        ? ''
                        : this.state.buildParticularYear
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.deadWeight' })}
                >
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.tonNumber) ? '' : this.state.tonNumber
                    }
                    suffix={formatMessage({ id: 'Voyage-VoyageAdd.ton' })}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.shipCrane' })}
                >
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.shipCrane) ? '' : this.state.shipCrane
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Voyage-VoyageAdd.draft' })}>
                  <Input
                    value={isNil(this.state) || isNil(this.state.draft) ? '' : this.state.draft}
                    suffix="m"
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.shipVoyage' })}
                >
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.shipVoyage) ? '' : this.state.shipVoyage
                    }
                    disabled
                    suffix={formatMessage({ id: 'Voyage-VoyageView.seaMile' })}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.contacter' })}
                >
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.contacter) ? '' : this.state.contacter
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.phoneNumber' })}
                >
                  <div>
                    <Col span={3}>
                      <Input
                        className="telinput"
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.phoneCode)
                            ? ''
                            : this.state.phoneCode
                        }
                      />
                    </Col>
                    <Col span={21}>
                      <Input
                        value={
                          isNil(this.state) || isNil(this.state.contactPhone)
                            ? ''
                            : this.state.contactPhone
                        }
                        disabled
                      />
                    </Col>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.acceptVolume' })}
                >
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.acceptCapacity)
                        ? ''
                        : this.state.acceptCapacity
                    }
                    suffix="m³"
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.acceptTon' })}
                >
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.acceptTon) ? '' : this.state.acceptTon
                    }
                    suffix={formatMessage({ id: 'Voyage-VoyageAdd.ton' })}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageAdd.voyageStartPort' })}
                >
                  <Input
                    value={
                      isNil(this.state) || isNil(this.state.voyageStartPort)
                        ? ''
                        : this.state.voyageStartPort
                    }
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>
            <Divider dashed />
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Voyage-VoyageList.settedVoyage' })}
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
              {/* <Col span={12}></Col> */}
            </Row>
            <div style={{ background: 'rgba(244,244,244,1)' }}>{elements}</div>
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  disabled={false}
                  type="CloseButton"
                  text={formatMessage({ id: 'Voyage-VoyageView.close' })}
                  event={() => this.onBack()}
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

export default VoyageView;
