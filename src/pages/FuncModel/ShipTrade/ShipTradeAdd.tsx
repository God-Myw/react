import { getRequest, postRequest, putRequest } from '@/utils/request';
import { getDictDetail } from '@/utils/utils';
import { checkEmail, checkNumber, checkPhone } from '@/utils/validator';
import { Col, Form, Input, message, Modal, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { isNil } from 'lodash';
import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { ShipTradeFormProps } from './ShipTradeFormInterface';

const { confirm } = Modal;

class ShipTradeAdd extends React.Component<ShipTradeFormProps, ShipTradeFormProps> {
  constructor(props: ShipTradeFormProps) {
    super(props);
  }

  //初始化事件
  componentDidMount() {
    this.setState({
      contacter: '',
      phoneCode: '',
      phoneNumber: '',
      remark: '',
      history: this.props.history,
      flag: '1',
      title: formatMessage({ id: 'ShipTrade-ShipTradeAdd.add' }),
      tradeType: 0,
    });
    let guid = this.props.match.params['guid'];
    if (!isNil(guid)) {
      this.setState({
        guid: guid,
        title: formatMessage({ id: 'ShipTrade-ShipTradeList.update' }),
      });
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
              email: response.data.shipTrade.email,
              remark: response.data.shipTrade.remark,
              flag: '2',
            });
          }
        }
      });
    }
  }

  onBack = () => {
    this.props.history.push('/shipTrade');
  };

  // 提交
  handleSubmit(type: number, guid: number, states: number) {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let param = {};
        if (!isNil(guid)) {
          param = {
            type: type,
            guid: guid,
            tradeType: this.state.tradeType,
            shipType: this.state.shipType,
            tonNumber: this.state.tonNumber,
            shipAge: this.state.shipAge,
            classificationSociety: this.state.classificationSociety,
            voyageArea: this.state.voyageArea,
            contacter: this.state.contacter,
            phoneCode: values.phoneCode,
            phoneNumber: this.state.phoneNumber,
            email: values.email,
            remark: this.state.remark,
            state: states,
          };
          //修改船舶交易
          putRequest('/business/shipTrade/buyer', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'ShipTrade-ShipTradeAdd.successfullyUpdate' }),
                2,
              );
              this.props.history.push('/shipTrade');
            } else {
              message.error(formatMessage({ id: 'ShipTrade-ShipTradeAdd.failUpdate' }), 2);
            }
          });
        } else {
          param = {
            type: type,
            tradeType: this.state.tradeType,
            shipType: this.state.shipType,
            tonNumber: this.state.tonNumber,
            shipAge: this.state.shipAge,
            classificationSociety: this.state.classificationSociety,
            voyageArea: this.state.voyageArea,
            contacter: this.state.contacter,
            phoneCode: values.phoneCode,
            phoneNumber: this.state.phoneNumber,
            email: values.email,
            remark: this.state.remark,
            state: states,
          };
          //新增船舶交易
          postRequest('/business/shipTrade/buyer', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(formatMessage({ id: 'ShipTrade-ShipTradeAdd.successfullyAdd' }), 2);
              this.props.history.push('/shipTrade');
            } else {
              message.error(formatMessage({ id: 'ShipTrade-ShipTradeAdd.failAdd' }), 2);
            }
          });
        }
      }
    });
  }

  handleTradeTypeSelect = (value: any) => {
    confirm({
      title: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.tradeTypeChange' }),
      okText: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.yes' }),
      cancelText: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.no' }),
      onCancel: () => {
        this.setState({
          tradeType: 0,
        });
        this.props.form.resetFields();
      },
      onOk: () => {
        this.setState({
          tradeType: value,
        });
        this.props.history.push('/shipTrade/addForSale/');
      },
    });
  };

  handleShipTypeSelect = (value: any) => {
    this.setState({
      shipType: value,
    });
  };
  handleShipAgeSelect = (value: any) => {
    this.setState({
      shipAge: value,
    });
  };
  handleClassificationSocietySelect = (value: any) => {
    this.setState({
      classificationSociety: value,
    });
  };
  handleVoyageAreaSelect = (value: any) => {
    this.setState({
      voyageArea: value,
    });
  };

  validator() {
    checkPhone.bind(this, 'phoneNumber');
  }

  //号段选择框
  selectPhoneCode = (id: any, option: any) => {
    this.setState({
      phoneCode: id,
    });
    focus();
  };

  serach = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: isNil(this.state) || this.state.phoneCode === '' ? '+86' : this.state.phoneCode,
    })(
      <Select
        showSearch
        optionFilterProp="children"
        onSelect={this.selectPhoneCode}
        filterOption={this.serach}
        style={{ minWidth: '80px' }}
      >
        {getDictDetail("phone_code").map((item: any) => (
          <Select.Option value={item.textValue}>{item.textValue}</Select.Option>
        ))}
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
            isNil(this.state) || isNil(this.state.title)
              ? ''
              : this.state.title +
              formatMessage({ id: 'ShipTrade-ShipTradeAdd.shipTradeInformation' })
          }
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipTrade-ShipTradeList.tradeType' })}
                >
                  {getFieldDecorator('tradeType', {
                    initialValue:
                      this.state == null || this.state.tradeType == null
                        ? ''
                        : this.state.tradeType,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipTrade-ShipTradeAdd.nullIdentity' }),
                      },
                    ],
                  })(
                    <Select
                      disabled={!isNil(this.state) && !isNil(this.state.flag) && this.state.flag === '2'}
                      onChange={this.handleTradeTypeSelect}>
                      {getDictDetail('trade_type').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipTrade-ShipTradeList.shipType' })}
                >
                  {getFieldDecorator('shipType', {
                    initialValue:
                      this.state == null || this.state.shipType == null ? undefined : this.state.shipType,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipTrade-ShipTradeAdd.nullShipType' }),
                      },
                    ],
                  })(
                    <Select allowClear={true}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeList.shipType' })}
                      onChange={this.handleShipTypeSelect}>
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
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipTrade-ShipTradeAdd.tonnage' })}
                >
                  {getFieldDecorator('tonNumber', {
                    initialValue:
                      this.state == null || this.state.tonNumber == null
                        ? ''
                        : this.state.tonNumber.toString(),
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: formatMessage({ id: 'ShipTrade-ShipTradeAdd.input right Tonnage' }),
                      },
                      {
                        validator: checkNumber.bind(this),
                      },
                    ],
                  })(
                    <Input
                      maxLength={15}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeAdd.tonnage' })}
                      suffix={formatMessage({ id: 'ShipTrade-ShipTradeAdd.ton' })}
                      onChange={e => this.setState({ tonNumber: Number(e.target.value) })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipTrade-ShipTradeList.shipAge' })}
                >
                  {getFieldDecorator('shipAge', {
                    initialValue:
                      this.state == null || this.state.shipAge == null ? undefined : this.state.shipAge,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipTrade-ShipTradeAdd.nullShipAge' }),
                      },
                    ],
                  })(
                    <Select allowClear={true} 
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeList.shipAge' })}
                      onChange={this.handleShipAgeSelect}>
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
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipTrade-ShipTradeList.classificationSociety' })}
                >
                  {getFieldDecorator('classificationSociety', {
                    initialValue:
                      this.state == null || this.state.classificationSociety == null
                        ? undefined
                        : this.state.classificationSociety,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipTrade-ShipTradeAdd.nullClassificationSociety',
                        }),
                      },
                    ],
                  })(
                    <Select allowClear={true}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeList.classificationSociety' })}
                      onChange={this.handleClassificationSocietySelect}>
                      {getDictDetail('classification_society').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipTrade-ShipTradeList.voyageArea' })}
                >
                  {getFieldDecorator('voyageArea', {
                    initialValue:
                      this.state == null || this.state.voyageArea == null
                        ? undefined
                        : this.state.voyageArea,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipTrade-ShipTradeAdd.nullvoyageArea' }),
                      },
                    ],
                  })(
                    <Select allowClear={true}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeList.voyageArea' })}
                      onChange={this.handleVoyageAreaSelect}>
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
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipTrade-ShipTradeAdd.contacter' })}
                >
                  {getFieldDecorator('contacter', {
                    initialValue:
                      this.state == null || this.state.contacter == null
                        ? ''
                        : this.state.contacter,
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: formatMessage({ id: 'ShipTrade-ShipTradeAdd.nullContacter' }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={100}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeAdd.contacter' })}
                      onChange={e => this.setState({ contacter: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipTrade-ShipTradeAdd.phoneNumber' })}
                >
                  {getFieldDecorator('phoneNumber', {
                    initialValue:
                      this.state == null || this.state.phoneNumber == null
                        ? ''
                        : this.state.phoneNumber,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipTrade-ShipTradeAdd.nullPhoneNumber' }),
                      },
                      {
                        pattern: new RegExp(/^[0-9]\d*$/),
                        message: formatMessage({ id: 'insuranceForShipper-insuranceAdd.phonenumber.enter.correct' }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={20}
                      addonBefore={prefixSelector}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeAdd.phoneNumber' })}
                      name="phoneNumber"
                      onChange={e => this.setState({ phoneNumber: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.phoneNumber)
                          ? ''
                          : this.state.phoneNumber
                      }
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipTrade-ShipTradeList.email' })}
                >
                  {getFieldDecorator('email', {
                    initialValue:
                      this.state == null || this.state.email == null ? '' : this.state.email,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'index-accountManager-email.null' }),
                      },
                      {
                        validator: checkEmail.bind(
                          this, 'email',
                        ),
                      },
                    ],
                  })(
                    <Input
                      maxLength={32}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeList.email-enter' })}
                      onChange={e => this.setState({ email: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipTrade-ShipTradeAdd.otherDescription' })}
                ></Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('remark', {
                    initialValue:
                      this.state == null || this.state.remark == null ? '' : this.state.remark,
                  })(<TextArea style={{ height: 90 }}
                    maxLength={250}
                    placeholder={formatMessage({ id: 'ShipTrade-ShipTradeAdd.otherDescription' })}
                    onChange={e => this.setState({ remark: e.target.value })} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  disabled={false}
                  type="Save"
                  text={formatMessage({ id: 'ShipTrade-ShipTradeAdd.save' })}
                  event={() => this.handleSubmit(1, this.state.guid, 0)}
                />
              </Col>
              <Col span={12}>
                <ButtonOptionComponent
                  disabled={false}
                  type="SaveAndCommit"
                  text={formatMessage({ id: 'ShipTrade-ShipTradeAdd.saveAndSubmit' })}
                  event={() => this.newMethod()}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
  private newMethod() {
    confirm({
      title: formatMessage({ id: 'Common-Publish.confirm.not' }),
      okText: formatMessage({
        id: 'Common-Publish.publish.confirm',
      }),
      cancelText: formatMessage({
        id: 'Common-Publish.publish.cancle',
      }),
      onOk: () => {
        this.handleSubmit(1, this.state.guid, 1);
      },
    });
  }
}

const ShipTradeAdd_Form = Form.create({ name: 'shipTradeAdd_Form' })(ShipTradeAdd);

export default ShipTradeAdd_Form;
