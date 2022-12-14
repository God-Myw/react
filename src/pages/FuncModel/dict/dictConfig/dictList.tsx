import getRequest, {postRequest, putRequest} from '@/utils/request';
import {items} from '@/utils/utils';
import {Col, Form, Input, message, Modal, Row, Select, Table} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import {forEach, isNil} from 'lodash';
import React from 'react';
import QueryButton from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import {dictModel} from './dictModel';
import {FormComponentProps} from 'antd/lib/form';
import {DictConfigFormProps} from './DictConfigFormInterface';
import moment from 'moment';

const InputGroup = Input.Group;
const data_Source: dictModel[] = []; //列表数组
const pageSize = 10; //每页记录数,默认设置10
const dictTypeoptions:items[]=[];//dict数组
const formItemLayout = {
  labelCol: {
    md: {span: 6},
    lg: {span: 6},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};

interface DictConfigAddFormProps extends FormComponentProps {
  //列
  columns: ColumnProps<dictModel>[];
  //表数据
  dataSource: dictModel[];
  searchDictTypeId: number;
  searchTitleCn: String;
  searchTitleEn: String;
  title: string;
  pageSize: number;
  currentPage: number;
  total: number;
  modalTitle: string;
  modalVisible: boolean;
  isNew : boolean;
  name: string;
  guid: number;
  titleCn: string;
  titleEn: string;
  modaldictTypeId: number;
  dictTypeId: string;
  type: number;
  searchStatus: boolean;
  selectOptions:items[]
}

class DictConfigForm extends React.Component<DictConfigFormProps, DictConfigAddFormProps> {
  private columns: ColumnProps<dictModel>[] = [
    {
      title: '序号',
      dataIndex: 'dictIndex',
      align: 'center',
    },
    {
      title: '字典类型',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '字典名称(中)',
      dataIndex: 'titleCn',
      align: 'center',
    },
    {
      title: '字典名称(英)',
      dataIndex: 'titleEn',
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
            text="查看"
            type="View"
            event={() => this.handleView(guid, record)}
          />
        </span>
      ),
    },
  ];

  constructor(props: DictConfigFormProps) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      columns: this.columns,
      searchTitleCn: '', //搜索栏字典中文名
      searchTitleEn: '', //搜索栏字典英文名
      modalVisible: false, //modal组件显示
      isNew:false,
      modalTitle: '', //modal组件标题
      guid: 0,
      name: '', //字典名
      titleCn: '', //字典中文名
      titleEn: '', //字典英文名
      total: 0, //总件数
      currentPage: 1, //当前页数
      dictTypeId: '',//字典类型id
      type: 1,
      searchStatus: false,//搜索状态
      selectOptions:[]
    });
    this.getDictTypeList();
  }

  //钩子函数
  componentDidMount() {
    this.initData();
  }

  //初始化数据
  initData() {
    this.getDictList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getDictList();
   }
  }

  //填充list列表
  getDictList() {
    let param: Map<string, any> = new Map();
    param.set('type', '1');
    param.set('currentPage', this.state.currentPage);
    param.set('pageSize', pageSize);
    param.set('date',moment());
    //判断字典类型
    let searchType=false;//搜索状态
    if (this.state.searchStatus) {
      if (!isNil(this.state.searchDictTypeId) && this.state.searchDictTypeId != 0) {
        searchType=true;
        param.set('parentId', this.state.searchDictTypeId);
      }
      if (!isNil(this.state.searchTitleCn) && this.state.searchTitleCn != '') {
        searchType=true;
        param.set('titleCn', this.state.searchTitleCn);
      }
      if (!isNil(this.state.searchTitleEn) && this.state.searchTitleEn != '') {
        searchType=true;
        param.set('titleEn', this.state.searchTitleEn);
      }
    }
    if(!searchType){
      this.setState({
        searchStatus:false
      })
    }
    getRequest('/sys/dict', param, (response: any) => {
      console.log(response)
      if (response.status == 200) {
        if (!isNil(response.data)) {
          data_Source.length = 0;
          forEach(response.data.dictList, (dict, index) => {
            data_Source.push({
              dictIndex: `${index + (this.state.currentPage - 1) * pageSize + 1}`,
              name: dict.name,
              titleCn: dict.titleCn,
              titleEn: dict.titleEn,
              guid: dict.guid,
              parentId: dict.parentId,

            });
          });
        }
      }
      this.setState({
        total: response.data.total,
        currentPage: response.data.currentPage,
      });
    });
  }

  //查找所有字典类型,此处调用api,用于下拉栏
  getDictTypeList() {
    let param: Map<string, any> = new Map();
    param.set('type', '1');
    getRequest('/sys/dict/all', param, (response: any) => {
      dictTypeoptions.length=0;
      if (response.status == 200) {
        forEach(response.data.en, (item: any,) => {
          let s: items = {
            code: item.guid,
            textValue: item.name
          };
          dictTypeoptions.push(s);
        });
        this.setState({
          selectOptions:dictTypeoptions
        })
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
  handAdddict = () => {
    this.setState({
      guid: 0,
      isNew:true,
      modalVisible: true,
      modalTitle: '新增',
    });
  };

  //编辑按钮
  handleEdit = (guid: any, record: any) => {
    this.setState({
      modalTitle: '修改',
      isNew:false,
      guid: guid,
      modalVisible: true,
      name: record.name,
      titleCn: record.titleCn,
      titleEn: record.titleEn,
      modaldictTypeId: record.parentId,
    });
  };

  //查看按钮操作
  handleView = (guid: any, record: any) => {
    this.props.history.push('/dictconfig/view/' + guid + '/' + record.parentId);
  };


  //modal组件确定操作
  modalOk = () => {
    this.props.form.validateFields((err: any) => {
      if (!err) {
        //判断编辑还是修改
        if (this.state.guid == 0) {
          let requestParam: any = {
            type: '1',
            parentId: this.state.modaldictTypeId,
            titleCn: this.state.titleCn,
            titleEn: this.state.titleEn,
            remark: '',
          };
          postRequest('/sys/dict', JSON.stringify(requestParam), (response: any) => {
            if (response.status == 200) {
              message.success('添加成功');
              this.initData();
              this.setState({
                modalVisible: false,
                name: '',
                titleCn: '',
                titleEn: '',
                guid: 0,
              });
              let params: Map<string, string> = new Map();
              params.set('type', '1');
              // 缓存获取字典一览
              getRequest('/sys/dict/all', params, (response: any) => {
                if (response.status === 200) {
                  localStorage.setItem('dictData', JSON.stringify(response.data));
                }
              });
            }else if(response.status==500){
              message.warning(response.message);
             return;
            }
          });
        } else {
          let param = {
            type: '1',
            guid: this.state.guid,
            titleCn: this.state.titleCn,
            titleEn: this.state.titleEn,
            remark: '',
            parentId: this.state.modaldictTypeId,
          };
          // if (this.state.modaldictTypeId != 0 && this.state.name != '') {
          //   requestParam['parentId'] = this.state.modaldictTypeId;
          // }
          putRequest('/sys/dict', JSON.stringify(param), (response: any) => {
            if (response.status == 200) {
              message.success('修改成功');
              this.setState({
                modalVisible: false,
                name: '',
                titleCn: '',
                titleEn: '',
                guid: 0,
              });
              this.initData();
              let params: Map<string, string> = new Map();
              params.set('type', '1');
              // 缓存获取字典一览
              getRequest('/sys/dict/all', params, (response: any) => {
                if (response.status === 200) {
                  localStorage.setItem('dictData', JSON.stringify(response.data));
                }
              });
            }else if(response.status == 500){
              message.warning(response.message);
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
      titleCn: '',
      titleEn: '',
      guid: 0,
    });
  };

  //从一条记录中获取uid
  getGuid = (record: dictModel) => {
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

  //select框change方法
  handleSelect = (guid: any, option: any) => {
    this.setState({
      modaldictTypeId: guid,
      name: option.props.children,
    });
  };

  //渲染页面组件
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        {/* 主页组件 */}
        <div className={commonCss.container}>
          <LabelTitleComponent text="字典配置" displayNone={true} event={() => {
          }}/>
          <div>
            <div className={commonCss.searchRow}>
              <Row gutter={24}>
                <Col span={24}>
                  <InputGroup compact>
                    {/* 下拉栏 */}
                    <Select
                      allowClear={true}
                      style={{width: '20%'}}
                      placeholder="字典类型选择"
                      onChange={(id: any) => this.setState({searchDictTypeId: id})}
                    >
                      {this.state.selectOptions.map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>
                    <Input
                      style={{width: '35%'}}
                      placeholder="请输入字典名称(中)搜索"
                      onChange={e => this.setState({searchTitleCn: e.target.value})}
                      maxLength={50}
                      onKeyUp={this.keyUp}
                    />
                    <Input
                      style={{width: '35%'}}
                      placeholder="请输入字典名称(英)搜索"
                      onChange={e => this.setState({searchTitleEn: e.target.value})}
                      maxLength={50}
                      onKeyUp={this.keyUp}
                    />
                    <QueryButton
                      disabled={false}
                      type="Query"
                      text="搜索"
                      event={this.search.bind(this)}
                    />
                    <QueryButton disabled={false} type="Add" text="" event={this.handAdddict}/>
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
          centered={true}
          // 关闭时销毁 Modal 里的子元素
          destroyOnClose={true}
          // 点击蒙层是否允许关闭
          maskClosable={false}
          // 是否显示右上角的关闭按钮
          closable={false}
          okText='确认'
        >
            <LabelTitleComponent
              text={this.state.modalTitle}
              event={() => {this.setState({modalVisible:false})}}
            />
          <div className={commonCss.AddForm}>
          <Form {...formItemLayout}>
            {/* 下拉栏 */}
            <Form.Item label="字典类型:" required>
              {getFieldDecorator('name', {
                initialValue:
                  isNil(this.state) || isNil(this.state.name)
                    ? ''
                    : this.state.name,
                rules: [
                  {
                    required: true,
                    message: '字典类型不能为空!',
                  },

                ],
              })(
                <Select
                  disabled={!this.state.isNew}
                  value={this.state.name}
                  style={{width: '100%'}}
                  onSelect={this.handleSelect}
                >
                  {dictTypeoptions.map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="字典名称(中):" required>
              {getFieldDecorator('titleCn', {
                initialValue:
                  isNil(this.state) || isNil(this.state.titleCn)
                    ? ''
                    : this.state.titleCn,
                rules: [
                  {
                    required: true,
                    message: '字典中文不能为空!',
                  },
                  {
                    max:50,
                    message: '字典中文长度不能超过50!',
                  },
                ],
              })(
                <Input
                maxLength={50}
                  value={isNil(this.state) || isNil(this.state.titleCn) ? '' : this.state.titleCn}
                  onChange={e => this.setState({titleCn: e.target.value})}
                />
              )}
            </Form.Item>
            <Form.Item label="字典名称(英):" required>
              {getFieldDecorator('titleEn', {
                initialValue:
                  isNil(this.state) || isNil(this.state.titleEn)
                    ? ''
                    : this.state.titleEn,
                rules: [
                  {
                    required: true,
                    message: '字典英文不能为空!',
                  },
                  {
                    max:50,
                    message: '字典英文长度不能超过50!',
                  },
                ],
              })(
                <Input
                  value={isNil(this.state) || isNil(this.state.titleEn) ? '' : this.state.titleEn}
                  onChange={e => this.setState({titleEn: e.target.value})}
                  maxLength={50}
                />
              )}
            </Form.Item>
          </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

const DictConfig_Form = Form.create({name: 'dictConfig_Form'})(DictConfigForm);

export default DictConfig_Form;

