import getRequest from '@/utils/request';
import { Button, Col, Form, Input, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import moment from 'moment';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import { getTableEnumText } from '@/utils/utils';
import commonCss from '../../Common/css/CommonCss.less';
import { CerAdvanceorderModel } from './CerAdvanceorderModel';
const InputGroup = Input.Group;
const data_Source: CerAdvanceorderModel[] = [];

//List的基本样式
const columns: ColumnProps<CerAdvanceorderModel>[] = [
  {
    title: '序号',
    dataIndex: 'reserveIndex',
    align: 'center',
    width: '10%',
  },
  {
    title: '船舶名称',
    dataIndex: 'shipName',
    align: 'center',
    width: '14%',
  },
  {
    title: '船舶类型',
    dataIndex: 'shipType',
    align: 'center',
    width: '10%',
  },
  {
    title: '订单编号',
    dataIndex: 'orderNumber',
    align: 'center',
    width: '16%',
  },
  {
    title: '货物名称',
    dataIndex: 'goodsLevel',
    align: 'center',
    width: '10%',
  },
  {
    title: '货物重量',
    dataIndex: 'goodsWeight',
    align: 'center',
    width: '10%',
  },
  {
    title: '货物数量',
    dataIndex: 'goodsCount',
    align: 'center',
    width: '10%',
  },
  {
    title: '受载日期',
    dataIndex: 'loadDate',
    align: 'center',
    width: '10%',
  },
];

class AdvanceorderListForm extends React.Component<RouteComponentProps & { location: { query: any } }> {
  //初期画面状态
  state = {
    columns: columns,
    dataSource: data_Source,
    orderNumber: '',
    shipName:'',
    //未审核
    buttonA: true,
    //未通过
    buttonB: false,
    //已通过
    buttonC: false,
    //状态
    status: '1',
    //当前页
    currentPage: 1,
    pageSize: 10,
    total: 0,
    selectTab: 'selectA',
  };

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getsource();
   }
  }

  //获取参数
  getsource() {
    const data_Source: CerAdvanceorderModel[] = [];
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    param.set('checkStatus', this.state.status);
    param.set('orderNumber', this.state.orderNumber);
    param.set('shipName', this.state.shipName);
    param.set('currentPage', this.state.currentPage.toString());
    param.set('pageSize', this.state.pageSize.toString());
    param.set('date',moment().format('YYYY-MM-DD HH:mm:ss'));
    // 认证资料一览
    getRequest('/business/order', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.orders, (order, index) => {
            const entity: CerAdvanceorderModel = {};
            entity.reserveIndex = index +  (this.state.currentPage - 1) * this.state.pageSize+1;
            //序号和订单编号是否需要
            entity.orderNumber = order.orderNumber;
            entity.shipName = order.shipName;
            entity.shipType = getTableEnumText('ship_type', order.shipType);
            entity.goodsLevel = getTableEnumText('goods_name', order.goodsLevel);
            entity.goodsWeight =  order.goodsWeight;
            entity.goodsCount = order.goodsCount;
            entity.loadDate = moment(Number(order.loadDate)).format('YYYY/MM/DD');
            //状态用于判断是否审核通过
            entity.checkStatus = getTableEnumText('check_status', order.checkStatus);
            entity.payStatus = order.payStatus;
            entity.orderStatus = order.orderStatus;
            entity.guid = order.guid;
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
  //未审核界面
  componentDidMount() {
    if (this.props.location.query.selectTab === 'selectB') {
      this.selectB();
    } else if (this.props.location.query.selectTab === 'selectC') {
      this.selectC();
    } else {
      this.initData();
    }
  };

  initData = () => {
    if (this.state.columns.length === 8) {
      this.state.columns.push({
        title: '操作',
        dataIndex: 'guid', //数据索引唯一标识
        align: 'center',
        width: '10%',
        render: (guid: any) => (
          <span>
            <QueryButton
              text='审核'
              type="View"
              event={() => this.handleView(guid, this.state.status)}
              disabled={false}
            />
          </span>
        ),
      });
    } else if (this.state.columns.length === 9) {
      if (this.state.buttonA) {
        this.state.columns.splice(8, 1, {
          title: '操作',
          dataIndex: 'guid',
          align: 'center',
          width: '10%',
          render: (guid: any) => (
            <span>
              <QueryButton
                text="审核"
                type="View"
                event={() => this.handleView(guid, this.state.status)}
                disabled={false}
              />
            </span>
          ),
        });
      } else if (this.state.buttonB) {
        this.state.columns.splice(8, 1, {
          title: '操作',
          dataIndex: 'guid',
          align: 'center',
          width: '10%',
          render: (guid: any) => (
            <span>
              <QueryButton
                text="查看"
                type="View"
                event={() => this.handleView(guid, this.state.status)}
                disabled={false}
              />
            </span>
          ),
        });
      } else if (this.state.buttonC) {
        this.state.columns.splice(8, 1, {
          title: '操作',
          dataIndex: 'guid',
          align: 'center',
          width: '10%',
          render: (guid: any) => (
            <span>
              <QueryButton
                text="查看"
                type="View"
                event={() => this.handleView(guid, this.state.status)}
                disabled={false}
              />
            </span>
          ),
        });
      }
    }
    this.getsource();
  }
  //切换状态未审核
  selectA = () => {
    this.setState(
      {
        buttonA: true,
        buttonB: false,
        buttonC: false,
        status: '1',
        selectTab: 'selectA',
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
        status: '2',
        selectTab: 'selectB',
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
        status: '3',
        selectTab: 'selectC',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //按船舶名称查询信息
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

  //调转审核或查看界面
  handleView = (guid: string, status: string) => {
    const selectTab = this.state.selectTab;
    this.props.history.push('/ceradvanceorder/view/' + guid + '/' + status + '/' + selectTab);
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

  onBack = () => {
    this.props.history.push('/index_menu');
  }

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="预订单审核" event={() => this.onBack()} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>

              <InputGroup compact>
              <Input
                  style={{ width: '50%' }}
                  placeholder="请输入船舶名称搜索"
                  onChange={e => this.setState({ shipName: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <Input
                  style={{ width: '45%' }}
                  placeholder="请输入订单编号搜索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <QueryButton
                  type="Query"
                  text="搜索"
                  event={() => this.findAll()}
                  disabled={true}
                />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '10%', float: 'left' }}
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
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '14.05%', float: 'left' }}
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
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '10%', float: 'left' }}
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
            rowKey={record => (!isNil(record.orderNumber) ? record.orderNumber : '')}
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

const AdvanceorderList_Form = Form.create({ name: 'AdvanceorderList_Form' })(AdvanceorderListForm);

export default AdvanceorderList_Form;
