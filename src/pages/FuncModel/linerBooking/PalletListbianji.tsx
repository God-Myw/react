import getRequest, { deleteRequest } from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Input, message, Modal, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { PalletModel } from './PalletModel';
import moment from 'moment';

const InputGroup = Input.Group;
const { confirm } = Modal;

class PalletListEditForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<PalletModel>[] = [
    {
      title: '序号',
      dataIndex: 'reserveIndex',
      align: 'center',
      width: '5%',
    },

    {
      title: '班轮航次',
      dataIndex: 'namess',
      align: 'center',
      width: '20%',
    },
    {
      title: formatMessage({ id: 'pallet-palletList.operate' }),
      dataIndex: 'guid',
      align: 'center',
      width: '14%',
      render: (guid: any) => (
        <span>
          <QueryButton
            text="查看"
            type="View"
            event={() => this.handleView(guid)}
            disabled={false}
          />
          &nbsp;
          <QueryButton
            text="编辑"
            type="View"
            event={() => this.handleView_b(guid)}
            disabled={false}
          />
        </span>
      ),
    },
  ];
  state = {
    //列
    columns: this.columns,
    //表数据
    dataSource: [],
    //货物名称
    goodsLevel: '',
    //二级货名
    goodsSubLevel: '',
    //货品类型
    goodsType: '',
    //当前页
    currentPage: 1,
    total: 0,
    pagesize: 10,
  };

  //初期华事件
  componentDidMount() {
    this.setState({
      //列
      columns: this.columns,
    });
    this.initData();
  }

  //模拟数据
  initData() {
    this.getPalletList();
  }

  //准备参数
  setParams(): Map<string, string> {
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('pageSize', 10);
    params.set('currentPage', this.state.currentPage);
    params.set('date', moment());
    params.set('closingTime', this.state.closingTime ? this.state.closingTime : '');
    params.set('userName', this.state.userName ? this.state.userName : '');
    params.set('phoneNumber', this.state.phoneNumber ? this.state.phoneNumber : '');
    return params;
  }

  //获取表格数据
  getPalletList() {
    const data_Source: PalletModel[] = [];
    let param = this.setParams();
    getRequest('/business/shipBooking/getShipBookingList', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.records, (pallet, index) => {
            const entity: PalletModel = {};
            pallet.goodsIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;
            entity.reserveIndex = pallet.goodsIndex;
            // entity.startPortCn = pallet.startPortCn;
            // entity.startPortEn = pallet.startPortEn;

            // entity.endPortCn = pallet.endPortCn;
            // entity.endPortEn = pallet.endPortEn;

            entity.namess =
              pallet.startPortCn +
              ' ' +
              pallet.startPortEn +
              '---' +
              pallet.endPortCn +
              ' ' +
              pallet.endPortEn;

            entity.state = pallet.accountId;

            entity.guid = pallet;

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

  // //检索事件

  //   findAll = () => {
  //     this.setState({
  //       currentPage: 1,
  //     }, () => {
  //       this.getPalletList_ss();
  //     });
  //   };

  //   getPalletList_ss() {
  //     const data_Source: ShipModel[] = [];
  //     let param: Map<string, string> = new Map();

  //     param.set('startDate',this.state.startDate?this.state.startDate:'');
  //     param.set('user',this.state.user?this.state.user:'');

  //     getRequest('/business/requirements/selectRequirementForWebByconditions', param, (response: any) => {
  //       console.log(response)
  //       if (response.status === 200) {
  //         if (!isNil(response.data)) {
  //           forEach(response.data, (pallet, index) => {
  //             const entity: PalletModel = {};
  //             pallet.goodsIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;
  //             entity.key = index + 1;
  //             entity.namess = 'NINGBO 宁波港 ——HOUSTON 休斯敦';
  //             entity.startDate = pallet.startDateWeek + pallet.startDate;
  //             entity.endDate =pallet.endDateWeek + pallet.endDate;
  //             entity.haiyunMoneyOneOld =pallet.haiyunMoneyOneOld;
  //             entity.haiyunMoneyTwoOld =pallet.haiyunMoneyTwoOld;
  //             entity.haiyunMoneyThreeOld =pallet.haiyunMoneyThreeOld;
  //             entity.state ='DYLXX202001';
  //             entity.guid = pallet;

  //             data_Source.push(entity);
  //           });
  //         }
  //         this.setState({
  //           dataSource: data_Source,
  //           total: response.data.total,
  //         });
  //       }
  //     });
  //   }

  //修改当前页码
  changePage = (page: any) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getPalletList();
      },
    );
  };

  //订舱追加
  handAddPallet = () => {
    this.props.history.push('/linerBooking/add');
  };

  //货盘查看
  handleView = (guid: any) => {
    this.props.history.push('/linerBooking/editBia/' + guid.guid);
  };

  handleView_b = (guid: any) => {
    this.props.history.push('/linerBooking/addBia/' + guid.guid);
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="编辑班轮订舱列表"
          event={() => {
            this.props.history.push('/linerBooking');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '23%' }}
                  placeholder="请输入截关时间检索，格式为：xxxx-xx-xx (例：2021-05-12)"
                  onChange={e => this.setState({ startDate: e.target.value })}
                  // onKeyUp={this.keyUp}
                />

                <Input
                  style={{ width: '23%' }}
                  placeholder="请输入用户名检索"
                  onChange={e => this.setState({ user: e.target.value })}
                  // onKeyUp={this.keyUp}
                />

                <Input
                  style={{ width: '23%' }}
                  placeholder="请输入联系电话检索"
                  onChange={e => this.setState({ phoneNumber: e.target.value })}
                  // onKeyUp={this.keyUp}
                />

                {/* <QueryButton key={3}
                  type="Query"
                  text={formatMessage({ id: 'pallet-palletList.search' })}
                  event={this.search.bind(this)}
                  disabled={false}
                /> */}
                <QueryButton
                  key={3}
                  type="Query"
                  text="搜索"
                  event={() => this.initData()}
                  disabled={false}
                />
                {/* <QueryButton key={4} type="Query"  text="编辑班轮" event={this.handAddPallet} disabled={false} /> */}
                <span style={{ width: '4%' }}></span>
                {/* <QueryButton
                  key={4}
                  type="BatchDelete"
                  text="批量导入"
                  event={() => this.handAddPallet()}
                  disabled={false}
                />
                <span style={{ width: '4%' }}></span>
                <QueryButton
                  key={5}
                  type="BatchDelete"
                  text="新增班轮"
                  event={() => this.handAddPallet()}
                  disabled={false}
                /> */}
                {/* <QueryButton key={3} type="Query" text="编辑班轮"  event={() => this.handAddPallet()} style={{ width: '10%' }} disabled={false}/> */}
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Table
            rowKey={record => (!isNil(record.key) ? record.key : '')}
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
              pageSize: this.state.pagesize,
              total: this.state.total,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  <FormattedMessage id="pallet-palletList.total" />{' '}
                  {this.state.total % this.state.pagesize == 0
                    ? Math.floor(this.state.total / this.state.pagesize)
                    : Math.floor(this.state.total / this.state.pagesize) + 1}{' '}
                  <FormattedMessage id="pallet-palletList.pages" />
                  {this.state.pagesize}
                  <FormattedMessage id="pallet-palletList.records" />
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

export default PalletListEditForm;
