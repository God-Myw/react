import { getRequest, postRequest, putRequest } from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Button, Col, Form, Input, message, Modal, Row, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import HrComponent from '../../Common/Components/HrComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { PalletModel } from './DemandMatchModel';
const { confirm } = Modal;

const data_Source: PalletModel[] = []; //货盘数组
const voyagePorts: JSX.Element[] = []; //循环插入航线数组
const formlayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
const smallFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

//航线接口
interface voyagePortModel {
  portId?: number; //港口id 字典项
  arriveDate?: string; //到达日期
  leaveDate?: string; //离开日期
  portTypeName?: string;
}

/**
 *  1.删除方法已经提了QA
 *      2.预订单生成状态列尚未添加,api中无此状态,在mock数据中模拟状态,已提QA
 */
class SupplierDemandMatchView extends React.Component<RouteComponentProps> {
  state = {
    guid: -1, //航线id
    columns: [], //货盘list列名
    dataSource: [], //货盘list数据
    currentPage: 1, //货盘当前页
    total: -1, //总条数
    shipName: '', //船舶名称
    shipDeck: -1, //船型
    shipType: -1, //船舶类型
    buildParticularYear: '', //建造年份
    tonNumber: -1, //载重吨
    shipCrane: '', //船吊
    draft: -1, //船舶吃水
    anchoredPort: -1, //已定挂靠港口
    contacter: '', //联系人
    phoneCode: '', //手机号段
    contactPhone: '', //联系号码
    acceptCapacity: -1, //可接受体积
    acceptTon: -1, //可接受吨位
    shipVoyage: -1, //船舶航程
    voyageLineName: '', //已定航线
    voyagePorts: [], //港口信息集合
    pallets: [], //货盘信息集合
    buttonDisabled: false,
    port: -1,
    pageSize: 10,
    matchStopStatus: undefined,
  };

  //航线货盘列表
  private columns: ColumnProps<PalletModel>[] = [
    {
      title: '序号',
      dataIndex: 'sortIndex',
      align: 'center',
    },
    {
      title: '匹配时间',
      dataIndex: 'createDate',
      align: 'center',
    },
    {
      title: '货物名称',
      dataIndex: 'palletLeave',
      align: 'center',
    },
    {
      title: '货物编号',
      dataIndex: 'palletNumber',
      align: 'center',
    },
    {
      title: '货物重量',
      dataIndex: 'goodsMaxWeight',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'accountId',
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'contacter',
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'phoneCode',
      align: 'center',
    },
    {
      title: '空船港',
      dataIndex: 'startPort',
      align: 'center',
    },
    {
      title: '目的港',
      dataIndex: 'destinationPort',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'palletId',
      align: 'center',
      width: '16%',
      render: (palletId: number, record: any,) => (
        <span>
          <div> </div>
          <a
            onClick={() => this.handleView(palletId, record)}
            style={{ textDecoration: 'underline' }}
            values={this.state.BBB}
          >
            查看
          </a>
          &nbsp;
          {record.orderStatus === 0 ? (
            <a
              style={{ textDecoration: 'underline' }}
              onClick={() => {
                this.generateAdvanceOrder(palletId, record);
              }}
            >
              生成预订单
            </a>
          ) : (
            <span style={{ color: 'grey', textDecoration: 'underline' }}>生成预订单</span>
          )}
          &nbsp;
          {record.orderStatus === 0 ? (
            <a
              style={{ color: 'red', textDecoration: 'underline' }}
              onClick={() => this.handleDelete(palletId, record)}
            >
              删除
            </a>
          ) : (
            <span style={{ color: 'grey', textDecoration: 'underline' }}>删除</span>
          )}
        </span>
      ),
    },
  ];

  //钩子函数
  componentDidMount() {
    this.setState(
      {
        columns: this.columns,
      },
      () => {
        this.initData();
      },
    );
    setInterval(() => {
      this.initData();
    }, 600000);
  }

