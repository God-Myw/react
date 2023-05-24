import getRequest, { postRequest } from '@/utils/request';
import { Col, Form, Input, Modal, Row, Upload, message, DatePicker, Select, Button, Modal } from 'antd';
import { RouteComponentProps } from 'dva/router';
import { isNil, forEach, filter } from 'lodash';
import React from 'react';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import HrComponent from '../../Common/Components/HrComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import ShipCertificationFormProps from './ShipCertificationFormInterface';
import { FileModel } from './FileModel';
import { getTableEnumText, linkHref } from '@/utils/utils';
import moment from 'moment';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { getLocale } from 'umi-plugin-react/locale';
import UserListForm from '../MessagePush/userlist';
import e from 'express';
const { TextArea } = Input;

type CertificationProps = ShipCertificationFormProps & RouteComponentProps;

//不通过图片
const certificationNO = require('../../Image/noPass.png');
const certificationNOEN = require('../../Image/noPassEN.png');

//通过图片
const certificationsuccess = require('../../Image/pass.png');
const certificationsuccessEN = require('../../Image/passEN.png');

const format = 'YYYY/MM/DD';
const { Option } = Select;


const provinceData = ['只发送选择用户','全部', '货主', '船东', '服务商'];
const cityData = {

  // 请选择用户类型: ['请选择用户类型'],

  全部: ['全部'],
  只发送选择用户: ['只发送选择用户'],
  货主: ['货主已经发布货盘', '货主未发布货盘' ],
  船东: ['船东已经发布货盘', '船东未发布货盘' ],
  服务商: ['报关', '绑扎',
  '集港',
  '包装',
   '装箱',
  '仓库',
  '卡车运输',
   '航空代理',
  '铁路运输',
  '港口服务',
   '船厂',
   '航修',
  '船舶供应',
  '气象导航',
  '检验',
   '燃油供应',
  '船舶供应',
  '船舶代理',
  '船员派遣',
  '货运代理',
  '卡车买卖',],
};

class MPView extends React.Component<ShipCertificationFormProps, CertificationProps> {

    state = {
      cities: cityData[provinceData[0]],
      secondCity: cityData[provinceData[0]][0],
      visible: false,
      tsnr:'',
      panduan:false
    };

    handleProvinceChange = value => {
      console.log(value)
      this.setState({
        cities: cityData[value],
        secondCity: cityData[value][0],
      });
      if(value != '只发送选择用户'){
        this.setState({
          panduan:true
        })
      }else{
        this.setState({
          panduan:false
        })
      }

    };

    onSecondCityChange = value => {
      this.setState({
        secondCity: value,
      });
    };

  changeSrc = '';
  certification = '';
  constructor(props: ShipCertificationFormProps) {
    super(props);
  }

  componentDidMount() {
    if (this.props.match.params['guid'] == 0) {
      this.getsource();
    } else {
      this.getData();
    }

    //  console.log( this.props.match.params['guid'])
  }
  getData() {
    this.setState(
      {
        tsnr:'',
        MessageTemplate: '',
        cpt: [
          ' 国内货运+其他服务报价',
          '国际货运+其他服务报价',
        ],
        yonghuleixing: [
          '货主',
          '船东',
          '服务商',
        ],
        title: '',
        visible: false,
        previewVisible: false,
        previewImage: '',
        aFileList: [],
        bFileList: [],
        cFileList: [],
        pFileList: [],
        zero: this.props.match.params['guid']
      },
      () => {
        let param: Map<string, string> = new Map();
        getRequest('/sys/chat/message/getManualMessageById?id=' + this.props.match.params['guid'], param, (response: any) => {
          console.log(response)
          // console.log(response[1].adsOrder.order_level)
          if (response.data) {
            if (!isNil(response)) {
              let OP = response.data.manualMessageById ? response.data.manualMessageById.userType : '';
              let userType = OP ? OP == 0 ? '管理员' : OP == 1 ? '线上客服' : OP == 2 ? ' 线下客服' : OP == 3 ? '审核客服' : OP == 4 ? '货主' : OP == 5 ? '船东' : OP == 6 ? '服务商' : '' : '';
              // console.log(OP)
              this.setState({
                title: response.data.manualMessageById.title,
                content: response.data.manualMessageById.content,
                AuserType: userType,
                manualMessageUserAll: response.data.manualMessageUserAll
              });
            }
            console.log(this.state.AuserType)
          }
          console.log(this.state.zero)
        });
      },

    );
  }

