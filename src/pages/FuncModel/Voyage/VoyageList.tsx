import { deleteRequest, getRequest } from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Form, Input, message, Modal, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { VoyageModel } from './VoyageModel';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';

const { confirm } = Modal;

const InputGroup = Input.Group;

const voyageSource: VoyageModel[] = [];

//页面列表组件
class VoyageListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<VoyageModel>[] = [
    {
      title: <FormattedMessage id="Voyage-VoyageList.Index" />,
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: <FormattedMessage id="Voyage-VoyageList.shipName" />,
      dataIndex: 'shipName',
      align: 'center',
    },
    {
      title: <FormattedMessage id="Voyage-VoyageList.shipType" />,
      dataIndex: 'shipType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="Voyage-VoyageList.acceptTon" />,
      dataIndex: 'acceptTon',
      align: 'center',
    },
    {
      title: <FormattedMessage id="Voyage-VoyageList.acceptCapacity" />,
      dataIndex: 'acceptCapacity',
      align: 'center',
    },
    {
      title: <FormattedMessage id="Voyage-VoyageList.settedVoyage" />,
      dataIndex: 'voyageLineName',
      align: 'center',
    },
    {
      title: <FormattedMessage id="Voyage-VoyageList.releaseState" />,
      dataIndex: 'stateInfo',
      align: 'center',
    },
    {
      title: <FormattedMessage id="Voyage-VoyageList.operation" />,
      dataIndex: 'entity',
      align: 'center',
      width: '16%',
      render: (entity: any) => (
        <span>
          <QueryButton
            text={formatMessage({ id: 'Voyage-VoyageList.update' })}
            type="Edit"
            event={() => this.handleEdit(entity.guid)}
            disabled={entity.state === 1}
          />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'Voyage-VoyageList.examine' })}
            type="View"
            event={() => this.handleView(entity.guid)}
            disabled={entity.state === 1}
          />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'Voyage-VoyageList.delete' })}
            type="Delete"
            event={() => this.handleDelete(entity.guid, entity.id)}
            disabled={entity.state === 1}
          />
        </span>
      ),
    },
  ];

  //state初始化赋值
  state = {
    columns: this.columns,
    dataSource: voyageSource,
    shipName: '',
    shipType: '',
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };

  componentDidMount() {
    this.initData();
  }

  //初始化数据
  initData() {
    this.getvoyageList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getvoyageList();
   }
  }

  //获取列表数据
  getvoyageList() {
    //清空voyageSource，方式循环调用，多次push
    voyageSource.length = 0;
    //调用mock
    let param: Map<string, any> = new Map();
    param.set('type', 1);
    param.set('pageSize', this.state.pageSize);
    param.set('currentPage', this.state.currentPage);
    if (!isNil(this.state.shipName) && this.state.shipName != '') {
      param.set('shipName', this.state.shipName);
    }
    if (!isNil(this.state.shipType) && this.state.shipType != '') {
      param.set('shipType', this.state.shipType);
    }
    param.set('date', moment());
    getRequest('/business/voyage', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          //循环赋值给table数据对象voyageSource
          forEach(response.data.voyages, (voyage, index) => {
            voyage.id = parseInt(index + 1 + (this.state.currentPage - 1) * this.state.pageSize);
            voyageSource.push({
              id: parseInt(index + 1 + (this.state.currentPage - 1) * this.state.pageSize),
              shipName: voyage.shipName,
              shipType: getTableEnumText('ship_type', voyage.shipType),
              acceptTon: voyage.acceptTon,
              acceptCapacity: voyage.acceptCapacity,
              voyageLineName: voyage.voyageLineName,
              state: voyage.state,
              stateInfo:
                voyage.state === 1
                  ? formatMessage({ id: 'Voyage-VoyageList.published' })
                  : formatMessage({ id: 'Voyage-VoyageList.unpublished' }),
              guid: voyage.guid,
              entity: voyage,
            });
          });
        }
        this.setState({
          dataSource: voyageSource,
          total: response.data.total,
        });
      }
    });
  }

  //搜索操作
  search() {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  }

  //获取下拉框
  handleChange = (value: any) => {
    this.setState({ shipType: value });
  };

  //返回back
  onBack = () => {
    this.props.history.push('/index_menu');
  };

  //添加新增按钮操作
  handAddPallet = () => {
    this.props.history.push('/voyage/add');
  };

  //编辑修改按钮操作
  handleEdit = (guid: any) => {
    this.props.history.push('/voyage/edit/' + guid);
  };

  //查看按钮操作
  handleView = (guid: any) => {
    this.props.history.push('/voyage/view/' + guid);
  };

  //删除按钮操作
  handleDelete = (e: any, id: any) => {
    const cycleData = this.getvoyageList.bind(this);
    const entity: VoyageModel = this.state.dataSource[id - 1];
    const deleteMessage =
      formatMessage({ id: 'Voyage-VoyageList.confirmstart' }) +
      ' ' +
      formatMessage({ id: 'Voyage-VoyageList.Index' }) +
      ':' +
      entity.id +
      ' ' +
      formatMessage({ id: 'Voyage-VoyageList.shipName' }) +
      ':' +
      entity.shipName +
      ' ' +
      formatMessage({ id: 'Voyage-VoyageList.shipType' }) +
      ':' +
      entity.shipType +
      ' ' +
      formatMessage({ id: 'Voyage-VoyageList.confirmend' });
    confirm({
      title: deleteMessage,
      okText: formatMessage({ id: 'Voyage-VoyageList.confirm' }),
      cancelText: formatMessage({ id: 'Voyage-VoyageList.cancel' }),
      onOk() {
        let requestParam: Map<string, string> = new Map();
        requestParam.set('type', '1'),
          deleteRequest('/business/voyage/' + e, requestParam, (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'Voyage-VoyageList.successDelete' }),
                2,
                cycleData,
              );
            } else {
              message.error(formatMessage({ id: 'Voyage-VoyageList.failDelete' }), 2, cycleData);
            }
          });
      },
    });
  };

  //分页onChange事件处理
  paginationChangePage = (page: any) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getvoyageList();
      },
    );
  };

  // 渲染
  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'Voyage-VoyageList.voyage' })}
          event={() => this.onBack()}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                {/* 设置搜索框onChange */}
                <Select
                  allowClear={true}
                  style={{ width: '15%' }}
                  placeholder={formatMessage({ id: 'Voyage-VoyageList.shipTypeChoose' })}
                  onChange={this.handleChange}
                >
                  {getDictDetail('ship_type').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <Input
                  style={{ width: '77%' }}
                  maxLength={32}
                  placeholder={formatMessage({ id: 'Voyage-VoyageList.inputShipName' })}
                  onChange={e => this.setState({ shipName: e.target.value })}
                  defaultValue={this.state.shipName}
                  onKeyUp={this.keyUp}
                ></Input>
                <QueryButton
                  disabled={false}
                  type="Query"
                  text={formatMessage({ id: 'Voyage-VoyageList.search' })}
                  event={this.search.bind(this)}
                />
                <QueryButton disabled={false} type="Add" text="" event={this.handAddPallet} />
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
              pageSize: this.state.pageSize,
              current: this.state.currentPage,
              total: this.state.total,
              onChange: this.paginationChangePage,
              showTotal: () => (
                <div>
                  <FormattedMessage id="Voyage-VoyageList.total" />{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  <FormattedMessage id="Voyage-VoyageList.show" />
                  {this.state.pageSize}
                  <FormattedMessage id="Voyage-VoyageList.records" />
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

const VoyageList_Form = Form.create({ name: 'Voyage_List_Form' })(VoyageListForm);

export default VoyageList_Form;
