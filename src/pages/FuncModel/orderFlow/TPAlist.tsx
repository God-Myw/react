import getRequest from '@/utils/request';
import { Button, Col, Form, Input, Row, Table, Select } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { UserModel } from './TPAumd';
// import { getDictDetail, getTableEnumText } from '@/utils/utils';
// import moment from 'moment';
// import axios from 'axios'
// import { response } from 'express';

const InputGroup = Input.Group;
const data_Source: UserModel[] = [];
// const { Option, OptGroup } = Select;

class TpaList extends React.Component<RouteComponentProps & { location: { query: any } }> {
  private columns: ColumnProps<UserModel>[] = [
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      align: 'center',
      width: '12%',
    },
    {
      title: '船舶名称',
      dataIndex: 'shipName',
      align: 'center',
      width: '11%',
    },
    {
      title: '航次名称',
      dataIndex: 'voyageNewName',
      align: 'center',
      width: '9%',
    },
    {
      title: '货主公司名称',
      dataIndex: 'compName',
      align: 'center',
      width: '13%',
    },
    {
      title: '支付状态',
      dataIndex: 'payOffType',
      align: 'center',
      width: '11%',
    },
    {
      title: '支付金额',
      dataIndex: 'paymoney',
      align: 'center',
      width: '11%',
    },
    {
      title: '发货状态',
      dataIndex: 'setMealTime',
      align: 'center',
      width: '11%',
    },
    {
      title: '订单状态',
      dataIndex: 'orderAllType',
      align: 'center',
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '9%',
      render: (guid: any) => (
        <span>
          <QueryButton text="查看" type="View" event={() => this.handleView(guid.guid , guid.attachId)} disabled={false} />
        </span>
      ),
    },
  ];
// 初始化数据
  state = {
    columns: this.columns,
    dataSource: data_Source,
    companyName: '',
    orederNumber: '',
    buttonA: true,
    buttonB: false,
    buttonC: false,
    adsStatus: '0',
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };

  // 未审核界面
  componentDidMount() {
    if (this.props.match.params.status === '1') {
      this.selectB();
    } else if (this.props.match.params.status === '2') {
      this.selectC();
    } else {
      this.selectA();
    }
  }


  // 搜索键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getsource();
   }
  }

  // 渲染列表
  getsource() {
    const data_Source: UserModel[] = [];
    const param: Map<string, string> = new Map();
    param.set('companyName', this.state.companyName ? this.state.companyName : '');
    param.set('orederNumber', this.state.orederNumber ? this.state.orederNumber : '');

    param.set('type', this.state.adsStatus);
    param.set('currentPage', this.state.currentPage.toString());
    param.set('pageSize', this.state.pageSize.toString());

    // 认证资料一览
    // /business/adsDictionary/getAdsDictionaryList/2
    getRequest('/sys/attachment/getOrderFlowList', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data.records)) {
          forEach(response.data.records, (userDataCheck, index) => {
            const entity: UserModel = {};
            entity.usersIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.key = index + 1;
            entity.orderNumber = userDataCheck.orderNumber;
            entity.shipName = userDataCheck.shipName;
            entity.voyageNewName = userDataCheck.voyageNewName;
            entity.compName = userDataCheck.companyName;
            if (userDataCheck.payMoney) {
              entity.paymoney = userDataCheck.payMoneyType==0?'￥'+ userDataCheck.payMoney:userDataCheck.payMoneyType==1?'$'+ userDataCheck.payMoney:'€'+userDataCheck.payMoney;
            } else {
              entity.paymoney = ''
            }

            if (userDataCheck.setMealTime == 0){
              entity.setMealTime = '未发货'
            } else {
              entity.setMealTime = '已发货'
            }
            switch(userDataCheck.payOffType){
              case 1:
                entity.payOffType = '定金'
                break;
              case 2:
                entity.payOffType = '尾款'
                break;
              case 3:
                entity.payOffType = '服务费'
                break;
            }
            switch(userDataCheck.orderAllType){
              case 1:
                entity.orderAllType = '订单确认中'
                break;
              case 2:
                entity.orderAllType = '待支付定金'
                break;
              case 3:
                entity.orderAllType = '已支付定金'
                break;
              case 4:
                entity.orderAllType = '已发货-运输中'
                break;
              case 5:
                entity.orderAllType = '待支付尾款'
                break;
              case 6:
                entity.orderAllType = '已支付尾款'
                break;
              case 7:
                entity.orderAllType = '待支付服务费'
                break;
              case 8:
                entity.orderAllType = '已支付服务费'
                break;
              case 9:
                entity.orderAllType = '已完成服务费'
                break;
            }
            entity.guid = userDataCheck;
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
      }
    });
  }

  // 修改当前页码
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

  // 切换状态未审核
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

  // 切换状态未通过
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

  // 切换状态已通过
  selectC = () => {
    this.setState(
      {
        buttonA: false,
        buttonB: false,
        buttonC: true,
        adsStatus: '2',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

 // 模拟数据
  initData() {
    this.getsource();
  }
  // 查询信息
  findAll = () => {
    this.setState({
      currentPage: 1,
    }, () => {
      this.initData();
    });
  };

  // 查看详情
  handleView = (id: any, attachId: any) => {
    this.props.history.push(`/orderFlow/view/${id}/${attachId}/${this.state.adsStatus}`);
    // console.log(this.state.adsStatus)
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="订单流水审核" event={() => { this.props.history.push('/index_menu'); }} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact >
                <Input
                  style={{ width: '45%' }}
                  placeholder="请输入订单编号搜索"
                  onChange={e => this.setState({ orederNumber: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <Input
                  style={{ width: '45%' }}
                  placeholder="请输入货主公司名称检索"
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
              (index % 2 == 0 ? commonCss.dataRowOdd : commonCss.dataRowEven)
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
                  {this.state.total % this.state.pageSize == 0 ? Math.floor(this.state.total / this.state.pageSize) : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}页记录,每页显示
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
  TpaList,
);

export default TPACertificationList_Form;
