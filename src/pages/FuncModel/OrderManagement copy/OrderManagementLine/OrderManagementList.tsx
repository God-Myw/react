import getRequest, { deleteRequest, postRequest } from '@/utils/request';
import { Checkbox, Col, Form, Icon, Input, message, Modal, Row, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { assign, forEach, isNil } from 'lodash';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import QueryButton from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import { OrderModel } from './../OrderModel';
import { UserModel } from './UserModel';
const InputGroup = Input.Group;
const { confirm } = Modal;


const userdata: UserModel[] = [];


type OrderFormProps = RouteComponentProps & FormComponentProps;

class OrderManagementListForm extends React.Component<OrderFormProps> {
  private userType = localStorage.getItem('userType');
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
            colSpan: 4,
          },
        };
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
          return '未支付';
        } else if (text == 1) {
          return '已支付定金';
        } else if (text == 2) {
          return '已支付尾款';
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
          return '未发货';
        } else if (text == 1) {
          return '已发货';
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
          return '未结算';
        } else if (text == 1) {
          return '已完成';
        } else if (text == 2) {
          return '已结算';
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
      render: (guid: any, record: any, index: number) => (
        guid == null ?
          <Col>{localStorage.getItem('userType') === '1' ? <QueryButton text={record.name} type="Authorization" event={() => this.handleAuthorization(record)} disabled={Number(record.trackServiceId) == Number(localStorage.getItem('userId')) ? false : true} /> : null} </Col>
          :
          <Col>
            <QueryButton text={formatMessage({ id: 'OrderManagement-OrderManagementList.view' })} type="View" event={() => this.handleView(record)} disabled={false} />
            {localStorage.getItem('userType') === '1' ? <QueryButton text="取消" type="Delete" event={() => this.handleCancel(record)} disabled={record.orderStatus === 2 ? true : false} /> : null}
            {localStorage.getItem('userType') === '3' ? <QueryButton text="结算" type="Settlement" event={() => this.handleSettlement(guid)}
              disabled={!isNil(record) && !isNil(record.payStatus) && !isNil(record.orderStatus) && record.payStatus == 2 && record.orderStatus == 1} /> : null}
          </Col>
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
    modalVisible: false,
    allUser: userdata,
    checkedValues: [],
    voyageId: '',
    old: [],
    has: [],
  };

  //初期化
  componentDidMount() {
    this.initData();
  }
  //模拟数据
  initData() {
    this.getOrderList();
  }

  //键盘监听
  keyUp: any = (e: any) => {
    if (e.keyCode === 13) {
      this.getOrderList();
    }
  }

  //取消
  handleCancel = (record: any) => {
    confirm({
      title: '确定要取消 订单编号为' + record.orderNumber + '的订单吗',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let param: Map<string, any> = new Map();
        param.set('type', 2);
        param.set('orderNumber', record.orderNumber)
        deleteRequest('/business/order/' + record.guid, param, (response: any) => {
          if (response.status === 200) {
            message.success('取消成功');
            location.reload(true)
          } else {
            message.error('取消失败');
          }
        });
      },
    });
  }

  //授权
  handleAuthorization = (guid: any) => {
    if (Number(guid.voyageId) != Number(this.state.voyageId)) {
      this.setState({
        modalVisible: true,
        voyageId: guid.voyageId,
        checkedValues: guid.grantedUserId ? [guid.grantedUserId] : [],
        old: guid.grantedUserId ? [guid.grantedUserId] : [],
        has: guid.grantedUserId ? [guid.grantedUserId] : [],
      });
    } else {
      this.setState({
        modalVisible: true,
        voyageId: guid.voyageId,
      });
    }
  };

  // modal click OK
  handleOk = () => {
    const self = this;
    if (this.state.checkedValues.length > 1) {
      message.error('只能授权一个客服!')
    } else if (this.state.checkedValues.length === 1 && this.state.old[0] != this.state.checkedValues[0]) {
      if (this.state.has.length === 0) {
        this.state.checkedValues.splice(0, this.state.checkedValues.length - 1)
        let requestData = {};
        requestData = {
          voyageId: this.state.voyageId,
          grantedUserId: this.state.checkedValues[0],
        };
        // 修改请求
        postRequest('/business/grant', JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {
            message.success('授权成功!')
            this.setState({
              modalVisible: false,
              old: this.state.checkedValues,
              has: this.state.checkedValues,
            });
            self.initData();
          } else {
            message.error('授权失败!')
          }
        });
      } else {
        message.error('已授权，请先取消授权!')
      }
    } else if (this.state.checkedValues.length === 1 && this.state.old[0] === this.state.checkedValues[0]) {
      message.error('已授权给该客服!')
    } else if (this.state.checkedValues.length === 0) {
      let param: Map<string, string> = new Map();
      param.set('voyageId', this.state.voyageId);
      // 修改请求
      deleteRequest('/business/grant', param, (response: any) => {
        if (response.status === 200) {
          message.success('取消授权成功!')
          this.setState({
            has: [],
            old: [],
            modalVisible: false,
          });
          self.initData();
        } else {
          message.error('取消授权失败,目前没有被授权客服!')
        }
      });
    }
  };

  //复选框选择
  onChange = (checkedValues: any) => {
    if (checkedValues.length >= 0) {
      this.setState({
        checkedValues: checkedValues
      })
    }
  }

  handleClose = () => {
    this.setState({
      modalVisible: false,
    });
  }

  handleSettlement = (guid: any) => {
    this.props.history.push('/orderManagementExamine/settlement/' + guid);
  };

  //准备参数
  setParams(): Map<string, string> {
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', 2);
    params.set('pageSize', 10);
    params.set('currentPage', this.state.currentPage);
    if (!isNil(this.state.orderNumber) && this.state.orderNumber != '') {
      params.set('orderNumber', this.state.orderNumber);
    }
    return params;
  }

  //获取表格数据
  getOrderList() {
    const data_Source: OrderModel[] = [];
    const users: UserModel[] = [];
    let param = this.setParams();
    // 初期化固定是PC账号密码登录
    getRequest('/business/order', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.orders, (order, index) => {
            const entity: OrderModel = {};
            assign(entity, order);
            entity.children = order.orderPallets;
            entity.entity = order;
            entity.name = isNil(order.grantedUserId) ? '授权' : '已授权';
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
          tablekey: Math.random() * 100,
        });
      }
    });
    let params: Map<string, any> = new Map();
    params.set('type', 2);
    params.set('pageSize', 10);
    params.set('currentPage', this.state.currentPage);
    getRequest('/sys/user/service', params, (response: any) => {

      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.users, (user, index) => {
            const entity: UserModel = {};
            if (user.accountId != localStorage.getItem('accountId')) {
              entity.accountId = user.accountId;
              entity.guid = user.guid;
              users.push(entity);
            }
          });
        }
        this.setState({
          allUser: users,
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
    if (userType === '1') {
      this.props.history.push('/orderManagementON/view/' + record.guid + '/' + record.payStatus + '/' + record.deliverStatus + '/' + record.orderStatus);
    } else if (userType === '2') {
      this.props.history.push('/orderManagementOff/view/' + record.guid + '/' + record.payStatus + '/' + record.deliverStatus + '/' + record.orderStatus);
    } else if (userType === '3') {
      this.props.history.push('/orderManagementExamine/view/' + record.guid + '/' + record.payStatus + '/' + record.deliverStatus + '/' + record.orderStatus);
    }
  };

  // 返回
  onBack = () => {
    this.props.history.push('/index_menu/');
  };

  render() {
    let displayResult = [];
    const { allUser } = this.state;
    for (let user of allUser) {
      displayResult.push(
        <Col span={allUser.length<3 && allUser.length === 2 ? 12:8} style={{ textAlign: 'left', padding: '15px' }}>
          <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hiddden', display: 'block', OTextOverflow: 'ellipsis' }}>
            <Checkbox style={{ fontSize: '16px' }} value={user.guid}><span>{user.accountId}</span></Checkbox>
          </span>
        </Col>
      );
    }
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={formatMessage({ id: 'OrderManagement-OrderManagementList.ordermanagement' })} event={() => { this.props.history.push('/index_menu/'); }} />
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
        <Modal visible={isNil(this.state) ||
          isNil(this.state.modalVisible)
          ? false
          : this.state.modalVisible} onOk={this.handleOk} onCancel={this.handleClose}
          closable={false}
          bodyStyle={{ padding: '0px' }}>
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>授权</span>
              <Icon className={commonCss.icon} type="close-circle" onClick={this.handleClose} />
            </div>
            <div className={commonCss.AddForm}>
              <Form labelAlign="left">
                <Checkbox.Group onChange={this.onChange} value={this.state.checkedValues}>
                  <Row gutter={24}>
                    {displayResult}
                  </Row>
                </Checkbox.Group>
              </Form>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const OrderManagementListFormDisplay = Form.create({ name: 'OrderManagementListForm' })(
  OrderManagementListForm,
);

export default OrderManagementListFormDisplay;
