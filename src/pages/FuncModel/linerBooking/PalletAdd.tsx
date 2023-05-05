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
import { getRequest, postRequest, putRequest } from '@/utils/request';
import { items } from '@/utils/utils';
import { getDictDetail, linkHref } from '@/utils/utils';
import { checkNumber, checkRate, HandleBeforeUpload } from '@/utils/validator';
import {
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
  Button,
} from 'antd';
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

type PalletProps =  RouteComponentProps;
class PalletAdd extends React.Component<PalletProps> {
  constructor(prop: PalletFormProps) {
    super(prop);
  }

  state = {
    visible: false,
    requestData: {},
    visibleGG: false,
    companyItem: [],
    startPortCn: '',
    startPortEn: '',
    endPortCn: '',
    endPortEn: '',
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

    let companyItem: items[] = [];
    //调取查询保险公司列表接口,获取页面的保险公司下拉值
    let ship: Map<string, string> = new Map();
    getRequest('/business/shipCompany/getShipCompany', ship, (response: any) => {
      if (response.status === 200) {
        companyItem = [];
        //把查询到的信息data赋值给页面
        if (!isNil(response.data)) {
          forEach(response.data, (item, index) => {
            companyItem.push({ code: item.guid, textValue: item.shipCompany });
          });
        }
        this.setState({ companyItem: companyItem });
      }
    });
    let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
  }

