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
import { Col, DatePicker, Form, Icon, Input, message, Modal, Row, Select, Upload, Button, Icon, Radio } from 'antd';
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
    let portName = this.state.portName?this.state.portName:''; //起始港（英文）
    let remark = this.state.remark?this.state.remark:''
    let qita ;
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        const { keys, names, aa, bb } = values;
        let names_s = keys.map((key)=>{return {'size':names[key],'type':aa[key],'money':bb[key]}})
        qita = names_s
        console.log(qita)
      }
    });
      let requestData = {
        portName : portName ,//起始港（英文）
        detail:qita,
        remark:remark,
      };
      // this.setState({requestData})
      console.log(requestData)

      if(qita == undefined){
        message.error('请填写集装箱信息');
      }else{
        postRequest('/business/shipBooking/postContainerTrading', JSON.stringify(requestData), (response: any) => {
          console.log('1111')
          console.log('~~~~~~~~~~~')
          console.log(response)
          if (response.status === 200) {
            // 跳转首页
            message.success('提交成功');
            this.props.history.push('/containerTrading/edit');
          }else{
            message.error(response.message);
          };
        });
      }
    }




  //返回事件
  onBack = () => {
    this.props.history.push('/containerTrading/edit');
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
                  <Form.Item required  label="集装箱尺寸">
                    <Input
                      placeholder="20GP 或 40HQ....等"
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
                  <Form.Item required  label="全新/二手">
                    {/* <Input
                      placeholder="全新/二手"
                    /> */}

                    <Radio.Group  buttonStyle="solid" size='large'>
                      <Radio.Button style={{ color: '#000000', fontSize: 'large' }} value={0}>全新</Radio.Button>
                      <Radio.Button style={{ color: '#000000', fontSize: 'large' }} value={1}>二手</Radio.Button>
                    </Radio.Group>
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
                  <Form.Item required  label="价格">
                    <Input
                      placeholder="￥123465，$123465 等"
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
          text={ '新增集装箱买箱'}
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item required {...formlayout} label="交箱地点">
                  <InputGroup >
                      <Col span={8}>
                        <Input placeholder="交箱地点"  onChange={e => this.setState({ portName: e.target.value })}/>
                      </Col>
                      <Col span={8}>

                      </Col>
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={12}>
              </Col>

            </Row>


            <Row gutter={24}>
              <Form labelAlign="left" onSubmit={this.handleSubmit}>
                {formItems}
                <Form.Item {...formlayout}>
                  <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
                    <Icon type="plus" /> 添加新的信息
                  </Button>
                </Form.Item>


                <div className={commonCss.title}>
                  <span className={commonCss.text}>集装箱购买说明</span>
                </div>
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...smallFormItemLayout} label="集装箱购买说明">
                      <Input.TextArea maxLength={300} style={{ width: '100%', height: '200px' }} onChange={e => this.setState({ remark: e.target.value })}/>
                    </Form.Item>
                  </Col>
                </Row>

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
