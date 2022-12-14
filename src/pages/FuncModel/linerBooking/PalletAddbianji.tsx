//                            _ooOoo_
//                           o8888888o
//                           88" . "88
//                           (| -_- |)
//                            O\ = /O
//                        ____/`---'\____
//                      .   ' \\| |// `.
//                       / \\||| : |||// \
//                     / _||||| -:- |||||- \
//                       | | \\\ - /// | |
//                     | \_| ''\---/'' | |
//                      \ .-\__ `-` ___/-. /
//                   ___`. .' /--.--\ `. . __
//                ."" '< `.___\_<|>_/___.' >'"".
//               | | : `- \`.;`\ _ /`;.`/ - ` : | |
//                 \ \ `-. \_ __\ /__ _/ .-` / /
//         ======`-.____`-.___\_____/___.-`____.-'======
//                            `=---='
//
//         .............................................
//                  佛祖镇楼                  BUG辟易
//          佛曰:
//                  写字楼里写字间，写字间里程序员；
//                  程序人员写程序，又拿程序换酒钱。
//                  酒醒只在网上坐，酒醉还来网下眠；
//                  酒醉酒醒日复日，网上网下年复年。
//                  但愿老死电脑间，不愿鞠躬老板前；
//                  奔驰宝马贵者趣，公交自行程序员。
//                  别人笑我忒疯癫，我笑自己命太贱；
//                  不见满街漂亮妹，哪个归得程序员？
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import  { getRequest, postRequest, putRequest } from '@/utils/request';
import { getDictDetail, linkHref } from '@/utils/utils';
import { checkNumber, checkRate, HandleBeforeUpload } from '@/utils/validator';
import { Col, DatePicker, Form, Icon, Input, message, Modal, Row, Select, Upload, Button, Icon,} from 'antd';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-locale';
import { getLocale } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import PalletFormProps from './PalletFormInterface';

const InputGroup = Input.Group;
let id_t = 10000;

const { confirm } = Modal;
const { Option } = Select;
moment.locale(getLocale());
const FORMAT = 'YYYY/MM/DD';

type PalletProps = PalletFormProps & RouteComponentProps;
class PalletAdd extends React.Component<PalletFormProps, PalletProps> {
  constructor(prop: PalletFormProps) {
    super(prop);
  }

  state = {
    requestData:{},
    shipBookingDate:[],
  };

