import LabelTitleComponent from '@/pages/Common/Components/LabelTitleComponent';
import getRequest from '@/utils/request';
import { items } from '@/utils/utils';
import { Col, Form, Input, Row, Select } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { ManagementModel } from './ManagementModel';

const InputGroup = Input.Group;
const columns: ColumnProps<ManagementModel>[] = [
  {
    title: '序号',
    dataIndex: 'goodsIndex',
    align: 'center',
  },
  {
    title: '保险公司',
    dataIndex: 'companyNameCn',
    align: 'center',
  },
  {
    title: '费率',
    dataIndex: 'rate',
    align: 'center',
  },
  {
    title: '联系人',
    dataIndex: 'contactPerson',
    align: 'center',
  },
  {
    title: '联系方式',
    dataIndex: 'contactNumber',
    align: 'center',
  },
  {
    title: '保险公司地址',
    dataIndex: 'companyAddress',
    align: 'center',
  },
];

//页面列表组件
class InsuranceManagementListForm extends React.Component<RouteComponentProps> {
  state = {
    columns: columns,
    dataSource: [],
    companyNameCn: '',
    selectcompanyNameCn: '',
    currentPage: 1,
    pageSize: 10,
    total: 0,
    companyNamedata: [],
    flag: false,
  };


  componentDidMount() {
    this.initData();
  }

  //初始化数据
  initData() {
    this.getInsuranceManagementList();
  }

  //准备参数
  setParams(selectcompanyNameCn: string): Map<string, string> {
    let params: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');
    params.set('pageSize', '10');
    params.set(
      'currentPage',
      isNil(this.state) || isNil(this.state.currentPage) ? 1 : this.state.currentPage,
    );
    if (!isNil(selectcompanyNameCn) && selectcompanyNameCn != '') {
      params.set('companyNameCn', selectcompanyNameCn);
    }
    return params;
  }

  //获取列表数据
  getInsuranceManagementList() {
    let companyItem: items[] = [];
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
        this.setState({ companyNamedata: companyItem });
      }
    });
    const data_Source: ManagementModel[] = [];
    //调用mock
    let param = this.setParams(this.state.selectcompanyNameCn);
    getRequest('/sys/insuranceCompany', param, (response: any) => {
      if (!isNil(response.data)) {
        //循环赋值给table数据对象insuranceSource
        forEach(response.data.insuranceCompanys, (insuranceCompany, index) => {
          const entity: ManagementModel = {};

          entity.goodsIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
          entity.guid = insuranceCompany.guid;
          entity.companyNameCn = insuranceCompany.companyNameCn;
          entity.companyCode = insuranceCompany.companyCode;
          entity.contactPerson = insuranceCompany.contacter;
          entity.contactNumber = insuranceCompany.contactPhone;
          entity.companyAddress = insuranceCompany.address;
          entity.rate = insuranceCompany.rate;
          data_Source.push(entity);
        });
        this.setState({
          total: response.data.total,
          currentPage: response.data.currentPage,
          dataSource: data_Source,
        });
      }
    });
  }

  //页码选择
  pagesizechange = (page: any) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.getInsuranceManagementList();
      },
    );
  };

  onBack = () => {
    this.props.history.push('/index_menu');
  };
  //搜索操作
  search() {
    this.setState({
      currentPage: 1,
    }, () => {
      this.getInsuranceManagementList();
    });
  }

  render() {
    const companyItem =
      isNil(this.state) || isNil(this.state.companyNamedata) ? [] : this.state.companyNamedata;
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="保险管理"
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
                  style={{ width: '95%' }}
                  placeholder="请选择保险公司名称搜索"
                  onChange={(value: any) => this.setState({ selectcompanyNameCn: value })}
                  allowClear
                >
                  {companyItem.map((item: any) => (
                    <Select.Option value={item.textValue}>{item.textValue}</Select.Option>
                  ))}
                </Select>
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
            // rowKey={record => (!isNil(record.guid) ? record.guid : '')}
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
              onChange: this.pagesizechange,
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
const InsuranceList_Form = Form.create({ name: 'Insurance_List_Form' })(
  InsuranceManagementListForm,
);

export default InsuranceList_Form;
