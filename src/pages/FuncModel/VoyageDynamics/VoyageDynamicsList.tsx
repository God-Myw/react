import React from 'react';
import { Table, Input, Form, Row, Col, Select } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { RouteComponentProps } from 'dva/router';
import { VoyageDynamicsModel } from './VoyageDynamicsModel';
import { ColumnProps } from 'antd/lib/table';
import getRequest from '@/utils/request';
import { getTableEnumText, getDictDetail } from '@/utils/utils';
import { isNil, forEach } from 'lodash';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import moment from 'moment';

class VoyageDynamicsListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<VoyageDynamicsModel>[] = [
    {
      title: <FormattedMessage id="VoyageDynamics-VoyageDynamicsList.voyageIndex" />,
      dataIndex: 'voyageIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id="VoyageDynamics-VoyageDynamicsList.shipName" />,
      dataIndex: 'shipName',
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
      title: '航次发布时间',
      dataIndex: 'createDate',
      align: 'center',
      width: '10%',
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
    //船舶名称
    shipName: '',
    //船舶类型
    shipType: '',
    //当前页
    currentPage: 1,
    total: 0,
    pagesize: 10,
  };

  //初期化事件
  componentDidMount() {
    this.initData();
    this.setState({
      //列
      columns: this.columns,
      currentPage: localStorage.currentPage,
      shipType: localStorage.shipType || '',
      shipName: localStorage.shipName || '',
    });
    localStorage.currentPage
      ? (localStorage.removeItem('currentPage'))
      : (localStorage.currentPage = this.state.currentPage);
    localStorage.shipType
      ? localStorage.removeItem('shipType')
      : (localStorage.shipType = this.state.shipType);
    localStorage.shipName
      ? localStorage.removeItem('shipName')
      : (localStorage.shipName = this.state.shipName);
  }

  //模拟数据
  initData() {
    this.getVoyageDynamicsList();
  }

  //键盘监听
  keyUp: any = (e: any) => {
    if (e.keyCode === 13) {
      this.getVoyageDynamicsList();
    }
  }

  //准备参数
  setParams(
    shipName: string,
    shipType: string,
    pageSize: number,
    currentPage: number,
    date: any,
  ): Map<string, string> {
    let params: Map<string, any> = new Map();
    // 查询航次一览（跟踪客服）
    params.set('type', '3');
    params.set('currentPage', localStorage.currentPage || currentPage);
    params.set('pageSize', pageSize);
    // if (!isNil(shipName) && shipName !== '') {
    params.set('shipName', localStorage.shipName || shipName);
    // }
    // if (!isNil(shipType) && shipType !== '') {
    params.set('shipType', localStorage.shipType || shipType);
    // }
    if (!isNil(date)) {
      params.set('date', date);
    }
    return params;
  }

  //获取表格数据
  getVoyageDynamicsList() {
    const data_Source: VoyageDynamicsModel[] = [];
    let param = this.setParams(
      this.state.shipName.toString(),
      this.state.shipType,
      this.state.pagesize,
      this.state.currentPage,
      moment(),
    );
    getRequest('/business/voyage/', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.voyages, (voyage, index) => {
            const entity: VoyageDynamicsModel = {};
            entity.voyageIndex = index + 1;
            entity.guid = voyage.guid;
            entity.shipName = voyage.shipName;
            entity.shipType = getTableEnumText('ship_type', voyage.shipType);
            entity.shipDeck = getTableEnumText('ship_deck', voyage.shipDeck);
            entity.acceptTon = voyage.toNumber;
            entity.shipCrane = voyage.shipCrane;
            entity.shipVoyage = voyage.shipVoyage;
            entity.voyageLineName = voyage.voyageLineName;
            entity.createDate = moment(voyage.createDate).format('L');
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
    localStorage.currentPage = page;
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
    localStorage.shipType = this.state.shipType;
    localStorage.shipName = this.state.shipName;
    localStorage.currentPage = this.state.currentPage;
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
                onSelect={this.handleShipTypeSelect}
              >
                {getDictDetail('ship_type').map((item: any) => (
                  <option value={item.code}>{item.textValue}</option>
                ))}
              </Select>
              <Input
                style={{ width: '75%' }}
                maxLength={12}
                placeholder={formatMessage({
                  id: 'VoyageDynamics-VoyageDynamicsList.searchShipName',
                })}
                onChange={e => this.setState({ shipName: e.target.value })}
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
              pageSize: 10,
              total: this.state.total,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  {formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.total' })}{' '}
                  {this.state.total % this.state.pagesize == 0
                    ? Math.floor(this.state.total / this.state.pagesize)
                    : Math.floor(this.state.total / this.state.pagesize) + 1}{' '}
                  {formatMessage({ id: 'VoyageDynamics-VoyageDynamicsList.show' })}
                  {this.state.pagesize}
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

const VoyageDynamicsList_Form = Form.create({ name: 'Voyage_List_Form' })(VoyageDynamicsListForm);

export default VoyageDynamicsList_Form;
