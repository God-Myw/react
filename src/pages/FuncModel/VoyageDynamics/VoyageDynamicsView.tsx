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
            createDate: moment(response.data.ship.createDate).format('L'),
            isChina: response.data.voyage.isChina,
            voyageStartPortDate: response.data.voyageStartPortDate ? response.data.voyageStartPortDate.title_cn : '',
            voyagePortListAndTitle: response.data.voyagePortListAndTitle,
            expectStartDate: response.data.voyage.expectStartDate ? moment(response.data.voyage.expectStartDate).format('YYYY-MM-DD') : '',
            expectEndDate: response.data.voyage.expectEndDate ? moment(response.data.voyage.expectEndDate).format('YYYY-MM-DD') : '',
            remark: response.data.voyage.remark ? response.data.voyage.remark : '',
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
              {/* 到达时间 */}
              <Input disabled className="OnlyRead" value={moment(Number(item.arriveDate)).format('YYYY/MM/DD')} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              {...formlayout}
              label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.ETD' })}
              >
              {/* 离开港口时间 */}
              <Input disabled className="OnlyRead" value={moment(Number(item.leaveDate)).format('YYYY/MM/DD')} />
            </Form.Item>
          </Col>
        </Row>,
      );
    });
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.checkVoyage' })}//航次查看
          event={() => {
            this.onBack();
          }}
        />
        <div className={commonCss.AddForm}>
          <div className={commonCss.title}>
            <span className={commonCss.text}>船舶信息</span>
          </div>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.shipName' })}//船舶名称
                >
                  <Input
                    disabled
                    value={isNil(this.state) || isNil(this.state.shipName) ? '' : this.state.shipName}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.shipDeck' })}//'船型
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
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.shipType' })}//船舶类型
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
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.buildYear' })}//建造年份
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
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.deadWeightTon' })}//载重吨
                >
                  <Input
                    disabled
                    suffix={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.ton' })}//吨
                    value={
                      isNil(this.state) || isNil(this.state.tonNumber) ? '' : this.state.tonNumber
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.shipCrane' })}//船吊
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
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.shipDraught' })}//船舶吃水
                >
                  <Input
                    disabled
                    suffix={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.m' })}//m
                    value={isNil(this.state) || isNil(this.state.draft) ? '' : this.state.draft}
                  />
                </Form.Item>
              </Col>

            </Row>
            <div className={commonCss.title}>
              <span className={commonCss.text}>联系信息</span>
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.contacts' })}//联系人
                >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.contacter) ? '' : this.state.contacter
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.contactPhone' })}//联系方式
                >
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
                      isNil(this.state) || isNil(this.state.contactPhone)
                        ? ''
                        : this.state.contactPhone
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className={commonCss.title}>
              <span className={commonCss.text}>承运信息</span>
            </div>
            {
              // 1是国外 0是国内
              !isNil(this.state) && this.state.isChina == '1'?(
                <div>


                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        {...formlayout}
                        label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.acceptableVolume' })}//可接受体积
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
                        label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.acceptableTon' })}//可接受吨位
                      >
                        <Input
                          disabled
                          className="OnlyRead"
                          suffix={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.ton' })}//吨
                          value={
                            isNil(this.state) || isNil(this.state.acceptTon) ? '' : this.state.acceptTon
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      {...formlayout}
                      label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.shipVoyage' })}//船舶航程
                    >
                      <Input
                        disabled
                        className="OnlyRead"
                        suffix={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.seaMile' })}//海里
                        value={
                          isNil(this.state) || isNil(this.state.shipVoyage) ? '' : this.state.shipVoyage
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...formlayout}
                      label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.fixedAtThePort' })}//所在港口
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
                </div>
              ) :(
                <div>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          {...formlayout}
                          label='空船日期'
                        >
                          <Input
                            disabled
                            className="OnlyRead"
                            value={
                              isNil(this.state) || isNil(this.state.expectStartDate) || isNil(this.state.expectEndDate)
                                ? ''
                                : this.state.expectStartDate +'至'+ this.state.expectEndDate
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...formlayout}
                          label='起运港'
                        >
                          <Input
                            disabled
                            className="OnlyRead"
                            value={
                              isNil(this.state) || isNil(this.state.voyageStartPortDate) ? '' : this.state.voyageStartPortDate
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          {...formlayout}
                          label='目的港'
                        >
                          <Input
                            disabled
                            className="OnlyRead"
                            // value = '123'
                            //titleCN:
                            value={
                              isNil(this.state) || isNil(this.state.voyagePortListAndTitle) ? '' : (this.state.voyagePortListAndTitle.map( item => {
                                  return item.titleCN+' '
                              }))
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...formlayout}
                          label='备注'
                        >
                          <Input
                            disabled
                            value={
                              isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                            }
                          />
                        </Form.Item>
                      </Col>
                  </Row>
                </div>
              )
            }



            {/* <Divider dashed /> */}
            {/* {
              !isNil(this.state) && this.state.isChina == '1'?(
                <div>
                  <div className={commonCss.title}>
                    <span className={commonCss.text}>航线信息</span>
                  </div>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        {...formlayout}
                        label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.shipRouter' })}//已定航线
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

                  <Row  gutter={24}>
                    <Col span={12}>
                      <Form.Item
                          {...formlayout}
                          label='停靠港口'
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
                    <Col span={6}>
                      <Form.Item
                          {...formlayout}
                          label='ETA'
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
                    <Col span={6}>
                      <Form.Item
                          {...formlayout}
                          label='ETC'
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
                  </Row>
                </div>
              ):null
            } */}

            <div style={{ width: '100%', background: 'rgba(244,244,244,1)' }}>
              {elements}
            </div>

            <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="CloseButton"
                  text={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.shutDown' })}//关闭
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
