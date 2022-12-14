import getRequest from '@/utils/request';
import { Button, Col, Form, Input, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { UserModel } from './UserModel';
import { getTableEnumText } from '@/utils/utils';
import moment from 'moment';

const InputGroup = Input.Group;
const data_Source: UserModel[] = [];

class CertificationListForm extends React.Component<RouteComponentProps & { location: { query: any } }> {
  private columns: ColumnProps<UserModel>[] = [
    {
      title: '序号',
      dataIndex: 'usersIndex',
      align: 'center',
      width: '11%',
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      align: 'center',
      width: '12%',
    },
    {
      title: '联系方式',
      dataIndex: 'phoneNumber',
      align: 'center',
      width: '13%',
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      align: 'center',
      width: '11%',
    },
    {
      title: '开户行',
      dataIndex: 'bankType',
      align: 'center',
      width: '12%',
    },
    {
      title: '银行账号',
      dataIndex: 'bankNumber',
      align: 'center',
      width: '18%',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '11%',
      render: (guid: any) => (
        <span>
          <QueryButton text='查看' type="View" event={() => this.handleView(guid.userId)} disabled={false} />
        </span>
      ),
    }
  ];

  state = {
    columns: this.columns,
    dataSource: data_Source,
    companyName: '',
    buttonA: true,
    buttonB: false,
    buttonC: false,
    status: '1',
    currentPage: 1,
    pageSize: 10,
    total: 0,
    phoneNumber: '',
  };

  //未审核界面
  componentDidMount() {
    this.setState({
      currentPage: localStorage.currentPage
    })
    localStorage.currentPage
      ? localStorage.removeItem('currentPage')
      : (localStorage.currentPage = this.state.currentPage);
    if (this.props.location.query.selectTab === '3') {
      this.selectB();
    } else if (this.props.location.query.selectTab === '2') {
      this.selectC();
    } else {
      this.selectA();
    }
  }

  //模拟数据
  initData() {
    this.getsource();
  }

  //键盘监听
  keyUp: any = (e: any) => {
    if (e.keyCode === 13) {
      this.getsource();
    }
  }

  getsource() {
    const data_Source: UserModel[] = [];
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    if (!isNil(this.state.companyName) || this.state.companyName != '') {
      param.set('companyName', this.state.companyName ? this.state.companyName : '');
    }
    param.set('phoneNumber', this.state.phoneNumber ? this.state.phoneNumber : '');
    param.set('status', this.state.status);
    param.set('currentPage', localStorage.currentPage || this.state.currentPage.toString());
    param.set('pageSize', this.state.pageSize.toString());
    param.set('date', moment().format('YYYY-MM-DD HH:mm:ss'));
    // 认证资料一览
    getRequest('/sys/userDetail/data', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.list, (userDataCheck, index) => {
            const entity: UserModel = {};
            entity.usersIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.key = index + 1;
            entity.companyName = userDataCheck.companyName;
            entity.phoneNumber = userDataCheck.phoneNumber;
            entity.userType = getTableEnumText('user_type', userDataCheck.userType);
            entity.faxNumber = userDataCheck.faxNumber;
            entity.bankType = userDataCheck.bankType;
            entity.bankNumber = userDataCheck.bankNumber;
            entity.total = response.data.total;
            entity.userId = userDataCheck.userId;
            entity.currentPage = response.data.currentPage;
            entity.guid = userDataCheck;
            data_Source.push(entity);
            // console.log( response.data.currentPage)
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
          currentPage: response.data.currentPage,
        });
      }
    });
  }

  //修改当前页码
  changePage = (page: any) => {
    localStorage.currentPage = page;
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.initData();
      },
    );
  };

  //切换状态未审核
  selectA = () => {
    this.setState(
      {
        buttonA: true,
        buttonB: false,
        buttonC: false,
        status: '1',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //切换状态未通过
  selectB = () => {
    this.setState(
      {
        buttonA: false,
        buttonB: true,
        buttonC: false,
        status: '3',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //切换状态已通过
  selectC = () => {
    this.setState(
      {
        buttonA: false,
        buttonB: false,
        buttonC: true,
        status: '2',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //按公司查询信息
  findAll = () => {
    this.setState({
      currentPage: 1,
    }, () => {
      this.initData();
    });
  };

  //查看详情
  handleView = (id: any) => {
    this.props.history.push('/usercertification/view/' + id + '/' + this.state.status);
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="认证审核" event={() => { this.props.history.push('/index_menu'); }} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '25%' }}
                  placeholder="请输入联系方式"
                  onChange={e => this.setState({ phoneNumber: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <Input
                  style={{ width: '70%' }}
                  placeholder="请输入公司名称搜索"
                  onChange={e => this.setState({ companyName: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <QueryButton type="Query" text="搜索" event={() => this.findAll()} disabled={false} />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '10.93%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonA ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectA}
                >
                  未审核
                </Button>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '11.93%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonB ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectB}
                >
                  未通过
                </Button>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '12.97%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonC ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectC}
                >
                  已通过
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Table
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
              pageSize: this.state.pageSize,
              onChange: this.changePage,
              total: this.state.total,
              showTotal: () => (
                <div>
                  总共{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  页记录,每页显示
                  {this.state.pageSize}条记录

                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

const CertificationList_Form = Form.create({ name: 'CertificationList_Form' })(
  CertificationListForm,
);

export default CertificationList_Form;
