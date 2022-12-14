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
let id_t = 1;

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
    visible: false,
    requestData:{},
    visibleGG: false,
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
      visible: false,
      visibleGG: false,
    });
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';

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
    let reamkl = this.state.reamkl?this.state.reamkl:''
    let cuxiao = '1:'+cuxiao1 +'#'+'2:'+cuxiao2 +'#'+'3:'+cuxiao3;
    console.log(cuxiao)
    let qita ;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names, aa, bb } = values;
        let names_s = keys.map((key)=>{return {'closingTime':names[key],'sailingTime':aa[key],'voyage':bb[key]}})
        qita = names_s
        console.log(qita)
      }
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
        lables:cuxiao,//标签
        shipBookingDate:qita,
        remark:reamkl,
      };
      this.setState({requestData})
      console.log(requestData)

      if(qita == undefined){
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
    console.log(id_t);
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names, aa,bb } = values;
        console.log(keys.map((key) => ['startDate：'+names[key], 'endDate：'+aa[key], 'voyage'+bb[key]]));
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
    getFieldDecorator("keys", { initialValue: [0] });
      const keys = getFieldValue("keys");
      const formItems = keys.map((k, index) => (
        <Form.Item
          {...formlayout}
          required={false}
          key={k}
        >
          <InputGroup size="large">
            <Row gutter={24}>
              <Col span={6}>
                {getFieldDecorator(`names[${k}]`, {
                  validateTrigger: ["onChange", "onBlur"],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "展开后请输入"
                    }
                  ]
                })(
                  <Form.Item required  label="截关时间">
                    <Input type="date"
                      placeholder="passenger name"
                    />
                  </Form.Item>
                )}
              </Col>
              <Col span={6}>
                {getFieldDecorator(`aa[${k}]`, {
                  validateTrigger: ["onChange", "onBlur"],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "哈哈哈哈哈"
                    }
                  ]
                })(
                  <Form.Item required  label="开船时间">
                    <Input type="date"
                      placeholder="passenger name"
                    />
                  </Form.Item>
                )}
              </Col>
              <Col span={6}>
                {getFieldDecorator(`bb[${k}]`, {
                  validateTrigger: ["onChange", "onBlur"],
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "哈哈哈哈哈"
                    }
                  ]
                })(
                  <Form.Item required  label="航程">
                    <Input
                      placeholder="航程时间"
                    />
                  </Form.Item>
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
                        <Input placeholder="此处输入港口英文"  onChange={e => this.setState({ startPortEn: e.target.value })}/>
                      </Col>
                      <Col span={8}>
                        <Input placeholder="此处输入港口中文" onChange={e => this.setState({ startPortCn: e.target.value })}/>
                      </Col>
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="目的港">
                  <InputGroup >

                      <Col span={8}>
                        <Input placeholder="此处输入港口英文" onChange={e => this.setState({ endPortEn: e.target.value })}/>
                      </Col>
                      <Col span={8}>
                        <Input placeholder="此处输入港口中文" onChange={e => this.setState({ endPortCn: e.target.value })}/>
                      </Col>

                  </InputGroup>
                </Form.Item>
              </Col>

            </Row>
            {/* <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label='是否需要其他联合运输'>
                {
                    getFieldDecorator('qq', {
                      rules:[{
                          required:false,
                          pattern: new RegExp(/^[0-9]+(\.[0-9]{1,2})?$/, "g"),
                          message: '请正确输入一到两位小数的正数'
                      }],
                      getValueFromEvent: (event) => {
                          return event.target.value.replace(/\D\./g,'')
                      },
                      initialValue:''
                  })(<Input style={{ width:'40%',marginLeft:'30px' }}

                  onChange={e => this.setState({ lianheMoney: e.target.value})} />)

                }
                </Form.Item>
              </Col>
            </Row> */}

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
                            <Input placeholder="请输入四字促销标签1"  onChange={e => this.setState({ cuxiao1: e.target.value })}/>
                          </Col>
                          <Col span={8}>
                            <Input placeholder="请输入四字促销标签2"  onChange={e => this.setState({ cuxiao2: e.target.value })}/>
                          </Col>
                          <Col span={8}>
                            <Input placeholder="请输入四字促销标签3"  onChange={e => this.setState({ cuxiao3: e.target.value })}/>
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
                    <Input onChange={e => this.setState({ haiyunTwentyGpTejia: e.target.value })}/>
                  </Col>
                  <Col span={4}>
                    <Input onChange={e => this.setState({ haiyunFortyGpTejia: e.target.value })}/>
                  </Col>
                  <Col span={4}>
                    <Input onChange={e => this.setState({ haiyunFortyHqTejia: e.target.value })}/>
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
                    <Input style={{textDecorationLine:'line-through'}} onChange={e => this.setState({ haiyunTwentyGpYuanjia: e.target.value })}/>
                  </Col>
                  <Col span={4}>
                    <Input style={{textDecorationLine:'line-through'}} onChange={e => this.setState({ haiyunFortyGpYuanjia: e.target.value })}/>
                  </Col>
                  <Col span={4}>
                    <Input style={{textDecorationLine:'line-through'}} onChange={e => this.setState({ haiyunFortyHqYuanjia: e.target.value })}/>
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
                    <Input  onChange={e => this.setState({ matouTwentyGp: e.target.value })}/>
                  </Col>
                  <Col span={4}>
                    <Input  onChange={e => this.setState({ matouFortyGp: e.target.value })}/>
                  </Col>
                  <Col span={4}>
                    <Input  onChange={e => this.setState({ matouFortyHq: e.target.value })}/>
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
                    <Input  onChange={e => this.setState({ wenjianTwentyGp: e.target.value })}/>
                  </Col>
                  <Col span={4}>
                    <Input  onChange={e => this.setState({ wenjianFortyGp: e.target.value })}/>
                  </Col>
                  <Col span={4}>
                    <Input  onChange={e => this.setState({ wenjianFortyHq: e.target.value })}/>
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
                    <Input  onChange={e => this.setState({ amsTwentyGp: e.target.value })}/>
                  </Col>
                  <Col span={4}>
                    <Input  onChange={e => this.setState({ amsFortyGp: e.target.value })}/>
                  </Col>
                  <Col span={4}>
                    <Input  onChange={e => this.setState({ amsFortyHq: e.target.value })}/>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>班轮优势</span>
                </div>
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...smallFormItemLayout} label="班轮优势信息">
                      <Input.TextArea maxLength={300} style={{ width: '100%', height: '200px' }} onChange={e => this.setState({ reamkl: e.target.value })}/>
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
