import { getRequest } from '@/utils/request';
import { Col, Form, Input, Row, Divider } from 'antd';
import { isNil, forEach } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import { RouteComponentProps } from 'dva/router';
import { getTableEnumText } from '@/utils/utils';
import moment from 'moment';
import { CompanyModel } from './CompanyModel';

class InsuranceView extends React.Component<RouteComponentProps> {
  state = {
    //主键
    guid: 0,
    //数据状态
    state: 0,
    //货物名称
    goods: 0,
    //货物种类
    goodsType: 0,
    //包装单位名称
    packageUnitName: '',
    //包装方式
    packing: '',
    //数量
    goodsCount: '',
    //发票/合同号
    invoiceContractNumber: '',
    //提单/运单号
    billOfLadingWaybillNumber: '',
    //投保人
    policyHolder: '',
    //手机号段
    phoneCode: '',
    //联系号码
    contactNumber: '',
    //组织机构代码
    organizationCode: '',
    //被保方名称 
    insuredName: '',
    //被保方手机号段
    insuredPhoneCode: '',
    //被保方联系方式
    insuredContactNumber: '',
    //被保方组织机构代码
    insuredOrganizationCode: '',
    //船名航次
    voyageName: '',
    //运输方式
    transportType: 0,
    //船舶年龄
    shipAge: 0,
    //起运时间
    transportStart: '',
    //起运地
    departure: 0,
    //目的地
    destination: 0,
    //货值
    goodsValue: 0,
    //保险金额
    insuranceMoney: 0,
    //保险公司
    insuranceCompany: 0,
    //保险种类 
    insuranceCategory: 0,
    //保险费率
    insuranceRate: 0,
    //保费试算
    premiumCalculation: 0,
    status: '',
    company: [],
  };
  componentDidMount() {
    let guid = this.props.match.params['guid'];
    //通过ID查询投保详情
    let params: Map<string, any> = new Map();
    params.set('type', '1');
    getRequest('/business/insurance/' + guid, params, (response: any) => {
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          let data = response.data.insurance;
          this.setState({
            guid: data.guid,
            policyHolder: data.policyHolder,
            phoneCode: data.phoneCode,
            contactNumber: data.contactNumber,
            insuranceCompany: data.insuranceCompany,
            transportStart: data.transportStart,
            state: data.state,
            status: data.status,
            insuranceMoney: data.insuranceMoney,
            goods: data.goods,
            goodsType: data.goodsType,
            packing: getTableEnumText('packing', data.packing),//包装方式
            packageUnitName: getTableEnumText('package_unit_name', data.packageUnitName),//包装单位名称
            goodsCount: data.goodsCount,//货物数量
            invoiceContractNumber: data.invoiceContractNumber,
            billOfLadingWaybillNumber: data.billOfLadingWaybillNumber,
            organizationCode: data.organizationCode,
            insuredName: data.insuredName,
            insuredPhoneCode: data.insuredPhoneCode,
            insuredContactNumber: data.insuredContactNumber,
            insuredOrganizationCode: data.insuredOrganizationCode,
            voyageName: data.voyageName,
            transportType: data.transportType,
            goodsValue: data.goodsValue,
            insuranceRate: data.insuranceRate,
            premiumCalculation: data.premiumCalculation,
            departure: data.departure,
            destination: data.destination,
            shipAge: data.shipAge,
          });
        }
      }
    });
  }
  // 返回
  onBack = () => {
    this.props.history.push('/insuranceonline/list');
  };

  //获取保险下拉值
  getCompany() {
    let params: Map<string, any> = new Map();
    const data_Company: CompanyModel[] = [];
    params.set('type', '1');
    params.set('pageSize', '-1');
    params.set('currentPage', '-1');
    params.set('companyNameCn', '');
    getRequest('/sys/insuranceCompany/', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.insuranceCompanys, (insuranceCompany, index) => {
            const entity: CompanyModel = {};
            entity.guid = insuranceCompany.guid;
            entity.companyName = insuranceCompany.companyNameCn;
            data_Company.push(entity);
          });
        }
        this.setState({
          company: data_Company,
        });
      }
    })
  }
  //获取保险公司名称
  getCompanyvalue(code: any) {
    let value = code;
    this.state.company.map((item: any) => (
      value = (code == item.guid ? item.companyName : value)
    ))
    return value;
  }

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <Form>
          <LabelTitleComponent text="货物信息" event={() => this.onBack()} />
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="货物名称/唛头">
                    <Input placeholder="" value={this.state.goods} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="货物种类" className="goodstype">
                    <Input placeholder="" value={getTableEnumText('goods_type', this.state.goodsType)} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
              <Col span={12}>
                  <Form.Item required {...formlayout} label="货物数量">
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
                    {/* <Input placeholder="" value={this.state.goodsCount} disabled /> */}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="包装方式">
                    <Input placeholder="" value={this.state.packing} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="发票/合同号">
                    <Input placeholder="" value={this.state.invoiceContractNumber} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="提单/运单号">
                    <Input placeholder="" value={this.state.billOfLadingWaybillNumber} disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Divider dashed />

          <div className={commonCss.title}>
            <span className={commonCss.text}>{'投保信息'}</span>
          </div>
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="投保方名称">
                    <Input placeholder="" value={this.state.policyHolder} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="投保方联系方式">
                    <Input placeholder="" value={this.state.phoneCode + '-' + this.state.contactNumber} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="投保方组织机构代码">
                    <Input placeholder="" value={this.state.organizationCode} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}></Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="被保方名称">
                    <Input placeholder="" value={this.state.insuredName} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="被保方联系方式">
                    <Input placeholder="" value={this.state.insuredPhoneCode + '-' + this.state.insuredContactNumber} disabled />
                  </Form.Item>
                </Col>
                </Row>
                <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="被保方组织机构代码">
                    <Input placeholder="" value={this.state.insuredOrganizationCode} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}></Col>
              </Row>
            </Form>
          </div>
          <Divider dashed />

          <div className={commonCss.title}>
            <span className={commonCss.text}>{'运输信息'}</span>
          </div>
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="船名航次">
                    <Input placeholder="" value={this.state.voyageName} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="运输方式" className="goodstype">
                    <Input placeholder="" value={getTableEnumText('transport_way', this.state.transportType)} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="船龄">
                    <Input placeholder="" value={getTableEnumText('ship_age', this.state.shipAge)} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="起运时间">
                    <Input placeholder="" value={String(moment(Number(this.state.transportStart)).format('YYYY-MM-DD'))} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="起运地（港）">
                    <Input placeholder="" value={getTableEnumText('port', this.state.departure)} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="目的地（港）">
                    <Input placeholder="" value={getTableEnumText('port', this.state.destination)} disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Divider dashed />

          <div className={commonCss.title}>
            <span className={commonCss.text}>{'保险测算'}</span>
          </div>
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="货值">
                    <Input placeholder="" value={this.state.goodsValue} disabled suffix='￥'/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="保险金额" className="goodstype">
                    <Input placeholder="" value={this.state.insuranceMoney} disabled suffix='￥'/>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="保险公司">
                    <Input placeholder="" value={this.getCompanyvalue(this.state.insuranceCompany)} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="保险种类">
                    <Input placeholder="" value={getTableEnumText('insurance_type', this.state.insuranceCategory)} disabled />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="费率">
                    <Input placeholder="" value={this.state.insuranceRate} disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="保费试算">
                    <Input placeholder="" value={this.state.premiumCalculation} disabled suffix='￥'/>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Divider dashed />
          <Row className={commonCss.rowTop}>
            <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
              <ButtonOptionComponent
                disabled={false}
                type="CloseButton"
                text="关闭"
                event={() => this.onBack()}
              />
            </Col>
            <Col span={12}>
              {this.state.status == '0' ? null : <Col span={7}></Col>}
              {this.state.status == '0' ? null : (
                <Col span={5}>
                  <div className={commonCss.picTopAndBottom} >
                    <img
                      style={{ marginTop: '-17%', height: '200%', width: '200%', marginLeft: '120px' }}
                      src={require('../../../Image/close.png')}
                      className={commonCss.imgWidth}
                    />
                  </div>
                </Col>
              )}
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const InsuranceView_Form = Form.create({ name: 'InsuranceView_Form' })(InsuranceView);

export default InsuranceView_Form;
