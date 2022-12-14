import commonCss from '@/pages/Common/css/CommonCss.less';
import { getRequest, putRequest } from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Col, Input, message, Modal, Row, Select, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import QueryButton from '../../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../../Common/Components/LabelTitleComponent';
import { CompanyModel } from './CompanyModel';
import { InsuranceOnLineModel } from './InsuranceOnLineModel';
const InputGroup = Input.Group;
const { confirm } = Modal;

const insuranceSource: InsuranceOnLineModel[] = [];
//页面列表组件
class InsuranceListForm extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<InsuranceOnLineModel>[] = [
    {
      title: '序号',
      dataIndex: 'insuranceIndex',
      align: 'center',
    },
    {
      title: '保险公司',
      dataIndex: 'insuranceCompany',
      align: 'center',
    },
    {
      title: '投保人/投保方名称',
      dataIndex: 'policyHolder',
      align: 'center',
    },
    {
      title: '船舶年龄',
      dataIndex: 'shipAge',
      align: 'center',
    },
    {
      title: '起运时间',
      dataIndex: 'transportStart',
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'contactNumber',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'accountId',
      align: 'center',
    },
    {
      title: '关闭状态',
      dataIndex: 'status',
      align: 'center',
      render: (text, row) => {
        return {
          children: (
            <QueryButton
              text={row.status == '0' ? '未关闭' : '已关闭'}
              type="ChangeStatus"
              event={() => this.handleChangeStatus(row)}
              disabled={row.status != '0'}
            />
          ),
        };
      },
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: number, record: any) => (
        <span>
          <QueryButton
            text="查看"
            type="View"
            event={() => this.handleView(guid, record)}
            disabled={false}
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
    policyHolder: '',
    selectpolicyHolder: '',
    selectcompanyNameCn: '',
    currentPage: 1,
    pageSize: 10,
    total: 0,
    company: [],
    guid: 0,
  };

  componentDidMount() {
    this.getCompany();
    this.initData();
  }

  //初始化数据
  initData() {
    this.getInsuranceList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getInsuranceList();
   }
  }

  //获取保险下拉值
  getCompany() {
    let params: Map<string, any> = new Map();
    const data_Company: CompanyModel[] = [];
    params.set('type', '1');
    params.set('pageSize', '-1');
    params.set('currentPage', '-1');
    params.set('companyNameCn', '');
    getRequest('/sys/insuranceCompany/', params, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.insuranceCompanys, (insuranceCompany, index) => {
            const entity: CompanyModel = {};
            entity.guid = insuranceCompany.guid;
            entity.companyName = insuranceCompany.companyNameCn;
            data_Company.push(entity);
          });
        }
        this.setState({
          company: data_Company,
        });
      }
    });
  }

  //获取保险公司名称
  getCompanyvalue(code: any) {
    let value = code;
    this.state.company.map((item: any) => (value = code == item.guid ? item.companyName : value));
    return value;
  }

  //获取列表数据
  getInsuranceList() {
    const data_Source: InsuranceOnLineModel[] = [];
    //调用mock
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    param.set('policyHolder', this.state.selectpolicyHolder);
    param.set(
      'insuranceCompany',
      isNil(this.state.selectcompanyNameCn) ? '' : this.state.selectcompanyNameCn,
    );
    param.set('currentPage', this.state.currentPage.toString());
    param.set('pageSize', this.state.pageSize.toString());
    getRequest('/business/insurance', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          //循环赋值给table数据对象insuranceSource
          forEach(response.data.insurances, (insurance, index) => {
            const entity: InsuranceOnLineModel = {};
            entity.insuranceIndex = index + 1 + (this.state.currentPage - 1) * this.state.pageSize;
            entity.shipAge = getTableEnumText('ship_age', insurance.shipAge);
            entity.insuranceCompany = this.getCompanyvalue(insurance.insuranceCompany);
            entity.policyHolder = insurance.policyHolder;
            entity.contactNumber = insurance.contactNumber;
            entity.status = insurance.status;
            entity.accountId = insurance.accountId;
            entity.transportStart = String(
              moment(Number(insurance.transportStart)).format('YYYY-MM-DD'),
            );
            entity.guid = insurance.guid;
            entity.userType = insurance.userType;
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

  //返回back
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
        this.initData();
      },
    );
  }

  //获取下拉框
  handleChange(value: any) {
    this.setState({ insuranceCompany: value });
  }

  //查看按钮操作
  handleView = (guid: any, record: any) => {
    if (record.userType == '4') {
      this.props.history.push('/insuranceonline/shipperview/' + guid);
    } else if (record.userType == '5') {
      this.props.history.push('/insuranceonline/shipownerview/' + guid);
    }
  };

  //关闭按钮操作
  handleChangeStatus = (row: any) => {
    let param: Map<string, any> = new Map();
    param.set('status', 1);
    confirm({
      title: '保险需求 序号 ' + row.insuranceIndex + ' 投保人 ' + row.policyHolder + ' ,是否确认关闭？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        putRequest('/business/insurance/close/' + row.guid + '?status=1', '', (response: any) => {
          if (response.status === 200) {
            message.success('关闭成功!', 2);
            this.getInsuranceList();
          } else {
            message.error('关闭失败!', 2);
          }
        });
      },
    });
  };

  //获取当前选中行
  rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  //修改当前页码
  changePage = (page: any) => {
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
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="保险需求"
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
                  placeholder="保险公司选择"
                  onChange={(id: any) => this.setState({ selectcompanyNameCn: id })}
                >
                  {this.state.company.map((item: any) => (
                    <option value={item.guid}>{item.companyName}</option>
                  ))}
                </Select>
                <Input
                  style={{ width: '80%' }}
                  placeholder="请输入投保人或投保方名称"
                  onChange={e => this.setState({ selectpolicyHolder: e.target.value })}
                  onKeyUp={this.keyUp}
                ></Input>
                <QueryButton
                  disabled={false}
                  type="Query"
                  text="搜索"
                  event={this.search.bind(this)}
                />
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

export default InsuranceListForm;
