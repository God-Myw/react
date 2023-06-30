import React from 'react';
import { RouteComponentProps } from 'dva/router';
import { Table, Input, Form, Row, Col, Select, Modal } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import { ShipSparePartsModel, SpartUserListModel } from './ShipSparePartsModel';
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
      title: '订单号',
      dataIndex: 'suNumber',
      align: 'center',
    },
    {
      title: '商品分类',
      dataIndex: 'twoLevelId',
      align: 'center',
    },
    {
      title: '商品图片',
      dataIndex: 'fileName',
      align: 'center',
      render: (v: any) => (
        <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <img style={{ width: '70px', height: '23px' }} src={v} alt="" />
        </span>
      ),
    },
    {
      title: '商品',
      dataIndex: 'tradeName',
      align: 'center',
      width: '20%',
    },
    {
      title: '单价',
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
      render: v => (
        <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          {v == 1 ? '待付款' : v == 2 ? '待发货' : v == 3 ? '已发货' : '已完成'}
        </span>
      ),
    },
    {
      title: '联系人',
      dataIndex: 'accountId',
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
          <QueryButton text="查看" type="View" event={() => this.handleEdit(v)} disabled={false} />
          <QueryButton
            text={data.type == 1 ? '取消订单' : '发货'}
            type={data.type == 1 ? 'Delete' : 'Send'}
            event={() => this.handleChange(v, data)}
            disabled={false}
          />
        </span>
      ),
    },
  ];
  state = {
    columns: this.columns,
    dataSource: data_Source,
    spartLevelList: [],
    total: 0,
    pageSize: 10,
    currentPage: 1,
    guid: '1',
  };

  //初期化事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    let params: Map<string, string> = new Map();
    params.set('level', '');
    getRequest('/business/spartLevel/getSpartLevel', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response)) {
          this.setState({
            spartLevelList: response.data,
          });
        }
      }
    });
    this.getShipSparePartsList();
  }
  getShipSparePartsList() {
    const data_Source: SpartUserListModel[] = [];
    let params: Map<string, string> = new Map();
    params.set('currentPage', this.state.currentPage.toString());
    params.set('pageSize', this.state.pageSize.toString());
    getRequest('/business/spartUser/getSpartUserList', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response)) {
          forEach(response.data.records, (userDataCheck, index) => {
            const entity: SpartUserListModel = {};
            entity.index = index + 1 || '';
            entity.type = userDataCheck.type || '';
            entity.twoLevelId = userDataCheck.twoLevelId || '';
            entity.accountId = userDataCheck.accountId || '';
            entity.guid = userDataCheck.guid || '';
            entity.suNumber = userDataCheck.suNumber || '';
            entity.tradeName = userDataCheck.tradeName || '';
            entity.phoneNumber = userDataCheck.phoneNumber || '';
            entity.fileName =
              userDataCheck.fileSource == '1'
                ? `http://58.33.34.10:10443/images/spart/${userDataCheck.fileName}`
                : `http://39.105.35.83:10443/images/spart/${userDataCheck.fileName}`;
            entity.createDate = userDataCheck.createDate || '';
            entity.quantity = userDataCheck.quantity || '';
            entity.spartMoney = userDataCheck.spartMoney || '';
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
    this.props.history.push('/spartPart/orderList');
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
                  style={{ width: '18%' }}
                  placeholder="请输入订单编号搜索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                />
                <Select
                  allowClear={true}
                  onSelect={(v: any) => {}}
                  placeholder="商品分类检索"
                  style={{ width: '18%' }}
                >
                  {this.state.spartLevelList.map((item: any) => (
                    <Select.Option key={item.oneLevelName} value={item.oneLevelName}>
                      {item.oneLevelName}
                    </Select.Option>
                  ))}
                </Select>
                <Input
                  style={{ width: '18%' }}
                  placeholder="商品名称检索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                />
                <Input
                  style={{ width: '18%' }}
                  placeholder="订单联系人检索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                />
                <Input
                  style={{ width: '18%' }}
                  placeholder="订单联系方式检索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                />
                <QueryButton
                  type="Query"
                  text="搜索"
                  event={() => this.findAll()}
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
