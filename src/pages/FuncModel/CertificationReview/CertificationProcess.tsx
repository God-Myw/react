import ButtonOptionComponent from '@/pages/Common/Components/ButtonOptionComponent';
import getRequest from '@/utils/request';
import { Col, Form, Input, Modal, Row, Upload } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi-plugin-react/locale';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { IIProps, IState } from './CertificationProps';
import { linkHref } from '@/utils/utils';

const { TextArea } = Input;
//不通过图片
const certificationNO = require('../../Image/noPass.png');
const certificationNOEN = require('../../Image/noPassEN.png');
//审核中图片
const oncheck = require('../../Image/onCheck.png');
const oncheckEN = require('../../Image/onCheckEN.png');
//通过图片
const certificationsuccess = require('../../Image/pass.png');
const certificationsuccessEN = require('../../Image/passEN.png');
type IProps = IIProps & RouteComponentProps;

let dateDisable: boolean;
class UserAuth extends React.Component<IProps, IState> {
  constructor(prop: IProps) {
    super(prop);
  }

  componentDidMount() {
    let selStatus = isNil(this.props.match.params['selstatus']) ? '1' : this.props.match.params['selstatus'];
    let userId = this.props.match.params['id'] ? this.props.match.params['id'] : '';
    this.setState({
      userId: userId,
      userType: localStorage.getItem('userType'),
      selStatus: selStatus,
    });

    let param: Map<string, string> = new Map();
    // 资料详情查看type为1
    param.set('type', '1');
    param.set('userId', userId);
    getRequest('/sys/userDetail/' + userId, param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          let pic = getLocale() === 'zh-CN' ? certificationNO : certificationNOEN;
          if (response.data.userDetail.checkStatus === 2) {
            (dateDisable = true), (pic = getLocale() === 'zh-CN' ? certificationsuccess : certificationsuccessEN);
          } else if (response.data.userDetail.checkStatus === 1) {
            pic = getLocale() === 'zh-CN' ? oncheck : oncheckEN;
          }
          this.setState({
            certificationPic: pic,
            guid: response.data.userDetail.guid,
            //公司名称
            companyName: response.data.userDetail.companyName,
            //公司电话
            phoneNumber: response.data.userDetail.phoneNumber,
            //传真号
            faxNumber: response.data.userDetail.faxNumber,
            //银行名称及开户行
            bankType: response.data.userDetail.bankType,
            //银行账号
            bankNumber: response.data.userDetail.bankNumber,
            //审核意见
            checkRemark: response.data.userDetail.checkRemark,
            //地址
            companyAddress: response.data.userDetail.companyAddress,
            securityDocEndTime: response.data.userDetail.docEndTime,
            securitySmcEndTime: response.data.userDetail.smcEndTime,
            checkStatus: response.data.userDetail.checkStatus,
            ownerType: response.data.userDetail.ownerType,
            photoList: response.data.files,
          });

          forEach(response.data.files, (photo, index) => {
            if (!isNil(photo.fileName) && !isNil(photo.fileType)) {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', photo.fileName);
              getRequest(
                '/sys/file/getThumbImageBase64/' + photo.fileType,
                picParams,
                (response: any) => {
                  if (response.status === 200) {
                    if (photo.fileLog === 1) {
                      this.setState({
                        businessLicenseFileList: [
                          {
                            uid: index,
                            name: response.data[0].fileName,
                            status: 'done',
                            thumbUrl: response.data[0].base64,
                            fileType: photo.fileType,
                            fileName: photo.fileName,
                          },
                        ],
                        businessLicenseFileName: response.data[0].fileName,
                        businessLicenseFileType: photo.fileType,
                      });
                    } else if (photo.fileLog === 7) {
                      this.setState({
                        securitySmcFileList: [
                          {
                            uid: index,
                            name: response.data[0].fileName,
                            status: 'done',
                            thumbUrl: response.data[0].base64,
                            fileType: photo.fileType,
                            fileName: photo.fileName,
                          },
                        ],
                        securitySmcFileName: response.data[0].fileName,
                        securitySmcFileType: photo.fileType,
                      });
                    } else if (photo.fileLog === 6) {
                      this.setState({
                        securityDocFileList: [
                          {
                            uid: index,
                            name: response.data[0].fileName,
                            status: 'done',
                            thumbUrl: response.data[0].base64,
                            fileType: photo.fileType,
                            fileName: photo.fileName,
                          },
                        ],
                        securityDocFileName: response.data[0].fileName,
                        securityDocFileType: photo.fileType,
                      });
                    } else if (photo.fileLog === 9) {
                      this.setState({
                        rentShipContractFileList: [
                          {
                            uid: index,
                            name: response.data[0].fileName,
                            status: 'done',
                            thumbUrl: response.data[0].base64,
                            fileType: photo.fileType,
                            fileName: photo.fileName,
                          },
                        ],
                        rentShipContractFileName: response.data[0].fileName,
                        rentShipContractFileType: photo.fileType,
                      });
                    }
                  }
                },
              );
            }
          });
        }
      }
    });
  }

  //返回事件
  onBack = () => {
    if (this.state.userType === '3') {
      this.props.history.push('/usercertification/list' + '?selectTab=' + this.state.selStatus);
    } else {
      this.props.history.push('/index_menu');
    }
  };

  uploadAgain = () => {
    this.props.history.push('/profile_certification/' + '1');
  };

  //取消预览
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handlePreview = (type: string, file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.fileName);
    getRequest('/sys/file/getImageBase64/' + file.fileType, params, (response: any) => {
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
    const labellayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 0 },
    };
    const piclayout = {
      wrapperCol: { span: 24 },
    };
    const { getFieldDecorator } = this.props.form;
    const userType = isNil(this.state) || isNil(this.state.userType) ? '' : this.state.userType;
    const checkStatus =
      isNil(this.state) || isNil(this.state.checkStatus) ? 0 : this.state.checkStatus;
    const ownerType = isNil(this.state) || isNil(this.state.ownerType) ? 0 : this.state.ownerType;

    //营业执照过期时间
    const checkEndTime = (
      <Col span={8}>
        <Form.Item
          {...formlayout}
          required
          label={formatMessage({ id: 'CertificationReview-CertificationIndex.Expiration.Date' })}
        >
          {getFieldDecorator('businessLicenseEndTime', {
            initialValue: formatMessage({
              id: 'CertificationReview-CertificationIndex.userforever',
            }),
          })(
            <Input
              disabled={true}
              placeholder={formatMessage({
                id: 'CertificationReview-CertificationIndex.enddate.input',
              })}
              onChange={e => this.setState({ companyName: e.target.value })}
            />,
          )}
        </Form.Item>
      </Col>
    );
    //Doc过期时间
    const docEndTime = (
      <Col span={8}>
        <Form.Item
          {...formlayout}
          required
          label={formatMessage({ id: 'CertificationReview-CertificationIndex.Expiration.Date' })}
        >
          {getFieldDecorator('securityDocEndTime', {
            initialValue:
              isNil(this.state) || isNil(this.state.securityDocEndTime)
                ? ''
                : moment(Number(this.state.securityDocEndTime)).format('YYYY/MM/DD HH:mm:ss'),
          })(
            <Input
              disabled={dateDisable}
              placeholder={formatMessage({
                id: 'CertificationReview-CertificationIndex.enddate.input',
              })}
              onChange={e => this.setState({ securityDocEndTime: e.target.value })}
            />,
          )}
        </Form.Item>
      </Col>
    );
    //Smc过期时间
    const smcEndTime = (
      <Col span={8}>
        <Form.Item
          {...formlayout}
          required
          label={formatMessage({ id: 'CertificationReview-CertificationIndex.Expiration.Date' })}
        >
          {getFieldDecorator('securitySmcEndTime', {
            initialValue:
              isNil(this.state) || isNil(this.state.securitySmcEndTime)
                ? ''
                : moment(Number(this.state.securitySmcEndTime)).format('YYYY/MM/DD HH:mm:ss'),
          })(
            <Input
              disabled={dateDisable}
              placeholder={formatMessage({
                id: 'CertificationReview-CertificationIndex.enddate.input',
              })}
              onChange={e => this.setState({ securitySmcEndTime: e.target.value })}
            />,
          )}
        </Form.Item>
      </Col>
    );
    //营业执照
    const check = (
      <Col span={8}>
        <Form.Item {...piclayout} label="">

          <Upload
            action="/sys/file/upload"
            listType="picture-card"
            data={{ type: 1 }}
            onPreview={this.handlePreview.bind(this, 'businessLicense')}
            showUploadList={{
              showPreviewIcon: true,
              showDownloadIcon: false,
              showRemoveIcon: false,
            }}
            fileList={
              isNil(this.state) ||
                isNil(this.state.businessLicenseFileList) ||
                this.state.businessLicenseFileList.length === 0
                ? ''
                : this.state.businessLicenseFileList
            }
          ></Upload>
        </Form.Item>
      </Col>
    );
    //租船合同
    const rentShip = (
      <Col span={8}>
        <Form.Item {...piclayout} label="">
          <Upload
            action="/sys/file/upload"
            listType="picture-card"
            data={{ type: 1 }}
            onPreview={this.handlePreview.bind(this, 'rentShipContract')}
            showUploadList={{
              showPreviewIcon: true,
              showDownloadIcon: false,
              showRemoveIcon: true,
            }}
            fileList={
              isNil(this.state) ||
                isNil(this.state.rentShipContractFileList) ||
                this.state.rentShipContractFileList.length === 0
                ? ''
                : this.state.rentShipContractFileList
            }
          ></Upload>
        </Form.Item>
      </Col>
    );
    //doc
    const doc = (
      <Col span={8}>
        <Form.Item {...piclayout} label="">
          <Upload
            action="/sys/file/upload"
            listType="picture-card"
            data={{ type: 1 }}
            onPreview={this.handlePreview.bind(this, 'securityDoc')}
            showUploadList={{
              showPreviewIcon: true,
              showDownloadIcon: false,
              showRemoveIcon: true,
            }}
            fileList={
              isNil(this.state) ||
                isNil(this.state.securityDocFileList) ||
                this.state.securityDocFileList.length === 0
                ? ''
                : this.state.securityDocFileList
            }
          ></Upload>
        </Form.Item>
      </Col>
    );
    //smc
    const smc = (
      <Col span={8}>
        <Form.Item {...piclayout} label="">
          <Upload
            action="/sys/file/upload"
            listType="picture-card"
            data={{ type: 1 }}
            onPreview={this.handlePreview.bind(this, 'securitySmc')}
            showUploadList={{
              showPreviewIcon: true,
              showDownloadIcon: false,
              showRemoveIcon: true,
            }}
            fileList={
              isNil(this.state) ||
                isNil(this.state.securitySmcFileList) ||
                this.state.securitySmcFileList.length === 0
                ? ''
                : this.state.securitySmcFileList
            }
          ></Upload>
        </Form.Item>
      </Col>
    );
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({
            id: 'CertificationReview-CertificationIndex.profile.certification',
          })}
          event={() => {
            this.onBack();
          }}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  {ownerType === 0 ? (
                    <span style={{ color: 'red' }}>
                      <FormattedMessage id="CertificationReview-CertificationIndex.shipowner" />
                    </span>
                  ) : ownerType === 1 ? (
                    <span style={{ color: 'red' }}>
                      <FormattedMessage id="CertificationReview-CertificationIndex.owner.two" />
                    </span>
                  ) : null}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'CertificationReview-CertificationIndex.company' })}
                >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.companyName)
                        ? ''
                        : this.state.companyName
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'CertificationReview-CertificationIndex.phonenumber',
                  })}
                >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.companyName)
                        ? ''
                        : this.state.phoneNumber
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'CertificationReview-CertificationIndex.address' })}
                >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.companyName)
                        ? ''
                        : this.state.companyAddress
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'CertificationReview-CertificationIndex.deposit.bank',
                  })}
                >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.companyName) ? '' : this.state.bankType
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'CertificationReview-CertificationIndex.bank.account',
                  })}
                >
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.companyName)
                        ? ''
                        : this.state.bankNumber
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                {' '}
                <Form.Item
                  {...labellayout}
                  required
                  label={formatMessage({
                    id: 'CertificationReview-CertificationIndex.business.license',//营业执照
                  })}
                ></Form.Item>
              </Col>
              {ownerType === 1 ? (
                <Col span={8}>
                  <Form.Item
                    {...labellayout}
                    required
                    label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.smc' })}
                  ></Form.Item>
                </Col>
              ) : null}
              {ownerType === 1 ? (
                <Col span={8}>
                  <Form.Item
                    {...labellayout}
                    required
                    label={formatMessage({
                      id: 'CertificationReview-CertificationIndex.charter.party',
                    })}
                  ></Form.Item>{' '}
                </Col>
              ) : null}
              {ownerType === 0 ? (
                <Col span={8}>
                  <Form.Item
                    {...labellayout}
                    required
                    label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.doc' })}
                  >
                    {' '}
                  </Form.Item>
                </Col>
              ) : null}
              {ownerType === 0 ? (
                <Col span={8}>
                  <Form.Item
                    {...labellayout}
                    required
                    label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.smc' })}
                  ></Form.Item>
                </Col>
              ) : null}
            </Row>
            <Row gutter={24}>
              {check}
              {ownerType === 1 ? smc : null}
              {ownerType === 1 ? rentShip : null}
              {ownerType === 0 ? doc : null}
              {ownerType === 0 ? smc : null}
            </Row>
            {userType === '3' ? (
              <Row gutter={24}>
                {checkEndTime}
                {ownerType === 1 ? smcEndTime : null}
                {ownerType === 0 ? docEndTime : null}
                {ownerType === 0 ? smcEndTime : null}
              </Row>
            ) : null}
            {ownerType === 1 ? (
              <Row gutter={24}>
                <Col span={8}>
                  {' '}
                  <Form.Item
                    {...labellayout}
                    required
                    label={formatMessage({ id: 'CertificationReview-CertificationIndex.ship.doc' })}
                  ></Form.Item>
                </Col>
              </Row>
            ) : null}
            {ownerType === 1 ? <Row gutter={24}>{doc}</Row> : null}
            {ownerType === 1 && userType === '3' ? <Row gutter={24}>{docEndTime}</Row> : null}
            {!isNil(this.state) && !isNil(this.state.checkRemark) ? (
              <Row gutter={24}>
                <Col span={16}>
                  <Form.Item
                    {...piclayout}
                    label={formatMessage({
                      id: 'CertificationReview-CertificationIndex.approval.opinion',
                    })}
                  >
                    <TextArea
                      style={{ width: '100%', border: 'none' }}
                      value={
                        isNil(this.state) || isNil(this.state.checkRemark)
                          ? ''
                          : this.state.checkRemark
                      }
                      rows={4}
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
              </Row>) : null}
          </Form>
          <Form labelAlign="left">
            <Row className={commonCss.rowTop}>
              {userType !== '3' && checkStatus === 3 ? (
                <Col span={8} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="Save"
                    text={formatMessage({ id: 'CertificationReview-CertificationIndex.close' })}
                    event={() => {
                      this.onBack();
                    }}
                  />
                </Col>
              ) : (<Col span={8}>
              </Col>)}
              {userType !== '3' && checkStatus === 3 ? (
                <Col span={8}>
                  <ButtonOptionComponent
                    type="Approve"
                    text={formatMessage({
                      id: 'CertificationReview-CertificationIndex.upload.again',
                    })}
                    event={() => {
                      this.uploadAgain();
                    }}
                  />
                </Col>
              ) : (<Col span={8}>
                <ButtonOptionComponent
                  type="Approve"
                  text={formatMessage({ id: 'CertificationReview-CertificationIndex.close' })}
                  event={() => {
                    this.onBack();
                  }}
                />
              </Col>
                )}
              <Col span={2}></Col>
              <Col span={5}>
                <div className={commonCss.picTopAndBottom}>
                  <img
                    style={{ marginTop: '-50%' }}
                    src={
                      isNil(this.state) || isNil(this.state.certificationPic)
                        ? ''
                        : this.state.certificationPic
                    }
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

const UserAuth_Form = Form.create({ name: 'userAuth_form' })(UserAuth);
export default UserAuth_Form;
