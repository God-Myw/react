import { getRequest, postRequest, putRequest } from '@/utils/request';
import { getDictDetail, items } from '@/utils/utils';
import { Button, Checkbox, Col, DatePicker, Divider, Form, Input, message, Modal, Row, Select } from 'antd';
import isNill, { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import ButtonOptionComponent from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import InsuranceFormProps from './insuranceinterface';
import {instructions_for_insurance,transportation_insurance_CN,transportation_insurance_US} from '../../Protocol/protocols';
import { getLocale } from 'umi-plugin-react/locale';

const { Option } = Select;

interface IState {
  sporttime: Date;
  agreePro: boolean;
  modalVisible0: boolean;
  modalVisible1: boolean;
  modalVisible2: boolean;
  buttonDisabled: boolean;
  companys: Array<items>;
  companyRate: Array<companyRate>;
  flag: string;
  goodsName: string;
  goodstype: string;
  packing: string;
  goodsCount: string;
  packageNumber: string;
  bill: string;
  phoneCode: string;
  contactNumber: string;
  order: string;
  holderName: string;
  combination: string;
  ownerName: string;
  insuredPhoneCode: string;
  ownerContarct: string;
  ownercombination: string;
  shiplines: string;
  ways: string;
  shipage: string;
  travelStart: string;
  travelEnd: string;
  goodsValue: string;
  insuranceValue: string;
  insuranceCompany: string;
  insuranceTypes: string;
  tips: string;
  tipsaccount: string;
  guid: string;
  rate?: string;
  packageUnitName: string;
}

interface companyRate {
  code: number;
  rate: number;
}

const { confirm } = Modal;
const dateFormat = 'YYYY/MM/DD';
let type: string;
//货主投保新增页面
class InsuranceAdd extends React.Component<InsuranceFormProps, IState> {
  constructor(props: InsuranceFormProps) {
    super(props);
  }
  state = {
    sporttime: new Date(), //起运时间
    agreePro: false,
    modalVisible0: false,
    modalVisible1: false,
    modalVisible2: false,
    buttonDisabled: true,
    companys: [],
    companyRate: [],
    flag: '',
    goodsName: '',
    goodstype: '',
    packing: '',
    goodsCount: '',
    packageNumber: '',
    bill: '',
    phoneCode: '',
    contactNumber: '',
    order: '',
    holderName: '',
    combination: '',
    ownerName: '',
    insuredPhoneCode: '',
    ownerContarct: '',
    ownercombination: '',
    shiplines: '',
    ways: '',
    shipage: '',
    travelStart: '',
    travelEnd: '',
    goodsValue: '',
    insuranceValue: '',
    insuranceCompany: '',
    insuranceTypes: '',
    tips: '',
    tipsaccount: '',
    guid: this.props.match.params['guid'] ? this.props.match.params['guid'] : '',
    rate: '',
    packageUnitName: '',
  };
  componentDidMount() {
    //调取查询保险公司列表接口,获取页面的保险公司下拉值
    let companyItem: items[] = [];
    let companyRate: companyRate[] = [];
    let com: Map<string, string> = new Map();
    com.set('type', '1');
    com.set('pageSize', '-1');
    com.set('currentPage', '-1');
    getRequest('/sys/insuranceCompany', com, (response: any) => {
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          forEach(response.data.insuranceCompanys, (company, index) => {
            companyItem.push({ code: company.guid, textValue: company.companyNameCn });
            companyRate.push({ code: company.guid, rate: company.rate });
          });
        }
        this.setState({ companys: companyItem, companyRate: companyRate });
      }
    });

    let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    this.setState({ rate: this.props.match.params['rate'] });
    if (guid) {
      type = '2';
      //修改跳转操作
      let params: Map<string, string> = new Map();
      params.set('type', '2');
      //通过ID获取投保信息
      getRequest('/business/insurance/' + guid, params, (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data)) {
            this.setState({
              goodsName: response.data.insurance.goods,
              goodstype: response.data.insurance.goodsType,
              packing: response.data.insurance.packing,//包装方式
              packageUnitName: response.data.insurance.packageUnitName,//包装单位名称
              goodsCount: response.data.insurance.goodsCount,//货物数量
              bill: response.data.insurance.invoiceContractNumber,
              order: response.data.insurance.billOfLadingWaybillNumber,
              holderName: response.data.insurance.policyHolder,
              phoneCode: response.data.insurance.phoneCode,
              contactNumber: response.data.insurance.contactNumber,
              combination: response.data.insurance.organizationCode,
              ownerName: response.data.insurance.insuredName,
              insuredPhoneCode: response.data.insurance.insuredPhoneCode,
              ownerContarct: response.data.insurance.insuredContactNumber,
              ownercombination: response.data.insurance.insuredOrganizationCode,
              shiplines: response.data.insurance.voyageName,
              shipage: response.data.insurance.shipAge,
              ways: response.data.insurance.transportType,
              sporttime: response.data.insurance.transportStart,
              travelStart: response.data.insurance.departure,
              travelEnd: response.data.insurance.destination,
              goodsValue: response.data.insurance.goodsValue,
              insuranceValue: response.data.insurance.insuranceMoney,
              insuranceCompany: response.data.insurance.insuranceCompany,
              insuranceTypes: response.data.insurance.insuranceCategory,
              tips: response.data.insurance.insuranceRate,
              tipsaccount: response.data.insurance.premiumCalculation,
              flag: '2',
            });
          }
        }
      });
    } else {
      //新增操作
      type = '1';
      this.setState({ flag: '1' });
    }
  }

  //保存处理
  addInsurance1() {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        // if (this.state.buttonDisabled) {
        //   message.error(formatMessage({ id: 'insuranceForShipper-insuranceAdd.read' }));
        //   return;
        // }
        
        let requestData = {
          type: 1,
          guid: this.state.guid ? this.state.guid : -1,
          state: 0,
          goods: values.goodsName,
          goodsType: values.goodstype,
          goodsCount: values.goodsCount,
          packageUnitName: values.packageUnitName,
          packing: values.packing,
          invoiceContractNumber: values.bill,
          billOfLadingWaybillNumber: values.order,
          policyHolder: values.holderName,
          phoneCode: values.phoneCode,
          contactNumber: values.contactNumber,
          organizationCode: values.combination,
          insuredName: values.ownerName,
          insuredPhoneCode: values.insuredPhoneCode,
          insuredContactNumber: values.ownerContarct,
          insuredOrganizationCode: values.ownercombination,
          voyageName: values.shiplines,
          transportType: values.ways,
          shipAge: values.shipage,
          transportStart: moment(values.sporttime).valueOf(),
          departure: values.travelStart,
          destination: values.travelEnd,
          goodsValue: values.goodsValue,
          insuranceMoney: this.state.insuranceValue,
          insuranceCompany: values.insuranceCompany,
          insuranceCategory: values.insuranceTypes,
          insuranceRate: values.tips,
          premiumCalculation: values.tipsaccount,
        };

        //新增保存
        if (type === '1') {
          postRequest(
            '/business/insurance/consignor',
            JSON.stringify(requestData),
            (response: any) => {
              if (response.status === 200) {
                message.success(
                  formatMessage({ id: 'insuranceForShipper-insuranceAdd.add.success' }),
                  2,
                );
                this.onBack();
              }
            },
          );
        } else if (type === '2') {
          putRequest(
            '/business/insurance/consignor',
            JSON.stringify(requestData),
            (response: any) => {
              if (response.status === 200) {
                message.success(
                  formatMessage({ id: 'insuranceForShipper-insuranceAdd.alter.success' }),
                  2,
                );
                this.onBack();
              }
            },
          );
        }
      }
    });
  }
  //保存并提交处理
  publishInsurance1() {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        if (this.state.buttonDisabled) {
          message.error(formatMessage({ id: 'insuranceForShipper-insuranceAdd.read' }));
          return;
        }
        let requestData = {
          type: 2,
          guid: this.state.guid ? this.state.guid : '',
          state: 1,
          goods: values.goodsName,
          goodsType: values.goodstype,
          goodsCount: values.goodsCount,
          packageUnitName: values.packageUnitName,
          packing: values.packing,
          invoiceContractNumber: values.bill,
          billOfLadingWaybillNumber: values.order,
          policyHolder: values.holderName,
          phoneCode: values.phoneCode,
          contactNumber: values.contactNumber,
          organizationCode: values.combination,
          insuredName: values.ownerName,
          insuredPhoneCode: values.insuredPhoneCode,
          insuredContactNumber: values.ownerContarct,
          insuredOrganizationCode: values.ownercombination,
          voyageName: values.shiplines,
          transportType: values.ways,
          shipAge: values.shipage,
          transportStart: moment(values.sporttime).valueOf(),
          departure: values.travelStart,
          destination: values.travelEnd,
          goodsValue: values.goodsValue,
          insuranceMoney: this.state.insuranceValue,
          insuranceCompany: values.insuranceCompany,
          insuranceCategory: values.insuranceTypes,
          insuranceRate: values.tips,
          premiumCalculation: values.tipsaccount,
        };

        //新增保存并提交
        if (this.state.flag === '1') {
          postRequest(
            '/business/insurance/consignor',
            JSON.stringify(requestData),
            (response: any) => {
              if (response.status === 200) {
                message.success(
                  formatMessage({ id: 'insuranceForShipper-insuranceAdd.add.success' }),
                  2,
                  this.onBack,
                );
              }
            },
          );
        } else if (this.state.flag === '2') {
          putRequest(
            '/business/insurance/consignor',
            JSON.stringify(requestData),
            (response: any) => {
              if (response.status === 200) {
                message.success(
                  formatMessage({ id: 'insuranceForShipper-insuranceAdd.alter.success' }),
                  2,
                  this.onBack,
                );
              }
            },
          );
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/insurance_shipper/list');
  };

  onChange(value: any, dateStrng: Date) {
    this.setState({ sporttime: dateStrng });
  }

  //checkTime
  checkTime = (name: string, rule: any, val: any, callback: any) => {
    const date = moment(val).format('YYYY/MM/DD');
    if (name === 'sporttime') {
      if (moment(date).isBefore(moment().format('YYYY/MM/DD'))) {
        callback(formatMessage({ id: 'insuranceForshipowner.check.loadDate.greater.current' }));
      } else {
        callback();
      }
    } 
  };

  //根据货值计算保险金额
  calInsuranceValue(type: string, good: any) {
    if (type === 'money') {
      const value: number = Number(good);
      const inValue: string = Number((value) * Number(this.state.rate)).toFixed(3);
      this.props.form.setFieldsValue({
        insuranceValue: inValue,
        goodsValue:good
      });
      this.setState({ goodsValue: good, insuranceValue: inValue },()=>{
        if (this.state.tips) {
          let inValue: string = Number(Number(this.state.tips) * Number(this.state.insuranceValue)).toFixed(3);
          this.props.form.setFieldsValue({
            tipsaccount: inValue,
          });
          this.setState({ tipsaccount: inValue });
        }
      });
    } else if (type === 'rate') {
      const value: any = Number(good);
      const inValue: any = Number(Number(this.state.insuranceValue) * value).toFixed(3);
      this.props.form.setFieldsValue({
        tipsaccount: inValue,
        tips:good
      });
    }
  }

  // 改变checkbox的状态事件
  agreeChange = (e: { target: { checked: any } }) => {
    this.setState({
      agreePro: e.target.checked,
      buttonDisabled: !e.target.checked,
    });
  };

  showProtoco0 = () => {
    this.setState({
      modalVisible0: true,
    });
  };

  // modal click OK
  handleOk0 = () => {
    this.setState({
      modalVisible0: false,
    });
  };

  handleCance0 = () => {
    this.setState({
      modalVisible0: false,
    });
  };
  showProtocol = () => {
    this.setState({
      modalVisible1: true,
    });
  };

  // modal click OK
  handleOk1 = () => {
    this.setState({
      modalVisible1: false,
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible1: false,
    });
  };
  showProtoco2 = () => {
    this.setState({
      modalVisible2: true,
    });
  };

  // modal click OK
  handleOk2 = () => {
    this.setState({
      modalVisible2: false,
    });
  };

  handleCance2 = () => {
    this.setState({
      modalVisible2: false,
    });
  };

  //号段选择框
  selectPhoneCode = (id: any, option: any) => {
    this.setState({
      phoneCode: id,
    });
    focus();
  };

  selectCompany = (value: any, option: any) => {
    if (this.state.companyRate.length > 0) {
      forEach(this.state.companyRate, (item: any) => {
        if (item.code === value) {
          this.setState({
            insuranceCompany: value,
            tips: item.rate,
          }, () => {
            this.calInsuranceValue('rate', this.state.tips);
          });
        }
      })
    }

  };

  //号段选择框
  selectinsuredPhoneCode = (id: any, option: any) => {
    this.setState({
      insuredPhoneCode: id,
    });
    focus();
  };

  serach = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  checkPort = (checkValue: string, rule: any, val: any, callback: any) => {
    if (checkValue !== '') {
      if (val === checkValue) {
        callback(formatMessage({ id: 'pallet-palletAdd.goods.checkport' }));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  selectTravelStart = (value: any) => {
    this.setState({
      travelStart: value
    }, () => {
      if (!isNil(this.state.travelEnd) && this.state.travelEnd !== '') {
        this.props.form.validateFields(['travelStart', 'travelEnd']);
      }
    });
  };

  selectTravelEnd = (value: any) => {
    this.setState({
      travelEnd: value
    }, () => {
      if (!isNil(this.state.travelStart) && this.state.travelStart !== '') {
        this.props.form.validateFields(['travelStart', 'travelEnd']);
      }
    });
  };

  //校验数字(最多保存三位小数)
  checkNumber = (rule: any, value: any, callback: any) => {
    if (value !== '' && !/^[0-9]+\.{0,1}[0-9]{0,3}$/.test(value)) {
      if(value.includes(".")){
        if(value.split(".")[1].length > 3){
          callback(formatMessage({ id: 'pallet-palletAdd.check.number', }))
        }else{
          callback(formatMessage({ id: 'user-login.login.pls-input-number', }));
        }
      }else{
        callback(formatMessage({ id: 'user-login.login.pls-input-number', }));
      }
    } else {
      callback();
    }
  };


  render() {
    const { getFieldDecorator } = (this as any).props.form;
    const { companys } = this.state;

    //手机前缀
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

    const prefix = getFieldDecorator('insuredPhoneCode', {
      initialValue:
        isNil(this.state) || this.state.insuredPhoneCode === ''
          ? '+86'
          : this.state.insuredPhoneCode,
    })(
      <Select
        showSearch
        optionFilterProp="children"
        onSelect={this.selectinsuredPhoneCode}
        filterOption={this.serach}
        style={{ minWidth: '80px' }}
      >
        {getDictDetail("phone_code").map((item: any) => (
          <Select.Option value={item.textValue}>{item.textValue}</Select.Option>
        ))}
      </Select>,
    );
    const package_unit_name = getFieldDecorator('packageUnitName', {
      initialValue:
        isNil(this.state) || this.state.packageUnitName === ''
          ? 0
          : this.state.packageUnitName,
    })(
      <Select
        style={{ width: '80px' }}>
        {getDictDetail('package_unit_name').map((item: any) => (
          <Select.Option value={item.code}>{item.textValue}</Select.Option>
        ))}
      </Select>
    );

    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <div className={commonCss.title}>
          <LabelTitleComponent
            text={formatMessage({ id: 'insuranceForShipper-insuranceAdd.cargo.information' })}
            event={() => this.onBack()}
          />
        </div>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.goods.name' })}
                >
                  {getFieldDecorator('goodsName', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsName) ? '' : this.state.goodsName,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.enter.goods.name-null',
                        }),
                      },
                    ],
                  })(
                    <Input
                      id="goodsName"
                      maxLength={32}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.enter.goods.name',
                      })}
                      onChange={e => this.setState({ goodsName: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.type' })}
                >
                  {getFieldDecorator('goodstype', {
                    initialValue:
                      isNil(this.state) ||
                        isNil(this.state.goodstype) ||
                        this.state.goodstype === ''
                        ? undefined
                        : this.state.goodstype,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.enter.type-null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.enter.type',
                      })}
                      onChange={e => (value: any) => {
                        this.setState({ goodstype: value });
                      }}
                    >
                      {getDictDetail('goods_type').map((item: any) => (
                        <Select.Option value={item.code}>{item.textValue}</Select.Option>
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
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.quantity.packingNum' })}
                >
                  {getFieldDecorator('goodsCount', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsCount)
                        ? ''
                        : this.state.goodsCount,

                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.quantity.packing.enter-null',
                        }),
                      },
                      {
                        validateFirst: false,
                        pattern: /^[1-9]\d*$/,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.quantity.packing.enter',
                        }),
                      },
                    ],
                  })(
                    <Input
                      id="goodsCount"
                      style={{ width: '100%' }}
                      addonAfter={package_unit_name}
                      maxLength={10}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.quantity.packing.enter',
                      })}
                      onChange={e => this.setState({ goodsCount: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.packing.unit' })}
                >
                  {getFieldDecorator('packing', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.packing) || this.state.packing === ''
                        ? undefined
                        : this.state.packing,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.packing.unit.enter-null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.packing.unit.enter',
                      })}
                      onChange={e => (value: any) => {
                        this.setState({ packing: value });
                      }}
                    >
                      {getDictDetail('packing').map((item: any) => (
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
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.invoice' })}
                >
                  {getFieldDecorator('bill', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.bill) ? '' : this.state.bill,

                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.invoice.enter-null',
                        }),
                      },
                    ],
                  })(
                    <Input
                      id="bill"
                      maxLength={32}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.invoice.enter',
                      })}
                      onChange={e => this.setState({ bill: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.waybill' })}
                >
                  {getFieldDecorator('order', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.order) ? '' : this.state.order,

                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.waybill.enter-null',
                        }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={32}
                      id="order"
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.waybill.enter',
                      })}
                      onChange={e => this.setState({ order: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Divider dashed />
        <div className={commonCss.title}>
          <span className={commonCss.text}>
            {formatMessage({ id: 'insuranceForShipper-insuranceAdd.insurance.information' })}
          </span>
        </div>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.insured.name' })}
                >
                  {getFieldDecorator('holderName', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.holderName)
                        ? ''
                        : this.state.holderName,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.insured.name.enter-null',
                        }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={32}
                      id="holderName"
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.insured.name',
                      })}
                      onChange={e => this.setState({ holderName: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.insured.contact.way' })}
                  className="padrightnone"
                >
                  {getFieldDecorator('contactNumber', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.contactNumber)
                        ? ''
                        : this.state.contactNumber,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForshipowner.insuranceAdd.phonenumber-null',
                        }),
                      },
                      {
                        pattern: new RegExp(/^[0-9]\d*$/),
                        message: formatMessage({ id: 'insuranceForShipper-insuranceAdd.insured.correct.phonenumber.enter-null' }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={20}
                      addonBefore={prefixSelector}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.insured.correct.phonenumber.enter',
                      })}
                      style={{ width: '100%' }}
                      onChange={e => this.setState({ contactNumber: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.contactNumber)
                          ? ''
                          : this.state.contactNumber
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
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.organize.code' })}
                >
                  {getFieldDecorator('combination', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.combination)
                        ? ''
                        : this.state.combination,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.organize.code.enter-null',
                        }),
                      },
                    ],
                  })(
                    <Input
                      id="combination"
                      maxLength={32}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.organize.code.enter',
                      })}
                      onChange={e => this.setState({ combination: e.target.value })}
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
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.be.insured.name' })}
                >
                  {getFieldDecorator('ownerName', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.ownerName) ? '' : this.state.ownerName,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.be.insured.name.enter-null',
                        }),
                      },
                    ],
                  })(
                    <Input
                      id="ownerName"
                      maxLength={32}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.be.insured.name.enter',
                      })}
                      onChange={e => this.setState({ ownerName: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.contact.way' })}
                >
                  {getFieldDecorator('ownerContarct', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.ownerContarct)
                        ? ''
                        : this.state.ownerContarct,

                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.correct.phonenumber.enter-null',
                        }),
                      },
                      {
                        pattern: new RegExp(/^[0-9]\d*$/),
                        message: formatMessage({ id: 'insuranceForShipper-insuranceAdd.phonenumber.enter.correct' }),
                      },
                    ],
                  })(
                    <Input
                      addonBefore={prefix}
                      maxLength={20}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.phonenumber.enter',
                      })}
                      onChange={e => this.setState({ ownerContarct: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'insuranceForShipper-insuranceAdd.be.insured.organize.code',
                  })}
                >
                  {getFieldDecorator('ownercombination', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.ownercombination)
                        ? ''
                        : this.state.ownercombination,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id:
                            'insuranceForShipper-insuranceAdd.be.insured.organize.code.enter-null',
                        }),
                      },
                    ],
                  })(
                    <Input
                      id="ownercombination"
                      maxLength={32}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.be.insured.organize.code.enter',
                      })}
                      onChange={e => this.setState({ ownercombination: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Divider dashed />

        <div className={commonCss.title}>
          <span className={commonCss.text}>
            {formatMessage({ id: 'insuranceForShipper-insuranceAdd.transport.information' })}
          </span>
        </div>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.name.and.voyage' })}
                >
                  {getFieldDecorator('shiplines', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shiplines) ? '' : this.state.shiplines,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.name.and.voyage.enter-null',
                        }),
                      },
                    ],
                  })(
                    <Input
                      id="shiplines"
                      maxLength={32}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.name.and.voyage.enter',
                      })}
                      onChange={e => this.setState({ shiplines: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.transportation' })}
                >
                  {getFieldDecorator('ways', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.ways) || this.state.ways === ''
                        ? undefined
                        : this.state.ways,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.transportation.enter-null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.transportation.enter',
                      })}
                      onChange={e => (value: any) => {
                        this.setState({ ways: value });
                      }}
                    >
                      {getDictDetail('transport_way').map((item: any) => (
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
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.age' })}
                >
                  {getFieldDecorator('shipage', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipage) || this.state.shipage === ''
                        ? undefined
                        : this.state.shipage,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.age.enter-null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.age.enter',
                      })}
                      onChange={e => (value: any) => {
                        this.setState({ shipage: value });
                      }}
                    >
                      {getDictDetail('ship_age').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.time.start' })}
                >
                  {getFieldDecorator('sporttime', {
                    initialValue:
                      isNill(this.state) || isNill(this.state.sporttime)
                        ? moment(new Date(), dateFormat)
                        : moment(this.state.sporttime, dateFormat),
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.time.start.choose-null',
                        }),
                      },
                      {
                        validator: this.checkTime.bind(this, 'sporttime')
                      }
                    ],
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      format={dateFormat}
                      onChange={() => this.onChange.bind(this)}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.port.start' })}
                >
                  {getFieldDecorator('travelStart', {
                    initialValue:
                      isNil(this.state) ||
                        isNil(this.state.travelStart) ||
                        this.state.travelStart === ''
                        ? undefined
                        : this.state.travelStart,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.port.start.choose-null',
                        }),
                      },
                      {
                        validator: this.checkPort.bind(
                          this,
                          isNil(this.state) || isNil(this.state.travelEnd)
                            ? ''
                            : this.state.travelEnd,
                        ),
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.port.start.choose',
                      })}
                      optionFilterProp="children"
                      onChange={this.selectTravelStart}
                      filterOption={this.serach}
                    >
                      {getDictDetail('port').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.destination' })}
                >
                  {getFieldDecorator('travelEnd', {
                    initialValue:
                      isNil(this.state) ||
                        isNil(this.state.travelEnd) ||
                        this.state.travelEnd === ''
                        ? undefined
                        : this.state.travelEnd,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.destination.choose-null',
                        }),
                      },
                      {
                        validator: this.checkPort.bind(
                          this,
                          isNil(this.state) || isNil(this.state.travelStart)
                            ? ''
                            : this.state.travelStart,
                        ),
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.destination.choose',
                      })}
                      optionFilterProp="children"
                      onChange={this.selectTravelEnd}
                      filterOption={this.serach}
                    >
                      {getDictDetail('port').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Divider dashed />

        <div className={commonCss.title}>
          <span className={commonCss.text}>
            {formatMessage({ id: 'insuranceForShipper-insuranceAdd.calculate' })}
          </span>
        </div>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.value' })}
                >
                  {getFieldDecorator('goodsValue', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.goodsValue) || this.state.goodsValue === ''
                        ? ''
                        : Number(this.state.goodsValue),
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.correct.value.enter-null',
                        }),
                      },
                      {
                        validator: this.checkNumber.bind(this)
                      },
                    ],
                  })(
                    <Input
                      maxLength={15}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.value.enter',
                      })}
                      onChange={e => this.calInsuranceValue('money', e.target.value)}
                      suffix='￥'
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.amount' })}
                >
                  {getFieldDecorator('insuranceValue', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.insuranceValue)
                        ? ''
                        : this.state.insuranceValue,
                  })(
                    <Input
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.amount.value',
                      })}
                      disabled={true}
                      suffix='￥'
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.company' })}
                >
                  {getFieldDecorator('insuranceCompany', {
                    initialValue:
                      isNil(this.state) ||
                        isNil(this.state.insuranceCompany) ||
                        this.state.insuranceCompany === ''
                        ? undefined
                        : this.state.insuranceCompany,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.company.choose-null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.company.choose',
                      })}
                      onChange={this.selectCompany}
                    >
                      {companys.map((item: any) => (
                        <Select.Option value={item.code}>{item.textValue}</Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.insurance.type' })}
                >
                  {getFieldDecorator('insuranceTypes', {
                    initialValue:
                      isNil(this.state) ||
                        isNil(this.state.insuranceTypes) ||
                        this.state.insuranceTypes === ''
                        ? undefined
                        : this.state.insuranceTypes,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.insurance.type.choose-null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.insurance.type.choose',
                      })}
                      onChange={e => (value: any) => {
                        this.setState({ insuranceTypes: value });
                      }}
                    >
                      {getDictDetail('insurance_type').map((item: any) => (
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
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.rate' })}
                >
                  {getFieldDecorator('tips', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.tips) ? '' : this.state.tips,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForShipper-insuranceAdd.rate.enter-null',
                        }),
                      }
                    ],
                  })(
                    <Input
                      disabled={true}
                      maxLength={15}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.number.calculate' })}
                >
                  {getFieldDecorator('tipsaccount', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.tipsaccount)
                        ? ''
                        : this.state.tipsaccount,
                  })(
                    <Input
                      placeholder={formatMessage({
                        id: 'insuranceForShipper-insuranceAdd.auto.calculate',
                      })}
                      disabled={true}
                      suffix='￥'
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Divider dashed />

        <div
          style={{
            textAlign: 'center',

            justifyContent: 'center',

            alignItems: 'center',
          }}
        >
          <Checkbox
            checked={isNil(this.state) || isNil(this.state.agreePro) ? false : this.state.agreePro}
            onChange={this.agreeChange}
          ></Checkbox>&nbsp;
          <FormattedMessage id="insuranceForShipper-insuranceAdd.insurance.act1" />
          <Button type="link" href="#" onClick={this.showProtoco0}>
            <FormattedMessage id="insuranceForShipper-insuranceAdd.insurance.act2" />
          </Button>
          <Modal className="protocolModal"
            title={formatMessage({ id: 'insuranceForShipper-insuranceAdd.insurance.actA' })}
            visible={
              isNil(this.state) || isNil(this.state.modalVisible0)
                ? false
                : this.state.modalVisible0
            }
            onOk={this.handleOk0}
            onCancel={this.handleCance0}
            footer={null}
            >
              <p style={{textAlign:"left"}} dangerouslySetInnerHTML={{__html:getLocale() === 'zh-CN'?transportation_insurance_CN:transportation_insurance_US}}></p>
              <Button key="submit1" type="primary" style={{textAlign:"center",top:"10px",width:"180px"}} onClick={()=>this.setState({modalVisible0:false})}>
                <FormattedMessage id="Index-UserMenu.confirm" />
              </Button>
          </Modal>
          <Button type="link" href="#" onClick={this.showProtoco2}>
            <FormattedMessage id="insuranceForShipper-insuranceAdd.insurance.act6" />
          </Button>{' '}
          <Modal className="protocolModal"
            title={formatMessage({ id: 'insuranceForShipper-insuranceAdd.insurance.actC' })}
            visible={
              isNil(this.state) || isNil(this.state.modalVisible2)
                ? false
                : this.state.modalVisible2
            }
            onOk={this.handleOk2}
            onCancel={this.handleCance2}
            footer={null}
          >
            <p style={{textAlign:"left"}} dangerouslySetInnerHTML={{__html:instructions_for_insurance}}></p>
            <Button key="submit2" type="primary" style={{textAlign:"center",top:"10px",width:"180px"}} onClick={()=>this.setState({modalVisible2:false})}>
              <FormattedMessage id="Index-UserMenu.confirm" />
            </Button>
          </Modal>
        </div>
        <Divider dashed />
        <form>
          <Row className={commonCss.rowTop}>
            <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
              <ButtonOptionComponent
                type="Save"
                text={formatMessage({ id: 'insuranceForShipper-insuranceAdd.save' })}
                event={this.addInsurance1.bind(this)}
              />
            </Col>
            <Col span={12}>
              <ButtonOptionComponent
                type="SaveAndCommit"
                disabled={
                  isNil(this.state) || isNil(this.state.buttonDisabled)
                    ? true
                    : this.state.buttonDisabled
                }
                text={formatMessage({ id: 'insuranceForShipper-insuranceAdd.saveandsubmit' })}
                event={() => {
                  this.newMethod();
                }}
              />
            </Col>
          </Row>
          <Divider dashed />
        </form>
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
        this.publishInsurance1();
      },
    });
  }
}

const InsuranceAdd_Form = Form.create({ name: 'InsuranceAdd_Form' })(InsuranceAdd);

export default InsuranceAdd_Form;
