import getRequest from '@/utils/request';
import { Button, Col, Form, Input, Row, Table, Select } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { UserModel } from './ShipSpartGongyingumd';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import moment from 'moment';
import axios from 'axios';
import { response } from 'express';
const InputGroup = Input.Group;
const data_Source: UserModel[] = [];
const CPT: UserModel[] = [];
// const { Option, OptGroup } = Select;

class ShipSpartGongyinglist extends React.Component<
  RouteComponentProps & { location: { query: any } }
> {
  private columns: ColumnProps<UserModel>[] = [
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      align: 'center',
    },
    {
      title: '商品类型',
      dataIndex: 'oneLevelId',
      align: 'center',
    },
    {
      title: '商品图片',
      dataIndex: 'fileName',
      align: 'center',
      render: v => <img style={{ width: '100px', height: '50px' }} src={v} alt="" />,
    },
    {
      title: '商品',
      dataIndex: 'model',
      align: 'center',
    },
    {
      title: '成交金额',
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: '费用名称',
      dataIndex: 'model',
      align: 'center',
    },
    {
      title: '支付金额',
      dataIndex: 'sumMoney',
      align: 'center',
    },
    {
      title: '下单时间',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '审核状态',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      render: (guid: any) => (
        <span>
          <QueryButton
            text="审核"
            type="View"
            event={() => this.handleView(guid.suCustomsId)}
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
    param.set('currentPage', this.state.currentPage.toString());
    param.set('pageSize', this.state.pageSize.toString());
    getRequest('/business/spartUser/getSpartCustomsByWeb', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data.records)) {
          forEach(response.data.records, (userDataCheck, index) => {
            const entity: UserModel = {};
            entity.orderNumber = userDataCheck.orderNumber;
            entity.type =
              userDataCheck.type == 0
                ? '未审核'
                : userDataCheck.type == 1
                ? '已审核未通过'
                : '已审核未通过';
            entity.fileName =
              userDataCheck.source == '1'
                ? `http://58.33.34.10:10443/images/spart/${userDataCheck.fileName}`
                : `http://39.105.35.83:10443/images/spart/${userDataCheck.fileName}`;
            entity.model = userDataCheck.model;
            entity.userName = userDataCheck.userName;
            entity.phoneNumber = userDataCheck.phoneNumber;
            entity.oneLevelId = userDataCheck.oneLevelId;
            entity.createDate = userDataCheck.createDate;
            entity.sumMoney = userDataCheck.sumMoney;
            entity.guid = userDataCheck;
            entity.currentPage = response.data.current;
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
    this.props.history.push('/shipSpartGongying/view/' + id);
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="船舶订单流水单审核"
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
  ShipSpartGongyinglist,
);

export default TPACertificationList_Form;
