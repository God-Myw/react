import { deleteRequest, getRequest } from '@/utils/request';
import { Col, Input, message, Modal, Row, Table } from 'antd';
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
const InputGroup = Input.Group;
const { confirm } = Modal;

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
      width:'45%'
    },
    {
      title: <FormattedMessage id="Emergency-EmergencyList.date" />,
      dataIndex: 'createDate',
      align: 'center',
      width:'15%'
    },
    {
      title: <FormattedMessage id="Emergency-EmergencyList.state" />,
      dataIndex: 'state',
      align: 'center',
      width:'8%'
    },
    {
      title: formatMessage({ id: 'Emergency-EmergencyList.operate' }),
      dataIndex: 'guid',
      align: 'center',
      width: '16%',
      render: (guid: any) => (
        <span>
          <QueryButton
            text={formatMessage({ id: 'Emergency-EmergencyList.alter' })}
            type="Edit"
            event={() => this.handleEdit(guid.guid)}
            disabled={guid.state === 1}
          />
          &nbsp;
          <QueryButton text={formatMessage({ id: 'Emergency-EmergencyList.view' })} type="View" event={() => this.handleView(guid.guid)} disabled={false} />
          &nbsp;
          <QueryButton
            text={formatMessage({ id: 'Emergency-EmergencyList.delete' })}
            type="Delete"
            event={() => this.handleDelete(guid.guid, guid.requestIndex)}
            disabled={guid.state === 1}
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
    //紧急需求内容
    requestContent: '',
    //每页显示10条
    pageSize: 10,
    //当前页码
    currentPage: 1,
    // 总件数
    total: 0,
  };

  //初期化事件
  componentDidMount() {
    this.setState({
      //列
      columns: this.columns,
    })
    this.getEmergencyList();
  }

  search() {
    this.setState({
      currentPage: 1,
    }, () => {
      this.getEmergencyList();
    });
  }

  //准备参数
  setParams = (): Map<string, string> => {
    let params: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    params.set('type', '1');

    if (!isNil(this.state.requestContent) && this.state.requestContent !== '') {
      params.set('requestContent', this.state.requestContent);
    }
    return params;
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getEmergencyList();
   }
  }

  //获取表格数据
  getEmergencyList = () => {
    const data_Source: EmergencyModel[] = [];
    let param: Map<string, string> = new Map();

    // 初期化固定是PC账号密码登录
    param.set('type', '1');
    param.set('requestContent', this.state.requestContent);
    param.set('date',moment().format("YYYY-MM-DD HH:mm:ss"));

    getRequest('/business/emergency/', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.emergencys, (emergency, index) => {
            const entity: EmergencyModel = {};
            emergency.requestIndex = index +  (this.state.currentPage - 1) * this.state.pageSize + 1
            entity.requestIndex = emergency.requestIndex;
            assign(entity, emergency);
            entity.createDate = String(moment(Number(emergency.createDate)).format('YYYY-MM-DD HH:mm:ss'));
            entity.state = String(emergency.state) === '0' ? formatMessage({ id: 'Emergency-EmergencyList.unpublish' }) : formatMessage({ id: 'Emergency-EmergencyList.publish' });
            entity.guid = emergency;
            data_Source.push(entity);
          });
          this.setState({
            total: response.data.total,
            dataSource: data_Source,
          });
        }
      }
    }, {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    });
  }

  //修改当前页码
  changePage = (page: any) => {
    this.setState({
      currentPage: page,
    }, () => {
      this.getEmergencyList();
    });
  };
  //跳转到紧急需求新增
  handAddPallet = () => {
    const userType = localStorage.getItem('userType');
    if (userType === '5') {
      this.props.history.push('/emergencyowner/add');
    } else if (userType === '4') {
      this.props.history.push('/emergency/add');
    } else {
      this.props.history.push('/checkemergency/add/');
    }

  };
  //根据uid跳到编辑页面
  handleEdit = (guid: any) => {
    const userType = localStorage.getItem('userType');
    if (userType === '5') {
      this.props.history.push('/emergencyowner/edit/' + guid);
    } else if (userType === '4') {
      this.props.history.push('/emergency/edit/' + guid);
    } else {
      this.props.history.push('/checkemergency/edit/' + guid);
    }

  };
  //删除当前这条数据
  handleDelete = (e: any, requestIndex: any) => {
    const get = this;
    const entity: EmergencyModel = this.state.dataSource[requestIndex - 1];
    const deleteMessage = formatMessage({ id: 'Myship-MyshipList.delete.confirmstart' })
      + ' ' + formatMessage({ id: 'Emergency-EmergencyList.code' }) + ':' + entity.requestIndex
      + ' ' + formatMessage({ id: 'Emergency-EmergencyAdd.emergencyTitle' }) + ':' + entity.requestTitle
      + ' ' + formatMessage({ id: 'Myship-MyshipList.delete.confirmend' });
    confirm({
      title: deleteMessage,
      okText: formatMessage({ id: 'Emergency-EmergencyList.confirm' }),
      cancelText: formatMessage({ id: 'Emergency-EmergencyList.cancel' }),
      onOk() {
        let requestParam: Map<string, string> = new Map();
        requestParam.set('type', '1'),
          deleteRequest('/business/emergency/' + e, requestParam, (response: any) => {
            if (response.status === 200) {
              get.getEmergencyList();
              message.success(formatMessage({ id: 'Emergency-EmergencyList.successfulDelete' }), 2);
            } else {
              message.error(formatMessage({ id: 'Emergency-EmergencyList.failDelete' }), 2);
            }
          });
      },
    });
  };
  //进入紧急需求详情画面
  handleView = (guid: any) => {
    const userType = localStorage.getItem('userType');
    if (userType === '5') {
      this.props.history.push('/emergencyowner/view/' + guid);
    } else if (userType === '4') {
      this.props.history.push('/emergency/view/' + guid);
    } else {
      this.props.history.push('/checkemergency/view/' + guid);
    }

  };

  render() {
    const { dataSource } = this.state;
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={formatMessage({ id: 'Emergency-EmergencyList.emergency' })} event={() => {
          this.props.history.push('/index_menu/');
        }} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '90%' }}
                  placeholder={formatMessage({ id: 'Emergency-EmergencyList.enter-emergency-search' })}
                  onChange={e => this.setState({ requestContent: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <QueryButton type="Query" text={formatMessage({ id: 'Emergency-EmergencyList.search' })} event={() => { this.search() }} disabled={false} />
                <QueryButton type="Add" text="" event={this.handAddPallet} disabled={false} />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Table
            rowKey={record => (!isNil(record.guid.guid) ? record.guid.guid : '1')}
            bordered
            columns={this.state.columns}
            size="small"
            dataSource={dataSource}
            rowClassName={(record, index) =>
              index % 2 == 0 ? commonCss.dataRowOdd : commonCss.dataRowEven
            }
            pagination={{
              showQuickJumper: true,
              current: this.state.currentPage,
              pageSize: this.state.pageSize,
              total: this.state.total,
              onChange: this.changePage,
              showTotal: () => (
                <div>
                  <FormattedMessage id="Emergency-EmergencyList.total" />{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total / this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  <FormattedMessage id="Emergency-EmergencyList.pages" />
                  {this.state.pageSize}<FormattedMessage id="Emergency-EmergencyList.records" />
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  }
}
export default EmergencyListForm;
