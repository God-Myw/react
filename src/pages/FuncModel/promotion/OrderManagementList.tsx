import getRequest, { postRequest } from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Button, Col, Form, Input, message, Modal, Row, Table, Select } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { AdvanceorderModel } from './BadmanModel';
import moment from 'moment';
const InputGroup = Input.Group;
const dataSource: AdvanceorderModel[] = [];
const { confirm } = Modal;
const { Option } = Select;

class AdvanceorderListForm extends React.Component<RouteComponentProps> {

  private columns: ColumnProps<AdvanceorderModel>[] = [
    {
      title: '序号',
      dataIndex: 'reserveIndex',
      align: 'center',
      width: '5%',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      align: 'center',
      width: '15%',
    },
    {
      title: '订单日期',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '应付金额',
      dataIndex: 'amountPayable',
      align: 'center',
    },
    {
      title: '实付金额',
      dataIndex: 'actualPayment',
      align: 'center',
    },
    {
      title: '订单状态',
      dataIndex: 'orderType',
      align: 'center',

    },
    {
      title: '支付状态',
      dataIndex: 'payMoneyType',
      align: 'center',
    },
    // {
    //   title: '外部订单号',
    //   dataIndex: 'pallet_name',
    //   align: 'center',
    // },
    {
      title: '操作',
      dataIndex: 'advanceOrder', //数据索引唯一标识
      align: 'center',
      width: '15%',
      render: (advanceOrder: any) => (
        <span>
          <QueryButton
            text="查看"
            type="View"
            event={() => this.Toexamine(advanceOrder)}
            disabled={false}
          />
          {/* <QueryButton
            text="完成"
            type="Certification"
            event={() => this.check(advanceOrder.order_number, advanceOrder.pr_start, advanceOrder.pr_end, advanceOrder.guid,  '1')}
            disabled={false}
          />
          <QueryButton
            text="取消"
            type="Delete"
            event={() => this.handleDelete(advanceOrder.order_number, advanceOrder.pr_start, advanceOrder.pr_end, advanceOrder.guid, '2')}
            disabled={false}
          /> */}
        </span>
      ),
    }

  ];

  //初期画面状态
  state = {
    columns: this.columns,
    dataSource: dataSource,
    //国内国际
    status: this.props.match.params['status'] ? this.props.match.params['status'] : '1',
    //当前页
    currentPage: 1,
    pageSize: 10,
    total: 1,
    auditStatus: '',
    orderNumber: '',
    createDate: '',
    payMoneyType: '',
    prEnd: '',
  };


  //键盘监听
  keyUp: any = (e: any) => {
    if (e.keyCode === 13) {
      this.getsource();
    }
  }

