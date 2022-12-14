import React from 'react';
import { getRequest, putRequest,postRequest,deleteRequest } from '@/utils/request';
import {
  Col,
  Divider,
  Row,
  Steps,
  message,
  Form,
  Typography,
  Checkbox,
  Modal,
  Upload,
  Timeline,
  Card,
  Input,
  Anchor,
  Button,
  Icon,
  List,
  DatePicker,
  Select,
  InputNumber,
} from 'antd';
import HrComponent from '@/pages/Common/Components/HrComponent';
import { RouteComponentProps } from 'dva/router';
import { isNil, forEach, filter } from 'lodash';
import commonCss from '../../Common/css/CommonCss.less';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import { OrderViewFormProps, FileMsg, LogisticsInfo } from './OrderViewInterface';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import moment from 'moment';
import { linkHref,getTableEnumText } from '@/utils/utils';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import ManagerLeft from '@/layouts/ManagerLeft';
import e from 'express';
import { exportExcel } from 'xlsx-oc'
// import commonCss from './index.css';


// const provinceData = [ '请选择公司','上海道裕物流科技有限公司', '上海林风国际货运代理有限公司',];
// const cityData = {
//   请选择公司: [],
//   上海道裕物流科技有限公司: [ '中国银行上海市共康支行', ' 448175443917',],
//   上海林风国际货运代理有限公司: [ '中国银行上海市分行共康支行', '439063871324',],
// };
const { Option } = Select;
const { Step } = Steps;
const { Text } = Typography;
const { confirm } = Modal;
const { Link } = Anchor;
const InputGroup = Input.Group;

let id_t = 0;

type OrderProps = OrderViewFormProps & RouteComponentProps;

class MyOrderView extends React.Component<OrderViewFormProps, OrderProps> {
  private userType = localStorage.getItem('userType');

  state = {
    // cities: cityData[provinceData[0]],
    // secondCity: cityData[provinceData[0]][0],
  };

  componentDidMount = () => {

    this.setState({

      visible: false,
      CGCG:'G',
      urls:'http://58.33.34.10:10443/images/truck/'//照片地址
    });


      this.dingdan()  //订单查询信息

  };

