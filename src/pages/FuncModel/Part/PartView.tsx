import getRequest from '@/utils/request';
import { Col, Form, Input, Row, Select, Divider, Upload, Icon, Modal } from 'antd';
import { isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { PartFormProps } from './PartFormInterface';
import { linkHref } from '@/utils/utils';

class PartView extends React.Component<PartFormProps, PartFormProps> {
  constructor(props: PartFormProps) {
    super(props);
  }

  componentDidMount() {
    this.setState({
      partName: '',
      drawingNumber: '',
      partModel: '',
      partNumber: '',
      contacter: '',
      phoneNumber: '',
      remark: '',
      history: this.props.history,
      previewVisible: false,
      previewImage: '',
      fileList: [],
    });
    let guid = this.props.match.params['guid'];
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    getRequest('/business/part/' + guid, param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            partName: response.data.part.partName,
            tradeType: response.data.part.tradeType,
            drawingNumber: response.data.part.drawingNumber,
            partModel: response.data.part.partModel,
            partCount: response.data.part.partCount,
            partNumber: response.data.part.partNumber,
            contacter: response.data.part.contacter,
            phoneNumber: response.data.part.phoneNumber,
            remark: response.data.part.remark,
            fileList: [
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              },
              {
                uid: '-2',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              },
            ],
          });
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/part');
  };

  //控制大图显示
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file: any) => {
    this.setState({
      previewImage: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      previewVisible: true,
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
        <LabelTitleComponent text="查看船舶交易信息" event={() => this.onBack()} />
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
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="备件图" required></Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout}>
                  <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={
                      isNil(this.state) || isNil(this.state.fileList) ? null : this.state.fileList
                    }
                    onPreview={this.handlePreview}
                  ></Upload>
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="备件名称">
                  {getFieldDecorator('partName', {
                    initialValue:
                      this.state == null || this.state.partName == null ? '' : this.state.partName,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="交易身份">
                  {getFieldDecorator('tradeType', {
                    initialValue:
                      this.state == null || this.state.tradeType == null
                        ? ''
                        : this.state.tradeType.toString(),
                  })(
                    <Select disabled showArrow={false}>
                      <option value="1">卖家</option>
                      <option value="2">买家</option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="备件型号">
                  {getFieldDecorator('partModel', {
                    initialValue:
                      this.state == null || this.state.partModel == null
                        ? ''
                        : this.state.partModel,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="图纸号">
                  {getFieldDecorator('drawingNumber', {
                    initialValue:
                      this.state == null || this.state.drawingNumber == null
                        ? ''
                        : this.state.drawingNumber,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="数量">
                  {getFieldDecorator('partCount', {
                    initialValue:
                      this.state == null || this.state.partCount == null
                        ? ''
                        : this.state.partCount,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="备件号">
                  {getFieldDecorator('partNumber', {
                    initialValue:
                      this.state == null || this.state.partNumber == null
                        ? ''
                        : this.state.partNumber,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系人">
                  {getFieldDecorator('contacter', {
                    initialValue:
                      this.state == null || this.state.contacter == null
                        ? ''
                        : this.state.contacter,
                  })(<Input disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系方式">
                  {getFieldDecorator('phoneNumber', {})(
                    <div>
                      <Input
                        disabled
                        placeholder="+86"
                        style={{ width: '10%' }}
                        value={
                          this.state == null || this.state.phoneNumber == null
                            ? ''
                            : this.state.phoneNumber
                        }
                      />
                      <Input
                        disabled
                        style={{ width: '86%', marginLeft: '20px' }}
                        value={
                          this.state == null || this.state.phoneNumber == null
                            ? ''
                            : this.state.phoneNumber
                        }
                      />
                    </div>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="其他说明"></Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('remark', {
                    initialValue:
                      this.state == null || this.state.remark == null ? '' : this.state.remark,
                  })(<Input disabled style={{ height: '120px' }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Close"
                  text="关闭"
                  event={() => this.onBack()}
                  disabled={false}
                />
              </Col>
              <Col span={12}></Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const PartView_Form = Form.create({ name: 'partView_Form' })(PartView);

export default PartView_Form;
