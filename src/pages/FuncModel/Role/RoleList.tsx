import getRequest, { deleteRequest } from '@/utils/request';
import { Col, Form, Input, Modal, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { RoleModel } from './RoleModel';
import moment from 'moment';
const InputGroup = Input.Group;
const { confirm } = Modal;
const columns: ColumnProps<RoleModel>[] = [
  {
    title: '序号',
    dataIndex: 'rolesIndex',
    align: 'center',
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    align: 'center',
  },
  {
    title: '创建人',
    dataIndex: 'creater',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    align: 'center',
  },
];

class RoleListForm extends React.Component<RouteComponentProps> {
  state = {
    //列
    columns: columns,
    //表数据
    dataSource: [],
    //角色ID
    id: '',
    //角色名称
    roleName: '',
    creater: '',
    createDate: '',
    currentPage: 1, //当前页数
    pageSize: 10,
    total:0,
  };

  //初期华事件
  componentDidMount() {
    this.initData();
  }

  //模拟数据
  initData() {
    if (this.state.columns.length === 4) {
      this.state.columns.push({
        title: '操作',
        dataIndex: 'guid',
        align: 'center',
        width: '16%',
        render: (guid: any) => (
          <span>
            <QueryButton
              text="查看"
              type="View"
              event={() => this.handleView(guid)}
              disabled={false}
            />
          {/*  &nbsp;
            <QueryButton
              text="删除"
              type="Delete"
              disabled={guid.deleteFlag==='1'}
              event={() => this.handleDelete(guid.id, guid.rolesIndex, this.props)}
            />*/}
          </span>
        ),
      });
    }
    this.getRoleList();
  }

  convertTime=(time:string)=>{
    let arr= time.split('-');
    return arr[0]+'/'+arr[1]+'/'+arr[2].substr(0,2);
  };

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getRoleList();
   }
  }

  //获取表格数据
  getRoleList() {
    const data_Source: RoleModel[] = [];
    let param: Map<string, any> = new Map();
    // 初期化固定是PC账号密码登录
    param.set('type', '1');
    param.set('pageSize', this.state.pageSize);
    param.set('currentPage',this.state.currentPage);
    param.set('roleName',this.state.roleName?this.state.roleName:'');
    param.set('data',moment());
    getRequest('/sys/role/', param, (response: any) => {
      if (response.status === 200) {
        if (!isNil(response.data)) {
          forEach(response.data.roles, (role, index) => {
            const entity: RoleModel = {};
            //序号修改
            role.rolesIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.rolesIndex = role.rolesIndex;
            entity.id = role.id;
            entity.roleName = role.roleName;
            entity.creater = role.creater;
            entity.createDate = this.convertTime(role.createDate);
            entity.type = role.type;
            entity.status = role.status;
            entity.updateDate =this.convertTime(role.updateDate);
            entity.updater = role.updater;
            entity.deleteFlag = role.deleteFlag;
            entity.guid = role;
            data_Source.push(entity);
          });
        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
          currentPage: response.data.currentPage,
        });
      }
    });
  }

  //修改当前页码
  // changePage = (page: any) => {
  //   this.setState(
  //     {
  //       currentPage: page,
  //     },
  //     () => {
  //       this.initData();
  //     },
  //   );
  // };

  //检索事件
  search() {
    this.getRoleList();
  }


  handleDelete = (e: any, rolesIndex: any, props: any) => {
    const entity: RoleModel = this.state.dataSource[rolesIndex - 1];
    const deleteMessage = '是否对 序号：' + entity.rolesIndex + ' 角色名称: ' + entity.roleName + ' 的信息进行删除？';
    confirm({
      title: deleteMessage,
      okText: '确定',
      cancelText: '取消',
      onOk() {
         let requestParam: Map<string, string>=new Map();
          requestParam.set('type','1'),
        deleteRequest('/sys/role/' + e, requestParam, (response: any) => {
          if (response.status === 200) {
            console.log('OK');
            props.history.push('/rolemanage');
          }
        });
      },
    });
  };

  handleView = (guid: any) => {
    this.props.history.push('/rolemanage/view/' + guid.guid);
  };


  //渲染页面组件
  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="角色管理" displayNone={true} event={() => { }} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact>
                <Input
                  style={{ width: '95%' }}
                  placeholder="请输入角色名称搜索内容"
                  onChange={e => this.setState({ roleName: e.target.value })}
                  onKeyUp={this.keyUp}
                />
                <QueryButton
                  type="Query"
                  text="查询"
                  event={this.search.bind(this)}
                  disabled={false}
                />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table} >
          <Table
            bordered
            columns={this.state.columns}
            size="small"
            dataSource={this.state.dataSource}
            rowClassName={(record, index) =>
              index % 2 == 0 ? commonCss.dataRowOdd : commonCss.dataRowEven
            }
            pagination={false}
        /*    pagination={{
              current: this.state.currentPage,
              showQuickJumper: true,
              pageSize: this.state.pageSize,
              onChange: this.changePage,
              total:this.state.total,
              showTotal: () => (
                <div>
                  总共{' '}
                  {this.state.total % this.state.pageSize == 0
                    ? Math.floor(this.state.total/ this.state.pageSize)
                    : Math.floor(this.state.total / this.state.pageSize) + 1}{' '}
                  页记录,每页显示
                  {this.state.pageSize}条记录

                </div>
              ),
            }}*/
          />
          <div style={{height:40}}/>
        </div>
      </div>
    );
  }
}

const RoleList_Form = Form.create({ name: 'Role_List_Form' })(RoleListForm);

export default RoleList_Form;
