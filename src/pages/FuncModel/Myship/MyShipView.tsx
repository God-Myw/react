import getRequest from '@/utils/request';
import { getDictDetail, getTableEnumText, linkHref } from '@/utils/utils';
import { Col, DatePicker, Divider, Form, Input, Modal, Row, Select, Upload } from 'antd';
import { forEach, isNil, filter } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { FileMsg, MyShipFormProps } from './MyShipFormInterface';

//不通过图片
const certificationNO = require('../../Image/noPass.png');
const certificationNOEN = require('../../Image/noPassEN.png');

//通过图片
const certificationPass = require('../../Image/pass.png');
const certificationPassEN = require('../../Image/passEN.png');

//通过图片
const certificationCheck = require('../../Image/onCheck.png');
const certificationCheckEN = require('../../Image/onCheckEN.png');

const format = 'YYYY/MM/DD';

class MyShipView extends React.Component<MyShipFormProps, MyShipFormProps> {
  constructor(prop: MyShipFormProps) {
    super(prop);
  }
  certification = '';

  componentDidMount() {
    let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    getRequest('/business/ship/' + guid, param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            type: response.data.ship.type,
            shipName: response.data.ship.shipName,
            buildParticularYear: response.data.ship.buildParticularYear,
            tonNumber: response.data.ship.tonNumber,
            draft: response.data.ship.draft,
            shipDeck: response.data.ship.shipDeck,
            capacity: response.data.ship.capacity,
            anchoredPort: getTableEnumText('port', response.data.ship.anchoredPort),
            shipType: response.data.ship.shipType,
            classificationSociety: response.data.ship.classificationSociety,
            voyageArea: response.data.ship.voyageArea,
            shipCrane: response.data.ship.shipCrane,
            state: response.data.ship.state,
            startTime: response.data.ship.startTime,
            endTime: response.data.ship.endTime,
            registryStartTime: response.data.ship.registryStartTime,
            registryEndTime: response.data.ship.registryEndTime,
            leaseStartTime: response.data.ship.leaseStartTime ? moment(Number(response.data.ship.leaseStartTime)) : undefined,
            leaseEndTime: response.data.ship.leaseEndTime ? moment(Number(response.data.ship.leaseEndTime)) : undefined,
            charterWay: response.data.ship.charterWay,
            pmiDeadline: response.data.ship.pmiDeadline,
            registryDeadline: response.data.ship.registryDeadline,
            leaseDeadline: response.data.ship.leaseDeadline,
            checkStatus: response.data.ship.checkStatus,
            mmsi: response.data.ship.mmsi,
            checkRemark: response.data.checkRemark,
          });
          const regArr = filter(response.data.picList, { 'fileLog': 5 });
          const pmiArr = filter(response.data.picList, { 'fileLog': 10 });
          const leaseArr = filter(response.data.picList, { 'fileLog': 9 });
          const shipArr = filter(response.data.picList, { 'fileLog': 23 });
          if (regArr.length !== 0) {
            forEach(regArr, (pic, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', pic.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + pic.fileType, picParams, (response: any) => {
                if (response.status === 200) {
                  if (pic.fileLog === 5) {
                    this.setState({
                      registryFile: [
                        {
                          uid: index,
                          name: response.data[0].fileName,
                          status: 'done',
                          thumbUrl: response.data[0].base64,
                          fileName: pic.fileName,
                          type: pic.fileType,
                        },
                      ],
                    });
                  }
                }
              });
            });
          }
          if (pmiArr.length !== 0) {
            forEach(pmiArr, (pic, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', pic.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + pic.fileType, picParams, (response: any) => {
                if (response.status === 200) {
                  if (pic.fileLog === 10) {
                    this.setState({
                      pmiFile: [
                        {
                          uid: index,
                          name: response.data[0].fileName,
                          status: 'done',
                          thumbUrl: response.data[0].base64,
                          fileName: pic.fileName,
                          type: pic.fileType,
                        },
                      ],
                    });
                  }
                }
              });
            });
          }
          if (leaseArr.length !== 0) {
            forEach(leaseArr, (pic, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', pic.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + pic.fileType, picParams, (response: any) => {
                if (response.status === 200) {
                  if (pic.fileLog === 9) {
                    this.setState({
                      leaseFile: [
                        {
                          uid: index,
                          name: response.data[0].fileName,
                          status: 'done',
                          thumbUrl: response.data[0].base64,
                          fileName: pic.fileName,
                          type: pic.fileType,
                        },
                      ],
                    });
                  }
                }
              });
            });
          }
          if (shipArr.length !== 0) {
            let shipFileList: FileMsg[] = [];
            forEach(shipArr, (pic, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', pic.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + pic.fileType, picParams, (response: any) => {
                if (response.status === 200) {
                  if (pic.fileLog === 23) {
                    let fileList: FileMsg = {};
                    fileList.uid = index;
                    fileList.name = response.data[0].fileName;
                    fileList.status = 'done';
                    fileList.thumbUrl = response.data[0].base64;
                    fileList.fileName = pic.fileName;
                    fileList.type = pic.fileType;
                    shipFileList.push(fileList);
                    if (shipFileList.length === shipArr.length) {
                      this.setState({
                        shipFile: shipFileList,
                        picNum: shipFileList.length,
                      });
                    }
                  }
                }
              });
            });
          }
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/myship/list/' + this.props.match.params['status']);
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreviewPMI = async (file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.fileName);
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
  };

  handlePreviewReg = async (file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.fileName);
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
  };

  handlePreviewParty = async (file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.fileName);
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
  };

  handlePreviewShip = (file: any) => {
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
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    if (!isNil(this.state)) {
      if (this.state.checkStatus === 0) {
        this.certification = getLocale() === 'zh-CN' ? certificationNO : certificationNOEN;
      } else if (this.state.state !== 0 && this.state.checkStatus === 2) {
        this.certification = getLocale() === 'zh-CN' ? certificationCheck : certificationCheckEN;
      } else if (this.state.checkStatus === 1) {
        this.certification = getLocale() === 'zh-CN' ? certificationPass : certificationPassEN;
      } else {
        this.certification = '';
      }
    }

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'Myship-MyshipView.examine' })}
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.shipname' })}
                >
                  {getFieldDecorator('shipName', {
                    initialValue:
                      this.state == null || this.state.shipName == null
                        ? ''
                        : this.state.shipName.toString(),
                  })(
                    <Select disabled showArrow={false}>
                      <option value="1">
                        <FormattedMessage id="Myship-MyshipView.seller" />
                      </option>
                      <option value="2">
                        <FormattedMessage id="Myship-MyshipView.buyer" />
                      </option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.shiptype' })}
                >
                  {getFieldDecorator('shipDeck', {
                    initialValue:
                      this.state == null || this.state.shipDeck == null ? '' : this.state.shipDeck,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('ship_deck').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.shipType' })}
                >
                  {getFieldDecorator('shipType', {
                    initialValue:
                      this.state == null || this.state.shipType == null ? '' : this.state.shipType,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('ship_type').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.construct' })}
                >
                  {getFieldDecorator('buildParticularYear', {
                    initialValue:
                      this.state == null || this.state.buildParticularYear == null
                        ? ''
                        : this.state.buildParticularYear,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Myship-MyshipAdd.draft' })}>
                  {getFieldDecorator('draft', {
                    initialValue:
                      this.state == null || this.state.draft == null ? '' : this.state.draft,
                  })(<Input suffix="m" disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.deadweight' })}
                >
                  {getFieldDecorator('tonNumber', {
                    initialValue:
                      this.state == null || this.state.tonNumber == null
                        ? ''
                        : this.state.tonNumber,
                  })(<Input disabled suffix={formatMessage({ id: 'Myship-MyshipAdd.t' })} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.boat.crane' })}
                >
                  {getFieldDecorator('shipCrane', {
                    initialValue:
                      this.state == null || this.state.shipCrane == null
                        ? ''
                        : this.state.shipCrane,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.boat.port' })}
                >
                  {getFieldDecorator('anchoredPort', {
                    initialValue:
                      this.state == null || this.state.anchoredPort == null
                        ? ''
                        : this.state.anchoredPort,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.boat.area' })}
                >
                  {getFieldDecorator('voyageArea', {
                    initialValue:
                      this.state == null || this.state.voyageArea == null
                        ? ''
                        : this.state.voyageArea,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('voyage_area').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.classification.society' })}
                >
                  {getFieldDecorator('classificationSociety', {
                    initialValue:
                      this.state == null || this.state.classificationSociety == null
                        ? ''
                        : this.state.classificationSociety,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('classification_society').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.Charter.way' })}
                >
                  {getFieldDecorator('charterWay', {
                    initialValue:
                      this.state == null || this.state.charterWay == null
                        ? ''
                        : this.state.charterWay,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('charter_way').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.boat.mmsi' })}
                >
                  <Input
                    disabled
                    value={isNil(this.state) || isNil(this.state.mmsi) ? '' : this.state.mmsi}
                  />
                  {/* <Input disabled value={this.state.mmsi} /> */}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Divider dashed={true} style={{ marginBottom: 2 }} />
        <div className={commonCss.title}>
          <span className={commonCss.text}>{formatMessage({ id: 'Myship-MyshipView.PMI' })}</span>
        </div>
        <div className={commonCss.AddForm}>
          <span>{formatMessage({ id: 'Myship-MyshipAdd.certificate.p' })}</span>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="">
                  <Upload
                    action="/sys/file/upload"
                    listType="picture-card"
                    data={{ type: 1 }}
                    showUploadList={{
                      showPreviewIcon: true,
                      showDownloadIcon: false,
                      showRemoveIcon: false,
                    }}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.pmiFile) ||
                        this.state.pmiFile.length === 0
                        ? ''
                        : this.state.pmiFile
                    }
                    onPreview={this.handlePreviewPMI}
                  ></Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.start.date' })}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled
                    format={format}
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.startTime)
                        ? moment()
                        : moment(Number(this.state.startTime))
                    }
                  />
                </Form.Item>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.end.date' })}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled
                    format={format}
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.endTime)
                        ? moment()
                        : moment(Number(this.state.endTime))
                    }
                  />
                </Form.Item>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.PMI.deadline' })}
                >
                  {getFieldDecorator('PMI_term', {
                    initialValue:
                      this.state == null || this.state.pmiDeadline == null
                        ? ''
                        : this.state.pmiDeadline,
                  })(<Input suffix="年" disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <span>{formatMessage({ id: 'Myship-MyshipAdd.certificate.registry' })}</span>
                <Form.Item {...formlayout} label="">
                  <Upload
                    action="/sys/file/upload"
                    listType="picture-card"
                    data={{ type: 2 }}
                    showUploadList={{
                      showPreviewIcon: true,
                      showDownloadIcon: false,
                      showRemoveIcon: false,
                    }}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.registryFile) ||
                        this.state.registryFile.length === 0
                        ? ''
                        : this.state.registryFile
                    }
                    onPreview={this.handlePreviewReg}
                  ></Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.start.date' })}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled
                    format={format}
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.registryStartTime)
                        ? moment()
                        : moment(Number(this.state.registryStartTime))
                    }
                  />
                </Form.Item>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.end.date' })}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled
                    format={format}
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.registryEndTime)
                        ? moment()
                        : moment(Number(this.state.registryEndTime))
                    }
                  />
                </Form.Item>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.PMI.deadline' })}
                >
                  {getFieldDecorator('PMI_term', {
                    initialValue:
                      this.state == null || this.state.registryDeadline == null
                        ? ''
                        : this.state.registryDeadline,
                  })(<Input suffix="年" disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <span>{formatMessage({ id: 'Myship-MyshipAdd.Charter.party' })}</span>
                <Form.Item {...formlayout} label="">
                  <Upload
                    action="/sys/file/upload"
                    listType="picture-card"
                    data={{ type: 4 }}
                    showUploadList={{
                      showPreviewIcon: true,
                      showDownloadIcon: false,
                      showRemoveIcon: false,
                    }}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.leaseFile) ||
                        this.state.leaseFile.length === 0
                        ? ''
                        : this.state.leaseFile
                    }
                    onPreview={this.handlePreviewParty}
                  ></Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.start.date' })}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled
                    format={format}
                    className="OnlyRead"
                    placeholder=''
                    value={
                      isNil(this.state) || isNil(this.state.leaseStartTime)
                        ? undefined
                        : moment(Number(this.state.leaseStartTime))
                    }
                  />
                </Form.Item>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.end.date' })}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled
                    format={format}
                    className="OnlyRead"
                    placeholder=''
                    value={
                      isNil(this.state) || isNil(this.state.leaseEndTime)
                        ? undefined
                        : moment(Number(this.state.leaseEndTime))
                    }
                  />
                </Form.Item>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.PMI.deadline' })}
                >
                  {getFieldDecorator('PMI_term', {
                    initialValue:
                      this.state == null || this.state.leaseDeadline == null
                        ? ''
                        : this.state.leaseDeadline,
                  })(<Input suffix="年" placeholder='' disabled />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Divider dashed={true} style={{ marginBottom: 2 }} />
        <div className={commonCss.title}>
          <span className={commonCss.text}>
            {formatMessage({ id: 'Myship-MyshipView.upload.picture' })}
          </span>
        </div>
        <div className={commonCss.AddForm}>
          <Form.Item {...formlayout}>
            <Upload
              action="/sys/file/upload"
              listType="picture-card"
              data={{ type: 3 }}
              showUploadList={{
                showPreviewIcon: true,
                showDownloadIcon: false,
                showRemoveIcon: false,
              }}
              fileList={
                isNil(this.state) || isNil(this.state.shipFile) || this.state.shipFile.length === 0
                  ? ''
                  : this.state.shipFile
              }
              onPreview={this.handlePreviewShip}
            ></Upload>
            ,
          </Form.Item>
        </div>
        <Divider dashed={true} style={{ marginBottom: 2 }} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={24}>
                {!isNil(this.state) && this.state.checkStatus !== 2 ? (
                  <Form.Item
                    {...formItemLayout}
                    label={formatMessage({ id: 'Myship-MyshipAdd.approval.opinion' })}
                  >
                    <span>
                      {!isNil(this.state) && !isNil(this.state.checkRemark)
                        ? this.state.checkRemark
                        : ''}
                    </span>
                  </Form.Item>
                ) : null}
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Close"
                  text={formatMessage({ id: 'Myship-MyshipView.close' })}
                  event={() => this.onBack()}
                  disabled={false}
                />
              </Col>
              <Col span={7}></Col>
              <Col span={5}>
                {!isNil(this.state) &&
                  (this.state.checkStatus === 0 ||
                    this.state.checkStatus === 1 ||
                    this.state.checkStatus === 2) ? (
                  <div className={commonCss.picTopAndBottom}>
                    <img
                      style={{ marginTop: '-17%' }}
                      src={this.certification}
                      className={commonCss.imgWidth}
                    />
                  </div>
                ) : null}
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
          <a onClick={() => linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
        </Modal>
      </div>
    );
  }
}

const MyShipView_Form = Form.create({ name: 'MyShipView_Form' })(MyShipView);

export default MyShipView_Form;