  componentDidMount() {
    this.setState({
      history: this.props.history,
      previewVisible: false,
      fileList: [],
      title: formatMessage({ id: 'pallet-palletAdd.pallet.add' }),
      picflag: false,
      unloadingflag: false,
      loadDate: moment(),
      endDate: moment(),
      shipBookingDate:[],
    });
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
    this.setState({ guid: uid });
    let params: Map<string, string> = new Map();
    getRequest('/business/shipBooking/getShipBookingById'+'?guid='+uid,params,(response: any) => {
      console.log(response)
      if (response.status === 200) {
        if (!isNil(response.data)) {
          let OP = response.data.user?response.data.user.userType:'';
          let lables = response.data.shipBookingVo.lables;
          let ceshi1 = response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.indexOf('1:'):'';
          let ceshi2 = response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.indexOf('#2:'):'';
          let ceshi3 = response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.indexOf('#3:'):'';
          console.log(ceshi1,ceshi2,ceshi3)
          this.setState({
            userType :  OP ? OP == 0?'管理员' : OP == 1 ? '线上客服' : OP == 2 ? ' 线下客服' : OP == 3 ? '审核客服' : OP == 4 ? '货主' : OP == 5 ? '船东' : OP == 6 ? '服务商':'' : '',
            name: response.data.user?response.data.user.firstName+response.data.user.lastName:'',//姓名
            accountId:response.data.user? response.data.user.accountId:'',//用户名
            phoneCode: response.data.user?response.data.user.phoneCode+' '+response.data.user.phoneNumber:'',//联系电话
            startPortCn: response.data.shipBookingVo.startPortCn ? response.data.shipBookingVo.startPortCn : '', //起始港（中文
            startPortEn : response.data.shipBookingVo.startPortEn?response.data.shipBookingVo.startPortEn:'', //起始港（英文）
            endPortCn : response.data.shipBookingVo.endPortCn?response.data.shipBookingVo.endPortCn:'',   //目的港（中文）
            endPortEn : response.data.shipBookingVo.endPortEn?response.data.shipBookingVo.endPortEn:'',   //目的港（英文）
            haiyunTwentyGpTejia : response.data.shipBookingVo.haiyunTwentyGpTejia?response.data.shipBookingVo.haiyunTwentyGpTejia:'', //20GP特价
            haiyunTwentyGpYuanjia : response.data.shipBookingVo.haiyunTwentyGpYuanjia?response.data.shipBookingVo.haiyunTwentyGpYuanjia:'',   //20GP原价
            haiyunFortyGpTejia : response.data.shipBookingVo.haiyunFortyGpTejia?response.data.shipBookingVo.haiyunFortyGpTejia:'',  //40GP特价
            haiyunFortyGpYuanjia : response.data.shipBookingVo.haiyunFortyGpYuanjia?response.data.shipBookingVo.haiyunFortyGpYuanjia:'',    //40GP原价
            haiyunFortyHqTejia : response.data.shipBookingVo.haiyunFortyHqTejia?response.data.shipBookingVo.haiyunFortyHqTejia:'',  //40HQ特价
            haiyunFortyHqYuanjia : response.data.shipBookingVo.haiyunFortyHqYuanjia?response.data.shipBookingVo.haiyunFortyHqYuanjia:'',    //40HQ原价
            requirements: response.data.shipBookingVo.userShipBookings.length>0?response.data.shipBookingVo.userShipBookings[0].twentyGp:'',
            requirementsOne:response.data.shipBookingVo.userShipBookings.length>0? response.data.shipBookingVo.userShipBookings[0].fortyGp:'',
            requirementsTwo: response.data.shipBookingVo.userShipBookings.length>0? response.data.shipBookingVo.userShipBookings[0].fortyHq:'',
            matouTwentyGp : response.data.shipBookingVo.matouTwentyGp?response.data.shipBookingVo.matouTwentyGp:'',   //码头费20GP
            matouFortyGp : response.data.shipBookingVo.matouFortyGp?response.data.shipBookingVo.matouFortyGp:'',    //码头费40GP
            matouFortyHq : response.data.shipBookingVo.matouFortyHq?response.data.shipBookingVo.matouFortyHq:'',    //码头费40HQ
            wenjianTwentyGp : response.data.shipBookingVo.wenjianTwentyGp?response.data.shipBookingVo.wenjianTwentyGp:'', //文件费20GP
            wenjianFortyGp : response.data.shipBookingVo.wenjianFortyGp?response.data.shipBookingVo.wenjianFortyGp:'',  //文件费40GP
            wenjianFortyHq : response.data.shipBookingVo.wenjianFortyHq?response.data.shipBookingVo.wenjianFortyHq:'',  //文件费40HQ
            amsTwentyGp : response.data.shipBookingVo.amsTwentyGp?response.data.shipBookingVo.amsTwentyGp:'', //MAS20GP
            amsFortyGp : response.data.shipBookingVo.amsFortyGp?response.data.shipBookingVo.amsFortyGp:'',  //MAS40GP
            amsFortyHq : response.data.shipBookingVo.amsFortyHq?response.data.shipBookingVo.amsFortyHq:'',  //MAS40HQ
            remark: response.data.shipBookingVo.remark?response.data.shipBookingVo.remark:'',
            shipBookingDate : response.data.shipBookingVo.shipBookingDate,//时间


            cuxiao1:response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.slice(ceshi1+2,ceshi2):'',
            cuxiao2:response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.slice(ceshi2+3,ceshi3):'',
            cuxiao3:response.data.shipBookingVo.lables?response.data.shipBookingVo.lables.slice(ceshi3+3,lables.length):'',

          });

          console.log(this.state.cuxiao1)
          console.log(this.state.cuxiao2)
          console.log(this.state.cuxiao3)
        }
      }
    });

  }

