import getRequest from '@/utils/request';
import { Button, Col, Form, Input, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { MessageModel } from './MessageModel';

class MessageList extends React.Component<RouteComponentProps> {

  private columns: ColumnProps<MessageModel>[] = [
    {
      title: '客户',
      dataIndex: 'accountId',
      align: 'center',
      width: '40%',
    },
    {
      title: '客服',
      dataIndex: 'serviceId',
      align: 'center',
      width: '40%',
    },
    {
      title: '操作',
      dataIndex: 'onlineId',
      align: 'center',
      width: '20%',
      render: (text: any, record: MessageModel, onlineId: number) => (
        <span>
          <QueryButton
            text="查看"
            type="View"
            event={() => this.handleView(record.onlineId, record.serviceId ? record.serviceId : '')}
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
    accountId: '',
    serviceId: '',
    currentPage: 1,
    pageSize: 10,
    total: 0,
  };

  //初期华事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    this.getPalletList();
  }

  
//键盘监听
keyUp: any = (e:any) => {
  if (e.keyCode === 13) {
    this.getPalletList();
 }
}

  //分页
  handlerChange = (page: number) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.initData();
      },
    );
  };
  //获取表格数据
  getPalletList() {
    const data_Source: MessageModel[] = [];
    let param: Map<string, string> = new Map();
    // 初期化固定是PC账号密码登录
    param.set('type', '1');
    param.set('accountId', this.state.accountId);
    param.set('serviceId', this.state.serviceId);
    param.set('currentPage', this.state.currentPage.toString());
    param.set('pageSize', this.state.pageSize.toString());
    getRequest('/sys/chat/message/station', param, (response: any) => {
      if (response.status === 200) {
        data_Source.length=0;
        if (!isNil(response.data)) {
          forEach(response.data.messages, (message, index) => {
            const entity: MessageModel = {};
            entity.onlineId = message.onlineId;
            entity.accountId = message.accountId;
            entity.serviceId = message.serviceId;
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          currentPage: response.data.currentPage,
          total: response.data.total,
        });
      }
    });
  }

  //检索事件
  search() {
    this.setState({
      currentPage: 1,
    }, () => {
      this.getPalletList();
    });
  }

  //查看详情
  handleView = (onlineId: any, serviceId: string) => {
    this.props.history.push('/message/detail/' + onlineId + '/' + serviceId);
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <div className={commonCss.container}>
        <div className={commonCss.title}>
          <span className={commonCss.text}>站内消息维护</span>
        </div>
        <div className={commonCss.searchRow}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="客户" >
                  <Input placeholder="请输入客户用户名" style={{ marginLeft: '-8%' }} value={this.state.accountId} onChange={e => this.setState({ accountId: e.target.value })} 
                    onKeyUp={this.keyUp}/>
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item {...formItemLayout} label="客服" >
                  <Input
                    placeholder="请输入客服工号"
                    style={{ marginLeft: '-8%' }}
                    value={this.state.serviceId}
                    onChange={e => this.setState({ serviceId: e.target.value })}
                    onKeyUp={this.keyUp}
                  />
                </Form.Item>
              </Col>
              <Col span={1}>
                <Form.Item {...formItemLayout} style={{ marginLeft: '-70%' }}>
                  <Button type="primary" onClick={this.search.bind(this)} style={{ backgroundColor: '#135A8D', color: '#FFFFFF' }}>搜索</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>

        <div className={commonCss.table} style={{ marginTop: '-2%' }}>
          <Table
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
              total: this.state.total,
              onChange: this.handlerChange,
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

const MessageList_Form = Form.create({ name: 'MessageList_Form' })(MessageList);

export default MessageList_Form;
