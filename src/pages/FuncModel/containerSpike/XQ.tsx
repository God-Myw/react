import { fileType } from '@/pages/Common/Components/FileTypeCons';
import HrComponent from '@/pages/Common/Components/HrComponent';
import getRequest, { putRequest, postRequest } from '@/utils/request';
import { getTableEnumText, linkHref } from '@/utils/utils';
import { Col, Form, Input, Modal, Row, Upload, Icon, message, Checkbox, Button, Radio, List, Card  } from 'antd';
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
const { confirm } = Modal;
class PalletDynamicsView extends React.Component<PalletFormProps, PalletFormProps> {
  constructor(props: PalletFormProps) {
    super(props);
  }
  state = {
    dingdan:1,

  };
  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    this.setState({ guid: uid });
    let params: Map<string, string> = new Map();

    getRequest('/business/auctionCustomer/getAuctionCustomerUserDetailForWeb'+'?guid='+uid+'&',params,(response: any) => {

      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          let seaFreightType =  response.data.biddingBuyerInfo.seaFreightType==0?'￥':response.data.biddingBuyerInfo.seaFreightType==1?'$':'€';
          this.setState({
            valuess: 0,
            valuesss: 0,
            orderNumbersss: response.data.publisher.orderNumber ? response.data.publisher.orderNumber : '', //订单编号
            createDatesss: response.data.publisher.createDate ? response.data.publisher.createDate : '',    //发布时间
            userTypesss: response.data.publisher.userType ? response.data.publisher.userType==4?'货主':response.data.publisher.userType==5?'船东':response.data.publisher.userType==6?'服务商':'' : '', //用户类型
            firstNamesss: response.data.publisher.firstName ? response.data.publisher.firstName+response.data.publisher.lastName : '', //姓名
            accountIdsss: response.data.publisher.accountId ? response.data.publisher.accountId : '', //用户名
            phonenumbersss: response.data.publisher.phonenumber ? response.data.publisher.phonenumber : '', //联系电话
            bondsss: response.data.publisher.bond ? response.data.publisher.bond : '', //保证金
            alipayWxpaysss: response.data.publisher.alipayWxpay ? response.data.publisher.alipayWxpay==0?'支付宝':'微信' : '', //支付方式

            startPortEn: response.data.presentCabinInfo.startPortEn ? response.data.presentCabinInfo.startPortEn : '', //起始港
            startPortCn: response.data.presentCabinInfo.startPortCn ? response.data.presentCabinInfo.startPortCn : '', //起始港
            endPortEn: response.data.presentCabinInfo.endPortEn ? response.data.presentCabinInfo.endPortEn : '', //目的港
            endPortCn: response.data.presentCabinInfo.endPortCn ? response.data.presentCabinInfo.endPortCn : '', //目的港
            closingTimeWeek: response.data.presentCabinInfo.closingTimeWeek ? response.data.presentCabinInfo.closingTimeWeek : '', //截关时间
            closingTime: response.data.presentCabinInfo.closingTime ? response.data.presentCabinInfo.closingTime : '', //截关时间
            sailingTimeWeek: response.data.presentCabinInfo.sailingTimeWeek ? response.data.presentCabinInfo.sailingTimeWeek : '', //开船时间
            sailingTime: response.data.presentCabinInfo.sailingTime ? response.data.presentCabinInfo.sailingTime : '', //开船时间
            voyage: response.data.presentCabinInfo.voyage ? response.data.presentCabinInfo.voyage : '', //航程
            promotionLabelOne: response.data.presentCabinInfo.promotionLabelOne ? response.data.presentCabinInfo.promotionLabelOne : '', //促销表情
            shipCompany: response.data.presentCabinInfo.shipCompany ? response.data.presentCabinInfo.shipCompany : '', //船公司
            promotionLabelTwo: response.data.presentCabinInfo.promotionLabelTwo ? response.data.presentCabinInfo.promotionLabelTwo : '', //促销标签
            affiliatedCompany: response.data.presentCabinInfo.affiliatedCompany ? response.data.presentCabinInfo.affiliatedCompany : '', //所属公司
            advantage: response.data.presentCabinInfo.advantage ? response.data.presentCabinInfo.advantage : '', //班轮优势信息

            type: response.data.FreightAuctionInfo.type ? response.data.FreightAuctionInfo.type : '', //箱型
            seaFreight: response.data.FreightAuctionInfo.seaFreight ? response.data.FreightAuctionInfo.seaFreight : '', //海运费起拍价
            boxSum: response.data.FreightAuctionInfo.boxSum ? response.data.FreightAuctionInfo.boxSum : '', //数量
            pricesss: response.data.FreightAuctionInfo.price ? response.data.FreightAuctionInfo.price : '', //一次加价
            startTime: response.data.FreightAuctionInfo.startTime ? response.data.FreightAuctionInfo.startTime : '', //竞拍开始时间
            endTime: response.data.FreightAuctionInfo.endTime ? response.data.FreightAuctionInfo.endTime : '', //竞拍结束时间
            applicantsCount: response.data.FreightAuctionInfo.applicantsCount ? response.data.FreightAuctionInfo.applicantsCount : '', //报名人数
            followSum: response.data.FreightAuctionInfo.followSum ? response.data.FreightAuctionInfo.followSum : '', //关注人数
            hitsSum: response.data.FreightAuctionInfo.hitsSum ? response.data.FreightAuctionInfo.hitsSum : '', //围观人数
            others: response.data.FreightAuctionInfo.others ? response.data.FreightAuctionInfo.others : [],//自定义费用

            currentBiddingPrice: response.data.auctionResultsInfo.currentBiddingPrice ? response.data.auctionResultsInfo.currentBiddingPrice : '',//拍卖成交价
            updateDate: response.data.auctionResultsInfo.updateDate ? response.data.auctionResultsInfo.updateDate : '',//成交时间
            createDate: response.data.auctionResultsInfo.createDate ? response.data.auctionResultsInfo.createDate : '',//拍卖出价信息
            phonenumber: response.data.auctionResultsInfo.phonenumber ? response.data.auctionResultsInfo.phonenumber : '',//拍卖出价信息电话
            accountId: response.data.auctionResultsInfo.accountId ? response.data.auctionResultsInfo.accountId : '',//拍卖出价信息用户名
            price: response.data.auctionResultsInfo.price ? response.data.auctionResultsInfo.price : '',//拍卖出价信息加价
            seaFreightType: response.data.auctionResultsInfo.seaFreightType ? response.data.auctionResultsInfo.seaFreightType : '',//拍卖出价信息单位

            userTypes: response.data.biddingBuyerInfo.userType ? response.data.biddingBuyerInfo.userType==4?'货主':response.data.biddingBuyerInfo.userType==5?'船东':response.data.biddingBuyerInfo.userType==6?'服务商':'' : '', //用户类型
            firstNames: response.data.biddingBuyerInfo.firstName ? response.data.biddingBuyerInfo.firstName+response.data.biddingBuyerInfo.lastName : '',//姓名
            accountIds: response.data.biddingBuyerInfo.accountId ? response.data.biddingBuyerInfo.accountId : '',//用户名
            phonenumbers: response.data.biddingBuyerInfo.phonenumber ? response.data.biddingBuyerInfo.phonenumber : '',//联系电话
            counts: response.data.biddingBuyerInfo.count ? response.data.biddingBuyerInfo.count : '',//支付保证金
            moneyTypes: response.data.biddingBuyerInfo.moneyType ? response.data.biddingBuyerInfo.moneyType==0?'支付宝':'微信' : '',//支付方式
            orderNumberasa: response.data.biddingBuyerInfo.orderNumber ?response.data.biddingBuyerInfo.orderNumber : '',//购买方订单编号
            seaFreightTypesss: response.data.biddingBuyerInfo.seaFreightType ?response.data.biddingBuyerInfo.seaFreightType==0?'人民币':response.data.biddingBuyerInfo.seaFreightType==1?'美元':'欧元' : '',

            usershipment: response.data.shipmentInfo.user_shipment==0?'未装船':response.data.shipmentInfo.user_shipment==1?'已装船':'',//现舱发布用户
            sellerIsReturn: response.data.shipmentInfo.sellerIsReturn==0?'未退还':response.data.shipmentInfo.sellerIsReturn==1?'已退还':'',//卖家保证金是否归还
            sellerBondReturn:response.data.shipmentInfo.sellerBondReturn==0?'支付宝':response.data.shipmentInfo.sellerBondReturn==1?'微信':'' ,//卖家保证金退还方式
            sellerBond: response.data.shipmentInfo.sellerBond ? response.data.shipmentInfo.sellerBond : '',//卖家已退还保证金

            shipment: response.data.shipmentInfo.shipment ? response.data.shipmentInfo.shipment==0?'未装船':'已装船' : '',//购买方用户
            buyerIsReturn: response.data.shipmentInfo.buyerIsReturn==0?'未退还':response.data.shipmentInfo.buyerIsReturn==1?'已退还':'',//买 家保证金是否归还
            buyerBondReturn: response.data.shipmentInfo.buyerBondReturn==0?'支付宝':response.data.shipmentInfo.buyerBondReturn==1?'微信':'' ,//买 家保证金退还方式
            buyerBond: response.data.shipmentInfo.buyerBond ? response.data.shipmentInfo.buyerBond : '',//买 家已退还保证金

            remarks:response.data.shipmentInfo.remark

          });
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/containerSpike')
  }

  onChange=(e)=>{
    console.log(`checked = ${e.target.checked}`);
    if(e.target.checked==true){
      this.setState({
        dingdan:2
      })
    }else{
      this.setState({
        dingdan:1
      })
    }

  }

  onChange1 = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      valuess: e.target.value,
    });
  };

  onChange2 = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      valuesss: e.target.value,
    });
  };

  baochunanniu=()=>{
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    // let valuess = this.state.sellerIsReturn==='已退还'?9999: this.state.sellerIsReturn==='未退还'?this.state.valuess:'';
    // let valuesss = this.state.buyerIsReturn==='已退还'?9999: this.state.buyerIsReturn==='未退还'?this.state.valuesss:'';
    let requestData = {
      guid: uid ,
      orderStatus : this.state.dingdan ,//订单状态
      sellerBond:this.state.sellerBondss,//卖家保证金额
      sellerReturn: this.state.valuess,//卖家保证金额退还方式
      buyerBond:this.state.buyerBondss,//买家保证金额
      buyerReturn:this.state.valuesss,//买家保证金额退还方式
      remark:this.state.remarkkk
    };
    console.log(requestData)
    postRequest('/business/auctionCustomer/updateAuctionUserOrderType', JSON.stringify(requestData), (response: any) => {
      console.log('1111')
      console.log('~~~~~~~~~~~')
      console.log(response)
      if (response.status === 200) {
        // 跳转首页
        message.success('提交成功');
        this.props.history.push('/containerSpike');
      }else{
        message.error(response.message);
      };
    });
  }

  //发布者退款
  fabuzhe=()=>{
    let outTradeNo = this.state.orderNumbersss//退款订单编号
    let refundAmount = this.state.bondsss//退款金额
    let buyerReturn = this.state.valuess//退款方式
    let guid  = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let orderNo = this.state.orderNumbersss//退款订单编号
    let amount = this.state.bondsss//退款金额
    let params: Map<string, string> = new Map();

    confirm({
      title: '是否对竞拍编号为：' + outTradeNo+' '+' '+' '+' '+'退款方式为：'+ (buyerReturn==0?'支付宝':buyerReturn==1?'微信':'') +' '+' '+'退款金额为：'+refundAmount+' '+' '+'进行退款？',
      cancelText: '取消',
      okText: '确认',
      okType: 'danger',
      onOk() {
        if(buyerReturn==0){
          getRequest('/business/AliPay/AliPayRefund'+'?outTradeNo='+outTradeNo+'&refundAmount='+refundAmount+'&',params,(response: any) => {
            console.log(response)
            if(response.status === 200){
              if (response.data.data.code === 10000) {
                // 跳转首页
                message.success('提交成功');
                // this.props.history.push('/containerSpike');
                message.success(response.data.data.subMsg);
              }else{
                message.error(response.data.data.subMsg);
              };
            }else{
              message.error('退款失败');
            }
          })
        }else{

          let params: Map<string, string> = new Map();
          getRequest('/business/weChatPay/wechatApplyRefundForCustomner'+'?guid='+guid+'&orderNo='+orderNo+'&amount='+amount+'&',params,(response: any) => {
            console.log(response)
            if(response.status === 200){
              if (response.data.result_code === 'SUCCESS') {
                // 跳转首页
                message.success('提交成功');
                // this.props.history.push('/containerSpike');
                message.success('退款成功');
                message.success(response.data.err_code_des);
              }else{
                message.error('退款失败');
                message.error(response.data.err_code_des);

              };
            }else{
              message.error('退款失败');
            }
          })
        }
      },
    })




  }

  //购买方退款
  goumaifang=()=>{
    let outTradeNo = this.state.orderNumberasa//退款订单编号
    let refundAmount = this.state.counts//退款金额
    let buyerReturn = this.state.valuesss//退款方式
    let guid  = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let orderNo = this.state.orderNumberasa//退款订单编号
    let amount = this.state.counts//退款金额
    let params: Map<string, string> = new Map();
    confirm({
      title: '是否对竞拍编号为：' + outTradeNo+' '+' '+' '+' '+'退款方式为：'+ (buyerReturn==0?'支付宝':buyerReturn==1?'微信':'') +' '+' '+'退款金额为：'+refundAmount+' '+' '+'进行退款？',
      cancelText: '取消',
      okText: '确认',
      okType: 'danger',
      onOk() {
        if(buyerReturn==0){
          getRequest('/business/AliPay/AliPayRefund'+'?outTradeNo='+outTradeNo+'&refundAmount='+refundAmount+'&',params,(response: any) => {
            console.log(response)
            if(response.status === 200){
              if (response.data.data.code === 10000) {
                // 跳转首页
                message.success('提交成功');
                // this.props.history.push('/containerSpike');
                message.success(response.data.data.subMsg);
              }else{
                message.error(response.data.data.subMsg);
              };
            }else{
              message.error('退款失败');
            }
          })
        }else{

          let params: Map<string, string> = new Map();
          getRequest('/business/weChatPay/wechatApplyRefundForCustomner'+'?guid='+guid+'&orderNo='+orderNo+'&amount='+amount+'&',params,(response: any) => {
            console.log(response)
            if(response.status === 200){
              if (response.data.result_code === 'SUCCESS') {
                // 跳转首页
                message.success('提交成功');
                // this.props.history.push('/containerSpike');
                message.success('退款成功');
                message.success(response.data.err_code_des);
              }else{
                message.error('退款失败');
                message.error(response.data.err_code_des);
              };
            }else{
              message.error('退款失败');
            }
          })
        }
      },
    })


  }

  kaipiao=()=>{
    this.props.history.push('/kaipiao');
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
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <LabelTitleComponent
                text='订单&支付状态'
                event={() => {
                  this.onBack();
                }}
            />
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label='订单状态'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.orderNumbersss) ? '' : this.state.orderNumbersss
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='支付状态'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.createDatesss) ? '' : this.state.createDatesss
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className={commonCss.title}>
              <span className={commonCss.text}>发布秒杀用户信息</span>
              <button style={{width:'100px',height:'30px',marginLeft:'75%',textAlign:'center',lineHeight:'20px',}} onClick={this.kaipiao} disabled='disabled'>查看开票信息</button>
            </div>
            <Row gutter={24}>
              <Col span={12}>

                <Form.Item {...formlayout} label='订单编号'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.orderNumbersss) ? '' : this.state.orderNumbersss
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='发布时间'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.createDatesss) ? '' : this.state.createDatesss
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
                      isNil(this.state) || isNil(this.state.userTypesss) ? '' : this.state.userTypesss
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='姓名'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.firstNamesss) ? '' : this.state.firstNamesss
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
                      isNil(this.state) || isNil(this.state.accountIdsss) ? '' : this.state.accountIdsss
                    }
                  />
                </Form.Item>
              </Col>

                  <Col span={12}>
                    <Form.Item {...formlayout} label='联系电话'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.phonenumbersss) ? '' : this.state.phonenumbersss
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
                      isNil(this.state) || isNil(this.state.bondsss) ? '' : this.state.bondsss
                    }
                  />
                </Form.Item>
              </Col>

                  <Col span={12}>
                    <Form.Item {...formlayout} label='支付方式'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.alipayWxpaysss) ? '' : this.state.alipayWxpaysss
                        }
                      />
                    </Form.Item>
                  </Col>
              </Row>
              <Row gutter={24}>

                <Col span={12}>
                  <Form.Item {...formlayout} label='支付保证金时间'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.bondsss) ? '' : this.state.bondsss
                      }
                    />
                  </Form.Item>
                </Col>

                    <Col span={12}>
                      <Form.Item {...formlayout} label='支付单号'>
                        <Input
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.alipayWxpaysss) ? '' : this.state.alipayWxpaysss
                          }
                        />
                      </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label='支付平台服务费'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.bondsss) ? '' : this.state.bondsss
                        }
                      />
                    </Form.Item>
                  </Col>

                      <Col span={12}>
                        <Form.Item {...formlayout} label='支付方式'>
                          <Input
                            disabled
                            value={
                              isNil(this.state) || isNil(this.state.alipayWxpaysss) ? '' : this.state.alipayWxpaysss
                            }
                          />
                        </Form.Item>
                      </Col>
                  </Row>
                  <Row gutter={24}>

                  <Col span={12}>
                    <Form.Item {...formlayout} label='支付时间'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.bondsss) ? '' : this.state.bondsss
                        }
                      />
                    </Form.Item>
                  </Col>

                      <Col span={12}>
                        <Form.Item {...formlayout} label='支付单号'>
                          <Input
                            disabled
                            value={
                              isNil(this.state) || isNil(this.state.alipayWxpaysss) ? '' : this.state.alipayWxpaysss
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
                            isNil(this.state) || isNil(this.state.startPortEn) ? '' : this.state.startPortEn
                          } />
                        </Col>
                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.startPortCn) ? '' : this.state.startPortCn
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
                            isNil(this.state) || isNil(this.state.endPortEn) ? '' : this.state.endPortEn
                          } />
                        </Col>
                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.endPortCn) ? '' : this.state.endPortCn
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
                            isNil(this.state) || isNil(this.state.closingTimeWeek) ? '' : this.state.closingTimeWeek
                          } />
                        </Col>
                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.closingTime) ? '' : this.state.closingTime
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
                            isNil(this.state) || isNil(this.state.sailingTimeWeek) ? '' : this.state.sailingTimeWeek
                          } />
                        </Col>
                        <Col span={8}>
                          <Input disabled value={
                            isNil(this.state) || isNil(this.state.sailingTime) ? '' : this.state.sailingTime
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
                        isNil(this.state) || isNil(this.state.voyage) ? '' : this.state.voyage
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='促销标签1'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.promotionLabelOne) ? '' : this.state.promotionLabelOne
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
                        isNil(this.state) || isNil(this.state.shipCompany) ? '' : this.state.shipCompany
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='促销标签2'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.promotionLabelTwo) ? '' : this.state.promotionLabelTwo
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
                        isNil(this.state) || isNil(this.state.affiliatedCompany) ? '' : this.state.affiliatedCompany
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>

              <Row gutter={24}>
                    <Col>
                      <Form.Item {...smallFormItemLayout} label="舱位秒杀须知">
                        <Input.TextArea
                          maxLength={300}
                          style={{ width: '100%', height: '100px' }}
                          disabled
                          value={
                                  isNil(this.state) || isNil(this.state.advantage) ? '' : this.state.advantage
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

              {
                isNil(this.state) || isNil(this.state.others) ? '' :this.state.others.map(item=>{
                  return(
                    <div>
                      <Row gutter={24}>
                        <Col span={12}>
                          <Form.Item  {...formlayout} label="自定义费用">
                            <InputGroup >
                                <Col span={8}>
                                  <Input disabled value={
                                      item.money
                                  } />
                                </Col>
                                <Col span={8}>
                                  <Input disabled value={
                                    item.count==0?'￥':item.count==1?'$':'€'+' '+item.count
                                  } />
                                </Col>
                            </InputGroup>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          {/* <Form.Item  {...formlayout} label="自定义费用">
                            <InputGroup >

                                <Col span={8}>
                                  <Input disabled value={
                                    item.money
                                  } />
                                </Col>
                                <Col span={8}>
                                  <Input disabled value={
                                    item.count
                                  } />
                                </Col>
                            </InputGroup>
                          </Form.Item> */}
                        </Col>
                      </Row>
                    </div>
                  )
                })

              }

            <div className={commonCss.title}>
              <span className={commonCss.text}>秒杀成交信息</span>
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



            {/* <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='拍卖成交价'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.currentBiddingPrice) ? '' : this.state.currentBiddingPrice
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='成交时间'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.updateDate) ? '' : this.state.updateDate
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                    <Col>
                      <Form.Item {...smallFormItemLayout} label="拍卖出价信息">
                        <Input.TextArea
                          maxLength={300}
                          style={{ width: '100%'}}
                          disabled
                          value={
                                  isNil(this.state) || isNil(this.state.createDate) ? '' : this.state.createDate+' '+' '+' 用户名：'+this.state.accountId+' '+' '+' 联系方式：'+this.state.phonenumber+' '+' '+' 竞价加价：'+this.state.price
                                }
                        />
                      </Form.Item>
                    </Col>
                  </Row> */}
            <div className={commonCss.title}>
              <span className={commonCss.text}>秒杀购买方</span>
            </div>

            <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='用户类型'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.userTypes) ? '' : this.state.userTypes
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='姓名'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.firstNames) ? '' : this.state.firstNames
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
                        isNil(this.state) || isNil(this.state.accountIds) ? '' : this.state.accountIds
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='联系电话'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.phonenumbers) ? '' : this.state.phonenumbers
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
                        isNil(this.state) || isNil(this.state.counts) ? '' : this.state.counts
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='支付方式'>
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
                  <Form.Item {...formlayout} label='保证金支付(成交)时间'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.bondsss) ? '' : this.state.bondsss
                      }
                    />
                  </Form.Item>
                </Col>

                    <Col span={12}>
                      <Form.Item {...formlayout} label='支付单号'>
                        <Input
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.alipayWxpaysss) ? '' : this.state.alipayWxpaysss
                          }
                        />
                      </Form.Item>
                    </Col>
                </Row>
            <div className={commonCss.title}>
              <span className={commonCss.text}>装船&退保证金</span>
            </div>
            <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='现舱发布用户'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.usershipment) ? '' : this.state.usershipment
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='购买方用户'>
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
                  {/* <Form.Item {...formlayout} label='发布者保证金'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.bondsss) ? '' : this.state.bondsss
                      }
                    />
                  </Form.Item> */}
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='购买方保证金'>
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
                  {/* <Form.Item {...formlayout} label='发布者退还方式'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.alipayWxpaysss) ? '' : this.state.alipayWxpaysss
                      }
                    />
                  </Form.Item> */}
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='购买方退还方式'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.moneyTypes) ? '' : this.state.moneyTypes
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* <Row gutter={24}>
                <Col span={12}>
                    <Form.Item {...formlayout} label='发布者退还保证金'>
                      <Input
                        onChange={e => this.setState({ sellerBondss: e.target.value })}
                      />
                    </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='购买方退还保证金'>
                    <Input

                      onChange={e => this.setState({ buyerBondss: e.target.value })}
                    />
                  </Form.Item>
                </Col>
              </Row> */}
              {/* <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='发布者竞拍编号'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.orderNumbersss) ? '' : this.state.orderNumbersss
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='购买方竞拍编号'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.orderNumberasa) ? '' : this.state.orderNumberasa
                      }
                    />
                  </Form.Item>
                </Col>
              </Row> */}
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
                    <Radio.Group onChange={this.onChange2} value={this.state.valuesss}>
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
                  <Row gutter={24}>
                    <Col>
                      <Form.Item {...smallFormItemLayout} label="订单完成">
                        <Checkbox onChange={this.onChange}>已完成（退还保证金服务结束后勾选）</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                        <Col span={24} >
                          <div style={{width:'100%',textAlign:'center'}}>
                            <Button style={{backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.baochunanniu} >
                              保存
                            </Button>
                            <Button  style={{marginLeft:'10px',marginRight:'10px',backgroundColor: '#57B5E3', color: '#FFFFFF'}} onClick={this.onBack} >
                              关闭
                            </Button>
                            <Button style={{marginRight:'10px',backgroundColor: '#F40028', color: '#FFFFFF'}} onClick={this.tiaozhuan} >
                              取消
                            </Button>
                          </div>
                        </Col>
                      </Row>
                {/* <Row className={commonCss.rowTop}>
                    <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                      <ButtonOptionComponent
                        type="TurnDown"
                        text="关闭"
                        event={() => this.onBack()}
                        disabled={false}
                      />
                    </Col>
                </Row> */}

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
