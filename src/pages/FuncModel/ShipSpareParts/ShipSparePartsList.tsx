import React from 'react';
import { RouteComponentProps } from 'dva/router';
import { Table, Input, Form, Row, Col, Select, Modal } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import { ShipSparePartsModel } from './ShipSparePartsModel';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { getRequest } from '@/utils/request';
import { isNil, forEach } from 'lodash';
import { formatMessage } from 'umi-plugin-locale';
const InputGroup = Input.Group;
const data_Source: ShipSparePartsModel[] = [];
const { confirm } = Modal;

class ShipSparePartsList extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<ShipSparePartsModel>[] = [
    {
      title: '商品编号',
      dataIndex: 'number',
      align: 'center',
    },
    {
      title: '商品图片',
      dataIndex: 'fileName',
      align: 'center',
      render: (v: any) => (
        <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <img
            style={{ width: '70px', height: '23px' }}
            src={`http://58.33.34.10:10443/images/spart/${v}`}
            alt=""
          />
        </span>
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'tradeName',
      align: 'center',
    },
    {
      title: '所属商品类目',
      dataIndex: 'fileType',
      align: 'center',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'spartMoney',
      align: 'center',
    },
    {
      title: '库存',
      dataIndex: 'quantitySum',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'shelf',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'guid',
      width: '18%',
      render: (v: any, data: any) => (
        <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <QueryButton text="编辑" type="Edit" event={() => this.handleEdit(v)} disabled={false} />
          <QueryButton
            text={data.shelf == '已上架' ? '下架' : '上架'}
            type={data.shelf == '已上架' ? 'Stop' : 'Shelf'}
            event={() => this.handleChange(v, data)}
            disabled={false}
          />
          <QueryButton
            text="删除"
            type="Delete"
            event={() => this.handleDelete(v)}
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
    guid: '1',
  };

  //初期化事件
  componentDidMount() {
    this.initData();
    this.props.history.push('/spartPart/orderList');
  }

  //模拟数据
  initData() {
    this.getShipSparePartsList();
  }
  getShipSparePartsList() {
    const data_Source: ShipSparePartsModel[] = [];
    let params: Map<string, string> = new Map();
    params.set('currentPage', this.state.currentPage.toString());
    params.set('pageSize', this.state.pageSize.toString());
    getRequest('/business/spart/getSpartListByWeb', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response)) {
          forEach(response.data.records, (userDataCheck, index) => {
            const entity: ShipSparePartsModel = {};
            entity.index = index + 1 || '';
            entity.shelf = userDataCheck.shelf == 1 ? '已上架' : '未上架';
            entity.guid = userDataCheck.guid || '';
            entity.brand = userDataCheck.brand || '';
            entity.fileLog = userDataCheck.fileLog || '';
            entity.tradeName = userDataCheck.tradeName || '';
            entity.fileName = userDataCheck.fileName || '';
            entity.fileType = userDataCheck.fileType || '';
            entity.number = userDataCheck.number || '';
            entity.quantitySum = userDataCheck.quantitySum || '';
            entity.spartMoney = userDataCheck.money || '';
            data_Source.push(entity);
          });
          this.setState({
            dataSource: data_Source,
            total: response.data.total,
          });
        }
      }
    });
  }
  handleEdit = (guid: any) => {
    this.props.history.push('/spartPart/view/' + guid);
  };
  handleChange = (guid: any, data: any) => {
    let that = this;
    let params: Map<string, string> = new Map();
    params.set('guid', guid);
    confirm({
      icon: '',
      title: data.shelf == '已上架' ? '是否确认下架?' : '是否确认上架?',
      onOk() {
        getRequest('/business/spart/upPartShelf', params, response => {
          if (response.code == '0000') {
            that.initData();
          }
        });
      },
      onCancel() {},
    });
  };
  handleDelete = (guid: any) => {
    // this.props.history.push('/spartPart/view/' + guid);
  };
  findAll = () => {
    this.props.history.push('/spartPart/userList');
  };
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
                  style={{ width: '20%' }}
                  placeholder="请输入商品编号搜索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                />
                <Select
                  allowClear={true}
                  onSelect={(v: any) => {}}
                  placeholder="商品类目检索"
                  style={{ width: '20%' }}
                >
                  <Select.Option value={'发电机'}>发电机</Select.Option>
                  <Select.Option value={'辅机'}>辅机</Select.Option>
                </Select>
                <Input
                  style={{ width: '20%' }}
                  placeholder="商品名称检索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                />
                <Input
                  style={{ width: '20%' }}
                  placeholder="商品品牌检索"
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
                  type="BatchDelete"
                  text="订单列表"
                  event={() => {
                    this.props.history.push('/spartPart/orderList');
                  }}
                  disabled={true}
                />
                <QueryButton
                  type="Add"
                  text="新增商品"
                  event={() => {
                    this.props.history.push('/spartPart/add/');
                  }}
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
        </div>
      </div>
    );
  }
}
const MPCertificationList_Form = Form.create({ name: 'MPCertificationList_Form' })(
  ShipSparePartsList,
);

export default MPCertificationList_Form;
