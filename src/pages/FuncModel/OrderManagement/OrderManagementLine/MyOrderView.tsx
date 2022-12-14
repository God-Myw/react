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
            freightType: data.freightType, //1?????????2????????????3???????????????????????????
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
            finalPaymentPayType: data.finalPaymentPayType, //1????????????2?????????3???????????????4????????????
            finishDate: data.finishDate,
            finishVDate: data.finishVDate,
            palletMoneySum: data.palletMoneySum,
            voyageMoneySum: data.voyageMoneySum,
          });
        }
      }
    });
  };
  // ?????????????????????
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
          '&', //BUG131??????
        picParams,
        (response: any) => {
          if (response.status === 200) {
            if (attachment.fileLog == '21') {
              //????????????
              this.setState({
                settlementFile: [
                  {
                    uid: index,
                    name: response.data[0].fileName,
                    status: 'done',
                    thumbUrl: response.data[0].base64,
                    type: attachment.fileType, //BUG131??????
                  },
                ],
              });
            } else if (attachment.fileLog == '15') {
              //????????????
              this.setState({
                tailFile: [
                  {
                    uid: index,
                    name: response.data[0].fileName,
                    status: 'done',
                    thumbUrl: response.data[0].base64,
                    type: attachment.fileType, //BUG131??????
                  },
                ],
              });
            } else if (attachment.fileLog == '14') {
              //????????????
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
              //????????????
              let fileList: FileMsg = {};
              fileList.uid = index;
              fileList.name = response.data[0].fileName;
              fileList.status = 'done';
              fileList.thumbUrl = response.data[0].base64;
              fileList.type = attachment.fileType; //BUG131??????
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
              fileList.type = attachment.fileType; //BUG131??????
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

  // ??????
  onBack = () => {
    if (this.userType == '1') {
      this.props.history.push('/orderManagementON/list');
    } else if (this.userType == '2') {
      this.props.history.push('/orderManagementOff/list');
    } else {
      this.props.history.push('/orderManagementExamine/list');
    }
  };

  //???????????????
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
    //       //?????????????????????data???????????????
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
    //           attachments: response.data.attachments ? response.data.attachments : null, //??????
    //           depositAttachment: response.data.depositAttachment
    //             ? response.data.depositAttachment.fileName
    //             : '', //????????????
    //         });
    //         if (!isNil(response.data.attachments) && response.data.attachments.length != 0) {
    //           const contactFileArr = filter(response.data.attachments, { fileLog: 11 });
    //           const documentsFileArr = filter(response.data.attachments, { fileLog: 12 });
    //           //???????????????????????????
    //           this.getFileDownLoad(contactFileArr, fileType.ship_agreement);
    //           //???????????????????????????
    //           this.getFileDownLoad(documentsFileArr, fileType.ship_document);
    //         }
    //         //???????????????????????????
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
    //       //?????????????????????data???????????????
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
    //         //??????????????????
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
    //       //?????????????????????data???????????????
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
    //         //???????????????????????????
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
    //       //?????????????????????data???????????????
    //       if (!isNil(response.data)) {
    //         this.setState({
    //           sceneState: current + 1,
    //           current: current,
    //         });
    //         //???????????????????????????
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

  //??????????????????
  changeOrderStatus = (e: any) => {
    let guid = this.props.match.params['guid'];
    let param = { type: 3, guid: guid };
    confirm({
      title: '?????????????????????????',
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        putRequest('/business/order/billReview', JSON.stringify(param), (response: any) => {
          if (response.status === 200) {
            this.setState({
              sceneState: 4,
              currentState: 4,
              current: 3,
              orderStatus: 1,
            });
            message.success('?????????????????????', 2);
          }
        });
      },
    });
  };

  //??????????????????
  changeDeliveryStatus = (e: any) => {
    let guid = this.props.match.params['guid'];
    let param = { type: 1, guid: guid };
    confirm({
      title: '?????????????????????????',
      okText: '??????',
      cancelText: '??????',
      onOk: () => {
        putRequest('/business/order/billReview', JSON.stringify(param), (response: any) => {
          if (response.status === 200) {
            this.setState({
              sceneState: 3,
              currentState: 3,
              current: 2,
              deliverStatus: 1,
            });
            message.success('?????????????????????', 2);
          }
        });
      },
    });
  };

  //????????????
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  // ????????????

  handlePreview = async (type: any, file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.name);
    getRequest('/sys/file/getImageBase64/' + file.type, params, (response: any) => {
      //BUG131??????
      this.setState({
        previewImage: response.data.file.base64,
        previewVisible: true,
      });
    });
  };
  // ????????????
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
      // ????????? toolbarKeys: [...]
    };
    const editorConfig: Partial<IEditorConfig> = {
      placeholder: '???????????????...',
      readOnly: true,
      onCreated: (editor: IDomEditor) => {
        this.setState({ editor });
      },
      onChange: (editor: IDomEditor) => {
        this.setState({ curContent: editor.children });
      },
    };
    // ????????????????????????~
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
        {/* suffix="???" */}

        {/*????????????-????????????*/}
        {!isNil(this.state) && this.state.OrderShow ? (
          <div className={commonCss.container}>
            {/* ???????????? */}
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-OrderMsg.orderinformation' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
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
                    <Form.Item {...formlayout} label="?????????">
                      {getFieldDecorator('chargeTtypeValue', {
                        initialValue:
                          isNil(this.state) || this.state.chargeTtypeValue == null
                            ? ''
                            : this.state.chargeTtypeValue,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="?????????????????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
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
                {/* ?????????????????? */}
                {this.state.current !== 0 && this.state.current !== 1 ? (
                  <div>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="??????????????????">
                          {getFieldDecorator('orderNumber', {
                            initialValue:
                              isNil(this.state) || this.state.orderNumber == null
                                ? ''
                                : this.state.orderNumber,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="?????????????????????">
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
            {/* ???????????? */}
            {this.state.current !== 0 ? (
              <div>
                {this.state.current !== 1 && this.state.current !== 2 ? (
                  <div>
                    {this.state.current !== 3 ? (
                      <div>
                        {/* ????????????????????? */}
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
                                <Form.Item {...formlayout} label="??????????????????">
                                  {getFieldDecorator('depositCount', {
                                    initialValue:
                                      isNil(this.state) || this.state.depositCount == null
                                        ? ''
                                        : this.state.depositCount,
                                  })(<Input disabled />)}
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item {...formlayout} label="???????????????">
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
                                <Form.Item {...formlayout} label="??????????????????">
                                  {getFieldDecorator('finalPaymentCount', {
                                    initialValue:
                                      isNil(this.state) || this.state.finalPaymentCount == null
                                        ? ''
                                        : this.state.finalPaymentCount,
                                  })(<Input disabled />)}
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item {...formlayout} label="???????????????">
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
                                <Form.Item {...formlayout} label="??????????????????">
                                  {getFieldDecorator('orderFinishDate', {
                                    initialValue:
                                      isNil(this.state) || this.state.orderFinishDate == null
                                        ? ''
                                        : this.state.orderFinishDate,
                                  })(<Input disabled />)}
                                </Form.Item>
                              </Col>
                              <Col span={12}>
                                <Form.Item {...formlayout} label="??????????????????">
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
                    {/* ?????????????????? */}
                    <div className={commonCss.title}>
                      <span className={commonCss.text}>
                        {formatMessage({ id: 'OrderManagement-MyOrderView.final.payment' })}
                      </span>
                      <div style={{ position: 'absolute', right: '70px', top: 0 }}>
                        <ButtonOptionComponent
                          disabled={false}
                          type="OrderView"
                          text={'??????????????????'}
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
                            <Form.Item {...formlayout} label="????????????">
                              {getFieldDecorator('finalPaymentCount', {
                                initialValue:
                                  isNil(this.state) || this.state.finalPaymentCount == null
                                    ? ''
                                    : this.state.finalPaymentCount,
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="????????????">
                              {getFieldDecorator('finalPaymentPayType', {
                                initialValue:
                                  isNil(this.state) || this.state.finalPaymentPayType == null
                                    ? ''
                                    : this.state.finalPaymentPayType == '1'
                                    ? '?????????'
                                    : this.state.finalPaymentPayType == '2'
                                    ? '??????'
                                    : this.state.finalPaymentPayType == '3'
                                    ? '????????????'
                                    : '????????????',
                                rules: [],
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="????????????">
                              {getFieldDecorator('orderNumber', {
                                initialValue:
                                  isNil(this.state) || this.state.orderNumber == null
                                    ? ''
                                    : this.state.orderNumber,
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="????????????">
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
                            <Form.Item {...formlayout} label="????????????">
                              {getFieldDecorator('balanceDate', {
                                initialValue:
                                  isNil(this.state) || this.state.balanceDate == null
                                    ? ''
                                    : this.state.balanceDate,
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="??????????????????">
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
                {/* ?????????????????? */}
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
                        <Form.Item {...formlayout} label="????????????">
                          {getFieldDecorator('orderNumber', {
                            initialValue:
                              isNil(this.state) || this.state.orderNumber == null
                                ? ''
                                : this.state.orderNumber,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="????????????">
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
                        <Form.Item {...formlayout} label="?????????">
                          {getFieldDecorator('palletMoneySum', {
                            initialValue:
                              isNil(this.state) || this.state.palletMoneySum == null
                                ? ''
                                : this.state.palletMoneySum,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="?????????????????????">
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
                        <Form.Item {...formlayout} label="????????????">
                          {getFieldDecorator('orderNumber', {
                            initialValue:
                              isNil(this.state) || this.state.orderNumber == null
                                ? ''
                                : this.state.orderNumber,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="????????????">
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
                {/* ????????????????????? */}
                <div className={commonCss.title}>
                  <span className={commonCss.text}>
                    {formatMessage({ id: 'OrderManagement-Performance.payed' })}
                  </span>
                </div>
                <Card bordered={false}>
                  <Form labelAlign="left">
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="????????????">
                          {getFieldDecorator('orderNumber', {
                            initialValue:
                              isNil(this.state) || this.state.orderNumber == null
                                ? ''
                                : this.state.orderNumber,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="????????????">
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
                        <Form.Item {...formlayout} label="?????????">
                          {getFieldDecorator('palletMoneySum', {
                            initialValue:
                              isNil(this.state) || this.state.palletMoneySum == null
                                ? ''
                                : this.state.palletMoneySum,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="?????????????????????">
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
                        <Form.Item {...formlayout} label="????????????">
                          {getFieldDecorator('orderNumber', {
                            initialValue:
                              isNil(this.state) || this.state.orderNumber == null
                                ? ''
                                : this.state.orderNumber,
                          })(<Input disabled />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...formlayout} label="????????????">
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
                    {/* ?????????????????????:?????????????????? */}
                    {this.state.current !== 1 ? (
                      <div>
                        <Row gutter={24}>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="????????????">
                              {getFieldDecorator('palletMoneySum', {
                                initialValue:
                                  isNil(this.state) || this.state.palletMoneySum == null
                                    ? ''
                                    : this.state.palletMoneySum,
                              })(<Input disabled />)}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item {...formlayout} label="??????????????????">
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
            {/* ???????????? */}
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-MyOrder.Transportation' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('palletNumber', {
                        initialValue:
                          isNil(this.state) || this.state.palletNumber == null
                            ? ''
                            : this.state.palletNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('goodsWeight', {
                        initialValue:
                          isNil(this.state) || this.state.goodsWeight == null
                            ? ''
                            : this.state.goodsWeight + '-' + this.state.goodsMaxWeight,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="?????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('loadDate', {
                        initialValue:
                          isNil(this.state) || this.state.loadDate == null
                            ? ''
                            : this.state.loadDate + '-' + this.state.endDate,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="?????????">
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
                    <Form.Item {...formlayout} label="??????????????????">
                      {getFieldDecorator('weightMin', {
                        initialValue:
                          isNil(this.state) || this.state.weightMin == null
                            ? ''
                            : this.state.weightMin + '-' + this.state.weightMax,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="?????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('shipLoadUnloadDay', {
                        initialValue:
                          isNil(this.state) || this.state.shipLoadUnloadDay == null
                            ? ''
                            : this.state.shipLoadUnloadDay,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('freightType', {
                        initialValue:
                          isNil(this.state) || this.state.freightType == null
                            ? ''
                            : this.state.freightType == '1'
                            ? '?????????'
                            : this.state.freightType == '2'
                            ? '????????????'
                            : '???????????????????????????',
                        rules: [],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="?????????">
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
                    <Form.Item {...formlayout} label="?????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
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
                    <Form.Item {...formlayout} label="??????">
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
            {/* ???????????? */}
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-MyOrder.CarrierInformation' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="?????????">
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
                    <Form.Item {...formlayout} label="?????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('shipName', {
                        initialValue:
                          isNil(this.state) || this.state.shipName == null
                            ? ''
                            : this.state.shipName,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="?????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="?????????">
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
            {/* ???????????? */}
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-ContactAndRecapView.viewInformation' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={3}>
                    <h3>{this.state.current == 0 ? '??????????????????' : '??????????????????'}</h3>
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
            {/* ???????????? */}
            <div className={commonCss.title}>
              <span className={commonCss.text}>{'????????????'}</span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...formItemLayout} label="??????">
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
            {/* ???????????? */}
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
                      text={'????????????'}
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

        {/* ?????????????????? */}
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
                    <Form.Item {...formlayout} label="????????????">
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
                    <Form.Item {...formItemLayout} label="??????????????????">
                      <div
                        data-testid="editor-container"
                        style={{ border: '1px solid #ccc', marginTop: '10px' }}
                      >
                        {/* ?????? toolbar */}
                        <Toolbar
                          editor={this.state.editor}
                          defaultConfig={toolbarConfig}
                          style={{ borderBottom: '1px solid #ccc' }}
                        />
                        {/* ?????? editor */}
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
                      text={this.state.htEdit ? '????????????' : '????????????'}
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

        {/* ??????????????????????????? */}
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="??????????????????">
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
                    <Form.Item {...formlayout} label="???????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="??????????????????">
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
                    <Form.Item {...formlayout} label="????????????">
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
                    <Form.Item {...formlayout} label="???????????????">
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

        {/* ?????????????????? */}
        {!isNil(this.state) && !this.state.OrderShow && this.state.KpxxShow ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{'????????????????????????'}</span>
            </div>
            <Card bordered={false}>
              <Form style={{ height: 200 }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="???????????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="???????????????">
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
                    <Form.Item {...formlayout} label="??????????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="???????????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="???????????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="???????????????">
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
                    <Form.Item {...formlayout} label="??????????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="????????????">
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
                    <Form.Item {...formlayout} label="????????????">
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          isNil(this.state) || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="???????????????">
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
                    text={'??????????????????'}
                    event={() => {
                      this.setState({ OrderShow: false });
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        ) : null}

        {/* ?????????????????? */}
        {!isNil(this.state) && !this.state.OrderShow && this.state.ZfxxShow ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{'??????????????????'}</span>
            </div>
            <Card bordered={false}>
              <Form style={{ height: 200 }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="??????????????????">
                      <DatePicker />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="???????????????">
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
                    text={'?????????'}
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

        {/* ??????????????? */}
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
                    <Form.Item {...formlayout} label="??????????????????">
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
                    <Form.Item {...formlayout} label="??????????????????">
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
                    <Form.Item {...formlayout} label="???????????????">
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
                    <Form.Item {...formlayout} label="???????????????">
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
                    text={'?????????'}
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

        {/* ???????????? */}
        {!isNil(this.state) && !this.state.OrderShow && this.state.TzShow ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{'????????????????????????'}</span>
            </div>
            <Card bordered={false}>
              <Form style={{ height: 200 }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="??????????????????">
                      <Select
                        optionFilterProp="children"
                        onSelect={() => {
                          console.log('??????????????????');
                        }}
                        defaultValue={'??????????????????'}
                      >
                        <Select.Option value="??????????????????">??????????????????</Select.Option>
                        <Select.Option value="?????????????????????">?????????????????????</Select.Option>
                        <Select.Option value="????????????-????????????">????????????-????????????</Select.Option>
                        <Select.Option value="????????????-?????????">????????????-?????????</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="??????????????????">
                      <Select
                        optionFilterProp="children"
                        onSelect={() => {
                          console.log('??????????????????');
                        }}
                        defaultValue={'??????????????????'}
                      >
                        <Select.Option value="??????????????????">??????????????????</Select.Option>
                        <Select.Option value="?????????????????????">?????????????????????</Select.Option>
                        <Select.Option value="????????????">????????????</Select.Option>
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
                    text={'?????????'}
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

        {/*????????????*/}
        {!isNil(this.state) && this.state.sceneState == 5 ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>????????????</span>
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
                      alt="???"
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
        {/* ???????????? */}
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
            ????????????
          </a>
        </Modal>
      </div>
    );
  }
}

const MyOrderView_Form = Form.create({ name: 'MyOrderView_Form' })(MyOrderView);

export default MyOrderView_Form;
