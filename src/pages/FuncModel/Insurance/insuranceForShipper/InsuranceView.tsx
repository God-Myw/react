import { getRequest } from '@/utils/request';
import { getTableEnumText, items } from '@/utils/utils';
import { Button, Checkbox, Col, DatePicker, Divider, Form, Input, Modal, Row } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import ButtonOptionComponent from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import {instructions_for_insurance,transportation_insurance_CN,transportation_insurance_US} from '../../Protocol/protocols';
import { getLocale } from 'umi-plugin-react/locale';

let companyItem: items[] = [];

class InsuranceView extends React.Component<RouteComponentProps> {
  state = {
    data: {},
    flag: '',
    goodsName: '',
    goodstype: '',
    packageUnitName: '',
    packing: '',
    goodsCount: '',
    bill: '',
    order: '',
    holderName: '',
    contactNumber: '',
    combination: '',
    ownerName: '',
    ownerContarct: '',
    ownercombination: '',
    shiplines: '',
    ways: '',
    shipage: '',
    sporttime: '',
    travelStart: '',
    travelEnd: '',
    goodsValue: '',
    insuranceValue: '',
    insuranceCompany: '',
    insuranceTypes: '',
    tips: '',
    tipsaccount: '',
    agreePro: false,
    modalVisible0: false,
    modalVisible1: false,
    modalVisible2: false,
    phoneCode: '',
    insuredPhoneCode: '',
  };

