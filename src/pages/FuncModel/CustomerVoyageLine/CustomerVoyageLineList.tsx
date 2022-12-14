import getRequest from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Col, Input, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { CustomerVoyageLineModel } from './CustomerVoyageLineModel';

class getCustorVoyageListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<CustomerVoyageLineModel>[] = [
    {
      title: '序号',
      dataIndex: 'vayageIndex',
      align: 'center',
    },
    {
      title: '航线名称',
      dataIndex: 'voyageLineName',
      align: 'center',
    },
    {
      title: '航线编号',
      dataIndex: 'voyageLineNumber',
      align: 'center',
    },
    {
      title: '航次意向',
      dataIndex: 'voyageIntention',
      align: 'center',
    },
    {
      title: '船舶当前位置',
      dataIndex: 'currentPort',
      align: 'center',
    },
    {
      title: '意向区域',
      dataIndex: 'locationIntention',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: any, record: any) => (
        <span>
          <QueryButton
            text='查看'
            type="View"
            event={() => this.handleView(guid, record)}
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
    //航次编号
    voyageLineNumber: '',
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

  initData() {
    this.getCustorVoyageList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getCustorVoyageList();
   }
  }

  //获取表格数据
  getCustorVoyageList() {
    const data_Source: CustomerVoyageLineModel[] = [];
    let params: Map<string, any> = new Map();
    params.set('type', '1');
    params.set('pageSize', this.state.pageSize.toString());
    params.set('currentPage', this.state.currentPage.toString());
    if (!isNil(this.state.voyageLineNumber) && this.state.voyageLineNumber !== '') {
      params.set('voyageLineNumber', this.state.voyageLineNumber);
    }
    params.set('date', moment());
    getRequest('/business/voyageLine', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.voyageLines, (voyageLine, index) => {
            const entity: CustomerVoyageLineModel = {};
            entity.key = index + 1;
            entity.vayageIndex = index + 1 + (this.state.currentPage - 1) * this.state.pageSize;
            entity.voyageLineName = voyageLine.voyageLineName;
            entity.voyageLineNumber = voyageLine.voyageLineNumber;
            entity.voyageIntention = getTableEnumText('voyage_intention', voyageLine.voyageIntention);
            entity.currentPort = getTableEnumText('port', voyageLine.currentPort);
            entity.locationIntention = getTableEnumText('voyage_area', voyageLine.locationIntention);
            entity.guid = voyageLine.guid;
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
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getCustorVoyageList();
      },
    );
  }

  //修改当前页码
  changePage = (page: any) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getCustorVoyageList();
      },
    );
  };
  handleView = (guid: any, record: any) => {
    this.props.history.push('/customervoyageLine/view/' + guid);
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text='航线配置' event={() => { this.props.history.push('/index_menu/'); }} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <Input
                placeholder="请输入航线编号搜索"
                style={{ width: '95%', textAlign: 'left' }}
                onChange={e => this.setState({ voyageLineNumber: e.target.value })}
                onKeyUp={this.keyUp}
              />
              <QueryButton
                type="Query"
                text='搜索'
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

export default getCustorVoyageListForm;
