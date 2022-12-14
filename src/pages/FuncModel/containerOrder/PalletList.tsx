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
      width: '5%',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      align: 'center',
    },
    {
      title: '还箱国家',
      dataIndex: 'country',
      align: 'center',
      width: '20%',
    },
    {
      title: '租聘地点',
      dataIndex: 'startPort',
      align: 'center',
    },
    {
      title: '还箱地点',
      dataIndex: 'endPort',
      align: 'center',
    },
    {
      title: '48英尺',
      dataIndex: 'containerFourtyEight',
      align: 'center',
    },
    {
      title: '53英尺',
      dataIndex: 'containerFiftyThree',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'accountId',
      align: 'center',
    },
    {
      title: '订舱时间',
      dataIndex: 'createDate',
      align: 'center',
    }, {
      title: formatMessage({ id: 'pallet-palletList.operate' }),
      dataIndex: 'guid',
      align: 'center',
      width: '8%',
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
    this.initData();
    this.setState({
      //列
      columns: this.columns,
      currentPage: localStorage.currentPage
    })
    localStorage.currentPage
      ? localStorage.removeItem('currentPage')
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
    params.set('endPort', this.state.endPort ? this.state.endPort : '');
    params.set('accountId', this.state.accountId ? this.state.accountId : '');
    return params;
  }

  //获取表格数据
  getPalletList() {
    const data_Source: PalletModel[] = [];
    let param = this.setParams();

    getRequest('/business/shipBooking/getContainerLeasingListForWeb', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.datas, (pallet, index) => {
            const entity: PalletModel = {};

            pallet.goodsIndex = index + 1;
            entity.orderNumber = pallet.orderNumber;
            entity.reserveIndex = pallet.goodsIndex;
            entity.key = index + 1;

            entity.createDate = moment(pallet.createDate).format("YYYY/MM/DD");
            entity.country = pallet.country;

            entity.endPort = pallet.endPort;

            entity.containerFourtyEight = pallet.containerFourtyEight;

            entity.containerFiftyThree = pallet.containerFiftyThree;

            entity.accountId = pallet.accountId;

            entity.startPort = pallet.startPort;


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
    const data_Source: ShipModel[] = [];
    let param: Map<string, string> = new Map();

    param.set('endPort', this.state.endPort ? this.state.endPort : '');//还箱地点
    param.set('accountId', this.state.accountId ? this.state.accountId : '');//用户名
    param.set('pageSize', 10);
    param.set('currentPage', this.state.currentPage);

    getRequest('/business/shipBooking/getUserShipBookingList', param, (response: any) => {
      console.log(1111111)
      console.log(5498465123894653298465132653)
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data.datas)) {
          {
            if (response.data.records.length > 0) {
              forEach(response.data.datas, (pallet, index) => {
                const entity: PalletModel = {};

                pallet.goodsIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;
                entity.orderNumber = pallet.orderNumber;
                entity.reserveIndex = pallet.goodsIndex;
                entity.key = index + 1;

                entity.createDate = moment(pallet.createDate).format("YYYY/MM/DD");
                entity.country = pallet.country;

                entity.endPort = pallet.endPort;

                entity.containerFourtyEight = pallet.containerFourtyEight;

                entity.containerFiftyThree = pallet.containerFiftyThree;

                entity.accountId = pallet.accountId;

                entity.startPort = pallet.startPort;


                entity.state = pallet.accountId;

                entity.guid = pallet;

                data_Source.push(entity);
              });
            } else {
              console.log('wu')
            }
          }

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
    this.props.history.push('/containerOrder/add');
  };

  //编辑订舱
  handAddPallet_b = () => {
    this.props.history.push('/containerOrder/edit');
  };

  //货盘查看
  handleView = (guid: any) => {
    console.log(guid.flag)
    this.props.history.push('/containerOrder/view/' + guid.guid);
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text='集装箱租赁订单列表'
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
                  placeholder="请输入还箱地点检索"
                  onChange={e => this.setState({ endPort: e.target.value })}
                // onKeyUp={this.keyUp}
                />

                <Input
                  style={{ width: '33%' }}
                  placeholder="请输入用户名检索"
                  onChange={e => this.setState({ accountId: e.target.value })}
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
                <QueryButton key={3} type="BatchDelete" text="编辑租箱" event={() => this.handAddPallet_b()} disabled={false} />
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