  //初始化
  initData() {
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let isChina = this.props.match.params['isChina'] ? this.props.match.params['isChina'] : '';
    console.log(uid)
    let params: Map<string, any> = new Map();
    params.set('type', 1);
    params.set('currentPage', this.state.currentPage);
    params.set('pageSize', this.state.pageSize);
    params.set('isChina',isChina)
    getRequest('/business/match/' + uid, params, (response: any) => {
      console.log(response)
      if (response.status == 200) {
        if (!isNil(response.data)) {
          //添加航线数组
          if (!isNil(response.data.voyageMatch.voyagePorts)) {
            voyagePorts.length = 0;
            forEach(
              response.data.voyageMatch.voyagePorts,
              (voyagePort: voyagePortModel, index: number) => {
                voyagePorts.push(
                  <div key={index}>
                    <Row gutter={24}>
                      <Col span={10}>
                        <Form.Item
                          {...formItemLayout}
                          label={voyagePort.portTypeName ? voyagePort.portTypeName : '目的港口'}
                        >
                          <Input disabled value={getTableEnumText('port', voyagePort.portId)} />
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item {...smallFormItemLayout} label="ETA">
                          <Input
                            disabled
                            value={moment(Number(voyagePort.arriveDate)).format('YYYY/MM/DD')}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={7}>
                        <Form.Item {...smallFormItemLayout} label="ETD">
                          <Input
                            disabled
                            value={moment(Number(voyagePort.leaveDate)).format('YYYY/MM/DD')}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>,
                );
              },
            );
          }
          if (!isNil(response.data.voyageMatch.pallets)) {
            data_Source.length = 0;
            forEach(response.data.voyageMatch.pallets, (pallet: PalletModel, index: number) => {
              data_Source.push({
                sortIndex: `${index + 1 + (this.state.currentPage - 1) * this.state.pageSize}`,
                createDate: moment(pallet.createDate).format('YYYY/MM/DD'),//匹配时间
                palletLeave:pallet.palletLeave,//货物名称
                accountId:pallet.accountId,//用户名
                palletId: pallet.palletId, //货盘id
                goodsType: getTableEnumText('goods_type', pallet.goodsType), //货盘类型id
                palletNumber:  pallet.palletNumber, //货物类型id
                goodsMaxWeight: pallet.goodsMaxWeight, //货物重量
                contacter: pallet.contacter, //联系人
                phoneCode: `${pallet.phoneCode}${pallet.contactPhone}`, //电话,此处是区号加后面的电话
                startPort: getTableEnumText('port', pallet.startPort), //开始港口id
                destinationPort: getTableEnumText('port', pallet.destinationPort), //离开港口id
                orderStatus: pallet.orderStatus,
                matchId: pallet.matchId,
              });
            });
          }
          this.setState({
            voyageId:response.data.voyageMatch.voyageId,

            guid: response.data.voyageMatch.voyageId,
            currentPage: response.data.voyageMatch.currentPage, //货盘当前页
            total: response.data.voyageMatch.total, //总条数
            shipName: response.data.voyageMatch.shipName, //船舶名称
            shipDeck: response.data.voyageMatch.shipDeck, //船型
            shipType: response.data.voyageMatch.shipType, //船舶类型
            buildParticularYear: response.data.voyageMatch.buildParticularYear, //建造年份
            tonNumber: response.data.voyageMatch.tonNumber, //载重吨
            shipCrane: response.data.voyageMatch.shipCrane, //船吊
            draft: response.data.voyageMatch.draft, //船舶吃水
            anchoredPort: response.data.voyageMatch.anchoredPort, //已定挂靠港口
            contacter: response.data.voyageMatch.contacter, //联系人
            phoneCode: response.data.voyageMatch.phoneCode, //手机号段
            contactPhone: response.data.voyageMatch.contactPhone, //联系号码
            acceptCapacity: response.data.voyageMatch.acceptCapacity, //可接受体积
            acceptTon: response.data.voyageMatch.acceptTon, //可接受吨位
            shipVoyage: response.data.voyageMatch.shipVoyage, //船舶航程
            voyageLineName: response.data.voyageMatch.voyageLineName, //已定航线
            matchStopStatus: response.data.voyageMatch.matchStopStatus, //是否匹配
            port: response.data.voyageMatch.remark,
            pallets: response.data.voyageMatch.pallets, //货盘信息集合
            voyagePorts: voyagePorts, //航线数组
          });
        }
      }
    });
  }

