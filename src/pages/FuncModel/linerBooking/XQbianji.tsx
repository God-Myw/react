import { fileType } from '@/pages/Common/Components/FileTypeCons';
import HrComponent from '@/pages/Common/Components/HrComponent';
import getRequest, { putRequest, postRequest } from '@/utils/request';
import { getTableEnumText, linkHref } from '@/utils/utils';
import { Col, Form, Input, Modal, Row, Upload, Icon, message } from 'antd';
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

  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    this.setState({ guid: uid });
    let params: Map<string, string> = new Map();

    getRequest('/business/shipBooking/getShipBookingById'+'?guid='+uid,params,(response: any) => {

      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          let OP = response.data.user?response.data.user.userType:'';
          let lables = response.data.shipBookingVo.lables;
          let ceshi1 = response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.indexOf('1:'):'';
          let ceshi2 = response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.indexOf('#2:'):'';
          let ceshi3 = response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.indexOf('#3:'):'';
          this.setState({
            userType :  OP ? OP == 0?'管理员' : OP == 1 ? '线上客服' : OP == 2 ? ' 线下客服' : OP == 3 ? '审核客服' : OP == 4 ? '货主' : OP == 5 ? '船东' : OP == 6 ? '服务商':'' : '',
            name: response.data.user?response.data.user.firstName+response.data.user.lastName:'',//姓名
            accountId:response.data.user? response.data.user.accountId:'',//用户名
            phoneCode: response.data.user?response.data.user.phoneCode+' '+response.data.user.phoneNumber:'',//联系电话
            startPortCn: response.data.shipBookingVo.startPortCn ? response.data.shipBookingVo.startPortCn : '', //起始港（中文
            startPortEn : response.data.shipBookingVo.startPortEn?response.data.shipBookingVo.startPortEn:'', //起始港（英文）
            endPortCn : response.data.shipBookingVo.endPortCn?response.data.shipBookingVo.endPortCn:'',   //目的港（中文）
            endPortEn : response.data.shipBookingVo.endPortEn?response.data.shipBookingVo.endPortEn:'',   //目的港（英文）
            haiyunTwentyGpTejia : response.data.shipBookingVo.haiyunTwentyGpTejia?response.data.shipBookingVo.haiyunTwentyGpTejia:'', //20GP特价
            haiyunTwentyGpYuanjia : response.data.shipBookingVo.haiyunTwentyGpYuanjia?response.data.shipBookingVo.haiyunTwentyGpYuanjia:'',   //20GP原价
            haiyunFortyGpTejia : response.data.shipBookingVo.haiyunFortyGpTejia?response.data.shipBookingVo.haiyunFortyGpTejia:'',  //40GP特价
            haiyunFortyGpYuanjia : response.data.shipBookingVo.haiyunFortyGpYuanjia?response.data.shipBookingVo.haiyunFortyGpYuanjia:'',    //40GP原价
            haiyunFortyHqTejia : response.data.shipBookingVo.haiyunFortyHqTejia?response.data.shipBookingVo.haiyunFortyHqTejia:'',  //40HQ特价
            haiyunFortyHqYuanjia : response.data.shipBookingVo.haiyunFortyHqYuanjia?response.data.shipBookingVo.haiyunFortyHqYuanjia:'',    //40HQ原价

            requirements: response.data.shipBookingVo.userShipBookings.length>0?response.data.shipBookingVo.userShipBookings[0].twentyGp:'',
            requirementsOne:response.data.shipBookingVo.userShipBookings.length>0? response.data.shipBookingVo.userShipBookings[0].fortyGp:'',
            requirementsTwo: response.data.shipBookingVo.userShipBookings.length>0? response.data.shipBookingVo.userShipBookings[0].fortyHq:'',

            matouTwentyGp : response.data.shipBookingVo.matouTwentyGp?response.data.shipBookingVo.matouTwentyGp:'',   //码头费20GP
            matouFortyGp : response.data.shipBookingVo.matouFortyGp?response.data.shipBookingVo.matouFortyGp:'',    //码头费40GP
            matouFortyHq : response.data.shipBookingVo.matouFortyHq?response.data.shipBookingVo.matouFortyHq:'',    //码头费40HQ
            wenjianTwentyGp : response.data.shipBookingVo.wenjianTwentyGp?response.data.shipBookingVo.wenjianTwentyGp:'', //文件费20GP
            wenjianFortyGp : response.data.shipBookingVo.wenjianFortyGp?response.data.shipBookingVo.wenjianFortyGp:'',  //文件费40GP
            wenjianFortyHq : response.data.shipBookingVo.wenjianFortyHq?response.data.shipBookingVo.wenjianFortyHq:'',  //文件费40HQ
            amsTwentyGp : response.data.shipBookingVo.amsTwentyGp?response.data.shipBookingVo.amsTwentyGp:'', //MAS20GP
            amsFortyGp : response.data.shipBookingVo.amsFortyGp?response.data.shipBookingVo.amsFortyGp:'',  //MAS40GP
            amsFortyHq : response.data.shipBookingVo.amsFortyHq?response.data.shipBookingVo.amsFortyHq:'',  //MAS40HQ
            remark: response.data.shipBookingVo.remark?response.data.shipBookingVo.remark:'',
            shipBookingDate : response.data.shipBookingVo.shipBookingDate,//时间

            cuxiao1:response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.slice(ceshi1+2,ceshi2):'',
            cuxiao2:response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.slice(ceshi2+3,ceshi3):'',
            cuxiao3:response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.slice(ceshi3+3,lables.length):'',
          });
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/linerBooking/edit')
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

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text='查看班轮订舱'//查看货盘
          event={() => {
            this.onBack();
          }}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label='起始港'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.startPortCn) ? '' :this.state.startPortEn+' '+ this.state.startPortCn
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='目的港'>
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.startPortCn)
                        ? ''
                        : this.state.endPortEn+' '+this.state.endPortCn
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {
              isNil(this.state) || isNil(this.state.shipBookingDate) ? '' : (this.state.shipBookingDate.map(item=>{
                return (
                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item {...formlayout} label='截关日期'>
                        <Input
                          disabled
                          className="OnlyRead"
                          value={isNil(this.state) || isNil(this.state.shipBookingDate) ? '' :item.closingTimeWeek+'--- '+moment(item.closingTime).format('MMM Do') }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formlayout} label='开船日期'>
                        <Input
                          disabled
                          className="OnlyRead"
                          value={isNil(this.state) || isNil(this.state.shipBookingDate) ? '' :item.sailingTimeWeek+'--- '+ moment(item.sailingTime).format('MMM Do')}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...formlayout} label='航程'>
                        <Input
                          disabled
                          className="OnlyRead"
                          value={isNil(this.state) || isNil(this.state.shipBookingDate) ? '' :item.voyage}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )
              }))
            }
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item  {...formlayout} label="促销标签">
                  <InputGroup >
                      <Col span={8}>
                        <Input
                          disabled

                          value={
                            isNil(this.state) || isNil(this.state.cuxiao1) ? '' : this.state.cuxiao1
                          }
                          />
                      </Col>
                      <Col span={8}>
                        <Input

                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.cuxiao2) ? '' : this.state.cuxiao2
                          }
                          />
                      </Col>
                      <Col span={8}>
                        <Input


                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.cuxiao3) ? '' : this.state.cuxiao3
                          }
                          />
                      </Col>
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={12}>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={4}>
                <h4>
                  海运费
                </h4>
              </Col>
              <Col span={4}>
                <h4>
                  20GP
                </h4>
              </Col>
              <Col span={4}>
                <h4>
                  40GP
                </h4>
              </Col>
              <Col span={4}>
                <h4>
                  40HQ
                </h4>
              </Col>
            </Row>
            <br></br>
            <Row gutter={24}>
              <Col span={4}>
                <h4 style={{marginLeft:'120px'}}>
                  限时特价
                </h4>
              </Col>
              <Col span={4}>
                <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.haiyunTwentyGpTejia) ? '' : this.state.haiyunTwentyGpTejia
                    }
                    />
              </Col>
              <Col span={4}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.haiyunFortyGpTejia) ? '' : this.state.haiyunFortyGpTejia
                    }
                  />
              </Col>
              <Col span={4}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.haiyunFortyHqTejia) ? '' : this.state.haiyunFortyHqTejia
                    }
                  />
              </Col>
            </Row>
            {/* <br></br>
            <Row gutter={24}>
              <Col span={4}>
                <h4 style={{marginLeft:'120px'}}>
                  数量
                </h4>
              </Col>
              <Col span={4}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.requirements) ? '' : this.state.requirements
                    }
                  />
              </Col>
              <Col span={4}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.requirementsOne) ? '' : this.state.requirementsOne
                    }
                  />
              </Col>
              <Col span={4}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.requirementsTwo) ? '' : this.state.requirementsTwo
                    }
                  />
              </Col>
            </Row> */}
            <br></br>




            <Row gutter={24}>
                  <Col span={4}>
                    <h4 >
                      码头费
                    </h4>
                  </Col>
                  <Col span={4}>
                    <Input
                      disabled
                      value={
                      isNil(this.state) || isNil(this.state.matouTwentyGp) ? '' : this.state.matouTwentyGp
                      }
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      disabled
                      value={
                      isNil(this.state) || isNil(this.state.matouFortyGp) ? '' : this.state.matouFortyGp
                      }
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      disabled
                      value={
                      isNil(this.state) || isNil(this.state.matouFortyHq) ? '' : this.state.matouFortyHq
                      }
                    />
                  </Col>
                </Row>
                <br></br>



                <Row gutter={24}>
                  <Col span={4}>
                    <h4 >
                      文件费
                    </h4>
                  </Col>
                  <Col span={4}>
                    <Input
                      disabled
                      value={
                      isNil(this.state) || isNil(this.state.wenjianTwentyGp) ? '' : this.state.wenjianTwentyGp
                      }
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      disabled
                      value={
                      isNil(this.state) || isNil(this.state.wenjianFortyGp) ? '' : this.state.wenjianFortyGp
                      }
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      disabled
                      value={
                      isNil(this.state) || isNil(this.state.wenjianFortyHq) ? '' : this.state.wenjianFortyHq
                      }
                    />
                  </Col>
                </Row>
                <br></br>




                <Row gutter={24}>
                  <Col span={4}>
                    <h4 >
                      AMS
                    </h4>
                  </Col>
                  <Col span={4}>
                    <Input
                      disabled
                      value={
                      isNil(this.state) || isNil(this.state.amsTwentyGp) ? '' : this.state.amsTwentyGp
                      }
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      disabled
                      value={
                      isNil(this.state) || isNil(this.state.amsFortyGp) ? '' : this.state.amsFortyGp
                      }
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      disabled
                      value={
                      isNil(this.state) || isNil(this.state.amsFortyHq) ? '' : this.state.amsFortyHq
                      }
                    />
                  </Col>
                </Row>
            {/* <Row gutter={24}>
              <Col span={4}>
                <h4 style={{marginLeft:'120px'}}>
                  原价
                </h4>
              </Col>
              <Col span={4}>
                <Input disabled style={{textDecorationLine:'line-through'}} />
              </Col>
              <Col span={4}>
                <Input disabled style={{textDecorationLine:'line-through'}} />
              </Col>
              <Col span={4}>
                <Input disabled style={{textDecorationLine:'line-through'}} />
              </Col>
            </Row>
            <br></br> */}
                <div className={commonCss.title}>
                  <span className={commonCss.text}>班轮优势</span>
                </div>
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...smallFormItemLayout} label="班轮优势信息">
                      <Input.TextArea maxLength={300} style={{ width: '100%', height: '200px' }} disabled
                            value={
                                    isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                                  }
                      />
                    </Form.Item>
                  </Col>
                </Row>

              <Form labelAlign="left">
                <Row className={commonCss.rowTop}>
                    <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                      <ButtonOptionComponent
                        type="TurnDown"
                        text="关闭"
                        event={() => this.onBack()}
                        disabled={false}
                      />
                    </Col>
                </Row>

              </Form>

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
