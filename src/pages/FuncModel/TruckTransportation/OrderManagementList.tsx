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
      width: '13%',
    },
    {
      title: '订单日期',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '出发地',
      dataIndex: 'prStart',
      align: 'center',
    },
    {
      title: '目的地',
      dataIndex: 'prEnd',
      align: 'center',

    },
    {
      title: '车型',
      dataIndex: 'car_name',
      align: 'center',
    },
    {
      title: '货物名称',
      dataIndex: 'pallet_name',
      align: 'center',
      width: '6%',
    },
    {
      title: '订单状态',
      dataIndex: 'audit_status',
      align: 'center',
      width: '6%',
    },
    {
      title: '操作',
      dataIndex: 'advanceOrder', //数据索引唯一标识
      align: 'center',
      width: '15%',
      render: (advanceOrder: any) => (
        <span>
          <QueryButton
            text="操作"
            type="View"
            event={() => this.Toexamine(advanceOrder)}
            disabled={false}
          />
          <QueryButton
            text="完成"
            type="Certification"
            event={() => this.check(advanceOrder.order_number, advanceOrder.pr_start, advanceOrder.pr_end, advanceOrder.guid, '1')}
            disabled={false}
          />
          <QueryButton
            text="取消"
            type="Delete"
            event={() => this.handleDelete(advanceOrder.order_number, advanceOrder.pr_start, advanceOrder.pr_end, advanceOrder.guid, '2')}
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
    //国内国际
    status: this.props.match.params['status'] ? this.props.match.params['status'] : '1',
    //当前页
    currentPage: 1,
    pageSize: 10,
    total: 1,
    auditStatus: '',
    orderNumber: '',
    createDate: '',
    prStart: '',
    prEnd: '',
  };
  componentDidMount() {
    this.initData();
    this.setState({
      currentPage: localStorage.currentPage
    });
    localStorage.currentPage
      ? (localStorage.removeItem('currentPage'))
      : (localStorage.currentPage = this.state.currentPage);
    localStorage.prStart
      ? (localStorage.removeItem('prStart'))
      : (localStorage.prStart = this.state.prStart);
    localStorage.prEnd
      ? (localStorage.removeItem('prEnd'))
      : (localStorage.prEnd = this.state.prEnd);
    localStorage.auditStatus
      ? (localStorage.removeItem('auditStatus'))
      : (localStorage.auditStatus = this.state.auditStatus);
  }

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
    param.set('auditStatus', localStorage.auditStatus || this.state.auditStatus);//订单状态
    param.set('orderNumber', this.state.orderNumber);//订单编号
    param.set('createDate', this.state.createDate);//订单日期
    param.set('prStart', localStorage.prStart || this.state.prStart);//出发地
    param.set('prEnd', localStorage.prEnd || this.state.prEnd);//目的地
    param.set('currentPage', localStorage.currentPage || this.state.currentPage);
    param.set('pageSize', this.state.pageSize);
    getRequest('/business/truck/getTruckOrderListForWeb', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.result, (order, index) => {
            const entity: AdvanceorderModel = {};
            entity.reserveIndex = index + 1;
            //序号和订单编号是否需要
            entity.orderNumber = order.order_number;//订单编号
            entity.createDate = order.create_dates;//订单日期
            entity.prStart = order.pr_start;//出发地
            entity.prEnd = order.pr_end;//目的地
            entity.car_name = order.car_name;//车型
            entity.pallet_name = order.pallet_name;//货物名称
            entity.audit_status = order.audit_status === 0 ? '进行中' : order.audit_status === 1 ? '已完成' : order.audit_status === 2 ? '已取消' : '';//订单状态 0进行中1已完成2已取消
            entity.guid = order.guid;
            entity.goodsLevel = getTableEnumText('goods_name', order.goodsLevel);
            entity.goodsType = getTableEnumText('goods_type', order.goodsType);
            entity.loadDate = order.loadDate;
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

  //目的地
  mudidi() {
    const data_Source: AdvanceorderModel[] = [];
    let param: Map<string, any> = new Map();

    getRequest('/business/truck/getPrEndListForWeb', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            mudidi: response.data,
          });
        }
      }
    });
  }

  //出发地
  chufadi() {
    const data_Source: AdvanceorderModel[] = [];
    let param: Map<string, any> = new Map();
    getRequest('/business/truck/getPrStartListForWeb', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          this.setState({
            chufadi: response.data,
          });
        }
      }
    });
  }

  initData() {
    this.getsource();
    this.mudidi();
    this.chufadi();
  }
  //搜索
  findAll() {
    localStorage.prStart = this.state.prStart;
    localStorage.prEnd = this.state.prEnd;
    localStorage.auditStatus = this.state.auditStatus;
    localStorage.currentPage = 1
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
      auditStatus: value == undefined ? '' : value,
    });
  };
  //出发地
  chufa = (value: any) => {
    this.setState({
      prStart: value == undefined ? '' : value,
    });
  };
  //目的地
  mudi = (value: any) => {
    this.setState({
      prEnd: value == undefined ? '' : value,
    });
  };

  //查看
  Toexamine = (record) => {
    console.log(record)

    this.props.history.push('/truckTransportation/view/' + record.guid);
  };

  //订单完成
  check = (orderNumber: string, prStart: string, pr_end: string, guid: string, status: string) => {
    const search = this;
    confirm({
      title: '确定是否要完成 序号: ' + (orderNumber ? orderNumber : '无') + ' 出发地: ' + prStart + ' 目的地: ' + pr_end + ' 的卡车运输？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let requestData;

        postRequest('/business/truck/updateTruckOrderStatus?guid=' + guid + '&auditStatus=' + status, JSON.stringify(requestData), (response: any) => {
          console.log(response)
          if (response.status === 200) {
            // 跳转首页
            message.success('提交成功');
            window.location.reload(true)
            // this.props.history.push('/truckTransportation/list');
          } else {
            message.error('提交失败');
          }
        });
      },
    });
  };

  //订单取消
  handleDelete = (orderNumber: string, prStart: string, pr_end: string, guid: string, status: string) => {
    const search = this;
    confirm({
      title: '确定是否要取消 序号: ' + (orderNumber ? orderNumber : '无') + ' 出发地: ' + prStart + ' 目的地: ' + pr_end + ' 的卡车运输？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let requestData;

        postRequest('/business/truck/updateTruckOrderStatus?guid=' + guid + '&auditStatus=' + status, JSON.stringify(requestData), (response: any) => {
          console.log(response)
          if (response.status === 200) {
            // 跳转首页
            message.success('提交成功');
            window.location.reload(true)
            // this.props.history.push('/truckTransportation/list');
          } else {
            message.error('提交失败');
          }
        });
      },
    });
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="卡车订单" event={() => this.onBack()} />
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
                <Select defaultValue="请选择订单状态查询" allowClear={true} style={{ width: '15%' }} onChange={this.handleChange}>
                  <Option value="0">进行中</Option>
                  <Option value="1">已完成</Option>
                  <Option value="2">已取消</Option>
                </Select>
                <span style={{ width: '1%' }}></span>

                <Select defaultValue="请选择出发地" allowClear={true} style={{ width: '10%' }} onChange={this.chufa}>
                  {isNil(this.state) || isNil(this.state.chufadi) ? '' : this.state.chufadi.map((item: any) => (
                    <option value={item}>{item}</option>
                  ))}
                </Select>

                <span style={{ width: '1%' }}></span>
                <Select defaultValue="请选择目的地" allowClear={true} style={{ width: '10%' }} onChange={this.mudi}>
                  {isNil(this.state) || isNil(this.state.mudidi) ? '' : this.state.mudidi.map((item: any) => (
                    <option value={item}>{item}</option>
                  ))}
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
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          {/* <Row gutter={24}>
            <Col span={24}>
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
                  国际货盘
                </Button>
              </Form.Item>

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
                  国内货盘
                </Button>
              </Form.Item>


            </Col>
          </Row> */}
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