  //切换审核模板
  getsource() {
    this.setState(
      {
        zhong: [],
        zero: this.props.match.params['guid'],
        xxmb: '',
        biaoti: '',
        yonghuleixing: [
          '货主',
          '船东',
          '服务商',
        ],
        jtmb:[],
        visible: false,
        tsnr:'',
        selectData: [],
        userList:[],
        OK: false,
        COK: false,
      },
      () => {
        let param: Map<string, string> = new Map();
        getRequest('/business/messageMould/getMessageMouldAll', param, (response: any) => {
          console.log(response)
          if (response.status === 200) {

            if (!isNil(response)) {
              forEach(response.data.messageMouldDtos, (userDataCheck, index) => {

              });

            }
            this.setState({
              zhong: response.data.messageMouldDtos
            });
            console.log(this.state.zhong)
          }
        });
      }
    )
  }

  //切换审核模板

  selectChange = (value) => {
    this.setState({
      xxmb: value ? value : '',
    });
    setTimeout(() => {
      console.log(this.state.xxmb)
      this.state.xxmb ? this.state.xxmb == 1 ?
        document.getElementById("tsnr").value = '您上海-广州的货物设备5000吨，价格为10,000元人民币；其他服务中其他联合运输+绑扎+江运海运险价格为8,000人民币；详情请咨询在线客服！'
        : this.state.xxmb == 2 ?
          document.getElementById("tsnr").value = '您上海-旧金山的货物设备5000吨，价格为30,000美金；其他服务中其他联合运输+绑扎+集港+海运险卡车运输险价格为12,000美金；详情请咨询在线客服！'
          : '' : '';
      // document.getElementById("tsnr").value = this.state.xxmb
    }, 100)

  }

  // 返回
  onBack = () => {
    //得到当前审核状态
    let status = this.props.match.params['status'] ? this.props.match.params['status'] : '';
    // console.log(this.props.match.params['status'])
    // 跳转首页
    this.props.history.push(`/manualMessage/list` + status);
  };
//数据库中选择用户
// onYong = () => {
//   //得到当前审核状态
//   // let status = this.props.match.params['status'] ? this.props.match.params['status'] : '';
//   // console.log(this.props.match.params['status'])
//   // 跳转首页
//   console.log(123)
//   this.props.history.push(`/manualMessage/Yong`);
// };


// //弹窗
showModal = () => {
  this.setState({
    visible: true,
  });
};

// handleOk = e => {
//   console.log(e);
//   this.setState({
//     visible: false,
//   });
// };

// handleCancel = e => {
//   console.log(e);
//   this.setState({
//     visible: false,
//   });
// };

//发送成功
  turnDown=()=>{
    let userList1 =this.state.userList;
    let title1 = document.getElementById("tsbt").value;
    let content1 = document.getElementById("tsnr").value;
    let messageMould1 = this.state.xxmb ? this.state.xxmb==1 ? 1 :this.state.xxmb==2 ? 2 :'':'';
    // let receiveUserType =   货主已经发布货盘  货主未发布货盘  船东已经发布货盘  船东未发布货盘
    let receiveUserType1 = this.state.secondCity ? this.state.secondCity=='报关' ?1 :this.state.secondCity=='绑扎' ? 2:
                            this.state.secondCity=='集港' ?3 :this.state.secondCity=='包装' ?4 :this.state.secondCity=='装箱' ?5 :
                              this.state.secondCity=='仓库' ?6 :this.state.secondCity=='卡车运输' ?7 :this.state.secondCity=='航空代理' ?8 :
                                this.state.secondCity=='铁路运输' ?9 :this.state.secondCity=='港口服务' ?10 :this.state.secondCity=='船厂' ?11 :
                                  this.state.secondCity=='航修' ?12 :this.state.secondCity=='船舶供应' ?13 :this.state.secondCity=='气象导航' ?14 :
                                    this.state.secondCity=='检验' ?15 :this.state.secondCity=='燃油供应' ?16 :this.state.secondCity=='船舶供应' ?17 :
                                      this.state.secondCity=='船舶代理' ?18 :this.state.secondCity=='船员派遣' ?19 : this.state.secondCity=='货运代理' ?20 :
                                        this.state.secondCity=='卡车买卖' ?23 :this.state.secondCity=='货主已经发布货盘' ?101:
                                          this.state.secondCity=='货主未发布货盘' ?102 :this.state.secondCity=='船东已经发布货盘' ?103 : this.state.secondCity=='船东未发布货盘' ?104 :
                                            this.state.secondCity=='全部'?105 :this.state.secondCity=='只发送选择用户'?9999:'':'';
    console.log(userList1)

    let requestData = {
      userList:userList1?userList1:'',
      title: title1?title1:'',
      content:content1?content1:'',
      messageMould:messageMould1?messageMould1:'',
      receiveUserType:receiveUserType1?receiveUserType1:'',
    };
    postRequest('/sys/queue/sysSendMouldMessage', JSON.stringify(requestData), (response: any) => {
      console.log(response)
      if(response){
        if (response.status === 200) {
          // this.props.history.push(`/manualMessage/list`);
          this.showModalOK()
          console.log('成功')
        } else {
          console.log('不成功');
          this.showModalNO()
        }
      }else{
        console.log(biubiubiu)
      }

    });
  }
//弹窗
  userListFormClose(e) {
    console.log(e.type);
    // console.log(e.data.guid.guid)
    if(e.type === 'ok') {
      this.state.selectData = e.data;
      (e.data).forEach(item => {
        console.log(item.guid.guid)
        this.state.userList.push(item.guid.guid)
      })
    }
    this.setState({
      visible: false
    });

  }


//成功
    showModalOK = () => {
      this.setState({
        OK: true,
      });
    };

