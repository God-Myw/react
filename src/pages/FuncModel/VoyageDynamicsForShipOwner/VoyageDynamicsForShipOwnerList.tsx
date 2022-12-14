import React from 'react';
import { Table, Input, Form, Row, Col, Select } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { RouteComponentProps } from 'dva/router';
import { ColumnProps } from 'antd/lib/table';
import getRequest from '@/utils/request';
import { getTableEnumText, getDictDetail } from '@/utils/utils';
import { isNil, forEach } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import moment from 'moment';
import { VoyageDynamicsModel } from '../VoyageDynamics/VoyageDynamicsModel';

class VoyageDynamicsForShipOwnerListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<VoyageDynamicsModel>[] = [
    {
      title: <FormattedMessage id="VoyageDynamics-VoyageDynamicsList.voyageIndex" />,
      dataIndex: 'voyageIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id="VoyageDynamics-VoyageDynamicsList.shipDeck" />,
      dataIndex: 'shipDeck',
      align: 'center',
    },
    {
      title: <FormattedMessage id="VoyageDynamics-VoyageDynamicsList.shipType" />,
      dataIndex: 'shipType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="VoyageDynamics-VoyageDynamicsList.acceptTon" />,
      dataIndex: 'acceptTon',
      align: 'center',
    },
    {
      title: <FormattedMessage id="VoyageDynamics-VoyageDynamicsList.shipCrane" />,
      dataIndex: 'shipCrane',
      align: 'center',
    },
    {
      title: <FormattedMessage id="VoyageDynamics-VoyageDynamicsList.shipVoyage" />,
      dataIndex: 'shipVoyage',
      align: 'center',
    },
    {
      title: <FormattedMessage id="VoyageDynamics-VoyageDynamicsList.shipRouter" />,
      dataIndex: 'voyageLineName',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.operation' }),
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: any) => (
        <span>
          <QueryButton
            text={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.check' })}
            type="View"
            event={() => this.handleView(guid)}
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
    //载重吨位
    toNumber: '',
    //当前页
    currentPage: 1,
    total: 0,
    pageSize: 10,
  };

  //初期化事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    this.setState({
      //列
      columns: this.columns,
    });
    this.getVoyageDynamicsList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getVoyageDynamicsList();
   }
  }

  //获取表格数据
  getVoyageDynamicsList() {
    const data_Source: VoyageDynamicsModel[] = [];
    let params: Map<string, any> = new Map();
    // 查询航次一览（货主）
    params.set('type', '2');
    params.set('currentPage', this.state.currentPage);
    params.set('pageSize', this.state.pageSize);
    params.set('toNumber', isNil(this.state.toNumber) || this.state.toNumber === ''?'':this.state.toNumber);
    params.set('shipType', isNil(this.state.shipType) || this.state.shipType === ''?'':this.state.shipType);
    params.set('data', moment());
    getRequest('/business/voyage/', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.voyages, (voyage, index) => {
            const entity: VoyageDynamicsModel = {};
            entity.voyageIndex = index + 1 + (this.state.currentPage - 1) * this.state.pageSize;
            entity.guid = voyage.guid;
            entity.shipType = getTableEnumText('ship_type', voyage.shipType);
            entity.shipDeck = getTableEnumText('ship_deck', voyage.shipDeck);
            entity.acceptTon = voyage.toNumber;
            entity.shipCrane = voyage.shipCrane;
            entity.shipVoyage = voyage.shipVoyage;
            entity.voyageLineName = voyage.voyageLineName;
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

  //检索事件
  search() {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getVoyageDynamicsList();
      },
    );
  }

  //获取船舶类型下拉值检索
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
        this.getVoyageDynamicsList();
      },
    );
  };

  //跳转查看页面
  handleView = (guid: any) => {
    if (localStorage.getItem('userType') === '3') {
      this.props.history.push('/customervoyagedynamics/view/' + guid);
    } else {
      this.props.history.push('/voyagedynamics/view/' + guid);
    }
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.voyageDynamics' })}
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
                  id: 'VoyageDynamics-VoyageDynamicsList.searchShipType',
                })}
                onChange={this.handleShipTypeSelect}
              >
                {getDictDetail('ship_type').map((item: any) => (
                  <option value={item.code}>{item.textValue}</option>
                ))}
              </Select>
              <Input
                style={{ width: '75%' }}
                maxLength={12}
                placeholder={formatMessage({
                  id: 'VoyageDynamics-VoyageDynamicsList.searchMaxTon',
                })}
                onChange={e => this.setState({ toNumber: e.target.value })}
                onKeyUp={this.keyUp}
              />
              <QueryButton
                type="Query"
                text={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.search' })}
                event={this.search.bind(this)}
              />
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
              total: this.state.total,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  {formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.total' })}{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  {formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.show' })}
                  {this.state.pageSize}
                  {formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.record' })}
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

const VoyageDynamicsForShipOwnerList_Form = Form.create({ name: 'Voyage_List_Form' })(VoyageDynamicsForShipOwnerListForm);

export default VoyageDynamicsForShipOwnerList_Form;
