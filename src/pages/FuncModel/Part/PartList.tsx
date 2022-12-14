import React from 'react';
import { Table, Input, Form, Row, Col, Select, Modal, message } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { RouteComponentProps } from 'dva/router';
import { PartModel } from './PartModel';
import { ColumnProps } from 'antd/lib/table';
import { getRequest, deleteRequest } from '@/utils/request';
import { getTableEnumText, getDictDetail } from '@/utils/utils';
import { isNil, forEach, assign } from 'lodash';
const InputGroup = Input.Group;
const { confirm } = Modal;

const columns: ColumnProps<PartModel>[] = [
  {
    title: '序号',
    dataIndex: 'partIndex',
    align: 'center',
  },
  {
    title: '备件名称',
    dataIndex: 'partName',
    align: 'center',
  },
  {
    title: '备件型号',
    dataIndex: 'partModel',
    align: 'center',
  },
  {
    title: '数量',
    dataIndex: 'partCount',
    align: 'center',
  },
  {
    title: '图纸号',
    dataIndex: 'drawingNumber',
    align: 'center',
  },
  {
    title: '备件号',
    dataIndex: 'partNumber',
    align: 'center',
  },
  {
    title: '发布状态',
    dataIndex: 'state', //数据状态 0 保存 1 提交
    align: 'center',
  },
];

class PartListForm extends React.Component<RouteComponentProps> {
  state = {
    //列
    columns: columns,
    //表数据
    dataSource: [],
    //交易身份
    tradeType: '',
    //备件名称
    partName: '',
    status: true,
    pageSize: 10,
    currentPage: 1,
  };

  //初期化事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    if (this.state.columns.length < 8) {
      this.state.columns.push({
        title: '操作',
        dataIndex: 'guid',
        align: 'center',
        width: '16%',
        render: (guid: any, record) => (
          <span>
            <QueryButton
              text='修改'
              type="Edit"
              event={() => this.handleEdit(guid)}
              disabled={record.state === getTableEnumText('release', '1')}
            />
            &nbsp;
            <QueryButton
              text='删除'
              type="Delete"
              event={() => this.handleDelete(guid, this.props)}
              disabled={record.state === getTableEnumText('release', '1')}
            />
            &nbsp;
            <QueryButton
              text='查看'
              type="View"
              event={() => this.handleView(guid)}
              disabled={false}
            />
          </span>
        ),
      });
    }
    this.getPartList();
  }

  //准备参数
  setParams(
    tradeType: string,
    partName: string,
    pageSize: string,
    currentPage: string,
  ): Map<string, string> {
    let params: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('currentPage', pageSize);
    params.set('pageSize', currentPage);
    if (!isNil(tradeType) && tradeType != '') {
      params.set('tradeType', tradeType);
    }
    if (!isNil(partName) && partName != '') {
      params.set('partName', partName);
    }
    return params;
  }

  //获取表格数据
  getPartList() {
    const data_Source: PartModel[] = [];
    let param = this.setParams(
      this.state.tradeType,
      this.state.partName,
      this.state.pageSize.toString(),
      this.state.currentPage.toString(),
    );
    getRequest('/business/part/', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.parts, (part, index) => {
            const entity: PartModel = {};
            entity.partIndex = index + 1;
            assign(entity, part);
            entity.state = getTableEnumText('release', part.state.toString());
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          status: false,
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
        this.getPartList();
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
        this.getPartList();
      },
    );
  };

  //新增备件交易
  handAddPart = () => {
    this.props.history.push('/part/add');
  };

  //修改备件交易
  handleEdit = (guid: any) => {
    this.props.history.push('/part/edit/' + guid);
  };

  //删除备件交易
  handleDelete = (guid: any, props: any) => {
    const self = this;
    confirm({
      title: '确认是否删除',
      content: '点击确认将删除该条数据',
      okText: '确认',
      cancelText: '取消',
      visible: this.state.status,
      onOk() {
        let requestParam: Map<string, string>=new Map();
          requestParam.set('type','1'),
        deleteRequest('/business/part/' + guid, requestParam, (response: any) => {
          if (response.status === 200) {
            message.success('删除成功', 2);
            self.getPartList();
            location.reload(true)
          } else {
            message.error('删除失败', 2);
          }
        });
      },
    });
    // console.log(this.state.status);
  };

  handleView = (guid: any) => {
    this.props.history.push('/part/view/' + guid);
  };

  handleTradeTypeSelect = (value: any) => {
    this.setState({
      tradeType: value,
    });
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text='备件交易'
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
                <Input
                  placeholder="请输入备件名称搜索"
                  style={{ width: '71.5%', textAlign: 'left' }}
                  onChange={e => this.setState({ phoneCode: e.target.value })}
                />
                <QueryButton
                  type="Query"
                  text="搜索"
                  event={this.search.bind(this)}
                  disabled={false}
                />
                <QueryButton type="Add" text="" event={this.handAddPart} disabled={false} />
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
              current: this.state.currentPage,
              showQuickJumper: true,
              pageSize: this.state.pageSize,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  总共{' '}
                  {this.state.dataSource.length % this.state.pageSize == 0
                    ? Math.floor(this.state.dataSource.length / this.state.pageSize)
                    : Math.floor(this.state.dataSource.length / this.state.pageSize) + 1}{' '}
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

const PartList_Form = Form.create({ name: 'partList_Form' })(PartListForm);

export default PartList_Form;