  //提交事件
  hanlujia = () => {
    let startPortCn = this.state.startPortCn ? this.state.startPortCn : ''; //起始港（中文）
    let startPortEn = this.state.startPortEn ? this.state.startPortEn : ''; //起始港（英文）
    let endPortCn = this.state.endPortCn ? this.state.endPortCn : ''; //目的港（中文）
    let endPortEn = this.state.endPortEn ? this.state.endPortEn : ''; //目的港（英文）
    let cuxiao1 = this.state.cuxiao1 ? this.state.cuxiao1 : '';
    let cuxiao2 = this.state.cuxiao2 ? this.state.cuxiao2 : '';
    let cuxiao3 = this.state.cuxiao3 ? this.state.cuxiao3 : '';
    let haiyunTwentyGpTejia = this.state.haiyunTwentyGpTejia ? this.state.haiyunTwentyGpTejia : ''; //20GP特价
    let haiyunTwentyGpYuanjia = this.state.haiyunTwentyGpYuanjia
      ? this.state.haiyunTwentyGpYuanjia
      : ''; //20GP原价
    let haiyunFortyGpTejia = this.state.haiyunFortyGpTejia ? this.state.haiyunFortyGpTejia : ''; //40GP特价
    let haiyunFortyGpYuanjia = this.state.haiyunFortyGpYuanjia
      ? this.state.haiyunFortyGpYuanjia
      : ''; //40GP原价
    let haiyunFortyHqTejia = this.state.haiyunFortyHqTejia ? this.state.haiyunFortyHqTejia : ''; //40HQ特价
    let haiyunFortyHqYuanjia = this.state.haiyunFortyHqYuanjia
      ? this.state.haiyunFortyHqYuanjia
      : ''; //40HQ原价
    let dingcangTwentyGp = this.state.dingcangTwentyGp ? this.state.dingcangTwentyGp : ''; //订舱费20GP
    let dingcangFortyGp = this.state.dingcangFortyGp ? this.state.dingcangFortyGp : ''; //订舱费40GP
    let dingcangFortyHq = this.state.dingcangFortyHq ? this.state.dingcangFortyHq : ''; //订舱费40HQ
    let wenjianTwentyGp = this.state.wenjianTwentyGp ? this.state.wenjianTwentyGp : ''; //文件费20GP
    let wenjianFortyGp = this.state.wenjianFortyGp ? this.state.wenjianFortyGp : ''; //文件费40GP
    let wenjianFortyHq = this.state.wenjianFortyHq ? this.state.wenjianFortyHq : ''; //文件费40HQ
    let caozuoTwentyGp = this.state.caozuoTwentyGp ? this.state.caozuoTwentyGp : ''; //船代操作费20GP
    let caozuoFortyGp = this.state.caozuoFortyGp ? this.state.caozuoFortyGp : ''; //船代操作费40GP
    let caozuoFortyHq = this.state.caozuoFortyHq ? this.state.caozuoFortyHq : ''; //船代操作费40HQ

    let eirTwentyGp = this.state.eirTwentyGp ? this.state.eirTwentyGp : ''; //EIR20GP
    let eirFortyGp = this.state.eirFortyGp ? this.state.eirFortyGp : ''; //EIR40GP
    let eirFortyHq = this.state.eirFortyHq ? this.state.eirFortyHq : ''; //EIR40HQ

    let thcTwentyGp = this.state.thcTwentyGp ? this.state.thcTwentyGp : ''; //thc20GP
    let thcFortyGp = this.state.thcFortyGp ? this.state.thcFortyGp : ''; //thc40GP
    let thcFortyHq = this.state.thcFortyHq ? this.state.thcFortyHq : ''; //thc40HQ

    let fengzhiTwentyGp = this.state.fengzhiTwentyGp ? this.state.fengzhiTwentyGp : ''; //封志费20GP
    let fengzhiFortyGp = this.state.fengzhiFortyGp ? this.state.fengzhiFortyGp : ''; //封志费40GP
    let fengzhiFortyHq = this.state.fengzhiFortyHq ? this.state.fengzhiFortyHq : ''; //封志费40HQ

    let chuandanTwentyGp = this.state.chuandanTwentyGp ? this.state.chuandanTwentyGp : ''; //船单费20GP
    let chuandanFortyGp = this.state.chuandanFortyGp ? this.state.chuandanFortyGp : ''; //船单费40GP
    let chuandanFortyHq = this.state.chuandanFortyHq ? this.state.chuandanFortyHq : ''; //船单费40HQ
    let reamkl = this.state.reamkl ? this.state.reamkl : '';
    let cuxiao = '1:' + cuxiao1 + '#' + '2:' + cuxiao2 + '#' + '3:' + cuxiao3;
    let qita;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names, aa, bb } = values;
        let names_s = keys.map(key => {
          return { closingTime: names[key], sailingTime: aa[key], voyage: bb[key] };
        });
        qita = names_s;
      }
    });
    let requestData = {
      startPortCn: startPortCn, //起始港（中文）
      startPortEn: startPortEn, //起始港（英文）
      endPortCn: endPortCn, //目的港（中文）
      endPortEn: endPortEn, //目的港（英文）
      // haiyunTwentyGpTejia: haiyunTwentyGpTejia, //20GP特价
      haiyunTwentyGpYuanjia: haiyunTwentyGpYuanjia, //20GP价格
      // haiyunFortyGpTejia: haiyunFortyGpTejia, //40GP特价
      haiyunFortyGpYuanjia: haiyunFortyGpYuanjia, //40GP价格
      // haiyunFortyHqTejia: haiyunFortyHqTejia, //40HQ特价
      haiyunFortyHqYuanjia: haiyunFortyHqYuanjia, //40HQ价格
      wenjianTwentyGp: wenjianTwentyGp, //文件费20GP
      wenjianFortyGp: wenjianFortyGp, //文件费40GP
      wenjianFortyHq: wenjianFortyHq, //文件费40HQ
      dingcangTwentyGp: dingcangTwentyGp, //订舱费20GP
      dingcangFortyGp: dingcangFortyGp, //订舱费40GP
      dingcangFortyHq: dingcangFortyHq, //订舱费40HQ
      caozuoTwentyGp: caozuoTwentyGp, //船代操作费20GP
      caozuoFortyGp: caozuoFortyGp, //船代操作费40GP
      caozuoFortyHq: caozuoFortyHq, //船代操作费40HQ
      eirTwentyGp: eirTwentyGp, //EIR20GP
      eirFortyGp: eirFortyGp, //EIR40GP
      eirFortyHq: eirFortyHq, //EIR40HQ
      thcTwentyGp: thcTwentyGp, //thc20GP
      thcFortyGp: thcFortyGp, //thc40GP
      thcFortyHq: thcFortyHq, //thc40HQ
      fengzhiTwentyGp: fengzhiTwentyGp, //封志费20GP
      fengzhiFortyGp: fengzhiFortyGp, //封志费40GP
      fengzhiFortyHq: fengzhiFortyHq, //封志费40HQ
      chuandanTwentyGp: chuandanTwentyGp, //船单费20GP
      chuandanFortyGp: chuandanFortyGp, //船单费40GP
      chuandanFortyHq: chuandanFortyHq, //船单费40HQ
      lables: cuxiao, //标签
      shipBookingDate: qita,
      remark: reamkl,
    };
    this.setState({ requestData });
    if (qita !== undefined) {
      message.error('请填写（截关时间）和（开船时间）');
    } else {
      postRequest(
        '/business/shipBooking/addShipBooking',
        JSON.stringify(requestData),
        (response: any) => {
          if (response.status === 200) {
            // 跳转首页
            message.success('提交成功');
            this.props.history.push('/linerBooking/list');
          } else {
            message.error('提交失败');
          }
        },
      );
    }
  };

  //返回事件
  onBack = () => {
    this.props.history.push('/linerBooking/edit');
  };

  //添加截关时间和开船时间👇
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 0) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id_t++);
    console.log(id_t);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names, aa, bb } = values;
        console.log(
          keys.map(key => ['startDate：' + names[key], 'endDate：' + aa[key], 'voyage' + bb[key]]),
        );
      }
    });
  };
  //到这里结束👆

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const companyItem =
      isNil(this.state) || isNil(this.state.companyItem) ? [] : this.state.companyItem;

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
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    const smallFormItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item {...formlayout} required={false} key={k}>
        <InputGroup size="large">
          <Row gutter={24}>
            {/* <Col span={6}>
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
              </Col> */}
            <Col span={6}>
              {getFieldDecorator(`aa[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '哈哈哈哈哈',
                  },
                ],
              })(
                <Form.Item required label="船期">
                  <Input type="date" placeholder="passenger name" />
                </Form.Item>,
              )}
            </Col>
            <Col span={6}>
              {getFieldDecorator(`bb[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '哈哈哈哈哈',
                  },
                ],
              })(
                <Form.Item required label="航程">
                  <Input placeholder="航程时间" />
                </Form.Item>,
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
            isNil(this.state) || isNil(this.state.title) ? '编辑修改班轮订舱' : '编辑修改班轮订舱'
          }
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
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
          <Form labelAlign="left" onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="起始港">
                  <InputGroup>
                    <Col span={8}>
                      <Input
                        placeholder="此处输入港口英文"
                        onChange={e => this.setState({ startPortEn: e.target.value })}
                      />
                    </Col>
                    <Col span={8}>
                      <Input
                        placeholder="此处输入港口中文"
                        onChange={e => this.setState({ startPortCn: e.target.value })}
                      />
                    </Col>
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item required {...formlayout} label="目的港">
                  <InputGroup>
                    <Col span={8}>
                      <Input
                        placeholder="此处输入港口英文"
                        onChange={e => this.setState({ endPortEn: e.target.value })}
                      />
                    </Col>
                    <Col span={8}>
                      <Input
                        placeholder="此处输入港口中文"
                        onChange={e => this.setState({ endPortCn: e.target.value })}
                      />
                    </Col>
                  </InputGroup>
                </Form.Item>
              </Col>
            </Row>
            {formItems}
            <Form.Item {...formlayout}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> 添加船期
              </Button>
            </Form.Item>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="促销标签">
                  <InputGroup>
                    <Col span={8}>
                      <Input
                        placeholder="请输入四字促销标签1"
                        onChange={e => this.setState({ cuxiao1: e.target.value })}
                      />
                    </Col>
                    <Col span={8}>
                      <Input
                        placeholder="请输入四字促销标签2"
                        onChange={e => this.setState({ cuxiao2: e.target.value })}
                      />
                    </Col>
                    <Col span={8}>
                      <Input
                        placeholder="请输入四字促销标签3"
                        onChange={e => this.setState({ cuxiao3: e.target.value })}
                      />
                    </Col>
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={12}></Col>
            </Row>
            <div className={commonCss.title}>
              <span className={commonCss.text}>运费</span>
            </div>
            <Row gutter={24}>
              <Col span={4}>
                <h4 style={{ fontWeight: 'bolder' }}>海运费</h4>
              </Col>
              <Col span={4}>
                <h4>20GP</h4>
              </Col>
              <Col span={4}>
                <h4>40GP</h4>
              </Col>
              <Col span={4}>
                <h4>40HQ</h4>
              </Col>
            </Row>
            {/* <Row gutter={24}>
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
                </Row> */}
            <br></br>
            <Row gutter={24}>
              <Col span={4}>
                <h4 style={{ marginLeft: '120px' }}>价格</h4>
              </Col>
              <Col span={4}>
                <Input
                  style={{ textDecorationLine: 'line-through' }}
                  onChange={e => this.setState({ haiyunTwentyGpYuanjia: e.target.value })}
                />
              </Col>
              <Col span={4}>
                <Input
                  style={{ textDecorationLine: 'line-through' }}
                  onChange={e => this.setState({ haiyunFortyGpYuanjia: e.target.value })}
                />
              </Col>
              <Col span={4}>
                <Input
                  style={{ textDecorationLine: 'line-through' }}
                  onChange={e => this.setState({ haiyunFortyHqYuanjia: e.target.value })}
                />
              </Col>
            </Row>
            <br></br>
            <Row gutter={24}>
              <Col span={4}>
                <h4 style={{ fontWeight: 'bolder' }}>其他服务费</h4>
              </Col>
            </Row>
            <br></br>
            <Row gutter={24}>
              <Col span={4}>
                <h4>文件费</h4>
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ wenjianTwentyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ wenjianFortyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ wenjianFortyHq: e.target.value })} />
              </Col>
            </Row>
            <br></br>
            <Row gutter={24}>
              <Col span={4}>
                <h4>订舱费</h4>
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ dingcangTwentyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ dingcangFortyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ dingcangFortyHq: e.target.value })} />
              </Col>
            </Row>
            <br></br>
            <Row gutter={24}>
              <Col span={4}>
                <h4>船代操作费</h4>
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ caozuoTwentyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ caozuoFortyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ caozuoFortyHq: e.target.value })} />
              </Col>
            </Row>
            <br></br>
            <Row gutter={24}>
              <Col span={4}>
                <h4>EIR</h4>
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ eirTwentyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ eirFortyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ eirFortyHq: e.target.value })} />
              </Col>
            </Row>
            <br></br>
            <Row gutter={24}>
              <Col span={4}>
                <h4>THC</h4>
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ thcTwentyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ thcFortyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ thcFortyHq: e.target.value })} />
              </Col>
            </Row>
            <br></br>
            <Row gutter={24}>
              <Col span={4}>
                <h4>封志费</h4>
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ fengzhiTwentyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ fengzhiFortyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ fengzhiFortyHq: e.target.value })} />
              </Col>
            </Row>
            <br></br>
            <Row gutter={24}>
              <Col span={4}>
                <h4>舱单费</h4>
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ chuandanTwentyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ chuandanFortyGp: e.target.value })} />
              </Col>
              <Col span={4}>
                <Input onChange={e => this.setState({ chuandanFortyHq: e.target.value })} />
              </Col>
            </Row>
            <div className={commonCss.title}>
              <span className={commonCss.text}>船公司及其他</span>
            </div>
            <br></br>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="所属船公司">
                  <InputGroup>
                    <Col span={24}>
                      <Select
                        style={{ width: '33%' }}
                        placeholder="请选择船公司"
                        onChange={e => this.setState({ shipCompany: e })}
                      >
                        {companyItem.map((item: any) => (
                          <Select.Option value={item.code}>{item.textValue}</Select.Option>
                        ))}
                      </Select>
                    </Col>
                  </InputGroup>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="供应商编号">
                  <InputGroup>
                    <Col span={8}>
                      <Input
                        placeholder=""
                        onChange={e => this.setState({ startPortEn: e.target.value })}
                      />
                    </Col>
                  </InputGroup>
                </Form.Item>
              </Col>
            </Row>
            <div className={commonCss.title}>
              <span className={commonCss.text}>备注</span>
            </div>
            <Row gutter={24}>
              <Col>
                <Form.Item {...smallFormItemLayout} label="备注信息">
                  <Input.TextArea
                    maxLength={300}
                    style={{ width: '100%', height: '200px' }}
                    onChange={e => this.setState({ reamkl: e.target.value })}
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
        </div>
      </div>
    );
  }
}

const PalletAdd_Form = Form.create({ name: 'PalletAdd_Form' })(PalletAdd);

export default PalletAdd_Form;
