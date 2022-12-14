import getRequest from '@/utils/request';
import { Button, Col, Form, Input, Row, Table, Select, } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { UserModel } from './POumd';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import moment from 'moment';
import axios from 'axios'
import { response } from 'express';
const InputGroup = Input.Group;
const data_Source: UserModel[] = [];
const CPT:UserModel[] = [];
// const { Option, OptGroup } = Select;

class TpaList extends React.Component<RouteComponentProps & { location: { query: any } }> {
  private columns: ColumnProps<UserModel>[] = [
    {
      title: '序号',
      dataIndex: 'usersIndex',
      align: 'center',
      width: '11%',
    },
    {
      title: '服务商类型',
      dataIndex: 'companyType',
      align: 'center',
      width: '12%',
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      align: 'center',
      width: '15%',
    },
    {
      title: '套餐类型',
      dataIndex: 'setMealType',
      align: 'center',
      width: '10%',
    },
    {
      title: '套餐金额',
      dataIndex: 'orderPrice',
      align: 'center',
      width: '10%',
    },
    {
      title: '套餐服务时间',
      dataIndex: 'setMealTime',
      align: 'center',
      width: '18%',
    },
    {
      title: '支付状态',
      dataIndex: 'payStatus',
      align: 'center',
      width: '13%',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      align: 'center',
      width: '12%',
    },
    {
      title: '操作',
      dataIndex: 'guid',
      align: 'center',
      width: '11%',
      render: (guid: any) => (
        <span>
          <QueryButton text='查看' type="View" event={() => this.handleView(guid.id)} disabled={false} />
        </span>
      ),
    },
  ];

  state = {
    columns: this.columns,
    dataSource: data_Source,
    cpt:CPT,

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
    this.getcompanyType();
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


    param.set('method', this.state.method);
    param.set('status', this.state.status);

    param.set('adsStatus', this.state.adsStatus);
    param.set('currentPage', this.state.currentPage.toString());
    param.set('pageSize', this.state.pageSize.toString());
    //param.set('date',moment().format('YYYY-MM-DD HH:mm:ss'));
    // 认证资料一览
    // /business/adsDictionary/getAdsDictionaryList/2
    getRequest('/business/AdsOrder/getAdsOrderList', param, (response: any) => {
      // console.log(response)
      // console.log(response.data.adsOrderList.total)
      if (response.status === 200) {
        // console.log(response.data.adsOrderList.records)
        // // console.log(index);
        //     console.log(this.state.currentPage)
        //     console.log(this.state.pageSize)
        if (!isNil(response.data.adsOrderList.records)) {
          forEach(response.data.adsOrderList.records, (userDataCheck, index) => {
            // console.log(userDataCheck)

            const entity: UserModel = {};
            entity.usersIndex = index + (this.state.currentPage - 1) * this.state.pageSize + 1;
            entity.key = index + 1;
            entity.companyName = userDataCheck.company_name;
            entity.orderPrice = userDataCheck.order_price;
            entity.payStatus = userDataCheck.pay_status == 0?'未支付':'已支付' ;
            entity.companyType = userDataCheck.company_type;
            // console.log(entity.payStatus)
            // entity.companyType = userDataCheck.company_type;
            // entity.setMealType = userDataCheck.order_level;
            if(userDataCheck.order_level === 1){
              entity.setMealType = '免费体验'
            }else if(userDataCheck.order_level === 2){
              entity.setMealType = '基础套餐'
            }else if(userDataCheck.order_level === 3){
              entity.setMealType =  '升级套餐'
            }else if(userDataCheck.order_level === 4){
              entity.setMealType = '白金套餐'
            }else if(userDataCheck.order_level === 5){
              entity.setMealType= '皇冠套餐'
            }else{
            };
            if(userDataCheck.start_date == null || userDataCheck.end_date==null){
              entity.setMealTime = ''
            }else{
              let start = userDataCheck.start_date
              let end = userDataCheck.end_date
              let startdate=new Date(start).getFullYear() + '-' + (new Date(start).getMonth() + 1) + '-' + new Date(start).getDate();
              let enddate=new Date(end).getFullYear() + '-' + (new Date(end).getMonth() + 1) + '-' + new Date(end).getDate();
              entity.setMealTime =  startdate + ' 至 ' + enddate;
            };
            // entity.paymentMethod = userDataCheck.payment_method;
            if(userDataCheck.payment_method === 1){
              entity.paymentMethod = '支付宝'
            }else if(userDataCheck.payment_method === 2){
              entity.paymentMethod = '微信'
            }else if(userDataCheck.payment_method === 3){
              entity.paymentMethod =  '公司转账'
            }else if(userDataCheck.payment_method === 4){
              entity.paymentMethod = '现场支付'
            }else{
            };
            entity.guid = userDataCheck;
            // console.log(userDataCheck.usertype)end
            // entity.faxNumber = userDataCheck.faxNumber;
            // entity.bankType = userDataCheck.bankType;
            // entity.bankNumber = userDataCheck.bankNumber;
            entity.total = response.data.adsOrderList.total;
            // entity.userId = userDataCheck.userId;
            entity.currentPage = response.data.adsOrderList.current;
            // console.log(response.data.current)
            data_Source.push(entity);
          });

        }
        this.setState({
          dataSource: data_Source,
          total: response.data.adsOrderList.total,
          currentPage: response.data.adsOrderList.current,
        });
        // console.log(this.state.currentPage)
        // console.log(this.state.total)
      }
    });
  }

