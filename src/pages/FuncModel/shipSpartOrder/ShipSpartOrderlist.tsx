import getRequest from '@/utils/request';
import { Button, Col, Form, Input, Row, Table, Select } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { UserModel } from './shipSpartOrderumd';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import moment from 'moment';
import axios from 'axios';
import { response } from 'express';
const InputGroup = Input.Group;
const data_Source: UserModel[] = [];
const CPT: UserModel[] = [];
// const { Option, OptGroup } = Select;

class ShipSpartOrderlist extends React.Component<
  RouteComponentProps & { location: { query: any } }
> {
  private columns: ColumnProps<UserModel>[] = [
    {
      title: '订单编号',
      dataIndex: 'usersIndex',
      align: 'center',
    },
    {
      title: '船舶名称',
      dataIndex: 'companyType',
      align: 'center',
    },
    {
      title: '船舶类型',
      dataIndex: 'companyName',
      align: 'center',
    },
    {
      title: '成交金额',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '费用名称',
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: '服务费支付金额',
      dataIndex: 'setMealType',
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'setMealTime',
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'userType',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      render: (guid: any) => (
        <span>
          <QueryButton
            text="查看"
            type="View"
            event={() => this.handleView(guid.id)}
            disabled={false}
          />
        </span>
      ),
    },
  ];

  state = {
    columns: this.columns,
    dataSource: data_Source,
    cpt: CPT,
    companyType: '',
    companyName: '',
    phoneNumber: '',
    buttonA: true,
    buttonB: false,
    buttonC: false,
    adsStatus: '0',
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };

  //未审核界面
  componentDidMount() {
    if (this.props.match.params.status === '1') {
      this.selectB();
    } else if (this.props.match.params.status === '3') {
      this.selectC();
    } else {
      this.selectA();
    }
  }

  //模拟数据
  initData() {
    this.getsource();
    this.getcompanyType();
  }

  //键盘监听
  keyUp: any = (e: any) => {
    if (e.keyCode === 13) {
      this.getsource();
    }
  };

  getsource() {
    const data_Source: UserModel[] = [];
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    param.set('companyName', this.state.companyName ? this.state.companyName : '');
    param.set('phoneNumber', this.state.phoneNumber ? this.state.phoneNumber : '');
    param.set('companyType', this.state.companyType ? this.state.companyType : '');
    param.set('adsStatus', this.state.adsStatus);
    param.set('currentPage', this.state.currentPage.toString());
    param.set('pageSize', this.state.pageSize.toString());
    //param.set('date',moment().format('YYYY-MM-DD HH:mm:ss'));
    // 认证资料一览
    // /business/adsDictionary/getAdsDictionaryList/2
    getRequest('/business/ads/getAdsInfoByStatus', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data.records)) {
          forEach(response.data.records, (userDataCheck, index) => {
            // console.log(userDataCheck)
            const entity: UserModel = {};
            entity.usersIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.key = index + 1;
            entity.companyName = userDataCheck.company_name;
            entity.userName = userDataCheck.contacts;
            entity.phoneNumber = userDataCheck.phone_number;
            entity.companyType = userDataCheck.company_type;
            // console.log(entity.phoneNumber)
            // entity.companyType = userDataCheck.company_type;
            // entity.setMealType = userDataCheck.order_level;
            if (userDataCheck.order_level === 1) {
              entity.setMealType = '免费体验';
            } else if (userDataCheck.order_level === 2) {
              entity.setMealType = '基础套餐';
            } else if (userDataCheck.order_level === 3) {
              entity.setMealType = '升级套餐';
            } else if (userDataCheck.order_level === 4) {
              entity.setMealType = '白金套餐';
            } else if (userDataCheck.order_level === 5) {
              entity.setMealType = '皇冠套餐';
            } else {
            }
            if (userDataCheck.start_date == null || userDataCheck.end_date == null) {
              entity.setMealTime = '';
            } else {
              let start = userDataCheck.start_date;
              let end = userDataCheck.end_date;
              let startdate =
                new Date(start).getFullYear() +
                '-' +
                (new Date(start).getMonth() + 1) +
                '-' +
                new Date(start).getDate();
              let enddate =
                new Date(end).getFullYear() +
                '-' +
                (new Date(end).getMonth() + 1) +
                '-' +
                new Date(end).getDate();
              entity.setMealTime = startdate + ' 至 ' + enddate;
            }
            entity.userType = userDataCheck.usertype;
            entity.guid = userDataCheck;
            // console.log(userDataCheck.usertype)end
            // entity.faxNumber = userDataCheck.faxNumber;
            // entity.bankType = userDataCheck.bankType;
            // entity.bankNumber = userDataCheck.bankNumber;
            // entity.total = response.data.total;
            // entity.userId = userDataCheck.userId;
            entity.currentPage = response.data.current;

            // console.log(response.data.current)
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
          currentPage: response.data.current,
        });
        // console.log(this.state.dataSource)
      }
    });
  }

  //请求companyType（服务商类型）的数据

  getcompanyType() {
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    getRequest('/business/adsDictionary/getAdsDictionaryList/3', param, (response: any) => {
      // console.log(response.data)
      let CPT = response.data;
      // console.log(CPT)
      this.setState({
        cpt: CPT,
      });
      console.log(this.state.cpt);
      // this.state.cpt.map((item:any)=>(
      //   console.log(item.adsType)
      // ))
    });
  }
  //修改当前页码
  changePage = (page: any) => {
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
        adsStatus: '0',
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
        adsStatus: '1',
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
        adsStatus: '3',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //按公司查询信息
  findAll = () => {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //按照服务商类型查询信息
  selectChange = (value: string) => {
    this.setState({
      companyType: value ? value : '',
    });
  };

  //查看详情
  handleView = (id: any) => {
    this.props.history.push('/promotionaudit/view/' + id + '/' + this.state.adsStatus);
    // console.log(this.state.adsStatus)
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="船舶挂牌成交流水单审核
          "
          event={() => {
            this.props.history.push('/index_menu');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '30%' }}
                  placeholder="请输入订单编号搜索"
                  onChange={e => this.setState({ phoneNumber: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <Input
                  style={{ width: '30%' }}
                  placeholder="请输入联系人搜索"
                  onChange={e => this.setState({ phoneNumber: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <Input
                  style={{ width: '33%' }}
                  placeholder="请输入联系方式搜索"
                  onChange={e => this.setState({ companyName: e.target.value })}
                  onKeyUp={this.keyUp}
                />

                <QueryButton
                  type="Query"
                  text="搜索"
                  event={() => this.findAll()}
                  disabled={false}
                />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                style={{
                  marginBottom: '-5px',
                  paddingBottom: '0px',
                  width: '10.93%',
                  float: 'left',
                }}
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
                style={{
                  marginBottom: '-5px',
                  paddingBottom: '0px',
                  width: '11.93%',
                  float: 'left',
                }}
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
                style={{
                  marginBottom: '-5px',
                  paddingBottom: '0px',
                  width: '12.97%',
                  float: 'left',
                }}
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

const TPACertificationList_Form = Form.create({ name: 'TPACertificationList_Form' })(
  ShipSpartOrderlist,
);

export default TPACertificationList_Form;
