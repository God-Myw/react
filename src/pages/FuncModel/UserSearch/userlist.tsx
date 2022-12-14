import React from 'react';
import { Table, Input, Row, Col, Select, message, Modal } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { RouteComponentProps } from 'dva/router';
import { UserModel } from './UserModel';
import { ColumnProps } from 'antd/lib/table';
import getRequest, { putRequest } from '@/utils/request';
import { isNil, forEach } from 'lodash';
import { getDictDetail, getTableEnumText, linkHref } from '@/utils/utils';
import moment from 'moment';
const InputGroup = Input.Group;
const { confirm } = Modal;

class UserListForm extends React.Component<RouteComponentProps> {
  state = {
    //列
    columns: [],
    //用户联系方式
    phoneNumber: '',
    //表数据
    dataSource: [],
    //用户名称
    accountId: '',
    //用户类型
    userType: '',
    //注册类型
    isIdCard: '',
    //当前页
    currentPage: 1,
    pagesize: 10,
    total: 0,
    previewImage: '',
    previewVisible: false,
    yonghuleixing: [
      '货主',
      '船东',
      '服务商',
    ],
  };

  private columns: ColumnProps<UserModel>[] = [
    {
      title: '序号',
      dataIndex: 'userIndex',
      align: 'center',
    },
    {
      title: '注册时间',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '公司',
      dataIndex: 'companyName',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'accountId',
      align: 'center',
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      align: 'center',
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: '联系方式Two',
      dataIndex: 'phoneNumberTwo',
      align: 'center',
    },
    {
      title: '推广人员',
      dataIndex: 'promotion',
      align: 'center',
    },
    {
      title: '认证状态',
      dataIndex: 'checkStatus',
      align: 'center',
      render: (text, row, index) => {
        if (row.checkStatus === 2) {
          return {
            children: <span style={{ color: 'blue' }}>已认证</span>//<a href=''>已认证</a>
          };
        } else {
          return {
            children: <span style={{ color: 'red' }}>未认证</span>//<a href='' style={{color:'red'}}>未认证</a>
          };
        };
      },
    },
    // {
    //   title: '保证金',
    //   dataIndex: 'payStatus',
    //   align: 'center',
    //   render: (text, row, index) => {
    //     if (row.payStatus === 1) {
    //       return {
    //         children: <span style={{ color: 'blue' }}>已交保证金</span>//<a href='' >已交保证金</a>
    //       };
    //     } else {
    //       return {
    //         children: <span style={{ color: 'red' }}>未交保证金</span>//<a href='' style={{color:'red'}}>未交保证金</a>
    //       };
    //     };
    //   },
    // },
    // {
    //   title: '保证金流水单',
    //   dataIndex: 'fileName',
    //   align: 'center',
    //   render: (text, row, index) => {
    //     if (isNil(row.fileName) || row.fileName === '') {
    //       return {
    //         children: <span>无图片</span>
    //       };
    //     } else {
    //       return {
    //         children: <QueryButton text='查看图片' type="View" event={() => this.handlePreview(row)} disabled={false} />
    //       };
    //     };
    //   },
    // },
    {
      title: '认证状态',
      dataIndex: 'payStatus',
      align: 'center',
      render: (text, row, index) => {
        if (row.payStatus === 2) {
          return {
            children: <QueryButton text="确认" type="Sure" disabled={false} event={() => this.handleSure(row)} />
          };
        } else {
          return {
            children: <QueryButton text="确认" type="Sure" disabled={true} event={() => this.handleSure(row)} />
          };
        };
      },
    }
  ];

