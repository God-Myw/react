import { fileType } from '@/pages/Common/Components/FileTypeCons';
import HrComponent from '@/pages/Common/Components/HrComponent';
import getRequest, { putRequest, postRequest } from '@/utils/request';
import { getTableEnumText, linkHref } from '@/utils/utils';
import { Col, Form, Input, Modal, Row, Upload, Icon, message, List, Card, Button, Radio } from 'antd';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import PalletFormProps, { FileModel, PicList } from './XQFACCE';
import { HandleBeforeUpload } from '@/utils/validator';
const defaultpic = require('../../Image/default.png');
const InputGroup = Input.Group;

const { TextArea } = Input;
class PalletDynamicsView extends React.Component<PalletFormProps, PalletFormProps> {
  constructor(props: PalletFormProps) {
    super(props);
  }

  // state = {
  //   cities: cityData[provinceData[0]],
  //   secondCity: cityData[provinceData[0]][0],
  // };
  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let eee = this.props.match.params['e'] ? this.props.match.params['e'] : '';
    this.setState({
      guid: uid,
      guide: eee,
    });
    let params: Map<string, string> = new Map();

    getRequest('/business/shipBooking/getContainerLeasingDeatilForWeb'+'?guid='+ uid, params,(response: any) => {

      console.log(111111111111)
      console.log(111111111111)
      console.log(111111111111)
      console.log(111111111111)
      console.log(response)
      if (response.status === 200) {
        console.log(response)
        if (!isNil(response.data)) {
          this.setState({
            // guide: eee,

            country: response.data.country ? response.data.country : '', //还箱国家
            containerFourtyEight: response.data.containerFourtyEight ? response.data.containerFourtyEight : '', //48英尺

            containerFourtyEightTejia: response.data.containerFourtyEightTejia ? response.data.containerFourtyEightTejia : '', //48英尺特价

            containerFourtyEightYuanjia: response.data.containerFourtyEightYuanjia ? response.data.containerFourtyEightYuanjia : '', //48英尺原价

            containerFiftyThree: response.data.containerFiftyThree ? response.data.containerFiftyThree : '', //53英尺

            containerFiftyThreeTejia: response.data.containerFiftyThreeTejia ? response.data.containerFiftyThreeTejia : '', //53英尺特价

            containerFiftyThreeYuanjia: response.data.containerFiftyThreeYuanjia ? response.data.containerFiftyThreeYuanjia : '', //53英尺原价



          });
          console.log(this.state.uuuid)
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/containerSpike/edit')
  }



  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    const data = [
      {
        title: 'Title 1',
      },
      {
        title: 'Title 2',
      },
      {
        title: 'Title 3',
      },
      {
        title: 'Title 4',
      },
    ];

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={
            isNil(this.state) || isNil(this.state.guide) ? '' : this.state.guide==0?'秒杀详情':this.state.guide==1?'预告中详情':this.state.guide==2?'已结束详情':''
          }
          event={() => {
            this.onBack();
          }}
        />

        <div className={commonCss.AddForm}>
          <div className={commonCss.title}>
            <span className={commonCss.text}>发布秒杀用户信息</span>
          </div>
          <Form labelAlign="left">

          <Row gutter={24}>
              <Col span={12}>

                <Form.Item {...formlayout} label='秒杀编号'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.orderNumber) ? '' : this.state.orderNumber
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='发布时间'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.createDate) ? '' : this.state.createDate
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>

                <Form.Item {...formlayout} label='用户类型'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.userType) ? '' : this.state.userType
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='姓名'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.firstName) ? '' : this.state.firstName
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>

              <Col span={12}>
                <Form.Item {...formlayout} label='用户名'>
                  <Input
                    disabled

                    value={
                      isNil(this.state) || isNil(this.state.accountId) ? '' : this.state.accountId
                    }
                  />
                </Form.Item>
              </Col>

                  <Col span={12}>
                    <Form.Item {...formlayout} label='联系电话'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.phoneNumber) ? '' : this.state.phoneNumber
                        }
                      />
                    </Form.Item>
                  </Col>
            </Row>
            <Row gutter={24}>

              <Col span={12}>
                <Form.Item {...formlayout} label='支付保证金'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.accountId) ? '' : this.state.accountId
                    }
                  />
                </Form.Item>
              </Col>

                  <Col span={12}>
                    <Form.Item {...formlayout} label='支付方式'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.phoneNumber) ? '' : this.state.phoneNumber
                        }
                      />
                    </Form.Item>
                  </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='保证金支付时间'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.accountId) ? '' : this.state.accountId
                      }
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item {...formlayout} label='支付单号'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.phoneNumber) ? '' : this.state.phoneNumber
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            <div className={commonCss.title}>
              <span className={commonCss.text}>现舱信息</span>
            </div>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="起始港">
                    <InputGroup >

                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFourtyEightS) ? '' : this.state.containerFourtyEightS
                          } />
                        </Col>
                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFiftyThreeS) ? '' : this.state.containerFiftyThreeS
                          } />
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="目的港">
                    <InputGroup >

                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFourtyEightS) ? '' : this.state.containerFourtyEightS
                          } />
                        </Col>
                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFiftyThreeS) ? '' : this.state.containerFiftyThreeS
                          } />
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="截关时间">
                    <InputGroup >

                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFourtyEightS) ? '' : this.state.containerFourtyEightS
                          } />
                        </Col>
                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFiftyThreeS) ? '' : this.state.containerFiftyThreeS
                          } />
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="开船时间">
                    <InputGroup >

                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFourtyEightS) ? '' : this.state.containerFourtyEightS
                          } />
                        </Col>
                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFiftyThreeS) ? '' : this.state.containerFiftyThreeS
                          } />
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='航程'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.accountId) ? '' : this.state.accountId
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='促销标签1'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.phoneNumber) ? '' : this.state.phoneNumber
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='船公司'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.accountId) ? '' : this.state.accountId
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='促销标签2'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.phoneNumber) ? '' : this.state.phoneNumber
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='所属公司'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.accountId) ? '' : this.state.accountId
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col>
                  <Form.Item {...smallFormItemLayout} label="现舱优势信息">
                    <Input.TextArea
                      maxLength={300}
                      style={{ width: '100%', height: '100px' }}
                      disabled
                      value={
                              isNil(this.state) || isNil(this.state.containerTradingUser) ? '' : this.state.containerTradingUser.remark
                            }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div className={commonCss.title}>
                <span className={commonCss.text}>秒杀相关</span>
              </div>
              <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label='秒杀开始时间'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.type) ? '' : this.state.type
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label='关注人数'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.seaFreight) ? '' : this.state.seaFreight
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label='秒杀结束时间'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.boxSum) ? '' : this.state.boxSum
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label='围观人数'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.pricesss) ? '' : this.state.pricesss
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>发布的箱型&数量、费用</span>
                </div>
                {/* {
                    isNil(this.state) || isNil(this.state.others) ? '' :this.state.others.map(item=>{
                      return( */}
                        <div>
                          <div>
                            <h2>
                              20GP
                            </h2>
                          </div>
                          <Row gutter={24}>
                            <Col span={12}>
                              <Form.Item  {...formlayout} label="海运秒杀价(单价)">
                                <Input
                                  disabled
                                  value={
                                    isNil(this.state) || isNil(this.state.pricesss) ? '' : this.state.pricesss
                                  }
                                />
                                {/* <Input disabled value={
                                    item.money
                                } /> */}
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item  {...formlayout} label="数量">
                                <Input
                                  disabled
                                  value={
                                    isNil(this.state) || isNil(this.state.pricesss) ? '' : this.state.pricesss
                                  }
                                />
                                {/* <Input disabled value={
                                    item.money
                                } /> */}
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={24}>
                            <Col span={12}>
                              <Form.Item  {...formlayout} label="海运费原价(单价)">
                                <Input
                                  disabled
                                  value={
                                    isNil(this.state) || isNil(this.state.pricesss) ? '' : this.state.pricesss
                                  }
                                />
                                {/* <Input disabled value={
                                    item.money
                                } /> */}
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item  {...formlayout} label="海运费总金额">
                                <Input
                                  disabled
                                  value={
                                    isNil(this.state) || isNil(this.state.pricesss) ? '' : this.state.pricesss
                                  }
                                />
                                {/* <Input disabled value={
                                    item.money
                                } /> */}
                              </Form.Item>
                            </Col>
                          </Row>
                          <List
                            grid={{ gutter: 16, column: 4 }}
                            dataSource={data}
                            renderItem={item => (
                              <List.Item>
                                <Card title={item.title}>Card content</Card>
                              </List.Item>
                            )}
                          />
                        </div>
                      {/* )
                    })

                  } */}
            {

              isNil(this.state) || isNil(this.state.guide) ? '' : this.state.guide == 1 || this.state.guide == 0 ? null:(
                <div>
                  <div className={commonCss.title}>
                    <span className={commonCss.text}>退保证金</span>
                  </div>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label='卖方申请退保证金'>
                        <Input
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.usershipment) ? '' : this.state.usershipment
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label='审核客服审核'>
                        <Input
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.shipment) ? '' : this.state.shipment
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label='退还保证金'>
                        <Input
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.bondsss) ? '' : this.state.bondsss
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label='退还方式'>
                        <Input
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.counts) ? '' : this.state.counts
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label='退还时间'>
                        <Input
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.alipayWxpaysss) ? '' : this.state.alipayWxpaysss
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label='支付单号'>
                        <Input
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.moneyTypes) ? '' : this.state.moneyTypes
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      {/* <Form.Item {...formlayout} label='发布者退还方式'>
                        <Radio.Group onChange={this.onChange1} value={this.state.valuess}>
                          <Radio style={{color:'black'}} value={0}>支付宝</Radio>
                          <Radio style={{color:'black'}} value={1}>微信</Radio>
                        </Radio.Group>
                      </Form.Item> */}
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label='购买方退还方式'>
                        {/* <Radio.Group onChange={this.onChange2} value={this.state.valuesss}> */}
                        <Radio.Group onChange={this.onChange2} >
                          <Radio style={{color:'black'}} value={0}>支付宝</Radio>
                          <Radio style={{color:'black'}} value={1}>微信</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col span={12}>
                      {/* <Form.Item {...formlayout} label='点击右侧按钮退还保证金'>
                          <Button style={{backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.fabuzhe} >
                            退还保证金
                          </Button>
                      </Form.Item> */}
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label='点击右侧按钮退还保证金'>
                          <Button style={{backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.goumaifang} >
                            退还保证金
                          </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )
            }

            { isNil(this.state) || isNil(this.state.guide) ? '' : this.state.guide == 1  ? null:(
              <div>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>客服备注</span>
                </div>
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...smallFormItemLayout} label="客服备注">
                      <Input.TextArea
                        maxLength={300}
                        style={{ width: '100%', height:'200px'}}
                          onChange={e => this.setState({ remarkkk: e.target.value })}
                          value={
                            isNil(this.state) || isNil(this.state.remarks) ? '' : this.state.remarks
                          }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

              <Row gutter={24}>
                <Col span={24} >
                  <div style={{width:'100%',textAlign:'center'}}>
                    {
                      isNil(this.state) || isNil(this.state.guide) ? '' : this.state.guide == 1  ? null:(

                        <Button style={{backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.baochunanniu} >
                          保存
                        </Button>
                    )}
                    <Button  style={{marginLeft:'10px',marginRight:'10px',backgroundColor: '#57B5E3', color: '#FFFFFF'}} onClick={this.onBack} >
                      关闭
                    </Button>
                    <Button style={{marginRight:'10px',backgroundColor: '#F40028', color: '#FFFFFF'}} onClick={this.tiaozhuan} >
                      取消订单
                    </Button>
                  </div>
                </Col>
              </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const PalletDynamicsView_Form = Form.create({ name: 'PalletDynamicsView_Form' })(
  PalletDynamicsView,
);

export default PalletDynamicsView_Form;