  //查看货盘细节
  handleView = (palletId: any, record: any) => {
    // console.log(palletId)
    // console.log(record)
    // let BBB = this.state.voyageId
    // this.setState({BBB})
    // console.log(BBB)
    this.props.history.push('/sudeMatch/detail/' + record.palletId+'/' + record.matchId);
  };

  //停止匹配按钮
  handleStopMatch = () => {
    const self = this;
    confirm({
      title: "是否确认停止匹配",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        let requestParam = {
          type: 1,
          guid: self.state.guid,
          matchStopStatus: 1, //停止匹配状态
        };
        putRequest('/business/match', JSON.stringify(requestParam), (response: any) => {
          if (response.status == 200) {
            message.success('停止匹配成功!');
            self.setState({
              buttonDisabled: true,
            });
          } else {
            message.warning('停止匹配失败!');
          }
        });
      },
    });
  };

  save = () => {
    let matchStopStatus = {};
    matchStopStatus = {
      type: 1,
      guid: Number(this.state.guid),
      remark: this.state.port ? this.state.port : '',
    };
    // 修改请求
    putRequest('/business/match/remark', JSON.stringify(matchStopStatus), (response: any) => {
      if (response.status === 200) {
        message.success('修改成功');
      } else {
        message.error('修改失败');
      }
    });
  };

  //删除此货盘
  handleDelete = (palletId: any, record: any) => {
    Modal.confirm({
      content: '确认删除此货盘吗?',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        let matchStopStatus = {
          type: 1, //用户类型
          palletId: palletId, //货盘id
          voyageId: Number(this.state.guid), //航次id
          matchVoyagePallet: 1,
        };
        putRequest(
          '/business/match/matchVoyagePallet',
          JSON.stringify(matchStopStatus),
          (res: any) => {
            if (res.status == 200) {
              message.success('删除成功!');
              this.initData();
            } else {
              message.warning('删除失败!');
            }
          },
        );
      },
    });
  };

  //从一条记录中获取uid
  getGuid = (record: any) => {
    return !isNil(record.palletId) ? record.palletId : '';
  };

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

  //生成预订单,此处和线下客服联动
  generateAdvanceOrder = (palletId: any, record: any) => {
    let check: number | undefined;
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    let params: Map<string, any> = new Map();
    params.set('type', 1);
    params.set('currentPage', this.state.currentPage);
    params.set('pageSize', this.state.pageSize);
    getRequest('/business/match/' + uid, params, (response: any) => {
      if (response.status == 200) {
        if (!isNil(response.data.voyageMatch.pallets)) {
          forEach(response.data.voyageMatch.pallets, (pallet: PalletModel, index: number) => {
            if (Number(pallet.palletId) === Number(palletId)) {
              check = pallet.orderStatus;
            }
          });
        }
        if (check === 0) {
          let requestParam = {
            type: 1, //用户类型
            palletId: palletId, //货盘id
            voyageId: Number(this.state.guid), //航次id
          };
          postRequest('/business/order', JSON.stringify(requestParam), (res: any) => {
            if (res.status == 200) {
              message.success('生成预订单成功!');
              this.initData();
            } else {
              message.warning('生成预订单失败!');
            }
          });
        } else {
          message.warning('该货物已经生成预订单，请返回!');
          this.initData();
        }
      }
    });
  };

  render() {
    const flag = isNil(this.state)||isNil(this.state.matchStopStatus)||this.state.matchStopStatus !==0 || this.state.buttonDisabled? true : false;
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text="航次信息"
          event={() => {
            this.props.history.push('/sudeMatch');
          }}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船舶名称">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.shipName) ? '' : this.state.shipName
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="船型">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || this.state.shipDeck == -1
                        ? ''
                        : getTableEnumText('ship_deck', this.state.shipDeck)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船舶类型">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || this.state.shipType == -1
                        ? ''
                        : getTableEnumText('ship_type', this.state.shipType)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="建造年份">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.buildParticularYear)
                        ? ''
                        : this.state.buildParticularYear
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="载重吨">
                  <Input
                    suffix="吨"
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || this.state.tonNumber == -1 ? '' : this.state.tonNumber
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="船吊">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.shipCrane) ? '' : this.state.shipCrane
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船舶吃水">
                  <Input
                    suffix="m"
                    className="OnlyRead"
                    disabled
                    value={isNil(this.state) || this.state.draft == -1 ? '' : this.state.draft}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="所在港口">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || this.state.anchoredPort == -1
                        ? ''
                        : getTableEnumText('port', this.state.anchoredPort)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系人">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.contacter) ? '' : this.state.contacter
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="联系方式">
                  <div>
                    <div style={{ width: '15%', float: 'left' }}>
                      <Input
                        disabled
                        className="OnlyRead"
                        style={{ textAlign: 'center' }}
                        value={
                          isNil(this.state) || isNil(this.state.phoneCode)
                            ? ''
                            : this.state.phoneCode
                        }
                      />
                    </div>
                    <div style={{ width: '80%', float: 'right' }}>
                      <Input
                        disabled
                        className="OnlyRead"
                        value={
                          isNil(this.state) || isNil(this.state.contactPhone)
                            ? ''
                            : this.state.contactPhone
                        }
                      />
                    </div>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="可接受体积">
                  <Input
                    suffix="m³"
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || this.state.acceptCapacity == -1
                        ? ''
                        : this.state.acceptCapacity
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="可接受吨位">
                  <Input
                    suffix="吨"
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || this.state.acceptTon == -1 ? '' : this.state.acceptTon
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="船舶航程">
                  <Input
                    suffix="海里"
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || this.state.shipVoyage == -1 ? '' : this.state.shipVoyage
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={10}>
                <Form.Item {...formlayout} label="已定航线">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.voyageLineName)
                        ? ''
                        : this.state.voyageLineName
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            {/*此处插入循环*/}
            {this.state.voyagePorts}
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col>
                <Form.Item {...smallFormItemLayout} label="临时挂靠港口">
                  <Input.TextArea
                    maxLength={300}
                    style={{ width: '100%', height: '200px' }}
                    value={isNil(this.state) || this.state.port == -1 ? '' : this.state.port}
                    onChange={e => this.setState({ port: e.target.value })}
                    onBlur={this.save}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
            <Row
              className={commonCss.rowTop}
              type="flex"
              align="middle"
              justify="center"
              style={{ height: '100px' }}
            >
              <Col>
                  <div>
                    <Button
                      type="danger"
                      onClick={this.handleStopMatch}
                      hidden ={flag}
                    >
                      停止匹配
                    </Button>
                    <Button
                      type="danger"
                      onClick={this.handleStopMatch}
                      disabled
                      hidden ={!flag}
                    >
                      停止匹配
                    </Button>
                  </div>
                </Col>


            </Row>
            <Row className={commonCss.rowTop}>
              <Col>
                <HrComponent text="dashed" />
              </Col>
            </Row>
          </Form>
        </div>
        <div className={commonCss.title}>
          <span className={commonCss.text}>货盘信息</span>
        </div>
        <div>
          <Table
            style={{
              backgroundColor: 'white',
              color: 'black',
              paddingTop: '10px',
              width: '95%',
              margin: 'auto',
            }}
            rowKey={record => this.getGuid(record)}
            bordered
            columns={this.state.columns}
            size="small"
            dataSource={data_Source}
            pagination={{
              current: this.state.currentPage,
              showQuickJumper: true,
              pageSize: this.state.pageSize,
              onChange: this.handlerChange,
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

const SupplierDemandMatchView_Form = Form.create({ name: 'SupplierDemandMatchView_Form' })(
  SupplierDemandMatchView,
);

export default SupplierDemandMatchView_Form;
