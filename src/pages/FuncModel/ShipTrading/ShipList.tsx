import { getRequest, putRequest } from '@/utils/request';
import { Button, Col, Form, Input, Row, Table, Select, Modal } from 'antd';
import { getDictDetail } from '@/utils/utils';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { UserModel } from './UserModel';
const InputGroup = Input.Group;
const data_Source: UserModel[] = [];
const { confirm } = Modal;
// const { Option, OptGroup } = Select;

class ShipList extends React.Component<RouteComponentProps & { location: { query: any } }> {
  private columns: ColumnProps<UserModel>[] = [
    {
      title: '序号',
      dataIndex: 'usersIndex',
      align: 'center',
      width: '5%',
    },
    {
      title: '交易身份',
      dataIndex: 'identityType',
      align: 'center',
      width: '5%',
    },
    {
      title: '船舶名称',
      dataIndex: 'buildParticularYear',
      align: 'center',
      width: '5%',
    },
    {
      title: '船龄',
      dataIndex: 'shipAge',
      align: 'center',
      width: '5%',
    },
    {
      title: '吨位',
      dataIndex: 'tonnage',
      align: 'center',
      width: '5%',
    },
    {
      title: '船舶类型',
      dataIndex: 'shipType',
      align: 'center',
      width: '5%',
    },
    {
      title: '船级社',
      dataIndex: 'classificationSociety',
      align: 'center',
      width: '5%',
    },
    {
      title: '挂牌套餐类型 ',
      dataIndex: 'ListingType',
      align: 'center',
      width: '5%',
    },
    {
      title: '套餐金额',
      dataIndex: 'packageAmount',
      align: 'center',
      width: '5%',
    },
    {
      title: '状态',
      dataIndex: 'state',
      align: 'center',
      width: '5%',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      align: 'center',
      width: '5%',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '8%',
      render: (guid: any, data: any) => (
        <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <QueryButton
            text="查看"
            type="View"
            event={() => this.handleView(guid)}
            disabled={false}
          />
          <QueryButton
            text="取消"
            type="Delete"
            event={() => this.shelfChange(guid, data.shelf)}
            disabled={false}
          />
        </span>
      ),
    },
  ];

  state = {
    columns: this.columns,
    dataSource: data_Source,
    shipType: '',
    dwt: '',
    dwtMax: '',
    shipAge: 1,
    listType: 1,
    shipAgeMax: 999,
    currentPage: 1,
    pageSize: 10,
    phoneNumber: '',
    listing: true,
    aucTion: false,
    buyBoat: false,
    total: 0,
    priceType: '',
    orderNumber: '',
    shelfChange: true,
    isModalOpen: false,
  };
  componentDidMount() {
    this.listing();
    this.setState({
      currentPage: localStorage.currentPage,
      shipType: localStorage.shipType || '',
      dwt: localStorage.dwt || '',
      dwtMax: localStorage.dwtMax || '',
      orderNumber: localStorage.orderNumber || '',
      shipAge: localStorage.shipAge || '',
      shipAgeMax: localStorage.shipAgeMax || '',
    });
    localStorage.currentPage
      ? (localStorage.removeItem('currentPage'))
      : (localStorage.currentPage = this.state.currentPage);
    localStorage.shipType
      ? localStorage.removeItem('shipType')
      : (localStorage.shipType = this.state.shipType);
    localStorage.dwt
      ? localStorage.removeItem('dwt')
      : (localStorage.dwt = this.state.dwt);
    localStorage.dwtMax
      ? localStorage.removeItem('dwtMax')
      : (localStorage.dwtMax = this.state.dwtMax);
    localStorage.orderNumber
      ? localStorage.removeItem('orderNumber')
      : (localStorage.orderNumber = this.state.orderNumber);
    localStorage.shipAge
      ? localStorage.removeItem('shipAge')
      : (localStorage.shipAge = this.state.shipAge);
    localStorage.shipAgeMax
      ? localStorage.removeItem('shipAgeMax')
      : (localStorage.shipAgeMax = this.state.shipAgeMax);
  }
  //模拟数据
  initData() {
    this.getsource();
  }
  //键盘监听
  keyUp: any = (e: any) => {
    if (e.keyCode === 13) {
      this.getsource();
    }
  };

