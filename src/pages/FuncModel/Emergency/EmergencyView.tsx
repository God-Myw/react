import React from 'react';
import { Form, Row, Col, Input } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import { RouteComponentProps } from 'dva/router';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import getRequest from '@/utils/request';
import { isNil } from 'lodash';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import { formatMessage } from 'umi-plugin-react/locale';

const { TextArea } = Input;
class PalletAdd extends React.Component<RouteComponentProps> {
  state = {
    requestTitle: '',
    requestContent: '',
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
          });
        }
      }
    });
  }

  onBack = () => {
    const userType = localStorage.getItem('userType');
    if (userType === '5') {
      this.props.history.push('/emergencyowner');
    } else if(userType === '4') {
      this.props.history.push('/emergency');
    }else{
      this.props.history.push('/checkemergency');
    }
  };

  render() {
    const formlayout = {
      wrapperCol: { span: 24 },
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
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="CloseButton"
                  text={formatMessage({ id: 'Emergency-EmergencyView.close' })}
                  event={() => {
                    this.onBack();
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

const PalletAdd_Form = Form.create({ name: 'PalletAdd_Form' })(PalletAdd);

export default PalletAdd_Form;
