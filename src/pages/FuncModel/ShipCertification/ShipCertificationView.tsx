import getRequest, { putRequest } from '@/utils/request';
import { Col, Form, Input, Modal, Row, Upload, message, DatePicker } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil, forEach, filter } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import HrComponent from '../../Common/Components/HrComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import ShipCertificationFormProps from './ShipCertificationFormInterface';
import { FileModel } from './FileModel';
import { getTableEnumText, linkHref } from '@/utils/utils';
import moment from 'moment';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { getLocale } from 'umi-plugin-react/locale';
import debug from 'debug';

const { TextArea } = Input;

type CertificationProps = ShipCertificationFormProps & RouteComponentProps;

//不通过图片
const certificationNO = require('../../Image/noPass.png');
const certificationNOEN = require('../../Image/noPassEN.png');

//通过图片
const certificationsuccess = require('../../Image/pass.png');
const certificationsuccessEN = require('../../Image/passEN.png');

const format = 'YYYY/MM/DD';

class ShipCertificationView extends React.Component<ShipCertificationFormProps, CertificationProps> {
  changeSrc = '';
  certification = '';
  constructor(props: ShipCertificationFormProps) {
    super(props);
  }

  componentDidMount() {
    this.getData();
  }
  getData() {
    this.setState(
      {
        visible: false,
        previewVisible: false,
        previewImage: '',
        aFileList: [],
        bFileList: [],
        cFileList: [],
        pFileList: [],
        CPZP:[],
        isChinaShips:(this.props.match.params['isChinaShip']=='3'?'0':this.props.match.params['isChinaShip']),
      },
      () => {
        let param: Map<string, string> = new Map();
        param.set('type', '1');
        getRequest('/business/ship/' + this.props.match.params['guid'], param, (response: any) => {
          console.log(this.state.isChinaShip)
          if (response.status === 200) {
            if (!isNil(response.data)) {
              //  if (response.data.userDataChecks.guid === id) {
                //船舶等级证书时间
                let registryStartTime = response.data.ship.registryStartTime ? moment(response.data.ship.registryStartTime).format("YYYY-MM-DD"):'';
                let registryEndTime = response.data.ship.registryEndTime ? moment(response.data.ship.registryEndTime).format("YYYY-MM-DD"):'';
                //租船合同时间
                let leaseStartTime = response.data.ship.leaseStartTime ? moment(response.data.ship.leaseStartTime).format("YYYY-MM-DD"):'';
                let leaseEndTime = response.data.ship.leaseEndTime ? moment(response.data.ship.leaseEndTime).format("YYYY-MM-DD"):'';

                console.log(leaseStartTime)
              let PL = response.data.picList;
              forEach(PL,(filname) => {
                console.log(filname)
                if(filname.fileLog == 5){
                  this.setState({
                    CBDJZS:`http://58.33.34.10:10443/images/ship/`+filname.fileName//船舶登记证书
                  })
                }else if(filname.fileLog == 9){
                  this.setState({
                    ZCHT:`http://58.33.34.10:10443/images/user/`+filname.fileName//租船合同
                  })
                }else if(filname.fileLog == 10){
                  this.setState({
                    CDHPZS:`http://58.33.34.10:10443/images/ship/`+filname.fileName//船东互保证书
                  })
                }else{
                  this.setState({
                    CPZP: [...this.state.CPZP,filname.fileName],
                  })
                }
              });
              console.log(this.state.CPZP)
              // console.log(this.state.CBDJZS);
              // console.log(this.state.ZCHT);
              // console.log(this.state.CDHPZS);
              this.setState({
                ship: response.data.ship,//航次对象
                picList: response.data.picList,//附件
                shipChecks: response.data.checkRemark,

                registryStartTime:registryStartTime,//船舶等级证书时间开始
                registryEndTime:registryEndTime,//船舶等级证书时间结束

                leaseStartTime:leaseStartTime,//租船合同时间开始
                leaseEndTime:leaseEndTime,//租船合同时间结束

                CDHBURL : `http://58.33.34.10:10443/images/ship/`,//船东互保证书

                CBDJURL:`http://58.33.34.10:10443/images/ship/`,//船舶登记证书

                ZPHTURL:`http://58.33.34.10:10443/images/user/`,//租聘合同

                CPZPURL:`http://58.33.34.10:10443/images/ship/`,//船舶照片URL
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
                          bFileList: [
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
                          aFileList: [
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
                          pFileList: [
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
                let shipFileList: FileModel[] = [];
                forEach(shipArr, (pic, index) => {
                  let picParams: Map<string, string> = new Map();
                  picParams.set('fileNames', pic.fileName);
                  getRequest('/sys/file/getThumbImageBase64/' + pic.fileType, picParams, (response: any) => {
                    if (response.status === 200) {
                      if (pic.fileLog === 23) {
                        let fileList: FileModel = {};
                        fileList.uid = index;
                        fileList.name = response.data[0].fileName;
                        fileList.status = 'done';
                        fileList.thumbUrl = response.data[0].base64;
                        fileList.fileName = pic.fileName;
                        fileList.type = pic.fileType;
                        shipFileList.push(fileList);
                        if (shipFileList.length === shipArr.length) {
                          this.setState({
                            cFileList: shipFileList,
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
      },
    );
  }

  // 图片预览
  handlePreview = (type: any, file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.fileName);
    getRequest('/sys/file/getImageBase64/' + type, params, (response: any) => {
      this.setState({
        previewImage: response.data.file.base64,
        previewVisible: true,
      });
    });
  };

    // 图片放大
    showModal = (a) => {

      this.setState({
        visible: true,
      });
      this.setState({
        bigImg:a
      })
    };

    handleOk = (e: any) => {
      // console.log(e);
      this.setState({
        visible: false,
      });
    };

    handleCancel = (e: any) => {
      // console.log(e);
      this.setState({
        visible: false,
      });
    };

  //取消预览
  // handleCancel = () => {
  //   this.setState({ previewVisible: false });
  // };

  // 返回
  onBack = () => {
    //得到当前审核状态
    let status = this.props.match.params['status'] ? this.props.match.params['status'] : '';
    // 跳转首页
    this.props.history.push(`/shipcertification/list/` + status);
  };

  // 驳回或审批通过
  turnDown = (value: any) => { debug
    let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let requestData = {};
    console.log(value === 0 ? this.state.checkRemark : '');
    requestData = {
      checkStatus: value,
      guid: Number(guid),
      checkRemark: value === 0 ? this.state.checkRemark : '',
    };
    if (value == 0) {
      this.props.form.validateFields((err: any, values: any) => {
        //需要审批意见
        if (!err) {
          // 资料认证审批
          putRequest('/business/ship/shipCheck', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              message.success('驳回成功');
              this.props.history.push('/shipcertification/list');
            } else {
              message.error(response.message);
            }
          });
        }
      });
    } else {
      putRequest('/business/ship/shipCheck', JSON.stringify(requestData), (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          message.success('审批通过');
          this.props.history.push('/shipcertification/list');
        } else {
          message.error(response.message);
        }
      });
    }
  };

  render() {
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const { getFieldDecorator } = this.props.form;
    if (this.props.match.params['status'] == '0') {
      this.certification = getLocale() === 'zh-CN' ? certificationNO : certificationNOEN;
    } else if (this.props.match.params['status'] == '1') {
      this.certification = getLocale() === 'zh-CN' ? certificationsuccess : certificationsuccessEN;
    } else {
      this.certification = '';
    }
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={!isNil(this.state) && this.state.isChinaShips == '0'?"国际船舶信息":"国内船舶信息"} event={() => this.onBack()} />

           {/* 图片放大 */}
           <Modal
            title=""
            visible={isNil(this.state) || isNil(this.state.visible) ? '' : this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
            <img src={isNil(this.state) || isNil(this.state.bigImg) ? '' : this.state.bigImg} alt="" style={{ width: '90%' }}/>
            {/* <img src={isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype)} alt="" style={{ width: '60%' }}/> */}
            {/* isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.Url + item.fileName) */}
          </Modal>

        <div className={commonCss.AddForm}>

          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="船名">
                  <Input readOnly disabled value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.shipName)
                    ? ''
                    : this.state.ship.shipName} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="船型">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.shipDeck)
                    ? ''
                    : getTableEnumText('ship_deck', this.state.ship.shipDeck)} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="船舶类型">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.shipType)
                    ? ''
                    : getTableEnumText('ship_type', this.state.ship.shipType)} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="建造年份">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.buildParticularYear)
                    ? ''
                    : this.state.ship.buildParticularYear} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="吃水">
                  <Input suffix="m" disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.draft)
                    ? ''
                    : this.state.ship.draft} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="载重吨">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.tonNumber)
                    ? ''
                    : this.state.ship.tonNumber} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船吊">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.shipCrane)
                    ? ''
                    : this.state.ship.shipCrane} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="所在港口">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.anchoredPort)
                    ? ''
                    : getTableEnumText('port', this.state.ship.anchoredPort)} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="航区">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.voyageArea)
                    ? ''
                    : getTableEnumText('voyage_area', this.state.ship.voyageArea)} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="船级社">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.classificationSociety)
                    ? ''
                    : getTableEnumText('classification_society', this.state.ship.classificationSociety)} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="租船方式">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.charterWay)
                    ? ''
                    : getTableEnumText('charter_way', this.state.ship.charterWay)} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label='MMSI'>
                  <Input
                    disabled
                    value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.mmsi) ? '' : this.state.ship.mmsi}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>{' '}
          </Form>
        </div>
        <div className={commonCss.title}>
          <span className={commonCss.text}>证书</span>
        </div>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
          {

            !isNil(this.state) && this.state.isChinaShips == '0'?(
              <Row className={commonCss.rowTop} gutter={24}>
                <Col span={12}>
                  <Form.Item label="船东互保证书" required className={commonCss.detailPageLabel}>
                    <img
                    src={isNil(this.state) || isNil(this.state.CDHPZS) ? '' : this.state.CDHPZS}
                    alt=""
                    style={{ width: '20%' }}
                    onClick={ () => { this.showModal(isNil(this.state) ||  isNil(this.state.CDHPZS) ? '' :  this.state.CDHPZS) }}
                    />
                  </Form.Item></Col>
                <Col span={12}>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item required {...formlayout} label="起始日期">
                        <DatePicker
                          style={{ width: '100%' }}
                          disabled
                          format={format}
                          className="OnlyRead"
                          value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.startTime)
                            ? moment()
                            : moment(Number(this.state.ship.startTime))
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item required {...formlayout} label="截止日期">
                        <DatePicker
                          style={{ width: '100%' }}
                          disabled
                          format={format}
                          className="OnlyRead"
                          value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.endTime)
                            ? moment()
                            : moment(Number(this.state.ship.endTime))
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item required {...formlayout} label="有效期限">
                        <Input suffix="年" disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.pmiDeadline)
                          ? ''
                          : this.state.ship.pmiDeadline} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ):null
          }

            <Row className={commonCss.rowTop} gutter={24}>
              <Col span={12}>
                <Form.Item label="船舶登记证书" required className={commonCss.detailPageLabel}>
                  {/* <Upload
                    action=""
                    listType="picture-card"
                    showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.bFileList) ||
                        this.state.bFileList.length === 0
                        ? ''
                        : this.state.bFileList
                    }
                    onPreview={this.handlePreview.bind(this, fileType.ship_certificate_registry)}
                  // onDownload={this.handleDownload}
                  >
                    {isNil(this.state) ||
                      isNil(this.state.bFileList) ||
                      this.state.bFileList.length == 0
                      ? null
                      : null}
                  </Upload> */}
                  <img
                  src={isNil(this.state) || isNil(this.state.CBDJZS) ? '' : this.state.CBDJZS}
                  alt=""
                  style={{ width: '20%' }}
                  onClick={ () => { this.showModal(isNil(this.state) ||  isNil(this.state.CBDJZS) ? '' :  this.state.CBDJZS) }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item required {...formlayout} label="起始日期">
                      {/* <DatePicker
                        style={{ width: '100%' }}
                        disabled
                        format={format}
                        className="OnlyRead"
                        // registryStartTime
                        // registryEndTime
                        // value={isNil(this.state) || isNil(this.state) || isNil(this.state.registryStartTime)
                        //   ? ''
                        //   : this.state.registryStartTime
                        // }
                      /> */}
                      <Input suffix="" disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.registryStartTime)
                        ? ''
                        : this.state.registryStartTime} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item required {...formlayout} label="截止日期">
                    <Input suffix="" disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.registryEndTime)
                        ? ''
                        : this.state.registryEndTime} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item required {...formlayout} label="有效期限">
                      <Input suffix="年" disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.registryDeadline)
                        ? ''
                        : this.state.ship.registryDeadline} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            {

              !isNil(this.state) && this.state.isChinaShips == '0'?(
                <Row className={commonCss.rowTop} gutter={24}>
                  <Col span={12}>
                    <Form.Item label="租船合同" className={commonCss.detailPageLabel}>
                      {/* <Upload
                        action=""
                        listType="picture-card"
                        showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
                        fileList={
                          isNil(this.state) ||
                            isNil(this.state.pFileList) ||
                            this.state.pFileList.length === 0
                            ? ''
                            : this.state.pFileList
                        }
                        onPreview={this.handlePreview.bind(this, fileType.ship_charter_party)}
                      // onDownload={this.handleDownload}
                      >
                        {isNil(this.state) ||
                          isNil(this.state.pFileList) ||
                          this.state.pFileList.length == 0
                          ? null
                          : null}
                      </Upload> */}
                      <img
                      src={isNil(this.state) || isNil(this.state.ZCHT) ? '' : this.state.ZCHT}
                      alt=""
                      style={{ width: '20%' }}
                      onClick={ () => { this.showModal(isNil(this.state) ||  isNil(this.state.ZCHT) ? '' :  this.state.ZCHT) }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item {...formlayout} label="起始日期">
                        <Input suffix="" disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.leaseStartTime)
                            ? ''
                            : this.state.leaseStartTime} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item {...formlayout} label="截止日期">
                        <Input suffix="" disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.leaseEndTime)
                            ? ''
                            : this.state.leaseEndTime} />

                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={24}>
                        <Form.Item {...formlayout} label="有效期限">
                          <Input suffix="年" disabled placeholder='' readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.leaseDeadline)
                            ? ''
                            : this.state.ship.leaseDeadline} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
              </Row>
            ):null}

            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>上传船舶的照片</span>
          </div>
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Form.Item className={commonCss.detailPageLabel}>
                  {/* <Upload
                    action=""
                    listType="picture-card"
                    showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: false }}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.cFileList) ||
                        this.state.cFileList.length === 0
                        ? ''
                        : this.state.cFileList
                    }
                    data={{ type: 1 }}
                    onPreview={this.handlePreview.bind(this, fileType.ship_photo)}
                  >
                    {isNil(this.state) ||
                      isNil(this.state.cFileList) ||
                      this.state.cFileList.length < 8
                      ? null
                      : null}
                  </Upload> */}
                  {/* {
                    forEach((isNil(this.state) || isNil(this.state) ? '' : this.state.CPZP), (item)=>{
                      <img src={isNil(this.state) || isNil(this.state.CPZP) ? '' : (this.state.CPZPURL+item)} alt="" style={{ width: '20%' }}/>
                      console.log(this.state.CPZPURL+item)
                    })
                  } */}

                  {
                isNil(this.state) || isNil(this.state.CPZP) ? '' : (this.state.CPZP.map(item=>{
                  return (
                    <div style={{ width: '200px', height: '200px', display: 'inline-block', overflow: 'hidden', marginLeft:'50px'}} >
                      <img key={item.fileName} src={ isNil(this.state) || isNil(this.state.CPZPURL) ? '' : (this.state.CPZPURL + item)} alt="" style={{ width: '100%' }}
                      onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.CPZPURL) ? '' : (this.state.CPZPURL + item)) }}/>
                    </div>
                  )
                }))
               }
                  {/* <img src={isNil(this.state) || isNil(this.state.CPZP1) ? '' : this.state.CPZP1} alt="" style={{ width: '20%' }}/> */}
                </Form.Item>
              </Row>
              <Row className={commonCss.rowTop}>
                <Col>
                  <HrComponent text="dashed" />
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>审批意见</span>
          </div>
          <Form labelAlign="left">
            <Row gutter={24}>
              {this.props.match.params['status'] == '2' ? (<Col span={1}></Col>) : null}
              {this.props.match.params['status'] == '2' ? (
                <Col span={22} style={{ marginLeft: '-2%' }}>
                  <Form.Item required>
                    {getFieldDecorator('note', {
                      rules: [{ max: 300, message: '不能超过300字' },
                      { required: true, message: '审批意见不能为空！' },],
                    })(<TextArea rows={4} placeholder="请输入您的审批意(0/300字)..." onChange={e => this.setState({ checkRemark: e.target.value })} />)}
                  </Form.Item>
                </Col>
              ) : (
                  <Col span={22}>
                    <Form.Item required {...formItemLayout} label="审批意见" style={{ marginLeft: '1%' }}>
                      <span >{isNil(this.state) || isNil(this.state.shipChecks)
                        ? ''
                        : this.state.shipChecks}</span>
                    </Form.Item>
                  </Col>
                )}
            </Row>
            <Row className={commonCss.rowTop}>
              {this.props.match.params['status'] == '2' ? (
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="TurnDown"
                    text="驳回"
                    event={() => this.turnDown(0)}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params['status'] == '2' ? (
                <Col span={12}>
                  <ButtonOptionComponent
                    type="Approve"
                    text="审批通过"
                    event={() => this.turnDown(1)}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params['status'] == '2' ? null : (
                <Col span={12} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="CloseButton"
                    text="关闭"
                    event={() => this.onBack()}
                    disabled={false}
                  />
                </Col>
              )}
              {this.props.match.params['status'] == '2' ? null : <Col span={7}></Col>}
              {this.props.match.params['status'] == '2' ? null : (
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
            {/* <Modal className="picModal"
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
            </Modal> */}
          </Form>
        </div>
      </div>
    );
  }
}

const ShipCertificationView_Form = Form.create({ name: 'ShipCertificationView_Form' })(
  ShipCertificationView,
);
export default ShipCertificationView_Form;
