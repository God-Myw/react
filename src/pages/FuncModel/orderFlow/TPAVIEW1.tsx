import getRequest, { putRequest } from '@/utils/request';
import { Col, Form, Input, Modal, Row, message, Upload, Button ,List, Card,Icon } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil, forEach, filter } from 'lodash';
import React from 'react';
import moment from 'moment';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import ShipCertificationFormProps from './ShipCertificationFormInterface';
import { linkHref } from '@/utils/utils';
import { FileModel } from './FileModel';
import { getLocale } from 'umi-plugin-react/locale';
const { TextArea } = Input;
const InputGroup = Input.Group;
type CertificationProps = ShipCertificationFormProps & RouteComponentProps;

// 不通过图片
const certificationNO = require('../../Image/noPass.png');
const certificationNOEN = require('../../Image/noPassEN.png');

// 通过图片
const certificationsuccess = require('../../Image/pass.png');
const certificationsuccessEN = require('../../Image/passEN.png');

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
        status
        const param: Map<string, string> = new Map();
        param.set('id', this.props.match.params.guid);
        param.set('type', this.props.match.params.status);
        getRequest(`/sys/attachment/getOrderFlowDetail/`, param, (response: any) => {

          if (response.status === 200) {
            if (!isNil(response.data)) {
              console.log(response.data)
              const heTongFileList:any = []
              response.data.heTongAttachmentImg.map((item,index) => {
                const heTongObj = {}
                heTongObj['uid'] = index +1
                heTongObj['name'] = item.fileOriginName
                heTongObj['url'] = 'http://58.33.34.10:10443/images/order/'+ item.fileName
                heTongFileList.push(heTongObj)
              })
              response.data.heTongAttachmentOther.map((item,index) => {
                const heTongObj = {}
                heTongObj['uid'] = index +1 + heTongFileList.length
                heTongObj['name'] = item.fileOriginName
                heTongObj['url'] = 'http://58.33.34.10:10443/images/order/'+ item.fileName
                heTongFileList.push(heTongObj)
              })

              const danZhengFileList:any = []

              response.data.danZhengAttachmentImg.map((item,index) => {
                const danZhengObj = {}
                danZhengObj['uid'] = index +1
                danZhengObj['name'] = item.fileOriginName
                danZhengObj['url'] = 'http://58.33.34.10:10443/images/order/'+ item.fileName
                danZhengFileList.push(danZhengObj)
              })
              response.data.danZhengAttachmentOther.map((item,index) => {
                const danZhengObj = {}
                danZhengObj['uid'] = index +1 + danZhengFileList.length
                danZhengObj['name'] = item.fileOriginName
                danZhengObj['url'] = 'http://58.33.34.10:10443/images/order/'+ item.fileName
                danZhengFileList.push(danZhengObj)
              })
              // console.log(response.data.danZhengAttachmentImg , response.data.danZhengAttachmentOther)
              this.setState({
                // 定金
                orderUrl: 'http://58.33.34.10:10443/images/order/',
                orderNumber: response.data.orderDto.orderNumber,
                createDate: moment(response.data.orderDto.createDate).format('YYYY/MM/DD HH:mm:ss'),
                hTFileList: heTongFileList,
                dzFileList: danZhengFileList,
                danZhengAttachmentImg: response.data.danZhengAttachmentImg,
                danZhengAttachmentOther: response.data.danZhengAttachmentOther,
                // 定金支付
                depositDate: moment(response.data.orderDto.depositDate).format('YYYY/MM/DD HH:mm:ss'),
                payMoneyType :response.data.orderDto.depositMoneyType==0?'￥':response.data.orderDto.depositMoneyType==1?'$':'€',
                depositCount: response.data.orderDto.depositCount,
                // 尾款
                balanceDate: moment(response.data.orderDto.balanceDate).format('YYYY/MM/DD HH:mm:ss'),
                finalPaymentCount: response.data.orderDto.finalPaymentCount,
                // 其他
                orderDate: moment(response.data.fuWuFeiAttachments[0].date).format('YYYY/MM/DD HH:mm:ss'),
                orderQuotationSumMoney: response.data.fuWuFeiAttachments[0].orderQuotationSumMoney,

                dingJinAttachments: response.data.dingJinAttachments,
                fuWuFeiAttachments: response.data.fuWuFeiAttachments,
                weiKuanAttachments: response.data.weiKuanAttachments,

                fuWuFeiAttachmentsYiZhiFu:response.data.fuWuFeiAttachmentsYiZhiFu,
              })
              console.log(this.state.fuWuFeiAttachmentsYiZhiFu)
            }
          }
        });
      },
    );
  }
  // 图片放大
    showModal = a => {
      this.setState({
        visible: true,
      });
      this.setState({
        bigImg: a,
      })
    };

    handleOk = (e: any) => {
      // console.log(e);
      this.setState({
        visible: false,
      });
    };

    handleCancel = (e: any) => {
      this.setState({
        visible: false,
      });
    };
  // 返回
  onBack = () => {
    // 得到当前审核状态
    const status = this.props.match.params.status ? this.props.match.params.status : '';
    // 跳转首页
    this.props.history.push(`/orderFlow/list/${status}`);
  };
  makemess = (id: any) => {
    this.props.history.push(`/orderFlow/make/${id}/${this.props.match.params.attachId}/${this.props.match.params.status}`);
  }
  // 驳回或审批通过
  turnDown = (value: any) => {
    const attachId = this.props.match.params.attachId ? this.props.match.params.attachId : '';
    let requestData = {};
    if (value == 1) {
      this.props.form.validateFields((err: any, values: any) => {
        // 需要审批意见
        if (!err) {
          // 资料认证审批
          putRequest('/sys/attachment/auditAttachmentByAttachId?attachId='+ attachId +'&type=' +value, JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              // 跳转首页
              message.success('驳回成功');
              this.props.history.push('/orderFlow/list');
            } else {
              message.error(response.message);
            }
          });
        }
      });
    } else {
      putRequest('/sys/attachment/auditAttachmentByAttachId?attachId='+ attachId +'&type=' +value, JSON.stringify(requestData), (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          message.success('审批通过');
          this.props.history.push('/orderFlow/list');
        } else {
          message.error(response.message);
        }
      });
    }
  };
  render() {
    // Form.Item的布局格式
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const formlayout1 = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const formlayout2 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 9 },
    };
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const { getFieldDecorator } = this.props.form;

    if (this.props.match.params.status == '1') {
      this.certification = getLocale() === 'zh-CN' ? certificationNO : certificationNOEN;
    } else if (this.props.match.params.status == '2') {
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
          </Modal>

        <LabelTitleComponent text="订单信息" event={() => this.onBack()} />
        <div className={commonCss.AddForm + 'orderflow'}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="订单编号">
                  <Input readOnly disabled value={isNil(this.state) || isNil(this.state.orderNumber)
                    ? ''
                    : this.state.orderNumber} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="下单时间">
                  <Input disabled readOnly value={isNil(this.state) || isNil(this.state.createDate)
                    ? ''
                    : this.state.createDate} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="查看合同">
                  <Upload listType='picture' fileList={isNil(this.state) || isNil(this.state.hTFileList) ? '' : this.state.hTFileList}></Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="查看单证">
                  <Upload listType='picture' fileList={isNil(this.state) || isNil(this.state.dzFileList) ? '' : this.state.dzFileList}
                  ></Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Button type="link" onClick={() => this.makemess(this.props.match.params.guid)} style={{ marginLeft: '85%' }}>查看开票信息</Button>
        </div>
        <div>
          {this.props.match.params.status ? (
          <div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>审核流水单详情</span>
          </div>
          <div>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={6}>
                  <Form.Item {...formlayout2} label="定金支付">
                    <div style={{ display: 'flex' }} >
                      {isNil(this.state) || isNil(this.state.dingJinAttachments) ? '' : (this.state.dingJinAttachments.map(item => (
                      <div style={{ width: '100px', height: '100px', marginLeft: '10px', cursor: 'pointer'}}><img src={ isNil(this.state) || isNil(this.state.orderUrl) ? '' : (this.state.orderUrl + item.fileName )} alt="" style={{ width: '100%', height: '100%' }}
                      onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.orderUrl) ? '' : (this.state.orderUrl + item.fileName)) }}/></div>)))}
                    </div>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item {...formlayout1} label="支付时间">
                    <Input readOnly disabled value={isNil(this.state) || isNil(this.state.depositDate)
                      ? ''
                      : this.state.depositDate} />
                  </Form.Item>
                  <Form.Item {...formlayout1} label="已支付金额">
                    <Input readOnly disabled value={isNil(this.state) || isNil(this.state.depositCount)
                      ? ''
                      :this.state.payMoneyType + this.state.depositCount} />
                  </Form.Item>
                  </Col>
                  <Col span={6}>
                  <Form.Item {...formlayout2} label="尾款支付">
                    <div style={{ display: 'flex' }} >
                      {isNil(this.state) || isNil(this.state.weiKuanAttachments) ? '' : (this.state.weiKuanAttachments.map(item => (
                      <div style={{ width: '100px', height: '100px', marginLeft: '10px',cursor: 'pointer' }}><img src={ isNil(this.state) || isNil(this.state.orderUrl) ? '' : (this.state.orderUrl + item.fileName )} alt="" style={{ width: '100%', height: '100%' }}
                      onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.orderUrl) ? '' : (this.state.orderUrl + item.fileName)) }}/></div>)))}
                    </div>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item {...formlayout1} label="支付时间">
                    <Input readOnly disabled value={isNil(this.state) || isNil(this.state.balanceDate)
                      ? ''
                      : this.state.balanceDate} />
                  </Form.Item>
                  <Form.Item {...formlayout1} label="已支付金额">
                    <Input readOnly disabled value={isNil(this.state) || isNil(this.state.finalPaymentCount)
                      ? ''
                      : this.state.payMoneyType + this.state.finalPaymentCount} />
                  </Form.Item>
                </Col>

              </Row>
              {
                this.props.match.params.status ==2?null:(
                  <Row gutter={24}>
                    <Col span={6}>
                      <Form.Item {...formlayout2} label="自定义服务费">
                        <div style={{ display: 'flex' }} >
                          {isNil(this.state) || isNil(this.state.fuWuFeiAttachments) ? '' : (this.state.fuWuFeiAttachments.map(item => (
                          <div style={{ width: '100px', height: '100px', marginLeft: '10px', cursor: 'pointer'}}><img src={ isNil(this.state) || isNil(this.state.orderUrl) ? '' : (this.state.orderUrl + item.fileName )} alt="" style={{ width: '100%', height: '100%' }}
                          onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.orderUrl) ? '' : (this.state.orderUrl + item.fileName)) }}/></div>)))}
                        </div>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item {...formlayout1} label="支付时间">
                        <Input readOnly disabled value={isNil(this.state) || isNil(this.state.orderDate)
                          ? ''
                          : this.state.depositDate} />
                      </Form.Item>
                      <Form.Item {...formlayout1} label="已支付金额">
                        <Input readOnly disabled value={isNil(this.state) || isNil(this.state.orderQuotationSumMoney)
                          ? ''
                          :this.state.payMoneyType + this.state.orderQuotationSumMoney} />
                      </Form.Item>
                      </Col>
                  </Row>
                )

              }

            </Form>
          </div>

          {
            this.props.match.params.status == 0 || this.props.match.params.status == 1 || this.props.match.params.status == 2 ?(
              <div>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>已支付的其他服务费</span>
                </div>
                <div >
                  <List
                     grid={{ gutter: 16, column: 4 }}
                    dataSource={isNil(this.state) || isNil(this.state.fuWuFeiAttachmentsYiZhiFu) ? [] : this.state.fuWuFeiAttachmentsYiZhiFu}
                    renderItem={item => (
                      <List.Item>
                        <div key={item.guid}>
                          <Card>
                              <Row gutter={24}>
                                  <Col span={12}>
                                    <Form.Item  label="自定义服务费">
                                      <div style={{ display: 'flex' }} >
                                        <div style={{ width: '100px', height: '100px', marginLeft: '10px',cursor: 'pointer' }}>
                                          <img src={ isNil(this.state) || isNil(this.state.fuWuFeiAttachmentsYiZhiFu) ? '' : (this.state.orderUrl + item.fileName )} alt="" style={{ width: '100%', height: '100%' }}
                                            onClick={ () => { this.showModal(isNil(this.state) || isNil(this.state.fuWuFeiAttachmentsYiZhiFu) ? '' : (this.state.orderUrl + item.fileName)) }}
                                          />
                                          <div>
                                            <p>
                                              {item.fileOriginName}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                  </Col>
                              </Row>
                              <Row gutter={24}>
                                  <Col span={12}>
                                    <Form.Item  label="支付时间">
                                      <Input readOnly disabled value={moment(item.date).format('YYYY/MM/DD HH:mm:ss')} />
                                    </Form.Item>
                                  </Col>
                                  <Col span={12}>
                                  <Form.Item  label="已支付金额">
                                      <Input readOnly disabled value={(item.orderQuotationSumMoneyType==0?'￥':item.orderQuotationSumMoneyType==1?'$':'€' )+item.orderQuotationSumMoney}/>
                                    </Form.Item>
                                  </Col>
                              </Row>
                            </Card>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            ):null
          }

          </div>) : null}
        </div>
        <div>
          <div className={commonCss.title}>
            <span className={commonCss.text}>审批意见</span>
          </div>
          <Form labelAlign="left">
            <Row gutter={24}>
              {this.props.match.params.status == '0' ? (<Col span={1}></Col>) : null}
              {this.props.match.params.status == '0' ? (
                <Col span={22} style={{ marginLeft: '-2%' }}>
                  <Form.Item required>
                    {getFieldDecorator('note', {
                      rules: [{ max: 300, message: '不能超过300字' },
                      { required: true, message: '审批意见不能为空！' }],
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
              {this.props.match.params.status == '0' ? (
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="TurnDown"
                    text="驳回"
                    event={() => this.turnDown(1)}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params.status == '0' ? (
                <Col span={12}>
                  <ButtonOptionComponent
                    type="Approve"
                    text="审批通过"
                    event={() => this.turnDown(2)}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params.status == '0' ? null : (
                <Col span={12} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="CloseButton"
                    text="关闭"
                    event={() => this.onBack()}
                    disabled={false}
                  />
                </Col>
              )}
              {this.props.match.params.status == '0' ? null : <Col span={7}></Col>}
              {this.props.match.params.status == '0' ? null : (
                <Col span={5}>
                  <div className={commonCss.picTopAndBottom}>
                    <img
                      style={{ marginTop: '-17%', width: '50%' }}
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
              <a onClick={() => linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
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
