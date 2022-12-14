import React from 'react';
import { getRequest, putRequest } from '@/utils/request';
import {
  Col,
  Divider,
  Row,
  Steps,
  message,
  Form,
  DatePicker,
  Modal,
  Upload,
  Card,
  Input,
  Anchor,
  Select,
} from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil, forEach } from 'lodash';
import commonCss from '../../../Common/css/CommonCss.less';
import ButtonOptionComponent from '../../../Common/Components/ButtonOptionComponent';
import { OrderViewFormProps, FileMsg } from '../OrderViewInterface';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { linkHref } from '@/utils/utils';
const { Step } = Steps;
const { confirm } = Modal;
import '@wangeditor/editor/dist/css/style.css';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '../../../../components/WangEditor';
type OrderProps = OrderViewFormProps & RouteComponentProps;
class MyOrderView extends React.Component<OrderViewFormProps, OrderProps> {
  private userType = localStorage.getItem('userType');
  componentDidMount = () => {
    let guid = this.props.match.params['guid'];
    let payStatus = this.props.match.params['payStatus'];
    let deliverStatus = this.props.match.params['deliverStatus'];
    let orderStatus = this.props.match.params['orderStatus'];
    this.setState({
      editor: null,
      guid: guid,
      OrderShow: true,
      visible: false,
      htEdit: true,
      current: 0,
      sceneState: 3,
      currentState: 3,
      payStatus: payStatus,
      deliverStatus: deliverStatus,
      orderStatus: orderStatus,
    });
    let params: Map<string, any> = new Map();
    // params.set('type', 4);
    params.set('guid', guid);
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
    getRequest('/business/order/getNewOrderById', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          let data = response.data;
          this.setState({
            ContractTitle: data.ContractTitle,
            orderNumber: data.orderNumber,
            orderCreateDate: data.orderCreateDate,
            chargeType: data.chargeType,
            palletNumber: data.palletNumber,
            palletStartPortName: data.palletStartPortName,
            palletDestinationPortName: data.palletDestinationPortName,
            goodsName: data.goodsName,
            goodsWeight: data.goodsWeight,
            goodsMaxWeight: data.goodsMaxWeight,
            loadDate: data.loadDate,
            endDate: data.endDate,
            weightMin: data.weightMin,
            weightMax: data.weightMax,
            shipSum: data.shipSum,
            intentionMoney: data.intentionMoney,
            shipLoadUnloadDay: data.shipLoadUnloadDay,
            freightType: data.freightType, //1有定金2卸前付清3既有定金又卸前付清
            overdueFee: data.overdueFee,
            remark: data.remark,
            shipName: data.shipName,
            tonNumber: data.tonNumber,
            finalPaymentClosingTime: data.finalPaymentClosingTime,
            finalPaymentCount: data.finalPaymentCount,
            balanceDate: data.balanceDate,
            orderFinishDate: data.orderFinishDate,
            depositCount: data.depositCount,
            dyMoneySum: data.dyMoneySum,
            dyServiceCharge: data.dyServiceCharge,
            finalPaymentPayType: data.finalPaymentPayType, //1支付宝、2微信、3公司转账、4线下支付
            finishDate: data.finishDate,
            finishVDate: data.finishVDate,
            palletMoneySum: data.palletMoneySum,
            voyageMoneySum: data.voyageMoneySum,
          });
        }
      }
    });
  };
  // 减法避免丢精度
  Subtr(arg1: any, arg2: any) {
    var r1, r2, m, n;
    try {
      r1 = arg1.toString().split('.')[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split('.')[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = r1 >= r2 ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  }

  getFileDownLoad(arr: any, type: any) {
    let documentsList: FileMsg[] = [];
    let contactList: FileMsg[] = [];
    forEach(arr, (attachment, index) => {
      let picParams: Map<string, string> = new Map();
      getRequest(
        '/sys/file/getThumbImageBase64/' +
          attachment.fileType +
          '?fileNames=' +
          attachment.fileName +
          '&', //BUG131改修
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

  //步骤条切换
  onChange = (current: any) => {
    if (this.state.OrderShow) {
      this.setState({ current: current });
    }
    // if (current === 0) {
    //   return;
    // } else if (
    //   !isNil(this.state) &&
    //   !isNil(this.state.currentState) &&
    //   current > this.state.currentState - 1
    // ) {
    //   return;
    // }
    // let guid = this.props.match.params['guid'];
    // let params: Map<string, any> = new Map();
    // if (current === 1) {
    //   params.set('type', 1);
    //   getRequest('/business/order/history/' + guid, params, (response: any) => {
    //     console.log(response);
    //     if (response.status === 200) {
    //       //把查询到的信息data赋值给页面
    //       if (!isNil(response.data)) {
    //         this.setState({
    //           sceneState: current + 1,
    //           current: current,
    //           orderNumber: response.data.order.orderNumber,
    //           contractMoney: response.data.order.contractMoney,
    //           downpayment: response.data.order.downpayment,
    //           goodsContacter: response.data.order.goodsContacter,
    //           shipContacter: response.data.order.shipContacter,
    //           goodsPhone:
    //             response.data.order.goodsshipPhoneCode +
    //             '-' +
    //             response.data.order.goodsshipContactPhone,
    //           shipPhone:
    //             response.data.order.shipPhoneCode + '-' + response.data.order.shipContactPhone,
    //           remark: response.data.order.palletRemark,
    //           logoUrl: `http://58.33.34.10:10443/images/order/`,
    //           attachments: response.data.attachments ? response.data.attachments : null, //合同
    //           depositAttachment: response.data.depositAttachment
    //             ? response.data.depositAttachment.fileName
    //             : '', //单证信息
    //         });
    //         if (!isNil(response.data.attachments) && response.data.attachments.length != 0) {
    //           const contactFileArr = filter(response.data.attachments, { fileLog: 11 });
    //           const documentsFileArr = filter(response.data.attachments, { fileLog: 12 });
    //           //合同图片初始化加载
    //           this.getFileDownLoad(contactFileArr, fileType.ship_agreement);
    //           //单证图片初始化加载
    //           this.getFileDownLoad(documentsFileArr, fileType.ship_document);
    //         }
    //         //定金图片初始化加载
    //         if (!isNil(response.data.depositAttachment)) {
    //           const arr = [];
    //           arr.push(response.data.depositAttachment);
    //           this.getFileDownLoad(arr, fileType.ship_front_payment_slip);
    //         }
    //       }
    //     }
    //   });
    // } else if (current === 2) {
    //   params.set('type', 4);
    //   getRequest('/business/order/history/' + guid, params, (response: any) => {
    //     if (response.status === 200) {
    //       //把查询到的信息data赋值给页面
    //       if (!isNil(response.data)) {
    //         this.setState({
    //           sceneState: current + 1,
    //           current: current,
    //           orderNumber: response.data.order.orderNumber,
    //           contractMoney: response.data.order.contractMoney,
    //           downpayment: response.data.order.downpayment,
    //           goodsContacter: response.data.order.goodsContacter,
    //           shipContacter: response.data.order.shipContacter,
    //           goodsPhone:
    //             response.data.order.goodsshipPhoneCode +
    //             '-' +
    //             response.data.order.goodsshipContactPhone,
    //           shipPhone:
    //             response.data.order.shipPhoneCode + '-' + response.data.order.shipContactPhone,
    //           remark: response.data.order.palletRemark,
    //         });
    //         //物流信息取得
    //         let params: Map<string, any> = new Map();
    //         params.set('type', '1');
    //         params.set('orderNum', response.data.order.orderNumber);
    //         getRequest('/business/logistics', params, (response1: any) => {
    //           if (response1.status === 200) {
    //             if (!isNil(response1.data)) {
    //               let logistiLcsList: LogisticsInfo[] = [];
    //               if (response1.data.orderStatus == 0) {
    //                 forEach(response1.data.orderLogisticsList, (logisticsInfo, index) => {
    //                   let logistiLcsMsg: LogisticsInfo = { logisticsMsg: '', time: '' };
    //                   if (!isNil(logisticsInfo.portName)) {
    //                     logistiLcsMsg.logisticsMsg = '     ' + logisticsInfo.portName;
    //                     logistiLcsMsg.time = moment(Number(logisticsInfo.arrivePortTime)).format(
    //                       'YYYY/MM/DD HH:mm:ss',
    //                     );
    //                     logistiLcsList.push(logistiLcsMsg);
    //                     if (index + 1 === response1.data.orderLogisticsList.length) {
    //                       this.setState({
    //                         logisticsInfo: logistiLcsList,
    //                       });
    //                     }
    //                   } else {
    //                     logistiLcsMsg.logisticsMsg = '     ' + logisticsInfo.currentSeaArea;
    //                     logistiLcsMsg.time = moment().format('YYYY/MM/DD HH:mm:ss');
    //                     logistiLcsList.push(logistiLcsMsg);
    //                   }
    //                 });
    //               } else {
    //                 forEach(response1.data.orderLogisticsList, (logisticsInfo, index) => {
    //                   let logistiLcsMsg: LogisticsInfo = { logisticsMsg: '', time: '' };
    //                   logistiLcsMsg.logisticsMsg = '     ' + logisticsInfo.logisInfo;
    //                   logistiLcsMsg.time = moment(Number(logisticsInfo.portArriveTime)).format(
    //                     'YYYY/MM/DD HH:mm:ss',
    //                   );
    //                   logistiLcsList.push(logistiLcsMsg);
    //                   if (index + 1 === response1.data.orderLogisticsList.length) {
    //                     this.setState({
    //                       logisticsInfo: logistiLcsList,
    //                     });
    //                   }
    //                 });
    //               }
    //             }
    //           }
    //         });
    //       }
    //     }
    //   });
    // } else if (current === 3) {
    //   params.set('type', 2);
    //   getRequest('/business/order/history/' + guid, params, (response: any) => {
    //     if (response.status === 200) {
    //       //把查询到的信息data赋值给页面
    //       if (!isNil(response.data)) {
    //         this.setState({
    //           sceneState: current + 1,
    //           current: current,
    //           orderNumber: response.data.order.orderNumber,
    //           contractMoney: response.data.order.contractMoney,
    //           downpayment: response.data.order.downpayment,
    //           goodsContacter: response.data.order.goodsContacter,
    //           shipContacter: response.data.order.shipContacter,
    //           goodsPhone:
    //             response.data.order.goodsshipPhoneCode +
    //             '-' +
    //             response.data.order.goodsshipContactPhone,
    //           shipPhone:
    //             response.data.order.shipPhoneCode + '-' + response.data.order.shipContactPhone,
    //           tailMoney: Number(
    //             this.Subtr(response.data.order.contractMoney, response.data.order.downpayment),
    //           ),
    //           remark: response.data.order.palletRemark,
    //           contractMoneyDollar: response.data.contractMoneyDollar
    //             ? Number(
    //                 this.Subtr(response.data.contractMoneyDollar, response.data.downpaymentDollar),
    //               )
    //             : null,
    //           downpaymentDollar: response.data.downpaymentDollar,
    //         });
    //         //尾款图片初始化加载
    //         if (!isNil(response.data.balanceAttachment)) {
    //           const arr = [];
    //           arr.push(response.data.balanceAttachment);
    //           this.getFileDownLoad(arr, fileType.ship_final_payment_slip);
    //         }
    //       }
    //     }
    //   });
    // } else if (current === 4) {
    //   params.set('type', 3);
    //   getRequest('/business/order/history/' + guid, params, (response: any) => {
    //     if (response.status === 200) {
    //       //把查询到的信息data赋值给页面
    //       if (!isNil(response.data)) {
    //         this.setState({
    //           sceneState: current + 1,
    //           current: current,
    //         });
    //         //结算图片初始化加载
    //         if (!isNil(response.data.settlementAttachment)) {
    //           const arr = [];
    //           arr.push(response.data.settlementAttachment);
    //           this.getFileDownLoad(arr, fileType.ship_settle);
    //         }
    //       }
    //     }
    //   });
    // }
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
    getRequest('/sys/file/getImageBase64/' + file.type, params, (response: any) => {
      //BUG131改修
      this.setState({
        previewImage: response.data.file.base64,
        previewVisible: true,
      });
    });
  };
  // 图片放大
  showModal = (a: any) => {
    this.setState({
      visible: true,
    });
    // this.setState({
    //   bigImg: a,
    // });
  };

  handleOk = (e: any) => {
    // console.log(e);
    // this.setState({
    //   visible: false,
    // });
  };
  render() {
    const current = isNil(this.state) || isNil(this.state.current) ? 0 : this.state.current;
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const toolbarConfig = {
      excludeKeys: ['fullScreen'],
      // 可配置 toolbarKeys: [...]
    };
    const editorConfig: Partial<IEditorConfig> = {
      placeholder: '请输入内容...',
      readOnly: true,
      onCreated: (editor: IDomEditor) => {
        this.setState({ editor });
      },
      onChange: (editor: IDomEditor) => {
        this.setState({ curContent: editor.children });
      },
    };
    // 继续补充其他配置~
    const defaultContent = [
      { type: 'paragraph', children: [{ text: '1' }] },
      { type: 'paragraph', children: [{ text: '2' }] },
    ];

    return (
      <div className={commonCss.container}>
        <Anchor>
          <Card bordered={false} style={{ paddingTop: 20 }}>
            <Steps current={current} onChange={this.onChange} labelPlacement={'vertical'}>
              <Step
                title={formatMessage({ id: 'OrderManagement-ContactAndRecapView.viewOrder' })}
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
              <FormattedMessage id="OrderManagement-MyOrder.order.success" />
            </div>
          </Card>
        ) : null}
        {/* suffix="￥" */}

        {/*签订合同-交易完成*/}
        {!isNil(this.state) && this.state.OrderShow ? (
          <div className={commonCss.container}>
            {/* 订单信息 */}
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-OrderMsg.orderinformation' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单编号">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="下单时间">
                      {getFieldDecorator('orderCreateDate', {
                        initialValue:
                          isNil(this.state) || this.state.orderCreateDate == null
                            ? ''
                            : this.state.orderCreateDate,
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="航运费">
                      {getFieldDecorator('chargeTtypeValue', {
                        initialValue:
                          isNil(this.state) || this.state.chargeTtypeValue == null
                            ? ''
                            : this.state.chargeTtypeValue,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单预估总金额">
                      {getFieldDecorator('contractMoney', {
                        initialValue:
                          isNil(this.state) || this.state.contractMoney == null
                            ? ''
                            : this.state.contractMoney,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单状态">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付状态">
                      {getFieldDecorator('contractMoney', {
                        initialValue:
                          isNil(this.state) || this.state.contractMoney == null
                            ? ''
                            : this.state.contractMoney,
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                {/* 实装货物吨位 */}
                {this.state.current !== 0 && this.state.current !== 1 ? (
                  <div>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="实装货物吨位">
                          {getFieldDecorator('orderNumber', {
                            initialValue:
                              isNil(this.state) || this.state.orderNumber == null
                                ? ''
                                : this.state.orderNumber,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="订单实际总金额">
                          {getFieldDecorator('contractMoney', {
                            initialValue:
                              isNil(this.state) || this.state.contractMoney == null
                                ? ''
                                : this.state.contractMoney,
                            rules: [],
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ) : null}
              </Form>
            </Card>
            {/* 支付信息 */}
            {this.state.current !== 0 ? (
              <div>
                {this.state.current !== 1 && this.state.current !== 2 ? (
                  <div>
                    {this.state.current !== 3 ? (
                      <div>
                        {/* 船东运费总收益 */}
                        <div className={commonCss.title}>
                          <span className={commonCss.text}>
                            {formatMessage({ id: 'OrderManagement-MyOrder.voyageMoneySum' })}
                          </span>
                          <div style={{ position: 'absolute', right: '70px', top: 0 }}>
                            <ButtonOptionComponent
                              disabled={false}
                              type="OrderView"
                              text={formatMessage({
                                id: 'OrderManagement-MyOrder.fix.voyageMoneySum',
                              })}
                              event={() => {
                                this.setState({ OrderShow: false, ZsyShow: true });
                              }}
                            />
                          </div>
                        </div>
                        <Card bordered={false}>
                          <Form labelAlign="left">
                            <Row gutter={24}>
                              <Col span={12}>
                                <Form.Item {...formlayout} label="货主支付定金">
                                  {getFieldDecorator('depositCount', {
                                    initialValue:
                                      isNil(this.state) || this.state.depositCount == null
                                        ? ''
                                        : this.state.depositCount,
                                  })(<Input disabled />)}
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item {...formlayout} label="平台服务费">
                                  {getFieldDecorator('dyServiceCharge', {
                                    initialValue:
                                      isNil(this.state) || this.state.dyServiceCharge == null
                                        ? ''
                                        : this.state.dyServiceCharge,
                                    rules: [],
                                  })(<Input disabled />)}
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={24}>
                              <Col span={12}>
                                <Form.Item {...formlayout} label="货主支付尾款">
                                  {getFieldDecorator('finalPaymentCount', {
                                    initialValue:
                                      isNil(this.state) || this.state.finalPaymentCount == null
                                        ? ''
                                        : this.state.finalPaymentCount,
                                  })(<Input disabled />)}
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item {...formlayout} label="船东总收益">
                                  {getFieldDecorator('voyageMoneySum', {
                                    initialValue:
                                      isNil(this.state) || this.state.voyageMoneySum == null
                                        ? ''
                                        : this.state.voyageMoneySum,
                                    rules: [],
                                  })(<Input disabled />)}
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row gutter={24}>
                              <Col span={12}>
                                <Form.Item {...formlayout} label="收益结算时间">
                                  {getFieldDecorator('orderFinishDate', {
                                    initialValue:
                                      isNil(this.state) || this.state.orderFinishDate == null
                                        ? ''
                                        : this.state.orderFinishDate,
                                  })(<Input disabled />)}
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item {...formlayout} label="船东是否提现">
                                  {getFieldDecorator('contractMoney', {
                                    initialValue:
                                      isNil(this.state) || this.state.contractMoney == null
                                        ? ''
                                        : this.state.contractMoney,
                                    rules: [],
                                  })(<Input disabled />)}
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        </Card>
                      </div>
                    ) : null}
                    {/* 货主尾款支付 */}
                    <div className={commonCss.title}>
                      <span className={commonCss.text}>
                        {formatMessage({ id: 'OrderManagement-MyOrderView.final.payment' })}
                      </span>
                      <div style={{ position: 'absolute', right: '70px', top: 0 }}>
                        <ButtonOptionComponent
                          disabled={false}
                          type="OrderView"
                          text={'修改支付信息'}
                          event={() => {
                            this.setState({ OrderShow: false, ZfxxShow: true });
                          }}
                        />
                        <ButtonOptionComponent
                          disabled={false}
                          type="OrderView"
                          text={formatMessage({ id: 'OrderManagement-InformationOfflinePay.view' })}
                          event={() => {
                            this.setState({ OrderShow: false, XxzfShow: true });
                          }}
                        />
                      </div>
                    </div>
                    <Card bordered={false}>
                      <Form labelAlign="left">
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="支付金额">
                              {getFieldDecorator('finalPaymentCount', {
                                initialValue:
                                  isNil(this.state) || this.state.finalPaymentCount == null
                                    ? ''
                                    : this.state.finalPaymentCount,
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="支付方式">
                              {getFieldDecorator('finalPaymentPayType', {
                                initialValue:
                                  isNil(this.state) || this.state.finalPaymentPayType == null
                                    ? ''
                                    : this.state.finalPaymentPayType == '1'
                                    ? '支付宝'
                                    : this.state.finalPaymentPayType == '2'
                                    ? '微信'
                                    : this.state.finalPaymentPayType == '3'
                                    ? '公司转账'
                                    : '线下支付',
                                rules: [],
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="费用类型">
                              {getFieldDecorator('orderNumber', {
                                initialValue:
                                  isNil(this.state) || this.state.orderNumber == null
                                    ? ''
                                    : this.state.orderNumber,
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="支付编号">
                              {getFieldDecorator('contractMoney', {
                                initialValue:
                                  isNil(this.state) || this.state.contractMoney == null
                                    ? ''
                                    : this.state.contractMoney,
                                rules: [],
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="支付时间">
                              {getFieldDecorator('balanceDate', {
                                initialValue:
                                  isNil(this.state) || this.state.balanceDate == null
                                    ? ''
                                    : this.state.balanceDate,
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="是否需开发票">
                              {getFieldDecorator('contractMoney', {
                                initialValue:
                                  isNil(this.state) || this.state.contractMoney == null
                                    ? ''
                                    : this.state.contractMoney,
                                rules: [],
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    </Card>
                  </div>
                ) : null}
                {/* 货主定金支付 */}
                <div className={commonCss.title}>
                  <span className={commonCss.text}>
                    {formatMessage({ id: 'OrderManagement-MyOrderView.payed' })}
                  </span>
                  <div style={{ position: 'absolute', right: '70px', top: 0 }}>
                    <ButtonOptionComponent
                      disabled={false}
                      type="OrderView"
                      text={formatMessage({ id: 'OrderManagement-InformationOfflinePay.view' })}
                      event={() => {
                        this.setState({ OrderShow: false, XxzfShow: true });
                      }}
                    />
                    <ButtonOptionComponent
                      disabled={false}
                      type="OrderView"
                      text={formatMessage({ id: 'OrderManagement-Invoicing.view' })}
                      event={() => {
                        this.setState({ OrderShow: false, KpxxShow: true });
                      }}
                    />
                  </div>
                </div>
                <Card bordered={false}>
                  <Form labelAlign="left">
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="订单编号">
                          {getFieldDecorator('orderNumber', {
                            initialValue:
                              isNil(this.state) || this.state.orderNumber == null
                                ? ''
                                : this.state.orderNumber,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="下单时间">
                          {getFieldDecorator('orderCreateDate', {
                            initialValue:
                              isNil(this.state) || this.state.orderCreateDate == null
                                ? ''
                                : this.state.orderCreateDate,
                            rules: [],
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="航运费">
                          {getFieldDecorator('palletMoneySum', {
                            initialValue:
                              isNil(this.state) || this.state.palletMoneySum == null
                                ? ''
                                : this.state.palletMoneySum,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="订单预估总金额">
                          {getFieldDecorator('palletMoneySum', {
                            initialValue:
                              isNil(this.state) || this.state.palletMoneySum == null
                                ? ''
                                : this.state.palletMoneySum,
                            rules: [],
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="订单状态">
                          {getFieldDecorator('orderNumber', {
                            initialValue:
                              isNil(this.state) || this.state.orderNumber == null
                                ? ''
                                : this.state.orderNumber,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="支付状态">
                          {getFieldDecorator('contractMoney', {
                            initialValue:
                              isNil(this.state) || this.state.contractMoney == null
                                ? ''
                                : this.state.contractMoney,
                            rules: [],
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
                {/* 船东履约金支付 */}
                <div className={commonCss.title}>
                  <span className={commonCss.text}>
                    {formatMessage({ id: 'OrderManagement-Performance.payed' })}
                  </span>
                </div>
                <Card bordered={false}>
                  <Form labelAlign="left">
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="订单编号">
                          {getFieldDecorator('orderNumber', {
                            initialValue:
                              isNil(this.state) || this.state.orderNumber == null
                                ? ''
                                : this.state.orderNumber,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="下单时间">
                          {getFieldDecorator('orderCreateDate', {
                            initialValue:
                              isNil(this.state) || this.state.orderCreateDate == null
                                ? ''
                                : this.state.orderCreateDate,
                            rules: [],
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="航运费">
                          {getFieldDecorator('palletMoneySum', {
                            initialValue:
                              isNil(this.state) || this.state.palletMoneySum == null
                                ? ''
                                : this.state.palletMoneySum,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="订单预估总金额">
                          {getFieldDecorator('palletMoneySum', {
                            initialValue:
                              isNil(this.state) || this.state.palletMoneySum == null
                                ? ''
                                : this.state.palletMoneySum,
                            rules: [],
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="订单状态">
                          {getFieldDecorator('orderNumber', {
                            initialValue:
                              isNil(this.state) || this.state.orderNumber == null
                                ? ''
                                : this.state.orderNumber,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="支付状态">
                          {getFieldDecorator('contractMoney', {
                            initialValue:
                              isNil(this.state) || this.state.contractMoney == null
                                ? ''
                                : this.state.contractMoney,
                            rules: [],
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* 船东履约金支付:退款支付编号 */}
                    {this.state.current !== 1 ? (
                      <div>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="退款时间">
                              {getFieldDecorator('palletMoneySum', {
                                initialValue:
                                  isNil(this.state) || this.state.palletMoneySum == null
                                    ? ''
                                    : this.state.palletMoneySum,
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="退款支付编号">
                              {getFieldDecorator('contractMoney', {
                                initialValue:
                                  isNil(this.state) || this.state.contractMoney == null
                                    ? ''
                                    : this.state.contractMoney,
                                rules: [],
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                  </Form>
                </Card>
              </div>
            ) : null}
            {/* 运输需求 */}
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-MyOrder.Transportation' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="货物编号">
                      {getFieldDecorator('palletNumber', {
                        initialValue:
                          isNil(this.state) || this.state.palletNumber == null
                            ? ''
                            : this.state.palletNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="货物名称">
                      {getFieldDecorator('goodsName', {
                        initialValue:
                          isNil(this.state) || this.state.goodsName == null
                            ? ''
                            : this.state.goodsName,
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="货物重量">
                      {getFieldDecorator('goodsWeight', {
                        initialValue:
                          isNil(this.state) || this.state.goodsWeight == null
                            ? ''
                            : this.state.goodsWeight + '-' + this.state.goodsMaxWeight,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="起始港">
                      {getFieldDecorator('palletStartPortName', {
                        initialValue:
                          isNil(this.state) || this.state.palletStartPortName == null
                            ? ''
                            : this.state.palletStartPortName,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="装货日期">
                      {getFieldDecorator('loadDate', {
                        initialValue:
                          isNil(this.state) || this.state.loadDate == null
                            ? ''
                            : this.state.loadDate + '-' + this.state.endDate,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="目的港">
                      {getFieldDecorator('palletDestinationPortName', {
                        initialValue:
                          isNil(this.state) || this.state.palletDestinationPortName == null
                            ? ''
                            : this.state.palletDestinationPortName,
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="所需船舶吨位">
                      {getFieldDecorator('weightMin', {
                        initialValue:
                          isNil(this.state) || this.state.weightMin == null
                            ? ''
                            : this.state.weightMin + '-' + this.state.weightMax,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="超期费">
                      {getFieldDecorator('overdueFee', {
                        initialValue:
                          isNil(this.state) || this.state.overdueFee == null
                            ? ''
                            : this.state.overdueFee,
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="装卸天数">
                      {getFieldDecorator('shipLoadUnloadDay', {
                        initialValue:
                          isNil(this.state) || this.state.shipLoadUnloadDay == null
                            ? ''
                            : this.state.shipLoadUnloadDay,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="运费结算">
                      {getFieldDecorator('freightType', {
                        initialValue:
                          isNil(this.state) || this.state.freightType == null
                            ? ''
                            : this.state.freightType == '1'
                            ? '有定金'
                            : this.state.freightType == '2'
                            ? '卸钱付清'
                            : '既有定金又卸前付清',
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="公司名称">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="联系人">
                      {getFieldDecorator('contractMoney', {
                        initialValue:
                          isNil(this.state) || this.state.contractMoney == null
                            ? ''
                            : this.state.contractMoney,
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="用户名">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="联系方式">
                      {getFieldDecorator('contractMoney', {
                        initialValue:
                          isNil(this.state) || this.state.contractMoney == null
                            ? ''
                            : this.state.contractMoney,
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="备注">
                      {getFieldDecorator('remark', {
                        initialValue:
                          isNil(this.state) || this.state.remark == null ? '' : this.state.remark,
                      })(
                        <Input.TextArea
                          maxLength={300}
                          style={{ width: '100%', height: '100px' }}
                          disabled={true}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            {/* 承运信息 */}
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-MyOrder.CarrierInformation' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="公司名称">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="联系人">
                      {getFieldDecorator('contractMoney', {
                        initialValue:
                          isNil(this.state) || this.state.contractMoney == null
                            ? ''
                            : this.state.contractMoney,
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="用户名">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="联系方式">
                      {getFieldDecorator('contractMoney', {
                        initialValue:
                          isNil(this.state) || this.state.contractMoney == null
                            ? ''
                            : this.state.contractMoney,
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="船舶名称">
                      {getFieldDecorator('shipName', {
                        initialValue:
                          isNil(this.state) || this.state.shipName == null
                            ? ''
                            : this.state.shipName,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="空船港">
                      {getFieldDecorator('palletDestinationPortName', {
                        initialValue:
                          isNil(this.state) || this.state.palletDestinationPortName == null
                            ? ''
                            : this.state.palletDestinationPortName,
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="船舶类型">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="目的港">
                      {getFieldDecorator('palletDestinationPortName', {
                        initialValue:
                          isNil(this.state) || this.state.palletDestinationPortName == null
                            ? ''
                            : this.state.palletDestinationPortName,
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            {/* 合同信息 */}
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-ContactAndRecapView.viewInformation' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={3}>
                    <h3>{this.state.current == 0 ? '添加编辑合同' : '双方已签合同'}</h3>
                  </Col>
                  <Col span={3}>
                    <ButtonOptionComponent
                      disabled={false}
                      type="CloseButton"
                      text={formatMessage({
                        id:
                          this.state.current == 0
                            ? 'OrderManagement-ContactAndRecapView.AddEdit'
                            : 'OrderManagement-ContactAndRecapView.view',
                      })}
                      event={() => {
                        this.setState({ OrderShow: false, DzhtShow: true });
                      }}
                    />
                  </Col>
                </Row>
              </Form>
            </Card>
            {/* 客服备注 */}
            <div className={commonCss.title}>
              <span className={commonCss.text}>{'客服备注'}</span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...formItemLayout} label="备注">
                      <Input.TextArea
                        maxLength={300}
                        style={{ width: '100%', height: '100px' }}
                        value={
                          isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                        }
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
            {/* 底部按钮 */}
            <Card bordered={false}>
              <Row className={commonCss.rowTop}>
                <Col
                  span={this.state.current == 3 ? 10 : 12}
                  className={commonCss.lastButtonAlignRight}
                >
                  <ButtonOptionComponent
                    disabled={false}
                    type="CloseButton"
                    text={formatMessage({ id: 'OrderManagement-MyOrder.save' })}
                    event={() => {
                      this.setState({ OrderShow: true, current: this.state.current + 1 });
                    }}
                  />
                </Col>
                <Col span={3} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    disabled={false}
                    type="Save"
                    text={formatMessage({ id: 'OrderManagement-MyOrder.close' })}
                    event={() => {
                      this.onBack();
                    }}
                  />
                </Col>
                {this.state.current == 3 ? (
                  <Col span={3} className={commonCss.lastButtonAlignRight}>
                    <ButtonOptionComponent
                      disabled={false}
                      type="Save"
                      text={'跳转设置'}
                      event={() => {
                        this.setState({ OrderShow: false, TzShow: true });
                      }}
                    />
                  </Col>
                ) : null}
              </Row>
            </Card>
          </div>
        ) : null}

        {/* 查看电子合同 */}
        {!isNil(this.state) && !this.state.OrderShow && this.state.DzhtShow ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-ContactAndRecapView.view' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form style={{ height: 200 }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="合同标题">
                      {getFieldDecorator('ContractTitle', {
                        initialValue:
                          isNil(this.state) || this.state.ContractTitle == null
                            ? ''
                            : this.state.ContractTitle,
                      })(<Input disabled={this.state.htEdit} />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item {...formItemLayout} label="合同模板内容">
                      <div
                        data-testid="editor-container"
                        style={{ border: '1px solid #ccc', marginTop: '10px' }}
                      >
                        {/* 渲染 toolbar */}
                        <Toolbar
                          editor={this.state.editor}
                          defaultConfig={toolbarConfig}
                          style={{ borderBottom: '1px solid #ccc' }}
                        />
                        {/* 渲染 editor */}
                        <Editor
                          defaultConfig={editorConfig}
                          defaultContent={defaultContent}
                          // defaultHtml={defaultHtml}
                          mode="default"
                          style={{ height: '500px' }}
                        />
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card bordered={false}>
              <Row className={commonCss.rowTop}>
                <Col
                  span={this.state.current == 0 ? 12 : 14}
                  pull={1}
                  className={commonCss.lastButtonAlignRight}
                >
                  {this.state.htEdit ? (
                    <ButtonOptionComponent
                      disabled={false}
                      type="Save"
                      text={formatMessage({ id: 'OrderManagement-MyOrderView.close' })}
                      event={() => {
                        this.setState({ OrderShow: true, DzhtShow: false, editor: null });
                      }}
                    />
                  ) : null}
                </Col>
                <Col span={12}>
                  {this.state.current == 0 ? (
                    <ButtonOptionComponent
                      disabled={false}
                      type="CloseButton"
                      text={this.state.htEdit ? '修改合同' : '确认提交'}
                      event={() => {
                        const { editor } = this.state;
                        if (editor == null) null;
                        if (editor.getConfig().readOnly) {
                          editor.enable();
                        } else {
                          editor.disable();
                        }
                        this.setState({ OrderShow: false, htEdit: !this.state.htEdit });
                      }}
                    />
                  ) : null}
                </Col>
              </Row>
            </Card>
          </div>
        ) : null}

        {/* 查看线下支付流水单 */}
        {!isNil(this.state) && !this.state.OrderShow && this.state.XxzfShow ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-InformationOfflinePay.view' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form style={{ height: 200 }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付方式">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="收款公司名称">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="已支付金额">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="开户银行">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="费用类型">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="收款银行账号">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="查看流水单">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(
                        <div>
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
                          {/* <img
                            alt=""
                            style={{ width: '200px', height: '200px' }}
                            src={
                              isNil(this.state) || isNil(this.state.fileName)
                                ? ''
                                : this.state.logoUrl + this.state.fileName
                            }
                            onClick={() => {
                              this.showModal(
                                isNil(this.state) || isNil(this.state.fileName)
                                  ? ''
                                  : this.state.logoUrl + this.state.fileName,
                              );
                            }}
                          /> */}
                        </div>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card bordered={false}>
              <Row className={commonCss.rowTop}>
                <Col span={12} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    disabled={false}
                    type="Save"
                    text={formatMessage({ id: 'OrderManagement-MyOrder.close' })}
                    event={() => {
                      this.setState({ OrderShow: true, XxzfShow: false });
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        ) : null}

        {/* 查看开票信息 */}
        {!isNil(this.state) && !this.state.OrderShow && this.state.KpxxShow ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{'客户填写开票需求'}</span>
            </div>
            <Card bordered={false}>
              <Form style={{ height: 200 }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="发票类型">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="收票人姓名">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="发票抬头">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="收票人手机">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="纳税人识别码">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="发票内容">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付类型">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="收票人地址">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input.TextArea style={{ width: '300px', height: '80px' }} disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Divider dashed={true} />
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="发票类型">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="收票人姓名">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="发票抬头">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="收票人手机">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="纳税人识别码">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="发票内容">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付类型">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="收票人地址">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input.TextArea style={{ width: '300px', height: '80px' }} disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card bordered={false}>
              <Row className={commonCss.rowTop}>
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    disabled={false}
                    type="Save"
                    text={formatMessage({ id: 'OrderManagement-MyOrder.close' })}
                    event={() => {
                      this.setState({ OrderShow: true, KpxxShow: false });
                    }}
                  />
                </Col>
                <Col span={12}>
                  <ButtonOptionComponent
                    disabled={false}
                    type="CloseButton"
                    text={'导出开票信息'}
                    event={() => {
                      this.setState({ OrderShow: false });
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        ) : null}

        {/* 修改支付信息 */}
        {!isNil(this.state) && !this.state.OrderShow && this.state.ZfxxShow ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{'修改支付信息'}</span>
            </div>
            <Card bordered={false}>
              <Form style={{ height: 200 }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付截至时间">
                      <DatePicker />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="需支付金额">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card bordered={false}>
              <Row className={commonCss.rowTop}>
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    disabled={false}
                    type="Save"
                    text={'上一步'}
                    event={() => {
                      this.setState({ OrderShow: true, ZfxxShow: false });
                    }}
                  />
                </Col>
                <Col span={12}>
                  <ButtonOptionComponent
                    disabled={false}
                    type="CloseButton"
                    text={formatMessage({ id: 'OrderManagement-MyOrder.save' })}
                    event={() => {
                      this.setState({ OrderShow: false });
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        ) : null}

        {/* 修改总收益 */}
        {!isNil(this.state) && !this.state.OrderShow && this.state.ZsyShow ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-MyOrder.fix.voyageMoneySum' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form style={{ height: 200 }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="货主支付定金">
                      {getFieldDecorator('depositCount', {
                        initialValue:
                          isNil(this.state) || this.state.depositCount == null
                            ? ''
                            : this.state.depositCount,
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="货主支付尾款">
                      {getFieldDecorator('finalPaymentCount', {
                        initialValue:
                          isNil(this.state) || this.state.finalPaymentCount == null
                            ? ''
                            : this.state.finalPaymentCount,
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="平台服务费">
                      {getFieldDecorator('dyServiceCharge', {
                        initialValue:
                          isNil(this.state) || this.state.dyServiceCharge == null
                            ? ''
                            : this.state.dyServiceCharge,
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="船东总收益">
                      {getFieldDecorator('voyageMoneySum', {
                        initialValue:
                          isNil(this.state) || this.state.voyageMoneySum == null
                            ? ''
                            : this.state.voyageMoneySum,
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card bordered={false}>
              <Row className={commonCss.rowTop}>
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    disabled={false}
                    type="Save"
                    text={'上一步'}
                    event={() => {
                      this.setState({ OrderShow: true, ZsyShow: false });
                    }}
                  />
                </Col>
                <Col span={12}>
                  <ButtonOptionComponent
                    disabled={false}
                    type="CloseButton"
                    text={formatMessage({ id: 'OrderManagement-MyOrder.save' })}
                    event={() => {
                      this.setState({ OrderShow: false });
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        ) : null}

        {/* 跳转设置 */}
        {!isNil(this.state) && !this.state.OrderShow && this.state.TzShow ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{'货主船东跳转设置'}</span>
            </div>
            <Card bordered={false}>
              <Form style={{ height: 200 }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="货主跳转设置">
                      <Select
                        optionFilterProp="children"
                        onSelect={() => {
                          console.log('货主跳转设置');
                        }}
                        defaultValue={'请选择跳转页'}
                      >
                        <Select.Option value="请选择跳转页">请选择跳转页</Select.Option>
                        <Select.Option value="已支付尾款详情">已支付尾款详情</Select.Option>
                        <Select.Option value="交易完成-确认收货">交易完成-确认收货</Select.Option>
                        <Select.Option value="交易完成-待评价">交易完成-待评价</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="船东跳转设置">
                      <Select
                        optionFilterProp="children"
                        onSelect={() => {
                          console.log('船东跳转设置');
                        }}
                        defaultValue={'请选择跳转页'}
                      >
                        <Select.Option value="请选择跳转页">请选择跳转页</Select.Option>
                        <Select.Option value="货主已支付尾款">货主已支付尾款</Select.Option>
                        <Select.Option value="交易完成">交易完成</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card bordered={false}>
              <Row className={commonCss.rowTop}>
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    disabled={false}
                    type="Save"
                    text={'上一步'}
                    event={() => {
                      this.setState({ OrderShow: true, TzShow: false });
                    }}
                  />
                </Col>
                <Col span={12}>
                  <ButtonOptionComponent
                    disabled={false}
                    type="CloseButton"
                    text={formatMessage({ id: 'OrderManagement-MyOrder.save' })}
                    event={() => {
                      this.setState({ OrderShow: false });
                    }}
                  />
                </Col>
              </Row>
            </Card>
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
                    {/* <img
                      alt="无"
                      style={{ width: '25%' }}
                      src={
                        isNil(this.state) || isNil(this.state.fileName)
                          ? ''
                          : this.state.logoUrl + this.state.fileName
                      }
                      onClick={() => {
                        this.showModal(
                          isNil(this.state) || isNil(this.state.fileName)
                            ? ''
                            : this.state.logoUrl + this.state.fileName,
                        );
                      }}
                    /> */}
                  </Col>
                  <Col span={16}></Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}
        {/* 图片放大 */}
        <Modal
          className="picModal"
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
          <a
            onClick={() =>
              linkHref(
                isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage,
              )
            }
          >
            查看原图
          </a>
        </Modal>
      </div>
    );
  }
}

const MyOrderView_Form = Form.create({ name: 'MyOrderView_Form' })(MyOrderView);

export default MyOrderView_Form;
