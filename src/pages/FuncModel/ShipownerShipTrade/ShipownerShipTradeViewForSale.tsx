import getRequest from '@/utils/request';
import { getDictDetail, linkHref } from '@/utils/utils';
import { Col, Form, Input, Row, Select, Divider, Upload, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { isNil, forEach } from 'lodash';
import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { ShipownerShipTradeFormProps, FileMsg } from './ShipownerShipTradeFormInterface';

class ShipownerShipTradeView extends React.Component<ShipownerShipTradeFormProps, ShipownerShipTradeFormProps> {
  constructor(props: ShipownerShipTradeFormProps) {
    super(props);
  }

  //初始化事件111
  componentDidMount() {
    this.setState({
      contacter: '',
      phoneCode: '',
      phoneNumber: '',
      remark: '',
    });
    let guid = this.props.match.params['guid'];
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    getRequest('/business/shipTrade/' + guid, param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            tradeType: response.data.shipTrade.tradeType,
            shipType: response.data.shipTrade.shipType,
            tonNumber: response.data.shipTrade.tonNumber,
            shipAge: response.data.shipTrade.shipAge,
            classificationSociety: response.data.shipTrade.classificationSociety,
            voyageArea: response.data.shipTrade.voyageArea,
            contacter: response.data.shipTrade.contacter,
            phoneCode: response.data.shipTrade.phoneCode,
            phoneNumber: response.data.shipTrade.phoneNumber,
            remark: response.data.shipTrade.remark,
            email: response.data.shipTrade.email,

            imo: response.data.shipTrade.imo,   //IMO号
            shipName: response.data.shipTrade.shipName,   //船名
            buildAddress: response.data.shipTrade.buildAddress, //建造地点
            buildParticularYear: response.data.shipTrade.buildParticularYear,//建造年份
            draft: response.data.shipTrade.draft,//吃水
            netWeight: response.data.shipTrade.netWeight,//净重
            hatchesNumber: response.data.shipTrade.hatchesNumber,//舱口数量
            checkFileList: response.data.checkFileList,
            ownershipFileList: response.data.ownershipFileList,
            loadLineFileList: response.data.loadLineFileList,
            specificationFileList: response.data.specificationFileList,
            airworthinessFileList: response.data.airworthinessFileList,
            shipFileList: response.data.shipFileList,
          });
          //船舶检验证书
          if (!isNil(response.data.checkFileList)) {
            let checkFileList: FileMsg[] = [];
            forEach(response.data.checkFileList, (pic, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', pic.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response1: any) => {
                  if (response1.status === 200) {
                    // if (pic.fileLog === 17) {
                      let fileList: FileMsg = {};
                      fileList.uid = index;
                      fileList.name = response1.data[0].fileName;
                      fileList.status = 'done';
                      fileList.thumbUrl = response1.data[0].base64;
                      fileList.fileName = pic.fileName;
                      fileList.type = pic.type;
                      checkFileList.push(fileList);
                      if (checkFileList.length === response.data.checkFileList.length) {
                        this.setState({
                          checkFile: checkFileList,
                          picNum: checkFileList.length,
                        });
                      }
                    // }
                  }
                },
              );
            });
          }
          //船舶所有权证书
          if (!isNil(response.data.ownershipFileList)) {
            let ownershipFileList: FileMsg[] = [];
            forEach(response.data.ownershipFileList, (pic, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', pic.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response2: any) => {
                  if (response2.status === 200) {
                    // if (pic.fileLog === 18) {
                      let fileList: FileMsg = {};
                      fileList.uid = index;
                      fileList.name = response2.data[0].fileName;
                      fileList.status = 'done';
                      fileList.thumbUrl = response2.data[0].base64;
                      fileList.fileName = pic.fileName;
                      fileList.type = pic.type;
                      ownershipFileList.push(fileList);
                      if (ownershipFileList.length === response.data.ownershipFileList.length) {
                        this.setState({
                          ownershipFile: ownershipFileList,
                          picNum: ownershipFileList.length,
                        });
                      }
                    // }
                  }
                },
              );
            });
          }
          //船舶载重线证书
          if (!isNil(response.data.loadLineFileList)) {
            let loadLineFileList: FileMsg[] = [];
            forEach(response.data.loadLineFileList, (pic, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', pic.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response3: any) => {
                  if (response3.status === 200) {
                    // if (pic.fileLog === 8) {
                      let fileList: FileMsg = {};
                      fileList.uid = index;
                      fileList.name = response3.data[0].fileName;
                      fileList.status = 'done';
                      fileList.thumbUrl = response3.data[0].base64;
                      fileList.fileName = pic.fileName;
                      fileList.type = pic.type;
                      loadLineFileList.push(fileList);
                      if (loadLineFileList.length === response.data.loadLineFileList.length) {
                        this.setState({
                          loadLineFile: loadLineFileList,
                          picNum: loadLineFileList.length,
                        });
                      }
                    // }
                  }
                },
              );
            });
          }
          //船舶规范
          if (!isNil(response.data.specificationFileList)) {
            let specificationFileList: FileMsg[] = [];
            forEach(response.data.specificationFileList, (pic, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', pic.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response4: any) => {
                  if (response4.status === 200) {
                    // if (pic.fileLog === 19) {
                      let fileList: FileMsg = {};
                      fileList.uid = index;
                      fileList.name = response4.data[0].fileName;
                      fileList.status = 'done';
                      fileList.thumbUrl = response4.data[0].base64;
                      fileList.fileName = pic.fileName;
                      fileList.type = pic.type;
                      specificationFileList.push(fileList);
                      if (specificationFileList.length === response.data.specificationFileList.length) {
                        this.setState({
                          specificationFile: specificationFileList,
                          picNum: specificationFileList.length,
                        });
                      }
                    // }
                  }
                },
              );
            });
          }
          //船舶适航证书
          if (!isNil(response.data.airworthinessFileList)) {
            let airworthinessFileList: FileMsg[] = [];
            forEach(response.data.airworthinessFileList, (pic, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', pic.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response5: any) => {
                  if (response5.status === 200) {
                    // if (pic.fileLog === 20) {
                      let fileList: FileMsg = {};
                      fileList.uid = index;
                      fileList.name = response5.data[0].fileName;
                      fileList.status = 'done';
                      fileList.thumbUrl = response5.data[0].base64;
                      fileList.fileName = pic.fileName;
                      fileList.type = pic.type;
                      airworthinessFileList.push(fileList);
                      if (airworthinessFileList.length === response.data.airworthinessFileList.length) {
                        this.setState({
                          airworthinessFile: airworthinessFileList,
                          picNum: airworthinessFileList.length,
                        });
                      }
                    // }
                  }
                },
              );
            });
          }
          //船舶照片
          if (!isNil(response.data.shipFileList)) {
            let shipFileList: FileMsg[] = [];
            forEach(response.data.shipFileList, (pic, index) => {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', pic.fileName);
              getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response6: any) => {
                  if (response6.status === 200) {
                    // if (pic.fileLog === 13) {
                      let fileList: FileMsg = {};
                      fileList.uid = index;
                      fileList.name = response6.data[0].fileName;
                      fileList.status = 'done';
                      fileList.thumbUrl = response6.data[0].base64;
                      fileList.fileName = pic.fileName;
                      fileList.type = pic.type;
                      shipFileList.push(fileList);
                      if (shipFileList.length === response.data.shipFileList.length) {
                        this.setState({
                          shipFile: shipFileList,
                          picNum: shipFileList.length,
                        });
                      }
                    // }
                  }
                },
              );
            });
          }
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/ShipownerShipTrade');
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.name);
    getRequest('/sys/file/getImageBase64/' + file.type, params, (response: any) => {
      this.setState({
        previewImage: response.data.file.base64,
        previewVisible: true,
      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.examineShipTradeInformation' })} event={() => this.onBack()} />
        <Form labelAlign="left">
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.tradeType' })}>
                  {getFieldDecorator('tradeType', {
                    initialValue:
                      this.state == null || this.state.tradeType == null
                        ? ''
                        : this.state.tradeType,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('trade_type').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.shipType' })}>
                  {getFieldDecorator('shipType', {
                    initialValue:
                      this.state == null || this.state.shipType == null
                        ? ''
                        : this.state.shipType,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('ship_type').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.tonnage' })}>
                  {getFieldDecorator('tonNumber', {
                    initialValue:
                      this.state == null || this.state.tonNumber == null
                        ? ''
                        : this.state.tonNumber,
                  })(<Input suffix={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.ton' })} disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.shipAge' })}>
                  {getFieldDecorator('shipAge', {
                    initialValue:
                      this.state == null || this.state.shipAge == null
                        ? ''
                        : this.state.shipAge,
                  })(
                    <Select disabled showArrow={false}>
                      {getDictDetail('ship_age').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.classificationSociety' })}>
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
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.voyageArea' })}>
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
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.name' })}>
                  {getFieldDecorator('shipName', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipName) ? '' : this.state.shipName,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.IMO' })}>
                  {getFieldDecorator('IMONo', {
                    initialValue:
                    isNil(this.state) || isNil(this.state.imo) ? '' : this.state.imo,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.place' })}>
                  {getFieldDecorator('buildAddress', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.buildAddress) ? '' : this.state.buildAddress,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.year' })}>
                  {getFieldDecorator('IMONo', {
                    initialValue:
                    isNil(this.state) || isNil(this.state.buildParticularYear) ? '' : this.state.buildParticularYear,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.draft' })}>
                  {getFieldDecorator('draft', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.draft) ? '' : this.state.draft,
                  })(<Input suffix='m' disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.weight' })}>
                  {getFieldDecorator('netWeight', {
                    initialValue:
                    isNil(this.state) || isNil(this.state.netWeight) ? '' : this.state.netWeight,
                  })(<Input suffix={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.ton' })} disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.contacter' })}>
                  {getFieldDecorator('contacter', {
                    initialValue:
                      this.state == null || this.state.contacter == null
                        ? ''
                        : this.state.contacter,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.number' })}>
                  {getFieldDecorator('hatchesNumber', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.hatchesNumber) ? '' : this.state.hatchesNumber,
                  })(<Input suffix={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.ge' })} disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'index-accountManager-email' })}>
                  {getFieldDecorator('email', {
                    initialValue:
                      this.state == null || this.state.email == null
                        ? ''
                        : this.state.email,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.phoneNumber' })}>
                  <Input
                    disabled
                    placeholder="+86"
                    style={{ width: '15%' }}
                    value={
                      isNil(this.state) || isNil(this.state.phoneCode) ? '' : this.state.phoneCode
                    }
                  />
                  <Input
                    disabled
                    style={{ width: '85%' }}
                    value={
                      isNil(this.state) || isNil(this.state.phoneNumber)
                        ? ''
                        : this.state.phoneNumber
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Divider dashed={true} style={{ marginBottom: 2 }} />
          <div className={commonCss.title}>
            <span className={commonCss.text}>
              {formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificate' })}
            </span>
          </div>
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={24}>
                <span>{formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateA' })}</span>
                <Form.Item {...formlayout}>
                  <Upload
                    action=''
                    listType="picture-card"
                    showUploadList={{showPreviewIcon: true,showDownloadIcon: false,showRemoveIcon: false,}}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.checkFile) ||
                        this.state.checkFile.length === 0
                        ? ''
                        : this.state.checkFile
                    }
                    onPreview={this.handlePreview}
                  ></Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <span>{formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateB' })}</span>
                <Form.Item {...formlayout}>
                  <Upload
                    action=''
                    listType="picture-card"
                    showUploadList={{showPreviewIcon: true,showDownloadIcon: false,showRemoveIcon: false,}}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.ownershipFile) ||
                        this.state.ownershipFile.length === 0
                        ? ''
                        : this.state.ownershipFile
                    }
                    onPreview={this.handlePreview}
                  ></Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <span>{formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateC' })}</span>
                <Form.Item {...formlayout} label="">
                  <Upload
                    action=''
                    listType="picture-card"
                    showUploadList={{showPreviewIcon: true,showDownloadIcon: false,showRemoveIcon: false,}}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.loadLineFile) ||
                        this.state.loadLineFile.length === 0
                        ? ''
                        : this.state.loadLineFile
                    }
                    onPreview={this.handlePreview}
                  ></Upload>
                </Form.Item>
              </Col>
              <Col span={8}>
                <span>{formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateD' })}</span>
                <Form.Item {...formlayout} label="">
                  <Upload
                    action=''
                    listType="picture-card"
                    showUploadList={{showPreviewIcon: true,showDownloadIcon: false,showRemoveIcon: false,}}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.specificationFile) ||
                        this.state.specificationFile.length === 0
                        ? ''
                        : this.state.specificationFile
                    }
                    onPreview={this.handlePreview}
                  ></Upload>
                </Form.Item>
              </Col>
              <Col span={8}>
                <span>{formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateE' })}</span>
                <Form.Item {...formlayout} label="">
                  <Upload
                      action=''
                      listType="picture-card"
                      showUploadList={{showPreviewIcon: true,showDownloadIcon: false,showRemoveIcon: false,}}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.airworthinessFile) ||
                          this.state.airworthinessFile.length === 0
                          ? ''
                          : this.state.airworthinessFile
                      }
                      onPreview={this.handlePreview}
                    ></Upload>
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Divider dashed={true} style={{ marginBottom: 2 }} />
          <div className={commonCss.title}>
            <span className={commonCss.text}>
              {formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.upload.pictures' })}
            </span>
          </div>
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formlayout}>
                    <Upload
                      action=''
                      listType="picture-card"
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: false,
                      }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.shipFile) ||
                          this.state.shipFile.length === 0
                          ? ''
                          : this.state.shipFile
                      }
                      onPreview={this.handlePreview}
                    ></Upload>,
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Divider dashed={true} style={{ marginBottom: 2 }} />
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.otherDescription' })}></Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('remark', {
                    initialValue:
                      this.state == null || this.state.remark == null ? '' : this.state.remark,
                  })(<TextArea style={{height:90}} disabled />)}

                </Form.Item>
              </Col>
            </Row>
          </div>
          <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="CloseButton"
                  text={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.shutDown' })}
                  event={() => this.onBack()}
                  disabled={false}
                />
              </Col>
              <Col span={12}></Col>
            </Row>
        </Form>
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

const ShipTradeView_Form = Form.create({ name: 'shipTradeView_Form' })(ShipownerShipTradeView);

export default ShipTradeView_Form;
