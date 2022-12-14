import getRequest, { putRequest } from '@/utils/request';
import { Col, Form, Input, Modal, Row, Upload, message, DatePicker, Image } from 'antd';
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
        previewVisible: false,
        visible: false,
        previewImage: '',
        aFileList: [],
        bFileList: [],
        cFileList: [],
        pFileList: [],
      },
      () => {
        let param: Map<string, string> = new Map();
        // param.set('type', '1');
        // console.log(this.props.match.params['guid'])
        // console.log(this.props.match.params['status'])
        getRequest('/business/ads/getAdsById/' + this.props.match.params['guid'], param, (response: any) => {
          // console.log(response)

          if (response.status === 200) {
            if (!isNil(response.data)) {
              // console.log(response.data.companypic)
              //  if (response.data.userDataChecks.guid === id) {
                let start = response.data.startDate
                let end = response.data.endDate
                let startdate=new Date(start).getFullYear() + '-' + (new Date(start).getMonth() + 1) + '-' + new Date(start).getDate();
                let enddate=new Date(end).getFullYear() + '-' + (new Date(end).getMonth() + 1) + '-' + new Date(end).getDate();
                let servicetime =  startdate + ' 至 ' + enddate;

                //创建时间
                  let update = response.data.adsDto.updateTime;
                  let updatetime = new Date(update).getFullYear() + '-' + (new Date(update).getMonth() + 1) + '-' + new Date(update).getDate()

              this.setState({
                ship: response.data.adsDto,//航次对象
                picList: response.data.picList,//附件
                shipChecks: response.data.adsDto.checkRemark,
                updateTime:updatetime,
                serviceTime:servicetime,
                userType: response.data.userType,
                portName:response.data.portName,
                //获取logo
                logotype:(response.data.companylogo.length>0?response.data.companylogo[0].fileName:''),
                logoUrl:`http://58.33.34.10:10443/images/companylogo/`,
                Url:`http://58.33.34.10:10443/images/companypic/`,
                //获取商家图片
                sjtp:response.data.companypic
              });
                console.log(response.data)
                // console.log(this.state.sjtp)

              const regArr = filter(response.data.picList, { 'fileLog': 5 });
              const pmiArr = filter(response.data.picList, { 'fileLog': 10 });
              const leaseArr = filter(response.data.picList, { 'fileLog': 9 });
              const shipArr = filter(response.data.picList, { 'fileLog': 23 });
              if (regArr.length !== 0) {
                forEach(regArr, (pic, index) => {
                  let picParams: Map<string, string> = new Map();
                  picParams.set('fileNames', pic.fileName);
                  getRequest('/business/ads/getAdsById/' + pic.fileType, picParams, (response: any) => {
                    // console.log(response)
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
                  getRequest('/business/ads/getAdsById/' + pic.fileType, picParams, (response: any) => {
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
                  getRequest('/business/ads/getAdsById/' + pic.fileType, picParams, (response: any) => {
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
                  getRequest('/business/ads/getAdsById/' + pic.fileType, picParams, (response: any) => {
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
            // console.log(this.state.ship)
          }
          // console.log(this.state.logoUrl)
        });
      },

    );
  }

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

  // 图片预览
  // handlePreview = (type: any, file: any) => {
  //   let params: Map<string, string> = new Map();
  //   params.set('fileName', file.fileName);
  //   getRequest('/sys/file/getImageBase64/' + type, params, (response: any) => {
  //     this.setState({
  //       previewImage: response.data.file.base64,
  //       previewVisible: true,
  //     });
  //   });
  // };

  // //取消预览
  // handleCancel = () => {
  //   this.setState({ previewVisible: false });
  // };

  // 返回
  onBack = () => {
    //得到当前审核状态
    let status = this.props.match.params['status'] ? this.props.match.params['status'] : '';
    // console.log(this.props.match.params['status'])
    // 跳转首页
    this.props.history.push(`/promotionaudit/list/` + status);
  };

  // 驳回或审批通过
  turnDown = (value: any) => {
    let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';

    let requestData = {};
    // console.log( isNil(this.state) || isNil(this.state.checkRemark) ? '' : this.state.checkRemark);
    requestData = {
      id: Number(guid),
      pr: isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.city)
      ? ''
      : this.state.ship.city + this.state.ship.cnty,
      companyName: isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.companyName) ? '' : this.state.ship.companyName,
      checkRemark: this.state.checkRemark,
      adsStatus: value,
    };
    if (value == 0) {
      this.props.form.validateFields((err: any, values: any) => {
        //需要审批意见
        if (!err) {
          // 资料认证审批
          putRequest('/business/ads/updateAds', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              message.success('驳回成功');
              this.props.history.push('/promotionaudit/list');
            } else {
              message.error(response.message);
            }
          });
        }
      });
    } else {
      putRequest('/business/ads/updateAds', JSON.stringify(requestData), (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          message.success('审批通过');
          this.props.history.push('/promotionaudit/list');
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
    if (this.props.match.params['status'] == '1') {
      this.certification = getLocale() === 'zh-CN' ? certificationNO : certificationNOEN;
    } else if (this.props.match.params['status'] == '3') {
      this.certification = getLocale() === 'zh-CN' ? certificationsuccess : certificationsuccessEN;
    } else {
      this.certification = '';
    }
    return (
      <div className={commonCss.container}>
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

        <LabelTitleComponent text="推广审核详情" event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="公司名称">
                  <Input readOnly disabled value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.companyName)
                    ? ''
                    : this.state.ship.companyName} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  {...formlayout} label="服务商类型">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.adsType)
                    ? ''
                    : this.state.ship.adsType} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item  {...formlayout} label="公司地址">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.city)
                    ? ''
                    : this.state.ship.city + this.state.ship.cnty} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  {...formlayout} label="套餐服务时间">

                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.serviceTime) || isNil(this.state.serviceTime)
                    ? ''
                    : this.state.serviceTime} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item  {...formlayout} label="姓名">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.contacts)
                    ? ''
                    : this.state.ship.contacts} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  {...formlayout} label="创建时间">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.updateTime) || isNil(this.state.updateTime)
                    ? ''
                    : this.state.updateTime} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系方式">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.phoneNumber)
                    ? ''
                    : this.state.ship.phoneNumber} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  {...formlayout} label="用户类型">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.userType) || isNil(this.state.userType)
                    ? ''
                    : this.state.userType} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item  {...formlayout} label="主营业务">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.companyBusiness)
                    ? ''
                    : this.state.ship.companyBusiness} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item  {...formlayout} label="服务港口">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.portName) || isNil(this.state.portName)
                    ? ''
                    : this.state.portName} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item  {...formlayout} label="公司LOGO">
                  {/* <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.charterWay)
                    ? ''
                    : getTableEnumText('charter_way', this.state.ship.charterWay)} /> */}
                    <img
                      alt="无"
                      style={{ width: '25%' }}
                      src={isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype)}
                      // onClick={this.showModal(isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype))}
                      onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype)) }}
                    />
                </Form.Item>
              </Col>
              {/* 形象视频 */}
              <Col span={12}>
                <Form.Item  {...formlayout} >
                  <video style={{ width: '25%' }} src="">

                  </video>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>商家图片：</span>
          </div>
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Form.Item className={commonCss.detailPageLabel}>
                  {/* //商家图片： */}
               {
                isNil(this.state) || isNil(this.state.sjtp) ? '' : (this.state.sjtp.map(item=>{
                  return(
                    <div style={{ width: '200px', height: '200px', display: 'inline-block', overflow: 'hidden', marginLeft:'50px'}} >
                      <img key={item.fileName} src={ isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.Url + item.fileName)} alt="" style={{ width: '100%' }}  onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.Url + item.fileName)) }}/>
                    </div>
                  )
                }))
               }
                </Form.Item>
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
              {this.props.match.params['status'] == '0' ? (<Col span={1}></Col>) : null}
              {this.props.match.params['status'] == '0' ? (
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
              {this.props.match.params['status'] == '0' ? (
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="TurnDown"
                    text="驳回"
                    event={() => this.turnDown(1)}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params['status'] == '0' ? (
                <Col span={12}>
                  <ButtonOptionComponent
                    type="Approve"
                    text="审批通过"
                    event={() => this.turnDown(3)}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params['status'] == '0' ? null : (
                <Col span={12} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="CloseButton"
                    text="关闭"
                    event={() => this.onBack()}
                    disabled={false}
                  />
                </Col>
              )}
              {this.props.match.params['status'] == '0' ? null : <Col span={7}></Col>}
              {this.props.match.params['status'] == '0' ? null : (
                <Col span={5}>
                  <div className={commonCss.picTopAndBottom}>
                    <img
                      style={{ marginTop: '-17%' , width: '50%'}}
                      src={this.certification}
                      className={commonCss.imgWidth}
                    />
                  </div>
                </Col>
              )}
            </Row>
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
