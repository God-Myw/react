import getRequest from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Form, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { ShipownerShiptradeQueryModel } from './ShipownerShiptradeQueryModel';
import moment from 'moment';

class ShipowerShiptradeListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<ShipownerShiptradeQueryModel>[] = [
    {
      title: <FormattedMessage id='ShipownerShiptradeQuery-ShipownerShiptradeQueryList.index' />,
      dataIndex: 'shipTradeIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShiptradeQuery-ShipownerShiptradeQueryList.shipType' />,
      dataIndex: 'shipType',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShiptradeQuery-ShipownerShiptradeQueryList.tonnage' />,
      dataIndex: 'tonNumber',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShiptradeQuery-ShipownerShiptradeQueryList.shipAge' />,
      dataIndex: 'shipAge',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShiptradeQuery-ShipownerShiptradeQueryList.tradeType' />,
      dataIndex: 'tradeType',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShiptradeQuery-ShipownerShiptradeQueryList.voyageArea' />,
      dataIndex: 'voyageArea',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShiptradeQuery-ShipownerShiptradeQueryList.classificationSociety' />,
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
    }
  ];

  state = {
    //列
    columns: this.columns,
    //表数据
    dataSource: [],
    //交易身份
    tradeType: '',
    //船舶类型
    shipType: '',
    //当前页
    currentPage: 1,
    pageSize: 10,
    total: 0, //总页数
  };
  value: any;

  //初期化事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    this.getShipTradeList();
  }

  //获取表格数据
  getShipTradeList() {
    const data_Source: ShipownerShiptradeQueryModel[] = [];
    let params: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '2');
    params.set('pageSize', this.state.pageSize.toString());
    params.set('currentPage', this.state.currentPage.toString());
    params.set('tradeType', isNil(this.state.tradeType) ? '' : this.state.tradeType);
    params.set('shipType', isNil(this.state.shipType) ? '' : this.state.shipType);
    params.set('data',moment().format("YYYY-MM-DD HH:mm:ss"));
    getRequest('/business/shipTrade/', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.shipTrades, (shipTrade, index) => {
            const entity: ShipownerShiptradeQueryModel = {};
            //序号修改
            entity.shipTradeIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;;
            entity.shipType = getTableEnumText('ship_type', shipTrade.shipType);
            entity.tradeType = getTableEnumText('trade_type', shipTrade.tradeType);
            entity.shipAge = getTableEnumText('ship_age', shipTrade.shipAge);
            entity.voyageArea = getTableEnumText('voyage_area', shipTrade.voyageArea);
            entity.tonNumber = shipTrade.tonNumber;
            entity.classificationSociety = getTableEnumText(
              'classification_society',
              shipTrade.classificationSociety
            );
            entity.guid = shipTrade;
            data_Source.push(entity);
          });
        }
        this.setState({
          total: response.data.total,
          currentPage: response.data.currentPage,
          dataSource: data_Source,
        });
      }
    });
  }

  //检索事件
  search() {
    this.setState({
      currentPage: 1,
    }, () => {
      this.getShipTradeList();
    });
  }

  handleView = (guid: any) => {
    this.props.history.push('/ShipownerShipTradeQuery/view/' + guid.guid);
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
          text={formatMessage({ id: 'ShipownerShiptradeQuery-ShipownerShiptradeQueryList.shipTradeExamine' })}
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
                placeholder={formatMessage({ id: 'ShipownerShiptradeQuery-ShipownerShiptradeQueryList.tradeIdentitySelect' })}
                onChange={this.handleTradingStatusSelect}
              >
                {getDictDetail('trade_type').map((item: any) => (
                  <option value={item.code}>{item.textValue}</option>
                ))}
              </Select>
              <Select
                allowClear={true}
                placeholder={formatMessage({ id: 'ShipownerShiptradeQuery-ShipownerShiptradeQueryList.shipTypeSelect' })}
                style={{ width: '75%' }}
                onChange={this.handleShipTypeSelect}
              >
                {getDictDetail('ship_type').map((item: any) => (
                  <option value={item.code}>{item.textValue}</option>
                ))}
              </Select>

              <QueryButton
                type="Query"
                text={formatMessage({ id: 'ShipownerShiptradeQuery-ShipownerShiptradeQueryList.search' })}
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
                  {formatMessage({ id: 'ShipownerShiptradeQuery-ShipownerShiptradeQueryList.total' })}{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  {formatMessage({ id: 'ShipownerShiptradeQuery-ShipownerShiptradeQueryList.show' })}
                  {this.state.pageSize}{formatMessage({ id: 'ShipownerShiptradeQuery-ShipownerShiptradeQueryList.records' })}
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

const ShipTradeList_Form = Form.create({ name: 'ShipTrade_List_Form' })(ShipowerShiptradeListForm);

export default ShipTradeList_Form;
