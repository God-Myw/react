import { Button, Col, Form, Row } from 'antd';
import { RouteComponentProps } from 'dva/router';
import React from 'react';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';


class NewPhoneSuccess extends React.Component<RouteComponentProps> {
    //返回
    onBack = () => {
        this.props.history.push('/account_manager/view');
    };

    //关闭
    close = () => {
        this.props.history.push('/account_manager/view');
    }

    render() {
        return (
            <div className={commonCss.container}>
                <LabelTitleComponent text={formatMessage({ id: 'AccountManagement-NewEmailAddress.update.email' })} event={() => this.onBack()} />
                <div className={commonCss.AddForm}>
                    <Form labelAlign="left">
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item style={{ textAlign: 'center' }} label="">
                                    <span style={{ fontWeight: 'bolder', fontSize: '15px' }}>
                                    <FormattedMessage id="AccountManagement-NewEmailAddressSuccess.success" />
                  </span>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item style={{ textAlign: 'center' }} label="">
                                    <Button type="primary" onClick={this.close}><FormattedMessage id="AccountManagement-AccountView.close" /></Button>
                                </Form.Item>
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
