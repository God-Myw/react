import HrComponent from '@/pages/Common/Components/HrComponent';
import getRequest, { putRequest } from '@/utils/request';
import { Col, Form, Input, message, Modal, Row, Upload } from 'antd';
import { forEach, isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import AdvanceorderFormProps from './AdvanceorderFormInterface';
import GoodsListForm from './GoodsList';
import ShipForm from './Ship';
import { getLocale } from 'umi-plugin-react/locale';
import { FileModel } from '../Advanceorder/FileModel';
import { linkHref } from '@/utils/utils';

const { TextArea } = Input;

// 不通过图片
const certificationNO = require('../../Image/noPass.png');
const certificationNOEN = require('../../Image/noPassEN.png');

// 通过图片
const certificationsuccess = require('../../Image/pass.png');
const certificationsuccessEN = require('../../Image/passEN.png');

interface IState {
  previewVisible: boolean;
  downpayment: string;
  contractMoney: string;
  checkRemark: string;
  orderVoyage: object;
  previewImage: string;
  pallet: object;
  guid: string;
  aPicList: Array<FileModel>;
  bPicList: Array<FileModel>;
  cPicList: Array<FileModel>;
  orderNumber: string;
  palletRemark: string;
  palletId: string;

  downpaymentDollar: string;
  contractMoneyDollar: string;
}

class AdvanceorderAdd extends React.Component<AdvanceorderFormProps, IState> {
  state = {
    previewVisible: false,
    downpayment: '',
    contractMoney: '',
    downpaymentDollar:'',
    contractMoneyDollar:'',
    checkRemark: '',
    orderVoyage: {},
    previewImage: '',
    pallet: {},
    guid: '',
    aPicList: [],
    bPicList: [],
    cPicList: [],
    orderNumber: '',
    palletRemark: '',
    palletId: '',
  }
  changeSrc = '';

  certification = '';

  componentDidMount() {
    this.getData();
  }

  getData() {
    let param: Map<string, string> = new Map();
    let newAlist: FileModel[] = []
    let newBlist: FileModel[] = []
    param.set('type', '1');
    param.set('guid', this.props.match.params.guid);
    getRequest(
      `/business/order/${this.props.match.params.guid}`,
      param,
      (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data.attachments)) {
            forEach(response.data.attachments, (item, index) => {
              let param: Map<string, string> = new Map();
              param.set('fileNames', item.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + item.fileType, param, (response: any) => {
                console.log(response)
                  if (response.status === 200) {

                    if (!isNil(response.data)) {
                      if (item.fileLog === 11) {
                        newAlist.push({
                          uid: index,
                          name: response.data[0].fileName,
                          status: 'done',
                          thumbUrl: response.data[0].base64,
                          type:item.fileType
                        })
                      }
                      if (item.fileLog === 12) {
                        newBlist.push({
                          uid: index,
                          name: response.data[0].fileName,
                          status: 'done',
                          thumbUrl: response.data[0].base64,
                          type:item.fileType
                        })
                      }
                    }
                  }
                });
            });
          }
          if (!isNil(response.data.orderPallet.palletFileList)) {
            this.getPalletPic(response.data.orderPallet.palletFileList);
          }

          if (!isNil(response.data)) {
            console.log()
            this.setState({
              downpayment: response.data.order.downpayment,
              contractMoney: response.data.order.contractMoney,

              downpaymentDollar: response.data.order.downpaymentDollar,
              contractMoneyDollar: response.data.order.contractMoneyDollar,
              orderVoyage: response.data.orderVoyage,// 航次信息
              pallet: response.data.orderPallet, // 货盘信息
              palletRemark: response.data.orderPallet.pallet.remark,
              palletId: response.data.orderPallet.pallet.guid,
              checkRemark: response.data.checkRemark ? response.data.checkRemark : '',
              guid: response.data.order.guid,
              orderNumber: response.data.order.orderNumber,
              aPicList: newAlist,
              bPicList: newBlist
            });
          }
        }
      },
    );
  }


  getPalletPic(list:any){
    let data_Source: FileModel[] = [];
    forEach(list, (attachment, index) => {
      let picParams: Map<string, string> = new Map();
      picParams.set('fileNames', attachment.fileName);
      getRequest('/sys/file/getThumbImageBase64/' + attachment.type, picParams, (response2: any) => { //BUG131改修fileType.pallet_add
        console.log(response2)
        if (response2.status === 200) {
          let fileLists: FileModel = {};
          if(list.length === 2){
            fileLists.uid = index;
            fileLists.name = response2.data[0].fileName;
            fileLists.status = 'done';
            fileLists.thumbUrl = response2.data[0].base64;
            fileLists.type=attachment.type
            // 图片排序，第二张显示审核上传的图片
            if(attachment.fileLog === 2){
              data_Source[0] = fileLists;
            }else if(attachment.fileLog === 24){
              data_Source[1] = fileLists;
            }
          }else{
            fileLists.uid = index;
            fileLists.name = response2.data[0].fileName;
            fileLists.status = 'done';
            fileLists.thumbUrl = response2.data[0].base64;
            fileLists.type=attachment.type
            data_Source.push(fileLists);
          }
          if (data_Source.length === list.length) {
            this.setState({
              cPicList: data_Source,
            });
          }
        }
      });
    });
  }

  // 返回
  onBack = () => {
    const selectTab = this.props.match.params.selectTab;
    this.props.history.push('/ceradvanceorder/list' + '?selectTab=' + selectTab);
  };

  // 图片预览
  handlePreview = (file: any) => {
    const params: Map<string, string> = new Map();
    params.set('fileName', file.name);
    getRequest(`/sys/file/getImageBase64/${file.type}`, params, (response: any) => {
      if (response.status === 200) {
        this.setState({
          previewImage: response.data.file.base64,
          previewVisible: true,
        });
      }
    });
  };

  // 取消预览
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  // 驳回或审批通过
  turnDown = (value: string) => {
    const { orderNumber, checkRemark } = this.state;
    if (value === '2') {
      this.props.form.validateFields((err: any, values: any) => {
        if (!err) {
          let requestData = {};
          requestData = {
            type: 1,
            orderNumber,
            checkRemark: checkRemark ? checkRemark : '',
            checkStatus: 2,
            palletId:this.state.palletId,
            palletRemark:this.state.palletRemark,
          };
          // 资料认证审批
          putRequest('/business/order/orderReview', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              this.props.history.push('/ceradvanceorder');
              message.success('驳回成功');
            }
          });
        }
      });
    } else if (value === '3') {
      let requestData = {};
      requestData = {
        type: 1,
        orderNumber,
        checkRemark: checkRemark ? checkRemark : '',
        checkStatus: 3,
        palletId:this.state.palletId,
        palletRemark:this.state.palletRemark,
      };
      // 资料认证审批
      putRequest('/business/order/orderReview', JSON.stringify(requestData), (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          this.props.history.push('/ceradvanceorder');
          message.success('审批通过');
        }
      });
    }
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const formlayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const { getFieldDecorator } = this.props.form;
    if (this.props.match.params.status == '2') {
      this.certification = getLocale() === 'zh-CN' ? certificationNO : certificationNOEN;
    } else if (this.props.match.params.status == '3') {
      this.certification = getLocale() === 'zh-CN' ? certificationsuccess : certificationsuccessEN;
    } else {
      this.certification = '';
    }
    const { previewVisible, contractMoney, downpayment, checkRemark, orderVoyage, pallet, aPicList, bPicList, cPicList, previewImage,downpaymentDollar,contractMoneyDollar } = this.state;
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="申请审核" event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Form.Item label="协议上传" required className={commonCss.detailPageLabel}>
                <Upload
                  action="/api/sys/file/upload/order"
                  listType="picture-card"
                  data={{ type: 1 }}
                  showUploadList={{
                    showPreviewIcon: true,
                    showDownloadIcon: false,
                    showRemoveIcon: false,
                  }}
                  fileList={aPicList}
                  onPreview={this.handlePreview}
                >
                </Upload>
              </Form.Item>
            </Row>
            <Row gutter={24}>
              <Form.Item label="单证上传" required className={commonCss.detailPageLabel}>
                <Upload
                  action="/api/sys/file/upload/order"
                  listType="picture-card"
                  data={{ type: 1 }}
                  showUploadList={{
                    showPreviewIcon: true,
                    showDownloadIcon: false,
                    showRemoveIcon: false,
                  }}
                  fileList={bPicList}
                  onPreview={this.handlePreview}
                >
                </Upload>
              </Form.Item>
            </Row>
            <Row gutter={24}></Row>
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
                    value={contractMoney}
                    disabled
                    style={{ color: 'red', marginTop: '1%', width: '200px' }}
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item {...formlayout} label="定金：￥" colon={false}>
                <Input
                    value={downpayment}
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
                    value={contractMoneyDollar}
                    disabled
                    style={{ color: 'red', marginTop: '1%', width: '200px' }}
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item {...formlayout} label="$" colon={false}>
                <Input
                    value={downpaymentDollar}
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
        <ShipForm {...orderVoyage} />
        <div className={commonCss.title}>
          <span className={commonCss.text}>货盘信息</span>
        </div>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col>
                <Form.Item label="货物清单" required className={commonCss.detailPageLabel}>
                  <Upload
                    action="/api/sys/file/upload/pallet"
                    listType="picture-card"
                    data={{ type: 1 }}
                    showUploadList={{
                      showPreviewIcon: true,
                      showDownloadIcon: false,
                      showRemoveIcon: false,
                    }}
                    fileList={cPicList}
                    onPreview={this.handlePreview}
                  >
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <GoodsListForm {...pallet} />
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col>
                <Form.Item {...formItemLayout} label="备注">
                  <Input.TextArea maxLength={300} style={{ width: '100%', height: '200px' }}
                  value={
                      isNil(this.state) || isNil(this.state.palletRemark) ? '' : this.state.palletRemark
                    } onChange={e => this.setState({ palletRemark: e.target.value })} disabled={this.props.match.params.status !== '1'}/>
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
          <span className={commonCss.text}>审批意见</span>
        </div>
        <Form labelAlign="left">
          <Row gutter={24}>
            {this.props.match.params.status === '1' ? <Col span={1}></Col> : null}
            {this.props.match.params.status === '1' ? (
              <Col span={22} style={{ marginLeft: '-2%' }}>
                <Form.Item required>
                  {getFieldDecorator('note', {
                    rules: [
                      { max: 300, message: '不能超过300字' },
                      { required: true, message: '审批意见不能为空！' },
                    ],
                  })(<TextArea rows={4} placeholder="请输入您的审批意(0/300字)..." onChange={e => this.setState({ checkRemark: e.target.value })} />)}
                </Form.Item>
              </Col>
            ) : (
                <Col span={22}>
                  <Form.Item
                    required
                    {...formItemLayout}
                    label="审批意见 ："
                    style={{ marginLeft: '1%' }}
                  >
                    <span style={{ marginLeft: '-2%' }}>
                      {checkRemark}
                    </span>
                  </Form.Item>
                </Col>
              )}
          </Row>
          <Row className={commonCss.rowTop}>
            {this.props.match.params.status === '1' ? (
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="TurnDown"
                  text="驳回"
                  event={() => this.turnDown('2')}
                  disabled={false}
                />
              </Col>
            ) : null}
            {this.props.match.params.status === '1' ? (
              <Col span={12}>
                <ButtonOptionComponent
                  type="Approve"
                  text="审批通过"
                  event={() => this.turnDown('3')}
                  disabled={false}
                />
              </Col>
            ) : null}
            {this.props.match.params.status === '1' ? null : (
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="CloseButton"
                  text="关闭"
                  event={() => this.onBack()}
                  disabled={false}
                />
              </Col>
            )}
            {this.props.match.params.status === '1' ? null : <Col span={7}></Col>}
            {this.props.match.params.status === '1' ? null : (
              <Col span={5}>
                <div className={commonCss.picTopAndBottom}>
                  <img
                    style={{ marginTop: '-17%' }}
                    src={this.certification}
                    className={commonCss.imgWidth}
                  />
                </div>
              </Col>
            )}
          </Row>
          <Modal className="picModal"
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img className={commonCss.imgWidth} src={previewImage} />
            <a onClick={()=>linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
          </Modal>
        </Form>
      </div>
    );
  }
}

const AdvanceorderAdd_Form = Form.create({ name: 'advanceorderAdd_Form' })(AdvanceorderAdd);

export default AdvanceorderAdd_Form;
