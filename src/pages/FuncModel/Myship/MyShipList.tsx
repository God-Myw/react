import React from 'react';
import { Table, Input, Form, Row, Col, Select, Modal, message, Button } from 'antd';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { RouteComponentProps } from 'dva/router';
import { MyShipModel } from './MyShipModel';
import { ColumnProps } from 'antd/lib/table';
import getRequest, { deleteRequest } from '@/utils/request';
import { getDictDetail } from '@/utils/utils';
import { isNil, forEach, assign, cloneDeep } from 'lodash';
import { getTableEnumText } from '@/utils/utils';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';

const InputGroup = Input.Group;
const { confirm } = Modal;

class MyShipListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<MyShipModel>[] = [
    {
      title: <FormattedMessage id="Myship-MyshipList.code" />,
      dataIndex: 'shipIndex',
      align: 'center',
      width: '11%',
    },
    {
      title: <FormattedMessage id="Myship-MyshipList.shipname" />,
      dataIndex: 'shipName',
      align: 'center',
      width: '12%',
    },
    {
      title: <FormattedMessage id="Myship-MyshipAdd.list.shipType" />,
      dataIndex: 'shipType',
      align: 'center',
      width: '13%',
    },
    {
      title: <FormattedMessage id="Myship-MyshipList.shipage" />,
      dataIndex: 'shipAge',
      align: 'center',
    },
    {
      title: <FormattedMessage id="Myship-MyshipList.ccs" />,
      dataIndex: 'classificationSociety',
      align: 'center',
    },
    {
      title: <FormattedMessage id="Myship-MyshipList.status" />,
      dataIndex: 'state', //数据状态 1 保存 2 提交
      align: 'center',
    },
    {
      title: formatMessage({ id: 'Myship-MyshipList.operation' }),
      dataIndex: 'entity',
      align: 'center',
      width: '16%',
      render: (entity: any) => (
        <span>
          {
            (entity.checkStatus === 1 && entity.state === 1) ? '' : (<QueryButton
              text={formatMessage({ id: 'Myship-MyshipList.update' })}
              type="Edit"
              event={() => this.handleEdit(entity.guid, entity.checkStatus)}
              disabled={!(entity.checkStatus === 0 || entity.state !== 1)}
            />)
          }
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'Myship-MyshipList.examine' })}
            type="View"
            event={() => this.handleView(entity.guid, entity.checkStatus)}
            disabled={entity.state === 1}
          />
          &nbsp;
          {
            ((entity.checkStatus === 1 || entity.checkStatus === 0) && entity.state === 1) ? '' : (<QueryButton
              text={formatMessage({ id: 'Myship-MyshipList.delete' })}
              type="Delete"
              disabled={entity.state === 1}
              event={() => this.handleDelete(entity.guid, entity.shipIndex)}
            />)
          }

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
    //船舶名称
    shipName: '',
    //当前页
    currentPage: 1,
    total: 0,
    pagesize: 10,
    //未审核
    buttonA: undefined,
    //未通过
    buttonB: undefined,
    //已通过
    buttonC: undefined,
    //状态
    status: this.props.match.params['status'] ? this.props.match.params['status'] : '2',
  };

  //初期化事件
  componentDidMount() {
    if (this.state.status === '2') {
      this.setState({
        buttonA: true,
        buttonB: false,
        buttonC: false,
      }, () => {
        this.initData();
      })
    } else if (this.state.status === '0') {
      this.setState({
        buttonA: false,
        buttonB: true,
        buttonC: false,
      }, () => {
        this.initData();
      })
    } else if (this.state.status === '1') {
      this.setState({
        buttonA: false,
        buttonB: false,
        buttonC: true,
      }, () => {
        this.initData();
      })
    }
  }

  //模拟数据
  initData() {
    this.getShipList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getShipList();
   }
  }

  //准备参数
  setParams(shipType: string, shipName: string): Map<string, string> {
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('currentPage', this.state.currentPage);
    params.set('pageSize', this.state.pagesize);
    params.set('checkStatus', this.state.status);
    params.set('data', moment());
    if (!isNil(shipType) && shipType != ''&& shipType !== 'undefined') {
      params.set('shipType', shipType);
    }
    if (!isNil(shipName) && shipName != '') {
      params.set('shipName', shipName);
    }
    return params;
  }

  //获取表格数据
  getShipList() {
    const data_Source: MyShipModel[] = [];
    let param = this.setParams(this.state.shipType, this.state.shipName);
    getRequest('/business/ship/', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.ships, (ship, index) => {
            const newEntity: MyShipModel = {};
            ship.shipIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;
            assign(newEntity, ship);
            newEntity.shipType = getTableEnumText('ship_type', ship.shipType);
            newEntity.classificationSociety = getTableEnumText(
              'classification_society',
              ship.classificationSociety,
            );
            newEntity.shipAge = getTableEnumText('ship_age', ship.shipAge);
            if (ship.state === 0) {
              newEntity.state = formatMessage({ id: 'Myship-MyshipAdd.unpublished' });
            } else {
              newEntity.state = formatMessage({ id: 'Myship-MyshipAdd.published' });
            }
            newEntity.entity = cloneDeep(ship);
            data_Source.push(newEntity);
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
        });
      }
    });
  }

  //切换状态未审核
  selectA = () => {
    this.setState(
      {
        buttonA: true,
        buttonB: false,
        buttonC: false,
        status: 2,
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //切换状态未通过
  selectB = () => {
    this.setState(
      {
        buttonA: false,
        buttonB: true,
        buttonC: false,
        status: 0,
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //切换状态已通过
  selectC = () => {
    this.setState(
      {
        buttonA: false,
        buttonB: false,
        buttonC: true,
        status: 1,
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //检索事件
  search() {
    this.setState({
      currentPage: 1
    }, () => {
      this.getShipList();
    })
  }

  //修改当前页码
  changePage = (page: any) => {
    this.setState({
      currentPage: page,
    }, () => {
      this.getShipList();
    });
  };

  //新增船舶
  handAddShip = () => {
    this.props.history.push('/myship/add');
  };

  //修改船舶
  handleEdit = (guid: any, status: any) => {
    this.props.history.push('/myship/edit/' + guid + '/' + status);
  };

  //删除船舶
  handleDelete = (guid: any, shipIndex: any) => {
    const self = this;
    const entity: MyShipModel = this.state.dataSource[shipIndex - 1];
    const deleteMessage =
      formatMessage({ id: 'Myship-MyshipList.delete.confirmstart' }) +
      ' ' +
      formatMessage({ id: 'Myship-MyshipList.code' }) +
      ':' +
      entity.shipIndex +
      ' ' +
      formatMessage({ id: 'Myship-MyshipList.shipname' }) +
      ':' +
      entity.shipName +
      ' ' +
      formatMessage({ id: 'Myship-MyshipAdd.shipType' }) +
      ':' +
      entity.shipType +
      ' ' +
      formatMessage({ id: 'Myship-MyshipList.delete.confirmend' });

    confirm({
      title: deleteMessage,
      okText: formatMessage({ id: 'Myship-MyshipList.confirm' }),
      cancelText: formatMessage({ id: 'Myship-MyshipList.cancel' }),
      onOk() {
        let requestParam: Map<string, string> = new Map();
        requestParam.set('type', '1'),
          requestParam.set('guid', guid),
          deleteRequest('/business/ship/' + guid, requestParam, (response: any) => {
            if (response.status === 200) {
              message.success(formatMessage({ id: 'Myship-MyshipList.delete.success' }), 2);
              self.getShipList();
            } else {
              message.error(formatMessage({ id: 'Myship-MyshipList.delete.failed' }), 2);
            }
          });
      },
    });
  };

  handleView = (guid: any, status: any) => {
    this.props.history.push('/myship/view/' + guid + '/' + status);
  };

  handleTradeTypeSelect = (value: any) => {
    this.setState({
      shipType: String(value),
    });
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'Myship-MyshipList.myship' })}
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Select
                  allowClear={true}
                  style={{ width: '20%' }}
                  placeholder={formatMessage({ id: 'Myship-MyshipList.shiptype.choose' })}
                  onChange={this.handleTradeTypeSelect}
                >
                  {getDictDetail('ship_type').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                <Input
                  placeholder={formatMessage({ id: 'Myship-MyshipList.enter.name.search' })}
                  style={{ width: '71.5%', textAlign: 'left' }}
                  onChange={e => this.setState({ shipName: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <QueryButton
                  type="Query"
                  text={formatMessage({ id: 'Myship-MyshipList.search' })}
                  event={this.search.bind(this)}
                  disabled={false}
                />
                <QueryButton type="Add" text="" event={this.handAddShip} disabled={false} />
              </InputGroup>
            </Col>
          </Row>
        </div>
        <div className={commonCss.table}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                style={{
                  marginBottom: '-5px',
                  paddingBottom: '0px',
                  width: '10.93%',
                  float: 'left',
                }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonA ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectA}
                >
                  <FormattedMessage id="Myship-MyshipAdd.unreviewed" />
                </Button>
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: '-5px',
                  paddingBottom: '0px',
                  width: '11.93%',
                  float: 'left',
                }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonB ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectB}
                >
                  <FormattedMessage id="Myship-MyshipAdd.not.pass" />
                </Button>
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: '-5px',
                  paddingBottom: '0px',
                  width: '12.97%',
                  float: 'left',
                }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonC ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectC}
                >
                  <FormattedMessage id="Myship-MyshipAdd.pass" />
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Table
            // rowKey={record => (!isNil(record.guid) ? record.guid : '')}
            bordered
            columns={this.state.columns}
            size="small"
            dataSource={this.state.dataSource}
            rowClassName={(record, index) =>
              index % 2 == 0 ? commonCss.dataRowOdd : commonCss.dataRowEven
            }
            pagination={{
              showQuickJumper: true,
              pageSize: this.state.pagesize,
              current: this.state.currentPage,
              total: this.state.total,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  <FormattedMessage id="Myship-MyshipList.total" />{' '}
                  {this.state.total % this.state.pagesize == 0
                    ? Math.floor(this.state.total / this.state.pagesize)
                    : Math.floor(this.state.total / this.state.pagesize) + 1}{' '}
                  <FormattedMessage id="Myship-MyshipList.pages" />
                  {this.state.pagesize}
                  <FormattedMessage id="Myship-MyshipList.records" />
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

export default MyShipListForm;
