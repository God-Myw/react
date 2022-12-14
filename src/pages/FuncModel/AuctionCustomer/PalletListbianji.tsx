import getRequest, { deleteRequest } from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Input, message, Modal, Row, Select, Table, Form, Button } from 'antd';
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
  state = {
    //列
    columns: [],
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
    buttonA: true,
    buttonB: false,
    buttonC: false,
  };
  private columnsOne: ColumnProps<PalletModel>[] = [
    {
      title: '序号',
      dataIndex: 'reserveIndex',
      align: 'center',
    },
    {
      title: '竞拍编号',
      dataIndex: 'orderNumber',
      align: 'center',
    },
    {
      title: '班轮航次',
      dataIndex: 'country',
      align: 'center',
    },
    {
      title:'截关时间',
      dataIndex: 'startPort',
      align: 'center',
    },
    {
      title: '箱型',
      dataIndex: 'endPort',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'containerFourtyEight',
      align: 'center',
    },
    {
      title: '起拍价',
      dataIndex: 'containerFiftyThree',
      align: 'center',
    },
    {
      title: '竞拍最新价',
      dataIndex: 'accountId',
      align: 'center',
    },
    {
      title: '发布用户',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '报名人数',
      dataIndex: 'accountId',
      align: 'center',
    },
    {
      title: '开始时间',
      dataIndex: 'accountId',
      align: 'center',
    },{
      title: formatMessage({ id: 'pallet-palletList.operate' }),
      dataIndex: 'guid',
      align: 'center',
      width: '6%',
      render: (guid: any) => (
        <span>
          <QueryButton text='查看' type="View" event={() => this.handleView(guid,0)} disabled={false} />

        </span>

      )
    }
  ];

  private columnsTwo: ColumnProps<PalletModel>[] = [
    {
      title: '序号',
      dataIndex: 'reserveIndex',
      align: 'center',
    },
    {
      title: '竞拍编号',
      dataIndex: 'orderNumber',
      align: 'center',
    },
    {
      title: '班轮航次',
      dataIndex: 'country',
      align: 'center',
    },
    {
      title:'截关时间',
      dataIndex: 'startPort',
      align: 'center',
    },
    {
      title: '箱型',
      dataIndex: 'endPort',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'containerFourtyEight',
      align: 'center',
    },
    {
      title: '起拍价',
      dataIndex: 'containerFiftyThree',
      align: 'center',
    },
    {
      title: '发布用户',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '报名人数',
      dataIndex: 'accountId',
      align: 'center',
    },
    {
      title: '开始时间',
      dataIndex: 'accountId',
      align: 'center',
    },{
      title: formatMessage({ id: 'pallet-palletList.operate' }),
      dataIndex: 'guid',
      align: 'center',
      width: '6%',
      render: (guid: any) => (
        <span>
          <QueryButton text='查看' type="View" event={() => this.handleView(guid,1)} disabled={false} />

        </span>

      )
    }
  ];

  private columnsThree: ColumnProps<PalletModel>[] = [
    {
      title: '序号',
      dataIndex: 'reserveIndex',
      align: 'center',
    },
    {
      title: '竞拍编号',
      dataIndex: 'orderNumber',
      align: 'center',
    },
    {
      title: '班轮航次',
      dataIndex: 'country',
      align: 'center',
    },
    {
      title:'截关时间',
      dataIndex: 'startPort',
      align: 'center',
    },
    {
      title: '箱型',
      dataIndex: 'endPort',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'containerFourtyEight',
      align: 'center',
    },
    {
      title: '起拍价',
      dataIndex: 'containerFiftyThree',
      align: 'center',
    },
    {
      title: '竞拍成交价',
      dataIndex: 'containerFiftyThree',
      align: 'center',
    },
    {
      title: '发布用户',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '拍卖用户',
      dataIndex: 'accountId',
      align: 'center',
    },
    {
      title: '成交时间',
      dataIndex: 'accountId',
      align: 'center',
    },{
      title: formatMessage({ id: 'pallet-palletList.operate' }),
      dataIndex: 'guid',
      align: 'center',
      width: '6%',
      render: (guid: any) => (
        <span>
          <QueryButton text='查看' type="View" event={() => this.handleView(guid,2)} disabled={false} />

        </span>

      )
    }
  ];

  //初期华事件
  componentDidMount() {
    this.setState({
      //列
      columns: this.columnsOne
    })
    this.initData(0);
  }

  //模拟数据
  initData(e) {
    if(e<9999){
      this.getPalletList();
    }
    if(e==0){
      this.setState({
        //列
        columns: this.columnsOne
      })
    }else if(e==1){
      this.setState({
        //列
        columns: this.columnsOne
      })
    }else if(e==2){
      this.setState({
        //列
        columns: this.columnsTwo
      })
    }else if(e==3){
      this.setState({
        //列
        columns: this.columnsThree
      })
    }

  }

  //准备参数
  setParams(): Map<string, string> {
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('pageSize', 10);
    params.set('currentPage', this.state.currentPage);
    params.set('date', moment());
    params.set('country',this.state.country?this.state.country:'');
    // params.set('userName',this.state.userName?this.state.userName:'');
    return params;
  }

  //获取表格数据
  getPalletList() {
    const data_Source: PalletModel[] = [];
    let param = this.setParams();
    getRequest('/business/shipBooking/getContainerLeasingForWeb', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {

          forEach(response.data.dates, (pallet, index) => {
            console.log(123456789)
            const entity: PalletModel = {};

            pallet.goodsIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;

            entity.key = index + 1;

            entity.reserveIndex = pallet.goodsIndex;

            entity.country = pallet.country;

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
    this.props.history.push('/AuctionCustomer/add');
  };



  //货盘查看
  handleView = (guid: any, e: any) => {
    console.log(guid.flag)
    console.log(e)
    this.props.history.push('/AuctionCustomer/editBia/' + guid.guid+'/' + e);
  };


//切换状态竞拍中
selectA = () => {
  this.setState(
    {
      buttonA: true,
      buttonB: false,
      buttonC: false,
      adsStatus: '0',
      currentPage: 1,
      columns:[]
    },
    () => {
      this.initData(1);
    },
  );
};

//切换状态预告中
selectB = () => {
  this.setState(
    {
      buttonA: false,
      buttonB: true,
      buttonC: false,
      adsStatus: '1',
      currentPage: 1,
      columns:[]
    },
    () => {
      this.initData(2);
    },
  );
};

//切换状态已结束
selectC = () => {
  this.setState(
    {
      buttonA: false,
      buttonB: false,
      buttonC: true,
      adsStatus: '2',
      currentPage: 1,
      columns: []
    },
    () => {
      this.initData(3);
    },
  );
};

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text='现舱竞拍'
          event={() => {
            this.props.history.push('/AuctionCustomer');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
              <Input
                  style={{ width: '33%' }}
                  placeholder="请输入竞拍编号检索"
                  onChange={e => this.setState({ endPort: e.target.value })}
                  // onKeyUp={this.keyUp}
                />

                <Input
                  style={{ width: '33%' }}
                  placeholder="请输入手机号检索"
                  onChange={e => this.setState({ accountId: e.target.value })}
                  // onKeyUp={this.keyUp}
                />
                <span style={{width:'4%'}}></span>
                <QueryButton key={3} type="Query"  text="搜索" event={() => this.initData()} disabled={false} />

                {/* <span style={{width:'4%'}}></span>
                <QueryButton key={3} type="Query"  text="新增租箱" event={() => this.handAddPallet()} disabled={false} /> */}
                {/* <span style={{width:'4%'}}></span>
                <QueryButton key={3} type="Query"  text="编辑班轮" event={() => this.handAddPallet()} disabled={false} /> */}
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
        <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '10.93%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonA ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectA}
                >
                  竞拍中
                </Button>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '11.93%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonB ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectB}
                >
                  预告中
                </Button>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '12.97%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonC ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectC}
                >
                  已结束
                </Button>
              </Form.Item>
            </Col>
          </Row>
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
