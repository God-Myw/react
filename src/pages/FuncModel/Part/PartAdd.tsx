import { getRequest, postRequest, putRequest } from '@/utils/request';
import { checkLength, checkPhone } from '@/utils/validator';
import { Col, Form, Input, Row, Select, Divider, Upload, Icon, Modal, message } from 'antd';
import { isNil } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { PartFormProps } from './PartFormInterface';
import { getDictDetail, linkHref } from '@/utils/utils';
class PartAdd extends React.Component<PartFormProps, PartFormProps> {
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
      phoneCode: '',
      phoneNumber: '',
      remark: '',
      history: this.props.history,
      flag: '1',
      title: '新增',
      previewVisible: false,
      previewImage: '',
      fileList: [],
    });
    let guid = this.props.match.params['guid'];
    if (!isNil(guid)) {
      this.setState({
        title: '修改',
      });
      let param: Map<string, string> = new Map();
      param.set('type', '1');
      getRequest('/business/part/' + guid, param, (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data)) {
            this.setState(
              {
                fileList: [
                  {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url:
                      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                  },
                  {
                    uid: '-2',
                    name: 'image.png',
                    status: 'done',
                    url:
                      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                  },
                ],
                flag: '2',
              },
              () =>
                this.setState({
                  tradeType: response.data.part.tradeType,
                  partName: response.data.part.partName,
                  drawingNumber: response.data.part.drawingNumber,
                  partModel: response.data.part.partModel,
                  partCount: response.data.part.partCount,
                  partNumber: response.data.part.partNumber,
                  contacter: response.data.part.contacter,
                  phoneCode: response.data.part.phoneCode,
                  phoneNumber: response.data.part.phoneNumber,
                  remark: response.data.part.remark,
                }),
            );
          }
        }
      });
    }
  }
  onBack = () => {
    this.props.history.push('/part');
  };

  //提交
  handleSubmit(type: number, flag: string) {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let param = {};
        let picList = [
          {
            fileName: '1',
            fileType: '1',
          },
        ];
        if (flag === '1') {
          param = {
            type: 1,
            partName: this.state.partName,
            tradeType: values.tradeType,
            partModel: this.state.partModel,
            drawingNumber: this.state.drawingNumber,
            partCount: this.state.partCount,
            partNumber: this.state.partNumber,
            contacter: this.state.contacter,
            phoneCode: this.state.phoneCode,
            phoneNumber: this.state.phoneNumber,
            remark: this.state.remark,
            state: type,
            picList: picList,
          };
          //新增备件
          postRequest('/business/part/', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success('新增成功', 2);
              this.props.history.push('/part');
            } else {
              message.success('新增失败', 2);
            }
          });
        } else if (flag === '2') {
          param = {
            type: 1,
            guid: this.state.guid,
            partName: this.state.partName,
            tradeType: values.tradeType,
            partModel: this.state.partModel,
            drawingNumber: this.state.drawingNumber,
            partCount: this.state.partCount,
            partNumber: this.state.partNumber,
            contacter: this.state.contacter,
            phoneCode: this.state.phoneCode,
            phoneNumber: this.state.phoneNumber,
            remark: this.state.remark,
            state: type,
            picList: picList,
          };
          //修改备件
          putRequest('/business/part/', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success('修改成功', 2);
              this.props.history.push('/part');
            } else {
              message.success('修改失败', 2);
            }
          });
        }
      }
    });
  }

  // 检查图片类型
  beforeUpload = (file: any, fileList: any) => {
    // 只能上传三种图片格式
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isBMP = file.type === 'image/bmp';
    const isGIF = file.type === 'image/gif';
    const isWEBP = file.type === 'image/webp';
    const isPic = isJPG || isPNG || isBMP || isGIF || isWEBP;
    if (!isPic) {
      message.error('只能上传图片');
      return false;
    }
    return isPic;
  };

  //控制大图显示
  handleCancel = () => this.setState({ previewVisible: false });

  //查看大图
  handlePreview = async (file: any) => {
    this.setState({
      previewImage: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      previewVisible: true,
    });
  };

  //关闭
  handleChange = ({ fileList }: any) => this.setState({ fileList });

  render() {
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text"></div>
      </div>
    );
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: '+86',
    })(
      <Select>
        <option value="+86">+86</option>
        <option value="+88">+88</option>
      </Select>,
    );
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={
            isNil(this.state) || isNil(this.state.title) ? '' : this.state.title + '备件交易信息'
          }
          event={() => this.onBack()}
        />
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
                  {getFieldDecorator('fileList', {
                    initialValue:
                      this.state == null || this.state.fileList == null ? '' : this.state.fileList,
                    rules: [
                      {
                        required: true,
                        message: '请上传备件图',
                      },
                    ],
                  })(
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      accept="image/png, image/jpeg"
                      beforeUpload={this.beforeUpload}
                      fileList={
                        isNil(this.state) || isNil(this.state.fileList) ? null : this.state.fileList
                      }
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                    >
                      {isNil(this.state) ||
                      isNil(this.state.fileList) ||
                      this.state.fileList.length < 3
                        ? uploadButton
                        : null}
                    </Upload>,
                  )}
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
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '备件名称不能为空!',
                      },
                      {
                        validator: checkLength.bind(this, '备件名称', 5, 10),
                      },
                    ],
                  })(
                    <Input
                      placeholder="备件名称"
                      onChange={e => this.setState({ partName: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="交易身份">
                  {getFieldDecorator('tradeType', {
                    initialValue:
                      this.state == null || this.state.tradeType == null
                        ? ''
                        : this.state.tradeType.toString(),
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '交易身份不能为空!',
                      },
                    ],
                  })(
                    <Select placeholder="交易身份选择">
                      {getDictDetail('trade_type').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
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
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '备件型号不能为空!',
                      },
                      {
                        validator: checkLength.bind(this, '备件型号', 1, 10),
                      },
                    ],
                  })(
                    <Input
                      placeholder="备件型号"
                      onChange={e => this.setState({ partModel: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="图纸号">
                  {getFieldDecorator('drawingNumber', {
                    initialValue:
                      this.state == null || this.state.drawingNumber == null
                        ? ''
                        : this.state.drawingNumber,
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '图纸号不能为空!',
                      },
                      {
                        validator: checkLength.bind(this, '图纸号', 1, 10),
                      },
                    ],
                  })(
                    <Input
                      placeholder="图纸号"
                      onChange={e => this.setState({ drawingNumber: e.target.value })}
                    />,
                  )}
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
                        : this.state.partCount.toString(),
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入正确数量!',
                      },
                    ],
                  })(
                    <Input
                      type="number"
                      placeholder="数量"
                      suffix="件"
                      onChange={e => this.setState({ partCount: Number(e.target.value) })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="备件号">
                  {getFieldDecorator('partNumber', {
                    initialValue:
                      this.state == null || this.state.partNumber == null
                        ? ''
                        : this.state.partNumber,
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '备件号不能为空!',
                      },
                      {
                        validator: checkLength.bind(this, '备件号', 1, 10),
                      },
                    ],
                  })(
                    <Input
                      placeholder="备件号"
                      onChange={e => this.setState({ partNumber: e.target.value })}
                    />,
                  )}
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
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '联系人不能为空!',
                      },
                      {
                        validator: checkLength.bind(this, '联系人', 1, 10),
                      },
                    ],
                  })(
                    <Input
                      placeholder="联系人"
                      onChange={e => this.setState({ contacter: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系方式">
                  {getFieldDecorator('phoneNumber', {
                    initialValue:
                      this.state == null || this.state.phoneNumber == null
                        ? ''
                        : this.state.phoneNumber,
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '联系方式不能为空!',
                      },
                      {
                        validator: checkPhone.bind(this, '联系方式'),
                      },
                    ],
                  })(
                    <div>
                      <Input
                        addonBefore={prefixSelector}
                        placeholder="联系方式"
                        onChange={e => this.setState({ phoneNumber: e.target.value })}
                        value={
                          isNil(this.state) || isNil(this.state.phoneNumber)
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
                  })(
                    <Input
                      style={{ height: '120px' }}
                      onChange={e => this.setState({ remark: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Save"
                  text="保存"
                  event={() => this.handleSubmit(0, this.state.flag)}
                  disabled={false}
                />
              </Col>
              <Col span={12}>
                <ButtonOptionComponent
                  type="SaveAndCommit"
                  text="保存并提交"
                  event={() => this.handleSubmit(1, this.state.flag)}
                  disabled={false}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const PartAdd_Form = Form.create({ name: 'partAdd_Form' })(PartAdd);

export default PartAdd_Form;
