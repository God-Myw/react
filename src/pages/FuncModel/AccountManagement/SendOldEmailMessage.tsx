import getRequest from '@/utils/request';
import { Button, Col, Form, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RouteComponentProps } from 'dva/router';
import React from 'react';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';


type NewPhoneMessageProps = FormComponentProps & RouteComponentProps;

class SendNewPhone extends React.Component<NewPhoneMessageProps> {
  //返回
  onBack = () => {
    this.props.history.push('/account_manager');
  };

  firstFoucs: any;
  secondFoucs: any;
  tridFoucs: any;
  fourthFoucs: any;
  fifthFoucs: any;
  sixthFoucs: any;

  state = {
    maxLength: 1, //验证码长度
    valueA: '', //验证码第一位
    valueB: '', //二
    valueC: '', //三
    valueD: '', //四
    valueE: '', //五
    valueF: '', //六
    address: '',
    keyCode: 8,
    btnDisable: true,
    keyUpA: true,
    keyUpB: false,
    keyUpC: false,
    keyUpD: false,
    keyUpE: false,
    keyUpF: false,
    seconds: 60,
    disable: true,
    content: formatMessage({ id: 'AccountManagement-SendNewEmailMessage.again' }),
    btnContent: formatMessage({ id: 'AccountManagement-SendNewEmailMessage.s' }),
  };

  //计时器
  send = () => {
    let param: Map<string, string> = new Map();
    param.set('email', this.state.address);
    getRequest('/sys/verify/mailVerification', param, (response: any) => {
      if (response.status === 200) {
        let timer = setInterval(() => {
          this.setState(
            preState => ({
              seconds: this.state.seconds - 1,
              content: formatMessage({ id: 'AccountManagement-SendNewEmailMessage.again' }),
              btnContent: this.state.seconds - 1 + formatMessage({ id: 'AccountManagement-SendNewEmailMessage.again.s' }),
              disable: true,
            }),
            () => {
              if (this.state.seconds == 0) {
                clearInterval(timer);
                this.setState({
                  content: '',
                  btnContent: formatMessage({ id: 'AccountManagement-SendNewEmailMessage.again.enter' }),
                  disable: false,
                  seconds: 60,
                });
              }
            },
          );
        }, 1000);
      } else {

      }
    });
  }

  //倒计时
  componentDidMount = () => {
    let timer = setInterval(() => {
      this.setState(
        preState => ({
          seconds: this.state.seconds - 1,
          btnContent: this.state.seconds - 1 + 's)',
        }),
        () => {
          if (this.state.seconds == 0) {
            clearInterval(timer);
            this.setState({
              content: '',
              btnContent: formatMessage({ id: 'AccountManagement-SendNewEmailMessage.again.enter' }),
              disable: false,
              seconds: 60,
            });
          }
        },
      );
    }, 1000);
    this.setState({
      address: this.props.match.params['address'],
    });
  };


  //判断验证码是否正确
  check(rule: any, value: any, callback: any) {
    let codes =
      this.state.valueA +
      this.state.valueB +
      this.state.valueC +
      this.state.valueD +
      this.state.valueE +
      this.state.valueF;
    let param: Map<string, any> = new Map();
    param.set('type', 1);
    param.set('verifyCode', codes);
    param.set('email', this.state.address);
    if (codes.length === 6) {
      getRequest('/sys/verify/checkMailVerifyCode', param, (response: any) => {
        if (response.status === 200) {
          callback();
        } else {
          callback(new Error(formatMessage({ id: 'AccountManagement-ModifyPassword.vertify.error.again' })));
        }
      });
    } else {
      callback();
    }
  }

