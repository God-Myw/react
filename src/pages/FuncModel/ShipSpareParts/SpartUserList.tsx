import React from 'react'
import { RouteComponentProps } from 'dva/router';
import { Table, Input, Form, Row, Col, Select, Modal } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import { SpartUserListModel } from './ShipSparePartsModel'
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { getRequest } from '@/utils/request';
import { isNil, forEach } from 'lodash';
import { formatMessage } from 'umi-plugin-locale';
const InputGroup = Input.Group;
const data_Source: SpartUserListModel[] = [];
const { confirm } = Modal;

class SpartUserList extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<SpartUserListModel>[] = [
    {
      title: '订单号',
      dataIndex: 'suNumber',
      align: 'center',
    },
    {
      title: '商品图片',
      dataIndex: 'fileName',
      align: 'center',
      render: (v: any) => (
        <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <img style={{ width: '70px', height: '100%' }} src={`http://58.33.34.10:10443/images/spart/shipbeijian4.jpg`} alt="" />
          {/* {v} */}
        </span>
      )
    },
    {
      title: '商品',
      dataIndex: 'tradeName',
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'spartMoney',
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: '下单时间',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '订单状态',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'fileName',
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'guid',
      width: '18%',
      render: (v: any, data: any) => (
        <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <QueryButton
            text='查看'
            type="Edit"
            event={() => this.handleEdit(v)}
            disabled={false}
          />
          <QueryButton
            text={data.shelf == '待发货' ? '发货' : '取消订单'}
            type={data.shelf == '已上架' ? 'Stop' : 'Shelf'}
            event={() => { }}
            disabled={false}
          />
        </span>
      ),
    },
  ];
  state = {
    columns: this.columns,
    dataSource: data_Source,
    total: 0,
    pageSize: 10,
    currentPage: 1,
    guid: '1'
  };

  //初期化事件
  componentDidMount() {
    this.initData();
  };

  //模拟数据
  initData() {
    this.getSpartUserList();
  };
  getSpartUserList() {
    const data_Source: SpartUserListModel[] = []
    let params: Map<string, string> = new Map();
    params.set('currentPage', this.state.currentPage.toString())
    params.set('pageSize', this.state.pageSize.toString())
    getRequest('/business/spartUser/getSpartUserList', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response)) {
          forEach(response.data.records, (userDataCheck, index) => {
            const entity: SpartUserListModel = {};
            entity.index = index + 1 || '';
            entity.guid = userDataCheck.guid || '';
            entity.tradeName = userDataCheck.tradeName || '';
            entity.fileName = userDataCheck.fileName || '';
            entity.type = userDataCheck.fileType || '';
            entity.phoneNumber = userDataCheck.phoneNumber || '';
            entity.suNumber = userDataCheck.suNumber || '';
            entity.quantity = userDataCheck.quantitySum || '';
            entity.spartMoney = userDataCheck.spartMoney || '';
            entity.createDate = userDataCheck.createDate || '';
            data_Source.push(entity);
          })
          this.setState({
            dataSource: data_Source,
            total: response.data.total,
          });
        }
      }
    })
  };
  handleEdit = (guid: any) => {
    // this.props.history.push('/ShipSpareParts/view/' + guid);
  };
  handleDelete = (guid: any) => {
    // this.props.history.push('/ShipSpareParts/view/' + guid);
  };
  findAll = () => {

  }
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
  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="船舶供应"
          event={() => {
            this.props.history.push('/index_menu');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '22%' }}
                  placeholder="请输入商品号搜索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                />
                <Select
                  allowClear={true}
                  onSelect={(v: any) => {
                  }}
                  placeholder="商品类目检索"
                  style={{ width: '22%' }}
                >
                  <Select.Option value={'发电机'}>发电机</Select.Option>
                  <Select.Option value={'辅机'}>辅机</Select.Option>
                </Select>
                <Input
                  style={{ width: '22%' }}
                  placeholder="商品名称检索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                />
                <Input
                  style={{ width: '22%' }}
                  placeholder="订单联系人检索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                />
                <QueryButton
                  type="Query"
                  text="搜索"
                  event={() => this.findAll()}
                  disabled={true}
                />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <QueryButton
                  type="Add"
                  text="新增商品"
                  event={() => { this.props.history.push('/ShipSpareParts/add/') }}
                  disabled={true}
                />
              </InputGroup>
            </Col>
          </Row>
        </div>
        <div className={commonCss.table}>
          <Table
            rowKey={record => (!isNil(record.index) ? record.index.toString() : '')}
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
                  {formatMessage({ id: 'ShipTrade-ShipTradeList.total' })}{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  {formatMessage({ id: 'ShipTrade-ShipTradeList.show' })}
                  {this.state.pageSize}
                  {formatMessage({ id: 'ShipTrade-ShipTradeList.records' })}
                </div>
              ),
            }}
          />
        </div></div>
    )
  }
}
const MPCertificationList_Form = Form.create({ name: 'MPCertificationList_Form' })(SpartUserList);

export default MPCertificationList_Form;
