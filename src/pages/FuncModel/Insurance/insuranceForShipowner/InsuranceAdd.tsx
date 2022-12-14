import { getRequest, postRequest, putRequest } from '@/utils/request';
import { getDictDetail, items } from '@/utils/utils';
import { Col, DatePicker, Form, Input, message, Modal, Row, Select, Divider, Checkbox, Button } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, getLocale, FormattedMessage } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import InsuranceFormProps from './InsuranceProps';
import { transportation_insurance_CN, transportation_insurance_US, instructions_for_insurance } from '../../Protocol/protocols';
moment.locale(getLocale());

const { confirm } = Modal;
const dateFormat = 'YYYY/MM/DD';
let type: string;
type InsuranceProps = InsuranceFormProps & RouteComponentProps;
//船东投保新增页面
class InsuranceAdd extends React.Component<InsuranceFormProps, InsuranceProps> {
  constructor(prop: InsuranceFormProps) {
    super(prop);
  }

  componentDidMount() {
    let companyItem: items[] = [];
    let shipItem: items[] = [];
    this.setState({
      agreePro: false,
      modalVisible0: false,
      modalVisible1: false,
      modalVisible2: false,
      buttonDisabled: true,
      policyHolder: '', //投保人
      phoneCode: '', //号段
      contactNumber: '', //联系方式
      contactAddress: '', //联系人地址
      transportContacter: '', //联系人
      flag: '', //新增修改-标志位 1,新增 2,修改
      history: this.props.history, //super history
    });

    //调取查询保险公司列表接口,获取页面的保险公司下拉值
    let com: Map<string, string> = new Map();
    com.set('type', '1');
    com.set('currentPage', '-1');
    com.set('pageSize', '-1');
    getRequest('/sys/insuranceCompany', com, (response: any) => {
      companyItem = [];
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          forEach(response.data.insuranceCompanys, (company, index) => {
            companyItem.push({ code: company.guid, textValue: company.companyNameCn });
          });
        }
        this.setState({ companyItem: companyItem });
      }
    });

    //调取查询船舶名称列表接口，获取页面的船舶名称列表
    let req: Map<string, string> = new Map();
    req.set('type', '1');
    req.set('pageSize', '-1');
    req.set('currentPage', '-1');
    req.set('checkStatus', '1');
    getRequest('/business/ship', req, (response: any) => {
      shipItem = [];
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          forEach(response.data.ships, (ship, index) => {
            shipItem.push({ code: ship.guid, textValue: ship.shipName });
          });
        }
        this.setState({ shipItem: shipItem });
      }
    });

    //判断传入的guid
    let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    if (guid) {
      type = '2';
      //修改跳转操作
      let params: Map<string, string> = new Map();
      params.set('type', '1');
      //通过ID获取投保信息
      getRequest('/business/insurance/' + guid, params, (response: any) => {
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            let data = response.data.insurance;
            this.setState({
              guid: data.guid,
              policyHolder: data.policyHolder,
              policyholderIdType: data.policyholderIdType,
              policyholderIdNumber: data.policyholderIdNumber,
              phoneCode: data.phoneCode,
              contactNumber: data.contactNumber,
              insuranceCompany: data.insuranceCompany,
              transportStart: data.transportStart,
              transportContacter: data.transportContacter,
              shipName: response.data.shipName,
              shipAge: data.shipAge,
              contactAddress: data.contactAddress,
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

  handleSubmit(type: number, guid: number, states: number) {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        forEach(this.state.shipItem, (item, index) => {
          if (values.shipName == item.textValue) {
            values.shipName = item.code;
            return;
          }
        });
        let param = {};
        if (!isNil(guid)) {
          param = {
            type: type,
            guid: this.state.guid,
            state: states,
            policyHolder: this.state.policyHolder,
            phoneCode: values.phoneCode,
            contactNumber: this.state.contactNumber,
            policyholderIdType: values.policyHolderIdType,
            policyholderIdNumber: this.state.policyholderIdNumber,
            insuranceCompany: values.insuranceCompany,
            shipId: values.shipName,
            shipAge: values.shipAge,
            transportStart: moment(values.transportStart).valueOf(),
            transportContacter: this.state.transportContacter,
            contactAddress: this.state.contactAddress,
          };
          //修改投保
          putRequest('/business/insurance/shipowner', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'insuranceForshipowner.insuranceAdd.update.success' }),
                2,
                this.onBack,
              );
            }
          });
        } else {
          param = {
            type: type,
            guid: 0,
            state: states,
            policyHolder: this.state.policyHolder,
            phoneCode: values.phoneCode,
            contactNumber: this.state.contactNumber,
            policyholderIdType: values.policyHolderIdType,
            policyholderIdNumber: this.state.policyholderIdNumber,
            insuranceCompany: values.insuranceCompany,
            shipId: values.shipName,
            shipAge: values.shipAge,
            transportStart: moment(values.transportStart).valueOf(),
            transportContacter: this.state.transportContacter,
            contactAddress: this.state.contactAddress,
          };
          //新增投保
          postRequest('/business/insurance/shipowner', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'insuranceForshipowner.insuranceAdd.add.success' }),
                2,
                this.onBack,
              );
            }
          });
        }
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
  
    showProtoco2 = () => {
      this.setState({
        modalVisible2: true,
      });
    };

  onBack = () => {
    this.props.history.push('/insurance_shipOwner/list');
  };

  onChange(value: any, dateString: string) {
    this.setState({ transportStart: moment(value).format(dateString) });
  }

  //checkTime
  checkTime = (name: string, rule: any, val: any, callback: any) => {
    const date = moment(val).format('YYYY/MM/DD');
    if (name === 'transportStart') {
      if (moment(date).isBefore(moment().format('YYYY/MM/DD'))) {
        callback(formatMessage({ id: 'insuranceForshipowner.check.loadDate.greater.current' }));
      } else {
        callback();
      }
    } 
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

  //渲染
  render() {
    //定义Ant Design 属性对象
    const { getFieldDecorator } = this.props.form;
    const companyItem =
      isNil(this.state) || isNil(this.state.companyItem) ? [] : this.state.companyItem;
    const shipItem = isNil(this.state) || isNil(this.state.shipItem) ? [] : this.state.shipItem;

    //手机前缀
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: isNil(this.state) || this.state.phoneCode === '' ? '+86' : this.state.phoneCode,
    })(
      <Select 
        showSearch
        optionFilterProp="children"
        onSelect={this.selectPhoneCode}
        filterOption={this.serach}
        style={{minWidth:'80px'}}
      >
        {getDictDetail("phone_code").map((item: any) => (
          <Select.Option value={item.textValue}>{item.textValue}</Select.Option>
        ))}
      </Select>
    );

    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    //处理页面标题
    let headerFrame;
    if (type == '1') {
      headerFrame = (
        <LabelTitleComponent
          text={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.add.insurance' })}
          event={() => this.onBack()}
        />
      );
    } else if (type == '2') {
      headerFrame = (
        <LabelTitleComponent
          text={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.update.insurance' })}
          event={() => this.onBack()}
        />
      );
    }
    return (
      <div className={commonCss.container}>
        {headerFrame}
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.applicant' })}
                >
                  {getFieldDecorator('policyHolder', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.policyHolder)
                        ? ''
                        : this.state.policyHolder,
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForshipowner.insuranceAdd.applicant-null',
                        }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={64}
                      id="policyHolder"
                      placeholder={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.applicant' })}
                      onChange={e => this.setState({ policyHolder: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.phonenumber' })}
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
                        message: formatMessage({ id: 'insuranceForShipper-insuranceAdd.phonenumber.enter.correct' }),
                      },
                    ],
                  })(
                      <Input
                        maxLength={20}
                        addonBefore={prefixSelector}
                        placeholder={formatMessage({
                          id: 'insuranceForshipowner.insuranceAdd.phonenumber',
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
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.ID.type' })}
                >
                  {getFieldDecorator('policyHolderIdType', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.policyholderIdType)
                        ? undefined
                        : this.state.policyholderIdType,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForshipowner.insuranceAdd.ID.type-null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.ID.type' })}
                      onChange={e => (value: any) => {
                        this.setState({ policyholderIdType: value });
                      }}
                    >
                      {getDictDetail('policyholder_ID_type').map((item: any) => (
                        <Select.Option value={item.code}>{item.textValue}</Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.ID.number' })}
                >
                  {getFieldDecorator('policyHolderIdNumber', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.policyholderIdNumber)
                        ? ''
                        : this.state.policyholderIdNumber,
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForshipowner.insuranceAdd.ID.number-null',
                        }),
                      }
                    ],
                  })(
                    <Input
                      maxLength={32}
                      placeholder={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.ID.number' })}
                      onChange={e => this.setState({ policyholderIdNumber: e.target.value })}
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
                    id: 'insuranceForshipowner.insuranceAdd.insurance.company',
                  })}
                >
                  {getFieldDecorator('insuranceCompany', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.insuranceCompany)
                        ? undefined
                        : this.state.insuranceCompany,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForshipowner.insuranceAdd.insurance.company-null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({
                        id: 'insuranceForshipowner.insuranceAdd.insurance.company',
                      })}
                      onChange={e => (value: any) => this.setState({ insuranceCompany: value })}
                    >
                      {companyItem.map((item: any) => (
                        <Select.Option value={item.code}>{item.textValue}</Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.shipname' })}
                >
                  {getFieldDecorator('shipName', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipName) ? undefined : this.state.shipName,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForshipowner.insuranceAdd.shipname-null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.shipname' })}
                      onChange={e => (value: any) => this.setState({ shipId: value })}
                    >
                      {shipItem.map((item: any) => (
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
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.shipage' })}
                >
                  {getFieldDecorator('shipAge', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipAge) ? undefined : this.state.shipAge,
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForshipowner.insuranceAdd.shipage-null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.shipage' })}
                      onChange={e => (value: any) => {
                        this.setState({ shipAge: value });
                      }}
                    >
                      {getDictDetail('ship_age').map((item: any) => (
                        <Select.Option value={item.code}>{item.textValue}</Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.start.date' })}
                >
                  {getFieldDecorator('transportStart', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.transportStart)
                        ? moment(new Date())
                        : moment(Number(this.state.transportStart)),
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForshipowner.insuranceAdd.start.date-null',
                        }),
                      },
                      {
                        validator: this.checkTime.bind(this, 'transportStart')
                      }
                    ],
                  })(
                    <DatePicker
                      locale={getLocale()}
                      style={{ width: '100%' }}
                      // showTime
                      format={dateFormat}
                      onChange={this.onChange.bind(this)}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.contacter' })}
                >
                  {getFieldDecorator('transportContacter', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.transportContacter)
                        ? ''
                        : this.state.transportContacter,
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForshipowner.insuranceAdd.contacter-null',
                        }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={64}
                      placeholder={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.contacter' })}
                      onChange={e => this.setState({ transportContacter: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.contact.way' })}
                >
                  {getFieldDecorator('contactAddress', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.contactAddress)
                        ? ''
                        : this.state.contactAddress,
                    validateTrigger: 'onBlur',
                    validateFirst: false,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'insuranceForshipowner.insuranceAdd.contact.way-null',
                        }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={64}
                      placeholder={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.contact.way' })}
                      onChange={e => this.setState({ contactAddress: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Divider dashed />
            <Row className={commonCss.rowTop}>
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
              <Button key="submit1" type="primary" style={{textAlign:"center",top:"10px"}} onClick={()=>this.setState({modalVisible0:false})}>
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
            <Button key="submit2" type="primary" style={{textAlign:"center",top:"10px"}} onClick={()=>this.setState({modalVisible2:false})}>
              <FormattedMessage id="Index-UserMenu.confirm" />
            </Button>
          </Modal>
        </div>

            </Row>
            <Divider dashed />

            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Save"
                  text={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.save' })}
                  // event={this.addInsurance.bind(this)}
                  event={() => this.handleSubmit(1, this.state.guid, 0)}
                  disabled={false}
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
                  text={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.saveandsubmit' })}
                  event={() => {
                    this.newMethod();
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <Divider dashed />
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

const InsuranceAdd_Form = Form.create({ name: 'InsuranceAdd_Form' })(InsuranceAdd);

export default InsuranceAdd_Form;
