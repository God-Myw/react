import { getRequest, postRequest, putRequest } from '@/utils/request';
import { RouteComponentProps } from 'dva/router';
import { ColumnProps } from 'antd/lib/table';
import { Col, Input, message, Modal, Row, Select, Form, DatePicker } from 'antd';
import { forEach, get, isNil, values } from 'lodash';
import { CrewTrainingModel } from './CrewTrainingModel';
import React from 'react';
import moment from 'moment';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import { FormComponentProps } from 'antd/lib/form';
import { getDictDetail } from '@/utils/utils';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '../../../components/WangEditor';
import '@wangeditor/editor/dist/css/style.css';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';

const defaultContent = [{ type: 'paragraph', children: [{ text: '' }] }];

const InputGroup = Input.Group;
const { confirm } = Modal;
const { Option } = Select;
type TrainEditProps = FormComponentProps & RouteComponentProps;

class TrainEdit extends React.Component<TrainEditProps> {
  state = {
    isEdit: false,
    editor: null,
    title: '',
    guid: '',
    content: '',
    endDate: '',
    mechanism: '',
    contacter: '',
    phoneNumber: '',
  };

  componentDidMount() {
    //是否可编辑
    this.setState({ isEdit: this.props.location.state.type });
    this.initData();
  }
  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {
          title: this.state.title,
          guid: this.state.guid,
          content: this.state.content,
          endDate: JSON.stringify(new Date(this.state.endDate).getTime()),
          mechanism: this.state.mechanism,
          contacter: this.state.contacter,
          phoneNumber: this.state.phoneNumber,
        };
        putRequest('/business/Cultivate/updateCultivate', JSON.stringify(params), (res: any) => {
          if (res.code == '0000') {
            this.props.history.push('/CrewTraining/Train/list');
          }
        });
      }
    });
  };
  initData = () => {
    let url = '/business/Cultivate/getCultivateById';
    let params: Map<string, any> = new Map();
    params.set('guid', this.props.location.state.guid);
    getRequest(url, params, res => {
      if (res.code == '0000') {
        this.setState({
          title: res.data.title,
          guid: res.data.guid,
          content: res.data.content,
          endDate: moment(new Date(res.data.endDate), 'YYYY-MM-DD'),
          mechanism: res.data.mechanism,
          contacter: res.data.contacter,
          phoneNumber: res.data.phoneNumber,
        });
        this.props.form.setFieldsValue({
          title: res.data.title,
          endDate: moment(new Date(res.data.endDate), 'YYYY-MM-DD'),
          mechanism: res.data.mechanism,
          contacter: res.data.contacter,
          phoneNumber: res.data.phoneNumber,
        });
        this.state.editor.setHtml(res.data.content);
        if (!this.state.isEdit) this.state.editor.disable();
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const toolbarConfig = {
      // excludeKeys: ['fullScreen'],
    };
    const editorConfig: Partial<IEditorConfig> = {
      placeholder: '请输入内容...',
      // readOnly: !this.props.location.state.type,
      onCreated: (editor: IDomEditor) => {
        this.setState({ editor });
      },
      onChange: (editor: IDomEditor) => {
        this.setState({ content: editor.getHtml() });
      },
      MENU_CONF: {
        uploadImage: {
          server: '/api/sys/file/upLoadFuJian/spart',
          // timeout: 5 * 1000, // 5s
          fieldName: 'file',
          headers: {
            // accept: '.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff',
            token: String(localStorage.getItem('token')),
          },

          // maxFileSize: 10 * 1024 * 1024, // 10M

          // base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
          customInsert(res: any, insertFn: Function) {
            // res 即服务端的返回结果
            let url = `http://58.33.34.10:10443/images/spart/${res.data.fileName}`;
            let alt = '';
            let href = '';
            // 从 res 中找到 url alt href ，然后插入图片
            insertFn(url, alt, href);
          },
          onBeforeUpload(file: any) {
            return file;
          },
          onSuccess(file: any, res: any) {
            // console.log('onSuccess', file, res);
          },
        },
      },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={this.state.isEdit ? '编辑培训信息' : '查看培训信息'}
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="培训项目标题">
                  {getFieldDecorator('title', {
                    rules: [
                      {
                        required: this.state.isEdit,
                        message: '请填写培训项目标题',
                      },
                    ],
                  })(
                    <Input
                      disabled={!this.state.isEdit}
                      onChange={e => this.setState({ title: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="培训具体内容">
                  <div
                    data-testid="editor-container"
                    style={{ border: '1px solid #ccc', marginTop: '10px' }}
                  >
                    <Toolbar
                      editor={this.state.editor}
                      defaultConfig={toolbarConfig}
                      style={{ borderBottom: '1px solid #ccc' }}
                    />
                    {getFieldDecorator('content', {
                      rules: [
                        {
                          required: this.state.isEdit,
                          message: '请填写培训具体内容',
                          validator: (rule, value, callback) => {
                            if (this.state.content == '<p><br></p>') {
                              callback('error');
                            }
                            callback();
                          },
                        },
                      ],
                    })(
                      <Editor
                        defaultConfig={editorConfig}
                        defaultContent={defaultContent}
                        mode="default"
                        style={{ height: '500px' }}
                      />,
                    )}
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="报名截止时间">
                  {getFieldDecorator('endDate', {
                    rules: [
                      {
                        required: this.state.isEdit,
                        message: '请填写报名截止时间',
                      },
                    ],
                  })(
                    <DatePicker
                      disabled={!this.state.isEdit}
                      onChange={(e, date) => {
                        this.setState({
                          endDate: date,
                        });
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>
          </Form>
        </div>
        <div className={commonCss.title}>
          <span className={commonCss.text}>{'培训机构相关信息'}</span>
        </div>
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="培训机构">
                  {getFieldDecorator('mechanism', {
                    rules: [
                      {
                        required: this.state.isEdit,
                        message: '请填写培训机构相关信息',
                      },
                    ],
                  })(
                    <Input
                      disabled={!this.state.isEdit}
                      onChange={e => this.setState({ mechanism: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系人">
                  {getFieldDecorator('contacter', {
                    rules: [
                      {
                        required: this.state.isEdit,
                        message: '请填写联系人',
                      },
                    ],
                  })(
                    <Input
                      disabled={!this.state.isEdit}
                      onChange={e => this.setState({ contacter: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系方式">
                  {getFieldDecorator('phoneNumber', {
                    rules: [
                      {
                        required: this.state.isEdit,
                        message: '请填写联系方式',
                      },
                    ],
                  })(
                    <Input
                      disabled={!this.state.isEdit}
                      onChange={e => this.setState({ phoneNumber: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              {this.state.isEdit ? (
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    disabled={false}
                    type="CloseButton"
                    text={'重新发布'}
                    event={this.submit}
                  />
                </Col>
              ) : (
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}></Col>
              )}
              <Col span={12}>
                <ButtonOptionComponent
                  disabled={false}
                  type="Save"
                  text={'关闭'}
                  event={() => {
                    this.props.history.push('/CrewTraining/Train/list');
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

const MPCertificationList_Form = Form.create({ name: 'MPCertificationList_Form' })(TrainEdit);

export default MPCertificationList_Form;
