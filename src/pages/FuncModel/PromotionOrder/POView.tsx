import getRequest, { putRequest } from '@/utils/request';
import { Col, Form, Input, Modal, Row, Upload, message, DatePicker, Image } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil, forEach, filter } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import HrComponent from '../../Common/Components/HrComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import ShipCertificationFormProps from './ShipCertificationFormInterface';
import { FileModel } from './FileModel';
import { getTableEnumText, linkHref } from '@/utils/utils';
import moment from 'moment';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { getLocale } from 'umi-plugin-react/locale';

const { TextArea } = Input;

type CertificationProps = ShipCertificationFormProps & RouteComponentProps;

//不通过图片
const certificationNO = require('../../Image/noPass.png');
const certificationNOEN = require('../../Image/noPassEN.png');

//通过图片
const certificationsuccess = require('../../Image/pass.png');
const certificationsuccessEN = require('../../Image/passEN.png');

const format = 'YYYY/MM/DD';

class ShipCertificationView extends React.Component<ShipCertificationFormProps, CertificationProps> {
  changeSrc = '';
  certification = '';
  constructor(props: ShipCertificationFormProps) {
    super(props);
  }

  componentDidMount() {
    this.getData();
  }
  getData() {
    this.setState(
      {
        visible: false,
        previewVisible: false,
        previewImage: '',
        aFileList: [],
        bFileList: [],
        cFileList: [],
        pFileList: [],
      },
      () => {
        let param: Map<string, string> = new Map();
        // param.set('type', '1');
        // console.log(this.props.match.params['guid'])
        // console.log(this.props.match.params['status'])
        getRequest('/business/AdsOrder/getAdsOrderById?id=' + this.props.match.params['guid'], param, (response: any) => {
          console.log(response)
          // console.log(response[1].adsOrder.order_level)
          if (response) {
            if (!isNil(response)) {
              // console.log(response.data.companypic)
              //  if (response.data.userDataChecks.guid === id) {

                // let start = response.data.startDate
                // let end = response.data.endDate
                // let startdate=new Date(start).getFullYear() + '-' + (new Date(start).getMonth() + 1) + '-' + new Date(start).getDate();
                // let enddate=new Date(end).getFullYear() + '-' + (new Date(end).getMonth() + 1) + '-' + new Date(end).getDate();
                // let servicetime =  startdate + ' 至 ' + enddate;
                //获取LOGO
                let LOGO = (response[0]?response[0].companylogo.length == 1?response[0].companylogo[0].fileName:'':'');
                //创建时间

                  let update = response[0].adsOrder.create_date;
                  let updatetime=(update==''?'':new Date(update).getFullYear() + '-' + (new Date(update).getMonth() + 1) + '-' + new Date(update).getDate())
                //用户类型
                let usertype = (response[0].userType === 4?'货主':response[0].userType === 5?'船东':'服务商');
                //服务港口
                let portname = response[0].portName.title_cn

                //套餐一服务时间
                let createDate = response[0].adsOrder.create_date;//开始时间
                let endDate = response[0].adsOrder.end_date;//结束时间
                let CD =  (update==''?'':new Date(createDate).getFullYear() + '-' + (new Date(createDate).getMonth() + 1) + '-' + new Date(createDate).getDate())
                let ED = (update==''?'':new Date(endDate).getFullYear() + '-' + (new Date(endDate).getMonth() + 1) + '-' + new Date(endDate).getDate())
                let DateOne = CD+'至'+ED

                //套餐一支付方式
                let paymentMethod = (response[0].adsOrder.payment_method == 1?'支付宝':response[0].adsOrder.payment_method === 2?'微信':response[0].adsOrder.payment_method === 3?'公司转账':'现场支付')

                //套餐一支付状态
                let payStatus = (response[0].adsOrder.pay_status == 0?'未支付':'已支付') ;``
                //套餐一套餐推广内容
                let ppc = (response[0].adsOrder.order_level == 1?'APP、PC端单板块商家基本信息推广':response[0].adsOrder.order_level === 2?'APP、PC端单板块商家基本信息推广':response[0].adsOrder.order_level === 3?'APP、PC端两板块商家基本信息+视频展示':response[0].adsOrder.order_level === 4?'APP、PC端多板块商家信息+视频+首页头图广告':'APP、PC端多板块商家信息+视频+首页内页广告')
                //套餐一支付流水图片
                let LSTP = (response[0].adsOrderPic.length == 1?response[0].adsOrderPic[0].fileName:'')


                //套餐二
                let adsTwo = (response.length == 2?response[1].adsOrder:'')
                //套餐二服务时间
                let createDate2 = (adsTwo.create_date?adsTwo.create_date:'');//开始时间
                let endDate2 = (adsTwo.end_date?adsTwo.end_date:'');//结束时间
                let CD2 = (createDate2?(update==''?'':new Date(createDate2).getFullYear() + '-' + (new Date(createDate2).getMonth() + 1) + '-' + new Date(createDate2).getDate()):'')
                let ED2 = (endDate2?(update==''?'':new Date(endDate2).getFullYear() + '-' + (new Date(endDate2).getMonth() + 1) + '-' + new Date(endDate2).getDate()):'')
                let Date2 = (CD2||ED2?CD2+'至'+ED2:'')

                //套餐二支付方式
                let paymentMethod2 = (adsTwo.payment_method == 1?'支付宝':adsTwo.payment_method === 2?'微信':adsTwo.payment_method === 3?'公司转账':adsTwo.payment_method === 4?'现场支付':'')

                //套餐二支付状态
                let payStatus2 = (adsTwo.pay_status == 0?'未支付':adsTwo.pay_status == 1?'已支付':'') ;``
                //套餐二套餐推广内容
                let ppc2 = (adsTwo.order_level?adsTwo.order_level == 1?'APP、PC端单板块商家基本信息推广':adsTwo.order_level === 2?'APP、PC端单板块商家基本信息推广':adsTwo.order_level === 3?'APP、PC端两板块商家基本信息+视频展示':adsTwo.order_level === 4?'APP、PC端多板块商家信息+视频+首页头图广告':'APP、PC端多板块商家信息+视频+首页内页广告':'')
                //套餐二支付流水图片
                let LSTPtwo = (response[1]?response[1].adsOrderPic.length == 1?response[1].adsOrderPic[0].fileName:'':'');

                //发票详情
                let OID = (response[0].orderInvoiceDto?response[0].orderInvoiceDto:'')

                let RES = response.length
                this.setState({
                res:RES,
                ship: response[0].ads,//详情对象
                adsOrderOne:response[0].adsOrder,//订单详情套餐一
                adsOrderTwo:adsTwo,//订单详情套餐二
                invoice:OID,//发票详情
                updateTime:updatetime,//创建时间
                userType:usertype,//用户类型
                portName:portname,//服务港口
                DO:DateOne,//套餐服务时间
                PM:paymentMethod,//套餐一支付方式
                PS:payStatus,//支付状态
                PPC:ppc,//套餐推广内容

                DO2:Date2,//套餐服务时间
                PM2:paymentMethod2,//套餐二支付方式
                PS2:payStatus2,//支付状态
                PPC2:ppc2,//套餐推广内容

                // picList: response[0].picList,//附件
                shipChecks: response[0].adsOrder.check_remark,
                // serviceTime:servicetime,
                // userType: response[0].userType,
                // portName:response[0].portName,
                //获取logo
                logotype:LOGO,
                logoUrl:`http://58.33.34.10:10443/images/companylogo/`,
                //获取商家图片
                Url:`http://58.33.34.10:10443/images/companypic/`,
                sjtp:response[0].companypic,
                //获取支付流水图片
                lstpURL:`http://58.33.34.10:10443/images/order/`,
                    //套餐一流水图片
                lstp:LSTP,
                    //套餐二流水图片
                lstptwo:LSTPtwo,
              });
                console.log(this.state.res)
                // console.log(this.state.ship)
                console.log(this.state.invoice)
                // console.log(this.state.PPC)

                // console.log(this.state.ship.company_name)
            }
            // console.log(this.state.ship)
          }
          // console.log(this.state.logoUrl)
        });
      },

    );
  }

