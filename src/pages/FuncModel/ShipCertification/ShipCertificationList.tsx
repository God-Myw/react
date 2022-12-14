import getRequest from '@/utils/request';
import { Button, Col, Form, Input, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { ShipModel } from './ShipModel';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import moment from 'moment';

const InputGroup = Input.Group;
const { Option } = Select;
const data_Source: ShipModel[] = [];

const columns: ColumnProps<ShipModel>[] = [
  {
    title: '序号',
    dataIndex: 'shipsIndex',
    align: 'center',
    width: '5%',
  },
  {
    title: '公司名称',
    dataIndex: 'companyName',
    align: 'center',
    width: '11%',
  },
  {
    title: '姓名',
    dataIndex: 'lastName',
    align: 'center',
    width: '8%',
  },
  {
    title: '联系方式',
    dataIndex: 'phoneNumber',
    align: 'center',
    width: '11%',
  },
  {
    title: '船舶名称',
    dataIndex: 'shipName',
    align: 'center',
    width: '12%',
  },
  {
    title: '船舶类型',
    dataIndex: 'shipType',
    align: 'center',
    width: '8%',
  },
  {
    title: '船型',
    dataIndex: 'shipDeck',
    align: 'center',
    width: '5%',
  },
  {
    title: '船吊',
    dataIndex: 'shipCrane',
    align: 'center',
    width: '5%',
  },
  {
    title: '国内/国际船舶',
    dataIndex: 'isChinaShip',
    align: 'center',
    width: '8%',
  },
  {
    title: '航区',
    dataIndex: 'voyageArea',
    align: 'center',
    width: '4%',
  },
  {
    title: '船级社',
    dataIndex: 'classificationSociety',
    align: 'center',
    width: '10%',
  },
];

class ShipCertificationListForm extends React.Component<RouteComponentProps> {
  state = {
    columns: columns,
    dataSource: data_Source,
    shipName: '',
    shipType: '',
    buttonA: false,
    buttonB: false,
    status: '2',
    pageSize: 10,
    currentPage: 1,
    total: 0,
  };

  componentDidMount() {
    //得到当前审核状态,确认按钮状态
    let status = this.props.match.params['status'] ? this.props.match.params['status'] : '2';
    if (status == 2) {
      this.setState({
        status: status,
        buttonA: true,
        buttonB: false,
        buttonC: false,
      }, () => {
        this.initData();
      })
    } else if (status == 1) {
      this.setState({

        status: status,
        buttonA: false,
        buttonB: false,
        buttonC: true,
      }, () => {
        this.initData();
      })
    } else if (status == 0) {
      this.setState({
        status: status,
        buttonA: false,
        buttonB: true,
        buttonC: false,
      }, () => {
        this.initData();
      })
    } else {
      this.setState({
        status: status,
        buttonA: true,
        buttonB: false,
        buttonC: false,
      }, () => {
        this.initData();
      })
    }

  }

  //模拟数据
  initData() {
    if (this.state.columns.length === 11) {
      if (this.state.status == '2') {
        this.state.columns.push({
          title: '操作',
          dataIndex: 'ship',
          align: 'center',
          width: '11%',
          render: (ship: any) => (
            <span>
              <QueryButton
                text="审核"
                type="View"
                event={() => this.handleView(ship.guid,ship.isChinaShip)}
                disabled={false}
              />
            </span>
          ),
        });
      } else {
        this.state.columns.push({
          title: '操作',
          dataIndex: 'ship',
          align: 'center',
          width: '11%',
          render: (ship: any) => (
            <span>
              <QueryButton
                text="查看"
                type="View"
                event={() => this.handleView(ship.guid,ship.isChinaShip)}
                disabled={false}
              />
            </span>
          ),
        });
      }


    } else if (this.state.columns.length === 9) {
      if (this.state.buttonA) {
        this.state.columns.splice(8, 1, {
          title: '操作',
          dataIndex: 'ship',
          align: 'center',
          width: '11%',
          render: (ship: any) => (
            <span>
              <QueryButton
                text="审核"
                type="View"
                event={() => this.handleView(ship.guid,ship.isChinaShip)}
                disabled={false}
              />
            </span>
          ),
        });
      } else if (this.state.buttonB) {
        this.state.columns.splice(8, 1, {
          title: '操作',
          dataIndex: 'ship',
          align: 'center',
          width: '11%',
          render: (ship: any) => (
            <span>
              <QueryButton
                text="查看"
                type="View"
                event={() => this.handleView(ship.guid,ship.isChinaShip)}
                disabled={false}
              />
            </span>
          ),
        });
      } else if (this.state.buttonC) {
        this.state.columns.splice(8, 1, {
          title: '操作',
          dataIndex: 'ship',
          align: 'center',
          width: '11%',
          render: (ship: any) => (
            <span>
              <QueryButton
                text="查看"
                type="View"
                event={() => this.handleView(ship.guid,ship.isChinaShip)}
                disabled={false}
              />
            </span>
          ),
        });
      }
    }
    this.getPalletList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getPalletList();
   }
  }


  getPalletList() {
    const data_Source: ShipModel[] = [];
    let param: Map<string, string> = new Map();
    // 1：查询当前用户下船舶一览  2：线上客服查询船舶一览
    param.set('type', '2');
    param.set('shipName', this.state.shipName ? this.state.shipName : '');
    param.set('shipType', this.state.shipType ? this.state.shipType : '');
    param.set('isChinaShip', this.state.isChinaShip ? this.state.isChinaShip==2?0:this.state.isChinaShip : '');
    //审核状态 0 未通过1通过2未审核
    param.set('checkStatus', this.state.status ? this.state.status : '2');
    param.set('currentPage', this.state.currentPage.toString());
    param.set('pageSize', this.state.pageSize.toString());
    // 认证资料一览
    param.set('data',moment().format("YYYY-MM-DD HH:mm:ss"));
    getRequest('/business/ship', param, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.ships, (ship, index) => {
            const entity: ShipModel = {};
            //序号修改
            entity.shipsIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.guid = ship.guid;
            entity.shipName = ship.shipName;
            entity.shipType = getTableEnumText('ship_type', ship.shipType);
            entity.shipDeck = getTableEnumText('ship_deck', ship.shipDeck);
            entity.shipCrane = ship.shipCrane;
            entity.isChinaShip = ship.isChinaShip?ship.isChinaShip==0?'国外':'国内':'';

            entity.voyageArea = getTableEnumText('voyage_area', ship.voyageArea);
            entity.classificationSociety = getTableEnumText('classification_society', ship.classificationSociety);
            entity.ship = ship;
            entity.companyName = ship.companyName;
            let LN = ship.lastName?ship.lastName:'';
            let FN = ship.firstName?ship.firstName:''
            entity.lastName = LN + FN;
            entity.phoneNumber=ship.phoneNumber;
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

  //修改当前页码
  changePage = (page: any) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.initData();
      },
    );
  };

  //切换状态未审核
  selectA = () => {
    this.setState(
      {
        buttonA: true,
        buttonB: false,
        buttonC: false,
        status: '2',
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
        status: '0',
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
        status: '1',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //按公司查询信息
  findAll = () => {
    this.setState({
      currentPage: 1,
    }, () => {
      this.initData();
    });
  };

  //船舶类型选择
  selectChange = (value: string) => {
    this.setState({
      shipType: value ? value : '',
    });
  };
  //船舶类型选择
  isChinaShips = (value: string) => {
    this.setState({
      isChinaShip: value ? value : '',
    });
    console.log(value)
  };

  //查看详情
  handleView = (guid: any ,isChinaShip:any) => {
    console.log(isChinaShip)
    let isChinaShipss =( isChinaShip == undefined ? 3 : isChinaShip)
    if (this.state.status == '') {
      this.setState({
        status: '1'
      }, () => {
        this.props.history.push('/shipcertification/view/' + guid + '/' + this.state.status+'/'+isChinaShipss);
      })
    } else {
      this.props.history.push('/shipcertification/view/' + guid + '/' + this.state.status+'/'+isChinaShipss);
    }
  };

  onBack = () => {
    this.props.history.push('/index_menu');
  }

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="船舶认证" event={() => this.onBack()} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Select
                  placeholder="船舶类型选择"
                  style={{ width: '20%' }}
                  onChange={this.selectChange}
                  allowClear={true}
                >
                  {getDictDetail('ship_type').map((item: any) => (
                    <option value={item.code}>{item.textValue}</option>
                  ))}
                </Select>
                {/* <Select

                  style={{ width: '20%' }}
                  onChange={this.isChinaShips}
                  allowClear={true}
                >
                    <Option value={0}>国外</Option>
                    <Option value={1}>国际</Option>
                </Select> */}
                <Select   placeholder="国内/国际船舶" style={{  width: '15%' }} allowClear={true} onChange={(value: any) => this.setState({ isChinaShip: value })}>
                    <Option value={2}>国际</Option>
                    <Option value={1}>国内</Option>
                </Select>
                <Input
                  style={{ width: '55%' }}
                  placeholder="请输入船舶名称搜索"
                  onChange={e => this.setState({ shipName: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <QueryButton
                  type="Query"
                  text="搜索"
                  event={this.findAll}
                  disabled={false}
                />
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
                  width: '10.95%',
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
                  未审核
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
                  未通过
                </Button>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '13%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonC ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectC}
                >
                  已通过
                </Button>
              </Form.Item>
            </Col>
          </Row>
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
              total: this.state.total,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  总共{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
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

const ShipCertificationList_Form = Form.create({ name: 'ShipCertificationList_Form' })(
  ShipCertificationListForm,
);

export default ShipCertificationList_Form;
