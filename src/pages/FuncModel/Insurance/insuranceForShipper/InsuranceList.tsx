import { deleteRequest, getRequest } from '@/utils/request';
import { items } from '@/utils/utils';
import { Col, Form, Input, message, Modal, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import QueryButton from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import commonCss from '../../../Common/css/CommonCss.less';
import { InsuranceModel } from './InsuranceModel';

const InputGroup = Input.Group;
const { confirm } = Modal;
let companyItem: items[] = [];
const data_Source: InsuranceModel[] = [];

//页面列表组件
class InsuranceListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<InsuranceModel>[] = [
    {
      title: <FormattedMessage id="insuranceForShipper-insuranceList.code" />,
      dataIndex: 'goodsIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForShipper-insuranceList.goods.name" />,
      dataIndex: 'goodsName',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForShipper-insuranceAdd.company" />,
      dataIndex: 'insuranceCom',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForShipper-insuranceList.people" />,
      dataIndex: 'policyHolder',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForShipper-insuranceAdd.phonenumber" />,
      dataIndex: 'contactNumber',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForShipper-insuranceAdd.time.start" />,
      dataIndex: 'transportStart',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForShipper-insuranceList.status" />,
      dataIndex: 'stateInfo',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForShipper-insuranceList.operate" />,
      dataIndex: 'entity',
      align: 'center',
      width: '16%',
      render: (entity: any) => (
        <span>
          <QueryButton
            disabled={entity.state == 1}
            text={formatMessage({ id: 'insuranceForShipper-insuranceList.alter' })}
            type="Edit"
            event={() => this.handleEdit(entity.guid)}
          />
          &nbsp;
          <QueryButton
            disabled={entity.state == 1}
            text={formatMessage({ id: 'insuranceForShipper-insuranceList.view' })}
            type="View"
            event={() => this.handleView(entity.guid)}
          />
          &nbsp;
          <QueryButton
            disabled={entity.state == 1}
            text={formatMessage({ id: 'insuranceForShipper-insuranceList.delete' })}
            type="Delete"
            event={() => this.handleDelete(entity.guid, entity.goodsIndex)}
          />
        </span>
      ),
    },
  ];
  state = {
    columns: this.columns,
    dataSource: data_Source,
    insuranceCompany: '',
    goodsName: '',
    total: 0,
    currentPage: 1,
    pageSize: 10,
    rate: '',
  };

  componentDidMount() {
    this.setState({
      //列
      columns: this.columns,
    });

    //调取查询保险公司列表接口,获取页面的保险公司下拉值
    companyItem = [];
    let ship: Map<string, string> = new Map();
    ship.set('type', '1');
    ship.set('currentPage', '-1');
    ship.set('pageSize', '-1');
    getRequest('/sys/insuranceCompany', ship, (response: any) => {
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          forEach(response.data.insuranceCompanys, (item, index) => {
            companyItem.push({ code: item.guid, textValue: item.companyNameCn });
          });
        }
      }
    });
    this.initData();
  }

  //初始化数据
  initData() {
    this.getInsuranceList1();
  }

  //获取列表数据
  getInsuranceList1() {
    //清空data_Source，方式循环调用，多次push
    data_Source.length = 0;
    //调用mock
    let param: Map<string, any> = new Map();
    param.set('type', '2');
    param.set('goods', this.state.goodsName ? this.state.goodsName : '');
    param.set('insuranceCompany', this.state.insuranceCompany ? this.state.insuranceCompany : '');
    param.set('pageSize', this.state.pageSize);
    param.set('currentPage', this.state.currentPage);
    param.set('date', moment());
    getRequest('/business/insurance', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          //循环赋值给table数据对象insuranceSource
          forEach(response.data.insurances, (insurance, index) => {
            let stateInfo;
            if (insurance.state === 1) {
              stateInfo = formatMessage({ id: 'insuranceForShipper-insuranceList.has' });
            } else if (insurance.state === 0) {
              stateInfo = formatMessage({ id: 'insuranceForShipper-insuranceList.hasnot' });
            }
            insurance.goodsIndex = index + 1 + (this.state.currentPage - 1) * this.state.pageSize;
            let list: items[] = [];
            if (!isNil(companyItem)) {
              list = companyItem.filter(item => {
                return item.code === insurance.insuranceCompany;
              });
            }
            data_Source.push({
              goodsIndex: insurance.goodsIndex,
              goodsName: insurance.goods,
              insuranceCom: list.length > 0 ? list[0].textValue : insurance.insuranceCompany,
              policyHolder: insurance.policyHolder,
              contactNumber: insurance.contactNumber,
              state: insurance.state,
              stateInfo: stateInfo,
              transportStart: moment(Number(insurance.transportStart)).format('YYYY/MM/DD'),
              guid: insurance.guid,
              entity: insurance,
            });
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
          rate: response.data.insuranceRate,
        });
      }
    });
  }

  pagesizechange = (page: any, size: any) => {
    this.setState(
      {
        currentPage: page,
        pageSize: size,
      },
      () => {
        this.getInsuranceList1();
      },
    );
  };

  onBack = () => {
    this.props.history.push('/index_menu');
  };
  //搜索操作
  search() {
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getInsuranceList1();
      },
    );
  }

  //获取下拉框
  handleChange(value: any) {
    this.setState({ insuranceCompany: value });
  }

  //关闭
  handClose = () => {};

  //添加新增按钮操作
  handAddPallet = () => {
    const { rate } = this.state;
    this.props.history.push('/insurance_shipper/add/' + rate);
  };

  //编辑修改按钮操作
  handleEdit = (guid: any) => {
    const { rate } = this.state;
    this.props.history.push('/insurance_shipper/edit/' + guid + '/' + rate);
  };

  //查看按钮操作
  handleView = (guid: any) => {
    this.props.history.push('/insurance_shipper/view/' + guid);
  };

  //删除按钮操作
  handleDelete = (e: any, goodsIndex: any) => {
    const cycleData = this.getInsuranceList1.bind(this);
    const entity: InsuranceModel = this.state.dataSource[goodsIndex - 1];
    const deleteMessage =
      formatMessage({ id: 'Myship-MyshipList.delete.confirmstart' }) +
      ' ' +
      formatMessage({ id: 'insuranceForShipper-insuranceList.code' }) +
      ':' +
      entity.goodsIndex +
      ' ' +
      formatMessage({ id: 'insuranceForShipper-insuranceList.goods.name' }) +
      ':' +
      entity.goodsName +
      ' ' +
      formatMessage({ id: 'insuranceForShipper-insuranceList.people' }) +
      ':' +
      entity.policyHolder +
      ' ' +
      formatMessage({ id: 'Myship-MyshipList.delete.confirmend' });
    confirm({
      title: deleteMessage,
      okText: formatMessage({ id: 'insuranceForShipper-insuranceDelete.delete.confirm' }),
      cancelText: formatMessage({ id: 'insuranceForShipper-insuranceDelete.delete.cancel' }),
      onOk() {
        let requestParam: Map<string, string> = new Map();
        requestParam.set('type', '1');

        deleteRequest('/business/insurance/' + e, requestParam, (response: any) => {
          if (response.status === 200) {
            message.success(
              formatMessage({ id: 'insuranceForShipper-insuranceList.delete.success' }),
              2,
              cycleData,
            );
          }
        });
      },
    });
  };

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getInsuranceList1();
   }
  }

  // 渲染
  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'insuranceForShipper-insuranceList.online.insure' })}
          event={() => {
            this.onBack();
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                {/* 设置搜索框onChange */}
                <Select
                  allowClear={true}
                  style={{ width: '15%' }}
                  placeholder={formatMessage({ id: 'insuranceForShipper-insuranceAdd.company' })}
                  onChange={this.handleChange.bind(this)}
                >
                  {companyItem.map((item: any) => (
                    <Select.Option value={item.code}>{item.textValue}</Select.Option>
                  ))}
                </Select>
                <Input
                  style={{ width: '77%' }}
                  maxLength={32}
                  placeholder={formatMessage({
                    id: 'insuranceForShipper-insuranceList.enter.shipname',
                  })}
                  onChange={e => this.setState({ goodsName: e.target.value })}
                  defaultValue={this.state.goodsName}
                  onKeyUp={this.keyUp}
                ></Input>
                <QueryButton
                  disabled={false}
                  type="Query"
                  text={formatMessage({ id: 'insuranceForShipper-insuranceList.search' })}
                  event={this.search.bind(this)}
                />
                {/* <QueryButton type="BatchDelete" text="批量删除" event={() => {}} /> */}
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
              total: this.state.total,
              current: this.state.currentPage,
              onChange: this.pagesizechange,
              showTotal: () => (
                <div>
                  <FormattedMessage id="insuranceForShipper-insuranceList.total" />{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  <FormattedMessage id="insuranceForShipper-insuranceList.pages" />
                  {this.state.pageSize}
                  <FormattedMessage id="insuranceForShipper-insuranceList.records" />
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

const InsuranceList_Form = Form.create({ name: 'Insurance_List_Form' })(InsuranceListForm);

export default InsuranceList_Form;
