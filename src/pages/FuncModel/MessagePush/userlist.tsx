import React from 'react';
import { Table, Input, Row, Col, Select, message, Modal, Checkbox   } from 'antd';
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
    xuanze:[],
    loading: false,
    visible: false,
  };

  // const rowSelection = {
  //   selectedRowKeys:this.state.selectedRowKeys,
  //   onChange:this.onSelectChange
  // }

  // onSelectChange= selectedRowKeys=>{
  //   console.log(selectedRowKeys)
  //   this.setState({selectedRowKeys})
  // }

  private columns: ColumnProps<UserModel>[] = [
    {
      title: '序号',
      dataIndex: 'userIndex',
      align: 'center',
      key: 'guid',
    },
    {
      title: '公司',
      dataIndex: 'companyName',
      align: 'center',
      width:'18%',
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
      title: '联系方式',
      dataIndex: 'phone',
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
      title: '选择用户',
      dataIndex: 'payStatus',
      align: 'center',
      key: 'guid',
      render: (text, row, index) => {
          return {
            // children: <Checkbox checked={this.state.xuanze.find(item => item === row.guid.guid)} key={row.guid.guid} onChange={()=>this.handleSure(row.guid.guid)}>选择</Checkbox >,
            children: <Checkbox checked={this.state.xuanze.find(item => item.guid.guid === row.guid.guid)} key={row.guid.guid} onChange={()=>this.handleSure(row)}>选择</Checkbox >,
          };
      },
    }
  ];


  //初期化事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    this.setState(
      {
        columns:  this.columns,
      },
      () => {
        this.getUserList();
      },
    );
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getUserList();
   }
  }

  //准备参数
  setParams(): Map<string, string> {
    let params: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('currentPage', this.state.currentPage.toString());
    params.set('pageSize', this.state.pagesize.toString());
    params.set('date',moment().format('YYYY-MM-DD HH:mm:ss'));

    if (!isNil(this.state.accountId) && this.state.accountId !== '') {
      params.set('accountId', this.state.accountId);
    }
    if (!isNil(this.state.userType) && this.state.userType !== '') {
      params.set('userType', this.state.userType? this.state.userType =='货主'?4:this.state.userType=='船东'?5:this.state.userType=='服务商'?6 :'' :'');
    }
    if (!isNil(this.state.isIdCard) && this.state.isIdCard !== '') {
      params.set('isIdCard', this.state.isIdCard);
    }
    return params;
  }

  //获取表格数据
  getUserList() {
    const data_Source: UserModel[] = [];
    getRequest('/sys/user/', this.setParams(), (response: any) => {

      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.users, (user, index) => {
            const entity: UserModel = {};
            // console.log(user)
            entity.guid = user.guid
            entity.userIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;
            entity.accountId = user.accountId;
            entity.companyName = user.companyName;
            entity.userType = user.userType? user.userType ==4?'货主':user.userType==5?'船东':user.userType==6?'服务商' :'' :'' ;
            entity.email = user.email;
            entity.phone = user.phone;
            entity.phoneNumberTwo = user.phoneNumberTwo;
            entity.userName = user.firstName + user.lastName;
            entity.checkStatus = user.checkStatus;
            entity.payStatus = user.payStatus;
            entity.fileType = user.fileType;
            entity.fileName = user.fileName;
            entity.guid = user;
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
    this.setState({
      currentPage: 1,
    }, () => {
      this.getUserList();
    });
  }

  selectChange = (value: any) => {
    this.setState({
      userType: value,
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
    this.setState({
      currentPage: page,
    }, () => {
      this.getUserList();
    });
  };

  //用户类型选择
  handleSure = (value: any) => {
    let arr = JSON.parse(JSON.stringify(this.state.xuanze));
    const isTrue = arr.find(item => {
      return item.guid.guid === value.guid.guid;
    })

    if(!isTrue) {
      arr.push(value)
    } else {
      arr.forEach((item, index) => {
        if(value.guid.guid === item.guid.guid) {
          arr.splice(index, 1);
        }
      })
    }

    this.setState({
      xuanze:arr
    })
  };


handleOk = () => {
  this.props.close({
    data: this.state.xuanze,
    type: 'ok'
  });
};

handleCancel = () => {
  this.props.close({
    type: 'cancel'
  });
  // this.setState({
  //   xuanze:[]
  // })
  console.log(this.state.xuanze)
};


  render() {

    console.log(this.state.xuanze)
    return (
      <Modal
        title="具体目标用户"
        width="90%"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div className={commonCss.container}>
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Select
                  allowClear={true}
                  placeholder="用户类型选择"
                  style={{ width: '30%' }}
                  onChange={this.selectChange}
                >
                  {
                    (isNil(this.state) || isNil(this.state) || isNil(this.state.yonghuleixing)
                    ? ''
                  : this.state.yonghuleixing).map((item: any) =>{return <option value={item}>{item}</option>})
                  }
                </Select>
                <Input
                  style={{ width: '65%' }}
                  placeholder="请输入用户名称搜索"
                  onChange={e => this.setState({ accountId: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                {/* <Select
                  allowClear={true}
                  placeholder="注册类型"
                  style={{ width: '10%' }}
                  onChange={this.selectIsIdCard}
                >
                  <option value="">正常注册</option>
                  <option value="1">贷款注册</option>
                </Select> */}

                <QueryButton type="Query" text="搜索" event={this.search.bind(this)} disabled={false} />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Table
            //rowKey={record => (!isNil(record.guid) ? record.guid : '')}
            // rowSelection={rowSelection}
            columns={this.state.columns}
            dataSource={this.state.dataSource}
            bordered
            size="small"
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
          <a onClick={()=>linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
        </Modal>
      </div>
      </Modal>
    );
  }
}

export default UserListForm;
