import getRequest from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Col, Form, Input, Row } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';

const { TextArea } = Input;
class PalletAdd extends React.Component<RouteComponentProps> {
  state = {
    requestTitle: '',
    requestContent: '',
    userName: '',
    userId: '',
    userType: '',
    contactNumber: '',
    publishTime: '',
    status: 0,
    updateDate: '',
  };

  //初期化事件获取紧急需求详情
  componentDidMount() {
    let uid = this.props.match.params['guid'];
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    getRequest('/business/emergency/' + uid, param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            requestTitle: response.data.emergency.requestTitle,
            requestContent: response.data.emergency.requestContent,
            status: response.data.emergency.status,
            userName:response.data.emergency.user,
            contactNumber:response.data.emergency.phoneCode+response.data.emergency.phoneNumber,
            userType:getTableEnumText('user_type', response.data.emergency.userType),
            userId:response.data.emergency.accountId,
            updateDate:moment(Number(response.data.emergency.createDate)).format('YYYY/MM/DD HH:mm:ss'),
          });
        }
      }
    });
  }

  onBack = () => {
    this.props.history.push('/checkemergency');
  };

  render() {
    const formlayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'Emergency-EmergencyList.emergencyAlter' })}
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="用户姓名">
                  <Input id="userName" disabled value={this.state.userName} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系方式">
                  <Input id="contactNumber" disabled value={this.state.contactNumber} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="用户类型">
                  <Input id="userType" disabled value={this.state.userType} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="用户名">
                  <Input id="userId" disabled value={this.state.userId} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="发布时间">
                  <Input id="updateDate" disabled value={this.state.updateDate} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  {...formlayout}
                  style={{ marginBottom: '20px' }}
                  label={formatMessage({ id: 'Emergency-EmergencyAdd.emergencyTitle' })}
                ></Form.Item>
                <Form.Item {...formlayout}>
                  <Input
                    placeholder={formatMessage({ id: 'Emergency-EmergencyAdd.emergencyTheme' })}
                    value={this.state.requestTitle}
                    readOnly
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  {...formlayout}
                  style={{ marginBottom: '20px' }}
                  label={formatMessage({ id: 'Emergency-EmergencyAdd.emergencyDemandContent' })}
                ></Form.Item>
                <Form.Item {...formlayout}>
                  <TextArea
                    style={{ height: '180px' }}
                    placeholder={formatMessage({ id: 'Emergency-EmergencyAdd.inputContent.two' })}
                    value={this.state.requestContent}
                    readOnly
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24} className={commonCss.rowTop}>
              <Col span={12} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Close"
                  text="关闭"
                  event={() => this.onBack()}
                  disabled={false}
                />
              </Col>
              <Col span={12}>
                {isNil(this.state) || isNil(this.state.status) || this.state.status === 0 ? (
                  <Col></Col>
                ) : (
                  <Col span={12} push={12}>
                    <div className={commonCss.picTopAndBottom}>
                      <img src={require('../../Image/close.png')} className={commonCss.imgWidth} />
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

const PalletAdd_Form = Form.create({ name: 'PalletAdd_Form' })(PalletAdd);

export default PalletAdd_Form;
