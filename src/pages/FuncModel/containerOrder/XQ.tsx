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

    getRequest('/business/shipBooking/getContainerLeasingUserDetailForWeb'+'?guid='+uid,params,(response: any) => {

      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            country: response.data.ContainerLeasingDto.country ? response.data.ContainerLeasingDto.country : '', //还箱国家

            createDate: response.data.ContainerLeasingUserDto.createDate ? moment(response.data.ContainerLeasingUserDto.createDate).format("YYYY-MM-DD"): '',//订舱时间

            orderNumber: response.data.ContainerLeasingUserDto.orderNumber ? response.data.ContainerLeasingUserDto.orderNumber : '',//编号

            containerFiftyThree:response.data.ContainerLeasingUserDto.containerFiftyThree? response.data.ContainerLeasingUserDto.containerFiftyThree:'',// 53数量

            containerFourtyEight: response.data.ContainerLeasingUserDto.containerFourtyEight? response.data.ContainerLeasingUserDto.containerFourtyEight:'',// 48数量

            containerFiftyThreeS:response.data.ContainerLeasingDto.containerFiftyThree? response.data.ContainerLeasingDto.containerFiftyThree:'', //53英尺

            containerFourtyEightS:response.data.ContainerLeasingDto.containerFourtyEight? response.data.ContainerLeasingDto.containerFourtyEight:'', //48英尺

            containerFiftyThreeYuanjia:response.data.ContainerLeasingDto.containerFiftyThreeYuanjia? response.data.ContainerLeasingDto.containerFiftyThreeYuanjia:'', // 53原价

            containerFourtyEightYuanjia:response.data.ContainerLeasingDto.containerFourtyEightYuanjia? response.data.ContainerLeasingDto.containerFourtyEightYuanjia :'',// 48原价

            containerFiftyThreeTejia:response.data.ContainerLeasingDto.containerFiftyThreeTejia? response.data.ContainerLeasingDto.containerFiftyThreeTejia:'', // 53原价

            containerFourtyEightTejia:response.data.ContainerLeasingDto.containerFourtyEightTejia? response.data.ContainerLeasingDto.containerFourtyEightTejia:'', // 53原价

            protNameCn:response.data.ContainerStartPortDto.portNameEn? response.data.ContainerStartPortDto.portNameEn +'---'+response.data.ContainerStartPortDto.protNameCn:'', // 租箱

            portNameEn: response.data.ContainerEndPortDto.portNameEn? response.data.ContainerEndPortDto.portNameEn+'---'+response.data.ContainerEndPortDto.protNameCn:'', // 还箱

            accountId: response.data.UserDto.accountId? response.data.UserDto.accountId:'',//用户名

            firstName:response.data.UserDto.firstName? response.data.UserDto.firstName+response.data.UserDto.lastName:'',//姓名

            phoneNumber: response.data.UserDto.phoneNumber?response.data.UserDto.phoneCode +' '+ response.data.UserDto.phoneNumber:'',//联系电话

            userType:response.data.UserDto.userType? response.data.UserDto.userType:'',// 用户类型
          });
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/containerOrder')
  }



  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text='租箱用户信息'//查看货盘
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
                <Form.Item {...formlayout} label='租箱时间'>
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
                    suffix={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.ton' })}
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

            <div className={commonCss.title}>
              <span className={commonCss.text}>集装箱租赁详情</span>
            </div>

              <Form labelAlign="left">
                <Row gutter={24}>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="还箱国家">
                    <InputGroup >
                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.country) ? '' : this.state.country
                          } />
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="租箱地点">
                          <Col span={12}>
                            <Input disabled value={
                            isNil(this.state) || isNil(this.state.protNameCn) ? '' : this.state.protNameCn
                          } />
                          </Col>
                    </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="集装箱尺寸">
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
                  <Form.Item  {...formlayout} label="还箱地点">
                          <Col span={12}>
                            <Input disabled value={
                            isNil(this.state) || isNil(this.state.portNameEn) ? '' : this.state.portNameEn
                          } />
                          </Col>

                    </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>

                <Col span={12}>
                  <Form.Item  {...formlayout} label="集装箱价格">
                    <InputGroup >


                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFourtyEightTejia) ? '' : this.state.containerFourtyEightTejia
                          } />
                        </Col>
                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFiftyThreeTejia) ? '' : this.state.containerFiftyThreeTejia
                          } />
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>

                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="数量">
                    <InputGroup >

                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFourtyEight) ? '' : this.state.containerFourtyEight
                          } />
                        </Col>
                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.containerFiftyThree) ? '' : this.state.containerFiftyThree
                          } />
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>

                </Col>

              </Row>
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