  private columnsTwo: ColumnProps<UserModel>[] = [
    {
      title: '序号',
      dataIndex: 'userIndex',
      align: 'center',
    },
    {
      title: '注册时间',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '公司',
      dataIndex: 'companyName',
      align: 'center',
    },

    {
      title: '用户名',
      dataIndex: 'accountId',
      align: 'center',
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      align: 'center',
    },
    {
      title: '用户邮箱',
      dataIndex: 'email',
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: '联系方式Two',
      dataIndex: 'phoneNumberTwo',
      align: 'center',
    },
    {
      title: '推广人员',
      dataIndex: 'promotion',
      align: 'center',
    },
    {
      title: '认证状态',
      dataIndex: 'checkStatus',
      align: 'center',
      render: (text, row, index) => {
        if (row.checkStatus === 2) {
          return {
            children: <span style={{ color: 'blue' }}>已认证</span>//<a href=''>已认证</a>
          };
        } else {
          return {
            children: <span style={{ color: 'red' }}>未认证</span>//<a href='' style={{color:'red'}}>未认证</a>
          };
        };
      },
    },
    {
      title: '保证金',
      dataIndex: 'payStatus',
      align: 'center',
      render: (text, row, index) => {
        if (row.payStatus === 1) {
          return {
            children: <span style={{ color: 'blue' }}>已交保证金</span>//<a href='' >已交保证金</a>
          };
        } else {
          return {
            children: <span style={{ color: 'red' }}>未交保证金</span>//<a href='' style={{color:'red'}}>未交保证金</a>
          };
        };
      },
    },
    {
      title: '保证金流水单',
      dataIndex: 'fileName',
      align: 'center',
      render: (text, row, index) => {
        if (isNil(row.fileName) || row.fileName === '') {
          return {
            children: <span>无图片</span>
          };
        } else {
          return {
            children: <QueryButton text='查看图片' type="View" event={() => this.handlePreview(row)} disabled={false} />
          };
        };
      },
    }
  ];

  //初期化事件
  componentDidMount() {
    this.initData();
    this.setState({
      currentPage: localStorage.currentPage
    })
    // localStorage.currentPage
    //   ? localStorage.removeItem('currentPage')
    //   : (localStorage.currentPage = this.state.currentPage);
    // localStorage.userType
    //   ? localStorage.removeItem('userType')
    //   : (localStorage.userType = this.state.userType);
    localStorage.isIdCard
      ? localStorage.removeItem('isIdCard')
      : (localStorage.isIdCard = this.state.isIdCard);
  }

  //模拟数据
  initData() {
    this.setState(
      {
        columns: localStorage.getItem('userType') === '3' ? this.columns : this.columnsTwo,
      },
      () => {
        this.getUserList();
      },
    );
  }

  //键盘监听
  keyUp: any = (e: any) => {
    if (e.keyCode === 13) {
      this.getUserList();
    }
  }

  //准备参数
  setParams(): Map<string, string> {
    let params: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('currentPage', localStorage.currentPage || this.state.currentPage.toString());
    params.set('pageSize', this.state.pagesize.toString());
    params.set('date', moment().format('YYYY-MM-DD HH:mm:ss'));
    params.set('phoneNumber', this.state.phoneNumber);
    if (!isNil(this.state.accountId) && this.state.accountId !== '') {
      params.set('accountId', this.state.accountId);
    }
    if (!isNil(this.state.userType) && this.state.userType !== '') {
      params.set('userType', localStorage.userType || this.state.userType);
    }
    if (!isNil(this.state.isIdCard) && this.state.isIdCard !== '') {
      params.set('isIdCard', localStorage.isIdCard || this.state.isIdCard);
    }
    return params;
  }

