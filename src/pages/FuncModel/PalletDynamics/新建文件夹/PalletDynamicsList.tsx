import getRequest, {deleteRequest} from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import {Col, Form, message, Modal, Row, Select, Table} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import QueryButton from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { PalletDynamicsModel } from './PalletDynamicsModel';
import moment from 'moment';

const { confirm } = Modal;

class PalletDynamicsListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<PalletDynamicsModel>[] = [
    {
      title: '序号',
      dataIndex: 'goodsIndex',
      align: 'center',
    },
    {
      title: '货物名称',
      dataIndex: 'goodsLevel',
      align: 'center',
    },
    {
      title: '货物类型',
      dataIndex: 'goodsType',
      align: 'center',
    },
    {
      title: '货物性质',
      dataIndex: 'goodsProperty',
      align: 'center',
    },
    {
      title: '件数',
      dataIndex: 'goodsCount',
      align: 'center',
    },
    {
      title: '起运港',
      dataIndex: 'startPort',
      align: 'center',
    },
    {
      title: '目的港',
      dataIndex: 'destinationPort',
      align: 'center',
    },
    {
      title: '是否叠加',
      dataIndex: 'isSuperposition',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: any) => (
        <span>
          <QueryButton text='查看' type="View" event={() => this.handleView(guid.guid)} />
          <QueryButton
            text='删除'
            type="Delete"
            disabled={guid.state === 3}
            event={() => this.handleDelete(guid.guid, guid.goodsIndex)}
          />
          &nbsp; &nbsp;
          {localStorage.getItem('userType') === '3'? (<QueryButton
            text={!guid.isAddProcessedFile ? formatMessage({ id: 'pallet-palletList.no.operation' }) : formatMessage({ id: 'pallet-palletList.already.operated' }) }
            type="Operated"
            event={() => {}}
            disabled={!guid.isAddProcessedFile}
          />) : null}
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
    this.getPalletDynamicsList();
  }

  //获取表格数据
  getPalletDynamicsList() {
    const data_Source: PalletDynamicsModel[] = [];
    let params: Map<string, any> = new Map();
    params.set('type', '1');
    if (!isNil(this.state.goodsLevel) && this.state.goodsLevel !== '') {
      params.set('goodsLevel', this.state.goodsLevel);
    }
    params.set('date',moment());
    params.set('pageSize', this.state.pageSize.toString());
    params.set('currentPage', this.state.currentPage.toString());
    getRequest('/business/pallet', params, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.pallets, (pallet, index) => {
            const entity: PalletDynamicsModel = {};
            entity.goodsIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.guid = pallet;
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


  //货盘删除
  handleDelete = (e: any, goodsIndex: any) => {
    const search = this;
    const deleteMessage = '是否对'
      + ' ' + '序号' + ':' + e
      + ' ' + '的信息进行删除';
    confirm({
      title: deleteMessage,
      okText: formatMessage({ id: 'pallet-palletList.confirm' }),
      cancelText: formatMessage({ id: 'pallet-palletList.cancel' }),
      onOk() {
        let requestParam: Map<string, string> = new Map();

        requestParam.set('type', '1'),
          deleteRequest(`/business/pallet/${e}`, requestParam, (response: any) => {
            if (response.status === 200) {
              message.success('删除成功', 2);
              search.getPalletDynamicsList();
            } else {
              message.error(formatMessage({ id: 'pallet-palletList.delete.fail' }), 2);
            }
          });
      },
    });

  };

  //检索事件
  search() {
    this.setState({
      currentPage: 1
    }, () => {
      this.getPalletDynamicsList();
    })
  }

  handleView = (guid: any) => {
    if (localStorage.getItem('userType') === '3') {
      this.props.history.push('/customerpalletdynamics/view/' + guid);
    } else {
      this.props.history.push('/palletdynamics/view/' + guid);
    }
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
      this.getPalletDynamicsList();
    });
  };




  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text='货盘动态'
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
                placeholder='请输入货物名称搜索'
                onChange={this.selectChange}
              >
                {getDictDetail('goods_name').map((item: any) => (
                  <Select.Option value={item.code}>{item.textValue}</Select.Option>
                ))}
              </Select>
              <QueryButton type="Query" text='搜索' event={this.search.bind(this)} />
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
                  {/* 总共 */}
                  <FormattedMessage id="PalletDynamics-PalletDynamicsList.total" />{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                    {/* 页记录，每页显示 */}
                  <FormattedMessage id="PalletDynamics-PalletDynamicsList.pages" />
                  {/* 条记录 */}
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

const PalletDynamicsList_Form = Form.create({ name: 'Pallet_List_Form' })(PalletDynamicsListForm);

export default PalletDynamicsList_Form;
