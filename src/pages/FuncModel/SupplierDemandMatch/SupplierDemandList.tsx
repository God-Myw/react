import getRequest, { putRequest } from '@/utils/request';
import { Button, message, Pagination, Modal, Form, Col, Row, Select, Input } from 'antd';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { voyage } from './PalletFormInterface';
const { confirm } = Modal;
const InputGroup = Input.Group;

//尚未完成:停止匹配有个停止标志未加入
class SupplierDemandList extends React.Component<RouteComponentProps> {
  state = {
    currentPage: 1, //当前页
    pageSize: 15,
    total: -1, //总页数
    sudeMatchContentList: [],
    buttonA: false,
    buttonB: false,
    isChina: '1',
  };

  //钩子函数
  componentDidMount() {
    let isChina = this.props.match.params['isChina'] ? this.props.match.params['isChina'] : '1';
    if (isChina == 1) {
        this.setState({
          isChina: isChina,
          buttonA: true,
          buttonB: false,
        }, () => {
          this.initData();
        })
    } else if(isChina == 0) {
        this.setState({
          isChina: isChina,
          buttonA: false,
          buttonB: true,
        }, () => {
          this.initData();
        })
    } else{
        this.setState({
          isChina: isChina,
          buttonA: true,
          buttonB: false,
        }, () => {
          this.initData();
        })
    }
    // this.initData();
  }

  //初始化数据
  initData() {
    this.getBusinessMatchList();
  }

  //停止匹配按钮
  handleStopMatch = (guid: any, index: number) => {
    const self = this;
    confirm({
      title: "是否确认停止匹配",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        let requestParam = {
          type: 1,
          guid: guid,
          matchStopStatus: 1, //停止匹配状态
        };
        putRequest('/business/match', JSON.stringify(requestParam), (response: any) => {
          if (response.status == 200) {
            const stateOld: voyage[] = self.state.sudeMatchContentList;
            stateOld[index].matchStopStatus = 1;
            self.setState({
              sudeMatchContentList: stateOld
            });
            message.success('停止匹配成功!');
          } else {
            message.warning('停止匹配失败!');
          }
        });
      },
    });

  };

  //获得供需匹配列表
  getBusinessMatchList() {
    let param: Map<string, any> = new Map();
    param.set('type', '1');
    param.set('currentPage', this.state.currentPage);
    param.set('pageSize', this.state.pageSize);
    param.set('data',moment());
    param.set('isChina', this.state.isChina ? this.state.isChina : '1');

    param.set('shipName', this.state.shipName ? this.state.shipName : '');
    param.set('voyageLineName', this.state.voyageLineName ? this.state.voyageLineName : '');

    getRequest('/business/match', param, (response: any) => {
      console.log(response)
      if (response.status == 200) {
        //先清空数组
        if (!isNil(response.data.voyageNames) && response.data.voyageNames.length > 0) {
          this.setState({
            sudeMatchContentList: response.data.voyageNames
          });
        }
        this.setState({
          total: response.data.total,
          currentPage: response.data.currentPage,
        });
      }
    });
  }

//搜索
  findAll = () => {
    this.setState({
      currentPage: 1,
    }, () => {
      this.initData();
    });
  };

