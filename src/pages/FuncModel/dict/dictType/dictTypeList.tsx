import getRequest, { postRequest } from '@/utils/request';
import { Col, Form, Input, message, Modal, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import { dictTypeModel } from './dictTypeModel';
import { FormComponentProps } from 'antd/lib/form';
import { DictTypeFormProps } from './DictTypeFormInterface';
import moment from 'moment';
const InputGroup = Input.Group;
const data_Source: dictTypeModel[] = []; //一览页面数组列表
const pageSize = 10;//每页记录数,默认设置10
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

interface DictTypeAddFormProps extends FormComponentProps {
  //列
  columns: ColumnProps<dictTypeModel>[];
  //表数据
  dataSource: dictTypeModel[];
  searchName: String;
  title: string;
  pageSize: number;
  currentPage: number;
  total: number;
  modalTitle: string;
  modalVisible: boolean;
  name: string;
  guid: number;
  type: number;
  searchStatus: boolean;
}

class DictTypeForm extends React.Component<DictTypeFormProps, DictTypeAddFormProps> {

  //填充行
  private columns: ColumnProps<dictTypeModel>[] = [
    {
      title: '序号',
      dataIndex: 'dictTypeIndex',
      align: 'center',
    },
    {
      title: '字典类型名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: number) => (
        <span>
          <QueryButton
            disabled={false}
            text="查看"
            type="View"
            event={() => this.handleView(guid)}
          />
        </span>
      ),
    },
  ];
  constructor(props: DictTypeFormProps) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      columns: this.columns,
      type: 1, //使用场景类型
      guid: 0, //guid
      name: '', //单个字典名
      searchName: '', //搜索栏字典名,
      total: 0, //总页数
      currentPage: 1, //当前页数
      modalVisible: false, //modal组件显示
      modalTitle: '',//modal组件标题
      searchStatus: false,//搜索状态
    });
  }

  //钩子函数
  componentDidMount() {
    this.initData();
  }

  //初始化数据
  initData() {
    this.getDictTypeList();
  }

  
//键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.search();
    }
  }

  //填充list列表
  getDictTypeList() {
    let param: Map<string, any> = new Map();
    param.set('type', '1');
    param.set('currentPage', this.state.currentPage);
    param.set('pageSize', pageSize);
    param.set('date',moment());
    if (!isNil(this.state.searchName) && this.state.searchName != '' && this.state.searchStatus) {
      param.set('name', this.state.searchName);
    } else {
      this.setState({
        searchStatus: false
      });
    }
    getRequest('/sys/dictType', param, (response: any) => {
      if (response.status == 200) {
        data_Source.length = 0;
        if (!isNil(response.data)) {
          forEach(response.data.dictTypes, (dictType, index) => {
            data_Source.push({
              dictTypeIndex: `${index + (this.state.currentPage - 1) * pageSize + 1}`,
              name: dictType.name,
              createUser: dictType.createUser,
              createDate: moment(Number(dictType.createDate)).format('YYYY/MM/DD'),
              guid: dictType.guid,
              updateDate: moment(Number(dictType.updateDate)).format('YYYY/MM/DD'),
              updateUser: dictType.User,
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
    this.setState({
      currentPage: 1,
      searchStatus: true,
    }, () => {
      this.initData();
    });
  }

  //添加按钮
  handAddDictType = () => {
    this.setState({
      modalTitle: '新增',
      modalVisible: true,
    });
  };



  //查看按钮操作
  handleView = (guid: number) => {
    this.props.history.push('/dicttype/view/' + guid);
  };

  //modal组件确定操作
  modalOk = () => {
    this.props.form.validateFields((err: any) => {
      if (!err) {
        if (this.state.guid === 0) {
          let requestParam: any = {
            type: '1',
            name: this.state.name,
          };
          postRequest('/sys/dictType', JSON.stringify(requestParam), (response: any) => {
            if (response.status == 200) {
              message.success('添加成功');
              this.initData();
              this.setState({
                modalVisible: false,
                name: '',
              });
              let params: Map<string, string> = new Map();
              params.set('type', '1');
              // 缓存获取字典一览
              getRequest('/sys/dict/all', params, (response: any) => {
                if (response.status === 200) {
                  localStorage.setItem('dictData', JSON.stringify(response.data));
                }
              });
            } else if (response.status == 500) {
              message.warning(response.message);
              return;
            }
          });
        }
      }
    })
  };

  //modal组件取消操作
  modalCancel = () => {
    this.setState({
      modalVisible: false,
      name: '',
      guid: 0,
    });
  };

  onBack = () => {
    this.initData();
  };

  //关闭Modal跳转一览页面
  closeModal = () => {
    this.onBack();
  };

  //从一条记录中获取uid
  getGuid = (record: any) => {
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

  //渲染页面组件
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        {/* 主页组件 */}
        <div className={commonCss.container}>
          <LabelTitleComponent
            displayNone={true}
            text="字典类型" event={() => { }} />
          <div className={commonCss.searchRow}>
            <Row gutter={24}>
              <Col span={24}>
                <InputGroup compact>
                  <Input
                    style={{ width: '90%' }}
                    placeholder="请输入搜索内容"
                    onChange={e => this.setState({ searchName: e.target.value })}
                    onKeyUp={this.keyUp}
                  />
                  <QueryButton
                    disabled={false}
                    type="Query"
                    text="搜索"
                    event={this.search.bind(this)}
                  />
                  <QueryButton disabled={false} type="Add" text="" event={this.handAddDictType} />
                </InputGroup>
              </Col>
            </Row>
          </div>

          {/* 列表框 */}
          <div className={commonCss.table}>
            <Table
              rowKey={record => this.getGuid(record)}
              bordered
              columns={isNil(this.state) || isNil(this.state.columns) ? [] : this.state.columns}
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

        {/* modal弹出组件 */}
        <Modal
          visible={this.state.modalVisible}
          onOk={this.modalOk}
          onCancel={this.modalCancel}
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
          width={'500px'}
          okText='确认'
        >
          <LabelTitleComponent
            text={this.state.modalTitle}
            event={() => { this.setState({ modalVisible: false }) }}
          />
          <div className={commonCss.AddForm}>
            <Form {...formItemLayout}>
              <Form.Item label="字典类型名称:" required>
                {getFieldDecorator('name', {
                  initialValue:
                    isNil(this.state) || isNil(this.state.name)
                      ? ''
                      : this.state.name,
                  rules: [
                    {
                      required: true,
                      message: '字典类型名称不能为空!',
                    },
                    {
                      max: 50,
                      message: '字典类型长度不能超过50!',
                    },
                  ],
                })(
                  <Input
                    maxLength={50}
                    placeholder={'请输入字典类型名称'}
                    onChange={e => this.setState({ name: e.target.value })}
                  />,
                )}
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

const DictTypeList_Form = Form.create({ name: 'dictTypeList_Form' })(DictTypeForm);

export default DictTypeList_Form;