  //跳转输入新邮箱页面
  submit = () => {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.props.history.push('/account_manager/newEmailAddress/' + this.props.match.params['guid']);
      }
    });
  };

  //判断输入的是不是数字
  handleInputValue = (e: any, type: any) => {
    const { value = '' } = e.target;
    const reg = /^\d*?$/;
    //获取valueA的值
    if (type == 'A') {
      if (reg.test(value)) {
        this.setState({
          valueA: value.slice(0, 1),
        });
      }
      //获取valueB的值
    } else if (type == 'B') {
      if (reg.test(value)) {
        this.setState({
          valueB: value.slice(0, 1),
        });
      }
      //获取valueC的值
    } else if (type == 'C') {
      if (reg.test(value)) {
        this.setState({
          valueC: value.slice(0, 1),
        });
      }
      //获取valueD的值
    } else if (type == 'D') {
      if (reg.test(value)) {
        this.setState({
          valueD: value.slice(0, 1),
        });
      }
      //获取valueE的值
    } else if (type == 'E') {
      if (reg.test(value)) {
        this.setState({
          valueE: value.slice(0, 1),
        });
      }
      //获取valueF的值
    } else {
      if (reg.test(value)) {
        this.setState({
          valueF: value.slice(0, 1),
          btnDisable: false,
        });
      }
    }
  };

  //获取聚焦
  getKeyCode = (e: any, type: any) => {
    if (type === 'A') {
      //删除
      if (e.keyCode === 8) {
        let timer = setInterval(() => {
          this.setState(
            {
              valueA: '',
            },
            () => {
              clearInterval(timer);
            },
          );
        }, 100);
        //输值后下一个输入框聚焦
      } else if (
        e.keyCode >= 48 &&
        e.keyCode <= 57 &&
        this.state.keyUpA === true &&
        this.state.valueA.length != 0
      ) {
        let timer = setInterval(() => {
          this.setState(
            {
              keyUpA: false,
            },
            () => {
              this.secondFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
        //输值后下一个输入框聚焦
      } else if (
        e.keyCode >= 96 &&
        e.keyCode <= 105 &&
        this.state.keyUpA === true &&
        this.state.valueA.length != 0
      ) {
        let timer = setInterval(() => {
          this.setState(
            {
              keyUpA: false,
            },
            () => {
              this.secondFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
      }
      //删除
    } else if (type === 'B') {
      if (e.keyCode === 8) {
        let timer = setInterval(() => {
          this.setState(
            {
              valueB: '',
            },
            () => {
              this.firstFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
        //输值后下一个输入框聚焦
      } else if (
        e.keyCode >= 48 &&
        e.keyCode <= 57 &&
        this.state.keyUpB === true &&
        this.state.valueB.length != 0
      ) {
        let timer = setInterval(() => {
          this.setState(
            {
              keyUpB: false,
            },
            () => {
              this.tridFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
        //输值后下一个输入框聚焦
      } else if (
        e.keyCode >= 96 &&
        e.keyCode <= 105 &&
        this.state.keyUpB === true &&
        this.state.valueB.length != 0
      ) {
        let timer = setInterval(() => {
          this.setState(
            {
              keyUpB: false,
            },
            () => {
              this.tridFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
      }
      //删除
    } else if (type === 'C') {
      if (e.keyCode === 8) {
        let timer = setInterval(() => {
          this.setState(
            {
              valueC: '',
            },
            () => {
              this.secondFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
        //输值后下一个输入框聚焦
      } else if (
        e.keyCode >= 48 &&
        e.keyCode <= 57 &&
        this.state.keyUpC === true &&
        this.state.valueC.length != 0
      ) {
        let timer = setInterval(() => {
          this.setState(
            {
              keyUpC: false,
            },
            () => {
              this.fourthFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
        //输值后下一个输入框聚焦
      } else if (
        e.keyCode >= 96 &&
        e.keyCode <= 105 &&
        this.state.keyUpC === true &&
        this.state.valueC.length != 0
      ) {
        let timer = setInterval(() => {
          this.setState(
            {
              keyUpC: false,
            },
            () => {
              this.fourthFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
      }
      //删除
    } else if (type === 'D') {
      if (e.keyCode === 8) {
        let timer = setInterval(() => {
          this.setState(
            {
              valueD: '',
            },
            () => {
              this.tridFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
        //输值后下一个输入框聚焦
      } else if (
        e.keyCode >= 48 &&
        e.keyCode <= 57 &&
        this.state.keyUpD === true &&
        this.state.valueD.length != 0
      ) {
        let timer = setInterval(() => {
          this.setState(
            {
              keyUpD: false,
            },
            () => {
              this.fifthFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
        //输值后下一个输入框聚焦
      } else if (
        e.keyCode >= 96 &&
        e.keyCode <= 105 &&
        this.state.keyUpD === true &&
        this.state.valueD.length != 0
      ) {
        let timer = setInterval(() => {
          this.setState(
            {
              keyUpD: false,
            },
            () => {
              this.fifthFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
      }
      //删除
    } else if (type === 'E') {
      if (e.keyCode === 8) {
        let timer = setInterval(() => {
          this.setState(
            {
              valueE: '',
            },
            () => {
              this.fourthFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
        //输值后下一个输入框聚焦
      } else if (
        e.keyCode >= 48 &&
        e.keyCode <= 57 &&
        this.state.keyUpE === true &&
        this.state.valueE.length != 0
      ) {
        let timer = setInterval(() => {
          this.setState(
            {
              keyUpE: false,
            },
            () => {
              this.sixthFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
        //输值后下一个输入框聚焦
      } else if (
        e.keyCode >= 96 &&
        e.keyCode <= 105 &&
        this.state.keyUpE === true &&
        this.state.valueE.length != 0
      ) {
        let timer = setInterval(() => {
          this.setState(
            {
              keyUpE: false,
            },
            () => {
              this.sixthFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
      }
      //删除
    } else {
      if (e.keyCode === 8) {
        let timer = setInterval(() => {
          this.setState(
            {
              valueF: '',
              keyUpE: false,
              btnDisable: true,
            },
            () => {
              this.fifthFoucs.input.focus();
              clearInterval(timer);
            },
          );
        }, 100);
      }
    }
  };

  //当按下按键后输入框可以输入值，并能够跳转
  keyDown = (e: any, type: any) => {
    if (type == 'A') {
      this.setState({
        valueA: '',
        keyUpA: true,
      });
    } else if (type == 'B') {
      this.setState({
        valueB: '',
        keyUpB: true,
      });
    } else if (type == 'C') {
      this.setState({
        valueC: '',
        keyUpC: true,
      });
    } else if (type == 'D') {
      this.setState({
        valueD: '',
        keyUpD: true,
      });
    } else if (type == 'E') {
      this.setState({
        valueE: '',
        keyUpE: true,
      });
    } else {
      this.setState({
        valueF: '',
        keyUpF: true,
      });
    }
  };

  render() {
    const { valueA, valueB, valueC, valueD, valueE, valueF } = this.state;
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
                    <FormattedMessage id="AccountManagement-SendNewEmailMessage.send" />
                    <span style={{ fontWeight: 'bolder', fontSize: '18px' }}>
                      {' '}
                      &nbsp;&nbsp;{this.state.address}&nbsp;&nbsp;{' '}
                    </span>
                    <FormattedMessage id="AccountManagement-SendNewEmailMessage.please.enter" />
                  </span>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}></Col>
              <Col span={1}>
                <Input
                  ref={ref => {
                    this.firstFoucs = ref;
                  }}
                  style={{ textAlign: 'center', marginLeft: '-40%', padding:'4px 5px'}}
                  value={valueA}
                  maxLength={1}
                  onChange={e => this.handleInputValue(e, 'A')}
                  onKeyDown={e => this.keyDown(e, 'A')}
                  onKeyUp={e => this.getKeyCode(e, 'A')}
                  autoFocus
                />
              </Col>
              <Col span={1}>
                <Input
                  ref={ref => {
                    this.secondFoucs = ref;
                  }}
                  style={{ textAlign: 'center', marginLeft: '-40%', padding:'4px 5px' }}
                  value={valueB}
                  maxLength={1}
                  readOnly={this.state.valueA ? false : true}
                  onKeyUp={e => this.getKeyCode(e, 'B')}
                  onKeyDown={e => this.keyDown(e, 'B')}
                  onChange={e => this.handleInputValue(e, 'B')}
                />
              </Col>
              <Col span={1}>
                <Input
                  ref={ref => {
                    this.tridFoucs = ref;
                  }}
                  style={{ textAlign: 'center', marginLeft: '-40%', padding:'4px 5px' }}
                  value={valueC}
                  maxLength={1}
                  readOnly={this.state.valueB ? false : true}
                  onKeyUp={e => this.getKeyCode(e, 'C')}
                  onKeyDown={e => this.keyDown(e, 'C')}
                  onChange={e => this.handleInputValue(e, 'C')}
                />
              </Col>
              <Col span={1}>
                <Input
                  ref={ref => {
                    this.fourthFoucs = ref;
                  }}
                  style={{ textAlign: 'center', marginLeft: '-40%', padding:'4px 5px' }}
                  value={valueD}
                  maxLength={1}
                  readOnly={this.state.valueC ? false : true}
                  onKeyUp={e => this.getKeyCode(e, 'D')}
                  onKeyDown={e => this.keyDown(e, 'D')}
                  onChange={e => this.handleInputValue(e, 'D')}
                />
              </Col>
              <Col span={1}>
                <Input
                  ref={ref => {
                    this.fifthFoucs = ref;
                  }}
                  style={{ textAlign: 'center', marginLeft: '-40%', padding:'4px 5px' }}
                  value={valueE}
                  maxLength={1}
                  readOnly={this.state.valueD ? false : true}
                  onKeyUp={e => this.getKeyCode(e, 'E')}
                  onKeyDown={e => this.keyDown(e, 'E')}
                  onChange={e => this.handleInputValue(e, 'E')}
                />
              </Col>
              <Col span={1}>
                <Input
                  ref={ref => {
                    this.sixthFoucs = ref;
                  }}
                  style={{ textAlign: 'center', marginLeft: '-40%', padding:'4px 5px' }}
                  value={valueF}
                  maxLength={1}
                  readOnly={this.state.valueE ? false : true}
                  onKeyUp={e => this.getKeyCode(e, 'F')}
                  onKeyDown={e => this.keyDown(e, 'F')}
                  onChange={e => this.handleInputValue(e, 'F')}
                />
              </Col>
              <Col span={2}>
                <Form.Item style={{ textAlign: 'center', marginLeft: '-20%', marginTop: '-3%' }} label="">
                  <Button type="primary" onClick={this.send} disabled={this.state.disable}>{this.state.content}{this.state.btnContent}</Button>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item style={{ textAlign: 'center' }} label="">
                  {getFieldDecorator('valueF', {
                    rules: [
                      {
                        validator: (rule: any, value: any, callback: any) => {
                          this.check(rule, value, callback);
                        },
                      },
                    ],
                    initialValue: '',
                  })(
                    <Button type="primary" onClick={this.submit} disabled={this.state.btnDisable}>
                      <FormattedMessage id="AccountManagement-NewEmailAddress.submit" />
                    </Button>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

const SendNewPhone_Form = Form.create({ name: 'SendNewPhone_Form' })(SendNewPhone);
export default SendNewPhone_Form;
