import { getRequest, putRequest } from '@/utils/request';
import { Button, Checkbox, Col, Form, Icon, message, Modal, Row, Upload } from 'antd';
import { forEach, isNil } from 'lodash';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { DepositpaymentFormProps } from './DepositpaymentFormInterface';
import { linkHref } from '@/utils/utils';
import { HandleBeforeUpload } from '@/utils/validator';
import {margin_agreement} from '../Protocol/protocols';

class GuaranteePage extends React.Component<DepositpaymentFormProps, DepositpaymentFormProps> {
  constructor(props: DepositpaymentFormProps) {
    super(props);
  }
  componentDidMount() {
    this.props.form.validateFields();
    this.setState({
      agreePro: false,
      modalVisible: false,
      buttonDisabled: true,
      nameID: localStorage.getItem('accountId'), //用户名ID
      nameTP: localStorage.getItem('userType'), //用户名类型
      money: '', //金额
      previewVisible: false,
      previewImage: '',
      fileList: [],
      imgurl: '',
      payStatus: 0,
      depoflag: false,
    },
      () => {
        //取url中的传递值
        //let id = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
        let param: Map<string, any> = new Map();
        getRequest(`/business/earnestMoney/${localStorage.getItem('userId')}`, param, (response: any) => {
          if (response.status === 200) {
            if (!isNil(response.data)) {
              this.setState({
                money: response.data.margin,
                payStatus: response.data.earnestMoneys.payStatus
              });
            }
            if (response.data.marginFlowSheet) {
              let picParams: Map<string, string> = new Map();
              picParams.set('fileNames', response.data.marginFlowSheet.fileName);
              getRequest('/sys/file/getThumbImageBase64/'+response.data.marginFlowSheet.fileType, picParams, (response1: any) => { //BUG131改修
                if (response1.status === 200) {
                  this.setState({
                    fileList: [{
                      uid: '1',
                      name: response1.data[0].fileName,
                      status: 'done',
                      thumbUrl: response1.data[0].base64,
                    }],
                  });
                  this.setState({
                    type: 'user',
                    fileName: response1.data[0].fileName,
                    fileLog: response.data.marginFlowSheet.fileLog,// 保证金再次保存 无图片
                  })
                }
              });
            }
          }
        });
      },
    );
  }


  handleCancel = () => this.setState({ previewVisible: false });

  // 图片预览
  handlePreview = (file: any) => {
    let params: Map<string, string> = new Map();
    if (file.response) {
      params.set('fileName', file.response.data.fileName)
    } else {
      params.set('fileName', file.name);
    }
    getRequest('/sys/file/getImageBase64/user', params, (response: any) => {
      if (response.status === 200) {
        this.setState({
          previewImage: response.data.file.base64,
          previewVisible: true,
        });
      }
    });
  };

  // 检查图片是否上传 
  checkFile = (rule: any, val: any, callback: any) => {
    if (isNil(this.state.fileList) || this.state.fileList.length === 0) {
      callback(formatMessage({ id: 'Depositpayment-DepositpaymentPage.upload.picture.empty' }));
    } else {
      callback();
    }
  };

  //上传图片变更
  handleChange = ({ fileList }: any) => {
    if (!isNil(fileList) && fileList.length > 0) {
      this.setState({
        depoflag:true, 
      });
      forEach(fileList, (file) => {
        if (file.status === 'done') {
          this.setState({
            type: file.response.data.type,
            fileName: file.response.data.fileName,
            fileLog: '22',
            depoflag:false, 
          })
        }
        this.setState({ fileList});
      });
    }
  };

  //删除图片
  handleRemove = () => {
    this.setState(() => ({
      fileList: [],
      type: '',
      fileLog: '',
      fileName: '',
    }));
  }

  //返回
  onBack = () => {
    this.props.history.push('/index_menu');
  };

