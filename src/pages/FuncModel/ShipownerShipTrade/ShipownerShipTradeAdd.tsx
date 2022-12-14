import { getRequest, postRequest, putRequest } from '@/utils/request';
import { getDictDetail } from '@/utils/utils';
import { checkEmail, checkNumber, checkRemark } from '@/utils/validator';
import { Col, Form, Input, message, Modal, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { isNil } from 'lodash';
import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { ShipownerShipTradeFormProps } from './ShipownerShipTradeFormInterface';

const { confirm } = Modal;
class ShipownerShipTradeAdd extends React.Component<
  ShipownerShipTradeFormProps,
  ShipownerShipTradeFormProps
  > {
  constructor(props: ShipownerShipTradeFormProps) {
    super(props);
  }

  //初始化事件
  componentDidMount() {
    this.setState({
      phoneCode: '+86',
      history: this.props.history,
      flag: '1',
      title: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.add' }),
      tradeType: 0,
    });
    let guid = this.props.match.params['guid'];
    if (!isNil(guid)) {
      this.setState({
        guid: guid,
        title: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.update' }),
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
              remark: response.data.shipTrade.remark,
              email: response.data.shipTrade.email,
              flag: '2',
            });
          }
        }
      });
    }
  }

  onBack = () => {
    this.props.history.push('/ShipownerShipTrade');
  };

  // 提交
  handleSubmit(state: number, guid: number) {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let type;
        if (state === 0) {
          type = 1;
        } else {
          type = 2;
        }

        let param = {};
        if (!isNil(guid)) {
          param = {
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
            remark: this.state.remark,
            email: values.email,
            type: type,
            state: state,
          };
          //修改船舶交易
          putRequest('/business/shipTrade/buyer', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.successfulUpdate' }),
                2,
              );
              this.props.history.push('/ShipownerShipTrade');
            } else {
              message.error(
                formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.failUpdate' }),
                2,
              );
            }
          });
        } else {
          param = {
            tradeType: this.state.tradeType,
            shipType: this.state.shipType,
            tonNumber: this.state.tonNumber,
            shipAge: this.state.shipAge,
            classificationSociety: this.state.classificationSociety,
            voyageArea: this.state.voyageArea,
            contacter: this.state.contacter,
            phoneCode: values.phoneCode,
            phoneNumber: this.state.phoneNumber,
            remark: this.state.remark,
            email: values.email,
            type: type,
            state: state,
          };
          //新增船舶交易
          postRequest('/business/shipTrade/buyer', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.successfulAdd' }),
                2,
              );
              this.props.history.push('/ShipownerShipTrade');
            } else {
              message.error(
                formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.failAdd' }),
                2,
              );
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
        this.props.history.push('/ShipownerShipTrade/addForSale/');
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
      initialValue: isNil(this.state) || isNil(this.state.phoneCode) ? '+86' : this.state.phoneCode,
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
              formatMessage({
                id: 'ShipownerShipTrade-ShipownerShipTradeAdd.shipTradeInformation',
              })
          }
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeList.tradeType',
                  })}
                >
                  {getFieldDecorator('tradeType', {
                    initialValue:
                      this.state == null || this.state.tradeType == null
                        ? ''
                        : this.state.tradeType,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullTradeType',
                        }),
                      },
                    ],
                  })(
                    <Select
                      disabled={!isNil(this.state) && !isNil(this.state.flag) && this.state.flag === '2'}
                      onChange={this.handleTradeTypeSelect}
                    >
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
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeList.shipType',
                  })}
                >
                  {getFieldDecorator('shipType', {
                    initialValue:
                      this.state == null || this.state.shipType == null
                        ? undefined
                        : this.state.shipType,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullShipType',
                        }),
                      },
                    ],
                  })(
                    <Select allowClear={true}
                      placeholder={formatMessage({
                        id: 'ShipownerShipTrade-ShipownerShipTradeList.shipType',
                      })}
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
                  label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.tonnage' })}
                >
                  {getFieldDecorator('tonNumber', {
                    initialValue:
                      this.state == null || this.state.tonNumber == null
                        ? ''
                        : this.state.tonNumber,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.inputCorrectTon',
                        }),
                      },
                      {
                        validator: checkNumber.bind(this),
                      },
                    ],
                  })(
                    <Input
                      suffix={formatMessage({
                        id: 'ShipownerShipTrade-ShipownerShipTradeView.ton',
                      })}
                      placeholder={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.tonnage' })}
                      maxLength={32}
                      onChange={e => this.setState({ tonNumber: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.shipAge' })}
                >
                  {getFieldDecorator('shipAge', {
                    initialValue:
                      this.state == null || this.state.shipAge == null
                        ? undefined
                        : this.state.shipAge,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullShipAge',
                        }),
                      },
                    ],
                  })(
                    <Select allowClear={true}
                      placeholder={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.shipAge' })} onChange={this.handleShipAgeSelect}>
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
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeList.classificationSociety',
                  })}
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
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullClassificationSociety',
                        }),
                      },
                    ],
                  })(
                    <Select allowClear={true}
                      placeholder={formatMessage({
                        id: 'ShipownerShipTrade-ShipownerShipTradeList.classificationSociety',
                      })} onChange={this.handleClassificationSocietySelect}>
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
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeList.voyageArea',
                  })}
                >
                  {getFieldDecorator('voyageArea', {
                    initialValue:
                      this.state == null || this.state.voyageArea == null
                        ? undefined
                        : this.state.voyageArea,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullVoyageArea',
                        }),
                      },
                    ],
                  })(
                    <Select allowClear={true}
                      placeholder={formatMessage({
                        id: 'ShipownerShipTrade-ShipownerShipTradeList.voyageArea',
                      })}
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
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeView.contacter',
                  })}
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
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullContacter',
                        }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={100}
                      placeholder={formatMessage({
                        id: 'ShipownerShipTrade-ShipownerShipTradeView.contacter',
                      })}
                      onChange={e => this.setState({ contacter: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeView.phoneNumber',
                  })}
                >
                  {getFieldDecorator('contactPhone', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.phoneNumber)
                        ? ''
                        : this.state.phoneNumber,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullPhoneNumber',
                        }),
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
                      placeholder={formatMessage({
                        id: 'ShipownerShipTrade-ShipownerShipTradeView.phoneNumber',
                      })}
                      style={{ width: '100%' }}
                      onChange={e => this.setState({ phoneNumber: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.phoneNumber)
                          ? ''
                          : this.state.phoneNumber
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'index-accountManager-email' })}
                >
                  {getFieldDecorator('email', {
                    initialValue:
                      this.state == null || this.state.email == null
                        ? ''
                        : this.state.email,
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
                  })(<Input
                    maxLength={32}
                    placeholder={formatMessage({ id: 'AccountManagement-NewEmailAddress.email.enter' })}
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
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeAdd.otherDescription',
                  })}
                ></Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('remark', {
                    initialValue:
                      this.state == null || this.state.remark == null ? '' : this.state.remark,
                      rules: [
                        {
                          validator: checkRemark.bind(
                            this, 'remark', 0, 250,
                          ),
                        },
                      ],
                  })(<TextArea style={{ height: 90 }}
                  placeholder={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeAdd.otherDescription',
                  })}
                  onChange={e => this.setState({ remark: e.target.value })} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  disabled={false}
                  type="Save"
                  text={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.save' })}
                  event={() => this.handleSubmit(0, this.state.guid)}
                />
              </Col>
              <Col span={12}>
                <ButtonOptionComponent
                  disabled={false}
                  type="SaveAndCommit"
                  text={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeAdd.saveAndSubmit',
                  })}
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
        this.handleSubmit(1, this.state.guid);
      },
    });
  }
}

const ShipTradeAdd_Form = Form.create({ name: 'shipTradeAdd_Form' })(ShipownerShipTradeAdd);

export default ShipTradeAdd_Form;
