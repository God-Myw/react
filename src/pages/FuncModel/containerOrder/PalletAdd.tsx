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
      let country = this.state.country?this.state.country:''; //还箱国家

      let containerFourtyEight = this.state.containerFourtyEight?this.state.containerFourtyEight:''; //48英尺

      let containerFiftyThree = this.state.containerFiftyThree?this.state.containerFiftyThree:'';   //53 英尺

      let containerFourtyEightTejia = this.state.containerFourtyEightTejia?this.state.containerFourtyEightTejia:'';   //48 特价

      let containerFiftyThreeTejia = this.state.containerFiftyThreeTejia?this.state.containerFiftyThreeTejia:''; //53特价

      let containerFourtyEightYuanjia = this.state.containerFourtyEightYuanjia?this.state.containerFourtyEightYuanjia:'';   //48英尺原价

      let containerFiftyThreeYuanjia = this.state.containerFiftyThreeYuanjia?this.state.containerFiftyThreeYuanjia:'';  //53 原价

      let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';

      let requestData = {
        country : country ,//还箱国家
        containerFourtyEight : containerFourtyEight ,//48英尺
        containerFiftyThree : containerFiftyThree,  //53 英尺
        containerFourtyEightTejia : containerFourtyEightTejia,  //48 特价
        containerFiftyThreeTejia : containerFiftyThreeTejia,//53特价
        containerFourtyEightYuanjia : containerFourtyEightYuanjia,  //48英尺原价
        containerFiftyThreeYuanjia : containerFiftyThreeYuanjia, //53 原价
        guid:uid,
      };
      this.setState({requestData})
      console.log(requestData)

        postRequest('/business/shipBooking/insertContainerLeasingForWeb', JSON.stringify(requestData), (response: any) => {
          console.log('1111')
          console.log('~~~~~~~~~~~')
          console.log(response)
          if (response.status === 200) {
            // 跳转首页
            message.success('提交成功');
            this.props.history.push('/containerOrder/edit');
          }else{
            message.error('提交失败');
          };
        });

    }




  //返回事件
  onBack = () => {
    this.props.history.push('/containerOrder/edit');
  };



  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };


    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={
            isNil(this.state) || isNil(this.state.title)
              ? '新增集装箱租赁'
              : '新增集装箱租赁'
          }
          event={() => this.onBack()}
        />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="还箱国家">
                    <InputGroup >
                        <Col span={8}>
                          <Input   onChange={e => this.setState({ country: e.target.value })}/>
                        </Col>

                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="集装箱尺寸">
                    <InputGroup >
                        <Col span={8} style={{textAlign:'center'}}>
                        {/* 48英尺 */}
                          <p>48英尺👇</p>
                        </Col>
                        <Col span={8} style={{textAlign:'center'}}>
                        {/* 53 英尺 */}
                          <p>53英尺👇</p>
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="集装箱尺寸">
                    <InputGroup >
                        <Col span={8}>
                        {/* 48英尺 */}
                          <Input   onChange={e => this.setState({ containerFourtyEight: e.target.value })}/>
                        </Col>
                        <Col span={8}>
                        {/* 53 英尺 */}
                          <Input  onChange={e => this.setState({ containerFiftyThree: e.target.value })}/>
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>
                </Col>
              </Row>
              <Row gutter={24}>

                <Col span={12}>
                  <Form.Item required {...formlayout} label="限时特价">
                    <InputGroup >

                        <Col span={8}>
                          {/* 48特价 */}
                          <Input  onChange={e => this.setState({ containerFourtyEightTejia: e.target.value })}/>
                        </Col>
                        <Col span={8}>
                            {/* 53特价 */}
                          <Input  onChange={e => this.setState({ containerFiftyThreeTejia: e.target.value })}/>
                        </Col>

                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>

                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="原价">
                    <InputGroup >
                        <Col span={8}>
                          {/* 48原价 */}
                          <Input style={{textDecorationLine:'line-through'}}  onChange={e => this.setState({ containerFourtyEightYuanjia: e.target.value })}/>
                        </Col>
                        <Col span={8}>
                          {/* 48特价 */}
                          <Input style={{textDecorationLine:'line-through'}} onChange={e => this.setState({ containerFiftyThreeYuanjia: e.target.value })}/>
                        </Col>
                    </InputGroup>
                  </Form.Item>
                </Col>
                <Col span={12}>

                </Col>

              </Row>


            <Row gutter={24}>
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
            </Row>

          </Form>
        </div>
      </div>
    );
  }

}

const PalletAdd_Form = Form.create({ name: 'PalletAdd_Form' })(PalletAdd);

export default PalletAdd_Form;
