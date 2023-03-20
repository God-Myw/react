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
      title: '标题',
      dataIndex: 'title',
      align: 'center',
      // width: '13%',
    },
    {
      title: '资质',
      dataIndex: 'name',
      align: 'center',

    },
    {
      title: '特种车/船类型',
      dataIndex: 'isShipCar',
      align: 'center',

    },
    {
      title: '发布类型',
      dataIndex: 'specialName',
      align: 'center',
    },
    {
      title: '出售模式',
      dataIndex: 'modelType',
      align: 'center',

    },
    {
      title: '商品状态',
      dataIndex: 'auditStatus',
      align: 'center',
    },
    {
      title: '上下架状态',
      dataIndex: 'releaseStatus',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'advanceOrder', //数据索引唯一标识
      align: 'center',
      width: '30%',
      render: (advanceOrder: any) => (
        <span>
          <QueryButton
            text="查看"
            type="View"
            event={() => this.Toexamine(advanceOrder)}
            disabled={false}
          />
          <QueryButton
            text="审核通过"
            type="Certification"
            event={() => this.check(advanceOrder.title, advanceOrder.isShipCar, advanceOrder.specialName, advanceOrder.guid, '2')}
            disabled={advanceOrder.auditStatus == 1 ? false : true}
          />
          <QueryButton
            text="解除强制下架"
            type="Edit"
            event={() => this.jiechu(advanceOrder.title, advanceOrder.isShipCar, advanceOrder.specialName, advanceOrder.guid, '5')}
            disabled={advanceOrder.auditStatus == 2 && advanceOrder.releaseStatus == 0 ? false : true}
          />
          <QueryButton
            text="强制下架"
            type="Delete"
            event={() => this.qiangzhi(advanceOrder.title, advanceOrder.isShipCar, advanceOrder.specialName, advanceOrder.guid, '0')}
            disabled={advanceOrder.auditStatus == 2 && advanceOrder.releaseStatus == 5 ? false : true}
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
    getRequest('/business/specialVehicle/getSpecialVehicleUserList', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.records, (order, index) => {
            const entity: AdvanceorderModel = {};
            entity.reserveIndex = index + 1;
            entity.title = order.title;
            entity.name = order.name;
            entity.isShipCar = order.isShipCar == 1 ? '车' : '船';
            entity.specialName = order.specialName;
            entity.modelType = order.modelType == 1 ? '租赁' : '售卖';
            entity.auditStatus = order.auditStatus == 1 ? '待审核' : order.auditStatus == 2 ? '审核通过' : order.auditStatus == 3 ? '过期' : order.auditStatus == 0 ? '驳回' : '';
            entity.releaseStatus = order.releaseStatus == 1 ? '未通过' : order.releaseStatus == 2 ? '待审核' : order.releaseStatus == 3 ? '未上架' : order.releaseStatus == 4 ? '已过期' : order.releaseStatus == 5 ? '已上架' : order.releaseStatus == 0 ? '强制下架' : '';
            //序号和订单编号是否需要
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


  //查看
  Toexamine = (record) => {
    console.log(record)

    this.props.history.push('/specialCar/view/' + record.guid);
  };

  //订单完成
  check = (orderNumber: string, prStart: string, pr_end: string, guid: string, status: string) => {
    const search = this;
    confirm({
      title: '确定是否要审核通过标题: ' + (orderNumber ? orderNumber : '无') + ' 车/船类型: ' + (prStart ? prStart : '无') + ' 发布类型: ' + (pr_end ? pr_end : '无') + ' 的审核？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        // let guids = this.props.match.params['guid'];
        let requestData;
        // requestData = {
        //   auditStatus:status*1,
        //   guid:guids,
        // };
        putRequest('/business/specialVehicle/updateSpecialVehicleUserById?guid=' + guid + '&' + 'auditStatus=' + status, JSON.stringify(requestData), (response: any) => {
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
        search.props.history.push('/specialCar/view/' + guid);
      },
    });
  };

  jiechu = (orderNumber: string, prStart: string, pr_end: string, guid: string, status: string) => {
    const search = this;
    confirm({
      title: '确定是否要解除下架 标题: ' + (orderNumber ? orderNumber : '无') + ' 车/船类型: ' + (prStart ? prStart : '无') + ' 发布类型: ' + (pr_end ? pr_end : '无') + ' ？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        // let guids = this.props.match.params['guid'];
        let requestData;
        putRequest('/business/specialVehicle/updateVehicleUserDataBySys?guid=' + guid + '&' + 'type=' + status, JSON.stringify(requestData), (response: any) => {
          console.log(response)
          if (response.status === 200) {
            // 跳转首页
            message.success('提交成功');
            search.getsource()            // window.location.reload(true)
            // this.props.history.push('/specialShip/list');
          } else {
            message.error('提交失败');
          }
        });
      }
    })
  }

  qiangzhi = (orderNumber: string, prStart: string, pr_end: string, guid: string, status: string) => {
    const search = this;
    confirm({
      title: '确定是否要强制下架 标题: ' + (orderNumber ? orderNumber : '无') + ' 车/船类型: ' + (prStart ? prStart : '无') + ' 发布类型: ' + (pr_end ? pr_end : '无') + ' ？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        // let guids = this.props.match.params['guid'];
        let requestData;
        putRequest('/business/specialVehicle/updateVehicleUserDataBySys?guid=' + guid + '&' + 'type=' + status, JSON.stringify(requestData), (response: any) => {
          console.log(response)
          if (response.status === 200) {
            // 跳转首页
            message.success('提交成功');
            search.getsource()
            // window.location.reload(true)
            // this.props.history.push('/specialShip/list');
          } else {
            message.error('提交失败');
          }
        });
      }
    })
  }
  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="招商信息" event={() => this.onBack()} />
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
