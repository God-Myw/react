import React from 'react';
import { getRequest, postRequest, putRequest } from '@/utils/request';
import {
  Col,
  Divider,
  Row,
  Steps,
  message,
  Form,
  Typography,
  Modal,
  Upload,
  Timeline,
  Icon,
  Card,
  Input,
} from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil, forEach, filter } from 'lodash';
import commonCss from '../../../Common/css/CommonCss.less';
import ButtonOptionComponent from '../../../Common/Components/ButtonOptionComponent';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { OrderViewFormProps, FileMsg, LogisticsInfo } from '../OrderViewInterface';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import moment from 'moment';
import { linkHref } from '@/utils/utils';
import { HandleBeforeUpload } from '@/utils/validator';

const { Step } = Steps;
const { Text } = Typography;
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
    });
    //通过ID查询投保详情
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
    getRequest('/business/order/history/' + guid, params, (response: any) => {
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          this.setState({
            guid: response.data.order.guid,
            orderNumber: response.data.order.orderNumber, //订单编号
            contractMoney: response.data.order.contractMoney, //合同金额
            downpayment: response.data.order.downpayment,
            tailMoney: response.data.order.contractMoney - response.data.order.downpayment,
            createDate: response.data.order.createDate, //创建时间
          });
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
                    type: attachment.fileType, //BUG131改修
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
    if (this.userType === '5') {
      this.props.history.push('/orderManagementowner');
    } else if (this.userType === '4') {
      this.props.history.push('/orderManagement');
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
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            this.setState({
              sceneState: current + 1,
              current: current,
              orderNumber: response.data.order.orderNumber,
              contractMoney: response.data.order.contractMoney,
              downpayment: response.data.order.downpayment,
            });
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
              tailMoney: response.data.order.contractMoney - response.data.order.downpayment,
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
              orderNumber: response.data.order.orderNumber,
              contractMoney: response.data.order.contractMoney,
              downpayment: response.data.order.downpayment,
              tailMoney: response.data.order.contractMoney - response.data.order.downpayment,
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

  //取消预览
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handlePreview = async (type: any, file: any) => {
    if (file.response) {
      let params: Map<string, string> = new Map();
      params.set('fileName', file.response.data.fileName);
      getRequest('/sys/file/getImageBase64/' + file.response.data.type, params, (response: any) => {
        if (response.status === 200) {
          this.setState({
            previewImage: response.data.file.base64,
            previewVisible: true,
          });
        }
      });
    } else {
      let params: Map<string, string> = new Map();
      params.set('fileName', file.name);
      getRequest('/sys/file/getImageBase64/' + file.type, params, (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data)) {
            this.setState({
              previewImage: response.data.file.base64,
              previewVisible: true,
            });
          }
        }
      });
    }
  };

  //上传图片变更
  handleChangeEarnest = ({ fileList }: any) => {
    if (!isNil(fileList) && fileList.length > 0) {
      forEach(fileList, file => {
        if (file.status === 'done') {
          let uploadResult = [];
          let param = {};
          let guid = this.props.match.params['guid'];
          let test = {
            fileName: file.response.data.fileName,
            type: fileType.ship_front_payment_slip,
            fileLog: 14,
          };
          uploadResult.push(test);
          param = {
            type: 1,
            guid: guid,
            uploadResult: uploadResult,
          };
          // console.log(JSON.stringify(param));
          postRequest('/business/order/uploadBill', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              // let param = {type: 1,guid: guid,};
              // putRequest('/business/order/billReview', JSON.stringify(param), (response: any) => {
              //   if (response.status === 200) {
              message.success(
                formatMessage({ id: 'OrderManagement-MyOrder.deposit.submit.success' }),
                2,
              );
              //   }
              // });
            }
          });
        }
        this.setState({ earnestFile: fileList,payStatus: 1});
      });
    }
  };

  handleChangeTail = ({ fileList }: any) => {
    if (!isNil(fileList) && fileList.length > 0) {
      forEach(fileList, file => {
        if (file.status === 'done') {
          let uploadResult = [];
          let param = {};
          let guid = this.props.match.params['guid'];
          let test = {
            fileName: file.response.data.fileName,
            type: fileType.ship_final_payment_slip,
            fileLog: 15,
          };
          uploadResult.push(test);
          param = {
            type: 2,
            guid: guid,
            uploadResult: uploadResult,
          };
          postRequest('/business/order/uploadBill', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              let param = { type: 2, guid: guid };
              putRequest('/business/order/billReview', JSON.stringify(param), (response: any) => {
                if (response.status === 200) {
                  message.success(
                    formatMessage({ id: 'OrderManagement-MyOrder.final.submit.success' }),
                    2,
                  );
                }
              });
            }
          });
        }
        this.setState({ tailFile: fileList,payStatus:2 });
      });
    }
  };

  // 检查图片是否上传
  checkFileEarnest = (rule: any, val: any, callback: any) => {
    if (isNil(this.state.earnestFile) || this.state.earnestFile.length === 0) {
      callback(formatMessage({ id: 'OrderManagement-MyOrder.upload.null' }));
    } else {
      callback();
    }
  };

  checkFileTail = (rule: any, val: any, callback: any) => {
    if (isNil(this.state.tailFile) || this.state.tailFile.length === 0) {
      callback(formatMessage({ id: 'OrderManagement-MyOrder.upload.null' }));
    } else {
      callback();
    }
  };

  //删除图片
  onRemoveEarnest = () => {
    this.setState(() => ({
      earnestFile: [],
      payStatus:0
    }));
  };

  onRemoveTail = () => {
    this.setState(() => ({
      tailFile: [],
      payStatus:1
    }));
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const current = isNil(this.state) || isNil(this.state.current) ? 0 : this.state.current;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const formlayout4 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">
          <FormattedMessage id="OrderManagement-MyOrder.upload" />
        </div>
      </div>
    );

    let logisticsList =
      isNil(this.state) || isNil(this.state.logisticsInfo) ? [] : this.state.logisticsInfo;
    const elements: JSX.Element[] = [];
    forEach(logisticsList, (item: LogisticsInfo, key) => {
      if (logisticsList.length === key + 1) {
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
              <Form>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      {...formlayout}
                      label={formatMessage({ id: 'OrderManagement-MyOrder.code' })}
                    >
                      {getFieldDecorator('orderNumber', {
                        initialValue:
                          this.state == null || this.state.orderNumber == null
                            ? ''
                            : this.state.orderNumber,
                        rules: [{ required: true }],
                      })(<Input disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...formlayout}
                      label={formatMessage({ id: 'OrderManagement-MyOrder.total' })}
                    >
                      {getFieldDecorator('contractMoney', {
                        initialValue:
                          this.state == null || this.state.contractMoney == null
                            ? ''
                            : '￥' + this.state.contractMoney,
                        rules: [{ required: true }],
                      })(<Input style={{ color: 'red' }} disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={8}></Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/* 查看合同&Recap信息 */}
        {!isNil(this.state) && this.state.sceneState == 2 ? (
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
                        data={{ type: 1 }}
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
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/*单证信息*/}
        {!isNil(this.state) && this.state.sceneState == 2 && this.userType == '5' ? (
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
                        data={{ type: 1 }}
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
        {!isNil(this.state) &&
        this.state.sceneState == 2 &&
        this.state.payStatus == 0 &&
        this.state.deliverStatus != 1 &&
        this.userType == '5' ? (
          <div className={commonCss.container}>
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
                      <Text style={{ color: 'red' }}>
                        <FormattedMessage id="OrderManagement-MyOrder.wait.upload.deposit" />
                      </Text>
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
        (this.state.payStatus == 0 || this.state.payStatus == 1) &&
        this.state.deliverStatus != 1 &&
        this.userType == '4' ? (
          <div className={commonCss.container}>
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
                      <Text style={{ color: 'red' }}>
                        {!isNil(this.state) && this.state.payStatus == 1
                          ? ''
                          : formatMessage({ id: 'OrderManagement-MyOrder.upload.deposit' })}
                      </Text>
                    </Form.Item>
                  </Col>
                  <Col span={16}></Col>
                </Row>
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Form.Item {...formlayout} label="">
                      {getFieldDecorator(`earnestPic`, {
                        rules: [{ validator: this.checkFileEarnest.bind(this) }],
                      })(
                        <Upload
                          action={'/api/sys/file/upload/' + fileType.ship_front_payment_slip}
                          listType="picture-card"
                          accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                          beforeUpload={HandleBeforeUpload.bind(this)}
                          headers={{ token: String(localStorage.getItem('token')) }}
                          showUploadList={{
                            showPreviewIcon: true,
                            showDownloadIcon: false,
                            showRemoveIcon: true,
                          }}
                          fileList={
                            isNil(this.state) ||
                            isNil(this.state.earnestFile) ||
                            this.state.earnestFile.length == 0
                              ? ''
                              : this.state.earnestFile
                          }
                          onPreview={this.handlePreview.bind(
                            this,
                            fileType.ship_front_payment_slip,
                          )}
                          onChange={this.handleChangeEarnest}
                          onRemove={this.onRemoveEarnest}
                        >
                          {isNil(this.state) ||
                          isNil(this.state.earnestFile) ||
                          this.state.earnestFile.length == 0
                            ? uploadButton
                            : null}
                        </Upload>,
                      )}
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
        this.state.payStatus != 0 &&
        ((this.state.deliverStatus == 1 && this.userType == '4') 
        || this.userType == '5') ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-PayMsg.payment.information' })}
              </span>
            </div>
            <Card bordered={false}>
              <Form>
                {(this.userType == '4')?(
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
                      onPreview={this.handlePreview.bind(this, fileType.ship_front_payment_slip)}
                    ></Upload>
                  </Col>
                  <Col span={16}></Col>
                </Row>):null}
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                  
                  {(this.userType == '4')?(
                    <Form.Item
                      {...formlayout4}
                      label={formatMessage({ id: 'OrderManagement-PayMsg.payed.deposit' })}
                    >
                      {getFieldDecorator('downpayment', {
                        initialValue:
                          this.state == null || this.state.downpayment == null
                            ? ''
                            : '￥' + this.state.downpayment,
                        rules: [{ required: true }],
                      })(<Input style={{ color: 'red' }} disabled />)}

                    </Form.Item>
                  ):
                  (<label style={{ color: 'black' }} >{formatMessage({ id: 'OrderManagement-PayMsg.payed.deposit' }).replace(/：/,'')}</label>)
                  }

                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {!isNil(this.state) &&
        this.state.sceneState == 4 &&
        this.state.payStatus == 1 &&
        this.state.orderStatus != 2 &&
        this.userType == '5' ? (
          <div className={commonCss.container}>
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
                      <Text style={{ color: 'red' }}>
                        <FormattedMessage id="OrderManagement-MyOrder.wait.upload.final" />
                      </Text>
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
        this.state.sceneState == 4 &&
        (this.state.payStatus == 1 || this.state.payStatus == 2) &&
        this.state.orderStatus != 2 &&
        this.userType == '4' ? (
          <div className={commonCss.container}>
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
                      <Text style={{ color: 'red' }}>
                        {!isNil(this.state) && this.state.payStatus == 2
                          ? ''
                          : formatMessage({ id: 'OrderManagement-MyOrder.upload.final' })}
                      </Text>
                    </Form.Item>
                  </Col>
                  <Col span={16}></Col>
                </Row>
                <Row gutter={24} style={{ marginBottom: '1%' }}>
                  <Col span={8}>
                    <Form.Item {...formlayout} label="">
                      {getFieldDecorator(`tailPic`, {
                        rules: [{ validator: this.checkFileTail.bind(this) }],
                      })(
                        <Upload
                          action={'/api/sys/file/upload/' + fileType.ship_final_payment_slip}
                          listType="picture-card"
                          accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                          beforeUpload={HandleBeforeUpload.bind(this)}
                          headers={{ token: String(localStorage.getItem('token')) }}
                          showUploadList={{
                            showPreviewIcon: true,
                            showDownloadIcon: false,
                            showRemoveIcon: true,
                          }}
                          fileList={
                            isNil(this.state) ||
                            isNil(this.state.tailFile) ||
                            this.state.tailFile.length == 0
                              ? ''
                              : this.state.tailFile
                          }
                          onPreview={this.handlePreview.bind(
                            this,
                            fileType.ship_final_payment_slip,
                          )}
                          onChange={this.handleChangeTail}
                          onRemove={this.onRemoveTail}
                        >
                          {isNil(this.state) ||
                          isNil(this.state.tailFile) ||
                          this.state.tailFile.length == 0
                            ? uploadButton
                            : null}
                        </Upload>,
                      )}
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
        this.state.sceneState == 4 &&
        this.state.payStatus == 2 &&
        ((this.state.orderStatus == 2 && this.userType == '4') || this.userType == '5') ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                {formatMessage({ id: 'OrderManagement-PayMsg.payment.information' })}
              </span>
            </div>
            <Card bordered={false}>
            {(this.userType == '4')?(
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
                          this.state == null || this.state.downpayment == null
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
                      label={formatMessage({ id: 'OrderManagement-PayMsg.payed.final.payment' })}
                    >
                      {getFieldDecorator('tailMoney', {
                        initialValue:
                          this.state == null || this.state.tailMoney == null
                            ? ''
                            : '￥' + this.state.tailMoney,
                        rules: [{ required: true }],
                      })(<Input style={{ color: 'red' }} disabled />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>):
              (<label style={{ color: 'black' }} >{formatMessage({ id: 'OrderManagement-PayMsg.payed.final.payment' }).replace(/:/,'')}</label>)}
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/*物流信息 */}
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
        {!isNil(this.state) && this.state.sceneState == 5 && this.userType == '5' ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>
                <FormattedMessage id="OrderManagement-MyOrder.close.information" />
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
                        isNil(this.state.settlementFile) ||
                        this.state.settlementFile.length == 0
                          ? ''
                          : this.state.settlementFile
                      }
                      onPreview={this.handlePreview.bind(this, fileType.ship_settle)}
                    ></Upload>
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
