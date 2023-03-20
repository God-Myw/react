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
import QueryButton from '../../Common/Components/ButtonOptionComponent';

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
      urls:'http://58.33.34.10:10443/images/specialpic/',//照片地址
      videos: 'http://58.33.34.10:10443/images/specialvideo/'//视频地址
      // specialpic:[]
    });


      this.dingdan()  //订单查询信息

  };

  //订单查询信息
  dingdan=()=>{
    let params: Map<string, any> = new Map();
    let guid = this.props.match.params['guid'];
    getRequest('/business/specialVehicle/getSpecialVehicleUserById?guid=' + guid +'&', params, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          this.setState({
            // orders:response.data.order,//基础信息
            title:response.data.specialVehicleUserDto.title,//标题
            isShipCar:response.data.specialVehicleUserDto.isShipCar==1?'车':'船',//1车2船
            modelType:response.data.specialVehicleUserDto.modelType==1?'租赁':'售卖',//1租赁2售卖
            introduction:response.data.specialVehicleUserDto.introduction,//产品简介
            specialpic:response.data.specialpic,//图片
            spcialName:response.data.spcialName,//发布类型
            packageTypeCn:response.data.packageTypeCn,//资质
            specialVehicleUserDetailDtos:response.data.specialVehicleUserDetailDtos,//自定义车厂等
            specialvideo:response.data.specialvideo,//视频
            auditStatus:response.data.specialVehicleUserDto.auditStatus==1?'待审核':response.data.specialVehicleUserDto.auditStatus==2?'审核通过':response.data.specialVehicleUserDto.auditStatus==3?'过期':response.data.specialVehicleUserDto.auditStatus==0?'驳回':'',
            // title:response.data.specialVehicleUserDto.title,
            // releaseStatus : response.data.specialVehicleUserDto.releaseStatus==1?'待发布':response.data.specialVehicleUserDto.releaseStatus==2?'已发布':response.data.specialVehicleUserDto.releaseStatus==3?'已下架':response.data.specialVehicleUserDto.releaseStatus==0?'强制下架':'',
            releaseStatus : response.data.specialVehicleUserDto.releaseStatus==1?'未通过':response.data.specialVehicleUserDto.releaseStatus==2?'待审核':response.data.specialVehicleUserDto.releaseStatus==3?'未上架':response.data.specialVehicleUserDto.releaseStatus==4?'已过期':response.data.specialVehicleUserDto.releaseStatus==5?'已上架':response.data.specialVehicleUserDto.releaseStatus==0?'强制下架':'',

          })
        }
        this.setState({
          auditStatus1:response.data.specialVehicleUserDto.auditStatus,
          releaseStatus1:response.data.specialVehicleUserDto.releaseStatus,
        })
      //   console.log(this.state.specialVehicleUserDetailDtos.length)
      //   this.state.specialVehicleUserDetailDtos.map((item,index) => (
      //     console.log(index%2==0)
      //     // console.log()
      //   ))
      }
    });

  }

  // 返回
  onBack = () => {
    this.props.history.push('/specialCar/list');
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
    putRequest('/business/specialVehicle/updateSpecialVehicleUserById?guid='+guids +'&'+'auditStatus='+status, JSON.stringify(requestData), (response: any) => {
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
    console.log(this.state.remark)
    // requestData = {
    //   reviewRejectionReason:this.state.remark,
    //   auditStatus:status*1,
    //   guid:guids,
    // };
    if(this.state.remark==undefined){
      message.error('请填写驳回理由');
    }else{
      putRequest('/business/specialVehicle/updateSpecialVehicleUserById?guid='+guids +'&'+'auditStatus='+status+'&'+'remark='+this.state.remark, JSON.stringify(requestData), (response: any) => {
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

  jiechu=(status)=>{
    let guids = this.props.match.params['guid'];
    let requestData ;
    putRequest('/business/specialVehicle/updateVehicleUserDataBySys?guid='+guids +'&'+'type='+status, JSON.stringify(requestData), (response: any) => {
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

  qiangzhi=(status)=>{
    let guids = this.props.match.params['guid'];
    let requestData ;
    putRequest('/business/specialVehicle/updateVehicleUserDataBySys?guid='+guids +'&'+'type='+status, JSON.stringify(requestData), (response: any) => {
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
            <LabelTitleComponent text="特种车船商品管理" event={() => this.onBack()} />

              <Form labelAlign="left">
                <h2 style={{fontWeight:800}}>
                  商品信息
                </h2>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="标题">
                    <Input disabled
                            value = {isNil(this.state) || isNil(this.state.title) ? '' : this.state.title}

                        ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label=" 特种车/船类型">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.isShipCar) ? '' : this.state.isShipCar }

                        ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="发布类型">
                    <Input disabled
                            value = {isNil(this.state) || isNil(this.state.spcialName) ? '' : this.state.spcialName}

                        ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="出售模式">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.modelType) ? '' : this.state.modelType }

                        ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="资质">
                    <Input disabled
                            value = {isNil(this.state) || isNil(this.state.packageTypeCn) ? '' : this.state.packageTypeCn}

                        ></Input>
                    </Form.Item>
                  </Col>
              
                </Row>
                {
                  isNil(this.state) || isNil(this.state.specialVehicleUserDetailDtos) ? '' : (this.state.specialVehicleUserDetailDtos.map((item,index) => (
                    <Row gutter={24}>
                      {index%2==0?(
                        <div>
                          <Col span={12}>
                            <Form.Item {...formlayout} label={this.state.specialVehicleUserDetailDtos[index].specialTypeName}>
                            <Input disabled
                                    value = {this.state.specialVehicleUserDetailDtos[index].specialTypeValue}
                            ></Input>
                            </Form.Item>
                          </Col>
                          {(index+1)<this.state.specialVehicleUserDetailDtos.length?(
                            <Col span={12}>
                              <Form.Item {...formlayout} label={this.state.specialVehicleUserDetailDtos[index+1].specialTypeName}>
                              <Input disabled
                                      value = {this.state.specialVehicleUserDetailDtos[index+1].specialTypeValue}
                              ></Input>
                              </Form.Item>
                            </Col>
                          ):null}
                        </div>
                      ):null}
                    </Row>
                  )))
                }


                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="商品介绍">
                      <Input.TextArea maxLength={300} style={{ width: '100%', height: '100px' }}
                        disabled
                        value={
                            isNil(this.state) || isNil(this.state.introduction) ? '' : this.state.introduction
                          }
                        />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="图片">
                      <div style={{ display: 'flex' }} >
                        {isNil(this.state) || isNil(this.state.specialpic) ? '' : (this.state.specialpic.map(item => (
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

                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="视频">
                      <div style={{ display: 'flex' }} >
                      {isNil(this.state) || isNil(this.state.specialvideo) ? '' : (this.state.specialvideo.map(item => (
                        // < video  width="200" height="200" s src={isNil(this.state) || isNil(this.state.videos) ? '' : (this.state.videos + item.fileName)} preload="Metadata" controls="controls">
                        //   {/* < source  src="http://www.youname.com/images/first.ogv" />
                        //   < source  src="http://www.youname.com/images/first.ogg" /> */}
                        // </ video >
                        < video  width="200" height="200"   preload="meta" controls="controls">
                          < source  src={isNil(this.state) || isNil(this.state.videos) ? '' : (this.state.videos + item.fileName)} />
                          {/* < source  src="http://www.youname.com/images/first.ogg" /> */}
                        </ video >
                      )))}
                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="状态">
                      <Input disabled
                          value = {isNil(this.state) || isNil(this.state.releaseStatus) ? '' : this.state.releaseStatus}
                        ></Input>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                      <Col span={12}>
                        {
                          isNil(this.state) || isNil(this.state.auditStatus) ? '' : this.state.auditStatus1==1?(
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
                      {/* <Button style={{backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.onBack} >
                        返回
                      </Button> */}
                      <QueryButton
                        text="返回"
                        type="View"
                        event={()=>{this.onBack()}}
                        // disabled = {this.state.auditStatus1==1?false:true }
                      />
                      <QueryButton
                        text="审核通过"
                        type="Certification"
                        event={()=>{this.check('2')}}
                        disabled = {this.state.auditStatus1==1?false:true }
                      />
                      <QueryButton
                        text="驳回"
                        type="Delete"
                        event={()=>{this.handleDelete('0')}}
                        disabled = {this.state.auditStatus1==1?false:true }
                      />
                      <QueryButton
                        text="解除强制下架"
                        type="Certification"
                        event={()=>{this.jiechu('5')}}
                        disabled = {this.state.auditStatus1==2&&this.state.releaseStatus1==0?false:true}
                      />
                      <QueryButton
                        text="强制下架"
                        type="Delete"
                        event={()=>{this.qiangzhi('0')}}
                        disabled = {this.state.auditStatus1==2&&this.state.releaseStatus1==5?false:true }
                      />
                      {/* auditStatus1
                      releaseStatus1 */}
                      {/* <Button
                            style={{marginLeft:'10px',marginRight:'10px',backgroundColor: '#135A8D', color: '#FFFFFF'}}
                            onClick={()=>{this.check('2')}}
                            disabled = {this.state.auditStatus1==1?false:true }
                          >
                        审核通过
                      </Button> */}
                      {/* <Button  style={{marginLeft:'10px',marginRight:'10px',backgroundColor: '#DB6262', color: '#FFFFFF'}} onClick={()=>{this.handleDelete('0')}} >
                        驳回
                      </Button>

                      <Button style={{marginRight:'10px',backgroundColor: '#EBC46D', color: '#FFFFFF'}} onClick={()=>{this.jiechu('5')}}>
                        解除强制下架
                      </Button>
                      <Button style={{marginRight:'10px',backgroundColor: '#DB6262', color: '#FFFFFF'}} onClick={()=>{this.qiangzhi('0')}}>
                        强制下架
                      </Button> */}
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