  //请求companyType（服务商类型）的数据

  getcompanyType(){
    let param: Map<string, string> = new Map();
    param.set('type', '1');
    getRequest('/business/adsDictionary/getAdsDictionaryList/3' , param , (response: any) => {
      // console.log(response.data)
      let CPT = response.data
      // console.log(CPT)
      this.setState({
        cpt:CPT
      })
      // console.log(this.state.cpt)
      // this.state.cpt.map((item:any)=>(
      //   console.log(item.adsType)
      // ))
    });


  }
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
      companyType: value ? value : '',
    });
  };
  TypesOfServiceProviders = (value: string) => {
    this.setState({
      orderLevel: value ? value : '',
    });
  };

  //查看详情
  handleView = (id: any) => {
    this.props.history.push('/adsOrder/view/' + id +  '/' + this.state.adsStatus);
    console.log(this.state.adsStatus)
    console.log(this.props.match.params.status)
  };

  render() {
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text="推广订单" event={() => { this.props.history.push('/index_menu'); }} />
        <div className={commonCss.searchRow}>
          <Row gutter={24}>
            <Col span={24}>
              <InputGroup compact >
                <Select
                defaultValue="服务商类型" style={{ width: '20%' }} allowClear={true} onChange={this.selectChange}>
                  {this.state.cpt.map((item: any) => (
                      <option value={item.adsType}>{item.adsType}</option>
                    ))}
                </Select>
                <Select
                defaultValue="套餐类型" style={{ width: '20%' }} allowClear={true} onChange={this.TypesOfServiceProviders}>
                  <Option value="1">免费体验</Option>
                  <Option value="2">基础套餐</Option>
                  <Option value="3">升级套餐</Option>
                  <Option value="4">白金套餐</Option>
                  <Option value="5">皇冠套餐</Option>
                  {/* <Option value="jack">Jack</Option> */}
                </Select>
                {/* <Select
                defaultValue="支付状态" style={{ width: '20%' }} allowClear={true} >
                  {this.state.cpt.map((item: any) => (
                      <option value={item.adsType}>{item.adsType}</option>
                    ))}
                </Select> */}
                <Input
                  style={{ width: '55%' }}
                  placeholder="请输入公司名称搜索"
                  onChange={e => this.setState({ companyName: e.target.value })}
                  onKeyUp={this.keyUp}
                />

                <QueryButton type="Query" text="搜索" event={() => this.findAll()} disabled={false} />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <div className={commonCss.table}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '10.93%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonA ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectA}
                >
                  未审核
                </Button>
              </Form.Item>
              {/* <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '11.93%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonB ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectB}
                >
                  未通过
                </Button>
              </Form.Item> */}
              <Form.Item
                style={{ marginBottom: '-5px', paddingBottom: '0px', width: '12.97%', float: 'left' }}
              >
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: this.state.buttonC ? '#135A8D' : '#003750',
                    color: '#FFFFFF',
                  }}
                  onClick={this.selectC}
                >
                  已通过
                </Button>
              </Form.Item>
            </Col>
          </Row>
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

const TPACertificationList_Form = Form.create({ name: 'TPACertificationList_Form' })(
  TpaList,
);

export default TPACertificationList_Form;