  //获取表格数据
  getUserList() {
    const data_Source: UserModel[] = [];
    getRequest('/sys/user/', this.setParams(), (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.users, (user, index) => {
            const entity: UserModel = {};
            entity.userIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;
            entity.accountId = user.accountId;
            entity.companyName = user.companyName;
            entity.userType = user.userType;
            entity.email = user.email;
            entity.phone = user.phone;
            entity.phoneNumberTwo = user.phoneNumberTwo;
            entity.userName = user.firstName + user.lastName;
            entity.checkStatus = user.checkStatus;
            entity.payStatus = user.payStatus;
            entity.fileType = user.fileType;
            entity.fileName = user.fileName;
            entity.guid = user;
            entity.promotion = user.promotion;
            entity.createDate = moment(user.createDate).format('YYYY/MM/DD');
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total
        });
      }
    });
  }

  //检索事件
  search() {
    localStorage.currentPage = 1;
    localStorage.userType = this.state.userType;
    localStorage.isIdCard = this.state.isIdCard;
    this.setState({
      currentPage: 1,
    }, () => {
      this.getUserList();
    });
  }

  selectChange = (value: any) => {
    this.setState({
      userType: value ? value == '货主' ? 4 : value == '船东' ? 5 : value == '服务商' ? 6 : '' : '',
    });
  };

  selectIsIdCard = (value: any) => {
    this.setState({
      isIdCard: value,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (record: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', record.fileName);
    getRequest('/sys/file/getImageBase64/' + record.fileType, params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            previewImage: response.data.file.base64,
            previewVisible: true,
          });
        }
      }
    });
  };

  //修改当前页码
  changePage = (page: any) => {
    localStorage.currentPage = page;
    this.setState({
      currentPage: page,
    }, () => {
      this.getUserList();
    });
  };

  //用户类型选择
  handleSure = (value: any) => {
    confirm({
      title: '是否完成确认操作？',
      okText: '是',
      cancelText: '否',
      onOk() {
        let requestData = {};
        putRequest(`/business/earnestMoney/checkMargin/${value.guid.guid}?payStatus=1`, JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {
            location.reload(true)
            message.success('确认成功', 2);
          } else {
            message.error('确认失败', 2);
          }
        });
      },
    });
  };

  render() {
    // @ts-ignore
    // @ts-ignore
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="用户查询" event={() => {
          this.props.history.push('/index_menu/');
        }} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Select
                  allowClear={true}
                  placeholder="用户类型选择"
                  style={{ width: '20%' }}
                  onChange={this.selectChange}
                >
                  {
                    (isNil(this.state) || isNil(this.state) || isNil(this.state.yonghuleixing)
                      ? ''
                      : this.state.yonghuleixing).map((item: any) => { return <option value={item}>{item}</option> })
                  }
                </Select>
                <Select
                  allowClear={true}
                  placeholder="注册类型"
                  style={{ width: '10%' }}
                  onChange={this.selectIsIdCard}
                >
                  <option value="">正常注册</option>
                  <option value="1">贷款注册</option>
                </Select>
                <Input
                  style={{ width: '35%' }}
                  placeholder="请输入联系方式搜索"
                  onChange={e => this.setState({ phoneNumber: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <Input
                  style={{ width: '30%' }}
                  placeholder="请输入用户名称搜索"
                  onChange={e => this.setState({ accountId: e.target.value })}
                  onKeyUp={this.keyUp}
                />


                <QueryButton type="Query" text="搜索" event={this.search.bind(this)} disabled={false} />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Table
            //rowKey={record => (!isNil(record.guid) ? record.guid : '')}
            bordered
            columns={this.state.columns}
            size="small"
            dataSource={this.state.dataSource}
            rowClassName={(record, index) =>
              index % 2 == 0 ? commonCss.dataRowOdd : commonCss.dataRowEven
            }
            pagination={{
              current: this.state.currentPage,
              showQuickJumper: true,
              pageSize: this.state.pagesize,
              onChange: this.changePage,
              total: this.state.total,
              showTotal: () => (
                <div>
                  总共{' '}
                  {this.state.total % this.state.pagesize == 0
                    ? Math.floor(this.state.total / this.state.pagesize)
                    : Math.floor(this.state.total / this.state.pagesize) + 1}{' '}
                  页记录,每页显示
                  {this.state.pagesize}条记录
                </div>
              ),
            }}
          />
        </div>
        <Modal className="picModal"
          visible={isNil(this.state) || isNil(this.state.previewVisible) ? false : this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img
            alt="example"
            style={{ width: '100%' }}
            src={isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage}
          />
          <a onClick={() => linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
        </Modal>
      </div>
    );
  }
}

export default UserListForm;