  componentDidMount() {
    //调取查询保险公司列表接口,获取页面的保险公司下拉值
    companyItem = [];
    let ship: Map<string, string> = new Map();
    ship.set('type', '1');
    ship.set('currentPage', '-1');
    ship.set('pageSize', '-1');
    getRequest('/sys/insuranceCompany', ship, (response: any) => {
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          forEach(response.data.insuranceCompanys, (item, index) => {
            companyItem.push({ code: item.guid, textValue: item.companyNameCn });
          });
        }
      }
    });

    let guid = this.props.match.params['guid'];
    //通过ID查询投保详情
    let params: Map<string, string> = new Map();
    params.set('type', '2');
    getRequest('/business/insurance/' + guid, params, (response: any) => {
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          let data = response.data.insurance;
          let list: items[] = [];
          if (!isNil(companyItem)) {
            list = companyItem.filter(item => {
              return item.code === data.insuranceCompany;
            });
          }

          this.setState({
            goodsName: data.goods,
            goodstype: getTableEnumText('goods_type', data.goodsType),
            packing: getTableEnumText('packing', data.packing),//包装方式
            packageUnitName: getTableEnumText('package_unit_name', data.packageUnitName),//包装单位名称
            goodsCount: data.goodsCount,//货物数量
            bill: data.invoiceContractNumber,
            order: data.billOfLadingWaybillNumber,
            holderName: data.policyHolder,
            phoneCode: data.phoneCode,
            contactNumber: data.contactNumber,
            combination: data.organizationCode,
            ownerName: data.insuredName,
            insuredPhoneCode: data.insuredPhoneCode,
            ownerContarct: data.insuredContactNumber,
            ownercombination: data.insuredOrganizationCode,
            shiplines: data.voyageName,
            shipage: getTableEnumText('ship_age', data.shipAge),
            ways: getTableEnumText('transport_way', data.transportType),
            sporttime: moment(Number(data.transportStart)).format('YYYY/MM/DD'),
            travelStart: getTableEnumText('port', data.departure),
            travelEnd: getTableEnumText('port', data.destination),
            goodsValue: data.goodsValue,
            insuranceValue: data.insuranceMoney,
            insuranceCompany: list.length > 0 ? list[0].textValue : data.insuranceCompany,
            insuranceTypes: getTableEnumText('insurance_type', data.insuranceCategory),
            tips: data.insuranceRate,
            tipsaccount: data.premiumCalculation,
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
  // 返回
  onBack = () => {
    this.props.history.push('/insurance_shipper/list');
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

  render() {
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
          <Form>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.goods.name' })}
                >
                  <Input placeholder="" value={this.state.goodsName} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.type' })}
                  className="goodstype"
                >
                  <Input placeholder="" value={this.state.goodstype} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'insuranceForShipper-insuranceAdd.quantity.packingNum',
                  })}
                >
                  <div>
                    <Col span={21}>
                      <Input
                        className="telinput"
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.goodsCount)
                            ? ''
                            : this.state.goodsCount
                        }
                      />
                    </Col>
                    <Col span={3}>
                      <Input
                        value={
                          isNil(this.state) || isNil(this.state.packageUnitName)
                            ? ''
                            : this.state.packageUnitName
                        }
                        disabled
                      />
                    </Col>
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.packing.unit' })}
                >
                  <Input placeholder="" value={this.state.packing} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.invoice' })}
                >
                  <Input placeholder="" value={this.state.bill} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.waybill' })}
                >
                  <Input placeholder="" value={this.state.order} disabled />
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
          <Form>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.insured.name' })}
                >
                  <Input placeholder="" value={this.state.holderName} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.insured.contact.way' })}
                >
                  <Input placeholder="" value={this.state.phoneCode + '-' + this.state.contactNumber} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.organize.code' })}
                >
                  <Input placeholder="" value={this.state.combination} disabled />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'insuranceForShipper-insuranceAdd.be.insured.name',
                  })}
                >
                  <Input placeholder="" value={this.state.ownerName} disabled />
                </Form.Item>
                </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.contact.way' })}
                >
                  <Input placeholder="" value={this.state.insuredPhoneCode + '-' +this.state.ownerContarct} disabled />
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
                  <Input placeholder="" value={this.state.ownercombination} disabled />
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
          <Form>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'insuranceForShipper-insuranceAdd.name.and.voyage',
                  })}
                >
                  <Input placeholder="" value={this.state.shiplines} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.transportation' })}
                  className="goodstype"
                >
                  <Input placeholder="" value={this.state.ways} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.age' })}
                >
                  <Input placeholder="" value={this.state.shipage} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.time.start' })}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled
                    format={'YYYY/MM/DD'}
                    value={moment(this.state.sporttime)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.port.start' })}
                >
                  <Input placeholder="" value={this.state.travelStart} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.destination' })}
                >
                  <Input placeholder="" value={this.state.travelEnd} disabled />
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
          <Form>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.value' })}
                >
                  <Input placeholder="" value={this.state.goodsValue} disabled suffix='￥'/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.amount' })}
                  className="goodstype"
                >
                  <Input placeholder="" value={this.state.insuranceValue} disabled suffix='￥'/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.company' })}
                >
                  <Input placeholder="" value={this.state.insuranceCompany} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.insurance.type' })}
                >
                  <Input placeholder="" value={this.state.insuranceTypes} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForShipper-insuranceAdd.rate' })}
                >
                  <Input placeholder="" value={this.state.tips} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'insuranceForShipper-insuranceAdd.number.calculate',
                  })}
                >
                  <Input placeholder="" value={this.state.tipsaccount} disabled suffix='￥'/>
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
            checked={
              isNil(this.state) || isNil(this.state.agreePro) ? false : this.state.agreePro
            }
            onChange={this.agreeChange}
          ></Checkbox>
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
        <Row className={commonCss.rowTop}>
          <Col span={14} pull={1} className={commonCss.lastButtonAlignRight}>
            <ButtonOptionComponent
              disabled={false}
              type="CloseButton"
              text={formatMessage({ id: 'insuranceForShipper-insuranceView.close' })}
              event={() => this.onBack()}
            />
          </Col>
          <Col span={12}></Col>
        </Row>
      </div>
    );
  }
}

const InsuranceView_Form = Form.create({ name: 'InsuranceView_Form' })(InsuranceView);

export default InsuranceView_Form;
