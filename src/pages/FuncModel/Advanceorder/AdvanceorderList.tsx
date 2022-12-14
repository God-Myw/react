import getRequest, { deleteRequest } from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Button, Col, Form, Input, message, Modal, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { AdvanceorderModel } from './AdvanceorderModel';
import moment from 'moment';
const InputGroup = Input.Group;
const dataSource: AdvanceorderModel[] = [];
const { confirm } = Modal;

class AdvanceorderListForm extends React.Component<RouteComponentProps> {

  private columns: ColumnProps<AdvanceorderModel>[] = [
    {
      title: '序号',
      dataIndex: 'reserveIndex',
      align: 'center',
      width: '12%',
    },
    {
      title: '船舶名称',
      dataIndex: 'shipName',
      align: 'center',
      width: '12%',
    },
    {
      title: '船舶类型',
      dataIndex: 'shipType',
      align: 'center',
      width: '12%',
    },
    {
      title: '货物名称',
      dataIndex: 'goodsLevel',
      align: 'center',
      width: '12%',
    },
    {
      title: '货物类型',
      dataIndex: 'goodsType',
      align: 'center',
      width: '12%',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      align: 'center',
      width: '18%',
    }, {
      title: '操作',
      dataIndex: 'advanceOrder', //数据索引唯一标识
      align: 'center',
      render: (advanceOrder: any) => (
        <span>
          <QueryButton
            text="合同"
            type="Edit"
            event={() => this.handleIamge(advanceOrder.orderNumber, '0')}
            disabled={false}
          />
          <QueryButton
            text="详情"
            type="View"
            event={() => this.Toexamine(advanceOrder.guid, '0')}
            disabled={false}
          />
          <QueryButton
            text="申请审核"
            type="Certification"
            event={() => this.check(advanceOrder.guid, '0')}
            disabled={false}
          />
          <QueryButton
            text="取消"
            type="Delete"
            event={() => this.handleDelete(advanceOrder.orderNumber, advanceOrder.shipName, advanceOrder.goodsLevel, advanceOrder.guid)}
            disabled={false}
          />
        </span>
      ),
    }

  ];

  //初期画面状态
  state = {
    columns: this.columns,
    dataSource: dataSource,
    orderNumber: '',
    //未申请
    buttonA: undefined,
    //待审核
    buttonB: undefined,
    //未通过
    buttonC: undefined,
    //已通过
    buttonD: undefined,
    //状态
    status: this.props.match.params['status'] ? this.props.match.params['status'] : '0',
    //当前页
    currentPage: 1,
    pageSize: 10,
    total: 1,
  };

