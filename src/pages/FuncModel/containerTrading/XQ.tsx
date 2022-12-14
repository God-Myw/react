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

const { TextArea } = Input;
class PalletDynamicsView extends React.Component<PalletFormProps, PalletFormProps> {
  constructor(props: PalletFormProps) {
    super(props);
  }

  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    this.setState({ guid: uid });
    let params: Map<string, string> = new Map();

    getRequest('/business/shipBooking/getContainerTradingUserDetailForWeb'+'?guid='+uid+'&',params,(response: any) => {

      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          let OP = response.data.user?response.data.user.userType:'';
          this.setState({
            containerTradingUser : response.data.containerTradingUser,
            user : response.data.user,
            detail : response.data.containerTradingUser.detail,
            userType :  OP ? OP == 0?'管理员' : OP == 1 ? '线上客服' : OP == 2 ? ' 线下客服' : OP == 3 ? '审核客服' : OP == 4 ? '货主' : OP == 5 ? '船东' : OP == 6 ? '服务商':OP == 7 ? '推广人员':'' : '',
            orderNumber : response.data.orderNumber,
            createDate : response.data.user.createDate ? moment(response.data.user.createDate).format("YYYY-MM-DD"): '',//订舱时间
          });

        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/containerTrading')
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
          text='订舱用户信息'
          event={() => {
            this.onBack();
          }}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
          <Row gutter={24}>
              <Col span={12}>

                <Form.Item {...formlayout} label='订单编号'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.orderNumber) ? '' : this.state.orderNumber
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='买箱时间'>
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
                      isNil(this.state) || isNil(this.state.user) ? '' : this.state.user.firstName||this.state.user.lastName ?this.state.user.firstName+this.state.user.lastName:''
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
                    suffix={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.ton' })}
                    value={
                      isNil(this.state) || isNil(this.state.user) ? '' : this.state.user.accountId
                    }
                  />
                </Form.Item>
              </Col>

                  <Col span={12}>
                    <Form.Item {...formlayout} label='联系电话'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.user) ? '' : this.state.user.phoneNumber
                        }
                      />
                    </Form.Item>
                  </Col>
            </Row>

            <div className={commonCss.title}>
              <span className={commonCss.text}>班轮订舱详情</span>
            </div>


            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label='交箱地点'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.containerTradingUser) ? '' : this.state.containerTradingUser.portName
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>

              </Col>
            </Row>
                  <Row gutter={24}>
                    <Col span={3}>

                    </Col>
                    <Col span={4}>
                      <h4 style={{marginLeft:'35%'}}>
                        集装箱尺寸
                      </h4>
                    </Col>
                    <Col span={4}>
                      <h4 style={{marginLeft:'35%'}}>
                        全新/二手
                      </h4>
                    </Col>
                    <Col span={4}>
                      <h4 style={{marginLeft:'35%'}}>
                        价格
                      </h4>
                    </Col>
                    <Col span={4}>
                      <h4 style={{marginLeft:'35%'}}>
                        数量
                      </h4>
                    </Col>
                  </Row>

                    { isNil(this.state) || isNil(this.state.detail) ? '' :this.state.detail.map(item=>{
                      return (
                        <div>
                          <Row gutter={24}>
                            <Col span={3}>
                            </Col>
                            <Col span={4}>
                              <Input
                                  disabled
                                  className="OnlyRead"
                                  value={item.size}
                                />
                            </Col>
                            <Col span={4}>
                                <Input
                                  disabled
                                  className="OnlyRead"
                                  value={item.type==0?'全新':'二手'}
                                />
                            </Col>
                            <Col span={4}>
                                <Input
                                  disabled
                                  className="OnlyRead"
                                  value={item.money}
                                />
                            </Col>
                            <Col span={4}>
                                <Input
                                  disabled
                                  className="OnlyRead"
                                  value={item.count}
                                />
                            </Col>
                          </Row>
                          <br></br>
                        </div>
                      )})
                    }
                  <div className={commonCss.title}>
                    <span className={commonCss.text}>集装箱购买说明</span>
                  </div>
                  <Row gutter={24}>
                    <Col>
                      <Form.Item {...smallFormItemLayout} label="班轮优势信息">
                        <Input.TextArea
                          maxLength={300}
                          style={{ width: '100%', height: '200px' }}
                          disabled
                          value={
                                  isNil(this.state) || isNil(this.state.containerTradingUser) ? '' : this.state.containerTradingUser.remark
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
