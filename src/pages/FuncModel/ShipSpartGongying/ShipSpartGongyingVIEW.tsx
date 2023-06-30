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

class ShipCertificationView extends React.Component<
  ShipCertificationFormProps,
  CertificationProps
> {
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
      },
    );
  }

  // 图片放大
  showModal = (a: any) => {
    this.setState({
      visible: true,
    });
    this.setState({
      bigImg: a,
    });
  };

  handleOk = (e: any) => {
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
    // 跳转首页
    this.props.history.push(`/shipSpartGongying/list/`);
  };

  // 驳回或审批通过
  turnDown = (value: any) => {
    let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let requestData = {
      guid: guid,
      type: 2,
      typeDetail: '审核不通过原因',
    };
    if (value == 1) {
      this.props.form.validateFields((err: any, values: any) => {
        //需要审批意见
        if (!err) {
          // 资料认证审批
          putRequest(
            '/business/spartUser/updateSpartAttchmentByWeb',
            JSON.stringify(requestData),
            (response: any) => {
              if (response.status === 200) {
                // 跳转首页
                message.success('驳回成功');
                this.props.history.push('/shipSpartGongying/list');
              } else {
                message.error(response.message);
              }
            },
          );
        }
      });
    } else {
      putRequest(
        '/business/spartUser/updateSpartAttchmentByWeb',
        JSON.stringify(requestData),
        (response: any) => {
          if (response.status === 200) {
            // 跳转首页
            message.success('审批通过');
            this.props.history.push('/shipSpartGongying/list');
          } else {
            message.error(response.message);
          }
        },
      );
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
          <img
            src={isNil(this.state) || isNil(this.state.bigImg) ? '' : this.state.bigImg}
            alt=""
            style={{ width: '90%' }}
          />
        </Modal>

        <LabelTitleComponent text="成交船舶信息" event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船名">
                  <Input
                    readOnly
                    disabled
                    value={
                      isNil(this.state) ||
                      isNil(this.state.ship) ||
                      isNil(this.state.ship.companyName)
                        ? ''
                        : this.state.ship.companyName
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="编号">
                  <Input
                    disabled
                    readOnly
                    value={
                      isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.adsType)
                        ? ''
                        : this.state.ship.adsType
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船舶类型">
                  <Input
                    disabled
                    readOnly
                    value={
                      isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.city)
                        ? ''
                        : this.state.ship.city + this.state.ship.cnty
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="意向价">
                  <Input
                    disabled
                    readOnly
                    value={
                      isNil(this.state) ||
                      isNil(this.state.serviceTime) ||
                      isNil(this.state.serviceTime)
                        ? ''
                        : this.state.serviceTime
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船级社">
                  <Input
                    disabled
                    readOnly
                    value={
                      isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.contacts)
                        ? ''
                        : this.state.ship.contacts
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="成交价">
                  <Input
                    disabled
                    readOnly
                    value={
                      isNil(this.state) ||
                      isNil(this.state.updateTime) ||
                      isNil(this.state.updateTime)
                        ? ''
                        : this.state.updateTime
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="航区">
                  <Input
                    disabled
                    readOnly
                    value={
                      isNil(this.state) ||
                      isNil(this.state.ship) ||
                      isNil(this.state.ship.phoneNumber)
                        ? ''
                        : this.state.ship.phoneNumber
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="载重吨">
                  <Input
                    disabled
                    readOnly
                    value={
                      isNil(this.state) || isNil(this.state.userType) || isNil(this.state.userType)
                        ? ''
                        : this.state.userType
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="建造地点">
                  <Input
                    disabled
                    readOnly
                    value={
                      isNil(this.state) ||
                      isNil(this.state.ship) ||
                      isNil(this.state.ship.companyBusiness)
                        ? ''
                        : this.state.ship.companyBusiness
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="建造时间">
                  <Input
                    disabled
                    readOnly
                    value={
                      isNil(this.state) || isNil(this.state.portName) || isNil(this.state.portName)
                        ? ''
                        : this.state.portName
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="备注">
                  <Input
                    disabled
                    readOnly
                    // type="area"
                    value={
                      isNil(this.state) ||
                      isNil(this.state.ship) ||
                      isNil(this.state.ship.charterWay)
                        ? ''
                        : getTableEnumText('charter_way', this.state.ship.charterWay)
                    }
                  />
                </Form.Item>
              </Col>
              {/* 形象视频 */}
              <Col span={12}>
                <Form.Item {...formlayout}>
                  <video style={{ width: '25%' }} src=""></video>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>费用&流水单审核</span>
          </div>
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="建造地点">
                    <Input
                      disabled
                      readOnly
                      value={
                        isNil(this.state) ||
                        isNil(this.state.ship) ||
                        isNil(this.state.ship.companyBusiness)
                          ? ''
                          : this.state.ship.companyBusiness
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="建造时间">
                    <Input
                      disabled
                      readOnly
                      value={
                        isNil(this.state) ||
                        isNil(this.state.portName) ||
                        isNil(this.state.portName)
                          ? ''
                          : this.state.portName
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="支付时间">
                    <Input
                      disabled
                      readOnly
                      value={
                        isNil(this.state) ||
                        isNil(this.state.ship) ||
                        isNil(this.state.ship.companyBusiness)
                          ? ''
                          : this.state.ship.companyBusiness
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="道裕收款帐号">
                    <Input
                      disabled
                      readOnly
                      value={
                        isNil(this.state) ||
                        isNil(this.state.portName) ||
                        isNil(this.state.portName)
                          ? ''
                          : this.state.portName
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="账户">
                    <Input
                      disabled
                      readOnly
                      value={
                        isNil(this.state) ||
                        isNil(this.state.ship) ||
                        isNil(this.state.ship.companyBusiness)
                          ? ''
                          : this.state.ship.companyBusiness
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="开户行">
                    <Input
                      disabled
                      readOnly
                      value={
                        isNil(this.state) ||
                        isNil(this.state.portName) ||
                        isNil(this.state.portName)
                          ? ''
                          : this.state.portName
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="查看流水单">
                    <Input disabled readOnly />
                  </Form.Item>
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
              {
                <Col span={22}>
                  <Form.Item required>
                    {getFieldDecorator('note', {
                      rules: [
                        { max: 300, message: '不能超过300字' },
                        { required: true, message: '审批意见不能为空！' },
                      ],
                    })(
                      <TextArea
                        rows={4}
                        placeholder="请输入您的审批意(0/300字)..."
                        onChange={e => this.setState({ checkRemark: e.target.value })}
                      />,
                    )}
                  </Form.Item>
                </Col>
              }
            </Row>
            <Row className={commonCss.rowTop}>
              {
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="TurnDown"
                    text="驳回"
                    event={() => this.turnDown(1)}
                    disabled={false}
                  />
                </Col>
              }
              {
                <Col span={12}>
                  <ButtonOptionComponent
                    type="Approve"
                    text="审批通过"
                    event={() => this.turnDown(3)}
                    disabled={false}
                  />
                </Col>
              }
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
            </Row>
            <Modal
              className="picModal"
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
                src={
                  isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage
                }
              />
              <a
                onClick={() =>
                  linkHref(
                    isNil(this.state) || isNil(this.state.previewImage)
                      ? ''
                      : this.state.previewImage,
                  )
                }
              >
                查看原图
              </a>
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
