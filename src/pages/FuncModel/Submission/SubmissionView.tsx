import HrComponent from '@/pages/Common/Components/HrComponent';
import { getRequest } from '@/utils/request';
import { Col, Form, Input, Modal, Row, Upload } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { filter, forEach, isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import GoodsListForm from '../Advanceorder/GoodsList';
import ShipsForm from '../Advanceorder/Ship';
import { FileModel } from './FileModel';
import SubmissionFormProps from './SubmissionFormInterface';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { linkHref } from '@/utils/utils';
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
            forEach(aactiveArr, (attachment, index) => {
              if (attachment.fileLog === 16) {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', attachment.fileName);
                getRequest('/sys/file/getThumbImageBase64/' + attachment.fileType, picParams, (response1: any) => { //BUG131改修fileType.ship_lading_bill
                  if (response1.status === 200) {
                    this.setState({
                      aFileList: [{
                        uid: index,
                        name: response1.data[0].fileName,
                        status: 'done',
                        thumbUrl: response1.data[0].base64,
                      }],
                    })
                  }
                });
              }
            });
            forEach(goods, (attachment, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', attachment.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + attachment.type, picParams, (response2: any) => {//BUG131改修fileType.pallet_add
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


  onBack = () => {
    this.props.history.push('/submission');
  };

  // 提单预览
  ahandlePreview = (file: any) => {
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
  };

  // 货物清单预览
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
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

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
                <Upload
                  action={"/api/sys/file/upload/" + fileType.ship_lading_bill}
                  listType="picture-card"
                  accept='.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff'
                  headers={{ token: String(localStorage.getItem('token')) }}
                  showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
                  fileList={
                    isNil(this.state) ||
                      isNil(this.state.aFileList) ||
                      this.state.aFileList.length === 0
                      ? ''
                      : this.state.aFileList
                  }
                  onPreview={this.ahandlePreview}
                // onDownload={this.handleDownload}
                >
                  {isNil(this.state) ||
                    isNil(this.state.aFileList) ||
                    this.state.aFileList.length == 0
                    ? null
                    : null}
                </Upload>
              </Form.Item>
            </Row>

            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
          </Form>
        </div>
        <ShipsForm {...this.props} />
        <div className={commonCss.title}>
          <span className={commonCss.text}>货盘信息</span>
        </div>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <GoodsListForm {...this.props} />
            <Row gutter={24}>
              <Col>
                <Form.Item label="货物清单" className={commonCss.detailPageLabel}>

                  <Upload
                    action={"/api/sys/file/upload/" + fileType.pallet_add}
                    listType="picture-card"
                    accept='.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff'
                    headers={{ token: String(localStorage.getItem('token')) }}
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
                  text="关闭"
                  event={() => {
                    this.onBack();
                  }}
                  disabled={false}
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
