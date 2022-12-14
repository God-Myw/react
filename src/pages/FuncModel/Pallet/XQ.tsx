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
import PalletFormProps, { FileModel, PicList } from './XQFACCE';
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
      console.log(response)
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
          let CGUID = (response.data.pallet.CGUID).substring(0, 1)
          // console.log(CGUID)

          this.setState({
            CGCG:CGUID,
            unionTransport: response.data.pallet.unionTransport,
            isBind: response.data.pallet.isBind,
            isGangji: response.data.pallet.isGangji,
            insuranceJiangyun:response.data.pallet.insuranceJiangyun,
            insuranceKache:response.data.pallet.insuranceKache,
            insuranceHaiyun:response.data.pallet.insuranceHaiyun,
            price1:response.data.pallet.price,
            insurancePrice1:response.data.pallet.insurancePrice,
            CG:response.data.pallet.CGUID,
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
            loadDate: moment(response.data.pallet.loadDate).format('YYYY-MM-DD'),
            endDate: moment(response.data.pallet.endDate).format('YYYY-MM-DD'),
            majorParts: response.data.pallet.majorParts == 0 ? formatMessage({ id: 'pallet-palletAdd.ImportantpartsN' }) : formatMessage({ id: 'pallet-palletAdd.ImportantpartsY' }),//是，否
            contacter: response.data.pallet.contacter,
            contactPhone: response.data.pallet.contactPhone,
            phoneCode: response.data.pallet.phoneCode,
            remark: response.data.pallet.remark,
            unloadingflag: response.data.pallet.goodsProperty === 3 ? true : false,
            isCollected: response.data.pallet.isCollected

          });
          console.log(this.state.CGCG)
        }
      }
    });
  }

  onBack = () => {
    // if (localStorage.getItem('userType') === '3') {
    //   this.props.history.push('/customerpalletdynamics');
    // } else {
    //   this.props.history.push('/palletdynamics');
    // }
    this.props.history.push('/pallet')
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
            message.success(formatMessage({ id: 'pallet-palletAdd.changesuccess' }));//修改成功
          } else {
            message.error(formatMessage({ id: 'pallet-palletAdd.changefailed' }));//修改失败
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
        message.success(formatMessage({ id: 'pallet-palletAdd.collect.success' }));//操作成功
      } else {
        message.error(formatMessage({ id: 'pallet-palletAdd.collect.failed' }));//操作失败
      }
    });
  }
  //修改报价详情
  turnDown = (value: any) => {
    let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let requestData = {
      type:3,
      guid:guid*1,
      price:this.state.price,
      insurancePrice:this.state.insurancePrice
    };
      putRequest('/business/pallet', JSON.stringify(requestData), (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          message.success('修改成功');
          // location.reload()
         this.componentDidMount()
        } else {
          message.error(response.message);
        }
      });
  };

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    const formItemLayout = {
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
        // onChange={this.handleChange}
      >
        {
          isNil(this.state) ||
          isNil(this.state.fileList) ||
          this.state.fileList.length === 1
          ? uploadButton
          : null}
      </Upload>
    );
    const { getFieldDecorator } = this.props.form;
    if (this.props.match.params['status'] == '7') {
      this.certification = getLocale() === 'zh-CN' ? certificationNO : certificationNOEN;
    } else if (this.props.match.params['status'] == '1') {
      this.certification = getLocale() === 'zh-CN' ? certificationsuccess : certificationsuccessEN;
    } else {
      this.certification = '';
    };
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
          text={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.pallet-check' })}//查看货盘
          event={() => {
            this.onBack();
          }}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>

                <Form.Item {...formlayout} label='货物名称'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.goodsLevel) ? '' : this.state.goodsLevel
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='货物编号'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.CG) ? '' : this.state.CG
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            {
              !isNil(this.state) && this.state.CGCG == 'G' ? (
                <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='货盘存放位置'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.location) ? '' : this.state.location
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label='货物性质'>
                    <Input
                      disabled
                      value={
                        isNil(this.state) || isNil(this.state.goodsProperty) ? '' : this.state.goodsProperty
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              ) : null}

            <Row gutter={24}>

              <Col span={12}>
                <Form.Item {...formlayout} label='货物重量'>
                  <Input
                    disabled
                    suffix={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.ton' })}
                    value={
                      isNil(this.state) || isNil(this.state.goodsWeight) ? '' : this.state.goodsWeight
                    }
                  />
                </Form.Item>
              </Col>
              {
                !isNil(this.state) && this.state.CGCG == 'G'?(
                  <Col span={12}>
                    <Form.Item {...formlayout} label='体积'>
                      <Input
                        disabled
                        suffix="m³"
                        value={
                          isNil(this.state) || isNil(this.state.goodsVolume) ? '' : this.state.goodsVolume
                        }
                      />
                    </Form.Item>
                  </Col>
                ):(
                  <Col span={12}>
                    <Form.Item {...formlayout} label='所需船舶吨位'>
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.goodsVolume) ? '' : this.state.goodsVolume
                        }
                      />
                    </Form.Item>
                  </Col>
                )}

            </Row>
            {
                !isNil(this.state) && this.state.CGCG == 'G' ? (
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label='是否为重大件'>
                        <Input
                          disabled
                          className="OnlyRead"
                          value={isNil(this.state) || isNil(this.state.majorParts) ? '' : this.state.majorParts}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label='是否可叠加'>
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
                ) : null}

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label='起运港'>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.startPort) ? '' : this.state.startPort
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='目的港'>
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
            {/* {!isNil(this.state) && this.state.unloadingflag ?
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='卸货天数'>
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
                  <Form.Item {...formlayout} label='装卸货量'>
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
              : null} */}
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label='受载日期'>
                  <Input
                    disabled
                    className="OnlyRead"
                    value={isNil(this.state) || isNil(this.state.loadDate) ? '' : this.state.loadDate}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label='截止日期'>
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
                  <Form.Item {...formlayout} label='联系人'>
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
                  <Form.Item {...formlayout} label='联系方式'>
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
              {/* <Col span={12}>
                <Form.Item {...formlayout} label='是否为重大件'>
                  <Input
                    disabled
                    className="OnlyRead"
                    value={isNil(this.state) || isNil(this.state.majorParts) ? '' : this.state.majorParts}
                  />
                </Form.Item>
              </Col> */}
            </Row>
            <Row gutter={24}>
            {
              !isNil(this.state) && this.state.CGCG == 'G' ? (
                <Col span={12}>
                  <Form.Item {...formlayout} label='货物清单'></Form.Item>
                  {!isNil(this.state)  ? chuandongDefault : chuandongDefault }
                </Col>
              ):null}

              <Col span={12}>
                  <Form.Item {...smallFormItemLayout} label="备注">
                    <TextArea readOnly disabled style={{ height: '160px' }}
                      value={
                        isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                      } />
                  </Form.Item>
                </Col>
            </Row>

            {/* {!isNil(this.state) && this.userType == '3' ? (
              <Row gutter={24}>
                <Col>
                  <HrComponent text="dashed" />
                </Col>
              </Row>) : null} */}
              <div className={commonCss.title}>
                <span className={commonCss.text}>其他服务</span>
              </div>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='是否需要其他联合运输'>
                  {
                    !isNil(this.state) && this.state.unionTransport == '1' ? (
                        <Icon type="check-circle" theme="filled" />
                        ) : <Icon type="close-circle" />
                  }
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='是否需要绑扎'>

                  {
                    !isNil(this.state) && this.state.isBind == '1' ? (
                        <Icon type="check-circle" theme="filled" />
                        ) : <Icon type="close-circle" />
                  }
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='是否需港集'>
                  {
                    !isNil(this.state) && this.state.isGangji == '1' ? (
                        <Icon type="check-circle" theme="filled" />
                        ) : <Icon type="close-circle" />
                  }
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label='是否需要保险'>
                    <Col span={10}>
                      <Form.Item {...formlayout} label='海运险'>
                      {
                          !isNil(this.state) && this.state.insuranceHaiyun == '1' ? (
                              <Icon type="check-circle" theme="filled" />
                              ) : <Icon type="close-circle" />
                        }
                      </Form.Item>
                    </Col>
                    <Col span={15}>
                      <Form.Item {...formlayout} label='卡车运输险'>
                      {
                          !isNil(this.state) && this.state.insuranceKache == '1' ? (
                              <Icon type="check-circle" theme="filled" />
                              ) : <Icon type="close-circle" />
                        }
                      </Form.Item>
                    </Col>
                    <Col span={15}>
                      <Form.Item {...formlayout} label='江运海运险'>
                        {
                          !isNil(this.state) && this.state.insuranceJiangyun == '1' ? (
                              <Icon type="check-circle" theme="filled" />
                              ) : <Icon type="close-circle" />
                        }
                      </Form.Item>
                    </Col>

                  </Form.Item>
                </Col>
              </Row>

              <Form labelAlign="left">
                <Row className={commonCss.rowTop}>
                    <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                      <ButtonOptionComponent
                        type="TurnDown"
                        text="关闭"
                        event={() => this.onBack()}
                        disabled={false}
                      />
                    </Col>
                </Row>

              </Form>

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
