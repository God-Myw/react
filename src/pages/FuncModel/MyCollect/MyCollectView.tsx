import { fileType } from '@/pages/Common/Components/FileTypeCons';
import getRequest, { postRequest } from '@/utils/request';
import { getTableEnumText, linkHref } from '@/utils/utils';
import { Col, Form, Input, message, Modal, Row, Upload } from 'antd';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import MyCollectFormProps, { FileModel } from './MyCollectFormInterface';
const defaultpic = require('../../Image/default.png');

class MyCollectView extends React.Component<MyCollectFormProps, MyCollectFormProps> {
  private userId = localStorage.getItem('userId');
  constructor(props: MyCollectFormProps) {
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
                  fileLists.uid = index;
                  fileLists.name = res.data[0].fileName;
                  fileLists.status = 'done';
                  fileLists.thumbUrl = res.data[0].base64;
                  data_Source.push(fileLists);
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
    this.props.history.push('/mycollect');
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

  // 取消收藏货盘(船东)
  handleCollect() {
    let params = {
      type: "2",
      userId: this.userId,
      palletId: this.state.guid
    }
    postRequest('/business/pallet/collect', JSON.stringify(params), (response: any) => {
      if (response.status === 200) {
        // 跳转首页
        this.props.history.push('/mycollect');
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
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'collect-collect.examine.collected' })}
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
                {isNil(this.state) ||
                  isNil(this.state.fileList) ||
                  this.state.fileList.length === 0 ?
                  (<img
                    style={{ width: '104px', height: '104px'}}
                    src={defaultpic}
                  />)
                  :
                  (<Upload
                    action=""
                    listType="picture-card"
                    showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
                    fileList={this.state.fileList}
                    onPreview={this.handlePreview}
                  >
                  </Upload>)
                }

              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Collect"
                  text={formatMessage({ id: 'pallet-palletAdd.cancel.collection' })}
                  event={() => {
                    this.handleCollect();
                  }}
                />

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

const MyCollectView_Form = Form.create({ name: 'MyCollectView_Form' })(
  MyCollectView,
);

export default MyCollectView_Form;
