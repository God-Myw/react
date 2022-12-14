import getRequest, { deleteRequest } from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Input, message, Modal, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { PalletModel } from './PalletModel';
import moment from 'moment';

const InputGroup = Input.Group;
const { confirm } = Modal;

class PalletListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<PalletModel>[] = [
    {
      title: <FormattedMessage id="pallet-palletList.code" />,
      dataIndex: 'goodsIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id="pallet-palletList.goods.name" />,
      dataIndex: 'goodsName',
      align: 'center',
    },
    {
      title: <FormattedMessage id="pallet-palletAdd.pallet.type" />,
      dataIndex: 'goodsType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="pallet-palletAdd.port.shipment" />,
      dataIndex: 'startPort',
      align: 'center',
    },
    {
      title: <FormattedMessage id="pallet-palletAdd.destination" />,
      dataIndex: 'destinationPort',
      align: 'center',
    },
    {
      title: <FormattedMessage id="pallet-palletList.goodstatus" />,
      dataIndex: 'goodsStatus',
      align: 'center',
    },
    {
      title: <FormattedMessage id="pallet-palletList.releasestatus" />,
      dataIndex: 'state',
      align: 'center',
    }, {
      title: formatMessage({ id: 'pallet-palletList.operate' }),
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: any) => (
        <span>
          <QueryButton
            text={formatMessage({ id: 'pallet-palletList.alter' })}
            type="Edit"
            event={() => this.handleEdit(guid.guid)}
            disabled={guid.state === 1}
          />
           &nbsp;
          <QueryButton
            text={formatMessage({ id: 'pallet-palletList.view' })}
            type="View"
            event={() => this.handleView(guid.guid)}
            disabled={false}
          />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'pallet-palletList.delete' })}
            type="Delete"
            disabled={guid.state === 1}
            event={() => this.handleDelete(guid.guid, guid.goodsIndex)}
          />
        </span>
      )
    }

  ];
  state = {
    //列
    columns: this.columns,
    //表数据
    dataSource: [],
    //货物名称
    goodsLevel: '',
    //二级货名
    goodsSubLevel: '',
    //货品类型
    goodsType: '',
    //当前页
    currentPage: 1,
    total: 0,
    pagesize: 10,
  };

  //初期华事件
  componentDidMount() {
    this.setState({
      //列
      columns: this.columns,
    })
    this.initData();
  }

  //模拟数据
  initData() {
    this.getPalletList();
  }

  //准备参数
  setParams(): Map<string, string> {
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('pageSize', 10);
    params.set('currentPage', this.state.currentPage);
    params.set('date', moment());
    if (!isNil(this.state.goodsLevel) && this.state.goodsLevel !== '') {
      params.set('goodsLevel', this.state.goodsLevel);
    }
    if (!isNil(this.state.goodsType) && this.state.goodsType !== '') {
      params.set('goodsType', this.state.goodsType);
    }
    return params;
  }

  //获取表格数据
  getPalletList() {
    const data_Source: PalletModel[] = [];
    let param = this.setParams();

    getRequest('/business/pallet/', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.pallets, (pallet, index) => {
            const entity: PalletModel = {};
            pallet.goodsIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;
            entity.key = index + 1;
            entity.goodsName = getTableEnumText('goods_name', pallet.goodsLevel);
            entity.goodsType = getTableEnumText('goods_type', pallet.goodsType);
            entity.startPort = getTableEnumText('port', pallet.startPort);
            entity.destinationPort = getTableEnumText('port', pallet.destinationPort);
            entity.goodsStatus = pallet.status !== 0 ? formatMessage({ id: 'pallet-palletList.sendgood' }) : formatMessage({ id: 'pallet-palletList.nogood' });
            entity.state = pallet.state === 0 ? formatMessage({ id: 'pallet-palletList.unpublish' }) : formatMessage({ id: 'pallet-palletList.publish' });
            entity.guid = pallet;
            entity.goodsIndex = pallet.goodsIndex;
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
        this.getPalletList();
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
        this.getPalletList();
      },
    );
  };

  //货物类型选择
  selectChange = (value: any) => {
    this.setState({
      goodsType: value,
    });
  };

  selectNameChange = (value: any) => {
    this.setState({
      goodsLevel: value,
    });
  };

  //货盘追加
  handAddPallet = () => {
    this.props.history.push('/pallet/add');
  };

  //货盘编辑
  handleEdit = (guid: any) => {
    this.props.history.push('/pallet/edit/' + guid);
  };

  //货盘删除
  handleDelete = (e: any, goodsIndex: any) => {
    const search = this;
    const entity: PalletModel = this.state.dataSource[goodsIndex - 1];
    const deleteMessage = formatMessage({ id: 'Myship-MyshipList.delete.confirmstart' })
      + ' ' + formatMessage({ id: 'pallet-palletList.code' }) + ':' + entity.goodsIndex
      + ' ' + formatMessage({ id: 'pallet-palletList.goods.name' }) + ':' + entity.goodsName
      + ' ' + formatMessage({ id: 'pallet-palletAdd.pallet.type' }) + ':' + entity.goodsType
      + ' ' + formatMessage({ id: 'Myship-MyshipList.delete.confirmend' });
    confirm({
      title: deleteMessage,
      okText: formatMessage({ id: 'pallet-palletList.confirm' }),
      cancelText: formatMessage({ id: 'pallet-palletList.cancel' }),
      onOk() {
        let requestParam: Map<string, string> = new Map();
        requestParam.set('type', '1'),
          deleteRequest('/business/pallet/' + e, requestParam, (response: any) => {
            if (response.status === 200) {
              message.success(formatMessage({ id: 'pallet-palletList.delete.success' }), 2);
              search.getPalletList();
            } else {
              message.error(formatMessage({ id: 'pallet-palletList.delete.fail' }), 2);
            }
          });
      },
    });

  };

  //货盘查看
  handleView = (guid: any) => {
    this.props.history.push('/pallet/view/' + guid);
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'pallet-palletList.pallet.release' })}
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Select key={1}
                  allowClear={true}
                  placeholder={formatMessage({ id: 'pallet-palletAdd.pallet.type.choose' })}
                  style={{ width: '20%' }}
                  onChange={this.selectChange}
                >
                  {getDictDetail('goods_type').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <Select key={2}
                  allowClear={true}
                  placeholder={formatMessage({ id: 'pallet-palletList.goods.checkname' })}
                  style={{ width: '71.5%' }}
                  onChange={this.selectNameChange}
                >
                  {getDictDetail('goods_name').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <QueryButton key={3}
                  type="Query"
                  text={formatMessage({ id: 'pallet-palletList.search' })}
                  event={this.search.bind(this)}
                  disabled={false}
                />
                <QueryButton key={4} type="Add" text="" event={this.handAddPallet} disabled={false} />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Table
            rowKey={record => (!isNil(record.key) ? record.key : '')}
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
              pageSize: this.state.pagesize,
              total: this.state.total,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  <FormattedMessage id="pallet-palletList.total" />{' '}
                  {this.state.total % this.state.pagesize == 0
                    ? Math.floor(this.state.total / this.state.pagesize)
                    : Math.floor(this.state.total / this.state.pagesize) + 1}{' '}
                  <FormattedMessage id="pallet-palletList.pages" />
                  {this.state.pagesize}<FormattedMessage id="pallet-palletList.records" />
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

export default PalletListForm;
