import getRequest from '@/utils/request';
import { Button, Col, Form, Input, Row, Table, Select, } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { UserModel } from './MPumd';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import moment from 'moment';
import axios from 'axios'
import { response } from 'express';
const InputGroup = Input.Group;
const data_Source: UserModel[] = [];
const CPT:UserModel[] = [];
// const { Option, OptGroup } = Select;

class MPList extends React.Component<RouteComponentProps & { location: { query: any } }> {
  private columns: ColumnProps<UserModel>[] = [
    {
      title: '序号',
      dataIndex: 'usersIndex',
      align: 'center',
      width: '5%',
    },
    {
      title: '推送标题',
      dataIndex: 'companyType',
      align: 'center',
      width: '20%',
    },
    {
      title: '推送内容',
      dataIndex: 'companyName',
      align: 'center',
      width: '30%',
    },
    {
      title: '用户名',
      dataIndex: 'setMealType',
      align: 'center',
      width: '13%',
    },
    {
      title: '用户类型',
      dataIndex: 'orderPrice',
      align: 'center',
      width: '10%',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '11%',
      render: (guid: any) => (
        <span>
          <QueryButton text='查看' type="View" event={() => this.handleView(guid)} disabled={false} />
        </span>
      ),
    },
  ];

  state = {
    columns: this.columns,
    dataSource: data_Source,
    cpt: [  '管理员',
            '线上客服',
            '线下客服',
            '审核客服',
            '货主',
            '船东',
            '服务商'],
    title:'',
    orderLevel: '',
    companyType: '',
    companyName: '',
    payStatus: '',
    buttonA: true,
    buttonB: false,
    buttonC: false,
    adsStatus: '0',
    currentPage: 1,
    pageSize: 10,
    total: 0,
    status: '0',
    method: '3',
    userType:''
  };

  //未审核界面
  componentDidMount() {
    if (this.props.match.params.status === '1') {
      this.selectC();
    } else {
      this.selectA();
    }
  };

  //模拟数据
  initData() {
    this.getsource();
    // this.getcompanyType();
  }

  //键盘监听
  keyUp: any = (e:any) => {
    if (e.keyCode === 13) {
      this.getsource();
   }
  }

  getsource() {
    const data_Source: UserModel[] = [];
    let param: Map<string, string> = new Map();
    param.set('type', '1');

    param.set('companyName', this.state.companyName ? this.state.companyName : '');
    param.set('payStatus', this.state.payStatus ? this.state.payStatus : '');

    param.set('companyType', this.state.companyType ? this.state.companyType : '');

    param.set('orderLevel', this.state.orderLevel ? this.state.orderLevel : '');

    param.set('title', this.state.title ? this.state.title : '')
    param.set('method', this.state.method);
    param.set('status', this.state.status);

    param.set('adsStatus', this.state.adsStatus);
    param.set('currentPage', this.state.currentPage.toString());
    param.set('pageSize', this.state.pageSize.toString());

    param.set('userName',  this.state.userName ? this.state.userName : '');

    param.set('userType', this.state.userType ? this.state.userType == '管理员'? 0 :  this.state.userType == '线上客服'? 1 :  this.state.userType == '线下客服'? 2 : this.state.userType == '审核客服'? 3 : this.state.userType == '货主'? 4 :  this.state.userType == '船东'? 5 :  this.state.userType == '服务商'? 6 : '': '');
    //param.set('date',moment().format('YYYY-MM-DD HH:mm:ss'));
    // 认证资料一览
    // /business/adsDictionary/getAdsDictionaryList/2
    getRequest('/sys/chat/message/getManualMessage', param, (response: any) => {

      console.log(response)
      // console.log(response.data.total)
      if (response.status === 200) {
        // console.log(response.data.records)
        // // console.log(index);
        //     console.log(this.state.currentPage)
        //     console.log(this.state.pageSize)
        if (!isNil(response)) {
          forEach(response.data.records, (userDataCheck, index) => {
            console.log(userDataCheck)

            const entity: UserModel = {};
            entity.usersIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.key = index + 1;
            entity.companyName = userDataCheck.content;
            entity.payStatus = userDataCheck.pay_status == 0?'未支付':'已支付' ;
            entity.companyType = userDataCheck.title;

            entity.total = response.data.total;
            entity.guid = userDataCheck.guid;
            entity.currentPage = response.data.current;
            data_Source.push(entity);

            entity.orderPrice = userDataCheck.user_type ;//用户类型

            let OP = userDataCheck.user_type?userDataCheck.user_type:'' ;
            entity.orderPrice = OP ? OP == 0?'管理员' : OP == 1 ? '线上客服' : OP == 2 ? ' 线下客服' : OP == 3 ? '审核客服' : OP == 4 ? '货主' : OP == 5 ? '船东' : OP == 6 ? '服务商':'' : '' ;
            // console.log(entity.payStatus)
            // entity.companyType = userDataCheck.company_type;
            entity.setMealType = userDataCheck.account_id;

            // console.log(userDataCheck.usertype)end
            // entity.faxNumber = userDataCheck.faxNumber;
            // entity.bankType = userDataCheck.bankType;
            // entity.bankNumber = userDataCheck.bankNumber;
            // entity.userId = userDataCheck.userId;
            // console.log(response.data.current)
          });

        }
        this.setState({
          dataSource: data_Source,
          total: response.data.total,
          currentPage: response.data.current,
        });
        // console.log(this.state.currentPage)
        console.log(this.state.cpt)

      }
    });
  }

