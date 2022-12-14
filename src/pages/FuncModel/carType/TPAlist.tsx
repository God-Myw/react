import { getRequest, postRequest, putRequest, deleteRequest } from '@/utils/request';
import { Button, Col, Form, Input, Row, Table, Select, Tree, Table, Modal, Radio, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { UserModel } from './TPAumd';
import { getDictDetail, getTableEnumText } from '@/utils/utils';
import moment from 'moment';
import axios from 'axios'
import { response } from 'express';
const InputGroup = Input.Group;
const data_Source: UserModel[] = [];
const CPT: UserModel[] = [];
const { TreeNode } = Tree;
const { Search } = Input;
const { confirm } = Modal;
// const { Option, OptGroup } = Select;


class TpaList extends React.Component<RouteComponentProps & { location: { query: any } }> {
  state = {
    columns: [],
    dataSource: data_Source,
    treeData: [],
    data: [],
    cpt: CPT,
    adsStatus: '0',
    currentPage: 1,
    pageSize: 10,
    total: 0,
    cheorchuan: '',
    visible: false,
    xinzeng: 0,
    selectedRowKeys: [],
    Xvisiable: false,
    danwei:[],
  };

  private columns0: ColumnProps<UserModel>[] = [
    {
      title: '序号',
      dataIndex: 'xuhao',
      // render: text => <a>{text}</a>,
    },
    {
      title: '车种名称',
      dataIndex: 'mingc',
    },
  ];

  private columns1: ColumnProps<UserModel>[] = [
    {
      title: '序号',
      dataIndex: 'name',
      // render: text => <a>{text}</a>,
    },
    {
      title: '规格',
      dataIndex: 'age',
    },
    {
      title: '单位',
      dataIndex: 'dw',
    },
    {
      title: '是否必填',
      dataIndex: 'lens',
    },
    // {
    //   title: '字段长度',
    //   dataIndex: 'address',
    // },
  ];

  private columns2: ColumnProps<UserModel>[] = [
    {
      title: '序号',
      dataIndex: 'name1',
      // render: text => <a>{text}</a>,
    },
    {
      title: '规格',
      dataIndex: 'age1',
    },
    {
      title: '字段属性',
      dataIndex: 'lens1',
    },
    {
      title: '字段长度',
      dataIndex: 'address1',
    },
  ];



  componentDidMount() {
    this.initData()

    this.setState({
      columns: [],

    })
    // this.state.columns = this.columns0
  };

  //模拟数据
  initData() {
    this.getUserList();

  }

  //键盘监听
  keyUp: any = (e: any) => {
    if (e.keyCode === 13) {
      this.getUserList();
    }
  }

  //获取树形数据
  getUserList() {
    let params: Map<string, string> = new Map();
    // const data_Source: UserModel[] = [];
    getRequest('/business/specialVehicle/getSpecialVehicleMain', params, (response: any) => {

      if (response.status === 200) {
        // console.log(response)
        // let shu = response.data
        // shu.children = shu[0]
        // delete shu[0];
        let chezi = response.data[0].carList
        let aabb = JSON.parse(JSON.stringify(chezi).replace(/specialName/g, 'title'))
        let abab = JSON.parse(JSON.stringify(aabb).replace(/specialVehicleTypes/g, 'children'))
        let baba = JSON.parse(JSON.stringify(abab).replace(/specialVehicleType/g, 'title'))
        baba.forEach(tem => {
          // console.log(tem)
          tem.key = '0-0-' + tem.guid;
        })
        // console.log(baba)

        let chuanbo = response.data[0].shiplist
        let ccdd = JSON.parse(JSON.stringify(chuanbo).replace(/specialName/g, 'title'))
        let cdcd = JSON.parse(JSON.stringify(ccdd).replace(/specialVehicleTypes/g, 'children'))
        let dcdc = JSON.parse(JSON.stringify(cdcd).replace(/specialVehicleType/g, 'title'))
        dcdc.forEach(tem => {
          // console.log(tem)
          tem.key = '0-1-' + tem.guid;
        })

        if (this.state.value) {
          if (this.state.value.node.props.dataRef.title == '车') {
            //车
            const data_Source1: CerAdvanceorderModel[] = [];
            forEach(response.data[0].carList, (order, index) => {
              // console.log(order)
              const entity: CerAdvanceorderModel = {};
              entity.xuhao = index + 1;//序号
              entity.mingc = order.specialName;//车种名称
              // entity.lens = order.isNotNull;//示范必填
              entity.guid = order.guid;
              data_Source1.push(entity);
            })
            this.setState({
              columns: this.columns0,
              dataSource: data_Source1,
              // xinzeng:0,
            });
          } else if (this.state.value.node.props.dataRef.title == '船') {
            //船
            const data_Source2: CerAdvanceorderModel[] = [];
            forEach(response.data[0].shiplist, (order, index) => {
              // console.log(order)
              const entity: CerAdvanceorderModel = {};
              entity.xuhao = index + 1;//序号
              entity.mingc = order.specialName;//船种名称
              // entity.lens = order.isNotNull;//示范必填
              entity.guid = order.guid;
              data_Source2.push(entity);
            })
            // this.chuanzhong();
            this.setState({
              columns: this.columns0,
              dataSource: data_Source2,
              // xinzeng:0,
            });
          }
        }


        this.setState({
          treeData: [
            {
              title: '车',
              key: '0-0',
              children: baba
            },
            {
              title: '船',
              key: '0-1',
              children: dcdc
            },
          ],
        })

      }
    });

      const data_Source: CerAdvanceorderModel[] = [];
      let paramss: Map<string, string> = new Map();
      // params.set('guid', e);
      getRequest('/sys/dict/type?type=unit'+'&', paramss, (response: any) => {
        if (response.status === 200) {
          console.log(response.data.zh[0])
          this.setState({
            danwei:response.data.zh[0].items
          })
        }
      })
  }

  renderTreeNodes = data =>
    data.map(item => {
      // console.log(item)
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });


  //规格列表
  guige = (e: any) => {

    const data_Source: CerAdvanceorderModel[] = [];
    let params: Map<string, string> = new Map();
    params.set('guid', e);
    getRequest('/business/specialVehicle/getSpecialVehicleTypeList', params, (response: any) => {
      if (response.status === 200) {
        console.log(response)
        forEach(response.data, (order, index) => {
          // console.log(order)
          const entity: CerAdvanceorderModel = {};
          entity.name = index;//序号
          let aa = order.unitValue == undefined?'':(this.state.danwei.find(item=>{return item.code == order.unitValue}));
          entity.age = order.specialVehicleType ;//规格
          entity.dw = aa.textValue
          entity.lens =  order.isNotNull == 1 ? '是' : '否' ;//示范必填
          entity.guid = order.guid;
          data_Source.push(entity);
        })
      }
      this.setState({
        dataSource: data_Source,
      });
    })

    // console.log(this.state.dataSource)
  }

  // chuanguige = ()=>{
  //   let cc = [];
  //   for (let i = 0; i < 6; i++) {
  //     cc.push({
  //       key: i,
  //       name1: `Edward King ${i}`,
  //       age1: 32,
  //       lens1:'船',
  //       address1: `London, Park Lane no. ${i}`,
  //     });
  //   }
  //   this.setState({
  //     data : cc,
  //   });
  // }





  //树形选择
  onSelect = (selectedKeys, value) => {
    // console.log( selectedKeys,);
    console.log( value.node.props,);
    console.log(value.node.props.eventKey.split('-').length == 4);

    this.setState({
      dataSource: [],
      selectedKeys: selectedKeys,
      value: value,
    })
    if (value.node.props.dataRef != undefined) {
      // console.log(1235655555)
      if (value.node.props.dataRef.title == '车') {
        const data_Source1: CerAdvanceorderModel[] = [];
        forEach(value.node.props.dataRef.children, (order, index) => {
          // console.log(order)
          const entity: CerAdvanceorderModel = {};
          entity.xuhao = index + 1;//序号
          entity.mingc = order.title;//车种名称
          // entity.lens = order.isNotNull;//示范必填
          entity.guid = order.guid;
          data_Source1.push(entity);
        })
        this.setState({
          columns: this.columns0,
          dataSource: data_Source1,
          xinzeng: 0,
        });
        // this.chezhong()
      } else if (value.node.props.dataRef.title == '船') {
        // console.log(5555555555555555555555555555)
        const data_Source2: CerAdvanceorderModel[] = [];
        forEach(value.node.props.dataRef.children, (order, index) => {
          console.log(order)
          const entity: CerAdvanceorderModel = {};
          entity.xuhao = index;//序号
          entity.mingc = order.title;//船种名称
          // entity.lens = order.isNotNull;//示范必填
          entity.guid = order.guid;
          data_Source2.push(entity);
        })
        // this.chuanzhong();
        this.setState({
          columns: this.columns0,
          dataSource: data_Source2,
          xinzeng: 0,
        });
      }

      if (value.node.props.dataRef.key.split('-').length - 1 == 2) {
        // console.log('两个横线')
        this.guige(value.node.props.dataRef.guid)
        this.setState({
          columns: this.columns1,
          guid: value.node.props.dataRef.guid,
          xinzeng: 1,
        });
      } else {
        // console.log('没有横线')
      }
    }else if ( value.node.props.eventKey.split('-').length == 4 ){
      this.setState({
        xinzeng: 3,
      });
    }
    // console.log(value.node.props.dataRef.key.split('-').length-1)
    // value.node.props.dataRef.key.split('-').length-1 == 1
    this.setState({
      selectedRowKeys: [],
    })
  };


  // //列表配置
  onSelectChange = (selectedRowKeys, value) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    // guid 二层id
    let guid = []
    value.forEach((order, index) => {
      guid.push(order.guid);
    });
    this.setState({
      selectedRowKeys,
      guidd: guid,
    });
    // console.log(this.state.guidd)
  };
  // rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //   },
  //   getCheckboxProps: record => ({
  //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
  //     name: record.name,
  //   }),
  // };

  //删除
  shanchu = () => {
    let guid = this.state.guidd;
    const get = this;
    console.log(guid)
    if(guid == undefined || guid.length==0){
      message.error('没数据禁止删除');
    }else{
      confirm({
        title: '确定是否要删除？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          if (get.state.xinzeng == 0) {
            let requestParam: Map<string, string> = new Map();
            requestParam.set('guid', guid),
              deleteRequest('/business/specialVehicle/deleteSpecialVehicle', requestParam, (response: any) => {
                if (response.status === 200) {
                  // get.getEmergencyList();
                  get.initData();
                  // get.guige(get.state.guid);
                  // get.onSelect();
                  // get.onSelect(get.state.selectedKeys , get.state.value);
                  // location.reload();
                  message.success('删除成功');
                  get.setState({
                    selectedRowKeys: [],
                    guidd: [],
                  })
                } else {
                  message.error('删除失败');
                  get.setState({
                    selectedRowKeys: [],
                    guidd: [],
                  })
                }
              });
          } else if (get.state.xinzeng == 1) {
            let requestParam: Map<string, string> = new Map();
            requestParam.set('guid', guid),
              deleteRequest('/business/specialVehicle/deleteSpecialVehicleType', requestParam, (response: any) => {
                if (response.status === 200) {
                  // get.getEmergencyList();
                  get.initData();
                  get.guige(get.state.guid);
                  get.setState({
                    selectedRowKeys: [],
                    guidd: [],
                  })
                  message.success('删除成功');
                } else {
                  get.setState({
                    selectedRowKeys: [],
                    guidd: [],
                  })
                  message.error('删除失败');
                }
              });
          }
        }
      })
    }

  }

  //弹窗
  showModal = () => {
    this.setState({
      visible: true,
    });

    // console.log(this.state.xinzeng)
  };
  //选单位
  selectChange = (value: string) => {
    this.setState({
      userType: value ? value : '',
    });
    console.log(value)
  };

  handleOk = e => {
    // console.log(e);


    if (this.state.xinzeng == 0) {
      let requestData = {};
      let cheorchuan = this.state.cheorchuan;
      let mingcheng = this.state.mingcheng;

      requestData = [{
        specialType: cheorchuan * 1,
        specialName: mingcheng,
      }]
      if(cheorchuan && mingcheng){
        postRequest('/business/specialVehicle/addSpecialVehicle', JSON.stringify(requestData), (response: any) => {
          if (response.status === 200) {

            message.success('提交成功');
            this.initData()
            // location.reload();
            this.setState({
              visible: false,
            });
          } else {
            message.error(response.message);
          }
        });
      }else{
        message.error('请填写完整');
      }
    } else if (this.state.xinzeng == 1) {
      let requestData = {};
      let specialVehicleId = this.state.guid;
      let specialVehicleType = this.state.specialVehicleType;
      let isNotNull = this.state.isNotNull;
      let unitValue = this.state.userType * 1 ;

      console.log(unitValue?unitValue:unitValue)

      requestData = [{
        specialVehicleId: specialVehicleId,
        specialVehicleType: specialVehicleType,
        isNotNull: isNotNull,
        unitValue: unitValue * 1,
      }]
      if((unitValue>=0) && specialVehicleType &&isNotNull){
        postRequest('/business/specialVehicle/addSpecialVehicleType', requestData, (response: any) => {
          if (response.status === 200) {

            message.success('提交成功');
            this.initData();
            this.guige(this.state.guid);
            this.setState({
              visible: false,
            });
          } else {
            message.error(response.message);
          }
        });
      }else{
        message.error('请填写完整');
      }
    }
  };

  handleCancel = e => {
    // console.log(e)
    this.setState({
      visible: false,
    });
  };



  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={commonCss.container}>

        <LabelTitleComponent text="特种车管理" event={() => { this.props.history.push('/index_menu'); }} />
        <div className={commonCss.searchRow}>
          <div style={{ width: '100%', height: '350px', display: 'flex' }}>
            <div style={{ width: '15%', height: '330px', borderRight: '1px solid #404040', overflow: 'auto' }}>
              <Tree
                // loadData={this.onLoadData}
                onSelect={this.onSelect}
                // blockNode={true}
                onExpand={this.onSelect}
                defaultExpandParent={true}
              >
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>
            </div>
            {
                this.state.xinzeng==3?(null):(
                <div style={{ width: '40%', height: '330px', marginLeft: '20px' }}>
                    <div style={{ width: '100%' }}>
                      <Button style={{ marginLeft: '10px', marginRight: '10px', backgroundColor: '#57B5E3', color: '#FFFFFF' }} onClick={this.showModal} >
                        {this.state.xinzeng == 1 ? '新增规格' : '新增车种'}
                      </Button>
                      <Button style={{ marginRight: '10px', backgroundColor: '#FB3838', color: '#FFFFFF' }} onClick={this.shanchu} >
                        删除
                      </Button>
                    </div>
                  <Table
                    rowSelection={rowSelection}
                    columns={this.state.columns}
                    dataSource={this.state.dataSource}
                    pagination={false}
                    bordered
                    // pagination={{ pageSize: 50 }}
                    scroll={{ y: 240 }}
                  />
              </div>
            )}
          </div>
        </div>
        <Modal
          title={this.state.xinzeng == 1 ? '新增规格' : '新增车种'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>

            {
              this.state.xinzeng == 1 ? (
                <div>
                  <div >
                    <h2>
                      是否必填
                    </h2>
                    <Radio.Group buttonStyle="solid" onChange={e => this.setState({ isNotNull: e.target.value })}>
                      <Radio.Button value="1" style={{ marginRight: '20px' }}>是</Radio.Button>
                      <Radio.Button value="0">否</Radio.Button>
                    </Radio.Group>
                  </div>
                  <div style={{ marginTop: '50px' }}>
                    <Input style={{width:'70%'}} placeholder=" 请输入规格 " onChange={e => this.setState({ specialVehicleType: e.target.value })} />
                    <Select
                      defaultValue="单位" style={{ width: '30%' }} allowClear={true} onChange={this.selectChange}>
                        {this.state.danwei.map((item: any) => (
                            <option value={item.code}>{item.textValue}</option>
                        ))}
                    </Select>
                  </div>

                </div>
              ) : (
                  <div>
                    <div >
                      <Radio.Group buttonStyle="solid" onChange={e => this.setState({ cheorchuan: e.target.value })}>
                        <Radio.Button value="1" style={{ marginRight: '20px' }}>车</Radio.Button>
                        <Radio.Button value="2">船</Radio.Button>
                      </Radio.Group>
                    </div>
                    <div style={{ marginTop: '50px' }}>
                      <Input placeholder="请输入车或船的名称" onChange={e => this.setState({ mingcheng: e.target.value })} />


                    </div>
                  </div>
                )

            }
          </div>
        </Modal>
      </div>
    );
  }
}

const TPACertificationList_Form = Form.create({ name: 'TPACertificationList_Form' })(
  TpaList,
);

export default TPACertificationList_Form;
