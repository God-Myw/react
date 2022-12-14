import getRequest, { postRequest } from '@/utils/request';
import { Col, Form, Input, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import { assign, forEach, isNil } from 'lodash';
import React from 'react';
import { AnyAction, Dispatch } from 'redux';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import QueryButton from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import { OrderModel } from './../OrderModel';
import { getTableEnumText } from '@/utils/utils';
import { RouteComponentProps } from 'dva/router';

const InputGroup = Input.Group;

class OrderManagementListForm extends React.Component<RouteComponentProps & { dispatch: Dispatch<AnyAction>; unreadCount: number }> {
  private timer!: NodeJS.Timeout;
  private columns: ColumnProps<OrderModel>[] = [
    {
      title: <FormattedMessage id="OrderManagement-OrderManagementList.shipname" />,
      dataIndex: 'voyageName',
      align: 'left',
    },
    {
      title: <FormattedMessage id="OrderManagement-OrderManagementList.code" />,
      dataIndex: 'orderNumber',
      align: 'center',
      render: (text, row, index) => {
        if (row.voyageName == undefined) {
          return text;
        }
        return {
          props: {
            colSpan: 6,
          },
        };
      },
    },
    {
      title: <FormattedMessage id="OrderManagement-OrderManagementList.ordername" />,
      dataIndex: 'goodsLevel',
      align: 'center',
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {
            colSpan: 1,
          },
        };
        if (row.voyageName !== undefined) {
          obj.props.colSpan = 0;
        }
        return obj;
      },
    },
    {
      title: <FormattedMessage id="OrderManagement-OrderManagementList.ordertype" />,
      dataIndex: 'goodsType',
      align: 'center',
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {
            colSpan: 1,
          },
        };
        if (row.voyageName !== undefined) {
          obj.props.colSpan = 0;
        }
        return obj;
      },
    },
    {
      title: <FormattedMessage id="OrderManagement-OrderManagementList.pay.status" />,
      dataIndex: 'payStatus',
      align: 'center',
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {
            colSpan: 1,
          },
        };
        if (row.voyageName !== undefined) {
          obj.props.colSpan = 0;
        }
        if (text == 0) {
          return formatMessage({ id: 'OrderManagement-MyOrder.not.pay' });
        } else if (text == 1) {
          return formatMessage({ id: 'OrderManagement-MyOrder.pay.deposit' });
        } else if (text == 2) {
          return formatMessage({ id: 'OrderManagement-MyOrder.pay.final' });
        } else {
          return obj;
        }
      },
    },
    {
      title: <FormattedMessage id="OrderManagement-DeliveryStatus.status" />,
      dataIndex: 'deliverStatus',
      align: 'center',
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {
            colSpan: 1,
          },
        };
        if (row.voyageName !== undefined) {
          obj.props.colSpan = 0;
        }
        if (text == 0) {
          return formatMessage({ id: 'OrderManagement-MyOrder.not.shipped' });
        } else if (text == 1) {
          return formatMessage({ id: 'OrderManagement-MyOrder.shipped' });
        } else {
          return obj;
        }
      },
    },
    {
      title: <FormattedMessage id="OrderManagement-OrderStatus.orderstatus" />,
      dataIndex: 'orderStatus',
      align: 'center',
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {
            colSpan: 1,
          },
        };
        if (row.voyageName !== undefined) {
          obj.props.colSpan = 0;
        }
        if (text == 0) {
          return formatMessage({ id: 'OrderManagement-MyOrder.not.close' });
        } else if (text == 1) {
          return formatMessage({ id: 'OrderManagement-MyOrder.finished' });
        } else if (text == 2) {
          return formatMessage({ id: 'OrderManagement-MyOrder.closed' });
        } else {
          return obj;
        }
      },
    },
    {
      title: formatMessage({ id: 'OrderManagement-OrderManagementList.operation' }),
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: any, record: any) => (
        guid == null ? null :
          <div>
            <QueryButton text={formatMessage({ id: 'OrderManagement-OrderManagementList.view' })} type="View" event={() => this.handleView(record)} disabled={false} />
            <QueryButton text={formatMessage({ id: 'OrderManagement-MyOrder.consult' })} type="consultation" event={() => this.handleConsultation(record)} 
              disabled={!isNil(record)&&!isNil(record.orderStatus)&&record.orderStatus==2} />
          </div>

      ),
    },
  ];

  state = {
    tablekey: 1,
    dataSource: [],
    columns: this.columns,
    orderNumber: '',
    //当前页
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };

  //初期化
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentDidMount() {
    this.initData();
  }
  //模拟数据
  initData() {
    this.getOrderList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getOrderList();
   }
  }

  handleConsultation = (record: any) => {
    let param= {
      type: 1,
      fromUser: localStorage.getItem('userId'),
      toUser: record.trackServiceId
    };
    postRequest('/sys/chat/relation', JSON.stringify(param), (response: any) => {
      if (response.status === 200) {
        const { dispatch } = this.props;
        if (dispatch) {
          dispatch({
            type: 'menu/changeShowChat',
            payload: {
              isShow: false,
              visible: false,
            },
          });
          this.timer = setTimeout(() => {
            dispatch({
              type: 'menu/changeShowChat',
              payload: {
                isShow: true,
                visible: true,
              },
            });
          }, 500);
        }
      }
    });
  };

  //准备参数
  setParams(): Map<string, string> {
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', 2);
    params.set('pageSize', 10);
    params.set('currentPage', this.state.currentPage);
    if (!isNil(this.state.orderNumber) && this.state.orderNumber !== '') {
      params.set('orderNumber', this.state.orderNumber);
    }
    return params;
  }

  //获取表格数据
  getOrderList() {
    const data_Source: OrderModel[] = [];

    let param = this.setParams();
    // 初期化固定是PC账号密码登录
    getRequest('/business/order', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.orders, (order, index) => {
            const entity: OrderModel = {};
            forEach(order.orderPallets, (item, index) => {
              item.goodsLevel = getTableEnumText('goods_name', item.goodsLevel);
              item.goodsType = getTableEnumText('goods_type', item.goodsType);
              item.trackServiceId = order.trackServiceId;
            });
            assign(entity, order);
            entity.children = order.orderPallets;
            entity.entity = order;
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
          tablekey: Math.random()*100,
        });
      }
    });
  }

  //检索事件
  search() {
    this.setState({
      currentPage: 1,
    }, () => {
      this.getOrderList();
    });
  }

  //修改当前页码
  changePage = (page: any) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getOrderList();
      },
    );
  };

  handleView = (record: any) => {
    const userType = localStorage.getItem('userType');
    if (userType === '5') {
      this.props.history.push('/orderManagementowner/view/' + record.guid + '/' + record.payStatus + '/' + record.deliverStatus + '/' + record.orderStatus);
    } else {
      this.props.history.push('/orderManagement/view/' + record.guid + '/' + record.payStatus + '/' + record.deliverStatus + '/' + record.orderStatus);
    }
  };

  // 返回
  onBack = () => {
    this.props.history.push('/index_menu/');
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={formatMessage({ id: 'OrderManagement-OrderManagementList.management' })} event={() => { this.props.history.push('/index_menu/'); }} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input style={{ width: '95%' }} placeholder={formatMessage({ id: 'OrderManagement-OrderManagementList.input.search' })} onChange={e => this.setState({ orderNumber: e.target.value })} 
                  onKeyUp={this.keyUp}
                />
                <QueryButton type="Query" text={formatMessage({ id: 'OrderManagement-OrderManagementList.search' })} event={this.search.bind(this)} disabled={false} />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Table
            className='myOrder'
            bordered
            key={this.state.tablekey}
            defaultExpandAllRows={true}
            columns={this.state.columns}
            size="small"
            dataSource={this.state.dataSource}
            rowClassName={(record, index) =>
              record.voyageName != undefined ? commonCss.dataRowOdd : commonCss.dataRowEven
            }
            pagination={{
              current: this.state.currentPage,
              showQuickJumper: true,
              pageSize: this.state.pageSize,
              total: this.state.total,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  <FormattedMessage id="OrderManagement-OrderManagementList.total" />{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  <FormattedMessage id="OrderManagement-OrderManagementList.pages" />
                  {this.state.pageSize}<FormattedMessage id="OrderManagement-OrderManagementList.records" />
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

const OrderManagementListFormDisplay = Form.create({ name: 'OrderManagementListForm' })(
  OrderManagementListForm,
);
function mapStateToProps(state: { menu: { isShow: boolean; visible: boolean, unreadCount: number } }) {
  const { isShow, visible, unreadCount } = state.menu;
  return {
    isShow,
    visible,
    unreadCount
  };
}
export default connect(mapStateToProps)(OrderManagementListFormDisplay);
