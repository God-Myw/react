import { getRequest, putRequest } from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Col, Form, Input, message, Modal, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { assign, forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { EmergencyModel } from './EmergencyModel';

const { confirm } = Modal;
const InputGroup = Input.Group;

class EmergencyListForm extends React.Component<RouteComponentProps> {

  private columns: ColumnProps<EmergencyModel>[] = [
    {
      title: <FormattedMessage id="Emergency-EmergencyList.code" />,
      dataIndex: 'requestIndex',
      align: 'center',
      width:'5%'
    },
    {
      title: <FormattedMessage id="Emergency-EmergencyAdd.emergencyTitle" />,
      dataIndex: 'requestTitle',
      align: 'center',
      ellipsis:true,
      width:'15%'
    },
    {
      title: <FormattedMessage id="Emergency-EmergencyAdd.emergencyDemandContent" />,
      dataIndex: 'requestContent',
      align: 'center',
      ellipsis:true,
      width:'40%'
    },
    {
      title: <FormattedMessage id="Emergency-EmergencyList.date" />,
      dataIndex: 'createDate',
      align: 'center',
      width:'10%'
    },
    {
      title: '用户类型',
      dataIndex: 'userType',
      align: 'center',
      width:'7%'
    },
    {
      title: '关闭状态',
      dataIndex: 'status',
      align: 'center',
      width:'7%',
      render: (text, row, index) => {
        return {
          children: (
            <QueryButton
              text={row.status == 1 ? '已关闭' : '未关闭'}
              type="ChangeStatus"
              event={() => this.handleChangeStatus(row.guid)}
              disabled={row.status == 1}
            />
          ),
        };
      },
    },
    {
      title: formatMessage({ id: 'Emergency-EmergencyList.operate' }),
      dataIndex: 'guid',
      align: 'center',
      width: '10%',
      render: (guid: any) => (
        <span>
          <QueryButton
            text={formatMessage({ id: 'Emergency-EmergencyList.view' })}
            type="View"
            event={() => this.handleView(guid)}
            disabled={false}
          />
        </span>
      ),
    }
  ];

  state = {
    //列
    columns: this.columns,
    //表数据
    dataSource: [],
    //紧急需求内容
    requestContent: '',
    //每页显示10条
    pageSize: 10,
    //当前页码
    currentPage: 1,
    total: 0,
  };

  //初期化事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    this.getEmergencyList();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getEmergencyList();
   }
  }

  //准备参数
  setParams(): Map<string, string> {
    let params: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '2');

    if (!isNil(this.state.requestContent) && this.state.requestContent !== '') {
      params.set('requestContent', this.state.requestContent);
    }
    return params;
  }
  //获取表格数据
  getEmergencyList() {
    const data_Source: EmergencyModel[] = [];
    let param: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    param.set('type', '2');
    param.set('requestContent', this.state.requestContent);
    getRequest(
      '/business/emergency/',
      param,
      (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data)) {
            forEach(response.data.emergencys, (emergency, index) => {
              const entity: EmergencyModel = {};
              entity.requestIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
              assign(entity, emergency);
              entity.createDate = moment(Number(emergency.createDate)).format('YYYY/MM/DD HH:mm:ss');
              entity.userType = getTableEnumText('user_type', emergency.userType);
              entity.state = getTableEnumText('check_status', emergency.state);
              entity.guid = emergency.guid;
              data_Source.push(entity);
            });
          }
          this.setState({
            dataSource: data_Source,
            total: response.data.total,
          });
        }
      },
      {
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
      },
    );
  }

  //检索事件
  search() {
    this.setState({
      currentPage: 1,
    }, () => {
      this.getEmergencyList();
    });
  }

  //关闭状态按钮
  handleChangeStatus(guid: any): void {

    const getData = this.initData.bind(this);
    const _this = this;
    confirm({
      title: '确定要关闭?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let requestData = {};
        requestData = {
          guid: guid,
          status: 1,
        };
        putRequest('/business/emergency/close', JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {
            _this.getEmergencyList();
            message.success('关闭成功!', 3, getData);
          } else {
            message.error('关闭失败!', 3, getData);
          }
        });
      },
    });
  }

  //修改当前页码
  changePage = (page: any) => {
    this.setState({
      currentPage: page,
    },()=>{
      this.getEmergencyList();
    });
 
  };
  //进入紧急需求详情画面
  handleView = (guid: any) => {
    this.props.history.push('/checkemergency/view/' + guid);
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={formatMessage({ id: 'Emergency-EmergencyList.emergency' })}
          event={() => {
            this.props.history.push('/index_menu/');
          }}
        />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '95%' }}
                  placeholder={formatMessage({
                    id: 'Emergency-EmergencyList.enter-emergency-search',
                  })}
                  onChange={e => this.setState({ requestContent: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <QueryButton
                  type="Query"
                  text={formatMessage({ id: 'Emergency-EmergencyList.search' })}
                  event={this.search.bind(this)}
                  disabled={false}
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
              current: this.state.currentPage,
              showQuickJumper: true,
              pageSize: this.state.pageSize,
              onChange: this.changePage,
              total: this.state.total,
              showTotal: () => (
                <div>
                  <FormattedMessage id="Emergency-EmergencyList.total" />{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  <FormattedMessage id="Emergency-EmergencyList.pages" />
                  {this.state.pageSize}
                  <FormattedMessage id="Emergency-EmergencyList.records" />
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}

const EmergencyList_Form = Form.create({ name: 'EmergencyList_Form' })(EmergencyListForm);

export default EmergencyList_Form;
