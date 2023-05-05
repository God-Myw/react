import getRequest from '@/utils/request';
import { RouteComponentProps } from 'dva/router';
import { ColumnProps } from 'antd/lib/table';
import { Col, Input, message, Modal, Row, Select, Form, Table } from 'antd';
import { forEach, isNil, values } from 'lodash';
import { CrewTrainingModel } from './CrewTrainingModel';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';

const InputGroup = Input.Group;
const { confirm } = Modal;
const { Option } = Select;

class CrewTrainingList extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<CrewTrainingModel>[] = [
    {
      title: '序号',
      dataIndex: 'guid',
      align: 'center',
    },
    {
      title: '培训报名意向',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '报名人姓名',
      dataIndex: 'userName',
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      align: 'center',
    },
    {
      title: '报名套餐',
      dataIndex: 'moneyType',
      align: 'center',
      render: (text, record) => {
        return (
          <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
            {text == 1 ? '普通套餐' : '包实习套餐'}
          </span>
        );
      },
    },
    {
      title: '套餐金额（元）',
      dataIndex: '',
      align: 'center',
      render: (text, record: any) => {
        return (
          <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
            {record.moneyType == 1 ? '300' : '1300'}
          </span>
        );
      },
    },
    {
      title: '培训机构',
      dataIndex: 'mechanism',
      align: 'center',
    },
    {
      title: '申请时间',
      dataIndex: 'createDate',
      align: 'center',
      render: (text, data: any) => {
        return (
          <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
            {text.replace('.000+0000', '').replace('T', '  ')}
          </span>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      width: '11%',
      render: (guid: any, data: any) => (
        <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <QueryButton
            text="操作"
            type="View"
            event={() => {
              this.props.history.push('/userCultivate/view/' + data.guid);
            }}
            disabled={false}
          />
          <QueryButton text="取消" type="Delete" event={() => {}} disabled={false} />
        </span>
      ),
    },
  ];
  state = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    columns: [],
    dataSource: [],
  };

  componentDidMount() {
    this.setState({
      columns: this.columns,
    });
    this.initData();
  }
  initData() {
    let params: Map<string, any> = new Map();
    params.set('currentPage', this.state.currentPage);
    params.set('pageSize', this.state.pageSize);
    getRequest('/business/UserCultivate/getUserCultivateList', params, res => {
      if (res.code == '0000') {
        this.setState({
          dataSource: res.data.records,
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
  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="船员培训报名列表"
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '20%' }}
                  placeholder="请输入培训意向标题搜索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                />

                <Input
                  style={{ width: '20%' }}
                  placeholder="报名人姓名搜索"
                  onChange={e => this.setState({ phoneCode: e.target.value })}
                />
                <Input
                  style={{ width: '20%' }}
                  placeholder="联系方式搜索"
                  onChange={e => this.setState({ phoneCode: e.target.value })}
                />
                <Select
                  style={{ width: '15%' }}
                  allowClear={true}
                  placeholder="按培训机构搜索"
                  onChange={(value: any) => this.setState({ orderStatus: value })}
                >
                  <Option value="1">已下单</Option>
                  <Option value="2">进行中</Option>
                </Select>
                <QueryButton
                  type="Query"
                  text="搜索"
                  event={() => this.initData()}
                  disabled={false}
                />
                <span style={{ width: '2%' }}></span>
                <QueryButton
                  type="BatchDelete"
                  text="培训列表"
                  event={() => {
                    this.props.history.push('/userCultivate/Train/list');
                  }}
                  disabled={false}
                />
                <span style={{ width: '2%' }}></span>
                <QueryButton
                  type="BatchDelete"
                  text="+发布培训"
                  event={() => {
                    this.props.history.push('/userCultivate/add');
                  }}
                  disabled={false}
                />
              </InputGroup>
            </Col>
          </Row>
        </div>
        <div className={commonCss.table}>
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

const MPCertificationList_Form = Form.create({ name: 'MPCertificationList_Form' })(
  CrewTrainingList,
);

export default MPCertificationList_Form;
