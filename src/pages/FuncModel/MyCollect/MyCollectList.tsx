import getRequest from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { MyCollectModel } from './MyCollectModel';

class MyCollectListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<MyCollectModel>[] = [
    {
      title: <FormattedMessage id="PalletDynamics-PalletDynamicsList.code" />,
      dataIndex: 'goodsIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id="PalletDynamics-PalletDynamicsList.name" />,
      dataIndex: 'goodsLevel',
      align: 'center',
    },
    {
      title: <FormattedMessage id="PalletDynamics-PalletDynamicsList.type" />,
      dataIndex: 'goodsType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="PalletDynamics-PalletDynamicsList.quality" />,
      dataIndex: 'goodsProperty',
      align: 'center',
    },
    {
      title: <FormattedMessage id="PalletDynamics-PalletDynamicsList.number" />,
      dataIndex: 'goodsCount',
      align: 'center',
    },
    {
      title: <FormattedMessage id="PalletDynamics-PalletDynamicsList.departure" />,
      dataIndex: 'startPort',
      align: 'center',
    },
    {
      title: <FormattedMessage id="PalletDynamics-PalletDynamicsList.destination" />,
      dataIndex: 'destinationPort',
      align: 'center',
    },
    {
      title: <FormattedMessage id="PalletDynamics-PalletDynamicsList.superimposed" />,
      dataIndex: 'isSuperposition',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'PalletDynamics-PalletDynamicsList.operate' }),
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: any) => (
        <span>
          <QueryButton text={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.check' })} type="View" event={() => this.handleView(guid)} />
        </span>
      ),
    }
  ];

  state = {
    //列
    columns: this.columns,
    //表数据
    dataSource: [],
    //货物名称
    goodsLevel: '',
    total: 0,
    currentPage: 1,
    pageSize: 10,
  };

  //初期化事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    this.getMyCollectList();
  }

  //获取表格数据
  getMyCollectList() {
    const data_Source: MyCollectModel[] = [];
    let params: Map<string, any> = new Map();
    // 查询货盘-我的收藏列表
    params.set('type', '2');
    if (!isNil(this.state.goodsLevel) && this.state.goodsLevel !== '') {
      params.set('goodsLevel', this.state.goodsLevel);
    }
    params.set('date', moment());
    params.set('pageSize', this.state.pageSize.toString());
    params.set('currentPage', this.state.currentPage.toString());
    getRequest('/business/pallet', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.pallets, (pallet, index) => {
            const entity: MyCollectModel = {};
            entity.goodsIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.guid = pallet.guid;
            entity.goodsCount = pallet.goodsCount;
            entity.goodsLevel = getTableEnumText('goods_name', pallet.goodsLevel);
            entity.goodsType = getTableEnumText('goods_type', pallet.goodsType);
            entity.goodsProperty = getTableEnumText('goods_property', pallet.goodsProperty);
            entity.startPort = getTableEnumText('port', pallet.startPort);
            entity.destinationPort = getTableEnumText('port', pallet.destinationPort);
            entity.isSuperposition = getTableEnumText('is_superposition', pallet.isSuperposition);
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total
        });
      }
    });
  }

  //检索事件
  search() {
    this.setState({
      currentPage: 1
    }, () => {
      this.getMyCollectList();
    })
  }

  handleView = (guid: any) => {
    this.props.history.push('/mycollect/view/' + guid);
  };

  selectChange = (value: any) => {
    this.setState({
      goodsLevel: value,
    });
  };

  //修改当前页码
  changePage = (page: any) => {
    this.setState({
      currentPage: page,
    }, () => {
      this.getMyCollectList();
    });
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'collect-collect.My.collected' })}
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <Select
                allowClear={true}
                style={{ width: '95%' }}
                placeholder={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.enter-name-search' })}
                onChange={this.selectChange}
              >
                {getDictDetail('goods_name').map((item: any) => (
                  <Select.Option value={item.code}>{item.textValue}</Select.Option>
                ))}
              </Select>
              <QueryButton type="Query" text={formatMessage({ id: 'PalletDynamics-PalletDynamicsList.search' })} event={this.search.bind(this)} />
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Table
            rowKey={record => (!isNil(record.guid) ? record.guid.toString() : '')}
            bordered
            columns={this.state.columns}
            size="small"
            dataSource={this.state.dataSource}
            rowClassName={(record, index) =>
              index % 2 == 0 ? commonCss.dataRowOdd : commonCss.dataRowEven
            }
            pagination={{
              showQuickJumper: true,
              pageSize: this.state.pageSize,
              current: this.state.currentPage,
              total: this.state.total,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  <FormattedMessage id="PalletDynamics-PalletDynamicsList.total" />{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  <FormattedMessage id="PalletDynamics-PalletDynamicsList.pages" />
                  {this.state.pageSize}<FormattedMessage id="PalletDynamics-PalletDynamicsList.records" />
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

export default MyCollectListForm;
