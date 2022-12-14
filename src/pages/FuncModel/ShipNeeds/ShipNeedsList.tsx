import { getRequest, putRequest } from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Form, Input, message, Modal, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { assign, forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { ShipNeedsModel } from './ShipNeedsModel';
import moment from 'moment';
const InputGroup = Input.Group;
const { confirm } = Modal;

class ShipTradeListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<ShipNeedsModel>[] = [
    {
      title: '序号',
      dataIndex: 'shipIndex',
      align: 'center',
    },
    {
      title: '交易身份',
      dataIndex: 'tradeType',
      align: 'center',
    },
    {
      title: '船舶类型',
      dataIndex: 'shipType',
      align: 'center',
    },
    {
      title: '吨位',
      dataIndex: 'tonNumber',
      align: 'center',
    },
    {
      title: '船龄',
      dataIndex: 'shipAge',
      align: 'center',
    },
    {
      title: '船级社',
      dataIndex: 'classificationSociety',
      align: 'center',
    },
    {
      title: '关闭状态',
      dataIndex: 'state',
      align: 'center',
      render: (state: any, record: any) => (
        <span>
          <QueryButton
            text={state.status === 1 ? '已关闭' : '未关闭'}
            type="ChangeStatus"
            event={() => this.handleOff(state.guid, record)}
            disabled={state.status === 1}
          />
        </span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: any) => (
        <span>
          <QueryButton
            text="查看"
            type="View"
            event={() => this.handleView(guid)}
            disabled={false}
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
    state: 0,
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };

  //初期华事件
  componentDidMount() {
    this.initData();
    this.setState({
      currentPage: localStorage.currentPage
    })
    localStorage.currentPage
      ? localStorage.removeItem('currentPage')
      : (localStorage.currentPage = this.state.currentPage);
    localStorage.shipType
      ? localStorage.removeItem('shipType')
      : (localStorage.shipType = this.state.shipType);
    localStorage.tradeType
      ? localStorage.removeItem('tradeType')
      : (localStorage.tradeType = this.state.tradeType);
  }

  //模拟数据
  initData() {
    this.getShipTradesList();
  }

  //获取表格数据
  getShipTradesList() {
    const data_Source: ShipNeedsModel[] = [];
    let param: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    param.set('type', '3');
    param.set('pageSize', this.state.pageSize.toString());
    param.set('currentPage', localStorage.currentPage || this.state.currentPage.toString());
    param.set('tradeType', localStorage.tradeType || this.state.tradeType);
    param.set('shipType', localStorage.shipType || this.state.shipType);
    param.set('data', moment().format("YYYY-MM-DD HH:mm:ss"));
    getRequest('/business/shipTrade/', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.shipTrades, (shipTrade, index) => {
            const entity: ShipNeedsModel = {};
            //序号修改
            entity.shipIndex = index + 1;
            assign(entity, shipTrade);
            entity.shipType = getTableEnumText('ship_type', shipTrade.shipType);
            entity.tradeType = getTableEnumText('trade_type', shipTrade.tradeType);
            entity.shipAge = getTableEnumText('ship_age', shipTrade.shipAge);
            entity.classificationSociety = getTableEnumText(
              'classification_society',
              shipTrade.classificationSociety
            );
            entity.guid = shipTrade;
            (entity.state = shipTrade), data_Source.push(entity);
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
  search() {
    localStorage.currentPage = 1;
    localStorage.shipType = this.state.shipType;
    localStorage.tradeType = this.state.tradeType;
    this.setState({
      currentPage: 1
    }, () => {
      this.getShipTradesList();
    })
  }

  //关闭船舶交易
  handleOff = (guid: any, record: any) => {
    const get = this;
    let param = {
      type: 1,
      status: 1,
      guid: guid,
    };
    confirm({
      title: '确定需要关闭?',
      content: '序号:' + record.shipIndex + ', 是否确认关闭',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        putRequest('/business/shipTrade/status', JSON.stringify(param), (response: any) => {
          if (response.status === 200) {
            message.success('关闭成功', 2);
            get.getShipTradesList();
          } else {
            message.error('关闭失败', 2);
          }
        });
      },
    });
  };

  handleView = (guid: any) => {
    if (guid.tradeType === 0) {
      this.props.history.push('/shipneeds/view/' + guid.guid);
    } else if (guid.tradeType === 1) {
      this.props.history.push('/shipneeds/viewForSale/' + guid.guid);
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
    localStorage.currentPage = page;
    this.setState({
      currentPage: page,
    }, () => {
      this.getShipTradesList();
    });
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="船舶需求"
          event={() => {
            this.props.history.push('/index_menu');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Select
                  allowClear={true}
                  style={{ width: '20%' }}
                  placeholder="交易身份选择"
                  onChange={this.handleTradeTypeSelect}
                >
                  {getDictDetail('trade_type').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <Select
                  allowClear={true}
                  placeholder="请输入船舶类型搜索"
                  style={{ width: '75%' }}
                  onChange={this.handleShipTypeSelect}
                >
                  {getDictDetail('ship_type').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <QueryButton
                  type="Query"
                  text="搜索"
                  event={this.search.bind(this)}
                  disabled={false}
                />
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
              showQuickJumper: true,
              pageSize: this.state.pageSize,
              current: this.state.currentPage,
              total: this.state.total,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  总共{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  页记录,每页显示
                  {this.state.pageSize}条记录
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
