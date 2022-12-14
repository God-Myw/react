import getRequest, { postRequest, putRequest } from '@/utils/request';
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
      title: '申请时间',
      dataIndex: 'createDate',
      align: 'center',
      // width: '13%',
    },
    {
      title: '公司名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '申请类型',
      dataIndex: 'userAuthType',
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'contacter',
      align: 'center',

    },
    {
      title: '联系方式',
      dataIndex: 'contactPhone',
      align: 'center',
    },
    {
      title: '地址',
      dataIndex: 'province',
      align: 'center',
    },
    {
      title: '资质名称',
      dataIndex: 'packageTypeCn',
      align: 'center',
    },
    {
      title: '支付金额',
      dataIndex: 'moneyCount',
      align: 'center',
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      align: 'center',
    },
    {
      title: '到期日期',
      dataIndex: 'endDate',
      align: 'center',
    },
    {
      title: '资质状态',
      dataIndex: 'auditStatus',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'advanceOrder', //数据索引唯一标识
      align: 'center',
      width: '20%',
      render: (advanceOrder: any) => (
        <span>
          <QueryButton
            text="查看"
            type="View"
            event={() => this.Toexamine(advanceOrder)}
            disabled={false}
          />
          {/* {
            (advanceOrder.auditStatus==1 || advanceOrder.auditStatus==2)
          } */}
          <QueryButton
            text="审核通过"
            type="Certification"
            event={() => this.check(advanceOrder.name, advanceOrder.contacter, advanceOrder.packageTypeCn, advanceOrder.guid, '1')}
            disabled={advanceOrder.auditStatus == 1 ? true : advanceOrder.auditStatus == 2 ? true : false}
          />
          <QueryButton
            text="驳回"
            type="Delete"
            event={() => this.handleDelete(advanceOrder.name, advanceOrder.contacter, advanceOrder.packageTypeCn, advanceOrder.guid, '2')}
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
    // auditStatus:'',
    // orderNumber: '',
    // createDate:'',
    // prStart:'',
    // prEnd:'',
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
    param.set('currentPage', localStorage.currentPage || this.state.currentPage);
    param.set('pageSize', this.state.pageSize);
    getRequest('/business/specialVehicle/getSpecialVehicleAuthList', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.records, (order, index) => {
            const entity: AdvanceorderModel = {};
            entity.reserveIndex = index + 1;
            //序号和订单编号是否需要
            entity.orderNumber = order.order_number;//订单编号
            entity.createDate = moment(order.createDate).format('YYYY-MM-DD');

            entity.name = order.name;
            entity.userAuthType = order.userAuthType ? order.userAuthType == 1 ? '个人认证' : '企业认证' : '';
            entity.contacter = order.contacter;
            entity.contactPhone = order.contactPhone;
            entity.province = order.province;
            entity.packageTypeCn = order.packageTypeCn;
            entity.moneyCount = order.moneyCount;
            entity.paymentStatus = order.paymentStatus == 0 ? '已支付' : order.paymentStatus == 1 ? '已退款' : '';
            entity.endDate = order.endDate ? (moment(order.endDate).format('YYYY-MM-DD')) : '';
            entity.auditStatus = order.auditStatus == 0 ? '待审核' : order.auditStatus == 1 ? '审核通过' : order.auditStatus == 2 ? '审核驳回' : '';
            // entity.orderNumber = order.order_number;//订单编号
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



  componentDidMount() {
    this.initData();
    this.setState({
      currentPage: localStorage.currentPage
    });
    localStorage.currentPage
      ? (localStorage.removeItem('currentPage'))
      : (localStorage.currentPage = this.state.currentPage);
  }

  initData() {
    this.getsource();

  }


  //修改当前页码
  changePage = (page: any) => {
    localStorage.currentPage = page;
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



  //查看
  Toexamine = (record) => {
    console.log(record)

    this.props.history.push('/specialShip/view/' + record.guid);
  };

  //订单完成
  check = (orderNumber: string, prStart: string, pr_end: string, guid: string, status: string) => {
    const search = this;
    confirm({
      title: '确定是否要审核通过 公司名称: ' + (orderNumber ? orderNumber : '无') + ' 联系人: ' + (prStart ? prStart : '无') + ' 资质名称: ' + (pr_end ? pr_end : '无') + ' 的审核？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let guids = guid;
        let requestData;
        putRequest('/business/specialVehicle/updateVehicleAuthStatusById?guid=' + guids + '&' + 'auditStatus=' + status, JSON.stringify(requestData), (response: any) => {
          console.log(response)
          if (response.status === 200) {
            // 跳转首页
            message.success('提交成功');
            // window.location.reload(true)
            // this.props.history.push('/specialShip/list');
            search.getsource()
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
      title: '驳回需要进入详情操作',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        search.props.history.push('/specialShip/view/' + guid);

        // <input type="text" onChange={e => search.setState({ remark: e.target.value })}/>
        // let requestData ;
        // postRequest('/business/truck/updateTruckOrderStatus?guid='+guid+'&auditStatus='+status, JSON.stringify(requestData), (response: any) => {
        //   console.log(response)
        //   if (response.status === 200) {
        //     // 跳转首页
        //     message.success('提交成功');
        //     window.location.reload(true)
        //     // this.props.history.push('/specialShip/list');
        //   } else {
        //     message.error('提交失败');
        //   }
        // });
      },
    });
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="特种车船供应商管理" event={() => this.onBack()} />
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