//切换国内国际
  selectA = () => {
    this.setState(
      {
        buttonA: true,
        buttonB: false,
        isChina: '1',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

//切换国内国际
  selectB = () => {
    this.setState(
      {
        buttonA: false,
        buttonB: true,
        isChina: '0',
        currentPage: 1,
      },
      () => {
        this.initData();
      },
    );
  };

  //分页
  pagination = (page: number) => {
    this.setState(
      {
        currentPage: page,
        sudeMatchContent: [],
      },
      () => {
        this.getBusinessMatchList();
      },
    );
  };

  //查看详情
  handleView=(guid)=>{
    let id = guid;
    let isChina = this.state.isChina;
    console.log(isChina,id);
    this.props.history.push('/sudeMatch/view/' + id+'/'+isChina)
  }

  //渲染页面组件
  render() {
    const sudeMatchContentList = isNil(this.state) || isNil(this.state.sudeMatchContentList) ? [] : this.state.sudeMatchContentList;

    const elements: JSX.Element[] = [];
    forEach(sudeMatchContentList, (sudeMatchContent: voyage, index) => {
      elements.push(
        <div className={commonCss.bussinessMatch} key={sudeMatchContent.guid}>
          <div className="voyageName">
            <img src={require('../../Image/voyage.png')}></img>
            <p>{sudeMatchContent.voyageName}</p>
          </div>{' '}
          <div >
            <div className="view">
              <Button className='viewButton '
                onClick={() => this.handleView(sudeMatchContent.guid)}
                type="dashed"
              >
                <img src={require('../../Image/view.png')}></img>查看
                {/* 以下是小圆点 */}
                {
                  sudeMatchContent.guid
                  ?
                  <div style={{width:'30px',height:'30px',backgroundColor:'red',position:'absolute',left:'75%',top:'10%',borderRadius:'50%',textAlign:'center',lineHeight:'30px'}}>
                    {sudeMatchContent.guid}
                  </div>
                  :null
                }

              </Button>
              <Button
                type="dashed"
                className={sudeMatchContent.matchStopStatus === 0 ? 'matchStopButton1' : 'matchStopButton2'}
                onClick={() => sudeMatchContent.matchStopStatus === 0 ? this.handleStopMatch(sudeMatchContent.guid, index) : {}}
              >
                <img src={require('../../Image/shanchu.png')}></img>停止匹配
              </Button>
            </div>
          </div>
        </div >
      );
    });
    return (
      <div>
        {/* 主页组件 */}
        <div className={commonCss.container} style={{ position: 'absolute' }}>
          <LabelTitleComponent
            text="供需匹配"
            event={() => {
              this.props.history.push('/');
            }}
          />
          <div className={commonCss.searchRow}>
            <Row gutter={24}>
              <Col span={24}>
                <InputGroup compact>
                  <Input
                    style={{ width: '40%' }}
                    placeholder="请输入航线名称或航线编号搜索"
                    onChange={e => this.setState({ voyageLineName: e.target.value })}
                  />
                  <Input
                    style={{ width: '40%' }}
                    placeholder="请输入船舶名称搜索"
                    onChange={e => this.setState({ shipName: e.target.value })}
                  />
                  <QueryButton
                    type="Query"
                    text="搜索"
                    event={this.findAll}
                    disabled={false}
                  />
                </InputGroup>
              </Col>
            </Row>
          </div>
          <div className={commonCss.searchRow}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  style={{
                    marginBottom: '-5px',
                    paddingBottom: '0px',
                    width: '10.95%',
                    float: 'left',
                  }}
                >
                  <Button
                    style={{
                      width: '100%',
                      backgroundColor: this.state.buttonA ? '#135A8D' : '#003750',
                      color: '#FFFFFF',
                    }}
                    onClick={this.selectA}
                  >
                    国际供需匹配
                  </Button>
                </Form.Item>
                <Form.Item
                  style={{
                    marginBottom: '-5px',
                    paddingBottom: '0px',
                    width: '11.93%',
                    float: 'left',
                  }}
                >
                  <Button
                    style={{
                      width: '100%',
                      backgroundColor: this.state.buttonB ? '#135A8D' : '#003750',
                      color: '#FFFFFF',
                    }}
                    onClick={this.selectB}
                  >
                    国内供需匹配
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div style={{ overflow: 'hidden' }}>
            {elements}
          </div>
          <div className={commonCss.AddForm} >
            {this.state.sudeMatchContentList.length === 0 ? null : (<Pagination
              style={{ textAlign: 'right' }}
              showQuickJumper={true}
              pageSize={this.state.pageSize}
              total={this.state.total}
              current={this.state.currentPage}
              onChange={this.pagination}
              showTotal={() => `总共${' '}
              ${this.state.total % this.state.pageSize == 0
                ? Math.floor(this.state.total / this.state.pageSize)
                : Math.floor(this.state.total / this.state.pageSize) + 1}${' '}
              页记录,每页显示
              ${this.state.pageSize}条记录`}
            />)}
          </div>
        </div>
      </div>
    );
  }
}

export default SupplierDemandList;