  //获取参数
  getsource() {
    const data_Source: AdvanceorderModel[] = [];
    let param: Map<string, any> = new Map();
    param.set('oilNo', this.state.orderNumber);//订单编号
    param.set('orderType', localStorage.auditStatus || this.state.auditStatus);//订单状态
    param.set('payType', localStorage.payMoneyType || this.state.payMoneyType);//支付状态
    param.set('orderDate', this.state.createDate);//订单日期

    param.set('currentPage', localStorage.currentPage || this.state.currentPage);
    param.set('pageSize', this.state.pageSize);
    getRequest('/business/oil/getOilOrderListForWeb', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.result, (order, index) => {
            const entity: AdvanceorderModel = {};
            entity.reserveIndex = index + 1;
            //序号和订单编号是否需要
            entity.orderNumber = order.orderNumber;//订单编号
            entity.createDate = moment(order.createDate).format('YYYY-MM-DD');//订单日期
            entity.amountPayable = order.amountPayable;//应付金额
            entity.actualPayment = order.actualPayment;//实付金额

            entity.orderType = order.orderType === 0 ? '待退款' : order.orderType === 1 ? '已完成' : order.orderType === 2 ? '待完成' : '';//

            entity.payMoneyType = order.payMoneyType === 1 ? '等待支付' : order.payMoneyType === 2 ? '支付成功(未扫码)' : order.payMoneyType === 3 ? '支付成功（已扫码）' : order.payMoneyType === 4 ? '退款中' : order.payMoneyType === 5 ? '退款完成' : '';//

            entity.guid = order.guid;
            // entity.goodsLevel = getTableEnumText('goods_name', order.goodsLevel);
            // entity.goodsType = getTableEnumText('goods_type', order.goodsType);
            // entity.loadDate = order.loadDate;
            //状态用于判断是否审核通过
            entity.payStatus = order.payStatus;
            entity.orderStatus = order.orderStatus;
            entity.advanceOrder = order;
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
        });
      }
    });
  }

  // //目的地
  // mudidi() {
  //   const data_Source: AdvanceorderModel[] = [];
  //   let param: Map<string, any> = new Map();

  //   getRequest('/business/truck/getPrEndListForWeb', param, (response: any) => {
  //     console.log(response)
  //     if (response.status === 200) {
  //       if (!isNil(response.data)) {
  //           this.setState({
  //             mudidi:response.data,
  //           });
  //       }
  //     }
  //   });
  // }

  //  //出发地
  //  chufadi() {
  //   const data_Source: AdvanceorderModel[] = [];
  //   let param: Map<string, any> = new Map();
  //   getRequest('/business/truck/getPrStartListForWeb', param, (response: any) => {
  //     console.log(response)
  //     if (response.status === 200) {
  //       if (!isNil(response.data)) {
  //           this.setState({
  //             chufadi:response.data,
  //           });
  //       }
  //     }
  //   });
  // }

  componentDidMount() {
    this.initData();
    this.setState({
      currentPage: localStorage.currentPage
    });
    localStorage.currentPage
      ? (localStorage.removeItem('currentPage'))
      : (localStorage.currentPage = this.state.currentPage);
    localStorage.auditStatus
      ? (localStorage.removeItem('auditStatus'))
      : (localStorage.auditStatus = this.state.auditStatus);
    localStorage.payMoneyType
      ? (localStorage.removeItem('payMoneyType'))
      : (localStorage.payMoneyType = this.state.payMoneyType);
  }

  initData() {
    this.getsource();
    // this.mudidi();
    // this.chufadi();
  }
  //搜索
  findAll() {
    localStorage.auditStatus = this.state.auditStatus;
    localStorage.payMoneyType = this.state.payMoneyType;
    this.getsource();
  }


  //修改当前页码
  changePage = (page: any) => {
    localStorage.currentPage = page
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


  //订单状态
  handleChange = (value: any) => {
    this.setState({
      auditStatus: value || '',
    });
  };

  //支付状态查询
  zhifuzhuangtai = (value: any) => {
    this.setState({
      payMoneyType: value || '',
    });
  };


  //查看
  Toexamine = (record) => {
    console.log(record)

    this.props.history.push('/promotion/view/' + record.guid);
  };

  fanlijin = () => {
    this.props.history.push('/promotion/listfan');
  }

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="加油订单" event={() => this.onBack()} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '16%' }}
                  placeholder="请输入订单编号名称搜索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}

                />
                <span style={{ width: '1%' }}></span>
                <Select defaultValue="请选择订单状态查询" allowClear={true} style={{ width: '14%' }} onChange={this.handleChange}>
                  <Option value="0">待退款</Option>
                  <Option value="1">已完成</Option>
                  <Option value="2">待完成</Option>
                </Select>
                <span style={{ width: '1%' }}></span>
                <Select defaultValue="请选择支付状态查询" allowClear={true} style={{ width: '14%' }} onChange={this.zhifuzhuangtai}>
                  <Option value="1">等待支付</Option>
                  <Option value="2">支付成功（未扫码）</Option>
                  <Option value="3">支付成功（已支付）</Option>
                  <Option value="4">退款中</Option>
                  <Option value="5">退款完成</Option>
                </Select>
                <span style={{ width: '1%' }}></span>

                <Input
                  style={{ width: '34%' }}
                  placeholder="请输入订单日期查询，格式为：xxxx-xx-xx (例：2021-05-12或2021-07-07)"
                  onChange={e => this.setState({ createDate: e.target.value })}
                // onKeyUp={this.keyUp}
                />
                <span style={{ width: '1%' }}></span>

                <QueryButton
                  type="Query"
                  text="搜索"
                  event={() => this.findAll()}
                  disabled={true}
                />


                <span style={{ width: '1%' }}></span>

                {/* <button style={{height:'32px',}} onClick={this.fanlijin }>
                  用户返利列表
                </button> */}
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
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
