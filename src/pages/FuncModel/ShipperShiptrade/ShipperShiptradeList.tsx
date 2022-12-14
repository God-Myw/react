import React from 'react';
import { Table, Form, Row, Col, Select } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { RouteComponentProps } from 'dva/router';
import { ShipperShiptradeModel } from './ShipperShiptradeModel';
import { ColumnProps } from 'antd/lib/table';
import getRequest from '@/utils/request';
import { isNil, forEach } from 'lodash';
import { getTableEnumText, getDictDetail } from '@/utils/utils';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import moment from 'moment';

class ShipTradeListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<ShipperShiptradeModel>[] = [
    {
      title: <FormattedMessage id="ShipperShiptrade-ShipperShiptradeList.shipTradeIndex" />,
      dataIndex: 'shipTradeIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipperShiptrade-ShipperShiptradeList.shipType" />,
      dataIndex: 'shipType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipperShiptrade-ShipperShiptradeList.tonNumber" />,
      dataIndex: 'tonNumber',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipperShiptrade-ShipperShiptradeList.shipAge" />,
      dataIndex: 'shipAge',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipperShiptrade-ShipperShiptradeList.tradeType" />,
      dataIndex: 'tradeType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipperShiptrade-ShipperShiptradeList.voyageArea" />,
      dataIndex: 'voyageArea',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipperShiptrade-ShipperShiptradeList.classificationSociety" />,
      dataIndex: 'classificationSociety',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.operation' }),
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: any) => (
        <span>
          <QueryButton
            text={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.examine' })}
            type="View"
            event={() => this.handleView(guid)}
            disabled={guid.state === 1}
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
    //船舶类型
    shipType: '',
    //交易身份
    tradeType: '',
    //当前页
    currentPage: 1,
    pageSize: 10,
    total: 0, //总页数
  };

  //初期化事件
  componentDidMount() {
    this.setState({
      //列
      columns: this.columns,
    });
    this.initData();
  }

  //模拟数据
  initData() {
    this.getShipTradeList();
  }

  //准备参数
  setParams(
    shipType: string,
    tradeType: string,
    pageSize: string,
    currentPage: string,
    date: any,
  ): Map<string, string> {
    let params: Map<string, string> = new Map();
    // 传的值接收

    params.set('type', '2');
    if (!isNil(pageSize) && pageSize != '') {
      params.set('pageSize', pageSize);
    }
    if (!isNil(currentPage) && currentPage != '') {
      params.set('currentPage', currentPage);
    }
    if (!isNil(shipType) && shipType !== '') {
      params.set('shipType', shipType);
    }
    if (!isNil(tradeType) && tradeType !== '') {
      params.set('tradeType', tradeType);
    }
    if (!isNil(date)) {
      params.set('date', date);
    }
    return params;
  }

  //获取表格数据
  getShipTradeList() {
    const data_Source: ShipperShiptradeModel[] = [];
    let param = this.setParams(
      this.state.shipType,
      this.state.tradeType,
      String(this.state.pageSize),
      String(this.state.currentPage),
      moment(),
    );
    console.log(param)
    getRequest('/business/shipTrade', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.shipTrades, (shipTrade, index) => {
            const entity: ShipperShiptradeModel = {};
            entity.shipTradeIndex = index + 1 + (this.state.currentPage - 1) * this.state.pageSize;
            entity.shipType = getTableEnumText('ship_type', shipTrade.shipType);
            entity.tradeType = getTableEnumText('trade_type', shipTrade.tradeType);
            entity.shipAge = getTableEnumText('ship_age', shipTrade.shipAge);
            entity.voyageArea = getTableEnumText('voyage_area', shipTrade.voyageArea);
            entity.tonNumber = shipTrade.tonNumber;
            entity.classificationSociety = getTableEnumText(
              'classification_society',
              shipTrade.classificationSociety,
            );
            entity.guid = shipTrade;
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
          currentPage: response.data.currentPage,
        });
      }
    });
  }

  //检索事件
  search() {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getShipTradeList();
      },
    );
  }

  handleView = (guid: any) => {
    this.props.history.push('/shiptradequery/view/' + guid.guid);
  };

  //交易身份
  handleTradingStatusSelect = (value: any) => {
    this.setState({
      tradeType: value,
    });
  };

  //船舶类型
  handleShipTypeSelect = (value: any) => {
    this.setState({
      shipType: value,
    });
  };

  //修改当前页码
  changePage = (page: any) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getShipTradeList();
      },
    );
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.shipTradeSelect' })}
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <Select
                allowClear={true}
                style={{ width: '20%' }}
                placeholder={formatMessage({
                  id: 'ShipperShiptrade-ShipperShiptradeList.tradeIdentitySelect',
                })}
                onChange={this.handleTradingStatusSelect}
              >
                {getDictDetail('trade_type').map((item: any) => (
                  <option value={item.code}>{item.textValue}</option>
                ))}
              </Select>
              <Select
                allowClear={true}
                placeholder={formatMessage({
                  id: 'ShipperShiptrade-ShipperShiptradeList.shipTypeSelect',
                })}
                style={{ width: '75%' }}
                onChange={this.handleShipTypeSelect}
              >
                {getDictDetail('ship_type').map((item: any) => (
                  <option value={item.code}>{item.textValue}</option>
                ))}
              </Select>

              <QueryButton
                type="Query"
                text={formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.search' })}
                event={this.search.bind(this)}
                disabled={false}
              />
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Table
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
                  {formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.total' })}{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  {formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.show' })}
                  {this.state.pageSize}
                  {formatMessage({ id: 'ShipperShiptrade-ShipperShiptradeList.records' })}
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

const ShipTradeList_Form = Form.create({ name: 'ShipTrade_List_Form' })(ShipTradeListForm);

export default ShipTradeList_Form;
