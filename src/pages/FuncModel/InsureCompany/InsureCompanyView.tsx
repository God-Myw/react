import React from 'react';
import { Form, Row, Col, Input } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import { RouteComponentProps } from 'dva/router';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import getRequest from '@/utils/request';
import { isNil } from 'lodash';
import { formatMessage } from 'umi-plugin-locale';
import HrComponent from '@/pages/Common/Components/HrComponent';
import ButtonOptionComponent from '@/pages/Common/Components/ButtonOptionComponent';

class InsureCompanyView extends React.Component<RouteComponentProps> {
  state = {
    id: '',
    companyName: '',
    companyCode: '',
    contacter: '',
    contactPhone: '',
    address: '',
    rate: '',
  };

  //初始化
  componentDidMount() {
    let guid = this.props.match.params['guid'];
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    getRequest('/sys/insuranceCompany/' + guid, param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            companyName: response.data.companyNameCn,
            companyCode: response.data.companyCode,
            contacter: response.data.contacter,
            contactPhone: response.data.contactPhone,
            address: response.data.address,
            rate: response.data.rate,
          });
        }
      }
    });
  }

  render() {
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'InsureConpany-InsuranceView.exmaine-insuranceInformation' })}
          event={() => {
            this.props.history.push('/insureCompany');
          }}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'InsureConpany-InsuranceList.insuranceCompany' })}
                >
                  <Input disabled value={this.state.companyName} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'InsureConpany-InsuranceList.rate' })}
                >
                  <Input disabled value={this.state.rate} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'InsureConpany-InsuranceList.contacts' })}
                >
                  <Input disabled value={this.state.contacter} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'InsureConpany-InsuranceList.contacts-phone' })}
                >
                  <Input disabled value={this.state.contactPhone} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'InsureConpany-InsuranceList.address' })}
                >
                  <Input disabled value={this.state.address} />
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  disabled={false}
                  type="CloseButton"
                  text="关闭"
                  event={() => {
                    this.props.history.push('/insureCompany');
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const InsureCompanyView_Form = Form.create({ name: 'insureCompanyView_Form' })(InsureCompanyView);

export default InsureCompanyView_Form;
