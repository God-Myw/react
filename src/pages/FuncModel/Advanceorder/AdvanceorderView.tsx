import HrComponent from '@/pages/Common/Components/HrComponent';
import { getRequest } from '@/utils/request';
import { Col, Form, Input, Modal, Row, Upload } from 'antd';
import { filter, forEach, isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import AdvanceorderFormProps from './AdvanceorderFormInterface';
import { FileModel } from './FileModel';
import GoodsListForm from './GoodsList';
import ShipForm from './Ship';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { getLocale } from 'umi-plugin-react/locale';
import { linkHref } from '@/utils/utils';
import { HandleBeforeUpload } from '@/utils/validator';
//不通过图片
const certificationNO = require('../../Image/noPass.png');
const certificationNOEN = require('../../Image/noPassEN.png');
//审核中图片
const oncheck = require('../../Image/onCheck.png');
const oncheckEN = require('../../Image/onCheckEN.png');
//通过图片
const certificationsuccess = require('../../Image/pass.png');
const certificationsuccessEN = require('../../Image/passEN.png');
const dataSource: FileModel[] = [];
class AdvanceorderAdd extends React.Component<AdvanceorderFormProps, AdvanceorderFormProps> {
  certification = '';
  constructor(props: AdvanceorderFormProps) {
    super(props);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    this.setState(
      {
        previewVisible: false,
        previewImage: '',
        aFileList: dataSource,
        bFileList: dataSource,
        cFileList: dataSource,
        type: '',
        fileName: '',
        downpayment: '',
        contractMoney: '',
        contractMoneyDollar:'',
        downpaymentDollar:'',
        guid: '',
      },
      () => {
        let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
        if (uid) {
          let param: Map<string, string> = new Map();
          param.set('type', '1');
          getRequest('/business/order/' + uid, param, (response: any) => {
            if (response.status === 200) {
              if (!isNil(response.data)) {
                this.setState({
                  voyage: response.data.orderVoyage.voyage,//航次对象
                  voyagePort: response.data.orderVoyage.voyagePort,//航线途径港
                  pallet: response.data.orderPallet.pallet,//货盘对象
                  remark: response.data.orderPallet.pallet.remark,
                  order: response.data.order,//订单对象
                  ship: response.data.orderVoyage.ship,//船舶对象
                  voyageLineName: response.data.orderVoyage.voyageLineName,
                  attachments: response.data.attachments,//附件
                  checkRemark: response.data.checkRemark ? response.data.checkRemark : '',
                  downpayment: response.data.order.downpayment,
                  contractMoney: response.data.order.contractMoney,
                  guid: response.data.order.guid,
                  contractMoneyDollar: response.data.order.contractMoneyDollar,
                  downpaymentDollar: response.data.order.downpaymentDollar,
                });
                const activeArr = filter(response.data.attachments, { 'fileLog': 12 });
                const aactiveArr = filter(response.data.attachments, { 'fileLog': 11 });
                const goods = response.data.orderPallet.palletFileList;
                let adata_Source: FileModel[] = [];
                let bdata_source: FileModel[] = [];
                let data: FileModel[] = [];
                forEach(aactiveArr, (attachment, index) => {
                  if (attachment.fileLog === 11) {
                    let picParams: Map<string, string> = new Map();
                    picParams.set('fileNames', attachment.fileName);
                    getRequest('/sys/file/getThumbImageBase64/' + attachment.fileType, picParams, (response: any) => {
                      if (response.status === 200) {
                        let fileList: FileModel = {};
                        fileList.uid = index;
                        fileList.name = response.data[0].fileName;
                        fileList.status = 'done';
                        fileList.thumbUrl = response.data[0].base64;
                        adata_Source.push(fileList);
                        if (adata_Source.length === aactiveArr.length) {
                          this.setState({
                            aFileList: adata_Source,
                            picNum: adata_Source.length,
                          });
                        }
                      }
                    });
                  }
                });
                forEach(activeArr, (attachment, index) => {
                  if (attachment.fileLog === 12) {
                    let picParams: Map<string, string> = new Map();
                    picParams.set('fileNames', attachment.fileName);
                    getRequest('/sys/file/getThumbImageBase64/' + attachment.fileType, picParams, (response1: any) => {
                      if (response1.status === 200) {
                        let fileList: FileModel = {};
                        fileList.uid = index;
                        fileList.name = response1.data[0].fileName;
                        fileList.status = 'done';
                        fileList.thumbUrl = response1.data[0].base64;
                        bdata_source.push(fileList);
                        if (bdata_source.length === activeArr.length) {
                          this.setState({
                            bFileList: bdata_source,
                            picNum: bdata_source.length,
                          });
                        }
                      }
                    });
                  }
                });
                forEach(goods, (attachment, index) => {
                  let picParams: Map<string, string> = new Map();
                  picParams.set('fileNames', attachment.fileName);
                  getRequest('/sys/file/getThumbImageBase64/' + attachment.type, picParams, (response2: any) => {
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
                          cFileList: data,
                        });
                      }
                    }
                  });
                });
              }
            }
          });
        }
      },
    );

  }

  // 返回
  onBack = () => {
    this.props.history.push('/advanceorder/list/' + this.props.match.params['status']);
  };

  // 协议预览
  ahandlePreview = (file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.name);
    getRequest('/sys/file/getImageBase64/' + fileType.ship_agreement, params, (response: any) => {
      if (response.status === 200) {
        this.setState({
          previewImage: response.data.file.base64,
          previewVisible: true,
        });
      }
    });
  };

  // 单证预览
  bhandlePreview = (file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.name);
    getRequest('/sys/file/getImageBase64/' + fileType.ship_document, params, (response: any) => {
      if (response.status === 200) {
        this.setState({
          previewImage: response.data.file.base64,
          previewVisible: true,
        });
      }
    });
  };


  // 货物清单预览
  chandlePreview = (file: any) => {
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
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    if (this.props.match.params['status'] == '2') {
      this.certification = getLocale() === 'zh-CN' ? certificationNO : certificationNOEN;
    } else if (this.props.match.params['status'] == '3') {
      this.certification = getLocale() === 'zh-CN' ? certificationsuccess : certificationsuccessEN;
    } else if (this.props.match.params['status'] == '1') {
      this.certification = getLocale() === 'zh-CN' ? oncheck : oncheckEN;
    } else {
      this.certification = '';
    }

    return (
      <div>
        <div className={commonCss.container}>
          <LabelTitleComponent text={'查看审核'} event={() => this.onBack()} />
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Form.Item label="协议上传" className={commonCss.detailPageLabel}>
                  <Upload
                    action={"/api/sys/file/upload/" + fileType.ship_agreement}
                    listType="picture-card"
                    accept='.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff'
                    beforeUpload={HandleBeforeUpload.bind(this)}
                    headers={{ token: String(localStorage.getItem("token")) }}
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
                      this.state.aFileList.length < 5
                      ? null
                      : null}
                  </Upload>
                </Form.Item>
              </Row>
              <Row gutter={24}>
                <Form.Item label="单证上传" className={commonCss.detailPageLabel}>
                  <Upload
                    action={"/api/sys/file/upload/" + fileType.ship_document}
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
                      this.state.bFileList.length < 8
                      ? null
                      : null}
                  </Upload>
                </Form.Item>
              </Row>
              <Row gutter={24}>

              </Row>
              <Row className={commonCss.rowTop}>
                <Col>
                  <HrComponent text="dashed" />
                </Col>
              </Row>
            </Form>
          </div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>金额信息</span>
          </div>
          <div className={commonCss.AddForm}>
            <Form labelAlign="right">
              <Row gutter={24}>
                <Col span={7}>
                  <Form.Item {...formlayout} label="合同总金额：￥" colon={false}>
                  <Input
                    value={isNil(this.state) || isNil(this.state.contractMoney)
                      ? 0
                      : this.state.contractMoney}
                    disabled
                    style={{ color: 'red', marginTop: '1%', width: '200px' }}
                  />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item {...formlayout} label="定金：￥" colon={false}>
                  <Input
                    value={isNil(this.state) || isNil(this.state.downpayment)
                      ? 0
                      : this.state.downpayment}
                    disabled
                    style={{ color: 'red', marginTop: '1%', width: '200px' }}
                  />
                  </Form.Item>
                </Col>
              </Row>
              {/* 美元 */}
              <Row gutter={24}>
                <Col span={7}>
                  <Form.Item {...formlayout} label="$" colon={false}>
                  <Input
                      value={isNil(this.state) || isNil(this.state.contractMoneyDollar)
                        ? 0
                        : this.state.contractMoneyDollar}
                      disabled
                      style={{ color: 'red', marginTop: '1%', width: '200px' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item {...formlayout} label="$" colon={false}>
                  <Input
                      value={isNil(this.state) || isNil(this.state.downpaymentDollar)
                        ? 0
                        : this.state.downpaymentDollar}
                      disabled
                      style={{ color: 'red', marginTop: '1%', width: '200px' }}
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
          <ShipForm {...this.props} />
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
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem("token")) }}
                      showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.cFileList) ||
                          this.state.cFileList.length === 0
                          ? ''
                          : this.state.cFileList
                      }
                      onPreview={this.chandlePreview}
                    // onDownload={this.handleDownload}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.cFileList) ||
                        this.state.cFileList.length === 0
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
              <Row gutter={24}>
                <Col>
                  <Form.Item {...smallFormItemLayout} label="备注">
                    <Input.TextArea maxLength={300} style={{ width: '100%', height: '200px' }}
                    value={
                        isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                      } disabled={true}/>
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
          <Row>
            {isNil(this.state) || isNil(this.state.checkRemark) || this.props.match.params['status'] != '2' ? null : (<Col span={12}>
              <Form.Item {...formlayout} label="审批意见" style={{ marginLeft: '-10%' }}>
                <span>{this.state.checkRemark}</span>
              </Form.Item>
            </Col>)}
          </Row>
          <Form labelAlign="left">
            <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Approve"
                  text="关闭"
                  event={() => this.onBack()}
                  disabled={false}
                />
              </Col>
              {this.props.match.params['status'] === '0' ? null : <Col span={7}></Col>}
              <Col span={5}>
                <div className={commonCss.picTopAndBottom} >
                  <img
                    style={{ marginTop: '-15%' }}
                    src={this.certification}
                    className={commonCss.imgWidth}
                  />
                </div>
              </Col>
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

const AdvanceorderAdd_Form = Form.create({ name: 'advanceorderAdd_Form' })(AdvanceorderAdd);

export default AdvanceorderAdd_Form;
