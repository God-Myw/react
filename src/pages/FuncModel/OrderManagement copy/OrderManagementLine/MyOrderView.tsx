import React from 'react';
import { getRequest, putRequest } from '@/utils/request';
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
} from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil, forEach, filter } from 'lodash';
import commonCss from '../../../Common/css/CommonCss.less';
import ButtonOptionComponent from '../../../Common/Components/ButtonOptionComponent';
import { OrderViewFormProps, FileMsg, LogisticsInfo } from '../OrderViewInterface';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import moment from 'moment';
import { linkHref } from '@/utils/utils';

const { Step } = Steps;
const { Text } = Typography;
const { confirm } = Modal;
const { Link } = Anchor;
type OrderProps = OrderViewFormProps & RouteComponentProps;

class MyOrderView extends React.Component<OrderViewFormProps, OrderProps> {
  private userType = localStorage.getItem('userType');

  componentDidMount = () => {
    let guid = this.props.match.params['guid'];
    let payStatus = this.props.match.params['payStatus'];
    let deliverStatus = this.props.match.params['deliverStatus'];
    let orderStatus = this.props.match.params['orderStatus'];
    this.setState({
      payStatus: payStatus,
      deliverStatus: deliverStatus,
      orderStatus: orderStatus,
      visible: false,
    });
    let params: Map<string, any> = new Map();
    if (orderStatus == '2') {
      params.set('type', 3);
      this.setState({
        sceneState: 5,
        currentState: 5,
        current: 4,
      });
    } else if (orderStatus == '1') {
      if ((payStatus == '1' || payStatus == '0') && deliverStatus == '0') {
        params.set('type', 1);
        this.setState({
          sceneState: 2,
          currentState: 2,
          current: 1,
        });
      } else if ((payStatus == '1' || payStatus == '2') && deliverStatus == '1') {
        params.set('type', 2);
        this.setState({
          sceneState: 4,
          currentState: 4,
          current: 3,
        });
      }
    } else if (orderStatus == '0') {
      if ((payStatus == '1' || payStatus == '0') && deliverStatus == '0') {
        params.set('type', 1);
        this.setState({
          sceneState: 2,
          currentState: 2,
          current: 1,
        });
      } else if (payStatus == '1' && deliverStatus == '1') {
        params.set('type', 4);
        this.setState({
          sceneState: 3,
          currentState: 3,
          current: 2,
        });
      }
    }
    //通过ID查询投保详情
    getRequest('/business/order/history/' + guid, params, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          this.setState({
            guid: response.data.order.guid,
            orderNumber: response.data.order.orderNumber, //订单编号
            contractMoney: response.data.order.contractMoney, //合同金额
            downpayment: response.data.order.downpayment,
            tailMoney: Number(this.Subtr(response.data.order.contractMoney,response.data.order.downpayment)),
            goodsContacter: response.data.order.goodsContacter, //货主
            goodsPhone:
              response.data.order.goodsshipPhoneCode +
              '-' +
              response.data.order.goodsshipContactPhone, //货主电话
            shipContacter: response.data.order.shipContacter, //船东
            shipPhone:
              response.data.order.shipPhoneCode + '-' + response.data.order.shipContactPhone, //船东电话
            remark:response.data.order.palletRemark,

            fileName:response.data.settlementAttachment?response.data.settlementAttachment.fileName:'',
            logoUrl:`http://58.33.34.10:10443/images/order/`,

            fileName_l:response.data.balanceAttachment?response.data.balanceAttachment.fileName:'', //尾款流水

            attachments: response.data.attachments ? response.data.attachments : null, //合同

            depositAttachment:response.data.depositAttachment?response.data.depositAttachment.fileName:'',//单证信息

            contractMoneyDollar:response.data.order.contractMoneyDollar ? Number(this.Subtr(response.data.order.contractMoneyDollar,response.data.order.downpaymentDollar)):null,
            downpaymentDollar: response.data.order.downpaymentDollar,
          });
          console.log(this.state.attachments);
          if (!isNil(response.data.attachments) && response.data.attachments.length != 0) {
            const contactFileArr = filter(response.data.attachments, { fileLog: 11 });
            const documentsFileArr = filter(response.data.attachments, { fileLog: 12 });
            //合同图片初始化加载
            this.getFileDownLoad(contactFileArr, fileType.ship_agreement);
            //单证图片初始化加载
            this.getFileDownLoad(documentsFileArr, fileType.ship_document);
          }
          //定金图片初始化加载
          if (!isNil(response.data.depositAttachment)) {
            const arr = [];
            arr.push(response.data.depositAttachment);
            this.getFileDownLoad(arr, fileType.ship_front_payment_slip);
          }

          //尾款图片初始化加载
          if (!isNil(response.data.balanceAttachment)) {
            const arr = [];
            arr.push(response.data.balanceAttachment);
            this.getFileDownLoad(arr, fileType.ship_final_payment_slip);
          }
          //结算图片初始化加载
          if (!isNil(response.data.settlementAttachment)) {
            const arr = [];
            arr.push(response.data.settlementAttachment);
            this.getFileDownLoad(arr, fileType.ship_settle);
          }
          //物流信息取得
          if (this.state.currentState == 3) {
            let params: Map<string, any> = new Map();
            params.set('type', '1');
            params.set('orderNum', response.data.order.orderNumber);
            getRequest('/business/logistics', params, (response1: any) => {
              console.log(response1)
              if (response.status === 200) {
                if (!isNil(response1.data)) {
                  let logistiLcsList: LogisticsInfo[] = [];
                  if (response1.data.orderStatus == 0) {
                    forEach(response1.data.orderLogisticsList, (logisticsInfo, index) => {
                      let logistiLcsMsg: LogisticsInfo = { logisticsMsg: '', time: '' };
                      if (!isNil(logisticsInfo.portName)) {
                        logistiLcsMsg.logisticsMsg = '     ' + logisticsInfo.portName;
                        logistiLcsMsg.time = moment(Number(logisticsInfo.arrivePortTime)).format(
                          'YYYY/MM/DD HH:mm:ss',
                        );
                        logistiLcsList.push(logistiLcsMsg);
                        if (index + 1 === response1.data.orderLogisticsList.length) {
                          this.setState({
                            logisticsInfo: logistiLcsList,
                          });
                        }
                      } else {
                        logistiLcsMsg.logisticsMsg = '     ' + logisticsInfo.currentSeaArea;
                        logistiLcsMsg.time = moment().format('YYYY/MM/DD HH:mm:ss');
                        logistiLcsList.push(logistiLcsMsg);
                      }
                    });
                  } else {
                    forEach(response1.data.orderLogisticsList, (logisticsInfo, index) => {
                      let logistiLcsMsg: LogisticsInfo = { logisticsMsg: '', time: '' };
                      logistiLcsMsg.logisticsMsg = '     ' + logisticsInfo.logisInfo;
                      logistiLcsMsg.time = moment(Number(logisticsInfo.portArriveTime)).format(
                        'YYYY/MM/DD HH:mm:ss',
                      );
                      logistiLcsList.push(logistiLcsMsg);
                      if (index + 1 === response1.data.orderLogisticsList.length) {
                        this.setState({
                          logisticsInfo: logistiLcsList,
                        });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      }
    });
  };

  // 减法避免丢精度
  Subtr(arg1:any,arg2:any){
    var r1,r2,m,n;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    n=(r1>=r2)?r1:r2;
    return ((arg1*m-arg2*m)/m).toFixed(n);
    }

  getFileDownLoad(arr: any, type: any) {
    let documentsList: FileMsg[] = [];
    let contactList: FileMsg[] = [];
    forEach(arr, (attachment, index) => {
      let picParams: Map<string, string> = new Map();
      getRequest(
        '/sys/file/getThumbImageBase64/' + attachment.fileType + '?fileNames=' + attachment.fileName + '&', //BUG131改修
        picParams,
        (response: any) => {
          if (response.status === 200) {
            if (attachment.fileLog == '21') {
              //结算图片
              this.setState({
                settlementFile: [
                  {
                    uid: index,
                    name: response.data[0].fileName,
                    status: 'done',
                    thumbUrl: response.data[0].base64,
                    type: attachment.fileType, //BUG131改修
                  },
                ],
              });
            } else if (attachment.fileLog == '15') {
              //尾款图片
              this.setState({
                tailFile: [
                  {
                    uid: index,
                    name: response.data[0].fileName,
                    status: 'done',
                    thumbUrl: response.data[0].base64,
                    type: attachment.fileType, //BUG131改修
                  },
                ],
              });
            } else if (attachment.fileLog == '14') {
              //定金图片
              this.setState({
                earnestFile: [
                  {
                    uid: index,
                    name: response.data[0].fileName,
                    status: 'done',
                    thumbUrl: response.data[0].base64,
                    type: attachment.fileType,
                  },
                ],
              });
            } else if (attachment.fileLog == '12') {
              //单证图片
              let fileList: FileMsg = {};
              fileList.uid = index;
              fileList.name = response.data[0].fileName;
              fileList.status = 'done';
              fileList.thumbUrl = response.data[0].base64;
              fileList.type = attachment.fileType; //BUG131改修
              documentsList.push(fileList);
              if (documentsList.length == arr.length) {
                this.setState({
                  documentsFile: documentsList,
                  picNum: documentsList.length,
                });
              }
            } else if (attachment.fileLog == '11') {
              let fileList: FileMsg = {};
              fileList.uid = index;
              fileList.name = response.data[0].fileName;
              fileList.status = 'done';
              fileList.thumbUrl = response.data[0].base64;
              fileList.type = attachment.fileType; //BUG131改修
              contactList.push(fileList);
              if (contactList.length == arr.length) {
                this.setState({
                  contactFile: contactList,
                  picNum: contactList.length,
                });
              }
            }
          }
        },
      );
    });
  }

  // 返回
  onBack = () => {
    if (this.userType == '1') {
      this.props.history.push('/orderManagementON/list');
    } else if (this.userType == '2') {
      this.props.history.push('/orderManagementOff/list');
    } else {
      this.props.history.push('/orderManagementExamine/list');
    }
  };

  onChange = (current: any) => {
    if (current === 0) {
      return;
    } else if (
      !isNil(this.state) &&
      !isNil(this.state.currentState) &&
      current > this.state.currentState - 1
    ) {
      return;
    }
    let guid = this.props.match.params['guid'];
    let params: Map<string, any> = new Map();
    if (current === 1) {
      params.set('type', 1);
      getRequest('/business/order/history/' + guid, params, (response: any) => {
        console.log(response)
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            this.setState({
              sceneState: current + 1,
              current: current,
              orderNumber: response.data.order.orderNumber,
              contractMoney: response.data.order.contractMoney,
              downpayment: response.data.order.downpayment,
              goodsContacter: response.data.order.goodsContacter,
              shipContacter: response.data.order.shipContacter,
              goodsPhone:
                response.data.order.goodsshipPhoneCode +
                '-' +
                response.data.order.goodsshipContactPhone,
              shipPhone:
                response.data.order.shipPhoneCode + '-' + response.data.order.shipContactPhone,
              remark:response.data.order.palletRemark,

              logoUrl:`http://58.33.34.10:10443/images/order/`,
              attachments: response.data.attachments ? response.data.attachments : null, //合同
              depositAttachment:response.data.depositAttachment?response.data.depositAttachment.fileName:''//单证信息
            });
            console.log(this.state.logoUrl+this.state.depositAttachment)
            if (!isNil(response.data.attachments) && response.data.attachments.length != 0) {
              const contactFileArr = filter(response.data.attachments, { fileLog: 11 });
              const documentsFileArr = filter(response.data.attachments, { fileLog: 12 });
              //合同图片初始化加载
              this.getFileDownLoad(contactFileArr, fileType.ship_agreement);
              //单证图片初始化加载
              this.getFileDownLoad(documentsFileArr, fileType.ship_document);
            }
            //定金图片初始化加载
            if (!isNil(response.data.depositAttachment)) {
              const arr = [];
              arr.push(response.data.depositAttachment);
              this.getFileDownLoad(arr, fileType.ship_front_payment_slip);
            }
          }
        }
      });
    } else if (current === 2) {
      params.set('type', 4);
      getRequest('/business/order/history/' + guid, params, (response: any) => {
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            this.setState({
              sceneState: current + 1,
              current: current,
              orderNumber: response.data.order.orderNumber,
              contractMoney: response.data.order.contractMoney,
              downpayment: response.data.order.downpayment,
              goodsContacter: response.data.order.goodsContacter,
              shipContacter: response.data.order.shipContacter,
              goodsPhone:
                response.data.order.goodsshipPhoneCode +
                '-' +
                response.data.order.goodsshipContactPhone,
              shipPhone:
                response.data.order.shipPhoneCode + '-' + response.data.order.shipContactPhone,
              remark:response.data.order.palletRemark,
            });
            //物流信息取得
            let params: Map<string, any> = new Map();
            params.set('type', '1');
            params.set('orderNum', response.data.order.orderNumber);
            getRequest('/business/logistics', params, (response1: any) => {
              if (response1.status === 200) {
                if (!isNil(response1.data)) {
                  let logistiLcsList: LogisticsInfo[] = [];
                  if (response1.data.orderStatus == 0) {
                    forEach(response1.data.orderLogisticsList, (logisticsInfo, index) => {
                      let logistiLcsMsg: LogisticsInfo = { logisticsMsg: '', time: '' };
                      if (!isNil(logisticsInfo.portName)) {
                        logistiLcsMsg.logisticsMsg = '     ' + logisticsInfo.portName;
                        logistiLcsMsg.time = moment(Number(logisticsInfo.arrivePortTime)).format(
                          'YYYY/MM/DD HH:mm:ss',
                        );
                        logistiLcsList.push(logistiLcsMsg);
                        if (index + 1 === response1.data.orderLogisticsList.length) {
                          this.setState({
                            logisticsInfo: logistiLcsList,
                          });
                        }
                      } else {
                        logistiLcsMsg.logisticsMsg = '     ' + logisticsInfo.currentSeaArea;
                        logistiLcsMsg.time = moment().format('YYYY/MM/DD HH:mm:ss');
                        logistiLcsList.push(logistiLcsMsg);
                      }
                    });
                  } else {
                    forEach(response1.data.orderLogisticsList, (logisticsInfo, index) => {
                      let logistiLcsMsg: LogisticsInfo = { logisticsMsg: '', time: '' };
                      logistiLcsMsg.logisticsMsg = '     ' + logisticsInfo.logisInfo;
                      logistiLcsMsg.time = moment(Number(logisticsInfo.portArriveTime)).format(
                        'YYYY/MM/DD HH:mm:ss',
                      );
                      logistiLcsList.push(logistiLcsMsg);
                      if (index + 1 === response1.data.orderLogisticsList.length) {
                        this.setState({
                          logisticsInfo: logistiLcsList,
                        });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    } else if (current === 3) {
      params.set('type', 2);
      getRequest('/business/order/history/' + guid, params, (response: any) => {
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            this.setState({
              sceneState: current + 1,
              current: current,
              orderNumber: response.data.order.orderNumber,
              contractMoney: response.data.order.contractMoney,
              downpayment: response.data.order.downpayment,
              goodsContacter: response.data.order.goodsContacter,
              shipContacter: response.data.order.shipContacter,
              goodsPhone:
                response.data.order.goodsshipPhoneCode +
                '-' +
                response.data.order.goodsshipContactPhone,
              shipPhone:
                response.data.order.shipPhoneCode + '-' + response.data.order.shipContactPhone,
              tailMoney: Number(this.Subtr(response.data.order.contractMoney,response.data.order.downpayment)),
              remark:response.data.order.palletRemark,
              contractMoneyDollar:response.data.contractMoneyDollar ? Number(this.Subtr(response.data.contractMoneyDollar,response.data.downpaymentDollar)):null,
              downpaymentDollar: response.data.downpaymentDollar,
            });
            //尾款图片初始化加载
            if (!isNil(response.data.balanceAttachment)) {
              const arr = [];
              arr.push(response.data.balanceAttachment);
              this.getFileDownLoad(arr, fileType.ship_final_payment_slip);
            }
          }
        }
      });
    } else if (current === 4) {
      params.set('type', 3);
      getRequest('/business/order/history/' + guid, params, (response: any) => {
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            this.setState({
              sceneState: current + 1,
              current: current,
            });
            //结算图片初始化加载
            if (!isNil(response.data.settlementAttachment)) {
              const arr = [];
              arr.push(response.data.settlementAttachment);
              this.getFileDownLoad(arr, fileType.ship_settle);
            }
          }
        }
      });
    }
  };

  //改变订单状态
  changeOrderStatus = (e: any) => {
    let guid = this.props.match.params['guid'];
    let param = { type: 3, guid: guid };
    confirm({
      title: '确定改变订单状态?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        putRequest('/business/order/billReview', JSON.stringify(param), (response: any) => {
          if (response.status === 200) {
            this.setState({
              sceneState: 4,
              currentState: 4,
              current: 3,
              orderStatus: 1,
            });
            message.success('订单状态已改变', 2);
          }
        });
      },
    });
  };

  //改变发货状态
  changeDeliveryStatus = (e: any) => {
    let guid = this.props.match.params['guid'];
    let param = { type: 1, guid: guid };
    confirm({
      title: '确定改变发货状态?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        putRequest('/business/order/billReview', JSON.stringify(param), (response: any) => {
          if (response.status === 200) {
            this.setState({
              sceneState: 3,
              currentState: 3,
              current: 2,
              deliverStatus: 1,
            });
            message.success('发货状态已改变', 2);
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

  render() {
    const current = isNil(this.state) || isNil(this.state.current) ? 0 : this.state.current;
    const { getFieldDecorator } = this.props.form;
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
    let logisticsList =
      isNil(this.state) || isNil(this.state.logisticsInfo) ? [] : this.state.logisticsInfo;
    const elements: JSX.Element[] = [];
    forEach(logisticsList, (item: LogisticsInfo, key) => {
      if (key == 0) {
        elements.push(
          <Timeline.Item style={{ fontSize: '20px', fontWeight: 'bold' }} color="red">
            {item.time}&nbsp;&nbsp;&nbsp;&nbsp;{item.logisticsMsg}
          </Timeline.Item>,
        );
      } else {
        elements.push(
          <Timeline.Item color="red">
            {item.time}&nbsp;&nbsp;&nbsp;&nbsp;{item.logisticsMsg}
          </Timeline.Item>,
        );
      }
    });



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
        <Anchor>
          <Card bordered={false} style={{ paddingTop: 20 }}>
            <Steps current={current} onChange={this.onChange} labelPlacement={'vertical'}>
              <Step
                title={formatMessage({ id: 'OrderManagement-MyOrderView.order' })}
                description=""
              />
              <Step
                title={formatMessage({ id: 'OrderManagement-MyOrderView.payed' })}
                description=""
              />
              <Step
                title={formatMessage({ id: 'OrderManagement-MyOrderView.transport' })}
                description=""
              />
              <Step
                title={formatMessage({ id: 'OrderManagement-MyOrderView.final.payment' })}
                description=""
              />
              <Step
                title={formatMessage({ id: 'OrderManagement-MyOrderView.complete' })}
                description=""
              />
            </Steps>
          </Card>
        </Anchor>
        {!isNil(this.state) && this.state.sceneState == 5 ? (
          <Card bordered={false}>
            <div
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              <FormattedMessage id="订单已完成！" />
            </div>
          </Card>
        ) : null}
        <Divider dashed={true} />
        {/* 订单信息 */}
        {!isNil(this.state) && this.state.sceneState !== 5 ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-OrderMsg.orderinformation' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item {...formlayout} label="货订单编号">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                        rules: [{ required: true }],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formlayout} label="货总金额">
                      {getFieldDecorator('contractMoney', {
                        initialValue:
                          isNil(this.state) || this.state.contractMoney == null
                            ? ''
                            : this.state.contractMoney,
                        rules: [{ required: true }],
                      })(<Input disabled suffix='￥'/>)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formlayout} label="货主姓名">
                      {getFieldDecorator('shipownerContacter', {
                        initialValue:
                          isNil(this.state) || this.state.goodsContacter == null
                            ? ''
                            : this.state.goodsContacter,
                        rules: [{ required: true }],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item {...formlayout} label="货主联系方式">
                      {getFieldDecorator('shipownerPhone', {
                        initialValue:
                          isNil(this.state) || this.state.goodsPhone == null
                            ? ''
                            : this.state.goodsPhone,
                        rules: [{ required: true }],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formlayout} label="船东姓名">
                      {getFieldDecorator('shipperContacter', {
                        initialValue:
                          isNil(this.state) || this.state.shipContacter == null
                            ? ''
                            : this.state.shipContacter,
                        rules: [{ required: true }],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...formlayout} label="船东联系方式">
                      {getFieldDecorator('shipperPhone', {
                        initialValue:
                          isNil(this.state) || this.state.shipPhone == null
                            ? ''
                            : this.state.shipPhone,
                        rules: [{ required: true }],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...formItemLayout} label="备注">
                      <Input.TextArea maxLength={300} style={{ width: '100%', height: '200px' }}
                      value={
                          isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                        } disabled={true}/>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/* 查看合同&Recap信息 */}
        {!isNil(this.state) &&
        this.state.sceneState == 2 &&
        ((this.userType == '3' && this.state.deliverStatus == 0) ||
          this.userType == '1' ||
          this.userType == '2') ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-ContactAndRecapView.view' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form style={{ height: 200 }}>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item {...formlayout} label="">
                      <Upload
                        action=""
                        listType="picture-card"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: false,
                          showRemoveIcon: false,
                        }}
                        fileList={
                          isNil(this.state) ||
                          isNil(this.state.contactFile) ||
                          this.state.contactFile.length == 0
                            ? ''
                            : this.state.contactFile
                        }
                        onPreview={this.handlePreview.bind(this, fileType.ship_agreement)}
                      ></Upload>
                      {/* {
                        isNil(this.state) || isNil(this.state.attachments) ? '' : (this.state.attachments.map(item=>{
                          // console.log(this.state.logoUrl+item.fileName)
                          // console.log(isNil(this.state) || isNil(this.state.logoUrl))
                          return (
                            <span style={{ width: '200px', height: '200px', display: 'inline-block', overflow: 'hidden', marginLeft:'50px'}}>
                              <div style={{ width: '200px', height: '200px', display: 'inline-block', overflow: 'hidden', marginLeft:'50px'}} >
                                <img key={item.guid} src={ isNil(this.state) || isNil(this.state.logoUrl) ? '' : (this.state.logoUrl + item.fileName)} alt="" style={{ width: '100%' }}
                                onClick={ () => { this.showModal(!isNil(this.state) || isNil(this.state.logoUrl) ? '' : (this.state.logoUrl + item.fileName)) }}/>
                              </div>
                            </span>
                          )
                        }))
                      } */}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/*单证信息*/}
        {!isNil(this.state) &&
        this.state.sceneState == 2 &&
        ((this.userType == '3' && this.state.deliverStatus == 0) ||
          this.userType == '1' ||
          this.userType == '2') ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-DocumentsView.view' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form style={{ height: 200 }}>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item {...formlayout} label="">
                      <Upload
                        action=""
                        listType="picture-card"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: false,
                          showRemoveIcon: false,
                        }}
                        fileList={
                          isNil(this.state) ||
                          isNil(this.state.documentsFile) ||
                          this.state.documentsFile.length == 0
                            ? ''
                            : this.state.documentsFile
                        }
                        onPreview={this.handlePreview.bind(this, fileType.ship_document)}
                      ></Upload>

                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/*支付信息*/}

          {/* 定金信息 */}
        {!isNil(this.state) && this.state.sceneState == 2 && this.state.payStatus == 0 ? (
          <div className={commonCss.container} style={{minWidth:1320}}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-PayMsg.payment.information' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form>
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Form.Item {...formlayout} label="">
                      <Text style={{ color: 'red' }}>等待货主上传定金流水照片！</Text>
                    </Form.Item>
                  </Col>
                  <Col span={16}></Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {!isNil(this.state) &&
        this.state.sceneState == 2 &&
        (this.state.payStatus == 1 || this.state.payStatus == 2) ? (
          <div className={commonCss.container} style={{minWidth:1320}}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-PayMsg.payment.information' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form>
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Upload
                      action=""
                      listType="picture-card"
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: false,
                      }}
                      fileList={
                        isNil(this.state) ||
                        isNil(this.state.earnestFile) ||
                        this.state.earnestFile.length == 0
                          ? ''
                          : this.state.earnestFile
                      }
                      onPreview={this.handlePreview.bind(this, fileType.ship_document)}
                    ></Upload>
                      <div style={{ width: '200px', height: '200px', display: 'inline-block', overflow: 'hidden', marginLeft:'50px'}} >
                        <img  src={ isNil(this.state) || isNil(this.state.depositAttachment) ? '' : (this.state.logoUrl + this.state.depositAttachment)} alt="" style={{ width: '100%' }}
                          onClick={ () => { this.showModal(!isNil(this.state) || isNil(this.state.logoUrl) ? '' : (this.state.logoUrl + this.state.depositAttachment)) }}/>
                      </div>
                  </Col>
                  <Col span={16}></Col>
                </Row>
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Form.Item
                      {...formlayout4}
                      label={formatMessage({ id: 'OrderManagement-PayMsg.payed.deposit' })}
                    >
                      {getFieldDecorator('downpayment', {
                        initialValue:
                          isNil(this.state) || this.state.downpayment == null
                            ? ''
                            : '￥' + this.state.downpayment,
                        rules: [{ required: true }],
                      })(<Input style={{ color: 'red' }} disabled />)}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Form.Item
                      {...formlayout4}
                      label={formatMessage({ id: '$' })}
                    >
                      {getFieldDecorator('downpaymentDollar', {
                        initialValue:
                          isNil(this.state) || this.state.downpaymentDollar == null
                            ? ''
                            : '$ ' + this.state.downpaymentDollar,
                        rules: [{ required: true }],
                      })(<Input style={{ color: 'red' }} disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

          {/* 尾款信息 */}

        {/* {!isNil(this.state) && this.state.sceneState == 4 && this.state.payStatus == 1 ? (
          <div className={commonCss.container} style={{minWidth:1320}}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-PayMsg.payment.information' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form>
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Form.Item {...formlayout} label="">
                      <Text style={{ color: 'red' }}>等待货主上传尾款流水照片！</Text>
                    </Form.Item>
                  </Col>
                  <Col span={16}></Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null} */}

        {!isNil(this.state) && this.state.sceneState == 4 && this.state.payStatus == 1 ? (
          <div className={commonCss.container} style={{minWidth:1320}}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-PayMsg.payment.information' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form>
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Upload
                      action=""
                      listType="picture-card"
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: false,
                      }}
                      fileList={
                        isNil(this.state) ||
                        isNil(this.state.tailFile) ||
                        this.state.tailFile.length == 0
                          ? ''
                          : this.state.tailFile
                      }
                      onPreview={this.handlePreview.bind(this, fileType.ship_final_payment_slip)}
                    ></Upload>


                      <img
                      alt="货主未上传尾款流水单"
                      style={{ width: '25%' }}
                      src={isNil(this.state) || isNil(this.state.fileName_l) ? '' : (this.state.logoUrl + this.state.fileName_l)}
                      // onClick={this.showModal(isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype))}
                      onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.fileName_l) ? '' : (this.state.logoUrl + this.state.fileName_l)) }}
                    />

                  </Col>
                  <Col span={16}></Col>
                </Row>
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Form.Item
                      {...formlayout4}
                      label={formatMessage({ id: 'OrderManagement-PayMsg.payed.deposit' })}
                    >
                      {getFieldDecorator('downpayment', {
                        initialValue:
                          isNil(this.state) || this.state.downpayment == null
                            ? ''
                            : '￥' + this.state.downpayment,
                        rules: [{ required: true }],
                      })(<Input style={{ color: 'red' }} disabled />)}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Form.Item
                      {...formlayout4}
                      label={formatMessage({ id: '$' })}
                    >
                      {getFieldDecorator('downpaymentDollar', {
                        initialValue:
                          isNil(this.state) || this.state.downpaymentDollar == null
                            ? ''
                            : '$ ' + this.state.downpaymentDollar,
                        rules: [{ required: true }],
                      })(<Input style={{ color: 'red' }} disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Form.Item
                      {...formlayout4}
                      label={formatMessage({ id: 'OrderManagement-PayMsg.payed.final.payment' })}
                    >
                      {getFieldDecorator('tailMoney', {
                        initialValue:
                          isNil(this.state) || this.state.tailMoney == null
                            ? ''
                            : '￥' + this.state.tailMoney,
                        rules: [{ required: true }],
                      })(<Input style={{ color: 'red' }} disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                {/* contractMoneyDollar
downpaymentDollar */}
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Form.Item
                      {...formlayout4}
                      label={formatMessage({ id: '$' })}
                    >
                      {getFieldDecorator('contractMoneyDollar', {
                        initialValue:
                          isNil(this.state) || this.state.contractMoneyDollar == null
                            ? ''
                            : '$ ' + this.state.contractMoneyDollar,
                        rules: [{ required: true }],
                      })(<Input style={{ color: 'red' }} disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/* 发货状态  */}
        {!isNil(this.state) &&
        this.state.sceneState == 2 &&
        (this.state.payStatus == 1 || this.state.payStatus == 2) &&
        this.userType == '1' ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>货物信息</span>
            </div>
            <Card bordered={false}>
              <Col span={2}>
                <span style={{ color: 'red' }}>*</span>
                <span>发货状态</span>
              </Col>
              <Checkbox
                disabled={
                  !isNil(this.state) &&
                  !isNil(this.state.payStatus) &&
                  (this.state.payStatus == 1 || this.state.payStatus == 2) &&
                  this.state.deliverStatus == 1
                }
                checked={
                  !isNil(this.state) &&
                  !isNil(this.state.deliverStatus) &&
                  this.state.deliverStatus == 1
                }
                onChange={this.changeDeliveryStatus}
              >
                <FormattedMessage id="OrderManagement-DeliveryStatus.shipped" />
              </Checkbox>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/* 订单状态  */}
        {!isNil(this.state) && this.state.sceneState == 3 && this.userType == '1' ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>货物信息</span>
            </div>
            <Card bordered={false}>
              <Col span={2}>
                <span style={{ color: 'red' }}>*</span>
                <span>发货状态</span>
              </Col>
              <Checkbox
                disabled={
                  !isNil(this.state) &&
                  !isNil(this.state.deliverStatus) &&
                  (this.state.orderStatus == 1 || this.state.orderStatus == 2)
                }
                checked={
                  !isNil(this.state) &&
                  !isNil(this.state.orderStatus) &&
                  (this.state.orderStatus == 1 || this.state.orderStatus == 2)
                }
                onChange={this.changeOrderStatus.bind(this)}
              >
                <FormattedMessage id="OrderManagement-OrderStatus.finished" />
              </Checkbox>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/* 物流信息  */}
        {!isNil(this.state) && this.state.sceneState == 3 ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-LogisticsView.information' })}
              </span>
            </div>
            <Card bordered={false}>
              <Timeline>{elements}</Timeline>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/*结算信息*/}
        {!isNil(this.state) && this.state.sceneState == 5 ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>结算信息</span>
            </div>
            <Card bordered={false}>
              <Form>
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Upload
                      action=""
                      listType="picture-card"
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: false,
                      }}
                      fileList={
                        isNil(this.state) ||
                        isNil(this.state.settlementFile) ||
                        this.state.settlementFile.length == 0
                          ? ''
                          : this.state.settlementFile
                      }
                      onPreview={this.handlePreview.bind(this, fileType.ship_settle)}
                    ></Upload>
                    <img
                      alt="无"
                      style={{ width: '25%' }}
                      src={isNil(this.state) || isNil(this.state.fileName) ? '' : (this.state.logoUrl + this.state.fileName)}
                      // onClick={this.showModal(isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype))}
                      onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.fileName) ? '' : (this.state.logoUrl + this.state.fileName)) }}
                    />
                  </Col>
                  <Col span={16}></Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}
        <Card bordered={false}>
          <Row className={commonCss.rowTop}>
            <Col span={14} pull={1} className={commonCss.lastButtonAlignRight}>
              <ButtonOptionComponent
                disabled={false}
                type="CloseButton"
                text={formatMessage({ id: 'OrderManagement-MyOrderView.close' })}
                event={() => this.onBack()}
              />
            </Col>
            <Col span={10}></Col>
          </Row>
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
