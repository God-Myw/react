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


const provinceData = [ '请选择公司','上海道裕物流科技有限公司', '上海林风国际货运代理有限公司',];
const cityData = {
  请选择公司: [],
  上海道裕物流科技有限公司: [ '中国银行上海市共康支行', ' 448175443917',],
  上海林风国际货运代理有限公司: [ '中国银行上海市分行共康支行', '439063871324',],
};
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
    cities: cityData[provinceData[0]],
    secondCity: cityData[provinceData[0]][0],
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
    getRequest('/business/truck/getTruckOrderDetailForWeb?guid=' + guid +'&', params, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {


          this.setState({
            orders:response.data.order,//基础信息
            cars:response.data.car,//卡车信息
            userss:response.data.user,//申请人等
            orderNumber:response.data.order.orderNumber,//订单编号
            createDate:response.data.order.createDate,//下单时间
            accountId:response.data.user.accountId,//申请人
            phoneNumber:response.data.user.phoneNumber,//联系方式
            ddzt:response.data.order.auditStatus,//订单状态判断按钮出现不出现
            auditStatus:response.data.order.auditStatus==0?'进行中':response.data.order.auditStatus==1?'已完成':response.data.order.auditStatus==2?'已取消':'',//订单状态
            palletName:response.data.order.palletName,//货物名称
            packingMethod:response.data.order.packingMethod==1?'桶/筐装':response.data.order.packingMethod==2?'捆扎':response.data.order.packingMethod==3?'散装':response.data.order.packingMethod==4?response.data.order.packingMethodDetail:'',//包装方式
            palletWeightMin:response.data.order.palletWeightMin,//最小重量
            palletWeightMax:response.data.order.palletWeightMax,//最大重量
            palletVolume:response.data.order.palletVolume,//体积
            palletLong:response.data.order.palletLong,//长
            palletWide:response.data.order.palletWide,//宽
            palletHigh:response.data.order.palletHigh,//高
            isMajorParts:response.data.order.isMajorParts==0?'是':response.data.order.isMajorParts==1?'否':'',//是否为重大件
            remark:response.data.order.remark,//货物备注
            prStart:response.data.order.prStart,//装货地址 省
            cityStart:response.data.order.cityStart,//装货地址 市
            cntyStart:response.data.order.cntyStart,//装货地址 区
            detailStart:response.data.order.detailStart,//装货地址 详细
            nameStart:response.data.order.nameStart,//发货人
            phoneStart:response.data.order.phoneStart,//联系方式
            prEnd:response.data.order.prEnd,//卸货地址 省
            cityEnd:response.data.order.cityEnd,//卸货地址 市
            cntyEnd:response.data.order.cntyEnd,//卸货地址 区
            detailEnd:response.data.order.detailEnd,//卸货地址 详细
            nameEnd:response.data.order.nameEnd,//卸货人
            phoneEnd:response.data.order.phoneEnd,//联系方式
            startDate:response.data.order.startDate,//起运日期
            carName:response.data.car.carName,//车型
            attachment:response.data.attachment//附件
          })

        }
      }
    });

  }









  // 返回
  onBack = () => {
    this.props.history.push('/truckTransportation/list');
  };


  // zhuangtai=(e:number)=>{
  //   let guid = this.props.match.params['guid'];
  //   let requestData ;

  //   // requestData={
  //   //   guid:guid,
  //   //   auditStatus:e,
  //   // }
  //   postRequest('/business/truck/updateTruckOrderStatus?guid='+guid+'&auditStatus='+e, JSON.stringify(requestData), (response: any) => {
  //     console.log(response)
  //     if (response.status === 200) {
  //       // 跳转首页
  //       message.success('提交成功');

  //       this.props.history.push('/truckTransportation/list');
  //     } else {
  //       message.error('提交失败');
  //     }
  //   });
  // }


  //订单完成
  check = ( status: string) => {
    let guids = this.props.match.params['guid'];
    const search = this;
    confirm({
      title: '确定是否要完成 序号: ' + (this.state.orderNumber?this.state.orderNumber:'无') + ' 出发地: ' + this.state.prStart + ' 目的地: ' + this.state.prEnd + ' 的卡车运输？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let requestData ;

        postRequest('/business/truck/updateTruckOrderStatus?guid='+guids+'&auditStatus='+status, JSON.stringify(requestData), (response: any) => {
          console.log(response)
          if (response.status === 200) {
            // 跳转首页
            message.success('提交成功');
            window.location.reload(true)
            // this.props.history.push('/truckTransportation/list');
          } else {
            message.error('提交失败');
          }
        });
      },
    });
  };

  //订单取消
  handleDelete = ( status: string,) => {
    let guids = this.props.match.params['guid'];
    const search = this;
    confirm({
      title: '确定是否要取消 序号: ' + (this.state.orderNumber?this.state.orderNumber:'无') + ' 出发地: ' + this.state.prStart + ' 目的地: ' + this.state.prEnd + ' 的卡车运输？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let requestData ;

        postRequest('/business/truck/updateTruckOrderStatus?guid='+guids+'&auditStatus='+status, JSON.stringify(requestData), (response: any) => {
          console.log(response)
          if (response.status === 200) {
            // 跳转首页
            message.success('提交成功');
            window.location.reload(true)
            // this.props.history.push('/truckTransportation/list');
          } else {
            message.error('提交失败');
          }
        });
      },
    });
  };


  //取消预览
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  // 图片预览

  handlePreview = async (type: any, file: any) => {
  let params: Map<string, string> = new Map();
  params.set('fileName', file.name);
  getRequest('/sys/file/getImageBase64/' + file.type, params, (response: any) => {//BUG131改修
  this.setState({
    previewImage: response.data.file.base64,
    previewVisible: true,
  });
});
  };
  // 图片放大
  showModal = (a) => {
    console.log(a);
    this.setState({
      visible: true,
    });
    this.setState({
      bigImg:a
    })
  };

  handleOk = (e: any) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e: any) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  baochun = ()=>{
    console.log(this.state.current)
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
        {/* 图片放大 */}
        <Modal
            title=""
            visible={isNil(this.state) || isNil(this.state.visible) ? '' : this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
            width="50%"
          >
            <img src={isNil(this.state) || isNil(this.state.bigImg) ? '' : this.state.bigImg} alt="" style={{ width: '90%' , height:'90%'}}/>
            {/* <img src={isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype)} alt="" style={{ width: '60%' }}/> */}
            {/* isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.Url + item.fileName) */}
          </Modal>


          <Card bordered={false}>
          <div className={commonCss.container}>
            <LabelTitleComponent text="卡车订单" event={() => this.onBack()} />
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单编号">
                    <Input disabled
                            value = {isNil(this.state) || isNil(this.state.orderNumber) ? '' : this.state.orderNumber}

                        ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="下单时间">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.createDate) ? '' :   moment(this.state.createDate).format('YYYY/MM/DD')}

                        ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="申请人">
                    <Input disabled
                            value = {isNil(this.state) || isNil(this.state.accountId) ? '' : this.state.accountId}

                        ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="联系方式">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.phoneNumber) ? '' : this.state.phoneNumber }

                        ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单状态">
                    <Input disabled
                            value = {isNil(this.state) || isNil(this.state.auditStatus) ? '' : this.state.auditStatus}

                        ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>

                  </Col>
                </Row>


                  <div className={commonCss.title}>
                    <span className={commonCss.text}>货物信息</span>
                  </div>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="货物名称">
                        <Input disabled
                                value = {isNil(this.state) || isNil(this.state.palletName) ? '' : this.state.palletName}

                            ></Input>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="包装方式">
                          <Input disabled
                                value = {isNil(this.state) || isNil(this.state.packingMethod) ? '' : this.state.packingMethod}

                            ></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="最小重量">
                        <Input disabled
                                value = {isNil(this.state) || isNil(this.state.palletWeightMin) ? '' : this.state.palletWeightMin}
                                suffix="吨"
                            ></Input>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="最大重量">
                          <Input disabled
                              value = {isNil(this.state) || isNil(this.state.palletWeightMax) ? '' : this.state.palletWeightMax}
                              suffix="吨"
                            ></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="货物体积">
                        <Input disabled
                                value = {isNil(this.state) || isNil(this.state.palletVolume) ? '' : this.state.palletVolume}
                                suffix="m³"
                            ></Input>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="长度">
                          <Input disabled
                                value = {isNil(this.state) || isNil(this.state.palletLong) ? '' :  this.state.palletLong}
                                suffix="m"
                            ></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="是否为重大件">
                        <Input disabled
                                value = {isNil(this.state) || isNil(this.state.isMajorParts) ? '' : this.state.isMajorParts}

                            ></Input>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="宽度">
                          <Input disabled
                                value = {isNil(this.state) || isNil(this.state.palletWide) ? '' : this.state.palletWide }
                                suffix="m"
                            ></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="附件预览">
                          <div style={{ display: 'flex' }} >
                            {isNil(this.state) || isNil(this.state.attachment) ? '' : (this.state.attachment.map(item => (
                            <div style={{ width: '100px', height: '100px', marginLeft: '10px', cursor: 'pointer'}}>
                              <img
                                src={ isNil(this.state) || isNil(this.state.urls) ? '' : (this.state.urls + item.fileName )}
                                alt=""
                                style={{ width: '100%', height: '100%' }}
                                onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.urls) ? '' : (this.state.urls + item.fileName)) }}
                              />
                            </div>)))}
                          </div>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="高度">
                          <Input disabled
                                value = {isNil(this.state) || isNil(this.state.palletHigh) ? '' : this.state.palletHigh  }
                                suffix="m"
                            ></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col>
                        <Form.Item {...formItemLayout} label="备注">
                          <Input.TextArea maxLength={300} style={{ width: '100%', height: '50px' }}
                            disabled
                            value={
                                isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                              }
                            />
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className={commonCss.title}>
                      <span className={commonCss.text}>运输信息</span>
                    </div>
                    <Form.Item {...formItemLayout} label="装货地址">
                      <InputGroup size="large">
                        <Row gutter={24}>
                          <Col span={4}>
                            <Input
                              disabled
                              value={
                                  isNil(this.state) || isNil(this.state.prStart) ? '' : this.state.prStart
                                }


                            />
                          </Col>
                          <Col span={4}>
                            <Input
                              disabled
                              value={
                                  isNil(this.state) || isNil(this.state.cityStart) ? '' : this.state.cityStart
                                }


                            />
                          </Col>
                          <Col span={4}>
                            <Input
                              disabled
                              value={
                                  isNil(this.state) || isNil(this.state.cntyStart) ? '' : this.state.cntyStart
                                }


                            />
                          </Col>
                          <Col span={10}>
                            <Input
                              disabled
                              value={
                                  isNil(this.state) || isNil(this.state.detailStart) ? '' : this.state.detailStart
                                }
                            />
                          </Col>
                        </Row>
                      </InputGroup>
                    </Form.Item>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="发货人">
                            <Input disabled
                                value = {isNil(this.state) || isNil(this.state.nameStart) ? '' :  this.state.nameStart }

                            ></Input>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="联系方式">
                          <Input disabled
                                value = {isNil(this.state) || isNil(this.state.phoneStart) ? '' : this.state.phoneStart  }

                            ></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item {...formItemLayout} label="卸货地址">
                      <InputGroup size="large">
                        <Row gutter={24}>
                          <Col span={4}>
                            <Input
                              disabled
                              value={
                                  isNil(this.state) || isNil(this.state.prEnd) ? '' : this.state.prEnd
                                }


                            />
                          </Col>
                          <Col span={4}>
                            <Input
                              disabled
                              value={
                                  isNil(this.state) || isNil(this.state.cityEnd) ? '' : this.state.cityEnd
                                }


                            />
                          </Col>
                          <Col span={4}>
                            <Input
                              disabled
                              value={
                                  isNil(this.state) || isNil(this.state.cntyEnd) ? '' : this.state.cntyEnd
                                }


                            />
                          </Col>
                          <Col span={10}>
                            <Input
                              disabled
                              value={
                                  isNil(this.state) || isNil(this.state.detailEnd) ? '' : this.state.detailEnd
                                }
                            />
                          </Col>
                        </Row>
                      </InputGroup>
                    </Form.Item>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="收货人">
                            <Input disabled
                                value = {isNil(this.state) || isNil(this.state.nameEnd) ? '' : this.state.nameEnd  }

                            ></Input>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="联系方式">
                          <Input disabled
                                value = {isNil(this.state) || isNil(this.state.phoneEnd) ? '' :  this.state.phoneEnd }

                            ></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="起运日期">
                            <Input disabled
                                value = {isNil(this.state) || isNil(this.state.startDate) ? '' :  moment(this.state.startDate).format('lll') }

                            ></Input>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="车型">
                          <Input disabled
                                value = {isNil(this.state) || isNil(this.state.carName) ? '' :  this.state.carName }

                            ></Input>
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* 三个按钮 */}
                    <Row gutter={24}>
                      <Col span={24} >
                        <div style={{width:'100%',textAlign:'center'}}>
                          <Button style={{backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.onBack} >
                            确定
                          </Button>
                          {
                            this.state.ddzt==0?(
                              <Button  style={{marginLeft:'10px',marginRight:'10px',backgroundColor: '#57B5E3', color: '#FFFFFF'}} onClick={()=>{this.check('1')}} >
                                完成
                              </Button>
                            ):null
                          }
                          {
                            this.state.ddzt==0?(
                              <Button style={{marginRight:'10px',backgroundColor: '#0080FF', color: '#FFFFFF'}} onClick={()=>{this.handleDelete('2')}}>
                                取消
                              </Button>
                            ):null
                          }


                        </div>
                      </Col>
                    </Row>
                  </Form>

            <Divider dashed={true} />
          </div>
          </Card>

        <Modal className="picModal"
          visible={
            isNil(this.state) || isNil(this.state.previewVisible)
              ? false
              : this.state.previewVisible
          }
          footer={null}
          onCancel={this.handleCancel}
        >
          <img
            alt="example"
            style={{ width: '100%' }}
            src={isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage}
          />
          <a onClick={()=>linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
        </Modal>
      </div>
    );
  }
}

const MyOrderView_Form = Form.create({ name: 'MyOrderView_Form' })(MyOrderView);

export default MyOrderView_Form;
