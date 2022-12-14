import ButtonOptionComponent from '@/pages/Common/Components/ButtonOptionComponent';
import { Col, Form, Row } from 'antd';
import { RouteComponentProps } from 'dva/router';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';

class NewPhoneSuccess extends React.Component<RouteComponentProps> {
  state = {
    seconds: 3,
    btnDisable: false,
    btnContent: '3s',
  };

  //计时器
  componentDidMount() {
    // let timer = setInterval(() => {
    //   this.setState(
    //     preState => ({
    //       seconds: this.state.seconds - 1,
    //       btnContent: this.state.seconds - 1 + 's',
    //     }),
    //     () => {
    //       if (this.state.seconds == 0) {
    //         clearInterval(timer);
    //       }
    //     },
    //   );
    // }, 1000);
  }

  //返回
  onBack = () => {
    this.props.history.push('/account_manager/view');
  };

  render() {
    // //0秒返回
    // if (this.state.seconds === 0) {
    //   this.props.history.push('/account_manager/view');
    // }

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'AccountManagement-NewPhoneNumber.update' })}
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item style={{ textAlign: 'center' }} label="">
                  <span style={{ fontWeight: 'bolder', fontSize: '15px' }}>
                    <FormattedMessage id="AccountManagement-NewPhoneSuccess.success" />
                  </span>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={13} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  disabled
                  type="CloseButton"
                  text={formatMessage({ id: 'Common-Button.button.close' })}
                  event={() => this.onBack()}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const NewPhoneSuccess_Form = Form.create({ name: 'NewPhoneSuccess_Form' })(NewPhoneSuccess);
export default NewPhoneSuccess_Form;
