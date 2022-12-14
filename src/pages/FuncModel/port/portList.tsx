import React from 'react';
import { Table, Input, Row, Col, Modal, Form, message, Select } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { portModel } from './portModel';
import { ColumnProps } from 'antd/lib/table';
import getRequest, { postRequest, deleteRequest, putRequest } from '@/utils/request';
import { isNil, forEach } from 'lodash';
import { getDictDetail } from '@/utils/utils';
import { FormComponentProps } from 'antd/lib/form';
import { PortFormProps } from './PortFormInterface';
import moment from 'moment';
const InputGroup = Input.Group;
const data_Source: portModel[] = []; //列表数组
const pageSize = 10; //每页记录数,默认设置10
const { confirm } = Modal;
const formItemLayout = {
  labelCol: {
    md: { span: 6 },
    lg: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

interface PortAddFormProps extends FormComponentProps {
  //列
  columns: ColumnProps<portModel>[];
  //表数据
  dataSource: portModel[];
  modalTitle: string;
  modalVisible: boolean;
  guid: number;
  total: number;
  currentPage: number;
  searchCountry: string;
  countryId: number; //国家id
  portId: number; //港口id
  countryName: string; //国家名
  portName: string; //港口名
  originalcountryId: number; //原始国家id
  originalPortId: number; //原始港口id
  indexNumber: number; //序号
}

class PortForm extends React.Component<PortFormProps, PortAddFormProps> {
  private columns: ColumnProps<portModel>[] = [
    {
      title: '序号',
      dataIndex: 'portIndex',
      align: 'center',
      width: 100,
    },
    {
      title: '国家',
      dataIndex: 'countryName',
      align: 'center',
    },
    {
      title: '港口',
      dataIndex: 'portName',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: number, record: any) => (
        <span>
          <QueryButton
            disabled={false}
            text="修改"
            type="Edit"
            event={() => this.handleEdit(guid, record)}
          />
          &nbsp;
          <QueryButton
            disabled={false}
            text="删除"
            type="Delete"
            event={() => this.handleDelete(guid, record)}
          />
        </span>
      ),
    },
  ];
  constructor(props: PortFormProps) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      modalVisible: false,
      modalTitle: '', //组件标题
      columns: this.columns, //列数
      guid: 0,
      total: 0, //总页数
      currentPage: 1, //当前页数
      searchCountry: '', //搜索栏国家
      countryName: '', //国家名
      portName: '', //港口名
      indexNumber: -1, //序号
    });
  }

  //钩子函数
  componentDidMount() {
    this.initData();
  }

  //初始化数据
  initData() {
    this.getPortList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getPortList();
   }
  }

  //填充list列表
  getPortList() {
    let param: Map<string, any> = new Map();
    //测试mock先插入1做测试数据
    param.set('type', '1');
    param.set('currentPage', this.state.currentPage);
    param.set('pageSize', pageSize);
    param.set('data', moment());
    //判断国家
    if (!isNil(this.state.searchCountry) && this.state.searchCountry != '') {
      param.set('country', this.state.searchCountry);
    }
    if (!isNil(this.state.portName) && this.state.portName != '') {
      param.set('portName', this.state.portName);
    }
    getRequest('/sys/port', param, (response: any) => {
      if (response.status == 200) {
        data_Source.length = 0;
        if (!isNil(response.data)) {
          forEach(response.data.ports, (port, index) => {
            data_Source.push({
              //序号修改
              portIndex: `${index + (this.state.currentPage - 1) * pageSize + 1}`,
              countryName: port.countryName,
              portName: port.portName,
              portId: port.portId,
              countryId: port.countryId,
              guid: port.guid,
            });
          });
        }
        this.setState({
          total: response.data.total,
          currentPage: response.data.currentPage,
        });
      }
    });
  }

  //搜索操作
  search() {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  }

  //添加按钮
  handAddPort = () => {
    this.setState({
      modalVisible: true,
      modalTitle: '新增',
      countryId: 0,
      portId: 0,
      countryName: '',
      portName: '',
    });
  };

  //编辑按钮
  handleEdit = (guid: any, record: any) => {
    this.setState({
      modalVisible: true,
      guid: guid,
      countryId: record.countryId,
      portId: record.portId,
      countryName: record.countryName,
      portName: record.portName,
      modalTitle: '修改',
    });
  };

  //删除按钮
  handleDelete = (guid: any, record: any) => {
    let params: Map<string, any> = new Map();
    params.set('type', 1);
    const get = this;
    const deleteMessage = `是否对 序号: ${record.portIndex} 国家: ${record.countryName} 港口: ${record.portName} 的信息进行删除?`;
    confirm({
      title: deleteMessage,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        deleteRequest('/sys/port/' + guid, params, (response: any) => {
          if (response.status === 200) {
            message.success('删除成功');
            get.getPortList();
          } else {
            message.error(response.data);
          }
        });
      },
    });
  };

  //查看按钮操作
  handleView = (guid: any) => {
    this.props.history.push('/dict/view/' + guid);
  };

  //组件确定操作
  modalOk = (e: any) => {
    this.props.form.validateFields((err: any) => {
      if (!err) {
        if (this.state.guid == 0) {
          let requestParam: any = {
            type: '1',
            countryId: this.state.countryId,
            portId: this.state.portId,
          };
          postRequest('/sys/port', JSON.stringify(requestParam), (response: any) => {
            if (response.status == 200) {
              message.success('添加成功');
              this.initData();
              this.setState({
                modalVisible: false,
              });
            } else if (response.status == 500) {
              message.warning(response.message);
              return;
            }
          });
        } else {
          let requestParam: any = {
            countryId: this.state.countryId,
            portId: this.state.portId,
            guid: this.state.guid,
            type: '1',
          };
          putRequest('/sys/port', JSON.stringify(requestParam), (response: any) => {
            if (response.status == 200) {
              message.success('修改成功');
              this.initData();
              this.setState({
                modalVisible: false,
                guid: 0,
                countryId: 0,
                portId: 0,
                countryName: '',
                portName: '',
                originalcountryId: 0,
              });
            } else if (response.status == 500) {
              message.warning(response.message);
              return;
            }
          });
        }
      }
    });
  };

  //组件取消操作
  modalCancel = (e: any) => {
    this.setState({
      modalVisible: false,
      guid: 0,
      countryName: '',
      portName: '',
    });
  };

  //从一条记录中获取uid
  getGuid = (record: portModel) => {
    return !isNil(record.guid) ? record.guid : '';
  };

  //分页
  handlerChange = (page: number) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.initData();
      },
    );
  };

  handleSelectCountryName = (guid: any, option: any) => {
    this.setState({
      countryName: option.props.children,
      countryId: guid,
    });
  };

  handleSelectPortName = (guid: any, option: any) => {
    this.setState({
      portName: option.props.children,
      portId: guid,
    });
  };

  serachPort = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  serachContry = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  //渲染页面组件
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        {/* 主页组件 */}
        <div className={commonCss.container}>
          <LabelTitleComponent text="港口信息维护" displayNone={true} event={() => {}} />
          <div>
            <div className={commonCss.searchRow}>
              <Row gutter={24}>
                <Col span={24}>
                  <InputGroup compact>
                    <Input
                      style={{ width: '45%' }}
                      placeholder="请输入国家搜索内容"
                      onChange={e => this.setState({ searchCountry: e.target.value })}
                      onKeyUp={this.keyUp}
                    />
                    <Input
                      style={{ width: '45%' }}
                      placeholder="请输入港口搜索内容"
                      onChange={e => this.setState({ portName: e.target.value })}
                      onKeyUp={this.keyUp}
                    />
                    <QueryButton
                      disabled={false}
                      type="Query"
                      text="搜索"
                      event={this.search.bind(this)}
                    />
                    <QueryButton disabled={false} type="Add" text="" event={this.handAddPort} />
                  </InputGroup>
                </Col>
              </Row>
            </div>
          </div>
          {/* 列表框 */}
          <div className={commonCss.table}>
            <Table
              rowKey={record => this.getGuid(record)}
              bordered
              columns={this.state.columns}
              dataSource={data_Source}
              size="small"
              rowClassName={(record, index) =>
                index % 2 == 0 ? commonCss.dataRowOdd : commonCss.dataRowEven
              }
              pagination={{
                current: this.state.currentPage,
                showQuickJumper: true,
                pageSize: pageSize,
                onChange: this.handlerChange,
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
        </div>

        {/* 弹出组件 */}
        <Modal
          visible={this.state.modalVisible}
          onOk={this.modalOk}
          onCancel={this.modalCancel}
          // 关闭时销毁 Modal 里的子元素
          destroyOnClose={true}
          // 点击蒙层是否允许关闭
          maskClosable={false}
          // 是否显示右上角的关闭按钮
          closable={false}
          // 垂直居中展示 Modal
          centered={true}
          okText={'保存'}
        >
          <LabelTitleComponent
            text={this.state.modalTitle}
            event={() => {
              this.setState({ modalVisible: false });
            }}
          />
          <div className={commonCss.AddForm}>
            <Form {...formItemLayout}>
              {/* 下拉栏 */}
              <Form.Item label="国家:" required>
                {getFieldDecorator('countryName', {
                  initialValue:
                    isNil(this.state) || isNil(this.state.countryName)
                      ? ''
                      : this.state.countryName,
                  rules: [
                    {
                      required: true,
                      message: '国家不能为空!',
                    },
                  ],
                })(
                  <Select
                    showSearch
                    value={this.state.countryName}
                    onSelect={this.handleSelectCountryName}
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    filterOption={this.serachContry}
                  >
                    {getDictDetail('country').map((item: any) => (
                      <option value={item.code}>{item.textValue}</option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="港口:" required>
                {getFieldDecorator('portName', {
                  initialValue:
                    isNil(this.state) || isNil(this.state.portName) ? '' : this.state.portName,
                  rules: [
                    {
                      required: true,
                      message: '港口不能为空!',
                    },
                  ],
                })(
                  <Select
                    showSearch
                    value={this.state.portName}
                    onSelect={this.handleSelectPortName}
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    filterOption={this.serachPort}
                  >
                    {getDictDetail('port').map((item: any) => (
                      <option value={item.code}>{item.textValue}</option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

const Port_Form = Form.create({ name: 'port_Form' })(PortForm);

export default Port_Form;
