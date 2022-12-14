import getRequest from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Form, Input, Modal, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../Common/Components/LabelTitleComponent';
import commonCss from '../Common/css/CommonCss.less';
import { PalletModel } from '../FuncModel/Pallet/PalletModel';
const InputGroup = Input.Group;
const { confirm } = Modal;

const columns: ColumnProps<PalletModel>[] = [
  {
    title: '序号',
    dataIndex: 'goodsIndex',
    align: 'center',
  },
  {
    title: '货物名称',
    dataIndex: 'goodsName',
    align: 'center',
  },
  {
    title: '货物类型',
    dataIndex: 'goodsType',
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
    title: '件数',
    dataIndex: 'goodsCount',
    align: 'center',
  },
  {
    title: '货运状态',
    dataIndex: 'goodsStatus',
    align: 'center',
  },
];

class ManagerMenu extends React.Component<RouteComponentProps> {
  state = {
    //列
    columns: columns,
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
  };

  //初期华事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    if (this.state.columns.length === 7) {
      this.state.columns.push({
        title: '操作',
        dataIndex: 'guid',
        align: 'center',
        width: '16%',
        render: (guid: any) => (
          <span>
            <QueryButton
              text="修改"
              type="Edit"
              event={() => this.handleEdit(guid.guid)}
              disabled={guid.state === 1}
            />
            &nbsp;
            <QueryButton
              text="删除"
              type="Delete"
              disabled={guid.state === 1}
              event={() => this.handleDelete(guid.guid, this.props)}
            />
            &nbsp;
            <QueryButton
              text="查看"
              type="View"
              event={() => this.handleView(guid.guid)}
              disabled={false}
            />
          </span>
        ),
      });
    }
    this.getPalletList();
  }

  //准备参数
  setParams(): Map<string, string> {
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('pageSize', 15);
    params.set('currentPage', this.state.currentPage);
    if (!isNil(this.state.goodsLevel) && this.state.goodsLevel !== '') {
      params.set('goodsLevel', this.state.goodsLevel);
    }
    if (!isNil(this.state.goodsSubLevel) && this.state.goodsSubLevel !== '') {
      params.set('goodsType', this.state.goodsType);
    }
    return params;
  }

  //获取表格数据
  getPalletList() {
    const data_Source: PalletModel[] = [];
    let param = this.setParams();
    // 初期化固定是PC账号密码登录
    getRequest('/business/pallet/', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.pallets, (pallet, index) => {
            const entity: PalletModel = {};
            entity.goodsIndex = index + 1;
            entity.goodsName = getTableEnumText('goods_name', pallet.goodsLevel);
            entity.goodsType = getTableEnumText('goods_type', pallet.goodsType);
            entity.startPort = pallet.startPort;
            entity.destinationPort = pallet.destinationPort;
            entity.goodsStatus = getTableEnumText('goods_status', pallet.status);
            entity.guid = pallet;
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
    this.getPalletList();
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
  handleDelete = (e: any, props: any) => {
    confirm({
      title: '确定要删除?',
      okText: '确定',
      cancelText: '取消',
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
          text="货盘发布"
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Select
                  placeholder="货物类型"
                  style={{ width: '30%' }}
                  onChange={this.selectChange}
                >
                  {getDictDetail('goods_type').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <Select
                  placeholder="货物名称"
                  style={{ width: '62.2%' }}
                  onChange={this.selectNameChange}
                >
                  {getDictDetail('goods_name').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <QueryButton
                  type="Query"
                  text="查询"
                  event={this.search.bind(this)}
                  disabled={false}
                />
                <QueryButton type="Add" text="" event={this.handAddPallet} disabled={false} />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Table
            rowKey={record => (!isNil(record.guid) ? record.guid : '')}
            bordered
            columns={this.state.columns}
            size="small"
            dataSource={this.state.dataSource}
            rowClassName={(record, index) =>
              index % 2 == 0 ? commonCss.dataRowOdd : commonCss.dataRowEven
            }
            pagination={{
              showQuickJumper: true,
              pageSize: 15,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  总共{' '}
                  {this.state.dataSource.length % 15 == 0
                    ? Math.floor(this.state.dataSource.length / 15)
                    : Math.floor(this.state.dataSource.length / 15) + 1}{' '}
                  页记录,每页显示
                  {15}条记录
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

const Manager_Menu = Form.create({ name: 'Pallet_List_Form' })(ManagerMenu);

export default Manager_Menu;
