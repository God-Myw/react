import { getRequest, postRequest, deleteRequest, putRequest } from '@/utils/request';
import { Col, Form, Input, Row, Select, Table, Modal, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import { customerModel } from './customerModel';
import { getDictDetail } from '@/utils/utils';
import { FormComponentProps } from 'antd/lib/form';
import { CustomerFormProps } from './customerFormInterface';
import { formatMessage } from "umi-plugin-react/locale";
import moment from 'moment';
//import e from 'express';
const { confirm } = Modal;
const InputGroup = Input.Group;
const pageSize = 10; //每页记录数,默认设置10
let countryPorts: any[] = []//港口数据
const data_Source: customerModel[] = [];

interface CustomerAddFormProps extends FormComponentProps {
  //列
  columns: ColumnProps<customerModel>[];
  //表数据
  dataSource: customerModel[];
  selectaccountId: string;
  selectuserType: string;
  accountId: string;//工号
  userType: any;//角色
  firstName: string;//姓
  lastName: string;//名
  //belongPort: string;//所在港口
  //  phone: '',//手机号码
  passWord: string;//密码
  status: any;//状态
  guid: number;
  total: number; //总页数
  currentPage: number; //当前页数
  modalVisible: boolean; //modal组件显示
  modalTitle: string; //modal组件标题
  value: string;//数据回显
  portSelectDisabled: boolean; //港口选择框
  phoneCode: string; //手机Code
  phoneNumber: string; //手机号段,
  portflag: boolean;
  type: number;
  country: string; //当前选择编辑的国家名
  portName: string, //当前选择编辑的港口名
  portId: number, //当前选择编辑的港口id
  portList: any,//港口列表
  portNameList: any,//港口列表
  portIdList: any,//港口列表
  countryPorts: any,
  belongPort: any;//所在港口
  showPortName: any;
}

//页面列表组件
class CustomerListForm extends React.Component<CustomerFormProps, CustomerAddFormProps> {
  private columns: ColumnProps<customerModel>[] = [
    {
      title: '工号',
      dataIndex: 'accountId',
      align: 'center',
    },
    {
      title: '角色',
      dataIndex: 'userType',
      align: 'center',
    },
    {
      title: '姓',
      dataIndex: 'firstName',
      align: 'center',
    },
    {
      title: '名',
      dataIndex: 'lastName',
      align: 'center',
    },
    {
      title: '所在港口',
      dataIndex: 'showPortName',
      align: 'center',
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: '密码',
      dataIndex: 'passWord',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '20%',
      render: (guid: any, record: any) => (
        <span>
          <QueryButton text="重置密码" type="View" event={() => this.handleResetPassword(guid, record)}
          />
          &nbsp;
          <QueryButton text="修改" type="Edit" event={() => this.handleEdit(guid, record)} />
          &nbsp;
          <QueryButton text="删除" type="Delete" event={() => this.handleDelete(guid, record)} />
        </span>
      ),
    }
  ];

  constructor(props: CustomerFormProps) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      type: 1,
      columns: this.columns,
      dataSource: data_Source,
      selectaccountId: '',//搜素工号
      selectuserType: '',//搜素角色
      accountId: '',//工号
      userType: '',//角色
      firstName: '',//姓
      lastName: '',//名
      // belongPort: '',//所在港口
      //  phone: '',//手机号码
      passWord: '',//密码
      status: '',//状态
      guid: 0,
      total: 0, //总页数
      currentPage: 1, //当前页数
      modalVisible: false, //modal组件显示
      modalTitle: '', //modal组件标题
      value: '',//数据回显
      portSelectDisabled: false,//港口选择框
      phoneCode: '',//手机Code
      phoneNumber: '',//手机号段,
      portflag: false,
      country: '', //当前选择编辑的国家名
      portName: '', //当前选择编辑的港口名
      portId: -1, //当前选择编辑的港口id
      portList: [],//港口列表
      portNameList: [],//港口名称列表
      portIdList: [],//港口名称列表
      countryPorts: [],
      belongPort: [],//所在港口
      showPortName: '',
    });
  }

  componentDidMount() {
    this.initData();
  }

  //初始化数据
  initData() {
    this.getcustomerList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getcustomerList();
   }
  }

  //获取列表数据
  getcustomerList() {
    //清空data_Source，方式循环调用，多次push

    //调用mock
    let param: Map<string, any> = new Map();
    param.set('type', '1');
    param.set('pageSize', pageSize);
    param.set('currentPage', this.state.currentPage);
    param.set('data', moment());
    //设置检索条件
    if (!isNil(this.state.selectaccountId) && this.state.selectaccountId != '') {
      param.set('accountId', this.state.selectaccountId);
    }
    if (!isNil(this.state.selectuserType) && this.state.selectuserType != '') {
      param.set('userType', this.state.selectuserType);
    }
    getRequest('/sys/user/service', param, (response: any) => {
      if (response.status == 200) {
        if (!isNil(response.data)) {
          data_Source.length = 0;
          //循环赋值给table数据对象data_Source
          forEach(response.data.users, (user, index) => {
            let user_type = '';
            if (user.userType == 1) {
              user_type = '跟踪客服'
            } else if (user.userType == 2) {
              user_type = '线下客服'
            } else if (user.userType == 3) {
              user_type = '审核客服'
            } else {
              user_type = '其他角色'
            }
            let portIdList: any[] = [];
            let portNameList: any[] = [];
            forEach(user.ports, (port, index) => {
              portIdList.push(port.portId);
              portNameList.push(port.portName);
            });
            data_Source.push({
              accountId: user.accountId,
              userType: user_type,
              firstName: user.firstName,
              lastName: user.lastName,
              phoneCode: user.phoneCode,
              phoneNumber: user.phoneNumber,
              passWord: user.password,
              status: user.status == 1 ? '启用' : '冻结',
              guid: user.guid,
              portIdList: portIdList,
              portNameList: portNameList,
              showPortName: portNameList.toString(),
            });
          });
          this.setState({
            total: response.data.total,
            dataSource: data_Source,
          });
        }

      } else if (response.status == 500) {
        message.error(response.message);
      }
    });
  }

  change = (value: any) => {
    if (value === 2) {
      this.getAllCountryPortByUser();
      this.setState({
        userType: value,
        portflag: true,
      }, () => {
        this.selectCountry(0);
      })
    } else {
      this.setState({
        userType: value,
        portflag: false,
        portIdList: [],
      })
    }
  };

  //搜索操作
  search() {
    this.setState({
      currentPage: 1,
    }, () => {
      this.initData();
    });
  }

  onBack = () => {
    this.props.history.push('/customerManage');
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

  //下拉值
  handleChange = (value: any) => {
    this.setState({
      selectuserType: value,
    });
  };


  //检查密码是否为空,新增检查..修改不检查
  checkPsd(rule: any, value: any, callback: any) {
    if ((this.state.guid == 0) && (value == '' || isNil(value))) {
      callback(
        new Error(formatMessage({ id: '密码不能为空!' })),
      );
    } else {
      callback();
    }
  }

  CheckPassWord = (name: string, password: any, callback: any) => {
    var str = password;
    var reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/);
    if ((this.state.guid == 0) && (str == '' || isNil(str))) {
      if (!isNil(str) && str !== '' && str.length < 8) {
        callback(formatMessage({ id: 'user-login.login.pls-input-length-check', }));
      } else if (!reg.test(str)) {
        callback(formatMessage({ id: 'user-login.login.pls-input-input-check', }));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  //添加按钮
  handAddcustomer = () => {
    this.setState({
      guid: 0,
      value: '',
      modalTitle: '新增',
      modalVisible: true,
      portflag: false,
      accountId: '',
      userType: '',
      firstName: '',
      lastName: '',
      belongPort: '',
      phoneNumber: '',
      phoneCode: '+86',
      passWord: '',
      status: '',
      country: '', //当前选择编辑的国家名
      portName: '', //当前选择编辑的港口名
      portId: -1, //当前选择编辑的港口id
      portList: [],//港口列表
      portIdList: [],
      portNameList: [],
    });
  };

  //修改按钮
  handleEdit = (guid: number, record: any) => {
    let user_type = -1;
    if (record.userType == '跟踪客服') {
      user_type = 1
    } else if (record.userType == '线下客服') {
      user_type = 2
    } else if (record.userType == '审核客服') {
      user_type = 3
    }
    this.getAllCountryPortByUser(guid);
    this.setState({
      guid: guid,
      accountId: record.accountId,
      userType: user_type,
      firstName: record.firstName,
      lastName: record.lastName,
      phoneNumber: record.phoneNumber,
      phoneCode: record.phoneCode,
      passWord: '',
      status: record.status,
      modalTitle: '修改',
      modalVisible: true,
      portflag: user_type == 2 ? true : false,
      portIdList: record.portIdList,
      portNameList: record.portNameList,
    });
  };

  //重置密码按钮操作
  handleResetPassword = (guid: any, record: any) => {
    const get = this;
    confirm({
      title:
        '确认更改工号' +
        record.accountId +
        ',' +
        record.userType +
        ',' +
        record.firstName +
        record.lastName +
        '的密码吗？',
      cancelText: '取消',
      okText: '确认',
      okType: 'danger',
      onOk() {
        let requestParam: any = {
          type: 2,
          guid: record.guid,
        };
        putRequest('/sys/user', JSON.stringify(requestParam), (response: any) => {
          if (response.status == 200) {
            message.success('重置密码成功');
            get.getcustomerList();
          } else if (response.status == 500) {
            message.error(response.message);
          }
        });
      },
    });
  };

  //删除按钮操作
  handleDelete = (guid: any, record: any) => {
    const get = this;
    confirm({
      title: '是否对 工号:' + record.accountId + ' 角色:' + record.userType +
        ' 姓:' + record.firstName + ' 名:' + record.lastName + ' 的信息进行删除？',
      cancelText: '取消',
      okText: '确认',
      okType: 'danger',
      onOk() {
        let requestParam: Map<string, string> = new Map();
        requestParam.set('type', '1'),
          deleteRequest('/sys/user/' + guid, requestParam, (response: any) => {
            if (response.status == 200) {
              message.success('删除成功!', 2);
              //刷新数据
              get.getcustomerList();
            } else if (response.status == 500) {
              message.warning(response.message);
            }
          });
      },
      // //取消操作
      // onCancel() { },
    });
  };

  //modal组件确定操作
  modalOk = (e: any) => {
    const get = this;
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        //新增
        if (this.state.guid === 0) {
          let requestData: any = {
            accountId: values.addAccountId,
            belongPort: values.belongPort,
            firstName: values.firstName,
            lastName: values.lastName,
            password: this.state.passWord,
            // status: values.status == '启用' ? 1 : 0,
            status: values.status,
            userType: this.state.userType,
            phoneCode: this.state.phoneCode,
            phoneNumber: values.phoneNumber,
            // countryName: values.coun, //当前选择编辑的国家名
            // countryId: -1, //当前选择编辑的国家id
            // portName: '', //当前选择编辑的港口名
            // portId: -1, //当前选择编辑的港口id
            // portList: [],//港口列表
          };
          if (values.belongPort != '') {
            if (this.state.userType == 2) {
              requestData['belongPort'] = values.belongPort;
              requestData['portIds'] = this.state.portIdList;
            } else {
              requestData['belongPort'] = '';
            }
          }

          // 新增保存请求
          postRequest('/sys/user/', JSON.stringify(requestData), (response: any) => {
            if (response.status == 200) {
              message.success('添加成功');
              this.initData();
              this.setState({
                guid: 0,
                modalVisible: false,
              });
            } else if (response.status == 500) {
              message.warning(response.message);
            }
          });
        } else {
          let requestParam: any = {
            guid: this.state.guid,
            firstName: values.firstName,
            lastName: values.lastName,
            userType: this.state.userType,
            phoneCode: this.state.phoneCode,
            phoneNumber: values.phoneNumber,
            type: this.state.type,
          };
          let regex = /^[0-9]*$/;
          // if (regex.test(values.belongPort)) {
          if (this.state.userType == 2) {
            requestParam['belongPort'] = values.belongPort;
            requestParam['portIds'] = this.state.portIdList;
          } else {
            requestParam['belongPort'] = '';
          }
          // } else {
          //   if (this.state.userType != 2) {
          //     requestParam['belongPort'] = '';
          //   }
          // }

          if (values.password != '' && !isNil(values.password)) {
            requestParam['password'] = values.password;
          }
          if (regex.test(values.status)) {
            requestParam['status'] = values.status;
          }

          putRequest('/sys/user', JSON.stringify(requestParam), (response: any) => {
            if (response.status == 200) {
              message.success('修改成功');
              this.initData();
              this.setState({
                guid: 0,
                modalVisible: false,
              });
              get.getcustomerList();
            } else if (response.status == 500) {
              message.error(response.message);
            }
          });
        }
      }
    });
  };

  //modal组件取消操作
  modalCancel = (e: any) => {
    this.setState({
      modalVisible: false,
    });
  };

  //角色管理选择控制港口输入框属性
  chooseRole = (value: any) => {
    if (value == 1 || value == 2) {
      this.setState({
        userType: value,
        portSelectDisabled: true
      })
    } else {
      this.setState({
        userType: value,
        portSelectDisabled: false

      })
    }
  };

  //check账号
  CheckAccountId = (name: string, password: any, callback: any) => {
    var str = password;
    var reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/);
    if (!isNil(str) && str !== '' && str.length < 8) {
      callback(formatMessage({ id: 'user-login.login.account-input-length-check', }));
    } else if (!reg.test(str)) {
      callback(formatMessage({ id: 'user-login.login.account-input-input-check', }));
    } else {
      callback();
    }
  };

  serach = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  selectPort = (value: any, option: any) => {
    // message.info(value + option.props.children);
    let idList = this.state.portIdList;
    let nameList = this.state.portNameList;
    idList.push(value);
    nameList.push(option.props.children);
    this.setState({
      portIdList: idList,
      portNameList: nameList,
    })
  }

  deselectPort = (value: any, option: any) => {
    // message.info(value + option.props.children);
    let idList = this.state.portIdList.filter((item: any) => item !== value);
    let nameList = this.state.portNameList.filter((item: any) => item !== option.props.children);;
    this.setState({
      portIdList: idList,
      portNameList: nameList,
    })
  }

  //号段选择框
  selectPhoneCode = (id: any, option: any) => {
    this.setState({
      phoneCode: id,
    });
    focus();
  };

  //国家选择框
  selectCountry = (id: any) => {
    this.setState({
      country: id,
      countryPorts:countryPorts,
    });
    let selectIds: any[] = [];
    if(!isNil(this.state)){
      this.state.countryPorts.forEach((countryPort: any) => {
        if (countryPort['countryCode'] == id) {
          let canSelectPort: any[] = [];
          if (countryPort['items'].length > 0) {
            countryPort['items'].forEach((item: any) => {
              if (item.canSelectedPort || item.userSelectedPort) {
                canSelectPort.push(item);
              }
            });
          };
          this.setState({
            portList: canSelectPort,
          },()=>{
            this.state.portIdList.forEach((portId: any) => {
              this.state.portList.forEach((port: any) => {
                if (portId === port.portCode) {
                  selectIds.push(port.portCode);
                }
              })
            });
            this.props.form.setFieldsValue({ 'port': selectIds });
          });
        }
      });
    }
  };

  // getAllCountryPort() {
  //   let param: Map<string, any> = new Map();
  //   param.set('type', '1');
  //   getRequest('/sys/port/all', param, (response: any) => {
  //     if (response.status == 200) {
  //       response.data['zh'].forEach((ele: any) => {
  //         countryPorts.push(ele);
  //       })
  //     }
  //   });
  // }

  getAllCountryPortByUser(userId?:any) {
    countryPorts = [];
    let param: Map<string, any> = new Map();
    param.set('type', '2');
    if(!isNil(userId)){
      param.set('userId', userId);
    }
    getRequest('/sys/port/all', param, (response: any) => {
      if (response.status == 200) {
        response.data['zh'].forEach((ele: any) => {
          countryPorts.push(ele);
        });
        if(countryPorts.length>0){
          this.selectCountry(0);
        }
      }
    });
  }

  serachCountry = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  serachPort = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  // 渲染
  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const rowFormlayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: isNil(this.state) || isNil(this.state.phoneCode) ? '+86' : this.state.phoneCode,
    })(
      <Select
        showSearch
        optionFilterProp="children"
        onSelect={this.selectPhoneCode}
        filterOption={this.serach}
        style={{ minWidth: '80px' }}
      >
        {getDictDetail("phone_code").map((item: any) => (
          <Select.Option value={item.textValue}>{item.textValue}</Select.Option>
        ))}
      </Select>,
    );
    return (
      <div>
        <div className={commonCss.container}>
          <LabelTitleComponent text="客服管理" displayNone={true} event={() => {
          }} />
          <div className={commonCss.searchRow}>
            <Row gutter={24}>
              <Col span={24}>
                <InputGroup compact>
                  <Select
                    allowClear={true}
                    style={{ width: '15%' }}
                    placeholder="客服类型选择"
                    onChange={this.handleChange}
                  >
                    <option value={1}>跟踪客服</option>
                    <option value={2}>线下客服</option>
                    <option value={3}>审核客服</option>
                  </Select>
                  <Input
                    style={{ width: '75%' }}
                    placeholder="请输入员工工号搜索"
                    onChange={e => this.setState({ selectaccountId: e.target.value })}
                    onKeyUp={this.keyUp}
                  />
                  <QueryButton type="Query" text="搜索" event={this.search.bind(this)} />
                  <QueryButton type="Add" text="" event={this.handAddcustomer} />
                </InputGroup>
              </Col>
            </Row>
          </div>
          <div className={commonCss.table}>
            <Table
              rowKey={record => (!isNil(record.guid) ? record.guid : '')}
              bordered
              columns={this.state.columns}
              size="small"
              dataSource={data_Source}
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
          // 点击OK按钮的回调
          onOk={this.modalOk}
          // 点击遮罩层或右上角叉或取消按钮的回调
          onCancel={this.modalCancel}
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
            text={this.state.modalTitle}
            event={() => {
              this.setState({ modalVisible: false })
            }}
          />
          <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="工号">
                    {getFieldDecorator('addAccountId', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.accountId) ? '' : this.state.accountId,
                      rules: [{ required: true, message: '工号不能为空！' },
                      {
                        validator: this.CheckAccountId.bind(this),
                      },],
                    })(
                      <Input
                        disabled={this.state.modalTitle === '修改' ? true : false}
                        placeholder="请输入"
                        onChange={e => this.setState({ accountId: e.target.value })}
                        maxLength={15}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="角色">
                    {getFieldDecorator('userType', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.userType) ? '' : this.state.userType,
                      rules: [{ required: true, message: '角色不能为空！' }],
                    })(
                      <Select
                        allowClear={true}
                        onChange={this.change}
                      >
                        <option value={1}>跟踪客服</option>
                        <option value={2}>线下客服</option>
                        <option value={3}>审核客服</option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="姓">
                    {getFieldDecorator('firstName', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.firstName)
                          ? ''
                          : this.state.firstName,
                    })(
                      <Input
                        placeholder="请输入"
                        onChange={e => this.setState({ firstName: e.target.value })}
                        maxLength={15}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="名">
                    {getFieldDecorator('lastName', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.lastName) ? '' : this.state.lastName,
                    })(
                      <Input
                        placeholder="请输入"
                        onChange={e => this.setState({ lastName: e.target.value })}
                        maxLength={15}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  {this.state.portflag ?
                    <Form.Item {...rowFormlayout} label="所在国家">
                      {getFieldDecorator('country', {
                        initialValue:
                          isNil(this.state) || isNil(this.state.country) ? '0' : this.state.country,
                      })(
                        <Select showSearch placeholder="国家" optionFilterProp="children"
                          onChange={this.selectCountry}
                          filterOption={this.serachCountry}
                        >
                          {getDictDetail('country').map((item: any) => (
                            <option value={item.code}>{item.textValue}</option>
                          ))}
                        </Select>
                      )}
                    </Form.Item> :
                    <Form.Item {...rowFormlayout} label="所在国家">
                      <Input disabled={true} />
                    </Form.Item>}
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  {this.state.portflag ? <Form.Item {...rowFormlayout} label="所在港口">
                    {getFieldDecorator('port', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.belongPort) || this.state.belongPort == '' ? undefined : this.state.belongPort,
                    })(
                      <Select mode='multiple'
                        onSelect={this.selectPort}
                        onDeselect={this.deselectPort}
                        showSearch
                        optionFilterProp="children"
                        placeholder="港口"
                        filterOption={this.serachPort}
                      >
                        {this.state.portList.map((item: any) => (
                          <option value={item.portCode}>{item.portName}</option>
                        ))}
                      </Select>
                    )}
                  </Form.Item> : <Form.Item {...rowFormlayout} label="所在港口">
                      <Input disabled={true} />
                    </Form.Item>}
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  {this.state.portflag ? <Form.Item {...rowFormlayout} label="所选港口">
                    {getFieldDecorator('portSelect', {
                      initialValue: this.state == null || this.state.portNameList == null ? '' : this.state.portNameList.toString(),
                      rules: [{ required: true, message: '港口不能为空！' }],
                    })(<Input disabled />)}
                  </Form.Item> :
                    <Form.Item {...rowFormlayout} label="所选港口">
                      <Input disabled={true} />
                    </Form.Item>}
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item {...rowFormlayout} label="手机号码">
                    {getFieldDecorator('phoneNumber', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.phoneNumber)
                          ? ''
                          : this.state.phoneNumber,
                      rules: [
                        {
                          required: true,
                          message: '手机号码不能为空！',
                        },
                        {
                          pattern: new RegExp(/^[0-9]\d*$/),
                          message: formatMessage({ id: 'insuranceForShipper-insuranceAdd.phonenumber.enter.correct' }),
                        },
                      ],
                    })(
                      <Input
                        maxLength={20}
                        addonBefore={prefixSelector}
                        placeholder="请输入手机号码"
                        onChange={e => this.setState({ phoneNumber: e.target.value })}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="账号密码" required={true}>
                    {getFieldDecorator('password', {
                      initialValue:
                        isNil(this.state) || isNil(this.state.passWord) ? '' : this.state.passWord,
                      rules: [
                        {
                          validator: this.CheckPassWord.bind(this),
                        },
                        {
                          validator: (rule: any, value: any, callback: any) => {
                            this.checkPsd(rule, value, callback);
                          },

                        },
                      ],
                    })(
                      <Input
                        type={'password'}
                        placeholder="请输入密码"
                        onChange={e => this.setState({ passWord: e.target.value })}
                        maxLength={16}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...formlayout} label="账号状态">
                    {getFieldDecorator('status', {
                      initialValue:
                        this.state.status,
                      rules: [{ required: true, message: '账号状态不能为空！' }],
                    })(
                      <Select
                        onSelect={(e: any) => (value: any) => {
                          this.setState({ status: value });
                        }}>
                        <option value={1}>启用</option>
                        <option value={0}>冻结</option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>

      </div>
    );
  }
}

const customerList_Form = Form.create({ name: 'customerList_Form' })(CustomerListForm);

export default customerList_Form;
