import React from 'react';
import { Table, Input, Form, Row, Col, Select, Modal, message } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { RouteComponentProps } from 'dva/router';
import { ShipTradeModel } from './ShipTradeModel';
import { ColumnProps } from 'antd/lib/table';
import { getRequest, deleteRequest } from '@/utils/request';

import { isNil, forEach } from 'lodash';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import moment from 'moment';

const InputGroup = Input.Group;
const { confirm } = Modal;

class ShipTradeListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<ShipTradeModel>[] = [
    {
      title: <FormattedMessage id="ShipTrade-ShipTradeList.shipTradeIndex" />,

      dataIndex: 'shipIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipTrade-ShipTradeList.shipType" />,

      dataIndex: 'shipType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipTrade-ShipTradeList.shipAge" />,

      dataIndex: 'shipAge',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipTrade-ShipTradeList.tradeType" />,

      dataIndex: 'tradeType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipTrade-ShipTradeList.voyageArea" />,

      dataIndex: 'voyageArea',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipTrade-ShipTradeList.classificationSociety" />,

      dataIndex: 'classificationSociety',
      align: 'center',
    },
    {
      title: <FormattedMessage id="ShipTrade-ShipTradeList.state" />,

      dataIndex: 'state',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'ShipTrade-ShipTradeList.operation' }),
      dataIndex: 'guid',
      align: 'center',
      width: '22%',

      render: (guid: any) => (
        <span>
          <QueryButton
            text={formatMessage({ id: 'ShipTrade-ShipTradeList.update' })}
            type="Edit"
            event={() => this.handleEdit(guid)}
            disabled={guid.state === 1}
          />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'ShipTrade-ShipTradeList.exmaine' })}
            type="View"
            event={() => this.handleView(guid)}
            disabled={false}
          />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'ShipTrade-ShipTradeList.delete' })}
            type="Delete"
            event={() => this.handleDelete(guid.guid, guid.shipIndex)}
            disabled={guid.state === 1}
          />
        </span>
      ),
    },
  ];
  state = {
    //???
    columns: this.columns,
    //?????????
    dataSource: [],
    //????????????
    tradeType: '',
    //????????????
    shipType: '',
    pageSize: 10,
    currentPage: 1,
    total: 0,
  };

  //???????????????
  componentDidMount() {
    this.setState({
      //???
      columns: this.columns,
    });
    this.initData();
  }

  //????????????
  initData() {
    this.getShipTradesList();
  }

  //????????????
  setParams(
    tradeType: string,
    shipType: string,
    pageSize: string,
    currentPage: string,
    date: any,
  ): Map<string, string> {
    let params: Map<string, string> = new Map();
    // ??????????????????PC??????????????????
    params.set('type', '1');
    if (!isNil(tradeType) && tradeType != '') {
      params.set('tradeType', tradeType);
    }
    if (!isNil(shipType) && shipType != '') {
      params.set('shipType', shipType);
    }
    if (!isNil(pageSize) && pageSize != '') {
      params.set('pageSize', pageSize);
    }
    if (!isNil(currentPage) && currentPage != '') {
      params.set('currentPage', currentPage);
    }
    if (!isNil(date)) {
      params.set('date', date);
    }
    return params;
  }

  //??????????????????
  getShipTradesList() {
    const data_Source: ShipTradeModel[] = [];
    //????????????
    let param = this.setParams(
      isNil(this.state.tradeType) ? '' : String(this.state.tradeType),
      isNil(this.state.shipType) ? '' : String(this.state.shipType),
      isNil(this.state.pageSize) ? '' : String(this.state.pageSize),
      isNil(this.state.currentPage) ? '' : String(this.state.currentPage),
      moment(),
    );
    getRequest('/business/shipTrade/', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.shipTrades, (shipTrade, index) => {
            const entity: ShipTradeModel = {};
            shipTrade.shipIndex = index + 1 + (this.state.currentPage - 1) * this.state.pageSize;
            entity.shipIndex = shipTrade.shipIndex;
            entity.shipType = getTableEnumText('ship_type', shipTrade.shipType);
            entity.tradeType = getTableEnumText('trade_type', shipTrade.tradeType);
            entity.shipAge = getTableEnumText('ship_age', shipTrade.shipAge);
            entity.voyageArea = getTableEnumText('voyage_area', shipTrade.voyageArea);
            entity.classificationSociety = getTableEnumText(
              'classification_society',
              shipTrade.classificationSociety,
            );
            entity.state =
              shipTrade.state === 0
                ? formatMessage({ id: 'ShipTrade-ShipTradeList.unpublish' })
                : formatMessage({ id: 'ShipTrade-ShipTradeList.publish' });
            entity.guid = shipTrade;

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

  //????????????
  search() {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getShipTradesList();
      },
    );
  }

  //??????????????????
  handAddshipTrade = () => {
    this.props.history.push('/shipTrade/add/');
  };

  //??????????????????
  handleEdit = (guid: any) => {
    if (guid.tradeType === 0) {
      this.props.history.push('/shipTrade/edit/' + guid.guid);
    } else if (guid.tradeType === 1) {
      this.props.history.push('/shipTrade/editForSale/' + guid.guid);
    }
  };

  //??????????????????
  handleDelete = (e: any, shipIndex: any) => {
    const get = this;
    const entity: ShipTradeModel = this.state.dataSource[shipIndex - 1];
    const deleteMessage =
      formatMessage({ id: 'Myship-MyshipList.delete.confirmstart' }) +
      ' ' +
      formatMessage({ id: 'ShipTrade-ShipTradeList.shipTradeIndex' }) +
      ':' +
      entity.shipIndex +
      ' ' +
      formatMessage({ id: 'ShipTrade-ShipTradeList.shipType' }) +
      ':' +
      entity.shipType +
      ' ' +
      formatMessage({ id: 'ShipTrade-ShipTradeList.shipAge' }) +
      ':' +
      entity.shipAge +
      ' ' +
      formatMessage({ id: 'Myship-MyshipList.delete.confirmend' });
    confirm({
      title: deleteMessage,
      okText: formatMessage({ id: 'ShipTrade-ShipTradeList.confirm' }),
      cancelText: formatMessage({ id: 'ShipTrade-ShipTradeList.cancel' }),
      onOk() {
        let requestParam: Map<string, string> = new Map();
        requestParam.set('type', '1'),
          deleteRequest('/business/shipTrade/' + e, requestParam, (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'ShipTrade-ShipTradeList.successfullyDelete' }),
                2,
              );
              get.getShipTradesList();
            } else {
              message.error(formatMessage({ id: 'ShipTrade-ShipTradeList.failDelete' }), 2);
            }
          });
      },
    });
  };

  handleView = (guid: any) => {
    if (guid.tradeType === 0) {
      this.props.history.push('/shipTrade/view/' + guid.guid);
    } else if (guid.tradeType === 1) {
      this.props.history.push('/shipTrade/viewForSale/' + guid.guid);
    }
  };

  handleTradeTypeSelect = (value: any) => {
    this.setState({
      tradeType: value,
    });
  };
  handleShipTypeSelect = (value: any) => {
    this.setState({
      shipType: value,
    });
  };

  //??????????????????
  changePage = (page: any) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getShipTradesList();
      },
    );
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'ShipTrade-ShipTradeList.shipTrade' })}
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Select
                  allowClear={true}
                  style={{ width: '20%' }}
                  placeholder={formatMessage({ id: 'ShipTrade-ShipTradeList.tradeIdentity' })}
                  onChange={this.handleTradeTypeSelect}
                >
                  {getDictDetail('trade_type').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <Select
                  allowClear={true}
                  placeholder={formatMessage({ id: 'ShipTrade-ShipTradeList.shipTypeSelect' })}
                  style={{ width: '71.5%' }}
                  onChange={this.handleShipTypeSelect}
                >
                  {getDictDetail('ship_type').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <QueryButton
                  type="Query"
                  text={formatMessage({ id: 'ShipTrade-ShipTradeList.search' })}
                  event={this.search.bind(this)}
                  disabled={false}
                />
                <QueryButton type="Add" text="" event={this.handAddshipTrade} disabled={false} />
              </InputGroup>
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

const ShipTradeList_Form = Form.create({ name: 'shipTrade_List_Form' })(ShipTradeListForm);

export default ShipTradeList_Form;
