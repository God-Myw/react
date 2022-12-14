import getRequest, { deleteRequest } from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Input, message, Modal, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil, values } from 'lodash';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { PalletModel } from './PalletModel';
import moment from 'moment';

const InputGroup = Input.Group;
const { confirm } = Modal;
const { Option } = Select;

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
      title:'截关时间',
      dataIndex: 'closingTimeWeek',
      align: 'center',
    },
    {
      title: '箱型&数量',
      dataIndex: 'boxss',
      align: 'center',
    },
    {
      title: '海运费总金额',
      dataIndex: 'total',
      align: 'center',
    },
    {
      title: '服务费',
      dataIndex: 'seaFreight',
      align: 'center',
    },
    {
      title: '发布用户',
      dataIndex: 'sellerPhoneNumber',
      align: 'center',
    },
    {
      title: '秒杀用户',
      dataIndex: 'buyerPhoneNumber',
      align: 'center',
    },
    {
      title: '下单时间',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '订单状态',
      dataIndex: 'buyerOrderStatus',
      align: 'center',
    },
    {
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
  }

  //模拟数据
  initData() {
    this.getPalletList();
  }

  //准备参数
  setParams(): Map<string, string> {
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    // params.set('type', '1');
    // params.set('pageSize', 10);
    // params.set('currentPage', this.state.currentPage);
    // params.set('date', moment());
    params.set('phoneCode',this.state.phoneCode?this.state.phoneCode:'');
    params.set('orderNumber',this.state.orderNumber?this.state.orderNumber:'');
    params.set('orderStatus',this.state.orderStatus?this.state.orderStatus:'');
    return params;
  }

  //获取表格数据
  getPalletList() {
    const data_Source: PalletModel[] = [];
    let param = this.setParams();

    getRequest('/business/containerSpike/getSpikeOrderListForWeb', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.result, (pallet, index) => {
            const entity: PalletModel = {};

            pallet.goodsIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;
            entity.key = index + 1;
            entity.reserveIndex = pallet.goodsIndex;

            entity.orderNumber = pallet.orderNumber;//订单编号

            entity.startPortCn =  pallet.startPortCn+'---'+ pallet.endPortCn;//班轮航次

            entity.closingTimeWeek = pallet.sailingTime//截关时间

            entity.BoxType = pallet.BoxType;//箱型

            // forEach(pallet.boxs,(pallet)=>{
            //   let add = pallet.boxType+'*'+pallet.boxSum
            //   entity.boxss = add;
            // })
            entity.boxss = pallet.boxs[0].boxType+'*'+pallet.boxs[0].boxSum+(pallet.boxs[1]?'/'+pallet.boxs[1].boxType+'*'+pallet.boxs[1].boxSum:'')+(pallet.boxs[2]?'/'+pallet.boxs[2].boxType+'*'+pallet.boxs[2].boxSum:'');

            let moneyType = pallet.moneyType==0?'￥':pallet.moneyType==1?'$':'€';

            entity.total = moneyType+pallet.total;//总金额

            entity.seaFreight =pallet.seaFreight;//起拍价

            entity.currentBiddingPrice =pallet.currentBiddingPrice;//成交价

            entity.sellerPhoneNumber =pallet.sellerPhoneNumber;//发布用户

            entity.buyerPhoneNumber =pallet.buyerPhoneNumber;//拍卖用户

            entity.createDate =  pallet.createDate;//成交时间

            entity.buyerOrderStatus =  pallet.buyerOrderStatus==1?'已下单':pallet.buyerOrderStatus==2?'进行中':pallet.buyerOrderStatus==3?'交易完成':pallet.buyerOrderStatus==4?'客服已取消':pallet.buyerOrderStatus==5?'已确认装船':pallet.buyerOrderStatus==6?'超时未支付已取消':'';


            entity.state =pallet.accountId;

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
    params.set('phoneCode',this.state.phoneCode?this.state.phoneCode:'');
    params.set('orderNumber',this.state.orderNumber?this.state.orderNumber:'');
    params.set('orderStatus',this.state.orderStatus?this.state.orderStatus:'');

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

            entity.startPortCn =  pallet.startPortCn+'---'+ pallet.endPortCn;//班轮航次

            entity.closingTimeWeek = pallet.sailingTime//截关时间

            entity.BoxType = pallet.BoxType;//箱型

            entity.boxss = pallet.boxs[0].boxType+'*'+pallet.boxs[0].boxSum+(pallet.boxs[1]?'/'+pallet.boxs[1].boxType+'*'+pallet.boxs[1].boxSum:'')+(pallet.boxs[2]?'/'+pallet.boxs[2].boxType+'*'+pallet.boxs[2].boxSum:'');

            let moneyType = pallet.moneyType==0?'￥':pallet.moneyType==1?'$':'€';

            entity.total = moneyType+pallet.total;//总金额

            entity.seaFreight =pallet.seaFreight;//起拍价

            entity.currentBiddingPrice =pallet.currentBiddingPrice;//成交价

            entity.sellerPhoneNumber =pallet.sellerPhoneNumber;//发布用户

            entity.buyerPhoneNumber =pallet.buyerPhoneNumber;//拍卖用户

            entity.createDate =  pallet.createDate;//成交时间

            entity.buyerOrderStatus =  pallet.buyerOrderStatus==1?'已下单':pallet.buyerOrderStatus==2?'进行中':pallet.buyerOrderStatus==3?'交易完成':pallet.buyerOrderStatus==4?'客服已取消':pallet.buyerOrderStatus==5?'已确认装船':pallet.buyerOrderStatus==6?'超时未支付已取消':'';


            entity.state =pallet.accountId;

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
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getPalletList();
      },
    );
  };


  //秒杀新增
  handAddPallet = () => {
    this.props.history.push('/containerSpike/add');
  };

 //编辑秒杀
  handAddPallet_b = () => {
    this.props.history.push('/containerSpike/edit');
  };

  //货盘查看
  handleView = (guid: any) => {
    console.log(guid.flag)
    this.props.history.push('/containerSpike/view/' + guid.guid);
  };

  handleChange = (value)=>{
    this.setState({
      orderStatus:value
    })
  }
  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text='现舱秒杀列表'
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
              <Input
                  style={{ width: '22%' }}
                  placeholder="请输入订单编号检索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                  // onKeyUp={this.keyUp}
                />

                <Input
                  style={{ width: '22%' }}
                  placeholder="请输入发布用户手机号检索"
                  onChange={e => this.setState({ phoneCode: e.target.value })}
                  // onKeyUp={this.keyUp}
                />
                <Select  style={{  width: '15%' }} allowClear={true} onChange={(value: any) => this.setState({ orderStatus: value })}>
                  <Option value="1">已下单</Option>
                  <Option value="2">进行中</Option>
                  <Option value="3">交易完成</Option>
                  <Option value="4">客服已取消</Option>
                  <Option value="5">已确认装船</Option>
                  <Option value="6">客服已取消</Option>
                </Select>
                {/* <QueryButton key={3}
                  type="Query"
                  text={formatMessage({ id: 'pallet-palletList.search' })}
                  event={this.search.bind(this)}
                  disabled={false}
                /> */}
                <QueryButton key={3} type="Query"  text="搜索" event={() => this.initData()} disabled={false} />
                <span style={{width:'4%'}}></span>
                {/* <QueryButton key={3} type="BatchDelete"  text="新增班轮" event={() => this.handAddPallet()} disabled={false} /> */}
                <span style={{width:'4%'}}></span>
                <QueryButton key={3} type="BatchDelete" text="现舱秒杀" event={() => this.handAddPallet_b()} disabled={false} />
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