  //请求companyType（服务商类型）的数据

  // getcompanyType(){
  //   let param: Map<string, string> = new Map();
  //   param.set('type', '1');
  //   getRequest('/business/adsDictionary/getAdsDictionaryList/3' , param , (response: any) => {
  //     // console.log(response.data)
  //     let CPT = response.data
  //     // console.log(CPT)
  //     this.setState({
  //       cpt:CPT
  //     })
  //     // console.log(this.state.cpt)
  //     // this.state.cpt.map((item:any)=>(
  //     //   console.log(item.adsType)
  //     // ))
  //   });
  // }
  //修改当前页码
  changePage = (page: any) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.initData();
      },
    );
  };


  //切换状态未审核
  selectA = () => {
    this.setState(
      {
        buttonA: true,
        buttonB: false,
        buttonC: false,
        status: '0',
        currentPage: 1,
        method: '3',
      },
      () => {
        this.initData();
      },
    );
  };



  //切换状态已通过
  selectC = () => {
    this.setState(
      {
        buttonA: false,
        buttonB: false,
        buttonC: true,
        adsStatus: '1',
        status:'1',
        currentPage: 1,
        method: '7',
      },
      () => {
        this.initData();
      },
    );
  };

  //按公司查询信息
  findAll = () => {
    this.setState({
      currentPage: 1,
    }, () => {
      this.initData();
    });
  };


  //按照服务商类型查询信息
  selectChange = (value: string) => {
    this.setState({
      userType: value ? value : '',
    });
    console.log(this.state.userType)
  };

  TypesOfServiceProviders = (value: string) => {
    this.setState({
      orderLevel: value ? value : '',
    });
  };

  //查看详情
  handleView = (id: any) => {
    this.props.history.push('/manualMessage/view/'+id );

    console.log(id)
  };


  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="消息推送" event={() => { this.props.history.push('/index_menu'); }} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact >
                <Select
                defaultValue="用户类型" style={{ width: '20%' }} allowClear={true} onChange={this.selectChange}>
                      {
                        (isNil(this.state) || isNil(this.state) || isNil(this.state.cpt)
                        ? ''
                        : this.state.cpt).map(item=>{
                          // console.log(item)
                          return <option value={item}>{item}</option>
                        })
                      }
                      {/* <option value={this.setState.cpt}>{this.setState.cpt}</option> */}
                </Select>

                <Input
                  style={{ width: '33%' }}
                  placeholder="请输入消息推送标题搜索"
                  onChange={e => this.setState({ title: e.target.value })}
                  onKeyUp={this.keyUp}
                />

                <Input
                  style={{ width: '33%' }}
                  placeholder="请输入用户名搜索"
                  onChange={e => this.setState({ userName: e.target.value })}
                  onKeyUp={this.keyUp}
                />

                <QueryButton type="Query"  text="搜索" event={() => this.findAll()} disabled={false} />

                    <span style={{width:'4%'}}></span>

                <QueryButton type="Query" text="新增"  event={() => this.handleView(0)} />

              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
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
              onChange: this.changePage,
              total: this.state.total,
              showTotal: () => (
                <div>
                  总共{' '}
                  {this.state.total % this.state.pageSize == 0? Math.floor(this.state.total / this.state.pageSize): Math.floor(this.state.total / this.state.pageSize) + 1}{' '}页记录,每页显示
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
  MPList,
);

export default MPCertificationList_Form;
