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

class PalletListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<PalletModel>[] = [
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
      title: '班轮航次',
      dataIndex: 'startPortCn',
      align: 'center',
    },
    {
      title: '截关时间',
      dataIndex: 'closingTimeWeek',
      align: 'center',
    },
    {
      title: '箱型',
      dataIndex: 'BoxType',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'boxSum',
      align: 'center',
    },
    {
      title: '起拍价',
      dataIndex: 'seaFreight',
      align: 'center',
    },
    {
      title: '竞拍成交价',
      dataIndex: 'currentBiddingPrice',
      align: 'center',
    },
    {
      title: '发布用户',
      dataIndex: 'sellerPhoneNumber',
      align: 'center',
    },
    {
      title: '拍卖用户',
      dataIndex: 'buyersPhoneNumber',
      align: 'center',
    },
    {
      title: '成交时间',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '订单状态',
      dataIndex: 'orderType',
      align: 'center',
    }, {
      title: formatMessage({ id: 'pallet-palletList.operate' }),
      dataIndex: 'guid',
      align: 'center',
      width: '5%',
      render: (guid: any) => (
        <span>
          <QueryButton text='查看' type="View" event={() => this.handleView(guid)} disabled={false} />
        </span>
      )
    }
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
    })
    this.initData();
    this.setState({
      currentPage: localStorage.currentPage
    });
    localStorage.currentPage
      ? (localStorage.removeItem('currentPage'))
      : (localStorage.currentPage = this.state.currentPage);
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
    params.set('currentPage', localStorage.currentPage || this.state.currentPage);
    params.set('date', moment());
    params.set('phoneNumber', this.state.phoneNumber ? this.state.phoneNumber : '');
    params.set('orderNumber', this.state.orderNumber ? this.state.orderNumber : '');
    return params;
  }

  //获取表格数据
  getPalletList() {
    const data_Source: PalletModel[] = [];
    let param = this.setParams();

    getRequest('/business/auctionCustomer/getAuctionCustomerUserListForWeb', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.result, (pallet, index) => {
            const entity: PalletModel = {};

            pallet.goodsIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;
            entity.key = index + 1;
            entity.reserveIndex = pallet.goodsIndex;

            entity.orderNumber = pallet.orderNumber;//订单编号

            entity.startPortCn = pallet.startPortCn + '---' + pallet.endPortCn;//班轮航次

            entity.closingTimeWeek = pallet.closingTimeWeek + ' ' + pallet.closingTime//截关时间

            entity.BoxType = pallet.BoxType;//箱型

            entity.boxSum = pallet.boxSum;//数量

            let seaFreightType = pallet.seaFreightType == 0 ? '￥' : pallet.seaFreightType == 1 ? '$' : '€';

            entity.seaFreight = seaFreightType + pallet.seaFreight;//起拍价

            entity.currentBiddingPrice = seaFreightType + pallet.currentBiddingPrice;//成交价

            entity.sellerPhoneNumber = pallet.sellerPhoneNumber;//发布用户

            entity.buyersPhoneNumber = pallet.buyersPhoneNumber;//拍卖用户

            entity.createDate = pallet.createDate;//成交时间

            entity.orderType = pallet.orderType == 1 ? '进行中' : pallet.orderType == 2 ? '已完成' : pallet.orderType == 3 ? '已取消' : '';


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


  //检索事件

  findAll = () => {
    this.setState({
      currentPage: 1,
    }, () => {
      this.getPalletList_ss();
    });
  };

  getPalletList_ss() {
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('pageSize', 10);
    params.set('currentPage', this.state.currentPage);
    params.set('date', moment());
    params.set('phoneNumber', this.state.phoneNumber ? this.state.phoneNumber : '');
    params.set('orderNumber', this.state.orderNumber ? this.state.orderNumber : '');

    const data_Source: PalletModel[] = [];
    let param = this.setParams();

    getRequest('/business/auctionCustomer/getAuctionCustomerUserListForWeb', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.result, (pallet, index) => {
            const entity: PalletModel = {};

            pallet.goodsIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;
            entity.key = index + 1;
            entity.reserveIndex = pallet.goodsIndex;

            entity.orderNumber = pallet.orderNumber;//订单编号

            entity.startPortCn = pallet.startPortCn + '---' + pallet.endPortCn;//班轮航次

            entity.closingTimeWeek = pallet.closingTimeWeek + ' ' + pallet.closingTime//截关时间

            entity.BoxType = pallet.BoxType;//箱型

            entity.boxSum = pallet.boxSum;//数量

            entity.seaFreight = pallet.seaFreight;//起拍价

            entity.currentBiddingPrice = pallet.currentBiddingPrice;//成交价

            entity.sellerPhoneNumber = pallet.sellerPhoneNumber;//发布用户

            entity.buyersPhoneNumber = pallet.buyersPhoneNumber;//拍卖用户

            entity.createDate = pallet.createDate;//成交时间

            entity.orderType = pallet.orderType == 1 ? '进行中' : pallet.orderType == 2 ? '已完成' : pallet.orderType == 3 ? '已取消' : '';


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



  //修改当前页码
  changePage = (page: any) => {
    localStorage.currentPage = page
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getPalletList();
      },
    );
  };


  //订舱新增
  handAddPallet = () => {
    this.props.history.push('/AuctionCustomer/add');
  };

  //编辑订舱
  handAddPallet_b = () => {
    this.props.history.push('/AuctionCustomer/edit');
  };

  //货盘查看
  handleView = (guid: any) => {
    console.log(guid.flag)
    this.props.history.push('/AuctionCustomer/view/' + guid.guid);
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text='现舱竞拍列表'
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '33%' }}
                  placeholder="请输入订单编号检索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                // onKeyUp={this.keyUp}
                />

                <Input
                  style={{ width: '33%' }}
                  placeholder="请输入发布用户手机号检索"
                  onChange={e => this.setState({ phoneNumber: e.target.value })}
                // onKeyUp={this.keyUp}
                />

                {/* <QueryButton key={3}
                  type="Query"
                  text={formatMessage({ id: 'pallet-palletList.search' })}
                  event={this.search.bind(this)}
                  disabled={false}
                /> */}
                <QueryButton key={3} type="Query" text="搜索" event={() => this.initData()} disabled={false} />
                <span style={{ width: '4%' }}></span>
                {/* <QueryButton key={3} type="BatchDelete"  text="新增班轮" event={() => this.handAddPallet()} disabled={false} /> */}
                <span style={{ width: '4%' }}></span>
                <QueryButton key={3} type="BatchDelete" text="现舱竞拍" event={() => this.handAddPallet_b()} disabled={false} />
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
                  {this.state.pagesize}<FormattedMessage id="pallet-palletList.records" />
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

export default PalletListForm;
