import React from 'react';
import { getRequest, putRequest,postRequest,deleteRequest } from '@/utils/request';
import {
  Col,
  Divider,
  Row,
  Steps,
  message,
  Form,
  Typography,
  Checkbox,
  Modal,
  Upload,
  Timeline,
  Card,
  Input,
  Anchor,
  Button,
  Icon,
  List,
  DatePicker,
  Select,
  InputNumber,
} from 'antd';
import HrComponent from '@/pages/Common/Components/HrComponent';
import { RouteComponentProps } from 'dva/router';
import { isNil, forEach, filter } from 'lodash';
import commonCss from '../../Common/css/CommonCss.less';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import { OrderViewFormProps, FileMsg, LogisticsInfo } from './OrderViewInterface';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import moment from 'moment';
import { linkHref,getTableEnumText } from '@/utils/utils';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import ManagerLeft from '@/layouts/ManagerLeft';
import e from 'express';
import { exportExcel } from 'xlsx-oc'
// import commonCss from './index.css';


const provinceData = [ '请选择公司','上海道裕物流科技有限公司', '上海林风国际货运代理有限公司',];
const cityData = {
  请选择公司: [],
  上海道裕物流科技有限公司: [ '中国银行上海市共康支行', ' 448175443917',],
  上海林风国际货运代理有限公司: [ '中国银行上海市分行共康支行', '439063871324',],
};
const { Option } = Select;
const { Step } = Steps;
const { Text } = Typography;
const { confirm } = Modal;
const { Link } = Anchor;
const InputGroup = Input.Group;

let id_t = 0;

type OrderProps = OrderViewFormProps & RouteComponentProps;

class MyOrderView extends React.Component<OrderViewFormProps, OrderProps> {
  private userType = localStorage.getItem('userType');

  state = {
    cities: cityData[provinceData[0]],
    secondCity: cityData[provinceData[0]][0],
  };

  componentDidMount = () => {

    this.setState({

      visible: false,
      CGCG:'G',
      urls:'http://58.33.34.10:10443/images/truck/'//照片地址
    });


      this.dingdan()  //订单查询信息

  };

  //订单查询信息
  dingdan=()=>{
    let params: Map<string, any> = new Map();
    let guid = this.props.match.params['guid'];
    getRequest('/business/oil/getOilOrderDetailForWeb?guid=' + guid +'&', params, (response: any) => {
      console.log(response)
      if (response.status === 200) {
        //把查询到的信息data赋值给页面
        if (!isNil(response.data.orderDto)) {
          this.setState({
            orderNumber:response.data.orderDto.orderNumber,//订单编号
            createDate:response.data.orderDto.createDate,//下单时间
            stationName:response.data.orderDto.stationName,
            fuelName:response.data.orderDto.fuelName,
            price:response.data.orderDto.price,
            howL:response.data.orderDto.howL,
            amountPayable:response.data.orderDto.amountPayable,
            actualPayment:response.data.orderDto.actualPayment,
            isDiscount:response.data.orderDto.isDiscount,
            rebate:response.data.orderDto.rebate,
            payType:response.data.orderDto.payType?response.data.orderDto.payType==1?'支付宝':'微信':'',
            serialNumber:response.data.orderDto.serialNumber,
            licensePlateNumber:response.data.orderDto.licensePlateNumber,
            userName:response.data.orderDto.userName,
          })
        }
      }
    });

  }



  // 返回
  onBack = () => {
    this.props.history.push('/promotion/list');
  };

  render() {

    const formlayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };

    return (
      <div className={commonCss.container}>
          <Card bordered={false}>
          <div className={commonCss.container}>
            <LabelTitleComponent text="加油订单详情" event={() => this.onBack()} />
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单编号">
                    <Input disabled
                            value = {isNil(this.state) || isNil(this.state.orderNumber) ? '' : this.state.orderNumber}

                        ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单时间">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.createDate) ? '' :   moment(this.state.createDate).format('YYYY/MM/DD')}

                        ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="油站名称">
                    <Input disabled
                            value = {isNil(this.state) || isNil(this.state.stationName) ? '' : this.state.stationName}

                        ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="油品名称">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.fuelName) ? '' : this.state.fuelName }

                        ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="油品单价（元）">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.price) ? '' : this.state.price}>
                      </Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="油量（升）">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.howL) ? '' : this.state.howL}>
                      </Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="应付消费总价（元）">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.amountPayable) ? '' : this.state.amountPayable}>
                      </Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="实付消费总价（元）">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.actualPayment) ? '' : this.state.actualPayment}>
                      </Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="优惠总价（元）">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.isDiscount) ? '' : this.state.isDiscount}>
                      </Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="本次加油返利（元）">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.rebate) ? '' : this.state.rebate}>
                      </Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付方式">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.payType) ? '' : this.state.payType}>
                      </Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付流水号">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.serialNumber) ? '' : this.state.serialNumber}>
                      </Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="车牌号">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.licensePlateNumber) ? '' : this.state.licensePlateNumber}>
                      </Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="司机姓名">
                      <Input disabled
                            value = {isNil(this.state) || isNil(this.state.userName) ? '' : this.state.userName}>
                      </Input>
                    </Form.Item>
                  </Col>
                </Row>
                    <Row gutter={24}>
                      <Col span={24} >
                        <div style={{width:'100%',textAlign:'center'}}>
                          <Button style={{backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.onBack} >
                            关闭
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>

            <Divider dashed={true} />
          </div>
          </Card>

        <Modal className="picModal"
          visible={
            isNil(this.state) || isNil(this.state.previewVisible)
              ? false
              : this.state.previewVisible
          }
          footer={null}
          onCancel={this.handleCancel}
        >
          <img
            alt="example"
            style={{ width: '100%' }}
            src={isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage}
          />
          <a onClick={()=>linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
        </Modal>
      </div>
    );
  }
}

const MyOrderView_Form = Form.create({ name: 'MyOrderView_Form' })(MyOrderView);

export default MyOrderView_Form;
