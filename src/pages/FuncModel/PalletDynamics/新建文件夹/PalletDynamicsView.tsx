import { fileType } from '@/pages/Common/Components/FileTypeCons';
import HrComponent from '@/pages/Common/Components/HrComponent';
import getRequest, { putRequest, postRequest } from '@/utils/request';
import { getTableEnumText, linkHref } from '@/utils/utils';
import { Col, Form, Input, Modal, Row, Upload, Icon, message } from 'antd';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import PalletFormProps, { FileModel, PicList } from './PalletDynamicsFormInterface';
import { HandleBeforeUpload } from '@/utils/validator';
const defaultpic = require('../../Image/default.png');

const { TextArea } = Input;
class PalletDynamicsView extends React.Component<PalletFormProps, PalletFormProps> {
  private userType = localStorage.getItem('userType');
  private userId = localStorage.getItem('userId');
  constructor(props: PalletFormProps) {
    super(props);
  }

  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    this.setState({ guid: uid });
    let params: Map<string, string> = new Map();
    params.set('type', '1');
    getRequest('/business/pallet/' + uid, params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          if (!isNil(response.data.palletFileList)) {
            const goods = response.data.palletFileList;
            let data_Source: FileModel[] = [];
            forEach(goods, (attachment, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', attachment.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + attachment.type, picParams, (res: any) => { //BUG131改修fileType.pallet_add
                if (res.status === 200) {
                  let fileLists: FileModel = {};
                  if(goods.length === 2){
                    fileLists.uid = index;
                    fileLists.name = res.data[0].fileName;
                    fileLists.status = 'done';
                    fileLists.thumbUrl = res.data[0].base64;
                    // 图片排序，第二张显示审核上传的图片
                    if(attachment.fileLog === 2){
                      data_Source[0] = fileLists;
                    }else if(attachment.fileLog === 24){
                      data_Source[1] = fileLists;
                    }
                  }else{
                    fileLists.uid = index;
                    fileLists.name = res.data[0].fileName;
                    fileLists.status = 'done';
                    fileLists.thumbUrl = res.data[0].base64;
                    data_Source.push(fileLists);
                  }
                  if (data_Source.length === goods.length) {
                    this.setState({
                      fileList: data_Source,
                    });
                  }
                }
              });
            });
          }

          this.setState({
            goodsLevel: getTableEnumText('goods_name', response.data.pallet.goodsLevel),
            goodsType: getTableEnumText('goods_type', response.data.pallet.goodsType),
            location: getTableEnumText('cargo_save_location', response.data.pallet.location),
            goodsProperty: getTableEnumText('goods_property', response.data.pallet.goodsProperty),
            goodsWeight: response.data.pallet.goodsWeight,
            goodsVolume: response.data.pallet.goodsVolume,
            goodsCount: response.data.pallet.goodsCount,
            isSuperposition: getTableEnumText('is_superposition', response.data.pallet.isSuperposition),
            startPort: getTableEnumText('port', response.data.pallet.startPort),
            destinationPort: getTableEnumText('port', response.data.pallet.destinationPort),
            unloadingDays: response.data.pallet.unloadingDays,
            loadingUnloadingVolume: response.data.pallet.loadingUnloadingVolume,
            loadDate: String(moment(Number(response.data.pallet.loadDate)).format('YYYY-MM-DD')),
            endDate: String(moment(Number(response.data.pallet.endDate)).format('YYYY-MM-DD')),
            majorParts: response.data.pallet.majorParts == 0 ? formatMessage({ id: 'pallet-palletAdd.ImportantpartsN' }) : formatMessage({ id: 'pallet-palletAdd.ImportantpartsY' }),
            contacter: response.data.pallet.contacter,
            contactPhone: response.data.pallet.contactPhone,
            phoneCode: response.data.pallet.phoneCode,
            remark: response.data.pallet.remark,
            unloadingflag: response.data.pallet.goodsProperty === 3 ? true : false,
            isCollected: response.data.pallet.isCollected
          });
        }
      }
    });
  }

  onBack = () => {
    if (localStorage.getItem('userType') === '3') {
      this.props.history.push('/customerpalletdynamics');
    } else {
      this.props.history.push('/palletdynamics');
    }
  }

  //上传图片变更
  handleChange = ({ fileList }: any) => {
    if (!isNil(fileList) && fileList.length > 0) {
      forEach(fileList, file => {
        if (!isNil(file.response) && !isNil(file.status) && file.status === 'done') {
          this.setState({ picflag: false },
            () => {
              let newfileList: PicList[] = [];
              newfileList.push({
                type: file.response.data.type,
                fileName: file.response.data.fileName
              });
              this.handleSubmit(newfileList);
            });
        } else if (!isNil(file.status) && file.status === 'uploading') {
          this.setState({ picflag: true });
        }
      })

    }
    this.setState({ fileList });
  };

  //提交事件
  handleSubmit(newfileList: any) {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let requestData = {
          type: '2',
          guid: this.state.guid,
          palletFileList: newfileList,

          goodsLevel: 0,
          goodsType: 0,
          goodsWeight: "0",
          goodsVolume: "0",
          goodsCount: "0",
          isSuperposition: 0,
          startPort: 0,
          destinationPort: 0,
          loadDate: 0,
          endDate: 0,
          contacter: "",
          contactPhone: "",
          loadingUnloadingVolume: "",
          unloadingDays: "",
          goodsProperty: 0,
          location: 0,
          majorParts: 0,
          phoneCode: "",
          state: 1
        };
        // 修改保存请求
        putRequest('/business/pallet', JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {
            message.success(formatMessage({ id: 'pallet-palletAdd.changesuccess' }));
          } else {
            message.error(formatMessage({ id: 'pallet-palletAdd.changefailed' }));
          }
        });
      }
    });
  }

  // 图片预览
  handlePreview = (file: any) => {
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

  // 收藏货盘(船东)
  handleCollect() {
    let params = {
      type: "1",
      userId: this.userId,
      palletId: this.state.guid
    }
    postRequest('/business/pallet/collect', JSON.stringify(params), (response: any) => {
      if (response.status === 200) {
        // 跳转首页
        this.props.history.push('/palletdynamics');
        message.success(formatMessage({ id: 'pallet-palletAdd.collect.success' }));
      } else {
        message.error(formatMessage({ id: 'pallet-palletAdd.collect.failed' }));
      }
    });
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
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">
          <FormattedMessage id="Myship-.UploadMyShip.upload" />
        </div>
      </div>
    );
    const flag = !isNil(this.state) && !isNil(this.state.fileList) && this.state.fileList.length !== 0;
    const isCollected = !isNil(this.state) && this.state.isCollected;
    const shenhePic = (
      <Upload
        action={'/api/sys/file/upload/' + fileType.pallet_add}
        listType="picture-card"
        accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
        beforeUpload={HandleBeforeUpload.bind(this)}
        headers={{ token: String(localStorage.getItem('token')) }}
        showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
        fileList={
            isNil(this.state) ||
            isNil(this.state.fileList) ||
            this.state.fileList.length === 0
            ? ''
            : this.state.fileList
        }
        onPreview={this.handlePreview}
        onChange={this.handleChange}
      >
        { 
          isNil(this.state) ||
          isNil(this.state.fileList) ||
          this.state.fileList.length === 1
          ? uploadButton
          : null}
      </Upload>
    );
    const chuandongHasPic = (
      <Upload
        action=""
        listType="picture-card"
        showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
        fileList={
          isNil(this.state) ||
          isNil(this.state.fileList) ||
          this.state.fileList.length === 0
          ? ''
          : this.state.fileList}
        onPreview={this.handlePreview}
      >
      </Upload>
    );
    const chuandongDefault = (
      <img
        style={{ width: '104px', height: '104px'}}
        src={defaultpic}
      />
    );
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.pallet-check' })}
          event={() => {
            this.onBack();
          }}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.name' })}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.goodsLevel) ? '' : this.state.goodsLevel
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.type' })}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.goodsType) ? '' : this.state.goodsType
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.pallet-memory-address' })}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.location) ? '' : this.state.location
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.quality' })}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.goodsProperty) ? '' : this.state.goodsProperty
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.weight' })}>
                  <Input
                    disabled
                    suffix={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.ton' })}
                    value={
                      isNil(this.state) || isNil(this.state.goodsWeight) ? '' : this.state.goodsWeight
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.volume' })}>
                  <Input
                    disabled
                    suffix="m³"
                    value={
                      isNil(this.state) || isNil(this.state.goodsVolume) ? '' : this.state.goodsVolume
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.goodsnumber' })}>
                  <Input
                    disabled
                    suffix={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.piece' })}
                    value={
                      isNil(this.state) || isNil(this.state.goodsCount) ? '' : this.state.goodsCount
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.whether-stacked' })}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.isSuperposition)
                        ? ''
                        : this.state.isSuperposition
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.departure' })}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.startPort) ? '' : this.state.startPort
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.destination' })}>
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.destinationPort)
                        ? ''
                        : this.state.destinationPort
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            {!isNil(this.state) && this.state.unloadingflag ?
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.unloading.days' })}>
                    <Input
                      disabled
                      className="OnlyRead"
                      suffix={formatMessage({ id: 'pallet-palletAdd.day' })}
                      value={
                        isNil(this.state) || isNil(this.state.unloadingDays)
                          ? ''
                          : this.state.unloadingDays
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.lessloading.rate' })}>
                    <Input
                      disabled
                      className="OnlyRead"
                      suffix='%'
                      value={
                        isNil(this.state) || isNil(this.state.loadingUnloadingVolume)
                          ? ''
                          : this.state.loadingUnloadingVolume
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              : null}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.load-date' })}>
                  <Input
                    disabled
                    className="OnlyRead"
                    value={isNil(this.state) || isNil(this.state.loadDate) ? '' : this.state.loadDate}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.cut-off-date' })}>
                  <Input
                    disabled
                    className="OnlyRead"
                    value={isNil(this.state) || isNil(this.state.endDate) ? '' : this.state.endDate}
                  />
                </Form.Item>
              </Col>
            </Row>
            {!isNil(this.state) && this.userType == '3' ? (
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.linkman' })}>
                    <Input
                      disabled
                      className="OnlyRead"
                      value={
                        isNil(this.state) || isNil(this.state.contacter) ? '' : this.state.contacter
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.contact.way' })}>
                    <Input
                      disabled
                      placeholder="+86"
                      style={{ width: '15%' }}
                      className="OnlyRead"
                      value={
                        isNil(this.state) || isNil(this.state.phoneCode)
                          ? '' : this.state.phoneCode
                      }
                    />
                    <Input
                      disabled
                      style={{ width: '85%' }}
                      value={
                        isNil(this.state) || isNil(this.state.contactPhone)
                          ? '' : this.state.contactPhone
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>) : null}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.whether.ItIs.heavyOrNot' })}>
                  <Input
                    disabled
                    className="OnlyRead"
                    value={isNil(this.state) || isNil(this.state.majorParts) ? '' : this.state.majorParts}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.goods.list' })}></Form.Item>
                {!isNil(this.state) && this.userType === '3' ? shenhePic : (flag ? chuandongHasPic : chuandongDefault) }
              </Col>
            </Row>
            
            {!isNil(this.state) && this.userType == '3' ? (
              <Row gutter={24}>
                <Col>
                  <HrComponent text="dashed" />
                </Col>
              </Row>) : null}
            {!isNil(this.state) && this.userType == '3' ? (
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item {...smallFormItemLayout} label="备注">
                    <TextArea readOnly disabled style={{ height: '180px' }}
                      value={
                        isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                      } />
                  </Form.Item>
                </Col>
              </Row>) : null}
            {!isNil(this.state) && this.userType === '3' ? (
              <Row gutter={24}>
                <Col>
                  <HrComponent text="dashed" />
                </Col>
              </Row>) : null}
            <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                {!isNil(this.state) && this.userType === '5' ? (
                  <ButtonOptionComponent
                    type={isCollected ? "Collected" : "Collect" }
                    text={isCollected ? formatMessage({ id: 'pallet-palletAdd.collected' }) : formatMessage({ id: 'pallet-palletAdd.collect' })}
                    event={() => {
                      this.handleCollect();
                    }}
                    disabled={isCollected}
                  />
                ) : null}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <ButtonOptionComponent
                  type="CloseButton"
                  text={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.close' })}
                  disabled={!isNil(this.state) && this.state.picflag}
                  event={() => {
                    this.onBack();
                  }}
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

const PalletDynamicsView_Form = Form.create({ name: 'PalletDynamicsView_Form' })(
  PalletDynamicsView,
);

export default PalletDynamicsView_Form;