  //船舶类型选择
  selectChange = (value: string) => {
    this.setState({
      shipType: value ? value : '',
    });
  };

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getsource();
   }
  }

  //获取参数
  getsource() {
    const data_Source: AdvanceorderModel[] = [];
    let param: Map<string, any> = new Map();
    param.set('type', '1');
    param.set('checkStatus', this.state.status);
    param.set('orderNumber', this.state.orderNumber);
    param.set('currentPage', this.state.currentPage);
    param.set('pageSize', this.state.pageSize);
    param.set('data',moment());
    getRequest('/business/order', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.orders, (order, index) => {
            const entity: AdvanceorderModel = {};
            entity.reserveIndex = index +  (this.state.currentPage - 1) * this.state.pageSize+1;
            //序号和订单编号是否需要
            entity.orderNumber = order.orderNumber;
            entity.guid = order.guid;
            entity.shipName = order.shipName;
            entity.shipType = getTableEnumText('ship_type', order.shipType);
            entity.goodsLevel = getTableEnumText('goods_name', order.goodsLevel);
            entity.goodsType = getTableEnumText('goods_type', order.goodsType);
            entity.goodsCount = order.goodsCount;
            entity.loadDate = order.loadDate;
            //状态用于判断是否审核通过
            entity.checkStatus = getTableEnumText('check_status', order.checkStatus);
            entity.payStatus = order.payStatus;
            entity.orderStatus = order.orderStatus;
            entity.advanceOrder = order;
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          total:response.data.total,
        });
      }
    });
  }
  //未审核界面
  componentDidMount() {
    if (this.state.status === '0') {
      this.setState({
        buttonA: true,
        buttonB: false,
        buttonC: false,
        buttonD: false,
      }, () => {
        this.initData();
      })
    } else if (this.state.status === '1') {
      this.setState({
        buttonA: false,
        buttonB: true,
        buttonC: false,
        buttonD: false,
      }, () => {
        this.initData();
      })
    } else if (this.state.status === '2') {
      this.setState({
        buttonA: false,
        buttonB: false,
        buttonC: true,
        buttonD: false,
      }, () => {
        this.initData();
      })
    } else if (this.state.status === '3') {
      this.setState({
        buttonA: false,
        buttonB: false,
        buttonC: false,
        buttonD: true,
      }, () => {
        this.initData();
      })
    }
  }

  initData() {
    if (this.state.columns.length === 7) {
      if (this.state.buttonA) {
        this.state.columns.splice(6, 1, {
          title: '操作',
          dataIndex: 'advanceOrder',
          align: 'center',
          render: (advanceOrder: any) => (
            <span>
              <QueryButton
                text="合同"
                type="Edit"
                event={() => this.handleIamge(advanceOrder.orderNumber, '0')}
                disabled={false}
              />
              <QueryButton
                text="详情"
                type="View"
                event={() => this.Toexamine(advanceOrder.guid, '0')}
                disabled={false}
              />
              <QueryButton
                text="申请审核"
                type="Certification"
                event={() => this.check(advanceOrder.guid, '0')}
                disabled={false}
              />
              <QueryButton
                text="取消"
                type="Delete"
                event={() => this.handleDelete(advanceOrder.orderNumber, advanceOrder.shipName, advanceOrder.goodsLevel, advanceOrder.guid)}
                disabled={false}
              />
            </span>
          ),
        });
      } else if (this.state.buttonB) {
        this.state.columns.splice(6, 1, {
          title: '操作',
          dataIndex: 'advanceOrder',
          align: 'center',
          render: (advanceOrder: any) => (
            <span>
              <QueryButton
                text="合同"
                type="Edit"
                event={() => this.handleIamge(advanceOrder.orderNumber, '1')}
                disabled={false}
              />
              <QueryButton
                text="详情"
                type="View"
                event={() => this.Toexamine(advanceOrder.guid, '1')}
                disabled={false}
              />
            </span>
          ),
        });
      } else if (this.state.buttonC) {
        this.state.columns.splice(6, 1, {
          title: '操作',
          dataIndex: 'advanceOrder',
          align: 'center',
          render: (advanceOrder: any) => (
            <span>
              <QueryButton
                text="合同"
                type="Edit"
                event={() => this.handleIamge(advanceOrder.orderNumber, '2')}
                disabled={false}
              />
              <QueryButton
                text="详情"
                type="View"
                event={() => this.Toexamine(advanceOrder.guid, '2')}
                disabled={false}
              />
              <Button
                icon="form"
                size="small"
                style={{ backgroundColor: '#7CCD7C', color: '#FFFFFF' }}
                onClick={() => this.check(advanceOrder.guid, '2')}
              >
                再申请审核
            </Button>
            </span>
          ),
        });
      } else if (this.state.buttonD) {
        this.state.columns.splice(6, 1, {
          title: '操作',
          dataIndex: 'advanceOrder',
          align: 'center',
          render: (advanceOrder: any) => (
            <span>
              <QueryButton
                text="合同"
                type="Edit"
                event={() => this.handleIamge(advanceOrder.orderNumber, '3')}
                disabled={false}
              />
              <QueryButton
                text="详情"
                type="View"
                event={() => this.Toexamine(advanceOrder.guid, '3')}
                disabled={false}
              />
            </span>
          ),
        });
      }
    }
    this.getsource();
  }
  //切换未申请
  selectA = () => {
    this.setState(
      {
        columns: this.columns,
        dataSource: dataSource,
        buttonA: true,
        buttonB: false,
        buttonC: false,
        buttonD: false,
        status: '0',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //切换待审核
  selectB = () => {
    this.setState(
      {
        columns: this.columns,
        dataSource: dataSource,
        buttonA: false,
        buttonB: true,
        buttonC: false,
        buttonD: false,
        status: '1',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //切换未通过
  selectC = () => {
    this.setState(
      {
        columns: this.columns,
        dataSource: dataSource,
        buttonA: false,
        buttonB: false,
        buttonC: true,
        buttonD: false,
        status: '2',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };
  //切换已通过
  selectD = () => {
    this.setState(
      {
        columns: this.columns,
        dataSource: dataSource,
        buttonA: false,
        buttonB: false,
        buttonC: false,
        buttonD: true,
        status: '3',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

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

  //查看
  Toexamine = (guid: any, status: any) => {
    this.props.history.push('/advanceorder/view/' + guid + '/' + status);
  };

  //申请审核
  check = (guid: any, status: any) => {
    this.props.history.push('/advanceorder/check/' + guid + '/' + status);
  };

  //查看合同
  handleIamge = (orderNumber: any, status: string) => {
    this.props.history.push('/advanceorder/contract/' + orderNumber + '/' + status);
  };

  //订单取消
  handleDelete = (orderNumber: string, shipName: string, goodsLevel: string, guid: string) => {
    const search = this;
    confirm({
      title: '确定是否要取消 序号: ' + orderNumber + ' 船舶名称: ' + shipName + ' 货物名称: ' + getTableEnumText('goods_name', goodsLevel) + ' 的预订单审核？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let param: Map<string, any> = new Map();
        param.set('type', 1);
        param.set('orderNumber', orderNumber);
        deleteRequest('/business/order/' + guid, param, (response: any) => {
          if (response.status === 200) {
            message.success('取消成功');
            search.getsource();
          } else {
            message.error('取消失败');
          }
        });
      },
    });
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="预订单" event={() => this.onBack()} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '95%' }}
                  placeholder="请输入订单编号名称搜索"
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
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '11.95%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonA ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectA}
                >
                  未申请
                </Button>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '11.95%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonB ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectB}
                >
                  未审核
                </Button>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '11.91%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonC ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectC}
                >
                  未通过
                </Button>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '12%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonD ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectD}
                >
                  已通过
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Table
            rowKey={record => (!isNil(record.advanceOrder) ? record.advanceOrder : '')}
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