  // 图片放大
    showModal = (a) => {
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

  // 图片预览
  // handlePreview = (type: any, file: any) => {
  //   let params: Map<string, string> = new Map();
  //   params.set('fileName', file.fileName);
  //   getRequest('/sys/file/getImageBase64/' + type, params, (response: any) => {
  //     this.setState({
  //       previewImage: response.data.file.base64,
  //       previewVisible: true,
  //     });
  //   });
  // };

  // //取消预览
  // handleCancel = () => {
  //   this.setState({ previewVisible: false });
  // };

  // 返回
  onBack = () => {
    //得到当前审核状态
    let status = this.props.match.params['status'] ? this.props.match.params['status'] : '';
    // console.log(this.props.match.params['status'])
    // 跳转首页
    this.props.history.push(`/adsOrder/list/`+ status);
  };

  // 驳回或审批通过
  turnDown = (value: any) => {
    let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let requestData = {};
    if (value == 0) {
      this.props.form.validateFields((err: any, values: any) => {
        //需要审批意见
        if (!err) {
          // 资料认证审批
          putRequest('/business/ads/updateAds', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              message.success('驳回成功');
              this.props.history.push('/adsOrder/list/');
            } else {
              message.error(response.message);
            }
          });
        }
      });
    } else {
      putRequest('/business/AdsOrder/updateAdsOrderAuditStatus?id='+ guid+'&auditStatus='+ value + '&checkRemark='+this.state.checkRemark, JSON.stringify(requestData), (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          message.success('审批通过');
          this.props.history.push('/adsOrder/list/');
        } else {
          message.error(response.message);
        }
      });
    }
  };

  render() {
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const { getFieldDecorator } = this.props.form;
    if (this.props.match.params['status'] == '7') {
      this.certification = getLocale() === 'zh-CN' ? certificationNO : certificationNOEN;
    } else if (this.props.match.params['status'] == '1') {
      this.certification = getLocale() === 'zh-CN' ? certificationsuccess : certificationsuccessEN;
    } else {
      this.certification = '';
    }
    return (
      <div className={commonCss.container}>
        {/* 图片放大 */}
          <Modal
            title=""
            visible={isNil(this.state) || isNil(this.state.visible) ? '' : this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <img src={isNil(this.state) || isNil(this.state.bigImg) ? '' : this.state.bigImg} alt="" style={{ width: '90%' }}/>
            {/* <img src={isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype)} alt="" style={{ width: '60%' }}/> */}
            {/* isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.Url + item.fileName) */}
          </Modal>

        <LabelTitleComponent text="推广审核详情" event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="公司名称">
                  <Input readOnly disabled value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.companyName)
                    ? ''
                    : this.state.ship.companyName} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  {...formlayout} label="服务商类型">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.companyType)
                    ? ''
                    : this.state.ship.companyType} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item  {...formlayout} label="公司地址">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.city)
                    ? ''
                    : this.state.ship.city + this.state.ship.cnty} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item  {...formlayout} label="创建时间">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.updateTime) || isNil(this.state.updateTime)
                    ? ''
                    : this.state.updateTime} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item  {...formlayout} label="姓名">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.contacts)
                    ? ''
                    : this.state.ship.contacts} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item  {...formlayout} label="用户类型">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.userType) || isNil(this.state.userType)
                    ? ''
                    : this.state.userType} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系方式">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.phoneNumber)
                    ? ''
                    : this.state.ship.phoneNumber} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  {...formlayout} label="服务港口">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.portName) || isNil(this.state.portName)
                    ? ''
                    : this.state.portName} />
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item  {...formlayout} label="主营业务">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.companyBusiness)
                    ? ''
                    : this.state.ship.companyBusiness} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item  {...formlayout} label="公司LOGO">
                  {/* <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.charterWay)
                    ? ''
                    : getTableEnumText('charter_way', this.state.ship.charterWay)} /> */}
                    <img
                      alt="无公司logo"
                      style={{ width: '25%' }}
                      src={isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype)}
                      // onClick={this.showModal(isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype))}
                      onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype)) }}
                    />
                </Form.Item>
              </Col>
              {/* 形象视频 */}
              <Col span={12}>
                <Form.Item  {...formlayout} >
                  <video style={{ width: '25%' }} src="">

                  </video>
                </Form.Item>
              </Col>
            </Row>

            <div style={{display:'flex'}}>
              <span>
                公司简介:
              </span>
              <div style={ {width:'90%',height:'200px',border:'1px solid #D9D9D9',marginLeft:'65px',overflow:'auto',color:'#DBD9DB'} }>
                    {isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.companyRemark)
                    ? ''
                    : this.state.ship.companyRemark}

              </div>
            </div>
          </Form>
        </div>
        <div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>商家图片：</span>
          </div>
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Form.Item className={commonCss.detailPageLabel}>
                  {/* //商家图片： */}
               {
                isNil(this.state) || isNil(this.state.sjtp) ? '' : (this.state.sjtp.map(item=>{
                  return(
                    <div style={{ width: '200px', height: '200px', display: 'inline-block', overflow: 'hidden', marginLeft:'50px'}} >
                      <img key={item.fileName} src={ isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.Url + item.fileName)} alt="" style={{ width: '100%' }}  onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.Url + item.fileName)) }}/>
                    </div>
                  )
                }))
               }
                </Form.Item>
              </Row>
            </Form>
          </div>
        </div>

        {/* 订单详情 */}
        <div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>订单详情</span>
          </div>
          <div className={commonCss.AddForm}>

            <Form labelAlign="left">

                {/* 两个全部显示 */}
                <div>
                  <h2>
                    套餐一:
                  </h2>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="套餐类型">
                        <Input readOnly disabled value={isNil(this.state) || isNil(this.state.adsOrderOne) || isNil(this.state.adsOrderOne.order_name)
                          ? ''
                          : this.state.adsOrderOne.order_name} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item  {...formlayout} label="套餐服务时间">
                        <Input disabled readOnly value={isNil(this.state) || isNil(this.state) || isNil(this.state.DO)
                          ? ''
                          : this.state.DO} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item  {...formlayout} label="套餐金额">
                        <Input disabled readOnly value={isNil(this.state) || isNil(this.state.adsOrderOne) || isNil(this.state.adsOrderOne.order_price)
                          ? ''
                          : this.state.adsOrderOne.order_price} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item  {...formlayout} label="支付方式">
                        <Input disabled readOnly value={isNil(this.state) || isNil(this.state.PM) || isNil(this.state.PM)
                          ? ''
                          : this.state.PM} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item  {...formlayout} label="套餐推广内容">
                        <Input disabled readOnly value={isNil(this.state) || isNil(this.state) || isNil(this.state.PPC)
                          ? ''
                          : this.state.PPC} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item  {...formlayout} label="支付状态">
                        <Input disabled readOnly value={isNil(this.state) || isNil(this.state.PS) || isNil(this.state.PS)
                          ? ''
                          : this.state.PS} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item  {...formlayout} label="支付流水单">
                        {/* <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.charterWay)
                          ? ''
                          : getTableEnumText('charter_way', this.state.ship.charterWay)} /> */}
                          <img
                            alt="无流水账单"
                            style={{ width: '25%' }}
                            src={isNil(this.state) || isNil(this.state.lstp) ? '' : (this.state.lstpURL + this.state.lstp)}
                            // onClick={this.showModal(isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.lstpURL + this.state.lstp))}
                            onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.lstp) ? '' : (this.state.lstpURL + this.state.lstp)) }}
                          />
                      </Form.Item>
                    </Col>
                    {/* 形象视频 */}
                    <Col span={12}>
                      <Form.Item  {...formlayout} >
                        <video style={{ width: '25%' }} src="">
                        </video>
                      </Form.Item>
                    </Col>
                  </Row>

                  <h2>
                    套餐二:
                  </h2>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="套餐类型">
                        <Input readOnly disabled value={isNil(this.state) || isNil(this.state.adsOrderTwo) || isNil(this.state.adsOrderTwo.order_name)
                          ? ''
                          : this.state.adsOrderTwo.order_name} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item  {...formlayout} label="套餐服务时间">
                        <Input disabled readOnly value={isNil(this.state) || isNil(this.state) || isNil(this.state.DO2)
                          ? ''
                          : this.state.DO2} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item  {...formlayout} label="套餐金额">
                        <Input disabled readOnly value={isNil(this.state) || isNil(this.state.adsOrderTwo) || isNil(this.state.adsOrderTwo.order_price)
                          ? ''
                          : this.state.adsOrderTwo.order_price} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item  {...formlayout} label="支付方式">
                        <Input disabled readOnly value={isNil(this.state) || isNil(this.state.PM2) || isNil(this.state.PM2)
                          ? ''
                          : this.state.PM2} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item  {...formlayout} label="套餐推广内容">
                        <Input disabled readOnly value={isNil(this.state) || isNil(this.state) || isNil(this.state.PPC2)
                          ? ''
                          : this.state.PPC2} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item  {...formlayout} label="支付状态">
                        <Input disabled readOnly value={isNil(this.state) || isNil(this.state.PS) || isNil(this.state.PS2)
                          ? ''
                          : this.state.PS2} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item  {...formlayout} label="支付流水单">
                        {/* <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.charterWay)
                          ? ''
                          : getTableEnumText('charter_way', this.state.ship.charterWay)} /> */}
                          <img
                            alt="无流水账单"
                            style={{ width: '25%' }}
                            src={isNil(this.state) || isNil(this.state.LSTPtwo) ? '' : (this.state.LSTPtwoURL + this.state.LSTPtwo)}
                            // onClick={this.showModal(isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.lstpURL + this.state.lstp))}
                            onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.LSTPtwo) ? '' : (this.state.lstpURL + this.state.LSTPtwo)) }}
                          />
                      </Form.Item>
                    </Col>
                    {/* 形象视频 */}
                    <Col span={12}>
                      <Form.Item  {...formlayout} >
                        <video style={{ width: '25%' }} src="">
                        </video>
                      </Form.Item>
                    </Col>
                  </Row>
              </div>
            </Form>
          </div>
        </div>
        <div>

        {/* 发票详情 */}
        <div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>发票详情</span>
          </div>
            <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="发票类型">
                    <Input readOnly disabled value={isNil(this.state) || isNil(this.state.invoice) || isNil(this.state.invoice.invoiceType)
                      ? ''
                      : this.state.invoice.invoiceType} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="收票人姓名">
                    <Input disabled readOnly value={isNil(this.state) || isNil(this.state.invoice) || isNil(this.state.invoice.receiveName)
                      ? ''
                      : this.state.invoice.receiveName} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="发票抬头">
                    <Input disabled readOnly value={isNil(this.state) || isNil(this.state.invoice) || isNil(this.state.invoice.invoiceTitle)
                      ? ''
                      : this.state.invoice.invoiceTitle} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item  {...formlayout} label="收票人手机">
                    <Input disabled readOnly value={isNil(this.state) || isNil(this.state.invoice) || isNil(this.state.invoice.phoneNumber)
                      ? ''
                      : this.state.invoice.phoneNumber} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="单位名称">
                    <Input disabled readOnly value={isNil(this.state) || isNil(this.state.invoice) || isNil(this.state.invoice.companyName)
                      ? ''
                      : this.state.invoice.companyName} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item  {...formlayout} label="收票人地址">
                    <Input disabled readOnly value={isNil(this.state) || isNil(this.state.invoice) || isNil(this.state.invoice.receiveAddress)
                      ? ''
                      : this.state.invoice.receiveAddress} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="纳税人识别码">
                    <Input disabled readOnly value={isNil(this.state) || isNil(this.state.invoice) || isNil(this.state.invoice.phoneNumber)
                      ? ''
                      : this.state.ship.phoneNumber} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="发票内容">
                    <Input disabled readOnly value={isNil(this.state) || isNil(this.state.invoiceContent) || isNil(this.state.invoiceContent)
                      ? ''
                      : this.state.invoiceContent} />
                  </Form.Item>
                </Col>

              </Row>
            </Form>
          </div>
        </div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>审批意见</span>
          </div>
          <Form labelAlign="left">
            <Row gutter={24}>
              {this.props.match.params['status'] == '0' ? (<Col span={1}></Col>) : null}
              {this.props.match.params['status'] == '0' ? (
                <Col span={22} style={{ marginLeft: '-2%' }}>
                  <Form.Item required>
                    {getFieldDecorator('note', {
                      rules: [{ max: 300, message: '不能超过300字' },
                      { required: true, message: '审批意见不能为空！' },],
                    })(<TextArea rows={4} placeholder="请输入您的审批意(0/300字)..." onChange={e => this.setState({ checkRemark: e.target.value })} />)}
                  </Form.Item>
                </Col>
              ) : (
                  <Col span={22}>
                    <Form.Item required {...formItemLayout} label="审批意见" style={{ marginLeft: '1%' }}>
                      <span >{isNil(this.state) || isNil(this.state.shipChecks)
                        ? ''
                        : this.state.shipChecks}</span>
                    </Form.Item>
                  </Col>
                )}
            </Row>
            <Row className={commonCss.rowTop}>
              {this.props.match.params['status'] == '0' ? (
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="TurnDown"
                    text="关闭"
                    event={() => this.onBack()}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params['status'] == '0' ? (
                <Col span={12}>
                  <ButtonOptionComponent
                    type="Approve"
                    text="审批通过"
                    event={() => this.turnDown(2)}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params['status'] == '0' ? null : (
                <Col span={12} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="CloseButton"
                    text="关闭"
                    event={() => this.onBack()}
                    disabled={false}
                  />
                </Col>
              )}
              {this.props.match.params['status'] == '0' ? null : <Col span={7}></Col>}
              {this.props.match.params['status'] == '0' ? null : (
                <Col span={5}>
                  <div className={commonCss.picTopAndBottom}>
                    <img
                      style={{ marginTop: '-17%' , width: '50%'}}
                      src={this.certification}
                      className={commonCss.imgWidth}
                    />
                  </div>
                </Col>
              )}
            </Row>
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
          </Form>
        </div>
      </div>
    );
  }
}

const ShipCertificationView_Form = Form.create({ name: 'ShipCertificationView_Form' })(
  ShipCertificationView,
);
export default ShipCertificationView_Form;
