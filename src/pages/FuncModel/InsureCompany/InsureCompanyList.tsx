import { deleteRequest, getRequest, postRequest, putRequest } from '@/utils/request';
import { checkPhone } from '@/utils/validator';
import { Col, Form, Input, Modal, Row, Table, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ColumnProps } from 'antd/lib/table';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { InsureCompanyFormProps } from './InsureCompanyFormInterface';
import { InsureCompanyModel } from './InsureCompanyModel';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import moment from 'moment';
const pageSize=10;
const InputGroup = Input.Group;
const { confirm } = Modal;

interface InsureCompanyAddFormProps extends FormComponentProps {
  //列
  columns: ColumnProps<InsureCompanyModel>[];
  //表数据
  dataSource: InsureCompanyModel[];
  // 搜索公司名称
  selectcompanyName: string;
  id: number;
  //Modal显示
  visible: boolean;
  flag: string;
 // companyName: string;
  total:number;
  title: string;
  pageSize: number;
  currentPage: number;

  guid: string;
  companyNameCn: string;
  companyNameEn: string;
  companyCode: string;
  contacter: string;
  contactPhone: string;
  address: string;
  //新加入参数（汇率）
  rate: string;
}

class InsureCompanyForm extends React.Component<InsureCompanyFormProps, InsureCompanyAddFormProps> {
  //列
  private columns: ColumnProps<InsureCompanyModel>[] = [
    {
      title: <FormattedMessage id="InsureConpany-InsuranceList.code" />,
      dataIndex: 'companyIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id="InsureConpany-InsuranceList.insuranceCompany" />,
      dataIndex: 'companyNameCn',
      align: 'center',
    },
    {
      title: <FormattedMessage id="InsureConpany-InsuranceList.rate" />,
      dataIndex: 'rate',
      align: 'center',
    },
    {
      title: <FormattedMessage id="InsureConpany-InsuranceList.contacts" />,
      dataIndex: 'contacter',
      align: 'center',
    },
    {
      title: <FormattedMessage id="InsureConpany-InsuranceList.contact-information" />,
      dataIndex: 'contactPhone',
      align: 'center',
    },
    {
      title: <FormattedMessage id="InsureConpany-InsuranceList.address" />,
      dataIndex: 'address',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'InsureConpany-InsuranceList.operation' }),
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: any, record: any) => (
        <span>
          <QueryButton
            text={formatMessage({ id: 'InsureConpany-InsuranceList.update' })}
            type="Edit"
            event={() => this.showModal(guid)}
          />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'InsureConpany-InsuranceList.delete' })}
            type="Delete"
            event={() => this.handleDelete(guid, record)}
          />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'InsureConpany-InsuranceList.examine' })}
            type="View"
            event={() => this.handleView(guid)}
          />
        </span>
      ),
    }
  ];
  constructor(props: InsureCompanyFormProps) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      columns: this.columns,
    });
  }

  //初期化事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    this.setState({
      visible: false,
      flag: '1',
      selectcompanyName: '',
      companyNameCn: '',
      companyNameEn: '',
      companyCode: '',
      contacter: '',
      contactPhone: '',
      address: '',
      title: formatMessage({ id: 'InsureConpany-InsuranceList.increase' }),
      pageSize: 10,
      currentPage: 1,
      //新追加参数
      rate: '',
    });
    this.getInsureCompanyList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getInsureCompanyList();
   }
  }

  //准备参数
  setParams(companyName: string): Map<string, string> {
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('pageSize', '10');
    params.set('data', moment());
    params.set('currentPage', isNil(this.state) || isNil(this.state.currentPage) ? 1 : this.state.currentPage);
    if (!isNil(companyName) && companyName != '') {
      params.set('companyNameCn', companyName);
    }
    return params;
  }

  //获取表格数据
  getInsureCompanyList() {
    const data_Source: InsureCompanyModel[] = [];
    let param = this.setParams(this.state.selectcompanyName);
    getRequest('/sys/insuranceCompany/', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.insuranceCompanys, (insuranceCompany, index) => {
            const entity: InsureCompanyModel = {};
            entity.companyIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.guid = insuranceCompany.guid;
            entity.companyNameCn = insuranceCompany.companyNameCn;
            entity.companyNameEn = insuranceCompany.companyNameEn;
            //新参数
            entity.companyCode = insuranceCompany.companyCode;
            entity.contacter = insuranceCompany.contacter;
            entity.contactPhone = insuranceCompany.contactPhone;
            entity.address = insuranceCompany.address;
            entity.rate = insuranceCompany.rate;
            data_Source.push(entity);
          });
        }
        this.setState({
          total: response.data.total,
          dataSource: data_Source,
        });
      }
    },
    );
  }

  //检索事件
  search() {
    this.setState({
      currentPage: 1,
    }, () => {
      this.getInsureCompanyList();
    });
  }

  //修改当前页码
  changePage = (page: any) => {
    this.setState({
      currentPage: page,
    }, () => {
      this.getInsureCompanyList();
    });

  };

  //删除
  handleDelete = (guid: any, record: any) => {
    let params: Map<string, any> = new Map();
    params.set('type', 1);
    const get = this;
    const deleteMessage = '是否对 序号：' + record.companyIndex + ' 保险公司名称: ' + record.companyNameCn + ' 的信息进行删除？';
    confirm({
      title: deleteMessage,
      okText: formatMessage({ id: 'InsureConpany-InsuranceList.comfirm' }),
      cancelText: formatMessage({ id: 'InsureConpany-InsuranceList.cancel' }),
      onOk() {
        deleteRequest('/sys/insuranceCompany/' + guid, params, (response: any) => {
          if (response.status === 200) {
            message.success(formatMessage({ id: 'InsureConpany-InsuranceList.success-delete' }), 2);
            get.getInsureCompanyList();
          } else {
            message.error(formatMessage({ id: 'InsureConpany-InsuranceList.error-delete' }), 2);
          }
        });

      },
    });
  };

  //跳转查看页面
  handleView = (id: any) => {
    this.props.history.push('/insureCompany/view/' + id);
  };

  //获取保险公司名称
  handleInsureCompanyNameSelect = (value: string) => {
    this.setState({
      selectcompanyName: value,
    });
  };

  //显示Modal
  showModal = (guid: any) => {
    this.setState({
      flag: '2',
      id: guid,
      visible: true,
      companyNameCn: '',
      companyNameEn: '',
      companyCode: '',
      contacter: '',
      contactPhone: '',
      address: '',
      //新参数
      rate: '',
    });
    if (!isNil(guid) && guid != '') {
      this.setState({
        title: formatMessage({ id: 'InsureConpany-InsuranceList.update' }),
        flag: '1',
        visible: true,
      });
      let param: Map<string, string> = new Map();
      param.set('type', '1');
      getRequest('/sys/insuranceCompany/' + guid, param, (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data)) {
            this.setState({
              //新参数
              rate: response.data.rate,
              companyNameCn: response.data.companyNameCn,
              companyNameEn: response.data.companyNameEn,
              companyCode: response.data.companyCode,
              address: response.data.address,
              contacter: response.data.contacter,
              contactPhone: response.data.contactPhone,
              visible: true,
            });
          }
        }
      });
    }
  };

  //关闭Modal跳转一览页面
  closeModal = () => {
    this.onBack();
  };

  //新增修改函数
  handleSubmit(flag: string, id: number) {
    this.props.form.validateFields((err: any) => {
      if (!err) {
        if (flag === '2') {
          let param = {
            //原型图不一致，参数变更三个必须项p
            type: '1',
            phoneCode: '86',
            companyCode: '86',
            rate: this.state.rate,
            companyNameCn: this.state.companyNameCn,
            address: this.state.address,
            contacter: this.state.contacter,
            contactPhone: this.state.contactPhone,
          };
          //新增
          postRequest('/sys/insuranceCompany/', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(formatMessage({ id: 'InsureConpany-InsuranceList.success-submit' }));
              this.setState({
                visible: false,
                flag: '1',
              });
              this.getInsureCompanyList();
            }
          });
        } else if (flag === '1') {
          let params = {
            guid: id,
            companyCode: '86',
            address: this.state.address,
            contacter: this.state.contacter,
            contactPhone: this.state.contactPhone,
            //原型图不一致，参数变更三个必须项
            rate: this.state.rate,
            companyNameCn: this.state.companyNameCn,
          };
          //修改
          putRequest('/sys/insuranceCompany/', JSON.stringify(params), (response: any) => {
            if (response.status === 200) {
              message.success(formatMessage({ id: 'InsureConpany-InsuranceList.success-edit' }));
              this.setState({
                visible: false,
                flag: '1',
              });
              this.getInsureCompanyList();

            }
          });
        }
      }
    });
  }

  //Modal确认
  handleOk = (flag: any) => {
    this.handleSubmit(flag, this.state.id);
  };

  //Modal取消
  handleCancel = (e: any) => {
    this.setState({
      visible: false,
    });
  };

  onBack = () => {
    this.setState({
      visible: false,
    });
  }

  //校验数字
 checkNumber = (rule: any, value: any, callback: any) => {
  if (value !== '' &&  !/^\d+(\.\d+)?$/.test(value)) {
    callback(formatMessage({ id: 'user-login.login.pls-input-number', }));
  } else {
    callback();
  }
};

  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'InsureConpany-InsuranceList.insuranceCompany-maintenance' })}
          event={() => { }}
          displayNone={true}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  placeholder={formatMessage({
                    id: 'InsureConpany-InsuranceList.please-input-insuranceCompany',
                  })}
                  style={{ width: '91.5%', textAlign: 'left' }}
                  onChange={e => this.setState({ selectcompanyName: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <QueryButton
                  type="Query"
                  text={formatMessage({ id: 'InsureConpany-InsuranceList.search' })}
                  event={this.search.bind(this)}
                />
                <QueryButton type="Add" text="" event={() => this.showModal('')} />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Table
            rowKey={record => (!isNil(record.guid) ? record.guid.toString() : '')}
            bordered
            columns={isNil(this.state) || isNil(this.state.columns) ? [] : this.state.columns}
            size="small"
            dataSource={
              isNil(this.state) || isNil(this.state.dataSource) ? [] : this.state.dataSource
            }
            rowClassName={(record, index) =>
              index % 2 == 0 ? commonCss.dataRowOdd : commonCss.dataRowEven
            }
            pagination={{
              current: this.state.currentPage,
              showQuickJumper: true,
              pageSize: pageSize,
              onChange: this.changePage,
              total: this.state.total,
              showTotal: () => (
                <div>
                  总共
                  {this.state.total % pageSize == 0
                    ? Math.floor(this.state.total / pageSize)
                    : Math.floor(this.state.total / pageSize) + 1}
                  页记录,每页显示
                  {pageSize}条记录
                </div>
              ),
            }}
          />
        </div>

        <div>
          <Modal
            // 对话框是否可见
            visible={isNil(this.state) || isNil(this.state.visible) ? false : this.state.visible}
            // 点击确定回调
            onOk={() =>
              this.handleOk(isNil(this.state) || isNil(this.state.flag) ? '' : this.state.flag)
            }
            // 点击遮罩层或右上角叉或取消按钮的回调
            onCancel={this.handleCancel}
            // Modal 完全关闭后的回调
            afterClose={this.closeModal}
            // 关闭时销毁 Modal 里的子元素
            destroyOnClose={true}
            // 点击蒙层是否允许关闭
            maskClosable={false}
            // 是否显示右上角的关闭按钮
            closable={false}
            // 垂直居中展示 Modal
            centered={true}
            width={'1100px'}
            okText={'确认'}
          >
            <LabelTitleComponent
              text={isNil(this.state) || isNil(this.state.title) ? '' : this.state.title}
              event={() => this.onBack()}
            />
            <div className={commonCss.AddForm}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      {...formlayout}
                      label={formatMessage({ id: 'InsureConpany-InsuranceList.insuranceCompany' })}
                    >
                      {getFieldDecorator('companyNameCn', {
                        initialValue:
                          isNil(this.state) || isNil(this.state.companyNameCn)
                            ? ''
                            : this.state.companyNameCn,
                        rules: [
                          {
                            required: true,
                            message: '公司名不能为空!',
                          },
                        ],
                      })(
                        <Input
                          placeholder={formatMessage({
                            id: 'InsureConpany-InsuranceList.input',
                          })}
                          onChange={e => this.setState({ companyNameCn: e.target.value })}
                          maxLength={128}
                        />,
                        
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...formlayout}
                      label={formatMessage({ id: 'InsureConpany-InsuranceList.rate' })}
                    >
                      {getFieldDecorator('rate', {
                        initialValue:
                          isNil(this.state) || isNil(this.state.rate)
                            ? ''
                            : this.state.rate,
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '费率不能为空!',
                          },
                          {
                            validator: this.checkNumber.bind(this),
                          },
                        ],
                      })(
                        <Input
                        maxLength={15}
                          placeholder={formatMessage({
                            id: 'InsureConpany-InsuranceList.input',
                          })}
                          onChange={e => this.setState({ rate: e.target.value })}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      {...formlayout}
                      label={formatMessage({ id: 'InsureConpany-InsuranceList.contacts' })}
                    >
                      {getFieldDecorator('contacter', {
                        initialValue:
                          isNil(this.state) || isNil(this.state.contacter)
                            ? ''
                            : this.state.contacter,
                        rules: [
                          {
                            required: true,
                            message: '联系人不能为空!',
                          },
                        ],
                      })(
                        <Input
                          placeholder={formatMessage({
                            id: 'InsureConpany-InsuranceList.input',
                          })}
                          onChange={e => this.setState({ contacter: e.target.value })}
                          maxLength={32}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...formlayout}
                      label={formatMessage({ id: 'InsureConpany-InsuranceList.contacts-phone' })}
                    >
                      {getFieldDecorator('contactPhone', {
                        initialValue:
                          isNil(this.state) || isNil(this.state.contactPhone)
                            ? ''
                            : this.state.contactPhone,
                        rules: [
                          {
                            required: true,
                            message: formatMessage({
                              id: 'InsureConpany-InsuranceList.contacts-phone-null',
                            }),
                          },
                          {
                            pattern: new RegExp(/^[0-9]\d*$/),
                            message: formatMessage({ id: 'insuranceForShipper-insuranceAdd.phonenumber.enter.correct' }),
                          },
                        ],
                      })(
                        <Input
                        maxLength={20}
                          placeholder={formatMessage({
                            id: 'InsureConpany-InsuranceList.input',
                          })}
                          onChange={e => this.setState({ contactPhone: e.target.value })}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      {...formlayout}
                      label={formatMessage({ id: 'InsureConpany-InsuranceList.address' })}
                    >
                      {getFieldDecorator('address', {
                        initialValue:
                          isNil(this.state) || isNil(this.state.address) ? '' : this.state.address,
                        rules: [
                          {
                            required: true,
                            message: formatMessage({
                              id: 'InsureConpany-InsuranceList.address-null',
                            }),
                          },
                        ],
                      })(
                        <Input
                          placeholder={formatMessage({ id: 'InsureConpany-InsuranceList.input' })}
                          onChange={e => this.setState({ address: e.target.value })}
                          maxLength={128}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

const InsureCompanyList_Form = Form.create({ name: 'insureCompanyList_Form' })(InsureCompanyForm);

export default InsureCompanyList_Form;
