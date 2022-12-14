import getRequest, { deleteRequest } from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Form, message, Modal, Row, Select, Table, Input, Button } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { PalletDynamicsModel } from './PalletDynamicsModel';
import moment from 'moment';

const { confirm } = Modal;

class PalletDynamicsListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<PalletDynamicsModel>[] = [
    {
      title: '用户信息',
      dataIndex: 'HumanStatus',
      align: 'center',
      width: '6%',
    },
    {
      title: '货物编号',
      dataIndex: 'goodsIndex',
      align: 'center',
      width: '6%',
    },
    {
      title: '货物名称',
      dataIndex: 'goodsLevel',
      align: 'center',
      width: '6%',
    },
    {
      title: '货物重量',
      dataIndex: 'goodsType',
      align: 'center',
      width: '6%',
    },
    {
      title: '装货日期',
      dataIndex: 'goodsProperty',
      align: 'center',
      width: '13%',
    },
    {
      title: '起运港',
      dataIndex: 'startPort',
      align: 'center',
      width: '7%',
    },
    {
      title: '目的港',
      dataIndex: 'destinationPort',
      align: 'center',
      width: '9%',
    },
    {
      title: '货盘发布时间',
      dataIndex: 'createDate',
      align: 'center',
      width: '13%',
    },
    {
      title: '其他服务',
      dataIndex: 'isSuperposition',
      align: 'center',
      width: '17%',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '17%',
      render: (guid: any) => (
        <span>
          <QueryButton text="查看" type="View" event={() => this.handleView(guid.guid)} />
          <QueryButton
            text="删除"
            type="Delete"
            disabled={guid.state === 3}
            event={() => this.handleDelete(guid.guid, guid.goodsIndex)}
          />
          &nbsp; &nbsp;
          {localStorage.getItem('userType') === '3' ? (
            <QueryButton
              text={
                !guid.isAddProcessedFile
                  ? formatMessage({ id: 'pallet-palletList.no.operation' })
                  : formatMessage({ id: 'pallet-palletList.already.operated' })
              }
              type="Operated"
              event={() => { }}
              disabled={!guid.isAddProcessedFile}
            />
          ) : null}
        </span>
      ),
    },
  ];

  state = {
    //列
    columns: this.columns,
    //表数据
    dataSource: [],
    //货物名称
    goodsLevel: '',
    isRealUser: '',
    total: 0,
    currentPage: 1,
    pageSize: 10,
    palletNumber: '',
    buttonA: true,
    buttonB: false,
    buttonC: false,
    adsStatus: '0',
    status: '0',
    method: '3',
  };

  //初期化事件
  componentDidMount() {
    this.initData();
    this.setState({
      currentPage: localStorage.currentPage,
      isRealUser: localStorage.isRealUser || '',
      palletNumber: localStorage.palletNumber || '',
      goodsLevel: localStorage.goodsLevel || '',
    })
    localStorage.currentPage
      ? localStorage.removeItem('currentPage')
      : (localStorage.currentPage = this.state.currentPage);
    localStorage.isRealUser
      ? localStorage.removeItem('isRealUser')
      : (localStorage.isRealUser = this.state.isRealUser);
    localStorage.palletNumber
      ? localStorage.removeItem('palletNumber')
      : (localStorage.palletNumber = this.state.palletNumber);
    localStorage.goodsLevel
      ? localStorage.removeItem('goodsLevel')
      : (localStorage.goodsLevel = this.state.goodsLevel);
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
    params.set('isRealUser', localStorage.isRealUser || this.state.isRealUser);
    params.set('goodsLevel', localStorage.goodsLevel || this.state.goodsLevel);
    params.set('palletNumber', localStorage.palletNumber || this.state.palletNumber);
    params.set('date', moment());
    params.set('pageSize', this.state.pageSize.toString());
    params.set('currentPage', localStorage.currentPage || this.state.currentPage);
    getRequest('/business/pallet', params, (response: any) => {
      console.log(response);
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.pallets, (pallet, index) => {
            const entity: PalletDynamicsModel = {};
            entity.goodsIndex = pallet.palletNumber;
            entity.guid = pallet;
            entity.goodsCount = pallet.goodsCount;
            entity.goodsLevel = getTableEnumText('goods_name', pallet.goodsLevel);
            entity.goodsType = pallet.goodsWeight + '吨';
            entity.HumanStatus = pallet.humanStatus;
            //货盘发布时间
            var zoneDate = new Date(pallet.createDate).toJSON();
            var date = new Date(+new Date(zoneDate))
              .toISOString()
              .replace(/T/g, ' ')
              .replace(/\.[\d]{3}Z/, '');
            // let CD = moment(date).format('L');
            // let CD = moment(pallet.createDate).format("YYYY-MM-DD")
            entity.createDate = date;
            //装货时间
            let loadDate = moment(parseInt(pallet.loadDate)).format('YYYY-MM-DD');
            let endDate = moment(parseInt(pallet.endDate)).format('YYYY-MM-DD');
            entity.goodsProperty = loadDate + '至' + endDate;

            //是否需要联合运输
            let unionTransport = pallet.unionTransport == 1 ? '联合运输、' : '';
            //是否需要绑扎
            let isBind = pallet.isBind == 1 ? '绑扎、' : '';
            //是否需要集港
            let isGangji = pallet.isGangji == 1 ? '集港、' : '';
            //江运海运险
            let insuranceJiangyun = pallet.insuranceJiangyun == 1 ? '江运海运险、' : '';
            //卡车运输险
            let insuranceKache = pallet.insuranceKache == 1 ? '卡车运输险、' : '';
            //海运险
            let insuranceHaiyun = pallet.insuranceHaiyun == 1 ? '海运险、' : '';

            entity.isSuperposition =
              unionTransport +
              isBind +
              isGangji +
              insuranceJiangyun +
              insuranceKache +
              insuranceHaiyun;
            entity.startPort = getTableEnumText('port', pallet.startPort);
            entity.destinationPort = getTableEnumText('port', pallet.destinationPort);
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

  //货盘删除
  handleDelete = (e: any, goodsIndex: any) => {
    const search = this;
    const deleteMessage = '是否对' + ' ' + '序号' + ':' + e + ' ' + '的信息进行删除';
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
    localStorage.currentPage = 1;
    localStorage.goodsLevel = this.state.goodsLevel;
    localStorage.isRealUser = this.state.isRealUser;
    localStorage.palletNumber = this.state.palletNumber;
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getPalletDynamicsList();
      },
    );
  }

  handleView = (guid: any) => {
    localStorage.goodsLevel = this.state.goodsLevel;
    localStorage.isRealUser = this.state.isRealUser;
    localStorage.palletNumber = this.state.palletNumber;
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
    localStorage.currentPage = page;
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getPalletDynamicsList();
      },
    );
  };
  keyup = () => {

  }
  //切换状态未审核
  selectA = () => {
    this.setState(
      {
        buttonA: true,
        buttonB: false,
        buttonC: false,
        status: '0',
        currentPage: 1,
        method: '3',
      },
      // () => {
      //   this.initData();
      // },
    );
  };

  //切换状态已通过
  selectC = () => {
    this.setState(
      {
        buttonA: false,
        buttonB: false,
        buttonC: true,
        adsStatus: '1',
        status: '1',
        currentPage: 1,
        method: '7',
      },
      // () => {
      //   this.initData();
      // },
    );
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="货盘动态"
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <Select
                allowClear={true}
                style={{ width: '30%' }}
                placeholder="用户信息检索"
                onChange={(value: any) => {
                  this.setState({ isRealUser: value });
                }}
              >
                <Select.Option value={'1'}>{'本公司用户'}</Select.Option>
                <Select.Option value={'2'}>{'真实用户'}</Select.Option>
              </Select>
              <Select
                allowClear={true}
                style={{ width: '30%' }}
                placeholder="请输入货物名称搜索"
                onChange={this.selectChange}
              >
                {getDictDetail('goods_name').map((item: any) => (
                  <Select.Option value={item.code}>{item.textValue}</Select.Option>
                ))}
              </Select>
              <Input
                style={{ width: '25%' }}
                placeholder="请输入货物编号"
                onChange={e => this.setState({ palletNumber: e.target.value })}
                onKeyUp={this.keyUp}
              />
              <QueryButton type="Query" text="搜索" event={this.search.bind(this)} />
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          {/* <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '10.93%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonA ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectA}
                >
                  国内货盘
                </Button>
              </Form.Item>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '12.97%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonC ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectC}
                >
                  国际货盘
                </Button>
              </Form.Item>
            </Col>
          </Row> */}
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
              // current: localStorage.currentPage === '' ? this.state.currentPage : localStorage.currentPage,
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
                  {this.state.pageSize}
                  <FormattedMessage id="PalletDynamics-PalletDynamicsList.records" />
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