    HOk = e => {
      console.log(e);
      this.setState({
        OK: false,
      });
      this.props.history.push(`/manualMessage/list`);
    };

    HCancel = e => {
      console.log(e);
      this.setState({
        OK: false,
      });
      this.props.history.push(`/manualMessage/list`);
    };

//不成功
    showModalNO = () => {
      this.setState({
        COK: true,
      });
    };

    CCOk = e => {
      console.log(e);
      this.setState({
        COK: false,
      });
    };

    CCancel = e => {
      console.log(e);
      this.setState({
        COK: false,
      });
    };


    panduan(a){
      console.log(a)
    }


  render() {
    console.log(this.state.selectData)
    const { cities } = this.state;
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const { getFieldDecorator } = this.props.form;
    if (this.props.match.params['status'] == '7') {
      this.certification = getLocale() === 'zh-CN' ? certificationNO : certificationNOEN;
    } else if (this.props.match.params['status'] == '1') {
      this.certification = getLocale() === 'zh-CN' ? certificationsuccess : certificationsuccessEN;
    } else {
      this.certification = '';
    }
    return (
      <div className={commonCss.container}>

          <Modal
            title="成功"
            visible={this.state.OK}
            onOk={this.HOk}
            onCancel={this.HCancel}
            closable={false}
          >
            <p>发送成功</p>
          </Modal>

          <Modal
            title="失败"
            visible={this.state.COK}
            onOk={this.CCOk}
            onCancel={this.CCancel}
            closable={false}
          >
            <p>发送失败</p>
          </Modal>

        <LabelTitleComponent text="APP消息推送详情" event={() => this.onBack()} />
        {
          !isNil(this.state) && this.state.zero == 0 ? (
            <div className={commonCss.AddForm}>
              <Form labelAlign="left">
                <h2>
                  推送内容
                </h2>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="消息摸板">
                      <Select

                        style={{ width: '70%' }} allowClear={true} onChange={this.selectChange}>
                        {
                          (isNil(this.state) || isNil(this.state) || isNil(this.state.zhong)
                            ? ''
                            : this.state.zhong).map(item => {
                              return <Option value={item.guid}>{item.messageTemplate}</Option>
                            })
                        }

                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item  {...formlayout} label="推送标题">
                      <Input id='tsbt' />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item  {...formlayout} label="推送内容">
                      <Input id='tsnr' onChange={e => this.setState({ tsnr: e.target.value })} style={{ width: '1300px', height: '200px' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          ) : (<div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <h2>
                推送内容
                  </h2>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="消息摸板">
                    <Input readOnly disabled value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.companyName)
                      ? ''
                      : this.state.ship.companyName} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="推送标题">
                    <Input disabled readOnly value={isNil(this.state) || isNil(this.state) || isNil(this.state.title)
                      ? ''
                      : this.state.title} />
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ display: 'flex' }}>
                <span>
                  推送内容:
                    </span>
                <div style={{ width: '90%', height: '200px', border: '1px solid #D9D9D9', marginLeft: '65px', overflow: 'auto', color: '#DBD9DB' }}>
                  {isNil(this.state) || isNil(this.state) || isNil(this.state.content)
                    ? ''
                    : this.state.content}
                </div>
              </div>
            </Form>
          </div>)
        }
        {/* <button onClick={() => console.log(this.state.secondCity, document.getElementById("jtmblx").value, this.state.xxmb)}>
          213546
        </button> */}
        <hr />


