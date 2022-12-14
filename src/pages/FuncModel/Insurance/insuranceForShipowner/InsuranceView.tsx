import { getRequest } from '@/utils/request';
import { getTableEnumText, items } from '@/utils/utils';
import { Col, DatePicker, Form, Input, Row, Checkbox, Modal, Button, Divider } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage, getLocale } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import { transportation_insurance_CN, transportation_insurance_US, instructions_for_insurance } from '../../Protocol/protocols';

let companyItem: items[] = [];
let shipItem: items[] = [];
class InsuranceView extends React.Component<RouteComponentProps> {
  state = {
    agreePro: false,
    modalVisible0: false,
    modalVisible1: false,
    modalVisible2: false,
    buttonDisabled: true,
    policyHolderIdNumber: '',
    policyHolder: '',
    policyHolderIdType: '',
    insuranceCompany: '',
    phoneCode: '',
    contactNumber: '',
    shipId: '',
    shipName: '',
    shipAge: '',
    transportStart: new Date(),
    contactAddress: '',
    transportContacter: '',
  };

  componentDidMount() {
    let guid = this.props.match.params['guid'];
    //调取查询保险公司列表接口,获取页面的保险公司下拉值
    let com: Map<string, string> = new Map();
    com.set('type', '1');
    com.set('currentPage', '-1');
    com.set('pageSize', '-1');
    getRequest('/sys/insuranceCompany', com, (response: any) => {
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          forEach(response.data.insuranceCompanys, (company, index) => {
            companyItem.push({ code: company.guid, textValue: company.companyNameCn });
          });
        }
      }
    });

    //调取查询船舶名称列表接口，获取页面的船舶名称列表
    let req: Map<string, string> = new Map();
    req.set('type', '1');
    req.set('pageSize', '-1');
    req.set('currentPage', '-1');
    req.set('checkStatus', '1');
    getRequest('/business/ship', req, (response: any) => {
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          forEach(response.data.ships, (ship, index) => {
            shipItem.push({ code: ship.guid, textValue: ship.shipName });
          });
        }
      }
    });

    //通过ID查询投保详情
    let params: Map<string, any> = new Map();
    params.set('type', '1');
    getRequest('/business/insurance/' + guid, params, (response: any) => {
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          let data = response.data.insurance;

          forEach(companyItem, (comp, index) => {
            if (comp.code === data.insuranceCompany) {
              this.setState({ insuranceCompany: comp.textValue });
            }
          });

          forEach(shipItem, (ship, index) => {
            if (ship.code === data.shipId) {
              this.setState({ shipName: ship.textValue });
            }
          });

          this.setState({
            policyHolder: data.policyHolder,
            policyHolderIdType: getTableEnumText('policyholder_ID_type', data.policyholderIdType),
            policyHolderIdNumber: data.policyholderIdNumber,
            phoneCode: data.phoneCode,
            contactNumber: data.contactNumber,
            transportStart: data.transportStart,
            transportContacter: data.transportContacter,
            shipAge: getTableEnumText('ship_age', data.shipAge),
            contactAddress: data.contactAddress,
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
  // 返回
  onBack = () => {
    this.props.history.push('/insurance_shipOwner/list');
  };

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'insuranceForshipowner.insuranceView.examine' })}
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.applicant' })}
                >
                  <Input placeholder="" value={this.state.policyHolder} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.phonenumber' })}
                  className="padrightnone"
                >
                  <div>
                    <Col span={3}>
                      <Input className="telinput" disabled value={this.state.phoneCode} />
                    </Col>
                    <Col span={21}>
                      <Input placeholder="" value={this.state.contactNumber} disabled />
                    </Col>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.ID.type' })}
                >
                  <Input placeholder="" value={this.state.policyHolderIdType} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.ID.number' })}
                >
                  <Input placeholder="" value={this.state.policyHolderIdNumber} disabled />
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
                  <Input placeholder="" value={this.state.insuranceCompany} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.shipname' })}
                >
                  <Input placeholder="" value={this.state.shipName} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.shipage' })}
                >
                  <Input placeholder="" value={this.state.shipAge} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.start.date' })}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format={'YYYY/MM/DD'}
                    value={moment(Number(this.state.transportStart))}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.contacter' })}
                >
                  <Input placeholder="" value={this.state.transportContacter} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'insuranceForshipowner.insuranceAdd.contact.way' })}
                >
                  <Input placeholder="" value={this.state.contactAddress} disabled />
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
                  disabled
                  type="CloseButton"
                  text={formatMessage({ id: 'insuranceForshipowner.insuranceView.close' })}
                  event={() => this.onBack()}
                />
              </Col>
              <Col span={12}></Col>
            </Row>
          </Form>
        </div>
        <Divider dashed />
      </div>
    );
  }
}

const InsuranceView_Form = Form.create({ name: 'InsuranceView_Form' })(InsuranceView);

export default InsuranceView_Form;