  //订单查询信息
  dingdan=()=>{
    let params: Map<string, any> = new Map();
    let guid = this.props.match.params['guid'];
    getRequest('/business/specialVehicle/getSpecialVehicleAuthById?guid=' + guid +'&', params, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          this.setState({
            name:response.data.name,
            contactPhone:response.data.contactPhone,
            idCard:response.data.idCard,
            province:response.data.province,
            detailedAddress:response.data.detailedAddress,
            packageTypeCn:response.data.packageTypeCn,
            moneyCount:response.data.moneyCount,
            orderNumber:response.data.orderNumber,
            paymentStatus:response.data.paymentStatus==0?'已支付': response.data.paymentStatus==1?'已退款':'',
            auditStatus:response.data.auditStatus==0?'待审核':response.data.auditStatus==1?'审核通过':response.data.auditStatus==2?'审核驳回':'',
          })
        }
        this.setState({
          auditStatus1 : response.data.auditStatus,
        })
        // console.log(response.data.auditStatus==0)
      }
    });

  }

  // 返回
  onBack = () => {
    this.props.history.push('/specialShip/list');
  };


  //审核通过
  check = ( status: string) => {
    let guids = this.props.match.params['guid'];
    const search = this;
    let requestData ;
    // requestData = {
    //   auditStatus:status*1,
    //   guid:guids,
    // };
      putRequest('/business/specialVehicle/updateVehicleAuthStatusById?guid='+guids +'&'+'auditStatus='+status, JSON.stringify(requestData), (response: any) => {
        console.log(response)
        if (response.status === 200) {
          // 跳转首页
          message.success('提交成功');
          // window.location.reload(true)
          // this.props.history.push('/specialShip/list');
          this.dingdan()
        } else {
          message.error('提交失败');
        }
      });
  };

  //审核驳回
  handleDelete = ( status: string,) => {
    let guids = this.props.match.params['guid'];
    const search = this;
    let requestData ;
    // requestData = {
    //   reviewRejectionReason:this.state.remark,

    // };
    if(this.state.remark==undefined){
      message.error('请填写驳回理由');
    }else{
      putRequest('/business/specialVehicle/updateVehicleAuthStatusById?guid='+guids +'&'+'auditStatus='+status+'&'+'reviewRejectionReason='+this.state.remark, JSON.stringify(requestData), (response: any) => {
        console.log(response)
        if (response.status === 200) {
          // 跳转首页
          message.success('提交成功');
          this.dingdan()
          // window.location.reload(true)
          // this.props.history.push('/specialShip/list');
        } else {
          message.error('提交失败');
        }
      });
    }
  };




  render() {

    const formlayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const formlayout4 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const smallerFormItemLayout = {
      labelCol: { span: 18 },
      wrapperCol: { span: 6 },
    };


    return (
      <div className={commonCss.container}>


          <Card bordered={false}>
          <div className={commonCss.container}>
            <LabelTitleComponent text="特种车船供应商管理" event={() => this.onBack()} />

              <Form labelAlign="left">
                <h2 style={{fontWeight:800}}>
                  商家信息
                </h2>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="姓名">
                    <Input disabled
                            value = {isNil(this.state) || isNil(this.state.name) ? '' : this.state.name}

                        ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="联系方式">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.contactPhone) ? '' : this.state.contactPhone }

                        ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="身份证号码">
                    <Input disabled
                            value = {isNil(this.state) || isNil(this.state.idCard) ? '' : this.state.idCard}

                        ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="地址">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.province) ? '' : this.state.province }

                        ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="详细地址">
                    <Input disabled
                            value = {isNil(this.state) || isNil(this.state.detailedAddress) ? '' : this.state.detailedAddress}

                        ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>

                  </Col>
                </Row>


                  <div className={commonCss.title}>
                    <span className={commonCss.text}>货物信息</span>
                  </div>
                  <h2 style={{fontWeight:800}}>
                    支付信息
                  </h2>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="资质套餐">
                        <Input disabled
                                value = {isNil(this.state) || isNil(this.state.packageTypeCn) ? '' : this.state.packageTypeCn}

                            ></Input>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="支付金额">
                          <Input disabled
                                value = {isNil(this.state) || isNil(this.state.moneyCount) ? '' : this.state.moneyCount}

                            ></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="支付流水号">
                        <Input disabled
                                value = {isNil(this.state) || isNil(this.state.orderNumber) ? '' : this.state.orderNumber}

                            ></Input>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="支付状态">
                          <Input disabled
                              value = {isNil(this.state) || isNil(this.state.paymentStatus) ? '' : this.state.paymentStatus}
                            ></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        {
                          isNil(this.state) || isNil(this.state.auditStatus) ? '' : this.state.auditStatus1==0?(
                            <Form.Item {...formlayout} label="驳回理由">
                              <Input.TextArea maxLength={300} style={{ width: '100%', height: '200px' }}
                                // disabled

                                value={
                                    isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                                  }
                                  onChange={e => this.setState({ remark: e.target.value })}
                                />
                            </Form.Item>
                          ):(
                            <Form.Item {...formlayout} label="驳回理由">
                              <Input.TextArea maxLength={300} style={{ width: '100%', height: '200px' }}
                                disabled

                                value={
                                    isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                                  }
                                  // onChange={e => this.setState({ remark: e.target.value })}
                                />
                            </Form.Item>
                          )
                        }
                      </Col>
                      <Col span={12}>
                      <Form.Item {...formlayout} label="审核状态">
                          <Input disabled
                              value = {isNil(this.state) || isNil(this.state.auditStatus) ? '' : this.state.auditStatus}
                            ></Input>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* 三个按钮 */}
                    <Row gutter={24}>
                      <Col span={24} >
                        <div style={{width:'100%',textAlign:'center'}}>
                          <Button style={{backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.onBack} >
                            返回
                          </Button>
                          {
                            //  auditStatus:response.data.auditStatus==0?'待审核':response.data.auditStatus==1?'审核通过':response.data.auditStatus==2?'审核驳回':'',
                            (isNil(this.state) || isNil(this.state.auditStatus) ? '' : this.state.auditStatus1==0?(
                              <span>
                                <Button  style={{marginLeft:'10px',marginRight:'10px',backgroundColor: '#57B5E3', color: '#FFFFFF'}} onClick={()=>{this.check('1')}} >
                                  审核通过
                                </Button>
                                <Button style={{marginRight:'10px',backgroundColor: '#0080FF', color: '#FFFFFF'}} onClick={()=>{this.handleDelete('2')}}>
                                  驳回
                                </Button>
                              </span>
                            ):null)
                          }


                        </div>
                      </Col>
                    </Row>
                  </Form>

            <Divider dashed={true} />
          </div>
          </Card>

      </div>
    );
  }
}

const MyOrderView_Form = Form.create({ name: 'MyOrderView_Form' })(MyOrderView);

export default MyOrderView_Form;
