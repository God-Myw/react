import getRequest from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Col, Form, Input, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { SubmissionModel } from './SubmissionModel';
import moment from 'moment';
const InputGroup = Input.Group;

const columns: ColumnProps<SubmissionModel>[] = [
  {
    title: '序号',
    dataIndex: 'reserveIndex',
    align: 'center',
  },
  {
    title: '订单编号',
    dataIndex: 'orderNumber',
    align: 'center',
  },
  {
    title: '船舶名称',
    dataIndex: 'shipName',
    align: 'center',
  },
  {
    title: '船舶类型',
    dataIndex: 'shipType',
    align: 'center',
  },
  {
    title: '货物名称',
    dataIndex: 'goodsLevel',
    align: 'center',
  },
  {
    title: '货物类型',
    dataIndex: 'goodsType',
    align: 'center',
  },
];

class SubmissionListForm extends React.Component<RouteComponentProps> {
  state = {
    //列
    columns: columns,
    //表数据
    dataSource: [],
    //货物名称
    //货品类型
    shipType: '',
    currentPage: 1,
    pageSize: 10,
    orderNumber: '',
    total: 1,
  };

  //初期华事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    if (this.state.columns.length === 6) {
      this.state.columns.push({
        title: '操作',
        dataIndex: 'order',
        align: 'center',
        width: '16%',
        render: (order: any) => (
          <span>
            <QueryButton text={order.ladingBill === 1 ? '已提单' : '提单'} type="Edit" event={() => this.handleEdit(order)} disabled={order.orderStatus !== 1 && order.ladingBill === 1} />
            &nbsp;
            <QueryButton text="查看" type="View" event={() => this.handleView(order)} disabled={false} />
          </span>
        ),
      });
    } else if (this.state.columns.length === 7) {
      this.state.columns.splice(6, 1, {
        title: '操作',
        dataIndex: 'order',
        align: 'center',
        width: '16%',
        render: (order: any) => (
          <span>
            <QueryButton text={order.ladingBill === 1 ? '已提单' : '提单'} type="Edit" event={() => this.handleEdit(order)} disabled={order.orderStatus !== 1 && order.ladingBill === 1} />
            &nbsp;
            <QueryButton text="查看" type="View" event={() => this.handleView(order)} disabled={false} />
          </span>
        ),
      });
    }
    this.getSubmissionList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getSubmissionList();
   }
  }

  //获取表格数据
  getSubmissionList() {
    const data_Source: SubmissionModel[] = [];
    let param: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    param.set('type', 3);
    param.set('orderNumber', this.state.orderNumber);
    param.set('pageSize', this.state.pageSize);
    param.set('currentPage', this.state.currentPage);
    param.set('data', moment());
    getRequest('/business/order', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.orders, (order, index) => {
            const entity: SubmissionModel = {};
            entity.reserveIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.guid = order.guid;
            entity.orderNumber = order.orderNumber;
            entity.shipName = order.shipName;
            entity.shipType = getTableEnumText('ship_type', order.shipType);
            entity.goodsLevel = getTableEnumText('goods_name', order.goodsLevel);
            entity.goodsType = getTableEnumText('goods_type', order.goodsType);
            entity.ladingBill = order.ladingBill;
            entity.order = order;
            data_Source.push(entity);
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

  //检索事件
  search() {
    this.setState({
      currentPage: 1,
    }, () => {
      this.getSubmissionList();
    });
  }

  handleEdit = (order: any) => {
    this.props.history.push('/submission/edit/' + order.orderNumber + '/' + order.guid);
  };

  handleView = (order: any) => {
    this.props.history.push('/submission/view/' + order.orderNumber + '/' + order.guid);
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

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="提单" event={() => { this.props.history.push('/index_menu/'); }} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '95%' }}
                  placeholder="请输入订单编号搜索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <QueryButton type="Query" text="搜索" event={this.search.bind(this)} disabled={false} />
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

const SubmissionList_Form = Form.create({ name: 'SubmissionList_Form' })(SubmissionListForm);

export default SubmissionList_Form;
