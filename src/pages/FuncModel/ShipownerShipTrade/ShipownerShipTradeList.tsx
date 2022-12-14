import { deleteRequest, getRequest } from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Form, Input, message, Modal, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { ShipownerShipTradeModel } from './ShipownerShipTradeModel';
import moment from 'moment';


const InputGroup = Input.Group;
const { confirm } = Modal;



class ShipownerShipTradeListForm extends React.Component<RouteComponentProps> {

  private columns: ColumnProps<ShipownerShipTradeModel>[] = [
    {
      title: <FormattedMessage id='ShipownerShipTrade-ShipownerShipTradeList.index' />,
      dataIndex: 'shipIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShipTrade-ShipownerShipTradeList.shipType' />,
      dataIndex: 'shipType',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShipTrade-ShipownerShipTradeList.shipAge' />,
      dataIndex: 'shipAge',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShipTrade-ShipownerShipTradeList.tradeType' />,
      dataIndex: 'tradeType',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShipTrade-ShipownerShipTradeList.voyageArea' />,
      dataIndex: 'voyageArea',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShipTrade-ShipownerShipTradeList.classificationSociety' />,
      dataIndex: 'classificationSociety',
      align: 'center',
    },
    {
      title: <FormattedMessage id='ShipownerShipTrade-ShipownerShipTradeList.realseState' />,
      dataIndex: 'state',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.operation' }),
      dataIndex: 'guid',
      align: 'center',
      width: '22%',
      render: (guid: any) => (
        <span>
          <QueryButton
            text={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.update' })}
            type="Edit"
            event={() => this.handleEdit(guid)}
            disabled={guid.state === 1}
          />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.examine' })}
            type="View"
            event={() => this.handleView(guid)}
            disabled={false}
          />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.delete' })}
            type="Delete"
            event={() => this.handleDelete(guid.guid, guid.shipIndex)}
            disabled={guid.state === 1}
          />

        </span>
      ),
    }
  ];

  state = {
    //列111
    columns: this.columns,
    //表数据
    dataSource: [],
    //交易身份
    tradeType: '',
    //船舶类型
    shipType: '',
    pageSize: 10,
    currentPage: 1,
    total: 0, //总页数
  };

  //初期化事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    this.getShipTradesList();
  }

  //获取表格数据
  getShipTradesList() {
    const data_Source: ShipownerShipTradeModel[] = [];
    //设置参数
    console.log(this.state.tradeType)
    console.log(this.state.shipType)
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('pageSize', this.state.pageSize.toString());
    params.set('currentPage', this.state.currentPage.toString());
    params.set('tradeType', isNil(this.state.tradeType) ? '' : this.state.tradeType);

    params.set('shipType', isNil(this.state.shipType) ? '' : this.state.shipType);
    params.set('data',moment().format("YYYY-MM-DD HH:mm:ss"));
    getRequest('/business/shipTrade/', params, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.shipTrades, (shipTrade, index) => {
            const entity: ShipownerShipTradeModel = {};
            //序号修改
            shipTrade.shipIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.shipIndex = shipTrade.shipIndex;
            entity.shipType = getTableEnumText('ship_type', shipTrade.shipType);
            entity.tradeType = getTableEnumText('trade_type', shipTrade.tradeType);
            entity.shipAge = getTableEnumText('ship_age', shipTrade.shipAge);
            entity.voyageArea = getTableEnumText('voyage_area', shipTrade.voyageArea);
            entity.classificationSociety = getTableEnumText(
              'classification_society',
              shipTrade.classificationSociety
            );
            entity.state = shipTrade.state === 0 ? '未发布' : '已发布';
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
  //返回back
  onBack = () => {
    this.props.history.push('/index_menu');
  };
  //检索事件
  search() {
    this.setState({
      currentPage: 1
    }, () => {
      this.getShipTradesList();
    })
  }

  //新增船舶交易
  handAddshipTrade = () => {
    this.props.history.push('/ShipownerShipTrade/addForBuy/');
  };

  //修改船舶交易
  handleEdit = (guid: any) => {
    if (guid.tradeType === 0) {
      this.props.history.push('/ShipownerShipTrade/editForBuy/' + guid.guid);
    } else if (guid.tradeType === 1) {
      this.props.history.push('/ShipownerShipTrade/editForSale/' + guid.guid);
    }
  };

  //删除船舶交易
  handleDelete = (guid: any, shipIndex: any) => {
    const get = this;
    const entity: ShipownerShipTradeModel = this.state.dataSource[shipIndex - 1];
    const deleteMessage = formatMessage({ id: 'Myship-MyshipList.delete.confirmstart' })
      + ' ' + formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.index' }) + ':' + entity.shipIndex
      + ' ' + formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.shipType' }) + ':' + entity.shipType
      + ' ' + formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.shipAge' }) + ':' + entity.shipAge
      + ' ' + formatMessage({ id: 'Myship-MyshipList.delete.confirmend' });
    confirm({
      title: deleteMessage,
      okText: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.confirm' }),
      cancelText: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.cancel' }),
      onOk() {
        console.log('OK');
        let requestParam: Map<string, string> = new Map();
        requestParam.set('type', '1'),
          deleteRequest('/business/shipTrade/' + guid, requestParam, (response: any) => {
            if (response.status === 200) {
              message.success(formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.successfulDelete' }), 2);
              get.getShipTradesList();
            } else {
              message.error(formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.failDelete' }), 2);

            }
          });
      },
    });
  };

  handleView = (guid: any) => {
    if (guid.tradeType === 0) {
      this.props.history.push('/ShipownerShipTrade/viewForBuy/' + guid.guid);
    } else if (guid.tradeType === 1) {
      this.props.history.push('/ShipownerShipTrade/viewForSale/' + guid.guid);
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

  //修改当前页码
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
        <LabelTitleComponent text={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.shipTrade' })}
          event={() => {
            this.onBack();
          }} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Select
                  allowClear={true}
                  style={{ width: '20%' }}
                  placeholder={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.tradeIdentity' })}
                  onChange={this.handleTradeTypeSelect}
                >
                  {getDictDetail('trade_type').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <Select
                  allowClear={true}
                  placeholder={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.shipTypeSelete' })}
                  style={{ width: '71.5%' }}
                  onChange={this.handleShipTypeSelect}
                >
                  {getDictDetail('ship_type').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <QueryButton
                  type="Query"
                  text={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.search' })}
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
              onChange: this.changePage,
              total: this.state.total,
              showTotal: () => (
                <div>
                  {formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.total' })}{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  {formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.show' })}
                  {this.state.pageSize}{formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.records' })}

                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

const ShipTradeList_Form = Form.create({ name: 'shipTrade_List_Form' })(ShipownerShipTradeListForm);

export default ShipTradeList_Form;