  //提交事件
  hanlujia =()=>{
    let startPortCn = this.state.startPortCn?this.state.startPortCn:''; //起始港（中文）
    let startPortEn = this.state.startPortEn?this.state.startPortEn:''; //起始港（英文）
    let endPortCn = this.state.endPortCn?this.state.endPortCn:'';   //目的港（中文）
    let endPortEn = this.state.endPortEn?this.state.endPortEn:'';   //目的港（英文）
    let cuxiao1 = this.state.cuxiao1?this.state.cuxiao1:''
    let cuxiao2 = this.state.cuxiao2?this.state.cuxiao2:''
    let cuxiao3 = this.state.cuxiao3?this.state.cuxiao3:''
    let haiyunTwentyGpTejia = this.state.haiyunTwentyGpTejia?this.state.haiyunTwentyGpTejia:''; //20GP特价
    let haiyunTwentyGpYuanjia = this.state.haiyunTwentyGpYuanjia?this.state.haiyunTwentyGpYuanjia:'';   //20GP原价
    let haiyunFortyGpTejia = this.state.haiyunFortyGpTejia?this.state.haiyunFortyGpTejia:'';  //40GP特价
    let haiyunFortyGpYuanjia = this.state.haiyunFortyGpYuanjia?this.state.haiyunFortyGpYuanjia:'';    //40GP原价
    let haiyunFortyHqTejia = this.state.haiyunFortyHqTejia?this.state.haiyunFortyHqTejia:'';  //40HQ特价
    let haiyunFortyHqYuanjia = this.state.haiyunFortyHqYuanjia?this.state.haiyunFortyHqYuanjia:'';    //40HQ原价
    let matouTwentyGp = this.state.matouTwentyGp?this.state.matouTwentyGp:'';   //码头费20GP
    let matouFortyGp = this.state.matouFortyGp?this.state.matouFortyGp:'';    //码头费40GP
    let matouFortyHq = this.state.matouFortyHq?this.state.matouFortyHq:'';    //码头费40HQ
    let wenjianTwentyGp = this.state.wenjianTwentyGp?this.state.wenjianTwentyGp:''; //文件费20GP
    let wenjianFortyGp = this.state.wenjianFortyGp?this.state.wenjianFortyGp:'';  //文件费40GP
    let wenjianFortyHq = this.state.wenjianFortyHq?this.state.wenjianFortyHq:'';  //文件费40HQ
    let amsTwentyGp = this.state.amsTwentyGp?this.state.amsTwentyGp:''; //MAS20GP
    let amsFortyGp = this.state.amsFortyGp?this.state.amsFortyGp:'';  //MAS40GP
    let amsFortyHq = this.state.amsFortyHq?this.state.amsFortyHq:'';  //MAS40HQ
    let remark = this.state.remark?this.state.remark:'';
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';

    let cuxiao = '1:'+cuxiao1 +'#'+'2:'+cuxiao2 +'#'+'3:'+cuxiao3;


    const { form } = this.props;
    const timeList = [];
    form.validateFields((errors, values) => {
      console.log(values)
      for (let i = 0; i <= id_t; i++) {
        if (values[`names${i}`]) {
          if (!values[`names${i}`] || !values[`aa${i}`]) {
            message.error('请选择截关时间和开船时间');
            return;
          }
          const closingTime = values[`names${i}`] ? moment(values[`names${i}`]).format('YYYY-MM-DD') : null;
          const sailingTime = values[`aa${i}`] ? moment(values[`aa${i}`]).format('YYYY-MM-DD') : null;
          const voyage = values[`bb${i}`] ? values[`bb${i}`] : null;
          timeList.push({
            'closingTime':closingTime,'sailingTime':sailingTime,'voyage':voyage,
          });

        }
      }
      console.info('timeList', timeList);
    });



      let requestData = {
        startPortCn : startPortCn ,//起始港（中文）
        startPortEn : startPortEn ,//起始港（英文）
        endPortCn : endPortCn,  //目的港（中文）
        endPortEn : endPortEn,  //目的港（英文）
        haiyunTwentyGpTejia : haiyunTwentyGpTejia,//20GP特价
        haiyunTwentyGpYuanjia : haiyunTwentyGpYuanjia,  //20GP原价
        haiyunFortyGpTejia : haiyunFortyGpTejia, //40GP特价
        haiyunFortyGpYuanjia : haiyunFortyGpYuanjia,   //40GP原价
        haiyunFortyHqTejia : haiyunFortyHqTejia, //40HQ特价
        haiyunFortyHqYuanjia : haiyunFortyHqYuanjia,   //40HQ原价
        matouTwentyGp : matouTwentyGp,  //码头费20GP
        matouFortyGp : matouFortyGp,   //码头费40GP
        matouFortyHq : matouFortyHq,   //码头费40HQ
        wenjianTwentyGp : wenjianTwentyGp,//文件费20GP
        wenjianFortyGp : wenjianFortyGp, //文件费40GP
        wenjianFortyHq : wenjianFortyHq, //文件费40HQ
        amsTwentyGp : amsTwentyGp,//MAS20GP
        amsFortyGp : amsFortyGp, //MAS40GP
        amsFortyHq : amsFortyHq, //MAS40HQ
        shipBookingDate:timeList,
        lables:cuxiao,//标签
        remark:remark,
        guid:uid
      };
      this.setState({requestData})
      console.log(requestData)

      if(timeList == undefined){
        message.error('请填写（截关时间）和（开船时间）');
      }else{

        postRequest('/business/shipBooking/addShipBooking', JSON.stringify(requestData), (response: any) => {
          console.log('1111')
          console.log('~~~~~~~~~~~')
          console.log(response)
          if (response.status === 200) {
            // 跳转首页
            message.success('提交成功');
            this.props.history.push('/linerBooking/edit');
          }else{
            message.error('提交失败');
          };
        });
      }
    }