  getsource() {
    const data_Source: UserModel[] = [];
    let param: Map<string, any> = new Map();
    param.set('shipType', localStorage.shipType || this.state.shipType);
    param.set('currentPage', localStorage.currentPage || this.state.currentPage);
    param.set('pageSize', this.state.pageSize ? this.state.pageSize : 20);
    param.set('dwt', localStorage.dwt || this.state.dwt);
    param.set('dwtMax', localStorage.dwtMax || this.state.dwtMax);
    param.set('orderNumber', localStorage.orderNumber || this.state.orderNumber);
    param.set('listType', this.state.listType ? this.state.listType : '');
    param.set('shipAge', localStorage.shipAge || this.state.shipAge);
    param.set('shipAgeMax', localStorage.shipAgeMax || this.state.shipAgeMax);
    param.set('phoneNumber', this.state.phoneNumber ? this.state.phoneNumber : '');
    getRequest('/business/shipSelling/getShipSellingListByWeb', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response)) {
          const priceTypeObj = {
            0: '美元',
            1: '人民币',
            2: '欧元',
          };
          forEach(response.data.records, (userDataCheck, index) => {
            const entity: UserModel = {};
            entity.usersIndex = index + 1 || '';
            entity.orderNumber = userDataCheck.orderNumber || '';
            entity.shipName = userDataCheck.shipName || '';
            entity.identityType = userDataCheck.identityType == '3' ? '卖方' : '卖方(中介)';
            entity.buildParticularYear = userDataCheck.buildParticularYear || '';
            entity.shipType = userDataCheck.shipType || '';
            entity.shipAge = userDataCheck.orderNumber || '';
            entity.classificationSociety = userDataCheck.classificationSociety || '';
            entity.dwt = userDataCheck.dwt || '';
            entity.guid = userDataCheck.guid || '';
            entity.auth =
              userDataCheck.auth == '1'
                ? '体验套餐'
                : userDataCheck.auth == '2'
                  ? 'VIP套餐'
                  : '尊享套餐';
            entity.payMoney = userDataCheck.payMoney || '';
            entity.price = !isNaN(userDataCheck.price * 1)
              ? userDataCheck.price + '万' + priceTypeObj[userDataCheck.priceType]
              : userDataCheck.price;
            entity.phoneNumber = userDataCheck.phoneNumber || '';
            entity.voyageArea = userDataCheck.voyageArea || '';
            entity.shelf = userDataCheck.shelf == 1 ? '上架' : '下架';
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
          // currentPage: response.data.current,
        });
      }
    });
  }
  //修改当前页码
  changePage = (page: any) => {
    localStorage.currentPage = page;
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.initData();
      },
    );
  };
  //船舶挂牌
  listing = () => {
    this.setState(
      {
        listing: true,
        aucTion: false,
        buyBoat: false,
        currentPage: 1,
        listType: 1,
        columns: [
          {
            title: '序号',
            dataIndex: 'usersIndex',
            align: 'center',
            width: '2%',
          },
          {
            title: '编号',
            dataIndex: 'orderNumber',
            align: 'center',
            width: '7%',
          },
          {
            title: '船舶名称',
            dataIndex: 'shipName',
            align: 'center',
            width: '5%',
          },
          {
            title: '船舶类型',
            dataIndex: 'shipType',
            align: 'center',
            width: '5%',
          },
          {
            title: '吨位',
            dataIndex: 'dwt',
            align: 'center',
            width: '5%',
          },
          {
            title: '船龄',
            dataIndex: 'buildParticularYear',
            align: 'center',
            width: '3%',
          },
          {
            title: '船级社',
            dataIndex: 'classificationSociety',
            align: 'center',
            width: '5%',
          },
          {
            title: '挂牌套餐类型 ',
            dataIndex: 'auth',
            align: 'center',
            width: '5%',
          },
          {
            title: '套餐金额',
            dataIndex: 'payMoney',
            align: 'center',
            width: '5%',
          },
          {
            title: '状态',
            dataIndex: 'shelf',
            align: 'center',
            width: '3%',
          },
          {
            title: '联系方式',
            dataIndex: 'phoneNumber',
            align: 'center',
            width: '5%',
          },
          {
            title: '操作',
            dataIndex: 'guid',
            align: 'center',
            width: '8%',
            render: (guid: any, data: any) => (
              <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                <QueryButton
                  text="查看"
                  type="View"
                  event={() => this.handleView(guid)}
                  disabled={false}
                />
                <QueryButton
                  text={data.shelf == '上架' ? '暂停' : '恢复'}
                  type={data.shelf == '上架' ? 'NoStop' : 'Stop'}
                  event={() => this.shelfChange(guid, data.shelf)}
                  disabled={false}
                />
              </span>
            ),
          },
        ],
      },
      () => {
        this.initData();
      },
    );
  };
  //买船
  buyBoat = () => {
    this.setState(
      {
        listing: false,
        aucTion: false,
        buyBoat: true,
        listType: 1,
        currentPage: 1,
        columns: [
          {
            title: '序号',
            dataIndex: 'usersIndex',
            align: 'center',
            width: '2%',
          },
          {
            title: '编号',
            dataIndex: 'orderNumber',
            align: 'center',
            width: '7%',
          },
          {
            title: '交易身份',
            dataIndex: 'identityType',
            align: 'center',
            width: '5%',
          },
          {
            title: '船舶类型',
            dataIndex: 'shipType',
            align: 'center',
            width: '5%',
          },
          {
            title: '船龄',
            dataIndex: 'buildParticularYear',
            align: 'center',
            width: '5%',
          },
          {
            title: '船级社',
            dataIndex: 'classificationSociety',
            align: 'center',
            width: '5%',
          },
          {
            title: '航区',
            dataIndex: 'voyageArea',
            align: 'center',
            width: '5%',
          },
          {
            title: '吨位',
            dataIndex: 'dwt',
            align: 'center',
            width: '5%',
          },
          {
            title: '意向价',
            dataIndex: 'price',
            align: 'center',
            width: '5%',
          },
          {
            title: '联系方式',
            dataIndex: 'phoneNumber',
            align: 'center',
            width: '5%',
          },
          {
            title: '操作',
            dataIndex: 'guid',
            align: 'center',
            width: '8%',
            render: (guid: any, data: any) => (
              <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                <QueryButton
                  text="查看"
                  type="View"
                  event={() => this.handleAucTion(guid)}
                  disabled={false}
                />
                <QueryButton
                  text={data.shelf == '上架' ? '暂停' : '恢复'}
                  type={data.shelf == '上架' ? 'NoStop' : 'Stop'}
                  event={() => this.shelfChange(guid, data.shelf)}
                  disabled={false}
                />
              </span>
            ),
          },
        ],
      },
      () => {
        this.initData();
      },
    );
  };
  //船舶竞拍
  aucTion = () => {
    this.setState({
      listing: false,
      aucTion: true,
      buyBoat: false,
      currentPage: 1,
      columns: [
        {
          title: '序号',
          dataIndex: 'usersIndex',
          align: 'center',
          width: '2%',
        },
        {
          title: '编号',
          dataIndex: 'orderNumber',
          align: 'center',
          width: '7%',
        },
        {
          title: '交易身份',
          dataIndex: 'identityType',
          align: 'center',
          width: '5%',
        },
        {
          title: '船舶名称',
          dataIndex: 'shipName',
          align: 'center',
          width: '5%',
        },
        {
          title: '船舶类型',
          dataIndex: 'shipType',
          align: 'center',
          width: '5%',
        },
        {
          title: '船级社',
          dataIndex: 'classificationSociety',
          align: 'center',
          width: '5%',
        },
        {
          title: '挂牌套餐类型 ',
          dataIndex: 'auth',
          align: 'center',
          width: '5%',
        },
        {
          title: '套餐金额',
          dataIndex: 'payMoney',
          align: 'center',
          width: '5%',
        },
        {
          title: '状态',
          dataIndex: 'shelf',
          align: 'center',
          width: '5%',
        },
        {
          title: '联系方式',
          dataIndex: 'phoneNumber',
          align: 'center',
          width: '5%',
        },
        {
          title: '操作',
          dataIndex: 'guid',
          align: 'center',
          width: '8%',
          render: (guid: any, data: any) => (
            <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
              <QueryButton
                text="查看"
                type="View"
                event={() => this.handleAucTion(guid)}
                disabled={false}
              />
              <QueryButton
                text={data.shelf == '上架' ? '暂停' : '恢复'}
                type={data.shelf == '上架' ? 'NoStop' : 'Stop'}
                event={() => this.shelfChange(guid, data.shelf)}
                disabled={false}
              />
            </span>
          ),
        },
      ],
    });
  };
  //搜索
  findAll = () => {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };
  //船舶挂牌查看详情
  handleView = (id: any) => {
    localStorage.shipType = this.state.shipType;
    localStorage.dwt = this.state.dwt;
    localStorage.dwtMax = this.state.dwtMax;
    localStorage.shipAge = this.state.shipAge;
    localStorage.orderNumber = this.state.orderNumber;
    localStorage.currentPage = this.state.currentPage;
    let url = '/ShipTrading/view/';
    this.props.history.push(url + id);
  };
  //买船查看详情
  handleAucTion = (id: any) => {
    let url = '/ShipTrading/aucTionView/';
    this.props.history.push(url + id);
  };
  // 船舶挂牌上下架
  shelfChange = (id: any, shelf: any) => {
    let url = '/business/shipSelling/updataShipSelling/' + id + '?listType=1';
    let data = '';
    let that = this;
    confirm({
      icon: '',
      title: shelf == '上架' ? '是否确认暂停?' : '是否确认恢复?',
      onOk() {
        putRequest(url, data, (response: any) => {
          if (response.code == '0000') {
            that.initData();
          }
        });
      },
      onCancel() { },
    });
  };
  // selectChange = (value: any, data: any) => {
  //   this.setState({
  //     shipType: value,
  //   });
  // };
  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="船舶交易"
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
                  style={{ width: '24%' }}
                  placeholder="请选择船舶类型搜索"
                  onSelect={(v, d: any) => {
                    this.setState({ shipType: d.props.children });
                  }}
                >
                  {getDictDetail('ship_type').map((item: any) => (
                    <Select.Option value={item.code}>{item.textValue}</Select.Option>
                  ))}
                </Select>
                <Select
                  allowClear={true}
                  onSelect={(v: any) => {
                    this.setState({ dwt: JSON.parse(v)[0], dwtMax: JSON.parse(v)[1] });
                  }}
                  placeholder="请选择吨位搜索"
                  style={{ width: '24%' }}
                >
                  <Select.Option value={'["", ""]'}>不限</Select.Option>
                  <Select.Option value={'[400, 1600]'}>400-1600吨</Select.Option>
                  <Select.Option value={'[1601, 4000]'}>1601-4000吨</Select.Option>
                  <Select.Option value={'[4001, 7000]'}>4001-7000吨</Select.Option>
                  <Select.Option value={'[7001, 14000]'}>7001-14000吨</Select.Option>
                  <Select.Option value={'[14001, 20000]'}>14001-20000吨</Select.Option>
                  <Select.Option value={'[20001, 30000]'}>20001-30000吨</Select.Option>
                  <Select.Option value={'[30001, 40000]'}>30001-40000吨</Select.Option>
                  <Select.Option value={'[40001, 50000]'}>40001-50000吨</Select.Option>
                  <Select.Option value={'[50001, 999999]'}>50000吨以上</Select.Option>
                </Select>
                <Select
                  allowClear={true}
                  style={{ width: '24%' }}
                  placeholder="请选择船龄"
                  onSelect={(v, d: any) => {
                    let age;
                    d.props.children == '不限'
                      ? (age = ['', ''])
                      : d.props.children == '25年以上'
                        ? (age = ['25', '99999'])
                        : (age = d.props.children.slice(0, d.props.children.length - 1).split('-'));
                    this.setState({ shipAge: age[0], shipAgeMax: age[1] });
                  }}
                >
                  {getDictDetail('ship_age').map((item: any) => (
                    <Select.Option value={item.code}>{item.textValue}</Select.Option>
                  ))}
                </Select>
                <Input
                  style={{ width: '23%' }}
                  placeholder="请输入订单编号名称搜索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <QueryButton
                  type="Query"
                  text="搜索"
                  event={() => this.findAll()}
                  disabled={true}
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
                  width: '11.95%',
                  float: 'left',
                }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.listing ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.listing}
                >
                  船舶挂牌
                </Button>
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: '-5px',
                  paddingBottom: '0px',
                  width: '11.95%',
                  float: 'left',
                }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buyBoat ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.buyBoat}
                >
                  买船
                </Button>
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: '-5px',
                  paddingBottom: '0px',
                  width: '11.91%',
                  float: 'left',
                }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.aucTion ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.aucTion}
                >
                  船舶竞拍
                </Button>
              </Form.Item>
            </Col>
          </Row>
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
              total: this.state.total,
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

const MPCertificationList_Form = Form.create({ name: 'MPCertificationList_Form' })(ShipList);

export default MPCertificationList_Form;
