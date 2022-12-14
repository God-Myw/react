import getRequest from '@/utils/request';
import { Col, Form, Input, Row, Upload, Modal } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { formatMessage } from 'umi-plugin-locale';
import PalletFormProps from './PalletFormInterface';
import { getTableEnumText, linkHref } from '@/utils/utils';
import moment from 'moment';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { getLocale } from 'umi-plugin-react/locale';
moment.locale(getLocale());

type PalletProps = PalletFormProps & RouteComponentProps;
class PalletAdd extends React.Component<RouteComponentProps, PalletProps> {
  onBack = () => {
    this.props.history.push('/pallet');
  };
  componentDidMount() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let params: Map<string, string> = new Map();
    params.set('type', '1');
    getRequest('/business/pallet/' + uid, params, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            goodsLevel: getTableEnumText('goods_name', response.data.pallet.goodsLevel),
            // goodsSubLevel: response.data.pallet.goodsSubLevel,
            goodsType: getTableEnumText('goods_type', response.data.pallet.goodsType),
            goodsWeight: response.data.pallet.goodsWeight,
            goodsVolume: response.data.pallet.goodsVolume,
            goodsCount: response.data.pallet.goodsCount,
            isSuperposition: getTableEnumText('is_superposition', response.data.pallet.isSuperposition),
            startPort: getTableEnumText('port', response.data.pallet.startPort),
            destinationPort: getTableEnumText('port', response.data.pallet.destinationPort),
            loadDate: String(moment(Number(response.data.pallet.loadDate)).format('YYYY-MM-DD')),
            endDate: String(moment(Number(response.data.pallet.endDate)).format('YYYY-MM-DD')),
            contacter: response.data.pallet.contacter,
            contactPhone: response.data.pallet.contactPhone,
            phoneCode: response.data.pallet.phoneCode,
            loadingUnloadingVolume: response.data.pallet.loadingUnloadingVolume,
            unloadingDays: response.data.pallet.unloadingDays,
            majorParts: response.data.pallet.majorParts == 0 ? formatMessage({ id: 'pallet-palletAdd.ImportantpartsN' }) : formatMessage({ id: 'pallet-palletAdd.ImportantpartsY' }),
            location: getTableEnumText('cargo_save_location', response.data.pallet.location),
            goodsProperty: getTableEnumText('goods_property', response.data.pallet.goodsProperty),
            // fileName: response.data.palletFileList[0].fileName,
            unloadingflag: response.data.pallet.goodsProperty === 3 ? true : false,
          });
          let picParams: Map<string, string> = new Map();
          picParams.set('fileNames', response.data.palletFileList[0].fileName);
          getRequest('/sys/file/getThumbImageBase64/' + response.data.palletFileList[0].type, picParams, (response: any) => { //BUG131改修fileType.pallet_add
            if (response.status === 200) {
              this.setState({
                fileList: [{
                  uid: '1',
                  name: response.data[0].fileName,
                  status: 'done',
                  thumbUrl: response.data[0].base64,
                }],
              })
            }
          });
        }
      }
    });
  }

  //取消预览
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  // 图片预览
  handlePreview = async (file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', this.state.fileName);
    getRequest('/sys/file/getImageBase64/' + fileType.pallet_add, params, (response: any) => {
      this.setState({
        previewImage: response.data.file.base64,
        previewVisible: true,
      });
    });
  };

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={formatMessage({ id: 'pallet-palletView.pallet.view' })} event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left" >
            <Row gutter={24}>
              <Col span={12}>
              {/* 货物名称 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletList.goods.name' })}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.goodsLevel) ? '' : this.state.goodsLevel
                    }
                  />
                </Form.Item>
              </Col>
              {/* 货物类型 */}
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.pallet.type' })}>
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
                {/* 货物存放位置 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.goods.place' })}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.goodsLevel) ? '' : this.state.location
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
              {/* 货物性质 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.goods.nature' })}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.goodsType) ? '' : this.state.goodsProperty
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
              {/* 货物重量 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.goods.weight' })}>
                  <Input
                    disabled
                    suffix={formatMessage({ id: 'pallet-palletAdd.goods.weight.t' })}
                    value={
                      isNil(this.state) || isNil(this.state.goodsWeight) ? '' : this.state.goodsWeight
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
              {/* 体积 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.goods.volume' })}>
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
                {/* 货物件数 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.goods.number' })}>
                  <Input
                    disabled
                    suffix={formatMessage({ id: 'pallet-palletAdd.number' })}
                    value={
                      isNil(this.state) || isNil(this.state.goodsCount) ? '' : this.state.goodsCount
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                {/* 是否可叠加 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.superposition-or-not' })}>
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
                {/* 起运港 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.port.shipment' })}>
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.startPort) ? '' : this.state.startPort
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                {/* 目的港 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.destination' })}>
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
                {/* 卸货天数 */}
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
                  {/* 装卸货量', */}
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
              {/* 受载日期 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.loading.time' })}>
                  <Input
                    disabled
                    className="OnlyRead"
                    value={isNil(this.state) || isNil(this.state.loadDate) ? '' : this.state.loadDate}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
              {/* 截止日期 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.deadline' })}>
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
              {/* 联系人 */}
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
              {/* 联系方式 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.contact.way' })}>
                  <Input
                    disabled
                    placeholder="+86"
                    style={{ width: '15%' }}
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.phoneCode)
                        ? ''
                        : this.state.phoneCode
                    }
                  />
                  <Input
                    disabled
                    style={{ width: '85%' }}
                    value={
                      isNil(this.state) || isNil(this.state.contactPhone)
                        ? ''
                        : this.state.contactPhone
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                {/* 是否为重大件 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.whether.ItIs.heavyOrNot' })}>
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.majorParts)
                        ? ''
                        : this.state.majorParts
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
              {/* 添加货物清单 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'pallet-palletAdd.add.goods.list' })}></Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="">
                  <Upload
                    action="/sys/file/upload"
                    listType="picture-card"
                    data={{ type: 1 }}
                    showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.fileList) ||
                        this.state.fileList.length === 0
                        ? ''
                        : this.state.fileList
                    }
                    onPreview={this.handlePreview}
                  >
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={14} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  disabled={false}
                  type="CloseButton"
                  text={formatMessage({ id: 'pallet-palletView.close' })}
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

const PalletAdd_Form = Form.create({ name: 'PalletAdd_Form' })(PalletAdd);

export default PalletAdd_Form;
