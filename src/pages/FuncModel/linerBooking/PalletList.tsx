import getRequest, { deleteRequest, postRequest } from '@/utils/request';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import { Col, Input, message, Modal, Row, Form, Table, Upload } from 'antd';
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
import { exportExcel } from 'xlsx-oc';
import XLSX from 'xlsx';
const InputGroup = Input.Group;
const { confirm } = Modal;

class PalletListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<PalletModel>[] = [
    {
      title: '序号',
      dataIndex: 'reserveIndex',
      align: 'center',
      width: '5%',
    },
    {
      title: '订单编号',
      dataIndex: 'orderNumber',
      align: 'center',
    },
    {
      title: '班轮航次',
      dataIndex: 'namess',
      align: 'center',
      width: '20%',
    },
    // {
    //   title: '截关时间',
    //   dataIndex: 'startDate',
    //   align: 'center',
    // },
    {
      title: '船期',
      dataIndex: 'endDate',
      align: 'center',
    },
    {
      title: '20GP',
      dataIndex: 'haiyunMoneyOneOld',
      align: 'center',
    },
    {
      title: '40GP',
      dataIndex: 'haiyunMoneyTwoOld',
      align: 'center',
    },
    {
      title: '40HQ',
      dataIndex: 'haiyunMoneyThreeOld',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'state',
      align: 'center',
    },
    {
      title: '订舱时间',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'pallet-palletList.operate' }),
      dataIndex: 'guid',
      align: 'center',
      width: '8%',
      render: (guid: any) => (
        <span>
          <QueryButton
            text="查看"
            type="View"
            event={() => this.handleView(guid)}
            disabled={false}
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
    //货物名称
    goodsLevel: '',
    //二级货名
    goodsSubLevel: '',
    //货品类型
    goodsType: '',
    visible: false,
    //当前页
    currentPage: 1,
    fileList: [],
    uploadData: [],
    total: 0,
    pagesize: 10,
  };

  //初期华事件
  componentDidMount() {
    this.initData();
    this.setState({
      //列
      columns: this.columns,
      currentPage: localStorage.currentPage,
    });
    localStorage.currentPage
      ? localStorage.removeItem('currentPage')
      : (localStorage.currentPage = this.state.currentPage);
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
    params.set('currentPage', localStorage.currentPage || this.state.currentPage);
    params.set('date', moment());
    params.set('closingTime', this.state.startDate ? this.state.startDate : '');
    params.set('userName', this.state.user ? this.state.user : '');
    params.set('phoneNumber', this.state.phoneNumber ? this.state.phoneNumber : '');
    return params;
  }

  //获取表格数据
  getPalletList() {
    const data_Source: PalletModel[] = [];
    let param = this.setParams();
    getRequest('/business/shipBooking/getUserShipBookingList', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.records, (pallet, index) => {
            const entity: PalletModel = {};

            pallet.goodsIndex = index + 1;
            entity.reserveIndex = pallet.goodsIndex;
            entity.createDate = moment(pallet.createDate).format('YYYY/MM/DD');
            entity.key = index + 1;
            entity.namess =
              pallet.startPortCn +
              ' ' +
              pallet.startPortEn +
              '---' +
              pallet.endPortCn +
              ' ' +
              pallet.endPortEn;

            entity.startDate =
              pallet.closingTimeWeek + '---' + moment(pallet.closingTime).format('MMM Do');
            entity.endDate =
              pallet.sailingTimeWeek + '---' + moment(pallet.sailingTime).format('MMM Do');

            entity.haiyunMoneyOneOld = pallet.twentyGp;
            entity.haiyunMoneyTwoOld = pallet.fortyGp;
            entity.haiyunMoneyThreeOld = pallet.fortyHq;
            entity.orderNumber = pallet.orderNumber;
            entity.state = pallet.accountId;

            entity.guid = pallet;

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
  findAll = () => {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getPalletList_ss();
      },
    );
  };

  getPalletList_ss() {
    const data_Source: ShipModel[] = [];
    let param: Map<string, string> = new Map();

    param.set('closingTime', this.state.startDate ? this.state.startDate : '');
    param.set('userName', this.state.user ? this.state.user : '');
    param.set('phoneNumber', this.state.phoneNumber ? this.state.phoneNumber : '');
    param.set('pageSize', 10);
    param.set('currentPage', this.state.currentPage);
    getRequest('/business/shipBooking/getUserShipBookingList', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          {
            if (response.data.records.length > 0) {
              forEach(response.data, (pallet, index) => {
                const entity: PalletModel = {};
                pallet.goodsIndex = index + (this.state.currentPage - 1) * this.state.pagesize + 1;
                entity.key = index + 1;
                entity.namess =
                  pallet.startPortCn +
                  ' ' +
                  pallet.startPortEn +
                  '---' +
                  pallet.endPortCn +
                  ' ' +
                  pallet.endPortEn;

                entity.startDate =
                  pallet.closingTimeWeek + '---' + moment(pallet.closingTime).format('MMM Do');
                entity.endDate =
                  pallet.sailingTimeWeek + '---' + moment(pallet.sailingTime).format('MMM Do');

                entity.haiyunMoneyOneOld = pallet.haiyunMoneyOneOld;
                entity.haiyunMoneyTwoOld = pallet.haiyunMoneyTwoOld;
                entity.haiyunMoneyThreeOld = pallet.haiyunMoneyThreeOld;
                entity.orderNumber = pallet.orderNumber;

                entity.state = pallet.accountId;
                entity.guid = pallet;

                data_Source.push(entity);
              });
            } else {
              console.log('wu');
            }
          }
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
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
        this.getPalletList();
      },
    );
  };

  //订舱新增
  handAddPallet = () => {
    this.props.history.push('/linerBooking/add');
  };

  //编辑订舱
  handAddPallet_b = () => {
    this.props.history.push('/linerBooking/edit');
  };

  //货盘查看
  handleView = (guid: any) => {
    this.props.history.push('/linerBooking/view/' + guid.guid);
  };

  handleOk = () => {
    let model = {
      道裕编号: 'orderNumber', //起始港（中文）
      船公司名: 'shipCompany', //船公司名
      // Logo: 'Logo...', //Logo
      '起始港（中文）': 'startPortCn', //起始港（中文）
      '起始港（英文）': 'startPortEn', //起始港（英文）
      '目的港（中文）': 'endPortCn', //目的港（中文）
      '目的港（英文）': 'endPortEn', //目的港（英文）
      船期: 'sailingTime', //船期
      航程: 'voyage', //航程
      // haiyunTwentyGpTejia: haiyunTwentyGpTejia, //20GP特价
      '20GP原价': 'haiyunTwentyGpYuanjia', //20GP价格
      // haiyunFortyGpTejia: haiyunFortyGpTejia, //40GP特价
      '40GP原价': 'haiyunFortyGpYuanjia', //40GP价格
      // haiyunFortyHqTejia: haiyunFortyHqTejia, //40HQ特价
      '40HQ原价': 'haiyunFortyHqYuanjia', //40HQ价格
      文件费20GP: 'wenjianTwentyGp', //文件费20GP
      文件费40GP: 'wenjianFortyGp', //文件费40GP
      文件费40HQ: 'wenjianFortyHq', //文件费40HQ
      订舱费20GP: 'dingcangTwentyGp', //订舱费20GP
      订舱费40GP: 'dingcangFortyGp', //订舱费40GP
      订舱费40HQ: 'dingcangFortyHq', //订舱费40HQ
      船代操作费20GP: 'caozuoTwentyGp', //船代操作费20GP
      船代操作费40GP: 'caozuoFortyGp', //船代操作费40GP
      船代操作费40HQ: 'caozuoFortyHq', //船代操作费40HQ
      EIR20GP: 'eirTwentyGp', //EIR20GP
      EIR40GP: 'eirFortyGp', //EIR40GP
      EIR40HQ: 'eirFortyHq', //EIR40HQ
      THC20GP: 'thcTwentyGp', //thc20GP
      THC40GP: 'thcFortyGp', //thc40GP
      THC40HQ: 'thcFortyHq', //thc40HQ
      封志费20GP: 'fengzhiTwentyGp', //封志费20GP
      封志费40GP: 'fengzhiFortyGp', //封志费40GP
      封志费40HQ: 'fengzhiFortyHq', //封志费40HQ
      舱单费20GP: 'chuandanTwentyGp', //舱单费20GP
      舱单费40GP: 'chuandanFortyGp', //舱单费40GP
      舱单费40HQ: 'chuandanFortyHq', //舱单费40HQ
      促销标签: 'cuxiao', //促销标签
      所属船公司: 'shipCompany', //所属船公司
      供应商编号: 'dyNumber', //供应商编号
      shipBookingDate: 'qita',
      备注: 'remark',
    };
    if (this.state.uploadData) {
      const arr = this.state.uploadData.map(item => {
        let obj = {};
        for (const key in item) {
          obj[model[key]] = item[key];
        }
        return obj;
      });
      arr.map(value => {
        postRequest(
          '/business/shipBooking/addShipBooking',
          JSON.stringify(value),
          (response: any) => {
            if (response.status === 200) {
              message.success('提交成功');
              this.props.history.push('/linerBooking/list');
            } else {
              message.error('提交失败');
            }
          },
        );
      });
    }

    this.setState({
      visible: false,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  uploadChange = (file: any) => {
    this.setState({ fileList: file.fileList });
    if (file.file.size <= 1024 * 1024) {
      if (file.file.status == 'done') {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file.file.originFileObj);
        reader.onload = (event: any) => {
          const workbook = XLSX.read(event.target.result, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 2 });
          this.setState({ uploadData: [...this.state.uploadData, ...rows] });
        };
      }
    } else {
      message.error(`只能上传大小不超过1MB的文件`);
    }

    // console.log(info, this.state.fileList);
    // if (info.file.status == 'uploading') {
    // }
    // if (info.file.status === 'done') {
    //   message.success(`${info.file.name} 上传成功`);
    // } else if (info.file.status === 'error') {
    //   message.error(`${info.file.name} 上传失败`);
    // }
  };
  render() {
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="班轮订舱"
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '21%' }}
                  placeholder="请输入截关时间检索，格式为：xxxx-xx-xx (例：2021-05-12或2021-07-07)"
                  onChange={e => this.setState({ startDate: e.target.value })}
                  // onKeyUp={this.keyUp}
                />
                <Input
                  style={{ width: '21%' }}
                  placeholder="请输入用户名检索"
                  onChange={e => this.setState({ user: e.target.value })}
                  // onKeyUp={this.keyUp}
                />
                <Input
                  style={{ width: '23%' }}
                  placeholder="请输入联系电话检索"
                  onChange={e => this.setState({ phoneNumber: e.target.value })}
                  // onKeyUp={this.keyUp}
                />

                {/* <QueryButton key={3}
                  type="Query"
                  text={formatMessage({ id: 'pallet-palletList.search' })}
                  event={this.search.bind(this)}
                  disabled={false}
                /> */}
                <QueryButton
                  key={3}
                  type="Query"
                  text="搜索"
                  event={() => this.initData()}
                  disabled={false}
                />
                <span style={{ width: '2%' }}></span>
                {/* <QueryButton key={3} type="BatchDelete"  text="新增班轮" event={() => this.handAddPallet()} disabled={false} /> */}

                <QueryButton
                  key={4}
                  type="BatchDelete"
                  text="批量导入"
                  event={() =>
                    this.setState({
                      visible: true,
                    })
                  }
                  disabled={false}
                />
                <span style={{ width: '2%' }}></span>
                <QueryButton
                  key={5}
                  type="BatchDelete"
                  text="新增班轮"
                  event={() => this.handAddPallet()}
                  disabled={false}
                />
                <span style={{ width: '2%' }}></span>
                <QueryButton
                  key={3}
                  type="BatchDelete"
                  text="编辑班轮"
                  event={() => this.handAddPallet_b()}
                  disabled={false}
                />
              </InputGroup>
            </Col>
          </Row>
        </div>
        <Modal
          style={{ padding: '0px' }}
          title="批量导入班轮数据"
          centered={false}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: this.state.fileList.length == 0 }}
        >
          <div className={commonCss.searchRow}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formlayout} label="文件">
                  <Upload
                    accept=".csv,.xls,.xlsx"
                    action="http://58.33.34.10:10443/api/sys/file/upLoadFuJian/linerBooking"
                    onChange={this.uploadChange}
                    fileList={this.state.fileList}
                  >
                    <QueryButton text="选择文件" type="Save" event={() => {}}></QueryButton>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  {...{
                    labelCol: { span: 4 },
                    wrapperCol: { span: 24 },
                  }}
                  label=""
                >
                  <p style={{ paddingLeft: '30px' }}>
                    最大支持 10000 条（支持 csv、xls、xlsx，文件大小在 1MB 以内）
                  </p>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  {...{
                    labelCol: { span: 4 },
                    wrapperCol: { span: 24 },
                  }}
                  label=""
                >
                  <p
                    style={{
                      paddingLeft: '30px',
                      textAlign: 'left',
                      color: '#4486F6',
                      cursor: 'pointer',
                    }}
                  >
                    下载批量导入模板
                  </p>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Modal>
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
                  {this.state.pagesize}
                  <FormattedMessage id="pallet-palletList.records" />
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
