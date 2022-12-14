import commonCss from '@/pages/Common/css/CommonCss.less';
import { deleteRequest, getRequest } from '@/utils/request';
import { items } from '@/utils/utils';
import { Col, Form, Input, message, Modal, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import QueryButton from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import { InsuranceModel } from './InsuranceModel';

const InputGroup = Input.Group;
const { confirm } = Modal;
let insuranceSource: InsuranceModel[] = [];
//页面列表组件
class InsuranceListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<InsuranceModel>[] = [
    {
      title: <FormattedMessage id="insuranceForshipowner.insuranceList.code" />,
      dataIndex: 'goodsIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForshipowner.insuranceAdd.shipname" />,
      dataIndex: 'shipName',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForshipowner.insuranceAdd.insurance.company" />,
      dataIndex: 'insuranceCompany',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForshipowner.insuranceAdd.applicant" />,
      dataIndex: 'policyHolder',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForshipowner.insuranceAdd.phonenumber" />,
      dataIndex: 'contactNumber',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForshipowner.insuranceAdd.start.date" />,
      dataIndex: 'transportStart',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForshipowner.insuranceList.status" />,
      dataIndex: 'stateInfo',
      align: 'center',
    },
    {
      title: <FormattedMessage id="insuranceForshipowner.insuranceList.operation" />,
      dataIndex: 'entity',
      align: 'center',
      width: '16%',
      render: (entity: any) => (
        <span>
          <QueryButton
            text={formatMessage({ id: 'insuranceForshipowner.insuranceList.update' })}
            type="Edit"
            event={() => this.handleEdit(entity.guid)}
            disabled={entity.state === 1}
          />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'insuranceForshipowner.insuranceList.examine' })}
            type="View"
            event={() => this.handleView(entity.guid)}
            disabled={entity.state === 1}
          />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'insuranceForshipowner.insuranceList.delete' })}
            type="Delete"
            event={() => this.handleDelete(entity.guid, entity.goodsIndex)}
            disabled={entity.state === 1}
          />
        </span>
      ),
    },
  ];

  //设置state
  state = {
    columns: this.columns,
    dataSource: insuranceSource,
    insuranceCompany: '',
    shipId: '',
    currentPage: 1,
    pageSize: 10,
    total: 0,
    companyItem: [],
    shipItem: [],
  };

  componentDidMount() {
    let companyItem: items[] = [];
    let shipItem: items[] = [];
    //调取查询保险公司列表接口,获取页面的保险公司下拉值
    let ship: Map<string, string> = new Map();
    ship.set('type', '1');
    ship.set('currentPage', '-1');
    ship.set('pageSize', '-1');
    getRequest('/sys/insuranceCompany', ship, (response: any) => {
      if (response.status === 200) {
        companyItem = [];
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          forEach(response.data.insuranceCompanys, (item, index) => {
            companyItem.push({ code: item.guid, textValue: item.companyNameCn });
          });
        }
        this.setState({ companyItem: companyItem });
      }
    });
    //调取查询船舶名称列表接口，获取页面的船舶名称列表
    let req: Map<string, string> = new Map();
    req.set('type', '1');
    req.set('pageSize', '-1');
    req.set('currentPage', '-1');
    req.set('checkStatus', '1');
    getRequest('/business/ship', req, (response: any) => {
      if (response.status === 200) {
        shipItem = [];
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          forEach(response.data.ships, (ship, index) => {
            shipItem.push({ code: ship.guid, textValue: ship.shipName });
          });
        }
        this.setState({ shipItem: shipItem });
      }
    });
    this.initData();
  }

  //初始化数据
  initData() {
    this.getInsuranceList();
  }

  //获取列表数据
  getInsuranceList() {
    //清空insuranceSource，方式循环调用，多次push
    insuranceSource.length = 0;
    //调用mock
    let param: Map<string, any> = new Map();
    param.set('type', 1);
    param.set('shipId', isNil(this.state) || isNil(this.state.shipId) ? '' : this.state.shipId);
    param.set(
      'insuranceCompany',
      isNil(this.state) || isNil(this.state.insuranceCompany) ? '' : this.state.insuranceCompany,
    );
    param.set('currentPage', this.state.currentPage);
    param.set('pageSize', this.state.pageSize);
    param.set('date', moment());
    getRequest('/business/insurance', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          //循环赋值给table数据对象insuranceSource
          forEach(response.data.insurances, (insurance, index) => {
            let stateInfo;
            if (insurance.state === 1) {
              stateInfo = formatMessage({ id: 'insuranceForshipowner.insuranceList.sent' });
            } else if (insurance.state === 0) {
              stateInfo = formatMessage({
                id: 'insuranceForshipowner.insuranceList.unpublished',
              });
            }
            insurance.goodsIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            forEach(this.state.companyItem, (item: items, index) => {
              if (insurance.insuranceCompany === item.code) {
                insurance.insuranceCompany = item.textValue;
              }
            });
            insuranceSource.push({
              goodsIndex: `${insurance.goodsIndex}`,
              shipName: `${insurance.shipName}`,
              insuranceCompany: `${insurance.insuranceCompany}`,
              policyHolder: `${insurance.policyHolder}`,
              contactNumber: `${insurance.contactNumber}`,
              stateInfo: stateInfo,
              transportStart: moment(Number(insurance.transportStart)).format('YYYY/MM/DD'),
              guid: `${insurance.guid}`,
              state: insurance.state,
              entity: insurance,
            });
          });
        }

        //获取返回的页数和数据
        this.setState({
          dataSource: insuranceSource,
          currentPage: response.data.currentPage,
          total: response.data.total,
        });
      }
    });
  }

  //返回back
  onBack = () => {
    this.props.history.push('/index_menu');
  };
  //搜索操作
  search() {
    this.setState(
      {
        currentPage: 1,
        pageSize: 10,
      },
      () => {
        this.initData();
      },
    );
  }

  //获取保险公司下拉框
  handleChangeCompany(value: any) {
    this.setState({ insuranceCompany: value });
  }

  //获取船舶名称下拉框
  handleChangeShipName(value: any) {
    this.setState({ shipId: value });
  }

  //添加新增按钮操作
  handAddPallet = () => {
    this.props.history.push('/insurance_shipOwner/add');
  };

  //编辑修改按钮操作
  handleEdit = (guid: any) => {
    this.props.history.push('/insurance_shipOwner/edit/' + guid);
  };

  //查看按钮操作
  handleView = (guid: any) => {
    this.props.history.push('/insurance_shipOwner/view/' + guid);
  };

  //删除按钮操作
  handleDelete = (e: any, goodsIndex: any) => {
    const cycleData = this.getInsuranceList.bind(this);
    const entity: InsuranceModel = this.state.dataSource[goodsIndex - 1];
    const deleteMessage =
      formatMessage({ id: 'Voyage-VoyageList.confirmstart' }) +
      ' ' +
      formatMessage({ id: 'insuranceForshipowner.insuranceList.code' }) +
      ':' +
      entity.goodsIndex +
      ' ' +
      formatMessage({ id: 'insuranceForshipowner.insuranceAdd.shipname' }) +
      ':' +
      entity.shipName +
      ' ' +
      formatMessage({ id: 'insuranceForshipowner.insuranceAdd.applicant' }) +
      ':' +
      entity.policyHolder +
      ' ' +
      formatMessage({ id: 'Voyage-VoyageList.confirmend' });
    confirm({
      title: deleteMessage,
      okText: formatMessage({ id: 'insuranceForshipowner.insuranceDelete.comfirm' }),
      cancelText: formatMessage({ id: 'insuranceForshipowner.insuranceDelete.cancel' }),
      onOk() {
        let requestParam: Map<string, string> = new Map();
        requestParam.set('type', '1'),
          deleteRequest('/business/insurance/' + e, requestParam, (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'insuranceForshipowner.insuranceList.delete.success' }),
                2,
                cycleData,
              );
            } else {
              message.error(
                formatMessage({ id: 'insuranceForshipowner.insuranceList.delete.failed' }),
                2,
                cycleData,
              );
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
        this.getInsuranceList();
      },
    );
  };

  // 渲染
  render() {
    const companyItem =
      isNil(this.state) || isNil(this.state.companyItem) ? [] : this.state.companyItem;
    const shipItem = isNil(this.state) || isNil(this.state.shipItem) ? [] : this.state.shipItem;
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'insuranceForshipowner.insuranceList.insurance.online' })}
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
                  placeholder={formatMessage({
                    id: 'insuranceForshipowner.insuranceList.company.choose',
                  })}
                  onChange={this.handleChangeCompany.bind(this)}
                >
                  {companyItem.map((item: any) => (
                    <Select.Option value={item.code}>{item.textValue}</Select.Option>
                  ))}
                </Select>
                {/* 设置搜索框onChange */}
                <Select
                  allowClear={true}
                  style={{ width: '77%' }}
                  placeholder={formatMessage({
                    id: 'insuranceForshipowner.insuranceList.shipname.search',
                  })}
                  onChange={this.handleChangeShipName.bind(this)}
                >
                  {shipItem.map((item: any) => (
                    <Select.Option value={item.code}>{item.textValue}</Select.Option>
                  ))}
                </Select>
                <QueryButton
                  disabled={false}
                  type="Query"
                  text={formatMessage({ id: 'insuranceForshipowner.insuranceList.search' })}
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
            //底部分页显示并请求处理
            pagination={{
              showQuickJumper: true,
              pageSize: this.state.pageSize,
              current: this.state.currentPage,
              total: this.state.total,
              onChange: this.paginationChangePage,
              showTotal: () => (
                <div>
                  <FormattedMessage id="insuranceForshipowner.insuranceList.total" />{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  <FormattedMessage id="insuranceForshipowner.insuranceList.pages" />
                  {this.state.pageSize}
                  <FormattedMessage id="insuranceForshipowner.insuranceList.records" />
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
