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
import { AdvanceorderModel } from './BadmanModel';
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
      width: '5%',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      align: 'center',
      width: '15%',
    },
    {
      title: '航次名称',
      dataIndex: 'shipType',
      align: 'center',
    },
    {
      title: '船舶名称',
      dataIndex: 'shipName',
      align: 'center',
    },
    {
      title: '货主公司名称',
      dataIndex: 'companyName',
      align: 'center',
    },
    {
      title: '订单整体状态',
      dataIndex: 'orderTitleType',
      align: 'center',
      width: '8%',
    },
    {
      title: '支付状态',
      dataIndex: 'orderAllType',
      align: 'center',
      width: '6%',
    },
    {
      title: '支付审核',
      dataIndex: 'checkStatus',
      align: 'center',
      width: '6%',
    },

    {
      title: '发货状态',
      dataIndex: 'deliverStatus',
      align: 'center',
      width: '6%',
    },{
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
            text="授权"
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
    //国内国际
    status: this.props.match.params['status'] ? this.props.match.params['status'] : '1',
    //当前页
    currentPage: 1,
    pageSize: 10,
    total: 1,
    companyName:'',
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
    param.set('orderNumber', this.state.orderNumber);//订单编号
    param.set('companyName', this.state.companyName);//公司名称
    param.set('type', this.state.status);
    param.set('currentPage', this.state.currentPage);
    param.set('pageSize', this.state.pageSize);
    getRequest('/business/order/getOrderListForWeb', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.data, (order, index) => {
            const entity: AdvanceorderModel = {};
            entity.reserveIndex = index +  (this.state.currentPage - 1) * this.state.pageSize+1;
            //序号和订单编号是否需要
            entity.orderNumber = order.orderNumber;//订单编号
            entity.shipType =  order.shipType;//航次名称
            entity.shipName = order.shipName;//船舶名称
            entity.companyName = order.companyName;//货主公司名
            entity.orderTitleType = order.orderTitleType?order.orderTitleType===1 ?'生成订单':order.orderTitleType===2 ?'定金支付':order.orderTitleType===3 ?'运输中':order.orderTitleType===4 ?'尾款支付':order.orderTitleType===5 ?'交易完成':'':'';//支付状态
            entity.checkStatus = order.checkStatus?order.checkStatus===0?'未申请':order.checkStatus===1?'未审核':order.checkStatus===2?'未通过':order.checkStatus===3?'通过':'':'';
            entity.deliverStatus = order.deliverStatus?order.deliverStatus===0 ?'未发货':'已发货':'' ;//发货状态
            entity.orderAllType = order.orderAllType?order.orderAllType===1 ?'订单确认中':order.orderAllType===2 ?'待支付定金':order.orderAllType===3 ?'已支付定金':order.orderAllType===4 ?'已发货-运输中':order.orderAllType===5 ?'待支付尾款':order.orderAllType===6 ?'已支付尾款':order.orderAllType===7 ?'待支付服务费':order.orderAllType===8 ?'已支付服务费':order.orderAllType===9 ?'已完成':'':'';//支付状态
            //orderTitleType 支付状态 1生成订单 2定金支付 3运输中 4尾款支付 5交易完成


          // 支付状态//orderAllType: 1：订单确认中；2：待支付定金； 3：已支付定金；4：已发货-运输中；5：待支付尾款；6：已支付尾款；7待支付尾款; 8已支付尾款； 9已完成

          //支付审核   //checkStatus     0 未申请 1未审核 2未通过 3通过
          //发货状态    //deliverStatus       0未发货 1已发货


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
      //从这里往下没有用了
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
    //到这里结束
  }

  initData() {
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
        status: '1',
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
  Toexamine = (record) => {
    console.log(record)
    //orderTitleType 支付状态 1生成订单 2定金支付 3运输中 4尾款支付 5交易完成


    // 支付状态//orderAllType: 1：订单确认中；2：待支付定金； 3：已支付定金；4：已发货-运输中；5：待支付尾款；6：已支付尾款；7待支付尾款; 8已支付尾款； 9已完成
    //支付审核   //checkStatus     0 未申请 1未审核 2未通过 3通过
    //发货状态    //deliverStatus       0未发货 1已发货

    console.log(record.orderAllType)
    let add = record.orderAllType ? record.orderAllType == 1 ? 1 : record.orderAllType == 2?2:record.orderAllType==3 ? 2 :record.orderAllType==4?3:record.orderAllType==5?4:record.orderAllType==6?5:1:1;
    // this.props.history.push('/newOrder/view/' + record.guid + '/' + record.orderTitleType + '/' + record.checkStatus + '/' + record.deliverStatus);
    this.props.history.push('/newOrder/view/' + record.guid + '/' +record.orderTitleType + '/' + record.checkStatus + '/' + record.deliverStatus+'/'+ record.orderAllType);
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
                  style={{ width: '40%' }}
                  placeholder="请输入订单编号名称搜索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <Input
                  style={{ width: '40%' }}
                  placeholder="请输入公司名称搜索"
                  onChange={e => this.setState({ companyName: e.target.value })}
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