  //返回事件
  onBack = () => {
    this.props.history.push('/linerBooking/edit');
  };


  //添加截关时间和开船时间👇
  remove = (k) => {

    const { form } = this.props;

    const keys = form.getFieldValue("keys");

    console.log(keys)



    if (keys.length === 0) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter((key) => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id_t++);
    console.log(keys);
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmit = (e) => {

    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names, aa,bb } = values;
        console.log(keys.map((key) => ['startDate：'+names[key], 'endDate：'+aa[key],]));
      }
    });

  };
//到这里结束👆


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };

    const formlayout_s = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    const smallFormItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };

    const { shipBookingDate } = this.state;
    getFieldDecorator("keys", { initialValue: shipBookingDate ? shipBookingDate : [0] });

      const keys = getFieldValue("keys") ? getFieldValue("keys") : [];
      const formItems = keys.map((k, index) => (
        <Form.Item
          {...formlayout}
          required={false}
          key={k.closingTime}
        >
          <InputGroup size="large">
            <Row gutter={24}>
              <Col span={6}>
                {getFieldDecorator(`names${index}`, {
                  validateTrigger: ["onChange", "onBlur"],
                  initialValue: k.closingTime ? moment(k.closingTime) : null,
                  // rules: [
                  //   {
                  //     required: true,
                  //     whitespace: true,
                  //     message: "展开后请输入"
                  //   }
                  // ]
                })(
                    <DatePicker
                      format='YYYY-MM-DD'
                      placeholder="请选择截关时间日期"
                    />
                )}
              </Col>
              <Col span={6}>
                {getFieldDecorator(`aa${index}`, {
                  validateTrigger: ["onChange", "onBlur"],
                  initialValue: k.sailingTime ? moment(k.sailingTime) : null,
                  // rules: [
                  //   {
                  //     required: true,
                  //     whitespace: true,
                  //     message: "哈哈哈哈哈"
                  //   }
                  // ]
                })(
                    <DatePicker
                      format='YYYY-MM-DD'
                      placeholder="请选择开船时间"
                    />
                )}
              </Col>
              <Col span={6}>
                {getFieldDecorator(`bb${index}`, {
                  validateTrigger: ["onChange", "onBlur"],
                  initialValue: k.voyage ? k.voyage : null,
                  // rules: [
                  //   {
                  //     required: true,
                  //     whitespace: true,
                  //     message: "哈哈哈哈哈"
                  //   }
                  // ]
                })(
                    <Input
                      placeholder="航程时间"
                    />
                )}
              </Col>
              <Col span={4}>
                {keys.length > 1 ? (
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.remove(k)}
                  />
                ) : null}
              </Col>
            </Row>
          </InputGroup>

        </Form.Item>
      ));

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={
            isNil(this.state) || isNil(this.state.title)
              ? '编辑修改班轮订舱'
              : '编辑修改班轮订舱'
          }
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="起始港">
                  <InputGroup >
                      <Col span={8}>
                        <Input
                          placeholder="此处输入港口英文"
                          onChange={e => this.setState({ startPortEn: e.target.value })}
                          value={
                            isNil(this.state) || isNil(this.state.startPortEn)
                            ? ''
                            : this.state.startPortEn
                            }
                        />
                      </Col>
                      <Col span={8}>
                        <Input
                          placeholder="此处输入港口中文"
                          onChange={e => this.setState({ startPortCn: e.target.value })}
                          value={
                            isNil(this.state) || isNil(this.state.startPortCn)
                              ? ''
                              : this.state.startPortCn
                          }
                        />
                      </Col>
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="目的港">
                  <InputGroup >

                      <Col span={8}>
                        <Input
                          placeholder="此处输入港口英文"
                          onChange={e => this.setState({ endPortEn: e.target.value })}
                          value={
                            isNil(this.state) || isNil(this.state.endPortEn)
                              ? ''
                              : this.state.endPortEn
                            }
                          />
                      </Col>
                      <Col span={8}>
                        <Input
                          placeholder="此处输入港口中文"
                          onChange={e => this.setState({ endPortCn: e.target.value })}
                          value={
                            isNil(this.state) || isNil(this.state.endPortCn)
                              ? ''
                              : this.state.endPortCn
                            }
                          />
                      </Col>

                  </InputGroup>
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={24}>
              <Form labelAlign="left" onSubmit={this.handleSubmit}>
                {formItems}
                <Form.Item {...formlayout}>
                  <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
                    <Icon type="plus" /> 添加截关时间与开船时间
                  </Button>
                </Form.Item>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item required {...formlayout} label="促销标签">
                      <InputGroup >
                          <Col span={8}>
                            <Input
                              placeholder="请输入四字促销标签1"
                              maxLength={4}
                              onChange={e => this.setState({ cuxiao1: e.target.value })}
                              value={
                                isNil(this.state) || isNil(this.state.cuxiao1) ? '' : this.state.cuxiao1
                              }
                              />
                          </Col>
                          <Col span={8}>
                            <Input
                              placeholder="请输入四字促销标签2"
                              maxLength={4}
                              onChange={e => this.setState({ cuxiao2: e.target.value })}
                              value={
                                isNil(this.state) || isNil(this.state.cuxiao2) ? '' : this.state.cuxiao2
                              }
                              />
                          </Col>
                          <Col span={8}>
                            <Input
                              placeholder="请输入四字促销标签3"
                              maxLength={4}
                              onChange={e => this.setState({ cuxiao3: e.target.value })}
                              value={
                                isNil(this.state) || isNil(this.state.cuxiao3) ? '' : this.state.cuxiao3
                              }
                              />
                          </Col>
                      </InputGroup>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>运费</span>
                </div>
                <Row gutter={24}>
                  <Col span={4}>
                    <h4>
                      海运费
                    </h4>
                  </Col>
                  <Col span={4}>
                    <h4>
                      20GP
                    </h4>
                  </Col>
                  <Col span={4}>
                    <h4>
                      40GP
                    </h4>
                  </Col>
                  <Col span={4}>
                    <h4>
                      40HQ
                    </h4>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={4}>
                    <h4 style={{marginLeft:'120px'}}>
                      限时特价
                    </h4>
                  </Col>
                  <Col span={4}>
                    <Input
                      onChange={e => this.setState({ haiyunTwentyGpTejia: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.haiyunTwentyGpTejia) ? '' : this.state.haiyunTwentyGpTejia
                      }
                      />
                  </Col>
                  <Col span={4}>
                    <Input
                      onChange={e => this.setState({ haiyunFortyGpTejia: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.haiyunFortyGpTejia) ? '' : this.state.haiyunFortyGpTejia
                      }
                      />
                  </Col>
                  <Col span={4}>
                    <Input
                      onChange={e => this.setState({ haiyunFortyHqTejia: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.haiyunFortyHqTejia) ? '' : this.state.haiyunFortyHqTejia
                      }
                      />
                  </Col>
                </Row>
                <br></br>
                <Row gutter={24}>
                  <Col span={4}>
                    <h4 style={{marginLeft:'120px'}}>
                      原价
                    </h4>
                  </Col>



                  <Col span={4}>
                    <Input
                      style={{textDecorationLine:'line-through'}}
                      onChange={e => this.setState({ haiyunTwentyGpYuanjia: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.haiyunTwentyGpYuanjia) ? '' : this.state.haiyunTwentyGpYuanjia
                      }
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      style={{textDecorationLine:'line-through'}}
                      onChange={e => this.setState({ haiyunFortyGpYuanjia: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.haiyunFortyGpYuanjia) ? '' : this.state.haiyunFortyGpYuanjia
                      }
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      style={{textDecorationLine:'line-through'}}
                      onChange={e => this.setState({ haiyunFortyHqYuanjia: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.haiyunFortyHqYuanjia) ? '' : this.state.haiyunFortyHqYuanjia
                      }
                    />
                  </Col>
                </Row>
                <br></br>
                <Row gutter={24}>
                  <Col span={4}>
                    <h4 >
                      码头费
                    </h4>
                  </Col>
                  <Col span={4}>
                    <Input
                      onChange={e => this.setState({ matouTwentyGp: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.matouTwentyGp) ? '' : this.state.matouTwentyGp
                        }
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                        onChange={e => this.setState({ matouFortyGp: e.target.value })}
                        value={
                          isNil(this.state) || isNil(this.state.matouFortyGp) ? '' : this.state.matouFortyGp
                          }
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                        onChange={e => this.setState({ matouFortyHq: e.target.value })}
                        value={
                          isNil(this.state) || isNil(this.state.matouFortyHq) ? '' : this.state.matouFortyHq
                          }
                    />
                  </Col>
                </Row>
                <br></br>
                <Row gutter={24}>
                  <Col span={4}>
                    <h4 >
                      文件费
                    </h4>
                  </Col>
                  <Col span={4}>
                    <Input
                      onChange={e => this.setState({ wenjianTwentyGp: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.wenjianTwentyGp) ? '' : this.state.wenjianTwentyGp
                        }
                      />
                  </Col>
                  <Col span={4}>
                    <Input
                      onChange={e => this.setState({ wenjianFortyGp: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.wenjianFortyGp) ? '' : this.state.wenjianFortyGp
                        }
                      />
                  </Col>
                  <Col span={4}>
                    <Input
                      onChange={e => this.setState({ wenjianFortyHq: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.wenjianFortyHq) ? '' : this.state.wenjianFortyHq
                        }
                      />
                  </Col>
                </Row>
                <br></br>
                <Row gutter={24}>
                  <Col span={4}>
                    <h4 >
                      AMS
                    </h4>
                  </Col>
                  <Col span={4}>
                    <Input
                      onChange={e => this.setState({ amsTwentyGp: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.amsTwentyGp) ? '' : this.state.amsTwentyGp
                        }
                      />
                  </Col>
                  <Col span={4}>
                    <Input
                      onChange={e => this.setState({ amsFortyGp: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.amsFortyGp) ? '' : this.state.amsFortyGp
                        }
                      />
                  </Col>
                  <Col span={4}>
                    <Input
                      onChange={e => this.setState({ amsFortyHq: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.amsFortyHq) ? '' : this.state.amsFortyHq
                        }
                      />
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>班轮优势</span>
                </div>
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...smallFormItemLayout} label="班轮优势信息">
                      <Input.TextArea
                        maxLength={300}
                        style={{ width: '100%', height: '200px' }}
                        onChange={e => this.setState({ remark: e.target.value })}
                        value={
                          isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                        }
                        />
                    </Form.Item>
                  </Col>
                </Row>
                {/* <Row gutter={24}>
                  <Col span={6}>
                    <Form.Item {...formlayout}>
                      <Button type="primary" htmlType="submit" onClick={this.onBack} style={{width: '100%',backgroundColor:'#135A8D',color: '#FFFFFF',
                      }}>
                        关闭
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item {...formlayout}>
                      <Button type="primary" htmlType="submit" onClick={this.hanlujia} style={{width: '100%',backgroundColor:'#135A8D',color: '#FFFFFF',
                      }}>
                        提交
                      </Button>
                    </Form.Item>
                  </Col>
                </Row> */}
                <Row className={commonCss.rowTop}>
                    <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                      <ButtonOptionComponent
                        type="TurnDown"
                        text="关闭"
                        event={() => this.onBack()}
                        disabled={false}
                      />
                    </Col>
                    <Col span={12}>
                      <ButtonOptionComponent
                        type="Approve"
                        text="确认提交"
                        event={() => this.hanlujia()}
                        disabled={false}
                      />
                    </Col>
                </Row>
              </Form>
            </Row>

          </Form>
        </div>
      </div>
    );
  }

}

const PalletAdd_Form = Form.create({ name: 'PalletAdd_Form' })(PalletAdd);

export default PalletAdd_Form;
