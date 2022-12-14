import getRequest from '@/utils/request';
import { Button, Col, Form, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'dva/router';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';


type NewPhoneNumberProps = FormComponentProps & RouteComponentProps;

class NewPhoneNumber extends React.Component<NewPhoneNumberProps> {
    //返回
    onBack = () => {
        this.props.history.push('/account_manager/view');
    };

    state = {
        address: '',
        disable: true,
    };

    //邮箱
    check(rule: any, value: any, callback: any) {
        var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (value !== '' && re.test(value)) {
            callback();
            this.setState({
                disable: false,
            });
        } else {
            callback(formatMessage({ id: 'AccountManagement-ModifyPassword.correct.email' }));
            this.setState({
                disable: true,
            });
        }
    }


    //发送验证码
    submit = () => {
        this.props.form.validateFields(['address'], (err: any, values: any) => {
            if (!err) {
                let param: Map<string, string> = new Map();
                // 初期化固定是手机账号密码登录
                param.set('email', this.state.address);
                getRequest('/sys/verify/mailVerification', param, (response: any) => { });
                this.props.history.push('/account_manager/sendNewEmail/' + this.props.match.params['guid'] + '/' + this.state.address);
            }
        });
    };

    render() {
        const smallFormItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={commonCss.container}>
                <LabelTitleComponent text={formatMessage({ id: 'AccountManagement-NewEmailAddress.update.email' })} event={() => this.onBack()} />
                <div className={commonCss.AddForm}>
                    <Form labelAlign="left">
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item style={{ textAlign: 'center' }} label="">
                                    <span style={{ fontWeight: 'bolder', fontSize: '15px' }}>
                                        <FormattedMessage id="AccountManagement-NewEmailAddress.update.new.email.enter" />
                                    </span>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={9}>
                                <Form.Item></Form.Item>
                            </Col>
                            <Col span={6} {...smallFormItemLayout}>
                                <Form.Item>
                                    {getFieldDecorator('phoneNumber', {
                                        rules: [
                                            {
                                                required: true,
                                                validator: (rule: any, value: any, callback: any) => {
                                                    this.check(rule, value, callback);
                                                },
                                            },

                                        ],
                                        initialValue: '',
                                    })(
                                        <Input
                                            maxLength={32}
                                            autoFocus
                                            onChange={e => this.setState({ address: e.target.value })}
                                            placeholder={formatMessage({ id: 'AccountManagement-NewEmailAddress.email.enter' })}
                                        />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item style={{ textAlign: 'center' }} label="">
                                    <Button type="primary" onClick={this.submit} disabled={this.state.disable}>
                                        <FormattedMessage id="AccountManagement-ModifyPassword.submit" />
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        );
    }
}

const NewPhoneNumber_Form = Form.create({ name: 'NewPhoneNumber_Form' })(NewPhoneNumber);
export default NewPhoneNumber_Form;