        {
        !isNil(this.state) && this.state.zero == 0 ? (
          <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <h2>
              推送目标类型
            </h2>
            <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="用户类型">
                      <Select
                        id="yhlx"
                        defaultValue={provinceData[0]}
                        style={{ width: 120 }}
                        onChange={this.handleProvinceChange}
                        allowClear={true}

                      >
                        {provinceData.map(province => (
                          <Option key={province}>{province}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
            </Row>
            <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="具体目标类型">
                      <Select
                        id="jtmblx"
                        style={{ width: 200 }}
                        value={this.state.secondCity}
                        onChange={this.onSecondCityChange}
                        allowClear={true}
                      >
                        {cities.map(city => (
                          <Option key={city}>{city}</Option>
                        ))}
                      </Select>
                  </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="具体目标用户">
                      <Button type="primary" onClick={this.showModal}  disabled={this.state.panduan}>
                        选择用户
                      </Button>
                      <UserListForm visible={this.state.visible} close={this.userListFormClose.bind(this)} />
                  </Form.Item>
                </Col>
            </Row>
            <div style={{ display: 'flex' }}>
              <span>
                已推送目标用户:
              </span>
              <div style={{ width: '90%', height: '200px', border: '1px solid #D9D9D9', marginLeft: '25px', overflow: 'auto', color: '#DBD9DB' }}>
                  {
                  (isNil(this.state) || isNil(this.state) || isNil(this.state.selectData)
                    ? ''
                    : this.state.selectData).map(element => {
                      console.log(element.phone)
                      return <span>{element.phone}、</span>
                    })
                  }
              </div>
            </div>
          </Form>
        </div>
        ):(
            <div className={commonCss.AddForm}>
            <Form labelAlign="left">
              <h2>
                推送目标类型
              </h2>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="用户类型">
                    <Input readOnly disabled value={isNil(this.state) || isNil(this.state) || isNil(this.state.AuserType)
                      ? ''
                      : this.state.AuserType} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item  {...formlayout} label="具体目标类型">
                    <Input disabled readOnly value={isNil(this.state) || isNil(this.state.ship) || isNil(this.state.ship.city)
                      ? ''
                      : this.state.ship.city + this.state.ship.cnty} />
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ display: 'flex' }}>
                <span>
                  已推送目标用户:
                </span>
                <div style={{ width: '90%', height: '200px', border: '1px solid #D9D9D9', marginLeft: '25px', overflow: 'auto', color: '#DBD9DB' }}>
                  {isNil(this.state) || isNil(this.state) || isNil(this.state.manualMessageUserAll)
                    ? ''
                    : this.state.manualMessageUserAll}
                </div>
              </div>
            </Form>
          </div>
        )}

        <div>
          <Form labelAlign="left">
            <Row className={commonCss.rowTop}>
              {this.props.match.params['guid'] == '0' ? (
                <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="TurnDown"
                    text="关闭"
                    event={() => this.onBack()}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params['guid'] == '0' ? (
                <Col span={12}>
                  <ButtonOptionComponent
                    type="Approve"
                    text="发送"
                    event={() => this.turnDown()}
                    disabled={false}
                  />
                </Col>
              ) : null}
              {this.props.match.params['guid'] == '0' ? null : (
                <Col span={12} className={commonCss.lastButtonAlignRight}>
                  <ButtonOptionComponent
                    type="CloseButton"
                    text="关闭"
                    event={() => this.onBack()}
                    disabled={false}
                  />
                </Col>
              )}
              {this.props.match.params['status'] == '0' ? null : <Col span={7}></Col>}
            </Row>
          </Form>
        </div>

      </div>
    );
  }
}

const ShipCertificationView_Form = Form.create({ name: 'ShipCertificationView_Form' })(
  MPView,
);
export default ShipCertificationView_Form;
