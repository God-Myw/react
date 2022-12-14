import HrComponent from '@/pages/Common/Components/HrComponent';
import { getRequest, postRequest } from '@/utils/request';
import { Col, Form, Icon, Input, message, Modal, Row, Upload } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { filter, forEach, isNil } from 'lodash';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { FileModel } from './FileModel';
import GoodsListForm from '../Advanceorder/GoodsList';
import ShipForm from '../Advanceorder/Ship';
import SubmissionFormProps, { Attachments } from './SubmissionFormInterface';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { linkHref } from '@/utils/utils';
import { HandleBeforeUpload } from '@/utils/validator';

type EmergencyProps = SubmissionFormProps & RouteComponentProps;
const dataSource: FileModel[] = [];
class SubmissionAdd extends React.Component<SubmissionFormProps, EmergencyProps> {
  constructor(prop: SubmissionFormProps) {
    super(prop);
  }
  componentDidMount() {
    this.setState({
      previewVisible: false,
      previewImage: '',
      aFileList: dataSource,
      bFileList: dataSource,
      bill: false,
    });
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    if (uid) {
      let params: Map<string, string> = new Map();
      params.set('type', '1');
      getRequest('/business/order/' + uid, params, (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data)) {
            this.setState({
              voyage: response.data.orderVoyage.voyage,//航次对象
              voyagePort: response.data.orderVoyage.voyagePort,//航线途径港
              pallet: response.data.orderPallet.pallet,//货盘对象
              order: response.data.order,//订单对象
              ship: response.data.orderVoyage.ship,//船舶对象
              voyageLineName: response.data.orderVoyage.voyageLineName,
              attachments: response.data.attachments,//附件
              checkRemark: response.data.checkRemark ? response.data.checkRemark : '',
            });
            const aactiveArr = filter(response.data.attachments, { 'fileLog': 16 });
            const goods = response.data.orderPallet.palletFileList;
            let data: FileModel[] = [];
            let a: Attachments[] = [];
            forEach(aactiveArr, (attachment, index) => {
              if (attachment.fileLog === 16) {
                let tidanFileList: Attachments = { type: '', fileName: '', fileLog: 16 };
                tidanFileList.fileName = attachment.fileName;
                tidanFileList.type = attachment.fileType;
                tidanFileList.fileLog = attachment.fileLog;
                a.push(tidanFileList);
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', attachment.fileName);
                getRequest('/sys/file/getThumbImageBase64/' + attachment.fileType, picParams, (response2: any) => {  //BUG131改修fileType.ship_lading_bill
                  if (response2.status === 200) {
                    this.setState({
                      aFileList: [{
                        uid: index,
                        name: response2.data[0].fileName,
                        status: 'done',
                        thumbUrl: response2.data[0].base64,
                      }],
                      tidan: a,
                    })
                  }
                });
              }
            });
            forEach(goods, (attachment, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', attachment.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + attachment.type, picParams, (response2: any) => { //BUG131改修fileType.pallet_add
                if (response2.status === 200) {
                  let fileLists: FileModel = {};
                  if(goods.length === 2){
                    fileLists.uid = index;
                    fileLists.name = response2.data[0].fileName;
                    fileLists.status = 'done';
                    fileLists.thumbUrl = response2.data[0].base64;
                    // 图片排序，第二张显示审核上传的图片
                    if(attachment.fileLog === 2){
                      data[0] = fileLists;
                    }else if(attachment.fileLog === 24){
                      data[1] = fileLists;
                    }
                  }else{
                    fileLists.uid = index;
                    fileLists.name = response2.data[0].fileName;
                    fileLists.status = 'done';
                    fileLists.thumbUrl = response2.data[0].base64;
                    data.push(fileLists);
                  }
                  if (data.length === goods.length) {
                    this.setState({
                      bFileList: data,
                    });
                  }
                }
              });
            });
          }
        }
      });
    }
  }

  // 检查图片是否上传
  aheckFile = (rule: any, val: any, callback: any) => {
    if (isNil(this.state.aFileList) || this.state.aFileList.length === 0) {
      callback(formatMessage({ id: 'pallet-palletAdd.upload.picture.null' }));
    } else {
      callback();
    }
  };

  //删除图片
  aonRemove = (file: any) => {
    this.setState(() => ({
      aFileList: [],
      tidan: [],
    }));
  }

  //上传图片变更
  ahandleChange = (info: any) => {
    const dataSource = this.state.tidan ? this.state.tidan : [];
    if (!isNil(info.file.status) && (info.file.status === 'done')) {
      if (info.file.response.status === 200) {
        let fileLists: Attachments = { type: '', fileName: '', fileLog: 16 };
        fileLists.type = info.file.response.data.type;
        fileLists.fileName = info.file.response.data.fileName;
        fileLists.fileLog = 16;
        dataSource.push(fileLists);
        this.setState({
          bill: false,
        });
      }
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ bill: true });
    }
    this.setState({
      aFileList: info.fileList, tidan: dataSource
    });
  }

  handleSubmit() {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let requestData = {};
        requestData = {
          type: 3,
          guid: this.props.match.params['guid'],
          uploadResult: this.state.tidan,
        };
        // 修改请求
        postRequest('/business/order/uploadBill', JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {
            message.success('保存成功');
            this.props.history.push('/submission');
          } else {
            message.error('保存失败');
          }
        });
      }
    });
  }

  onBack = () => {
    this.props.history.push('/submission');
  };

  // 图片预览
  ahandlePreview = (file: any) => {
    if (file.response) {
      let params: Map<string, string> = new Map();
      params.set('fileName', file.response.data.fileName);
      getRequest('/sys/file/getImageBase64/' + fileType.ship_lading_bill, params, (response: any) => {
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
      getRequest('/sys/file/getImageBase64/' + fileType.ship_lading_bill, params, (response: any) => {
        if (response.status === 200) {
          this.setState({
            previewImage: response.data.file.base64,
            previewVisible: true,
          });
        }
      });
    }
  };

  // 图片预览
  bhandlePreview = (file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.name);
    getRequest('/sys/file/getImageBase64/' + fileType.pallet_add, params, (response: any) => {
      if (response.status === 200) {
        this.setState({
          previewImage: response.data.file.base64,
          previewVisible: true,
        });
      }

    });
  };


  //取消预览
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text"><FormattedMessage id="pallet-palletAdd.upload.picture" /></div>
      </div>
    );

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="订单信息" event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="订单编号">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.order) || isNil(this.state.order.orderNumber) ? '' : this.state.order.orderNumber
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
          </Form>
        </div>

        <div className={commonCss.title}>
          <span className={commonCss.text}>{"提单上传"}</span>
        </div>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row>
              <Form.Item className={commonCss.detailPageLabel}>
                {getFieldDecorator(`picture1`, {
                  rules: [
                    {
                      validator: this.aheckFile.bind(this),
                    },
                  ],
                })(
                  <Upload
                    action={"/api/sys/file/upload/" + fileType.ship_lading_bill}
                    listType="picture-card"
                    accept='.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff'
                    beforeUpload={HandleBeforeUpload.bind(this)}
                    headers={{ token: String(localStorage.getItem('token')) }}
                    showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: true }}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.aFileList) ||
                        this.state.aFileList.length === 0
                        ? ''
                        : this.state.aFileList
                    }
                    onRemove={this.aonRemove}
                    onPreview={this.ahandlePreview}
                    onChange={this.ahandleChange}
                  // onDownload={this.handleDownload}
                  >
                    {isNil(this.state) ||
                      isNil(this.state.aFileList) ||
                      this.state.aFileList.length == 0
                      ? uploadButton
                      : null}
                  </Upload>,
                )}
              </Form.Item>
            </Row>

            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
          </Form>
        </div>
        <ShipForm {...this.props} />
        <div className={commonCss.title}>
          <span className={commonCss.text}>货盘信息</span>
        </div>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <GoodsListForm {...this.props} />
            <Row gutter={24}>
              <Col>
                <Form.Item label="添加货物清单" className={commonCss.detailPageLabel}>
                  <Upload
                    action={"/api/sys/file/upload/" + fileType.pallet_add}
                    listType="picture-card"
                    accept='.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff'
                    beforeUpload={HandleBeforeUpload.bind(this)}
                    headers={{ token: String(localStorage.getItem("token")) }}
                    showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.bFileList) ||
                        this.state.bFileList.length === 0
                        ? ''
                        : this.state.bFileList
                    }
                    onPreview={this.bhandlePreview}
                  // onDownload={this.handleDownload}
                  >
                    {isNil(this.state) ||
                      isNil(this.state.bFileList) ||
                      this.state.bFileList.length == 0
                      ? null
                      : null}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Approve"
                  text="保存"
                  event={() => {
                    this.handleSubmit();
                  }}
                  disabled={!isNil(this.state) && this.state.bill}
                />
              </Col>
              <Col span={12}></Col>
            </Row>
          </Form>
        </div>
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

const SubmissionAdd_Form = Form.create({ name: 'SubmissionAdd_Form' })(SubmissionAdd);

export default SubmissionAdd_Form;
