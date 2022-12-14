import React from 'react';
import { Select } from 'antd';
import { Table, Input, Form, Row, Col } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { RouteComponentProps } from 'dva/router';
import { ParttradeModel } from './ParttradeModel';
import { ColumnProps } from 'antd/lib/table';
import getRequest from '@/utils/request';
import { isNil, forEach, assign } from 'lodash';
import { formatMessage ,FormattedMessage } from 'umi-plugin-locale';

const InputGroup = Input.Group;
const columns: ColumnProps<ParttradeModel>[] = [
  {
    title: <FormattedMessage id='Parttrade-ParttradeList.parttradeIndex'/>,
    dataIndex: 'parttradeIndex',
    align: 'center',
  },
  {
    title: <FormattedMessage id='Parttrade-ParttradeList.tradeType'/>,
    dataIndex: 'tradeType',
    align: 'center',
  },
  {
    title: <FormattedMessage id='Parttrade-ParttradeList.partName'/>,
    dataIndex: 'partName',
    align: 'center',
  },
  {
    title: <FormattedMessage id='Parttrade-ParttradeList.partModel'/>,
    dataIndex: 'partModel',
    align: 'center',
  },
  {
    title: <FormattedMessage id='Parttrade-ParttradeList.partCount'/>,
    dataIndex: 'partCount',
    align: 'center',
  },
  {
    title: <FormattedMessage id='Parttrade-ParttradeList.drawingNumber'/>,
    dataIndex: 'drawingNumber',
    align: 'center',
  },
  {
    title: <FormattedMessage id='Parttrade-ParttradeList.partNumber'/>,
    dataIndex: 'partNumber',
    align: 'center',
  },
];

class ParttradeListForm extends React.Component<RouteComponentProps> {
  state = {
    //列
    columns: columns,
    //表数据
    dataSource: [],
    //货物名称
    partName: '',
    //交易身份
    tradeType: '',
    //当前页
    currentPage: 1,
    pageSize:10,
    total:0,
  };

  //初期化事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    if (this.state.columns.length === 7) {
      this.state.columns.push({
        title: formatMessage({ id: 'ShipTrade-ShipTradeList.operation' }),
        dataIndex: 'guid',
        align: 'center',
        width: '16%',
        render: (guid: any) => (
          <span>
            <QueryButton text={formatMessage({ id: 'Parttrade-ParttradeList.examine' })} type="View" event={() => this.handleView(guid)} />
          </span>
        ),
      });
    }
    this.getParttradeList();
  }

  //准备参数
  setParams(partName: string, tradeType: string): Map<string, string> {
    let params: Map<string, string> = new Map();
    params.set('currentPage', '1');
    params.set('pageSize', '15');
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    if (!isNil(partName) && partName !== '') {
      params.set('partName', partName);
    }
    if (!isNil(tradeType) && tradeType !== '') {
      params.set('tradeType', tradeType);
    }

    return params;
  }

  //获取表格数据
  getParttradeList() {
    const data_Source: ParttradeModel[] = [];
    let param = this.setParams(this.state.partName.toString(), this.state.tradeType.toString());
    getRequest('/business/parttrade/', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.parttrade, (parttrade, index) => {
            const entity: ParttradeModel = {};
            entity.parttradeIndex = index + 1;
            assign(entity, parttrade);
            data_Source.push(entity);
          });
        }
        this.setState({
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
      this.getParttradeList();
    });
  }
  //交易身份
  handletradeTypeSelect = (value: any) => {
    this.setState({
      tradeType: value,
    });
  };

  handleView = (guid: any) => {
    this.props.history.push('/parttrade/view/' + guid);
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'Parttrade-ParttradeList.partTradeSelect' })}
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Select
                  placeholder={formatMessage({ id: 'Parttrade-ParttradeList.tradeIdentitySelect' })}
                  style={{ width: '24%' }}
                  onChange={this.handletradeTypeSelect}
                >
                  <option value="0">{formatMessage({ id: 'Parttrade-ParttradeList.seller' })}</option>
                  <option value="1">{formatMessage({ id: 'Parttrade-ParttradeList.buyer' })}</option>
                </Select>
                <Input
                  style={{ width: '70%' }}
                  placeholder={formatMessage({ id: 'Parttrade-ParttradeList.inputgoodsName' })}
                  onChange={e => this.setState({ partName: e.target.value })}
                />

                <QueryButton type="Query" text={formatMessage({ id: 'Parttrade-ParttradeList.search' })} event={this.search.bind(this)} />
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
              total:this.state.total,
              showTotal: () => (
                <div>
                  {formatMessage({ id: 'Parttrade-ParttradeList.total' })}{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  {formatMessage({ id: 'Parttrade-ParttradeList.show' })}
                  {this.state.pageSize}{formatMessage({ id: 'Parttrade-ParttradeList.records' })}
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

const ParttradeList_Form = Form.create({ name: 'Parttrade_List_Form' })(ParttradeListForm);

export default ParttradeList_Form;
