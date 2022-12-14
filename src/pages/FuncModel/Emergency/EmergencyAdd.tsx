import React from 'react';
import { Form, Row, Col, Input, message, Modal } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import { RouteComponentProps } from 'dva/router';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import { postRequest, putRequest, getRequest } from '@/utils/request';
import EmergencyFormProps from './EmergencyFormInterface';
import { isNil } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';

const { confirm } = Modal;

type EmergencyProps = EmergencyFormProps & RouteComponentProps;
const { TextArea } = Input;
class EmergencyAdd extends React.Component<EmergencyFormProps, EmergencyProps> {
  constructor(prop: EmergencyFormProps) {
    super(prop);
  }

  componentDidMount() {
    this.setState({
      requestTitle: '',
      requestContent: '',
      history: this.props.history,
      flag: '',
    });
    //根据id请求紧急需求数据
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    if (uid) {
      this.setState({
        title: formatMessage({ id: 'Emergency-EmergencyView.emergencyUpdate' }),
      });
      let param: Map<string, string> = new Map();
      param.set('type', '1');
      getRequest('/business/emergency/' + uid, param, (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data)) {
            this.setState({
              requestTitle: response.data.emergency.requestTitle,
              requestContent: response.data.emergency.requestContent,
              //flag为1代表修改
              flag: '1',
            });
          }
        }
      });
    } else {
      this.setState({
        requestTitle: '',
        requestContent: '',
        //flag为2代表新增
        flag: '2',
        title: formatMessage({ id: 'Emergency-EmergencyAdd.emergencyDemand' }),
      });
    }
  }

  //提交修改
  handleSubmit(type: number, flag: string, state: number) {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    this.props.form.validateFields((err: any) => {
      if (!err) {
        if (flag === '2') {
          let requestData = {
            type: type,
            requestTitle: this.state.requestTitle,
            requestContent: this.state.requestContent,
            state: state,
            guid: uid,
          };
          // 新增保存请求
          postRequest('/business/emergency', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              message.success(formatMessage({ id: 'Emergency-EmergencyAdd.successfulAdd' }), 2);
              const userType = localStorage.getItem('userType');
              if (userType === '5') {
                this.props.history.push('/emergencyowner');
              } else if (userType === '4') {
                this.props.history.push('/emergency');
              } else {
                this.props.history.push('/checkemergency');
              }
            } else {
              message.error(formatMessage({ id: 'Emergency-EmergencyAdd.failAdd' }), 2);
            }
          });
        } else if (flag === '1') {
          let requestData = {
            type: type,
            requestTitle: this.state.requestTitle,
            requestContent: this.state.requestContent,
            state: state,
            guid: uid,
          };
          // 修改保存请求
          putRequest('/business/emergency', JSON.stringify(requestData), (response: any) => {
            if (response.status === 200) {
              message.success(formatMessage({ id: 'Emergency-EmergencyAdd.successfulUpdate' }), 2);
              const userType = localStorage.getItem('userType');
              if (userType === '5') {
                this.props.history.push('/emergencyowner');
              } else if (userType === '4') {
                this.props.history.push('/emergency');
              } else {
                this.props.history.push('/checkemergency');
              }
            } else {
              message.error(formatMessage({ id: 'Emergency-EmergencyAdd.failUpdate' }), 2);
            }
          });
        }
      }
    });
  }

  onBack = () => {
    const userType = localStorage.getItem('userType');
    if (userType === '5') {
      this.props.history.push('/emergencyowner');
    } else if (userType === '4') {
      this.props.history.push('/emergency');
    } else {
      this.props.history.push('/checkemergency');
    }
  };

  render() {
    const formlayout = {
      wrapperCol: { span: 24 },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={
            isNil(this.state) || isNil(this.state.title)
              ? formatMessage({ id: 'Emergency-EmergencyAdd.emergencyDemand' })
              : this.state.title
          }
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Emergency-EmergencyAdd.emergencyTitle' })}
                >
                  {getFieldDecorator('requestTitle', {
                    initialValue:
                      this.state == null || this.state.requestTitle == null
                        ? '111'
                        : this.state.requestTitle,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'Emergency-EmergencyAdd.emergencyTitle.must',
                        }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={100}
                      placeholder={formatMessage({ id: 'Emergency-EmergencyAdd.emergencyTheme' })}
                      onChange={e => this.setState({ requestTitle: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Emergency-EmergencyAdd.emergencyDemandContent' })}
                >
                  {getFieldDecorator('requestContent', {
                    initialValue:
                      this.state == null || this.state.requestContent == null
                        ? '222'
                        : this.state.requestContent,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'Emergency-EmergencyAdd.emergencyDemandContent.must',
                        }),
                      },
                    ],
                  })(
                    <TextArea
                      style={{ height: '180px' }}
                      maxLength={250}
                      placeholder={formatMessage({ id: 'Emergency-EmergencyAdd.inputContent' })}
                      onChange={e => this.setState({ requestContent: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  disabled={false}
                  type="Save"
                  text={formatMessage({ id: 'Emergency-EmergencyAdd.save' })}
                  event={() => {
                    this.handleSubmit(1, this.state.flag, 0);
                  }}
                />
              </Col>
              <Col span={12}>
                <ButtonOptionComponent
                  disabled={false}
                  type="SaveAndCommit"
                  text={formatMessage({ id: 'Emergency-EmergencyAdd.saveAndsubmit' })}
                  event={() => {
                    this.newMethod();
                  }}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  private newMethod() {
    confirm({
      title: formatMessage({ id: 'Common-Publish.confirm.not' }),
      okText: formatMessage({
        id: 'Common-Publish.publish.confirm',
      }),
      cancelText: formatMessage({
        id: 'Common-Publish.publish.cancle',
      }),
      onOk: () => {
        this.handleSubmit(2, this.state.flag, 1);
      },
    });
  }
}

const EmergencyAdd_Form = Form.create({ name: 'EmergencyAdd_Form' })(EmergencyAdd);

export default EmergencyAdd_Form;