  //上传流水单
  onSuccess = () => {
    const { money } = this.state;
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let requestData = {};
        requestData = {
          userId: localStorage.getItem('userId'),
          payAmount: money,
          partPicture: {
            type: this.state.type,
            fileName: this.state.fileName,
            fileLog: this.state.fileLog,
          }
        };
        // 修改请求
        putRequest('/business/earnestMoney', JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {
            message.success(formatMessage({ id: 'Depositpayment-DepositpaymentPage.success' }));
            this.onBack();
          } else {
            message.error(formatMessage({ id: 'Depositpayment-DepositpaymentPage.failed' }));
          }
        });
      }
    });
  }

  // 改变checkbox的状态事件
  agreeChange = (e: { target: { checked: any } }) => {
    this.setState({
      agreePro: e.target.checked,
      buttonDisabled: !e.target.checked,
    });

  };

  showProtocol = () => {
    this.setState({
      modalVisible: true,
    });
  };

  // modal click OK
  handleOk = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const moneyformlayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
    };
    const xmoneyformlayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text"><FormattedMessage id="Depositpayment-DepositpaymentPage.upload.picture" /></div>
      </div>
    );

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={formatMessage({ id: 'Depositpayment-DepositpaymentPage.depositpayment' })} event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={22} style={{ height: '40px' }}>
                <Form.Item label="">
                  <label style={{ fontWeight: 'bolder', fontSize: '15px' }}>
                    <FormattedMessage id="Depositpayment-DepositpaymentPage.welcome" />{isNil(this.state) ||
                      isNil(this.state.nameID)
                      ? ''
                      : this.state.nameID}
                    <FormattedMessage id="Depositpayment-DepositpaymentPage.join" />
                  </label>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={22} style={{ height: '40px' }}>
                {!isNil(this.state) && this.state.payStatus === 1 ? (<Form.Item {...moneyformlayout} label={formatMessage({ id: 'Depositpayment-DepositpaymentPage.payed' })}>
                  <label style={{ color: 'red', fontSize: '15px', marginLeft: '-2%' }}>¥{isNil(this.state) ||
                    isNil(this.state.money)
                    ? ''
                    : this.state.money}</label>
                </Form.Item>) : (<Form.Item {...xmoneyformlayout} label={formatMessage({ id: 'Depositpayment-DepositpaymentPage.cost' })}>
                  <label style={{ color: 'red', fontSize: '15px' }}>¥{isNil(this.state) ||
                    isNil(this.state.money)
                    ? ''
                    : this.state.money}</label>
                </Form.Item>)}

              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={3}>
                {!isNil(this.state) && this.state.payStatus === 1 ? (<Form.Item required label={formatMessage({ id: 'Depositpayment-DepositpaymentPage.payment' })}>
                  <Upload
                    action="/api/sys/file/upload/user"
                    listType="picture-card"
                    showUploadList={{
                      showPreviewIcon: true,
                      showDownloadIcon: false,
                      showRemoveIcon: false,
                    }}
                    fileList={
                      isNil(this.state) ||
                        isNil(this.state.fileList) ||
                        this.state.fileList.length === 0
                        ? ''
                        : this.state.fileList
                    }
                    onPreview={this.handlePreview}
                  >
                    {isNil(this.state) || isNil(this.state.fileList) || this.state.fileList.length < 1 ?
                      null : null}
                  </Upload>
                </Form.Item>) : (<Form.Item required label={formatMessage({ id: 'Depositpayment-DepositpaymentPage.payment' })}>
                  {getFieldDecorator(`picture`, {
                    rules: [
                      {
                        validator: this.checkFile.bind(this),
                      },
                    ],
                  })(
                    <Upload
                      action="/api/sys/file/upload/user"
                      listType="picture-card"
                      accept='.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff'
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem("token")) }}
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: true,
                      }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.fileList) ||
                          this.state.fileList.length === 0
                          ? ''
                          : this.state.fileList
                      }
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                      onRemove={this.handleRemove}
                    >
                      {isNil(this.state) || isNil(this.state.fileList) || this.state.fileList.length < 1 ?
                        uploadButton : null}
                    </Upload>,
                  )}
                </Form.Item>)}
              </Col>
              <Col span={13} style={{ height: '40px' }}>
                {!isNil(this.state) && this.state.payStatus === 1 ? null : (<Form.Item>
                  <Button
                    type="primary"
                    style={{ marginTop: '14%' }}
                    disabled={!isNil(this.state) && (this.state.buttonDisabled || this.state.depoflag)}
                    htmlType="submit"
                    onClick={this.onSuccess}
                  >
                    <FormattedMessage id="Depositpayment-DepositpaymentPage.payment.upload" />
                  </Button>
                </Form.Item>)}
              </Col>
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
            <Row gutter={24}>
              <Col span={22} style={{ height: '40px' }}>
                {!isNil(this.state) && this.state.payStatus === 1 ? null : (<Form.Item>
                  <Checkbox checked={isNil(this.state) ||
                    isNil(this.state.agreePro)
                    ? false
                    : this.state.agreePro} onChange={this.agreeChange}>
                    {' '}
                    <FormattedMessage id="Depositpayment-DepositpaymentPage.accept" />
                    <Button type="link" href="#" onClick={this.showProtocol}>
                      <FormattedMessage id="Depositpayment-DepositpaymentPage.agreement" />
                    </Button>{' '}
                  </Checkbox>
                </Form.Item>)}
              </Col>
            </Row>
          </Form>
        </div>
        <Modal className="protocolModal"
          title={formatMessage({ id: 'Depositpayment-DepositpaymentPage.depositpayment.agreement' })} visible={isNil(this.state) ||
          isNil(this.state.modalVisible)
          ? false
          : this.state.modalVisible} onOk={this.handleOk} onCancel={this.handleOk}
          footer={null}
          >
            <p style={{textAlign:"left"}} dangerouslySetInnerHTML={{__html:margin_agreement}}></p>
            <Button key="submit" type="primary" style={{textAlign:"center",top:"10px",width:"180px"}} onClick={()=>this.setState({modalVisible:false})}>
              <FormattedMessage id="Index-UserMenu.confirm" />
            </Button>
            </Modal>
      </div>
    );
  }
}

const GuaranteePage_Form = Form.create({ name: 'GuaranteePage_Form' })(GuaranteePage);
export default GuaranteePage_Form;
