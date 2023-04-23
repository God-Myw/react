import getRequest from '@/utils/request';
import { RouteComponentProps } from 'dva/router';
import { ColumnProps } from 'antd/lib/table';
import { Col, Input, message, Modal, Row, Select, Form, Table } from 'antd';
import { forEach, isNil, values } from 'lodash';
import moment from 'moment';
import { TrainModel } from './CrewTrainingModel';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import commonCss from '../../Common/css/CommonCss.less';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';

const InputGroup = Input.Group;
const { confirm } = Modal;
const { Option } = Select;

class TrainList extends React.Component<RouteComponentProps> {
  private columns: ColumnProps<TrainModel>[] = [
    {
      title: '序号',
      dataIndex: 'guid',
      align: 'center',
    },
    {
      title: '培训项目标题',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '培训机构',
      dataIndex: 'mechanism',
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'contacter',
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: '报名截止日期',
      dataIndex: 'endDate',
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
      title: '发布时间',
      dataIndex: '',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width: '15%',
      render: (guid: any, data: any) => (
        <span style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
          <QueryButton
            text="查看"
            type="View"
            event={() => {
              this.props.history.push({
                pathname: '/CrewTraining/Train/Edit',
                state: { type: false, guid: data.guid },
              });
            }}
            disabled={false}
          />
          <QueryButton
            text="操作"
            type="Edit"
            event={() => {
              this.props.history.push({
                pathname: '/CrewTraining/Train/Edit',
                state: { type: true, guid: data.guid },
              });
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
  componentDidMount() {
    this.setState({
      //列
      columns: this.columns,
    });
    this.initData();
  }
  initData = () => {
    let params: Map<string, any> = new Map();
    params.set('currentPage', this.state.currentPage);
    params.set('pageSize', this.state.pageSize);
    getRequest('/business/Cultivate/getCultivateList', params, res => {
      if (res.code == '0000') {
        this.setState({
          total: res.data.total || 0,
          dataSource: res.data.records,
        });
      }
    });
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
                  style={{ width: '22%' }}
                  placeholder="请输入培训标题搜索"
                  onChange={e => this.setState({ orderNumber: e.target.value })}
                />
                <Select
                  style={{ width: '22%' }}
                  placeholder="按培训机构搜索"
                  allowClear={true}
                  onChange={(value: any) => this.setState({ orderStatus: value })}
                >
                  <Option value="1">已下单</Option>
                  <Option value="2">进行中</Option>
                  <Option value="3">交易完成</Option>
                </Select>
                <Input
                  style={{ width: '22%' }}
                  placeholder="老师联系方式搜索"
                  onChange={e => this.setState({ phoneCode: e.target.value })}
                />
                <QueryButton
                  type="Query"
                  text="搜索"
                  event={() => this.initData()}
                  disabled={false}
                />
                <span style={{ width: '2%' }}></span>
                <QueryButton
                  type="BatchDelete"
                  text="+发布培训"
                  event={() => {
                    this.props.history.push('/CrewTraining/add');
                  }}
                  disabled={false}
                />
              </InputGroup>
            </Col>
          </Row>
        </div>
        <div className={commonCss.table}>
          <Table
            rowKey={(record: any) => (!isNil(record.guid) ? record.guid.toString() : '')}
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

const MPCertificationList_Form = Form.create({ name: 'MPCertificationList_Form' })(TrainList);

export default MPCertificationList_Form;
