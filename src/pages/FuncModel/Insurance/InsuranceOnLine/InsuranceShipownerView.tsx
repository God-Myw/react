import { getRequest } from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Col, Form, Input, Row } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import ButtonOptionComponent from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import { CompanyModel } from './CompanyModel';
import { ShipItemModel } from './ShipItemModel';

class InsuranceView extends React.Component<RouteComponentProps> {
  state = {
    //保险Id
    guid: 0,
    //数据状态
    state: 0,
    //投保人
    policyHolder: '',
    //手机号段
    phoneCode: '',
    //联系号码
    contactNumber: '',
    //投保人证件类型
    policyholderIdType: 0,
    //投保人证件号码
    policyholderIdNumber: '',
    //保险公司
    insuranceCompany: 0,
    //船舶ID
    shipId: 0,
    //船舶年龄
    shipAge: 0,
    //起运时间
    transportStart: '',
    //联系人
    transportContacter: '',
    //联系人号码
    contactAddress: '',
    status: '0',
    packageUnitName: '',
    company: [],
    shipItem: [],
  };

  componentDidMount() {
    this.getCompany();
    this.getship();
    let guid = this.props.match.params['guid'];
    // 通过ID查询投保详情
    let params: Map<string, any> = new Map();
    params.set('type', '1');
    getRequest('/business/insurance/' + guid, params, (response: any) => {
      if (response.status === 200) {
        // 把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          let data = response.data.insurance;
          this.setState({
            guid: data.guid,
            policyHolder: data.policyHolder,
            phoneCode: data.phoneCode,
            contactNumber: data.contactNumber,
            policyholderIdType: data.policyholderIdType,
            policyholderIdNumber: data.policyholderIdNumber,
            insuranceCompany: data.insuranceCompany,
            transportStart: data.transportStart,
            transportContacter: data.transportContacter,
            contactAddress: data.contactAddress,
            state: data.state,
            status: data.status,
            shipId: data.shipId,
            shipAge: data.shipAge,
            packageUnitName: data.packageUnitName,
          });
        }
      }
    });
  }

  //调取查询船舶名称列表接口，获取页面的船舶名称列表
  getship() {
    let req: Map<string, string> = new Map();
    const data_ShipItem: ShipItemModel[] = [];
    req.set('type', '1');
    req.set('pageSize', '-1');
    req.set('currentPage', '-1');
    req.set('checkStatus', '1');
    getRequest('/business/ship', req, (response: any) => {
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          forEach(response.data.ships, (ship, index) => {
            const entity: ShipItemModel = {};
            entity.guid = ship.guid;
            entity.textValue = ship.shipName;
            data_ShipItem.push(entity);
          });
        }
        this.setState({
          shipItem: data_ShipItem,
        });
      }
    });
  }

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

  //获取船舶名称
  getshipItemvalue(code: any) {
    let value = code;
    this.state.shipItem.map((item: any) => (
      value = (code == item.guid ? item.textValue : value)
    ))
    return value;
  }

  // 返回
  onBack = () => {
    this.props.history.push('/insuranceonline/list');
  };

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="查看投保" event={() => this.onBack()} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="投保人">
                  <Input placeholder="" value={this.state.policyHolder} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="手机号码" className="padrightnone">
                  <Input
                    disabled
                    placeholder="+86"
                    style={{ width: '15%' }}
                    value={
                      isNil(this.state) || isNil(this.state.phoneCode) ? '' : this.state.phoneCode
                    }
                  />
                  <Input
                    disabled
                    style={{ width: '85%' }}
                    value={
                      isNil(this.state) || isNil(this.state.contactNumber)
                        ? ''
                        : this.state.contactNumber
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="投保人证件类型">
                  <Input placeholder="" value={getTableEnumText('policyholder_ID_type', this.state.policyholderIdType)} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="投保人证件号码">
                  <Input placeholder="" value={this.state.policyholderIdNumber} disabled />
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
                <Form.Item required {...formlayout} label="船舶名称">
                  <Input placeholder="" value={this.getshipItemvalue(this.state.shipId)} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="船舶年龄">
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
                <Form.Item required {...formlayout} label="联系人">
                  <Input placeholder="" value={this.state.transportContacter} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="联系地址">
                  <Input placeholder="" value={this.state.contactAddress} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  disabled
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
      </div>
    );
  }
}

const InsuranceView_Form = Form.create({ name: 'InsuranceView_Form' })(InsuranceView);

export default InsuranceView_Form;
