import React from 'react';
import { getRequest, putRequest, postRequest, deleteRequest } from '@/utils/request';
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
import { linkHref, getTableEnumText } from '@/utils/utils';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import ManagerLeft from '@/layouts/ManagerLeft';
import e from 'express';
import { exportExcel } from 'xlsx-oc';
// import commonCss from './index.css';

const provinceData = ['请选择公司', '上海道裕物流科技有限公司', '上海林风国际货运代理有限公司'];
const cityData = {
  请选择公司: [],
  上海道裕物流科技有限公司: ['中国银行上海市共康支行', ' 448175443917'],
  上海林风国际货运代理有限公司: ['中国银行上海市分行共康支行', '439063871324'],
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
    let guid = this.props.match.params['guid'];

    let orderTitleType = this.props.match.params['orderTitleType'];
    let checkStatus = this.props.match.params['checkStatus'];
    let deliverStatus = this.props.match.params['deliverStatus'];
    let orderAllType = this.props.match.params['orderAllType'];
    console.log(orderTitleType, checkStatus, deliverStatus, orderAllType);
    // let deliverStatus = this.props.match.params['deliverStatus'];
    this.setState({
      //orderTitleType 支付状态 1生成订单 2定金支付 3运输中 4尾款支付 5交易完成
      //checkStatus 支付审核    0 未申请 1未审核 2未通过 3通过
      //deliverStatus 发货状态  0未发货 1已发货
      //orderAllType 1订单确认中；2待支付定金；3已支付定金；4已发货-运输中；5待支付尾款；6已支付尾款；7待支付***; 8已支付***; 9已完成；
      orderTitleType: orderTitleType,
      checkStatus: checkStatus,
      deliverStatus: deliverStatus,
      orderAllType: orderAllType, //这个东西用来细分上面的小东西，比如支付信息的展示
      zhifu: 0, //支付选择
      zfdj: 0, //支付定金
      tiaozhuan: 0, //跳转设置
      qtfw: 0, //其他服务支付设置
      zfwk: 0, //尾款支付设置
      feiyungmingxi: 0, //其他服务费用明细
      kaipiaomingxi: 0, //开票明细
      visible: false,
      CGCG: 'G',
      urls: 'http://58.33.34.10:10443/images/', //照片地址
    });

    //顶部步骤条显示状态
    if (orderTitleType == 1) {
      this.dingdan(); //订单查询信息
      this.setState({
        current: 0,
      });
    } else if (orderTitleType == 2) {
      this.dingjin(); //定金信息查询
      this.setState({
        current: 1,
      });
    } else if (orderTitleType == 3) {
      this.yunshuzhong(); //运输中信息查询
      this.setState({
        current: 2,
      });
    } else if (orderTitleType == 4) {
      this.zhifuweiktihuo(); //支付尾款并提货信息查询
      this.setState({
        current: 3,
      });
    } else if (orderTitleType == 5) {
      this.jiaoyiwancheng(); //交易完成
      this.setState({
        current: 4,
      });
    }

    let params: Map<string, any> = new Map();
    params.set('type', 3);
  };

  //订单查询信息
  dingdan = () => {
    let params: Map<string, any> = new Map();
    let guid = this.props.match.params['guid'];
    getRequest(
      '/business/order/getOrderDepositPaymentDetailForWeb?guid=' + guid + '&',
      params,
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            let htfj; //合同附件
            let dz; //单证
            if (response.data.attachmentsHeTong) {
              htfj = response.data.attachmentsHeTong.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              htfj = []; //合同附件
            }

            if (response.data.attachmentsDanZheng) {
              dz = response.data.attachmentsDanZheng.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              dz = []; ////单证
            }

            this.setState({
              quotationDto: response.data.quotationDto == null ? '' : [response.data.quotationDto], // 船东报价
              quotationKefuDto:
                response.data.quotationKefuDto == null ? '' : [response.data.quotationKefuDto], //  服务费报价
              palletDto: response.data.palletDto, //货盘详情
              palletUserAttachmentImg: response.data.palletUserAttachmentImg, //货物清单
              voyageDto: response.data, //全部货盘信息和航次信息
              voyagePort: response.data.voyageDto.voyagePort, //航次信息
              dingdank: response.data.order.remark, //备注
              order: response.data.order, //订单详情
              htxqzishu: htfj.length, //合同数量
              dzxxxx: dz.length, //单证数量
              htxq: htfj, //合同附件
              dzxx: dz, //单证
            });
            console.log(this.state.quotationKefuDto.length);
            console.log(this.state.quotationKefuDto[0] == null);
            console.log(this.state.dingdank);
          }
        }
      },
    );
  };

  //定金支付信息查询
  dingjin = () => {
    let params: Map<string, any> = new Map();
    let guid = this.props.match.params['guid'];
    getRequest(
      '/business/order/getOrderDepositPaymentDetailForWeb?guid=' + guid + '&',
      params,
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            let djhtfj; //合同附件
            let djdz; //单证
            let djattachements; //定金信息
            if (response.data.attachmentsHeTong) {
              djhtfj = response.data.attachmentsHeTong.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              djhtfj = []; //合同附件
            }

            if (response.data.attachmentsDanZheng) {
              djdz = response.data.attachmentsDanZheng.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              djdz = []; ////单证
            }

            if (response.data.attachements) {
              djattachements = response.data.attachements.map((value, item, key) => {
                return {
                  name: value.fileName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                  depositMoneyType: value.depositMoneyType,
                };
              });
            } else {
              djattachements = []; ////定金信息
            }
            this.setState({
              quotationDto: response.data.quotationDto == null ? '' : [response.data.quotationDto], // 船东报价
              quotationKefuDto:
                response.data.quotationKefuDto == null ? '' : [response.data.quotationKefuDto], //  服务费报价
              palletDto: response.data.palletDto, //货盘详情
              palletUserAttachmentImg: response.data.palletUserAttachmentImg, //货物清单
              voyageDto: response.data, //全部货盘信息和航次信息
              voyagePort: response.data.voyageDto.voyagePort, //航次信息
              dingjink: response.data.order.remark, //备注

              order: response.data.order, //订单详情
              htfj: response.data.attachmentsHeTong, //合同附件
              djdzz: response.data.attachmentsDanZheng, //单证

              djattachementss: djattachements, //定金详情
              htxqzishu: djhtfj.length, //合同数量
              dzxxxxx: djdz.length, //单证数量
              htxq: djhtfj, //合同附件
              djxx: djdz, //单证
            });
            console.log(this.state.djattachementss);
          }
        }
      },
    );
  };

  //运输中信息查询
  yunshuzhong = () => {
    let params: Map<string, any> = new Map();
    let guid = this.props.match.params['guid'];
    getRequest(
      '/business/order/getOrderTransitDetailForWeb?guid=' + guid + '&',
      params,
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            let attachementss; //定金支付信息
            let attachementTransit; //其他服务费信息
            let attachmentsJianYanBaoGao; //检验报告
            let attachmentsBaoHan; //保函信息
            let attachmentsTiDan; //提单信息
            let attachmentsDanZheng; //单证信息
            let attachmentsHeTong; //合同信息
            if (response.data.attachements) {
              attachementss = response.data.attachements.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                  depositMoneyType: value.depositMoneyType,
                };
              });
            } else {
              attachementss = []; //定金支付信息
            }

            if (response.data.attachementTransit) {
              attachementTransit = response.data.attachementTransit.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                  guid: value.guid,
                  depositMoneyType: value.depositMoneyType,
                };
              });
            } else {
              attachementTransit = []; //其他服务费信息
            }

            if (response.data.attachmentsJianYanBaoGao) {
              attachmentsJianYanBaoGao = response.data.attachmentsJianYanBaoGao.map(
                (value, item, key) => {
                  return {
                    name: value.fileOriginName,
                    status: 'done',
                    uid: item,
                    url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                    date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                    depositDount: value.depositDount,
                  };
                },
              );
            } else {
              attachmentsJianYanBaoGao = []; //检验报告
            }

            if (response.data.attachmentsBaoHan) {
              attachmentsBaoHan = response.data.attachmentsBaoHan.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsBaoHan = []; //保函信息
            }

            if (response.data.attachmentsTiDan) {
              attachmentsTiDan = response.data.attachmentsTiDan.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsTiDan = []; //提单信息
            }

            if (response.data.attachmentsDanZheng) {
              attachmentsDanZheng = response.data.attachmentsDanZheng.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsDanZheng = []; //单证信息
            }
            if (response.data.attachmentsHeTong) {
              attachmentsHeTong = response.data.attachmentsHeTong.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsHeTong = []; //合同信息
            }

            this.setState({
              quotationDto: response.data.quotationDto == null ? '' : [response.data.quotationDto], // 船东报价
              quotationKefuDto:
                response.data.quotationKefuDto == null ? '' : [response.data.quotationKefuDto], //  服务费报价
              palletDto: response.data.palletDto, //货盘详情
              palletUserAttachmentImg: response.data.palletUserAttachmentImg, //货物清单
              voyageDto: response.data, //全部货盘信息和航次信息
              voyagePort: response.data.voyageDto.voyagePort, //航次信息
              yunshuremark: response.data.order.remark, //备注

              attachements: attachementss, //定金支付信息图片
              attachementTransits: attachementTransit, //其他服务费信息
              attachmentsJianYanBaoGaos: attachmentsJianYanBaoGao, //检验报告
              attachmentsBaoHans: attachmentsBaoHan, //保函
              attachmentsTiDans: attachmentsTiDan, //提单信息
              attachmentsDanZhengs: attachmentsDanZheng, //单证信息

              jianyanbaogaoshuliang: attachmentsJianYanBaoGao.length, //检验报告数量
              baohanshuliang: attachmentsBaoHan.length, //保函数量
              tidanshuliang: attachmentsTiDan.length, //提单信息数量
              danzhengshuliang: attachmentsDanZheng.length, //单证信息数量

              attachmentsHeTongs: attachmentsHeTong, //合同信息

              guidd: this.props.match.params['guid'],
            });
            console.log(this.state.attachementTransits);
          }
        }
      },
    );
  };

  //支付尾款并提货信息查询
  zhifuweiktihuo = () => {
    let params: Map<string, any> = new Map();
    let guid = this.props.match.params['guid'];
    getRequest(
      '/business/order/getFinalPaymentDetailForWeb?guid=' + guid + '&',
      params,
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            let attachementsss; //定金支付信息
            let attachementTransits; //其他服务费信息
            let attachmentsJianYanBaoGaos; //检验报告
            let attachmentsBaoHans; //保函信息
            let attachmentsTiDans; //提单信息
            let attachmentsDanZhengs; //单证信息
            let attachmentsHeTongs; //合同信息
            let weikuanzhifuxinxi; //尾款支付
            if (response.data.attachements) {
              attachementsss = response.data.attachements.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                  depositMoneyType: value.depositMoneyType,
                };
              });
            } else {
              attachementsss = []; //定金支付信息
            }

            if (response.data.attachmentsHeTong) {
              attachmentsHeTongs = response.data.attachmentsHeTong.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsHeTongs = []; //合同信息
            }

            if (response.data.attachementFinalPayment) {
              weikuanzhifuxinxi = response.data.attachementFinalPayment.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                  guid: value.guid,
                };
              });
            } else {
              weikuanzhifuxinxi = []; ///尾款支付
            }

            if (response.data.attachmentsJianYanBaoGao) {
              attachmentsJianYanBaoGaos = response.data.attachmentsJianYanBaoGao.map(
                (value, item, key) => {
                  return {
                    name: value.fileOriginName,
                    status: 'done',
                    uid: item,
                    url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                    date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                    depositDount: value.depositDount,
                  };
                },
              );
            } else {
              attachmentsJianYanBaoGaos = []; //其他服务费信息
            }

            if (response.data.attachmentsBaoHan) {
              attachmentsBaoHans = response.data.attachmentsBaoHan.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsBaoHans = []; //保函信息
            }

            if (response.data.attachmentsTiDan) {
              attachmentsTiDans = response.data.attachmentsTiDan.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsTiDans = []; //提单信息
            }

            if (response.data.attachmentsDanZheng) {
              attachmentsDanZhengs = response.data.attachmentsDanZheng.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsDanZhengs = []; //单证信息
            }
            if (response.data.attachmentsHeTong) {
              attachmentsHeTongs = response.data.attachmentsHeTong.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsHeTongs = []; //合同信息
            }

            this.setState({
              quotationDto: response.data.quotationDto == null ? '' : [response.data.quotationDto], // 船东报价
              quotationKefuDto:
                response.data.quotationKefuDto == null ? '' : [response.data.quotationKefuDto], //  服务费报价
              palletDto: response.data.palletDto, //货盘详情
              palletUserAttachmentImg: response.data.palletUserAttachmentImg, //货物清单
              voyageDto: response.data, //全部货盘信息和航次信息
              voyagePort: response.data.voyageDto.voyagePort, //航次信息
              zhifuweikbeizhu: response.data.order.remark, //备注

              weikuanzhifulalalal: weikuanzhifuxinxi, //尾款支付
              attachementsa: attachementsss, //定金支付信息图片
              attachementTransitsa: attachementTransits, //其他服务费信息
              attachmentsJianYanBaoGaosa: attachmentsJianYanBaoGaos, //检验报告
              attachmentsBaoHansa: attachmentsBaoHans, //保函
              attachmentsTiDansa: attachmentsTiDans, //提单信息
              attachmentsDanZhengsa: attachmentsDanZhengs, //单证信息

              weikuantidanshuliang: attachmentsTiDans.length, //提单信息数量
              weikuandanzheng: attachmentsDanZhengs.length, //单证信息数量

              attachmentsHeTongsa: attachmentsHeTongs, //合同信息
            });
          }
        }
      },
    );
  };

  //交易完成
  jiaoyiwancheng = () => {
    let params: Map<string, any> = new Map();
    let guid = this.props.match.params['guid'];
    getRequest(
      '/business/order/getFinalPaymentDetailForWeb?guid=' + guid + '&',
      params,
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            let attachementsss; //定金支付信息
            let attachementTransits; //其他服务费信息
            let attachmentsJianYanBaoGaos; //检验报告
            let attachmentsBaoHans; //保函信息
            let attachmentsTiDans; //提单信息
            let attachmentsDanZhengs; //单证信息
            let attachmentsHeTongs; //合同信息
            let weikuanzhifuxinxi; //尾款支付
            if (response.data.attachements) {
              attachementsss = response.data.attachements.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                  depositMoneyType: value.depositMoneyType,
                };
              });
            } else {
              attachementsss = []; //定金支付信息
            }

            if (response.data.attachementTransit) {
              attachementTransits = response.data.attachementTransit.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                  guid: value.guid,
                };
              });
            } else {
              attachementTransits = []; //其他服务费信息
            }

            if (response.data.attachmentsJianYanBaoGao) {
              attachmentsJianYanBaoGaos = response.data.attachmentsJianYanBaoGao.map(
                (value, item, key) => {
                  return {
                    name: value.fileOriginName,
                    status: 'done',
                    uid: item,
                    url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                    date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                    depositDount: value.depositDount,
                  };
                },
              );
            } else {
              attachmentsJianYanBaoGaos = []; //其他服务费信息
            }

            if (response.data.attachmentsBaoHan) {
              attachmentsBaoHans = response.data.attachmentsBaoHan.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsBaoHans = []; //保函信息
            }

            if (response.data.attachmentsTiDan) {
              attachmentsTiDans = response.data.attachmentsTiDan.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsTiDans = []; //提单信息
            }

            if (response.data.attachmentsDanZheng) {
              attachmentsDanZhengs = response.data.attachmentsDanZheng.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsDanZhengs = []; //单证信息
            }
            if (response.data.attachmentsHeTong) {
              attachmentsHeTongs = response.data.attachmentsHeTong.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                };
              });
            } else {
              attachmentsHeTongs = []; //合同信息
            }

            if (response.data.attachementFinalPayment) {
              weikuanzhifuxinxi = response.data.attachementFinalPayment.map((value, item, key) => {
                return {
                  name: value.fileOriginName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.fileName,
                  date: moment(value.date).format('YYYY/MM/DD HH:mm:ss'),
                  depositDount: value.depositDount,
                  guid: value.guid,
                };
              });
            } else {
              weikuanzhifuxinxi = []; ///尾款支付
            }

            // attachementTransit
            this.setState({
              attachementsa: attachementsss, //定金支付信息图片
              weikuanzhifulalalal: weikuanzhifuxinxi, //尾款支付
              attachementTransitsa: attachementTransits, //其他服务费信息
              attachmentsJianYanBaoGaosa: attachmentsJianYanBaoGaos, //检验报告
              attachmentsBaoHansa: attachmentsBaoHans, //保函
              attachmentsTiDansa: attachmentsTiDans, //提单信息
              attachmentsDanZhengsasss: attachmentsDanZhengs, //单证信息
              jiayiwanchengdanzheng: attachmentsDanZhengs.length, //单证信息数字
              attachmentsHeTongsa: attachmentsHeTongs, //合同信息
              jiaoyiremark: response.data.order.remark, //备注

              quotationDto: response.data.quotationDto == null ? '' : [response.data.quotationDto], // 船东报价
              quotationKefuDto:
                response.data.quotationKefuDto == null ? '' : [response.data.quotationKefuDto], //  服务费报价
              palletDto: response.data.palletDto, //货盘详情
              palletUserAttachmentImg: response.data.palletUserAttachmentImg, //货物清单
              voyageDto: response.data, //全部货盘信息和航次信息
              voyagePort: response.data.voyageDto.voyagePort, //航次信息
            });
          }
        }
      },
    );
  };

  // 返回
  onBack = () => {
    // if (this.userType == '1') {
    //   this.props.history.push('/newOrder/list');
    // } else if (this.userType == '2') {
    //   this.props.history.push('/orderManagementOff/list');
    // } else {
    //   this.props.history.push('/orderManagementExamine/list');
    // }
    this.props.history.push('/newOrder/list');
  };

  // 导出
  export = () => {
    //定义表头
    console.log(this.state.datas);
    const list = [];
    for (let i = 0; i < this.state.datas.length; i++) {
      const item = this.state.datas[i];
      list.push({
        key: i,
        invoiceType:
          item.invoiceType == 0
            ? '增值发票'
            : item.invoiceType == 1
            ? '普通发票'
            : item.invoiceType == 2
            ? 'Debit Note'
            : '',
        name: item.name,
        companyName: item.companyName,
        phone: item.phone,
        taxpayerIdentificationCode: item.taxpayerIdentificationCode,
        address: item.address,
        invoiceContent: item.invoiceContent == 0 ? '服务明细' : '',
        type: item.type == 0 ? '尾款' : '服务费',
      });
    }
    const header = [
      { k: 'invoiceType', v: '发票类型' },
      { k: 'name', v: '收票人姓名' },
      { k: 'companyName', v: '发票抬头' },
      { k: 'phone', v: '收票人手机' },
      { k: 'taxpayerIdentificationCode', v: '纳税人识别码' },
      { k: 'address', v: '收票人地址' },
      { k: 'invoiceContent', v: '发票内容' },
      { k: 'type', v: '支付类型' },
    ];
    const fileName = '开票信息.xlsm';
    exportExcel(header, list, fileName);
  };

  //附件的删除
  shanchufujian = file => {
    console.log(file);
    let guid = this.props.match.params['guid'];

    let requestParam: Map<string, string> = new Map();
    // requestParam.set('fileName', file.name),

    deleteRequest(
      '/business/order/deleteFile?guid=' + guid + '&fileName=' + file.name,
      requestParam,
      (response: any) => {
        if (response.status == 200) {
          message.success('删除成功!');
          //刷新数据
          window.location.reload(true);
        } else if (response.status == 500) {
          window.location.reload(true);
          message.warning(response.message);
        }
      },
    );
  };

  //顶部步骤条函数
  onChange = (current: any) => {
    console.log(current);
    if (current == 0) {
      this.dingdan(); //订单查询信息
      this.setState({
        orderTitleType: 1,
        current: current,
        zhifu: 0, //支付选择
        zfdj: 0, //支付定金
        tiaozhuan: 0, //跳转设置
        qtfw: 0, //其他服务支付设置
        zfwk: 0, //尾款支付设置
        feiyungmingxi: 0, //费用明细
        kaipiaomingxi: 0, //开票明细
      });
    } else if (current == 1) {
      this.dingjin(); //定金信息查询
      this.setState({
        orderTitleType: 2,
        current: current,
        zhifu: 0, //支付选择
        zfdj: 0, //支付定金
        tiaozhuan: 0, //跳转设置
        qtfw: 0, //其他服务支付设置
        zfwk: 0, //尾款支付设置
        feiyungmingxi: 0, //费用明细
        kaipiaomingxi: 0, //开票明细
      });
    } else if (current == 2) {
      this.yunshuzhong(); //运输中信息查询
      this.setState({
        orderTitleType: 3,
        current: current,
        zhifu: 0, //支付选择
        zfdj: 0, //支付定金
        tiaozhuan: 0, //跳转设置
        qtfw: 0, //其他服务支付设置
        zfwk: 0, //尾款支付设置
        feiyungmingxi: 0, //费用明细
        kaipiaomingxi: 0, //开票明细
      });
    } else if (current == 3) {
      this.zhifuweiktihuo(); //支付尾款并提货信息查询
      this.setState({
        orderTitleType: 4,
        current: current,
        zhifu: 0, //支付选择
        zfdj: 0, //支付定金
        tiaozhuan: 0, //跳转设置
        qtfw: 0, //其他服务支付设置
        zfwk: 0, //尾款支付设置
        feiyungmingxi: 0, //费用明细
        kaipiaomingxi: 0, //开票明细
      });
    } else if (current == 4) {
      this.jiaoyiwancheng(); //交易完成
      this.setState({
        orderTitleType: 5,
        current: current,
        zhifu: 0, //支付选择
        zfdj: 0, //支付定金
        tiaozhuan: 0, //跳转设置
        qtfw: 0, //其他服务支付设置
        zfwk: 0, //尾款支付设置
        feiyungmingxi: 0, //费用明细
        kaipiaomingxi: 0, //开票明细
      });
    }
  };

  //取消预览
  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  // 图片预览

  handlePreview = async (type: any, file: any) => {
    let params: Map<string, string> = new Map();
    params.set('fileName', file.name);
    getRequest('/sys/file/getImageBase64/' + file.type, params, (response: any) => {
      //BUG131改修
      this.setState({
        previewImage: response.data.file.base64,
        previewVisible: true,
      });
    });
  };
  // 图片放大
  showModal = a => {
    console.log(a);
    this.setState({
      visible: true,
    });
    this.setState({
      bigImg: a,
    });
  };

  handleOk = (e: any) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e: any) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  baochun = () => {
    console.log(this.state.current);
  };

  //其他服务费用明细
  feiyongmingxi = e => {
    let guid = e[0];
    console.log(guid);

    this.setState({
      zhifu: 0,
      zfdj: 0, //支付定金
      tiaozhuan: 0, //跳转设置
      qtfw: 0, //其他服务支付设置
      zfwk: 0, //尾款支付设置
      feiyungmingxi: 1, //费用明细
      kaipiaomingxi: 0, //开票明细
    });
    let params: Map<string, any> = new Map();
    getRequest(
      '/business/order/getOrderOtherQuotationDetailById?guid=' + guid + '&',
      params,
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            let qit = [response.data.orderQuotation];
            let qitabaojia;
            if (qit) {
              qitabaojia = qit.map((value, item, key) => {
                return {
                  name: value.attachmentName,
                  status: 'done',
                  uid: item,
                  url: 'http://58.33.34.10:10443/images/order/' + value.attachmentName,
                };
              });
            } else {
              qitabaojia = []; //合同附件
            }

            this.setState({
              orderQuotation: response.data.orderQuotation, //详情
              orderQuotationOther: response.data.orderQuotationOther, //其他服务费自定义报价
              qitabaojialist: qitabaojia,
            });
            console.log(qitabaojia);
          }
        }
      },
    );
  };

  //查看开票明细
  kaipiaomingxi = e => {
    let guid = e;
    console.log(guid);

    this.setState({
      zhifu: 0,
      zfdj: 0, //支付定金
      tiaozhuan: 0, //跳转设置
      qtfw: 0, //其他服务支付设置
      zfwk: 0, //尾款支付设置
      feiyungmingxi: 0, //费用明细
      kaipiaomingxi: 1, //开票明细
    });

    let params: Map<string, any> = new Map();
    getRequest(
      '/business/order/getOrderInvoiceForWeb?guid=' + guid + '&',
      params,
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          //把查询到的信息data赋值给页面
          if (!isNil(response.data)) {
            this.setState({
              datas: response.data, //详情
            });
            console.log(this.state.datas);
          }
        }
      },
    );
  };

  //订单保存
  dingdanbaochun = () => {
    let guid = this.props.match.params['guid'];
    let DList = [];
    let dList = [];
    let requestData;
    let add;

    let ddhtList = this.state.htxq; //订单合同

    let dddzList = this.state.dzxx; //单证

    let adddd = this.state.htxqzishu; //订单合同数字
    let bdddd = this.state.dzxxxx; //订单单证数字

    console.log(adddd, bdddd);

    if (adddd == 0) {
      console.log(ddhtList);
    } else {
      ddhtList.splice(0, adddd);
      console.log(ddhtList);
    }

    if (ddhtList == undefined) {
      console.log('无订单合同');
    } else {
      DList = ddhtList.map(item => {
        return {
          fileName: item.response.data.fileName,
          fileOriginName: item.name,
          fileType: 'order',
          fileLog: 35,
          type: 0,
        };
      });
    }

    if (bdddd == 0) {
      console.log(dddzList);
    } else {
      dddzList.splice(0, bdddd);
      console.log(dddzList);
    }

    if (dddzList == undefined) {
      console.log('无单证');
    } else {
      dList = dddzList.map(item => {
        return {
          fileName: item.response.data.fileName,
          fileOriginName: item.name,
          fileType: 'order',
          fileLog: 12,
          type: 0,
        };
      });
    }

    console.log(dList);
    console.log(DList);

    if (DList != undefined) {
      dList.push(DList);
      add = _.flatten(dList);
    } else if (dList != undefined) {
      add = _.flatten(dList);
    } else if (DList != undefined && dList != undefined) {
      dList.push(DList);
      add = _.flatten(dList);
    } else {
      console.log('无数据');
    }

    let dingdank = this.state.dingdank ? this.state.dingdank : '无备注'; //订单备注

    requestData = add;

    console.log(requestData);
    postRequest(
      '/business/order/saveAttachmentForOrder/' + guid + '/' + dingdank,
      JSON.stringify(requestData),
      (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          message.success('提交成功');

          window.location.reload(true);
        } else {
          message.error('提交失败');
        }
      },
    );
    console.log(dingdank);
  };

  //订单上传合同
  handleChange = ({ file, fileList, event }) => {
    // console.log(file); // file 是当前正在上传的
    // console.log(fileList[0].response); // fileList 是已上传的全部  列表
    console.log(file, fileList, event);
    if (file.response) {
      let a = file.response.data.fileName;
      // console.log(a)
      this.setState({
        ddht: a,
      });
    } else {
      console.log(event);
    }

    let aaa = fileList;

    this.setState({
      htxq: fileList,
    });
  };

  //订单上传单证
  handleChange1 = ({ file, fileList, event }) => {
    // console.log(file); // file 是当前正在上传的 单个
    // console.log(fileList); // fileList 是已上传的全部  列表
    // console.log(file,fileList,event);
    if (file.response) {
      let a = file.fileName;
      // console.log(a)
      this.setState({
        dddz: a,
      });
    } else {
      console.log(event);
    }
    this.setState({
      dzxx: fileList,
    });
  };

  //定金保存
  dingjinbaochun = () => {
    let guid = this.props.match.params['guid'];
    let DList = [];
    let dList = [];
    let requestData;
    let add;
    let ddhtList = this.state.ddhtList; //订单合同
    let djxx = this.state.djxx; //单证

    let adddd = this.state.htxqzishu; //订单合同数字
    let bdddd = this.state.dzxxxxx; //订单单证数字

    console.log(djxx);

    // if(adddd == 0){
    //   console.log(ddhtList)

    // }else{
    //   ddhtList.splice(0, adddd)
    //   console.log(ddhtList)
    // }

    if (ddhtList == undefined) {
      console.log('无订单合同');
    } else {
      DList = ddhtList.map(item => {
        return {
          fileName: item.response.data.fileName,
          fileOriginName: item.name,
          fileType: 'order',
          fileLog: 35,
          type: 0,
        };
      });
    }

    if (bdddd == 0) {
      console.log(djxx);
    } else {
      djxx.splice(0, bdddd);
      console.log(djxx);
    }

    if (djxx == undefined) {
      console.log('无单证');
    } else {
      dList = djxx.map(item => {
        return {
          fileName: item.response.data.fileName,
          fileOriginName: item.name,
          fileType: 'order',
          fileLog: 12,
          type: 0,
        };
      });
    }

    console.log(dList);
    console.log(DList);

    if (DList != undefined) {
      dList.push(DList);
      add = _.flatten(dList);
    } else if (dList != undefined) {
      add = _.flatten(dList);
    } else if (DList != undefined && dList != undefined) {
      dList.push(DList);
      add = _.flatten(dList);
    } else {
      console.log('无数据');
    }
    let dingjink = this.state.dingjink ? this.state.dingjink : '无备注'; //订单备注

    requestData = add;

    console.log(requestData);

    postRequest(
      '/business/order/saveAttachmentForOrder/' + guid + '/' + dingjink,
      JSON.stringify(requestData),
      (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          message.success('提交成功');

          window.location.reload(true);
        } else {
          message.error('提交失败');
        }
      },
    );
  };
  //定金上传单证
  djdz = ({ file, fileList, event }) => {
    // console.log(file); // file 是当前正在上传的 单个
    // console.log(fileList); // fileList 是已上传的全部  列表
    // console.log(file,fileList,event);
    if (file.response) {
      let a = file.fileName;
      // console.log(a)
      this.setState({
        djdz: a,
      });
    } else {
      console.log(event);
    }
    this.setState({
      djxx: fileList,
    });
  };

  //运输保存
  ysbc = () => {
    let guid = this.props.match.params['guid'];

    let jjbg = this.state.attachmentsJianYanBaoGaos; //运输中上传检验报告
    let scbh = this.state.attachmentsBaoHans; //运输中上传保函
    let sctd = this.state.attachmentsTiDans; //运输中上传提单
    let scdz = this.state.attachmentsDanZhengs; //运输中单证

    let jianyanbaogaoshuliang = this.state.jianyanbaogaoshuliang; //检验报告数量
    let baohanshuliang = this.state.baohanshuliang; //保函数量
    let tidanshuliang = this.state.tidanshuliang; //提单信息数量
    let danzhengshuliang = this.state.danzhengshuliang; //单证信息数量

    console.log(jianyanbaogaoshuliang, baohanshuliang, tidanshuliang, danzhengshuliang);

    let actualWeight = this.state.actualWeight
      ? this.state.actualWeight.indexOf('.') > -1
        ? this.state.actualWeight
        : this.state.actualWeight + '.00'
      : this.state.voyageDto.order.actualWeight
      ? this.state.voyageDto.order.actualWeight
      : '0.0'; //实际体积
    let actualVolume = this.state.actualVolume
      ? this.state.actualVolume.indexOf('.') > -1
        ? this.state.actualVolume
        : this.state.actualVolume + '.00'
      : this.state.voyageDto.order.actualVolume
      ? this.state.voyageDto.order.actualVolume
      : '0.0'; //实际重量
    let haiyunMoney = this.state.haiyunMoneys
      ? this.state.haiyunMoneys.indexOf('.') > -1
        ? this.state.haiyunMoneys
        : this.state.haiyunMoneys + '.00'
      : this.state.voyageDto.order.haiyunMoney
      ? this.state.voyageDto.order.haiyunMoney
      : '0.0'; //海运费总额
    let haiyunMoneyType = this.state.haiyunMoneyType
      ? this.state.haiyunMoneyType
      : this.state.voyageDto.order.haiyunMoneyType
      ? this.state.voyageDto.order.haiyunMoneyType
      : 0; //运输中单位选择
    let remark = this.state.yunshuremark ? this.state.yunshuremark : '无备注'; //备注

    let jianyan = [];
    let baohan = [];
    let tidan = [];
    let danzheng = [];

    console.log(Number(actualWeight), actualVolume, haiyunMoney);

    //检验报告数量
    if (jianyanbaogaoshuliang == 0) {
      console.log(jjbg);
    } else {
      jjbg.splice(0, jianyanbaogaoshuliang);
      console.log(jjbg);
    }

    //保函数量
    if (baohanshuliang == 0) {
      console.log(scbh);
    } else {
      scbh.splice(0, baohanshuliang);
      console.log(scbh);
    }

    //提单信息数量
    if (tidanshuliang == 0) {
      console.log(sctd);
    } else {
      sctd.splice(0, tidanshuliang);
      console.log(sctd);
    }

    //单证信息数量
    if (danzhengshuliang == 0) {
      console.log(scdz);
    } else {
      scdz.splice(0, danzhengshuliang);
      console.log(scdz);
    }

    if (jjbg == undefined) {
      console.log('无检验报告');
    } else {
      jianyan = jjbg.map(item => {
        return {
          fileName: item.response.data.fileName,
          fileOriginName: item.name,
          fileType: 'order',
          fileLog: 37,
          type: 0,
        };
      });
    }

    if (scbh == undefined) {
      console.log('无保函');
    } else {
      baohan = scbh.map(item => {
        return {
          fileName: item.response.data.fileName,
          fileOriginName: item.name,
          fileType: 'order',
          fileLog: 36,
          type: 0,
        };
      });
    }

    if (sctd == undefined) {
      console.log('无提单');
    } else {
      tidan = sctd.map(item => {
        return {
          fileName: item.response.data.fileName,
          fileOriginName: item.name,
          fileType: 'order',
          fileLog: 16,
          type: 0,
        };
      });
    }

    if (scdz == undefined) {
      console.log('无单证');
    } else {
      danzheng = scdz.map(item => {
        return {
          fileName: item.response.data.fileName,
          fileOriginName: item.name,
          fileType: 'order',
          fileLog: 12,
          type: 0,
        };
      });
    }

    let add = [jianyan, baohan, tidan, danzheng];
    let bdd;
    let requestData;

    bdd = _.flatten(add);
    console.log(bdd);

    requestData = bdd;

    postRequest(
      '/business/order/saveTransitAttachmentForOrder/' +
        guid +
        '/' +
        remark +
        '/' +
        haiyunMoney +
        '/' +
        haiyunMoneyType +
        '/' +
        actualVolume +
        '/' +
        actualWeight,
      JSON.stringify(requestData),
      (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          message.success('提交成功');
          // this.yunshuzhong()//运输中信息查询
          window.location.reload(true);
        } else {
          message.error('提交失败');
        }
      },
    );
  };
  //运输中上传检验报告
  ysjy = ({ file, fileList, event }) => {
    if (file.response) {
      let a = file.response.data.fileName;
      // console.log(a)
      this.setState({
        ysjys: a,
      });
    } else {
      console.log(event);
    }
    this.setState({
      attachmentsJianYanBaoGaos: fileList,
    });
  };

  //运输中上传保函
  ysbh = ({ file, fileList, event }) => {
    if (file.response) {
      let a = file.response.data.fileName;
      // console.log(a)
      this.setState({
        ysbhs: a,
      });
    } else {
      console.log(event);
    }
    this.setState({
      attachmentsBaoHans: fileList,
    });
  };
  //运输中上传提单
  ystd = ({ file, fileList, event }) => {
    if (file.response) {
      let a = file.response.data.fileName;
      // console.log(a)
      this.setState({
        ystd: a,
      });
    } else {
      console.log(event);
    }
    this.setState({
      attachmentsTiDans: fileList,
    });
  };
  //运输中单证
  ysdz = ({ file, fileList, event }) => {
    if (file.response) {
      let a = file.response.data.fileName;
      // console.log(a)
      this.setState({
        ysdz: a,
      });
    } else {
      console.log(event);
    }
    this.setState({
      attachmentsDanZhengs: fileList,
    });
  };
  //运输中单位选择
  yunshuzhongdanwei = e => {
    this.setState({
      haiyunMoneyType: e,
    });
  };

  //支付尾款提货保存
  zhifuweikuanbaochun = () => {
    let guid = this.props.match.params['guid'];
    let DList = [];
    let dList = [];
    let requestData;
    let add;
    let wktdList = this.state.attachmentsTiDansa; //提单
    let wkdzList = this.state.attachmentsDanZhengsa; //单证

    let weikuantidanshuliang = this.state.weikuantidanshuliang; //提单数字
    let weikuandanzheng = this.state.weikuandanzheng; //单证数字

    console.log(wktdList);

    if (weikuantidanshuliang == 0) {
      console.log(wktdList);
    } else {
      wktdList.splice(0, weikuantidanshuliang);
      console.log(wktdList);
    }

    if (weikuandanzheng == 0) {
      console.log(wkdzList);
    } else {
      wkdzList.splice(0, weikuandanzheng);
      console.log(wkdzList);
    }

    if (wktdList == undefined) {
      console.log('无提单');
    } else {
      DList = wktdList.map(item => {
        return {
          fileName: item.response.data.fileName,
          fileOriginName: item.name,
          fileType: 'order',
          fileLog: 16,
          type: 0,
        };
      });
    }

    if (wkdzList == undefined) {
      console.log('无单证');
    } else {
      dList = wkdzList.map(item => {
        return {
          fileName: item.response.data.fileName,
          fileOriginName: item.name,
          fileType: 'order',
          fileLog: 12,
          type: 0,
        };
      });
    }

    if (DList != undefined) {
      dList.push(DList);
      add = _.flatten(dList);
    } else if (dList != undefined) {
      add = _.flatten(dList);
    } else if (DList != undefined && dList != undefined) {
      dList.push(DList);
      add = _.flatten(dList);
    } else {
      console.log('无数据');
    }

    let zhifuweikbeizhu = this.state.zhifuweikbeizhu ? this.state.zhifuweikbeizhu : '无备注'; //订单备注

    requestData = add;

    console.log(requestData);
    postRequest(
      '/business/order/saveAttachmentForOrder/' + guid + '/' + zhifuweikbeizhu,
      JSON.stringify(requestData),
      (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          message.success('提交成功');

          window.location.reload(true);
        } else {
          message.error('提交失败');
        }
      },
    );
  };

  //支付尾款提货上传提单
  zfwktd = ({ file, fileList, event }) => {
    if (file.response) {
      let a = file.response.data.fileName;
      // console.log(a)
      this.setState({
        zfwktd: a,
      });
    } else {
      console.log(event);
    }
    this.setState({
      attachmentsTiDansa: fileList,
    });
  };

  //支付尾款提货上传单证
  zfwkdz = ({ file, fileList, event }) => {
    if (file.response) {
      let a = file.response.data.fileName;
      // console.log(a)
      this.setState({
        zfwkdz: a,
      });
    } else {
      console.log(event);
    }
    this.setState({
      attachmentsDanZhengsa: fileList,
    });
  };

  //交易完成保存
  jiaoyiwanchengbaochun = () => {
    let guid = this.props.match.params['guid'];
    let wktdList = this.state.attachmentsDanZhengsasss; //提单
    let add;
    let remark = this.state.jiaoyiremark;
    let jiayiwanchengdanzheng = this.state.jiayiwanchengdanzheng;

    if (jiayiwanchengdanzheng == 0) {
      console.log(wktdList);
    } else {
      wktdList.splice(0, jiayiwanchengdanzheng);
      console.log(wktdList);
    }

    if (wktdList == undefined) {
      console.log('无提单');
    } else {
      add = wktdList.map(item => {
        return {
          fileName: item.response.data.fileName,
          fileOriginName: item.name,
          fileType: 'order',
          fileLog: 12,
          type: 0,
        };
      });
    }
    console.log(add);

    let requestData = add;
    postRequest(
      '/business/order/saveAttachmentForOrder/' + guid + '/' + remark,
      JSON.stringify(requestData),
      (response: any) => {
        if (response.status === 200) {
          // 跳转首页
          message.success('提交成功');

          window.location.reload(true);
        } else {
          message.error('提交失败');
        }
      },
    );
  };

  //交易完成上传提单
  jiaoyiwanchengs = ({ file, fileList, event }) => {
    if (file.response) {
      let a = file.response.data.fileName;
      // console.log(a)
      this.setState({
        jiaoyiwancheng: a,
      });
    } else {
      console.log(event);
    }
    this.setState({
      attachmentsDanZhengsasss: fileList,
    });
  };

  //支付管理
  zhifu = () => {
    this.setState({
      zhifu: 1,
    });
  };
  //返回订单
  fhdd = () => {
    this.setState({
      zhifu: 0,
      orderTitleType: 1,
      current: 0,
      zfdj: 0, //支付定金
      tiaozhuan: 0, //跳转设置
      qtfw: 0, //其他服务支付设置
      zfwk: 0, //尾款支付设置
      feiyungmingxi: 0, //费用明细
      kaipiaomingxi: 0, //开票明细
    });
  };
  //返回定金
  fhdj = () => {
    this.setState({
      zhifu: 0,
      orderTitleType: 2,
      current: 1,
      zfdj: 0, //支付定金
      tiaozhuan: 0, //跳转设置
      qtfw: 0, //其他服务支付设置
      zfwk: 0, //尾款支付设置
      feiyungmingxi: 0, //费用明细
      kaipiaomingxi: 0, //开票明细
    });
  };
  //返回运输
  fhys = () => {
    this.setState({
      zhifu: 0,
      orderTitleType: 3,
      tiaozhuan: 0,
      current: 2,
      zfdj: 0, //支付定金
      qtfw: 0, //其他服务支付设置
      zfwk: 0, //尾款支付设置
      feiyungmingxi: 0, //费用明细
      kaipiaomingxi: 0, //开票明细
    });
  };
  //返回尾款
  fhwk = () => {
    this.setState({
      zhifu: 0,
      orderTitleType: 4,
      current: 3,
      zfdj: 0, //支付定金
      tiaozhuan: 0, //跳转设置
      qtfw: 0, //其他服务支付设置
      zfwk: 0, //尾款支付设置
      feiyungmingxi: 0, //费用明细
      kaipiaomingxi: 0, //开票明细
    });
  };

  // //跳转设置
  tiaozhuan = () => {
    console.log(123);
    this.setState({
      tiaozhuan: 1,
    });
  };
  //跳转 函数 请求
  tiaozhuanhanshu = value => {
    console.log(`selected ${value}`);
    this.setState({
      dfzw: value,
    });
    //当提交成功跳到相应的页面
  };
  //跳转 确认按钮
  tiaozhuanshezhi = () => {
    console.log('跳转支付尾款等');
    let type = this.state.dfzw;
    let guid = this.props.match.params['guid'];

    let requestData = {
      // type:type,
      // guid:guid,
    };
    postRequest(
      '/business/order/changeOrderType?type=' + type + '&guid=' + guid,
      JSON.stringify(requestData),
      (response: any) => {
        console.log('1111');
        console.log('~~~~~~~~~~~');
        console.log(response);
        if (response.status === 200) {
          // 跳转首页

          message.success('提交成功');

          let current = this.state.dfzw;
          console.log(current);
          if (current == 9999) {
            this.dingdan(); //订单查询信息
            let current = this.state.dfzw;
            this.setState({
              orderTitleType: 1,
              current: current,
              zhifu: 0, //支付选择
              zfdj: 0, //支付定金
              tiaozhuan: 0, //跳转设置
              qtfw: 0, //其他服务支付设置
              zfwk: 0, //尾款支付设置
              feiyungmingxi: 0, //费用明细
              kaipiaomingxi: 0, //开票明细
            });
          } else if (current == 0) {
            this.dingjin(); //定金信息查询

            this.setState({
              orderTitleType: 2,
              current: 1,
              zhifu: 0, //支付选择
              zfdj: 0, //支付定金
              tiaozhuan: 0, //跳转设置
              qtfw: 0, //其他服务支付设置
              zfwk: 0, //尾款支付设置
              feiyungmingxi: 0, //费用明细
              kaipiaomingxi: 0, //开票明细
            });
          } else if (current == 1) {
            this.yunshuzhong(); //运输中信息查询

            this.setState({
              orderTitleType: 3,
              current: 2,
              zhifu: 0, //支付选择
              zfdj: 0, //支付定金
              tiaozhuan: 0, //跳转设置
              qtfw: 0, //其他服务支付设置
              zfwk: 0, //尾款支付设置
              feiyungmingxi: 0, //费用明细
              kaipiaomingxi: 0, //开票明细
            });
          } else if (current == 2) {
            this.zhifuweiktihuo(); //支付尾款并提货信息查询

            this.setState({
              orderTitleType: 4,
              current: 3,
              zhifu: 0, //支付选择
              zfdj: 0, //支付定金
              tiaozhuan: 0, //跳转设置
              qtfw: 0, //其他服务支付设置
              zfwk: 0, //尾款支付设置
              feiyungmingxi: 0, //费用明细
              kaipiaomingxi: 0, //开票明细
            });
          } else if (current == 3) {
            this.jiaoyiwancheng(); //交易完成
            this.setState({
              orderTitleType: 5,
              current: 4,
              zhifu: 0, //支付选择
              zfdj: 0, //支付定金
              tiaozhuan: 0, //跳转设置
              qtfw: 0, //其他服务支付设置
              zfwk: 0, //尾款支付设置
              feiyungmingxi: 0, //费用明细
              kaipiaomingxi: 0, //开票明细
            });
          }
        } else {
          message.error('提交失败');
        }
      },
    );
  };

  //选择器 银行账户和开户银行 函数
  handleProvinceChange = value => {
    console.log(value);
    this.setState({
      provinceData1: [value][0],
      cities: cityData[value],
      secondCity: cityData[value][0],
      lallal: cityData[value][1],
    });
  };

  //选择器 银行账户和开户银行 函数
  // onSecondCityChange = value => {
  //   console.log(value)
  //   this.setState({
  //     secondCity: value,
  //   });
  // };

  //定金金钱单位选择
  dingjindanwweixuanze = value => {
    console.log(`selected ${value}`);
    this.setState({
      moneys: value,
    });
  };

  //定金支付时间选择
  dingjinDate = (date, dateString) => {
    this.setState({
      dingjinDate: moment(dateString).valueOf(),
    });
  };

  //支付定金
  zfdj = () => {
    console.log('定金');
    this.setState({
      zfdj: 1,
      zhifu: 0,
      tiaozhuan: 0,
      qtfw: 0, //其他服务支付设置
      zfwk: 0, //尾款支付设置
      feiyungmingxi: 0, //费用明细
      kaipiaomingxi: 0, //开票明细
    });
  };
  //定金支付设置保存
  djzfbc = () => {
    console.log('定金支付保存');

    let requestData;
    let guid = this.props.match.params['guid'];
    let depositBankAddress = this.state.provinceData1; //公司名称
    let depositBankOpeningBank = this.state.secondCity; //收款银行开户行
    let depositBankAccount = this.state.lallal; // 收款银行账号
    let depositClosingTime = this.state.dingjinDate; //支付截止时间
    let depositCount = this.state.depositCount; //	定金金额
    let depositMoneyType = this.state.moneys; //定金类型

    requestData = {
      guid: guid,
      depositBankAccount: depositBankAccount,
      depositBankOpeningBank: depositBankOpeningBank,
      depositBankAddress: depositBankAddress,
      depositClosingTime: depositClosingTime,
      depositCount: depositCount,
      depositMoneyType: depositMoneyType,
    };
    console.log(requestData);
    postRequest(
      '/business/order/saveDepositForOrder',
      JSON.stringify(requestData),
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          // 跳转首页
          message.success('提交成功');
          window.location.reload(true);
        } else {
          message.error('提交失败');
        }
        if (response.status === 500) {
          message.error(response.message);
        }
      },
    );
  };
  //定金上一步
  djsyb = () => {
    this.setState({
      zfdj: 0,
      zhifu: 0,
      orderTitleType: 2,
      tiaozhuan: 0,
      current: 1,
      zfwk: 0, //尾款支付设置
      feiyungmingxi: 0, //费用明细
      kaipiaomingxi: 0, //开票明细
    });
    this.dingjin(); //定金信息查询
  };

  //支付其他服务费时间
  qitaData = (date, dateString) => {
    this.setState({
      deadlineTime: moment(dateString).valueOf(),
    });
  };
  //支付其他服务费单位
  qitajinqiandanwei = value => {
    console.log(`selected ${value}`);
    this.setState({
      moneyType: value,
    });
  };
  //支付其他服务费
  qtfwf = () => {
    this.setState({
      qtfw: 1, //其他服务支付设置
      zhifu: 0,
      tiaozhuan: 0,
      zfdj: 0,
      zfwk: 0, //尾款支付设置
      feiyungmingxi: 0, //费用明细
      kaipiaomingxi: 0, //开票明细
    });
  };

  //添加其他报价——删除
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
  //添加其他报价——添加
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id_t++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  //添加其他报价——输出
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names, aa } = values;
        // console.log(keys.map((key) => ['names:'+names[key], 'money:'+aa[key]]));
      }
    });
  };
  //其他服务费提交
  qitafuwutijiao = () => {
    console.log('tijiao');

    let bankAccount = this.state.lallal; //银行账户
    let bankDeposit = this.state.secondCity; //银行开户行
    let bankAddress = this.state.provinceData1; //公司名称
    let deadlineTime = this.state.deadlineTime; //支付截止时间
    let otherServiceCharges = this.state.otherServiceCharges; //其他服务名称

    let lianheTransport = this.state.lianheTransport
      ? this.state.lianheTransport.indexOf('.') > -1
        ? this.state.lianheTransport
        : this.state.lianheTransport + '.00'
      : '';
    let bangzhaMoney = this.state.bangzhaMoney
      ? this.state.bangzhaMoney.indexOf('.') > -1
        ? this.state.bangzhaMoney
        : this.state.bangzhaMoney + '.00'
      : '';
    let portOperation = this.state.portOperation
      ? this.state.portOperation.indexOf('.') > -1
        ? this.state.portOperation
        : this.state.portOperation + '.00'
      : '';
    let gangjianMoney = this.state.gangjianMoney
      ? this.state.gangjianMoney.indexOf('.') > -1
        ? this.state.gangjianMoney
        : this.state.gangjianMoney + '.00'
      : '';
    let baoguanMoney = this.state.baoguanMoney
      ? this.state.baoguanMoney.indexOf('.') > -1
        ? this.state.baoguanMoney
        : this.state.baoguanMoney + '.00'
      : '';
    let dailiMoney = this.state.dailiMoney
      ? this.state.dailiMoney.indexOf('.') > -1
        ? this.state.dailiMoney
        : this.state.dailiMoney + '.00'
      : '';
    let lihuoMoney = this.state.lihuoMoney
      ? this.state.lihuoMoney.indexOf('.') > -1
        ? this.state.lihuoMoney
        : this.state.lihuoMoney + '.00'
      : '';
    let anbaoMoney = this.state.anbaoMoney
      ? this.state.anbaoMoney.indexOf('.') > -1
        ? this.state.anbaoMoney
        : this.state.anbaoMoney + '.00'
      : '';
    let haiyunMoney = this.state.haiyunMoney
      ? this.state.haiyunMoney.indexOf('.') > -1
        ? this.state.haiyunMoney
        : this.state.haiyunMoney + '.00'
      : '';
    let kacheMoney = this.state.kacheMoney
      ? this.state.kacheMoney.indexOf('.') > -1
        ? this.state.kacheMoney
        : this.state.kacheMoney + '.00'
      : '';
    let orderId = this.props.match.params['guid'];
    let moneyType = this.state.moneyType ? this.state.moneyType : 0;
    let sumMoney = this.state.sumMoney;
    let qita;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // const { keys, names, aa } = values;
        // console.log(keys.map((key) => ['name:'+names[key], 'money:'+aa[key]]));

        const { keys, names, aa } = values;
        let names_s = keys.map(key => {
          return { name: names[key], money: aa[key] };
        });
        qita = names_s;
        console.log(qita);
      }
    });

    let requestData = {
      bankAccount: bankAccount,
      bankDeposit: bankDeposit,
      bankAddress: bankAddress,
      deadlineTime: deadlineTime,
      otherServiceCharges: otherServiceCharges,
      lianheTransport: lianheTransport,
      bangzhaMoney: bangzhaMoney,
      portOperation: portOperation,
      gangjianMoney: gangjianMoney,
      baoguanMoney: baoguanMoney,
      dailiMoney: dailiMoney,
      lihuoMoney: lihuoMoney,
      anbaoMoney: anbaoMoney,
      haiyunMoney: haiyunMoney,
      kacheMoney: kacheMoney,
      orderId: orderId,
      moneyType: moneyType,
      sumMoney: sumMoney,
      orderQuotationOtherVoList: qita,
    };
    console.log(requestData);

    postRequest(
      '/business/order/saveQuotationForOrder',
      JSON.stringify(requestData),
      (response: any) => {
        console.log('1111');
        console.log('~~~~~~~~~~~');
        console.log(response);
        if (response.status === 200) {
          // 跳转首页
          message.success('提交成功');
          // this.props.history.push('/linerBooking/edit');
          window.location.reload(true);
        } else {
          message.error('提交失败');
        }
        if (response.status === 500) {
          message.error(response.message);
        }
      },
    );
  };

  //尾款支付时间选择
  weikuanData = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      finalPaymentClosingTime: moment(dateString).valueOf(),
    });
  };

  //尾款金钱单位选择
  weikuanjinqianxuanze = value => {
    console.log(value);
    this.setState({
      finalPaymentType: value,
    });
  };
  //尾款提交
  weikuantijiao = () => {
    let guid = this.props.match.params['guid'];
    let finalPaymentBankAddress = this.state.lallal; //公司名称
    let finalPaymentOpeningBank = this.state.secondCity; //收款银行开户行
    let finalPaymentBankAccount = this.state.provinceData1; //收款银行账号
    let finalPaymentClosingTime = this.state.finalPaymentClosingTime; //支付截止时间
    let finalPaymentType = this.state.finalPaymentType ? this.state.finalPaymentType : 0; //金钱类型
    let finalPaymentCount = this.state.finalPaymentCount; //金额

    let requestData = {
      guid: guid,
      finalPaymentOpeningBank: finalPaymentOpeningBank,
      finalPaymentBankAccount: finalPaymentBankAccount,
      finalPaymentClosingTime: finalPaymentClosingTime,
      finalPaymentType: finalPaymentType,
      finalPaymentBankAddress: finalPaymentBankAddress,
      finalPaymentCount: finalPaymentCount,
    };
    console.log(requestData);
    postRequest(
      '/business/order/saveFinalPaymentForOrder',
      JSON.stringify(requestData),
      (response: any) => {
        console.log('1111');
        console.log('~~~~~~~~~~~');
        console.log(response);
        if (response.status === 200) {
          // 跳转首页
          message.success('提交成功');
          window.location.reload(true);
          // this.props.history.push('/linerBooking/edit');
        } else {
          message.error('提交失败');
        }
        if (response.status === 500) {
          message.error(response.message);
        }
      },
    );
  };
  //支付尾款
  wk = () => {
    console.log('尾款');
    this.setState({
      zfwk: 1,
      qtfw: 0, //其他服务支付设置
      zhifu: 0,
      tiaozhuan: 0,
      zfdj: 0,
      feiyungmingxi: 0, //费用明细
      kaipiaomingxi: 0, //开票明细
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const current = isNil(this.state) || isNil(this.state.current) ? 0 : this.state.current;
    const { cities } = this.state;
    const formlayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const formlayout4 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const smallFormItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const smallerFormItemLayout = {
      labelCol: { span: 18 },
      wrapperCol: { span: 6 },
    };
    //其他服务费
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        {...formlayout}
        // label={index === 0 ? "Passengers" : ""}
        required={false}
        key={k}
      >
        <InputGroup size="large">
          <Row gutter={24}>
            <Col span={6}>
              {getFieldDecorator(`names[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '展开后请输入',
                  },
                ],
              })(<Input placeholder="其他报价" />)}
            </Col>
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
                <input
                  type="number"
                  min="0"
                  max="99999999999"
                  style={{
                    width: '100%',
                    height: '39px',
                    border: '2px solid #e8e8e8',
                    borderRadius: '5px',
                  }}
                />,
              )}
            </Col>
            {keys.length >= 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(k)}
              />
            ) : null}
          </Row>
        </InputGroup>
      </Form.Item>
    ));

    //(保存 支付管理 跳转设置) 按钮
    const bzt = (
      <Row gutter={24}>
        <Col span={24}>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Button style={{ backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.baochun}>
              保存
            </Button>
            <Button
              style={{
                marginLeft: '10px',
                marginRight: '10px',
                backgroundColor: '#57B5E3',
                color: '#FFFFFF',
              }}
              onClick={this.zhifu}
            >
              支付管理
            </Button>
            <Button
              style={{ marginRight: '10px', backgroundColor: '#0080FF', color: '#FFFFFF' }}
              onClick={this.tiaozhuan}
            >
              跳转设置
            </Button>
          </div>
        </Col>
      </Row>
    );

    //货盘信息
    const huooanxinxi = (
      <div>
        <div className={commonCss.title}>
          <span className={commonCss.text}>
            {isNil(this.state) || isNil(this.state.CGCG)
              ? ''
              : this.state.CGCG === 'G'
              ? '查看国际货盘'
              : '查看国内货盘'}
          </span>
        </div>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formlayout} label="货物名称">
              <Input
                disabled
                value={
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : this.state.palletDto.goodsLevel
                }
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item {...formlayout} label="货物编号">
              <Input
                disabled
                value={
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : this.state.palletDto.palletNumber
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formlayout} label="货物重量">
              <Input
                suffix="吨"
                disabled
                value={
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : this.state.palletDto.maxWeight
                }
              />
            </Form.Item>
          </Col>
          {!isNil(this.state) && this.state.CGCG == 'G' ? (
            <Col span={12}>
              <Form.Item {...formlayout} label="体积">
                <Input
                  suffix="m³"
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.palletDto)
                      ? ''
                      : this.state.palletDto.goodsVolume
                  }
                />
              </Form.Item>
            </Col>
          ) : (
            <Col span={12}>
              <Form.Item {...formlayout} label="所需船舶吨位">
                <Input
                  suffix="吨"
                  disabled
                  value={
                    isNil(this.state) || isNil(this.state.palletDto)
                      ? ''
                      : this.state.palletDto.goodsLevel
                  }
                />
              </Form.Item>
            </Col>
          )}
          {/* weightMax
          weightMin */}
        </Row>
        {!isNil(this.state) && this.state.CGCG == 'G' ? (
          <div>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="货物存放位置">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.palletDto)
                        ? ''
                        : this.state.palletDto.location
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="货物性质">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.palletDto)
                        ? ''
                        : this.state.palletDto.goodsProperty
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              {/* <Col span={12}>
                      <Form.Item {...formlayout} label="货物件数">
                        <Input
                          disabled
                          suffix="件"
                          value={
                            isNil(this.state) || isNil(this.state.goodsCount) ? '' : this.state.goodsCount
                          }
                        />
                      </Form.Item>
                    </Col> */}
              <Col span={12}>
                <Form.Item {...formlayout} label="是否为重大件">
                  <Input
                    disabled
                    className="OnlyRead"
                    value={
                      isNil(this.state) || isNil(this.state.palletDto)
                        ? ''
                        : this.state.palletDto.majorParts == 0
                        ? '否'
                        : '是'
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label="可叠加">
                  <Input
                    disabled
                    value={
                      isNil(this.state) || isNil(this.state.palletDto)
                        ? ''
                        : this.state.palletDto.isSuperposition == 0
                        ? '不可以'
                        : this.state.palletDto.isSuperposition == 1
                        ? '可以'
                        : this.state.palletDto.isSuperposition == 2
                        ? '部分可以'
                        : ''
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        ) : null}

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formlayout} label="起运港">
              <Input
                disabled
                className="OnlyRead"
                value={
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : this.state.palletDto.startPort
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formlayout} label="目的港">
              <Input
                disabled
                className="OnlyRead"
                value={
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : this.state.palletDto.destinationPort
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formlayout} label="受载日期">
              <Input
                disabled
                className="OnlyRead"
                value={
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : moment(this.state.palletDto.loadDate).format('YYYY/MM/DD')
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formlayout} label="截止日期">
              <Input
                disabled
                className="OnlyRead"
                value={
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : moment(this.state.palletDto.endDate).format('YYYY/MM/DD')
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formlayout} label="用户名">
              <Input
                disabled
                className="OnlyRead"
                value={
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : this.state.palletDto.accountId
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formlayout} label="公司名称">
              <Input
                disabled
                className="OnlyRead"
                value={
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : this.state.palletDto.companyName
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
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : this.state.palletDto.contacter
                }
              />
            </Form.Item>
          </Col>
          {/* <Col span={4}>
            <Form.Item {...smallerFormItemLayout} label="联系方式">
              <Input
                placeholder="手机号码"
                style={{ marginLeft: '22%', textAlign: 'center' }}
                className="telinput"
                disabled
                value={
                  isNil(this.state) || isNil(this.state.palletDto) ? '' : this.state.palletDto.goodsLevel
                }
                />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item {...formlayout} label="联系方式">
              <Input
                placeholder="联系方式"
                disabled
                value={
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : this.state.palletDto.phoneNumber
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formlayout} label="货物清单">
              <div style={{ display: 'flex' }}>
                {isNil(this.state) || isNil(this.state.palletUserAttachmentImg)
                  ? ''
                  : this.state.palletUserAttachmentImg.map(item => (
                      <div
                        style={{
                          width: '100px',
                          height: '100px',
                          marginLeft: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <img
                          src={
                            isNil(this.state) || isNil(this.state.palletUserAttachmentImg)
                              ? ''
                              : this.state.urls + item.type + '/' + item.fileName
                          }
                          alt=""
                          style={{ width: '100%', height: '100%' }}
                          onClick={() => {
                            this.showModal(
                              isNil(this.state) || isNil(this.state.palletUserAttachmentImg)
                                ? ''
                                : this.state.urls + item.type + '/' + item.fileName,
                            );
                          }}
                        />
                      </div>
                    ))}
              </div>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item {...smallFormItemLayout} label="备注">
              <Input.TextArea
                readOnly
                disabled
                style={{ width: '100%', height: '160px' }}
                value={
                  isNil(this.state) || isNil(this.state.palletDto)
                    ? ''
                    : this.state.palletDto.remark
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
    {
      /* 船东报价和其他服费报价 */
    }
    const CDFW = (
      <div>
        <div className={commonCss.title}>
          <span className={commonCss.text}>船东报价</span>
        </div>
        {!isNil(this.state) || isNil(this.state.quotationDto) ? (
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={
              isNil(this.state) || isNil(this.state.quotationDto) ? [] : this.state.quotationDto
            }
            renderItem={item => (
              <List.Item>
                <div>
                  <Card style={{ fontSize: '18px' }}>
                    {
                      <div style={{ marginLeft: '80%', fontSize: '13px' }}>
                        {moment(item.createDate).format('YYYY/MM/DD')}
                      </div>
                    }
                    {
                      <span style={{ color: 'red', fontSize: '18px' }}>
                        {!isNil(this.state) && this.state.CGCG == 'G'
                          ? '海运费：' +
                            (item.oceanFreight
                              ? item.currency === 0
                                ? '$' + item.oceanFreight + 'USD'
                                : item.currency === 2
                                ? '€' + item.oceanFreight + 'EURO'
                                : '￥' + item.oceanFreight + 'RMB'
                              : null)
                          : '航运费：' +
                            (item.insertFlag === 1
                              ? '￥' + item.turnkeyProject + '元'
                              : item.tonnage === ''
                              ? ''
                              : '￥' + item.tonnage + '元/吨')}
                      </span>
                    }
                    <br />
                    <br />
                    {
                      <span style={{ fontSize: '15px' }}>
                        {!isNil(this.state) && this.state.CGCG == 'G'
                          ? '计费方式：' +
                            (item.chargeMode
                              ? item.chargeMode === 0
                                ? 'Per.MT'
                                : item.chargeMode === 1
                                ? 'Per. W/M'
                                : item.chargeMode === 2
                                ? 'Per.CBM'
                                : null
                              : null)
                          : '计费方式：' + (item.insertFlag === 1 ? '总包干价' : '按吨计费')}
                      </span>
                    }
                    <br />
                    <br />
                    {
                      <span style={{ fontSize: '15px' }}>
                        {!isNil(this.state) && this.state.CGCG === 'G'
                          ? '运费条款：' +
                            (item.freightClause === 0
                              ? 'FILO'
                              : item.freightClause === 1
                              ? 'FLT'
                              : item.freightClause === 2
                              ? 'LIFO'
                              : item.freightClause === 3
                              ? 'FIO'
                              : item.freightClause === 4
                              ? 'FIOST'
                              : null)
                          : null}
                      </span>
                    }
                    <br />
                    {
                      <span style={{ fontSize: '15px' }}>
                        {!isNil(this.state) && this.state.CGCG == 'G'
                          ? '佣金' +
                            ('Add.com' +
                              (isNil(this.state) || isNil(this.state.palletDto.addCommission)
                                ? '无佣金'
                                : this.state.palletDto.addCommission) +
                              '+' +
                              'com' +
                              (isNil(this.state) || isNil(this.state.palletDto.commission)
                                ? '无佣金'
                                : this.state.palletDto.commission))
                          : null}
                      </span>
                    }
                  </Card>
                </div>
              </List.Item>
            )}
          />
        ) : null}

        <div className={commonCss.title}>
          <span className={commonCss.text}>其他服务费报价</span>
        </div>
        {!isNil(this.state) || isNil(this.state.quotationKefuDto) ? (
          <List
            itemLayout="vertical"
            size="small"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 1,
            }}
            dataSource={
              isNil(this.state) || isNil(this.state.quotationKefuDto)
                ? []
                : this.state.quotationKefuDto
            }
            renderItem={item => (
              <List.Item>
                <div key={item.guid}>
                  <h4>{moment(item.date).format('YYYY/MM/DD')}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ width: '400px' }}>其他服务报价</h3>
                    <h3 style={{ width: '400px' }}>自定义报价记录</h3>
                    <h3 style={{ width: '400px' }}>备注</h3>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '400px', border: '1px solid #e8e8e8' }}>
                      <p>联合运输：{item.lianheMoney}</p>
                      <p>绑扎：{item.bangzhaMoney}</p>
                      <p>港集</p>
                      <div style={{ width: '100%', marginLeft: '40px' }}>
                        {/* <p>
                            港口操作：{item.}
                          </p> */}
                        <p>港建费：{item.jiangangMoney}</p>
                        <p>代理费：{item.dailiMoney}</p>
                        <p>理货费：{item.lihuoMoney}</p>
                        <p>安保费：{item.anbaoMoney}</p>
                      </div>
                      <p>江海运：{item.jianghaiyunMoney}</p>
                      <p>海运险：{item.haiyunMoney}</p>
                      <p>卡车运输险：{item.kacheMoney}</p>
                      <p>报关费：{item.baoguanMoney}</p>
                    </div>
                    <div
                      style={{
                        overflow: 'auto',
                        height: '250px',
                        border: '1px solid #e8e8e8',
                        width: '400px',
                      }}
                    >
                      <List
                        grid={{ column: 1 }}
                        dataSource={
                          isNil(this.state) || isNil(this.state.quotationKefuDto)
                            ? []
                            : item.quotationKefuDto
                        }
                        renderItem={item => (
                          <div>
                            {item.guid ? (
                              <List.Item>
                                <List.Item.Meta
                                  title={item.guid ? item.name + '：' + item.content : null}
                                  // description={moment(item.createDate).format('YYYY/MM/DD')}
                                />
                              </List.Item>
                            ) : null}
                          </div>
                        )}
                      ></List>
                    </div>
                    <div
                      style={{
                        overflow: 'auto',
                        height: '250px',
                        border: '1px solid #e8e8e8',
                        width: '400px',
                      }}
                    >
                      {item.remarkk}
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : null}
      </div>
    );

    // 航次信息详情
    const hangcixiangqing = (
      <div>
        <div className={commonCss.title}>
          <span className={commonCss.text}>航次信息</span>
        </div>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formlayout} label="公司名称">
              <Input
                disabled
                className="OnlyRead"
                value={
                  isNil(this.state) || isNil(this.state.voyageDto)
                    ? ''
                    : this.state.voyageDto.voyageDto.companyName
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formlayout} label="用户名">
              <Input
                disabled
                className="OnlyRead"
                value={
                  isNil(this.state) || isNil(this.state.voyageDto)
                    ? ''
                    : this.state.voyageDto.voyageDto.accountId
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formlayout} label="船舶名称">
              <Input
                disabled
                className="OnlyRead"
                value={
                  isNil(this.state) || isNil(this.state.voyageDto)
                    ? ''
                    : this.state.voyageDto.voyageDto.ship.shipName
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
                  isNil(this.state) || isNil(this.state.voyageDto)
                    ? ''
                    : this.state.voyageDto.voyageDto.ship.shipDeckCN
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item {...formlayout} label="已定航线">
              <Input
                disabled
                className="OnlyRead"
                value={
                  isNil(this.state) || isNil(this.state.voyageDto)
                    ? ''
                    : this.state.voyageDto.voyageDto.voyageLineName
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formlayout} label="船舶类型">
              <Input
                disabled
                className="OnlyRead"
                value={
                  isNil(this.state) || isNil(this.state.voyageDto)
                    ? ''
                    : this.state.voyageDto.voyageDto.ship.shipTypeCN
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
                value={
                  isNil(this.state) || isNil(this.state.voyageDto)
                    ? ''
                    : this.state.voyageDto.voyageDto.voyage.contacter
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formlayout} label="联系方式">
              <Input
                disabled
                value={
                  isNil(this.state) || isNil(this.state.voyageDto)
                    ? ''
                    : this.state.voyageDto.voyageDto.voyage.contactPhone
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    );

    let voyagePortList =
      isNil(this.state) || isNil(this.state.voyagePort) ? [] : this.state.voyagePort;
    //航次信息

    const hangcixinxi: JSX.Element[] = [];

    forEach(voyagePortList, (item: VoyagePort, key) => {
      hangcixinxi.push(
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item {...formlayout} label={item.portTypeName}>
              <Input disabled className="OnlyRead" value={item.portName} />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              {...formlayout}
              label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.ETA' })}
            >
              {/* 到达时间 */}
              <Input
                disabled
                className="OnlyRead"
                value={moment(Number(item.arriveDate)).format('YYYY/MM/DD')}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              {...formlayout}
              label={formatMessage({ id: 'VoyageDynamics-VoyageDynamicsView.ETD' })}
            >
              {/* 离开港口时间 */}
              <Input
                disabled
                className="OnlyRead"
                value={moment(Number(item.leaveDate)).format('YYYY/MM/DD')}
              />
            </Form.Item>
          </Col>
        </Row>,
      );
    });

    let logisticsList =
      isNil(this.state) || isNil(this.state.logisticsInfo) ? [] : this.state.logisticsInfo;
    const elements: JSX.Element[] = [];
    forEach(logisticsList, (item: LogisticsInfo, key) => {
      if (key == 0) {
        elements.push(
          <Timeline.Item style={{ fontSize: '20px', fontWeight: 'bold' }} color="red">
            {item.time}&nbsp;&nbsp;&nbsp;&nbsp;{item.logisticsMsg}
          </Timeline.Item>,
        );
      } else {
        elements.push(
          <Timeline.Item color="red">
            {item.time}&nbsp;&nbsp;&nbsp;&nbsp;{item.logisticsMsg}
          </Timeline.Item>,
        );
      }
    });

    return (
      <div className={commonCss.container}>
        {/* 图片放大 */}
        <Modal
          title=""
          visible={isNil(this.state) || isNil(this.state.visible) ? '' : this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          width="50%"
        >
          <img
            src={isNil(this.state) || isNil(this.state.bigImg) ? '' : this.state.bigImg}
            alt=""
            style={{ width: '90%', height: '90%' }}
          />
          {/* <img src={isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.logoUrl + this.state.logotype)} alt="" style={{ width: '60%' }}/> */}
          {/* isNil(this.state) || isNil(this.state.Url) ? '' : (this.state.Url + item.fileName) */}
        </Modal>
        {/* 上面属性栏*/}
        <Card bordered={false} style={{ paddingTop: 20 }}>
          <Steps current={current} onChange={this.onChange} labelPlacement={'vertical'}>
            <Step
              title={formatMessage({ id: 'OrderManagement-MyOrderView.order' })}
              description=""
            />
            <Step
              title={formatMessage({ id: 'OrderManagement-MyOrderView.payed' })}
              description=""
            />
            <Step
              title={formatMessage({ id: 'OrderManagement-MyOrderView.transport' })}
              description=""
            />
            <Step
              title={formatMessage({ id: 'OrderManagement-MyOrderView.final.payment' })}
              description=""
            />
            <Step
              title={formatMessage({ id: 'OrderManagement-MyOrderView.complete' })}
              description=""
            />
          </Steps>
        </Card>

        <Divider dashed={true} />
        {/* 支付管理 */}
        {!isNil(this.state) &&
        this.state.zhifu === 1 &&
        this.state.zfdj === 0 &&
        this.state.tiaozhuan === 0 &&
        this.state.qtfw === 0 &&
        this.state.zfwk === 0 &&
        this.state.feiyungmingxi === 0 &&
        this.state.kaipiaomingxi === 0 ? (
          <div className={commonCss.container} style={{ minWidth: 1320 }}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{formatMessage({ id: '支付费用选择' })}</span>
            </div>
            <Row gutter={24}>
              <Col span={24}>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <Button
                    style={{ backgroundColor: '#135A8D', color: '#FFFFFF' }}
                    onClick={this.zfdj}
                  >
                    支付定金
                  </Button>
                  <Button
                    style={{
                      marginLeft: '10px',
                      marginRight: '10px',
                      backgroundColor: '#57B5E3',
                      color: '#FFFFFF',
                    }}
                    onClick={this.qtfwf}
                  >
                    支付其他服务费
                  </Button>
                  <Button
                    style={{ marginRight: '10px', backgroundColor: '#0080FF', color: '#FFFFFF' }}
                    onClick={this.wk}
                  >
                    支付尾款
                  </Button>
                </div>
              </Col>
            </Row>
            <br></br>
            <Row gutter={24}>
              <Col span={24}>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <Button style={{ marginRight: '10px' }} onClick={this.fhdd}>
                    返回订单页面
                  </Button>
                  <Button style={{ marginRight: '10px' }} onClick={this.fhdj}>
                    返回定金页面
                  </Button>
                  <Button style={{ marginRight: '10px' }} onClick={this.fhwk}>
                    返回尾款页面
                  </Button>
                </div>
              </Col>
            </Row>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/* 定金支付设置 */}
        {!isNil(this.state) &&
        this.state.zfdj === 1 &&
        this.state.zhifu === 0 &&
        this.state.tiaozhuan === 0 &&
        this.state.qtfw === 0 &&
        this.state.zfwk === 0 &&
        this.state.feiyungmingxi === 0 &&
        this.state.kaipiaomingxi === 0 ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{formatMessage({ id: '定金支付设置' })}</span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="公司名称">
                      <Select defaultValue={provinceData[0]} onChange={this.handleProvinceChange}>
                        {provinceData.map(province => (
                          <Option key={province}>{province}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付截至时间">
                      <DatePicker onChange={this.dingjinDate} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="请选择开户银行">
                      <Select value={this.state.secondCity} disabled></Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="银行账户">
                      <Select value={this.state.lallal} disabled></Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="需支付定金">
                      {/* <Input
                        onChange={e=>this.setState({depositCount:e.target.value})}
                        >
                        </Input> */}
                      <input
                        type="number"
                        min="0"
                        max="99999999999"
                        onChange={e => this.setState({ depositCount: e.target.value })}
                        style={{
                          width: '100%',
                          height: '39px',
                          border: '2px solid #e8e8e8',
                          borderRadius: '5px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="请选择金钱单位">
                      <Select style={{ width: 120 }} onChange={this.dingjindanwweixuanze}>
                        <Option value="0">人民币</Option>
                        <Option value="1">美元</Option>
                        <Option value="2">欧元</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <Button
                        style={{ backgroundColor: '#135A8D', color: '#FFFFFF' }}
                        onClick={this.djsyb}
                      >
                        上一步
                      </Button>
                      <Button
                        style={{
                          marginLeft: '10px',
                          marginRight: '10px',
                          backgroundColor: '#57B5E3',
                          color: '#FFFFFF',
                        }}
                        onClick={this.djzfbc}
                      >
                        确认提交
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}
        {/* // 跳转设置 */}
        {!isNil(this.state) &&
        this.state.tiaozhuan === 1 &&
        this.state.zhifu === 0 &&
        this.state.zfdj === 0 &&
        this.state.qtfw === 0 &&
        this.state.zfwk === 0 &&
        this.state.feiyungmingxi === 0 &&
        this.state.kaipiaomingxi === 0 ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{formatMessage({ id: '跳转设置' })}</span>
            </div>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={24}>
                  <div style={{ textAlign: 'center' }}>
                    <Select
                      defaultValue="点击此处选择"
                      allowClear={true}
                      onChange={this.tiaozhuanhanshu}
                    >
                      <Option value="0">已支付定金</Option>
                      <Option value="1">已发货运输中</Option>
                      <Option value="2">已支付尾款</Option>
                      <Option value="3">已完成</Option>
                    </Select>
                  </div>
                </Col>
              </Row>
              <br></br>
              <Row gutter={24}>
                <Col span={24}>
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <Button
                      style={{
                        marginLeft: '10px',
                        marginRight: '10px',
                        backgroundColor: '#57B5E3',
                        color: '#FFFFFF',
                      }}
                      onClick={this.tiaozhuanshezhi}
                    >
                      确认提交
                    </Button>
                  </div>
                </Col>
              </Row>
              <br></br>
              <Row gutter={24}>
                <Col span={24}>
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <Button style={{ marginRight: '10px' }} onClick={this.fhdd}>
                      返回订单页面
                    </Button>
                    <Button style={{ marginRight: '10px' }} onClick={this.fhdj}>
                      返回定金页面
                    </Button>
                    <Button style={{ marginRight: '10px' }} onClick={this.fhys}>
                      返回运输中页面
                    </Button>
                    <Button style={{ marginRight: '10px' }} onClick={this.fhwk}>
                      返回尾款页面
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        ) : null}

        {/* 其他服务支付设置 */}
        {!isNil(this.state) &&
        this.state.qtfw === 1 &&
        this.state.tiaozhuan === 0 &&
        this.state.zhifu === 0 &&
        this.state.zfdj === 0 &&
        this.state.zfwk === 0 &&
        this.state.feiyungmingxi === 0 &&
        this.state.kaipiaomingxi === 0 ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{formatMessage({ id: '其他服务费支付设置' })}</span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="请输入收款公司名称">
                      <Select defaultValue={provinceData[0]} onChange={this.handleProvinceChange}>
                        {provinceData.map(province => (
                          <Option key={province}>{province}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付截至时间">
                      <DatePicker onChange={this.qitaData} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="请选择开户银行">
                      <Select value={this.state.secondCity} disabled></Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="银行账户">
                      <Select value={this.state.lallal} disabled></Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="需支付其他服务费">
                      <Input
                        onChange={e => this.setState({ otherServiceCharges: e.target.value })}
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="其他联合运输">
                      {/* <Input
                        onChange={e => this.setState({ lianheTransport: e.target.value})}
                      /> */}
                      <input
                        type="number"
                        min="0"
                        max="99999999999"
                        onChange={e => this.setState({ lianheTransport: e.target.value })}
                        style={{
                          width: '100%',
                          height: '39px',
                          border: '2px solid #e8e8e8',
                          borderRadius: '5px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="绑扎">
                      {/* <Input
                        onChange={e => this.setState({ bangzhaMoney: e.target.value})}
                      /> */}
                      <input
                        type="number"
                        min="0"
                        max="99999999999"
                        onChange={e => this.setState({ bangzhaMoney: e.target.value })}
                        style={{
                          width: '100%',
                          height: '39px',
                          border: '2px solid #e8e8e8',
                          borderRadius: '5px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="集港">
                      <Col span={15}>
                        <Form.Item {...formlayout} label="港口操作">
                          {/*
                            <Input style={{ width:'60%',marginLeft:'30px' }}

                            onChange={e => this.setState({ portOperation: e.target.value})} /> */}
                          <input
                            type="number"
                            min="0"
                            max="99999999999"
                            onChange={e => this.setState({ portOperation: e.target.value })}
                            style={{
                              width: '100%',
                              height: '39px',
                              border: '2px solid #e8e8e8',
                              borderRadius: '5px',
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label="港建费">
                          {/*
                          <Input style={{ width:'60%',marginLeft:'30px' }}

                          onChange={e => this.setState({ gangjianMoney: e.target.value})} /> */}
                          <input
                            type="number"
                            min="0"
                            max="99999999999"
                            onChange={e => this.setState({ gangjianMoney: e.target.value })}
                            style={{
                              width: '100%',
                              height: '39px',
                              border: '2px solid #e8e8e8',
                              borderRadius: '5px',
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label="报关">
                          {/*
                            <Input style={{ width:'60%',marginLeft:'30px' }}
                                onChange={e => this.setState({ baoguanMoney: e.target.value})} /> */}
                          <input
                            type="number"
                            min="0"
                            max="99999999999"
                            onChange={e => this.setState({ baoguanMoney: e.target.value })}
                            style={{
                              width: '100%',
                              height: '39px',
                              border: '2px solid #e8e8e8',
                              borderRadius: '5px',
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label="代理费">
                          {/*
                            <Input style={{ width:'60%',marginLeft:'30px' }}

                            onChange={e => this.setState({ dailiMoney: e.target.value})} /> */}
                          <input
                            type="number"
                            min="0"
                            max="99999999999"
                            onChange={e => this.setState({ dailiMoney: e.target.value })}
                            style={{
                              width: '100%',
                              height: '39px',
                              border: '2px solid #e8e8e8',
                              borderRadius: '5px',
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label="理货费">
                          {/*
                            <Input style={{ width:'60%',marginLeft:'30px' }}

                            onChange={e => this.setState({ lihuoMoney: e.target.value})} /> */}
                          <input
                            type="number"
                            min="0"
                            max="99999999999"
                            onChange={e => this.setState({ lihuoMoney: e.target.value })}
                            style={{
                              width: '100%',
                              height: '39px',
                              border: '2px solid #e8e8e8',
                              borderRadius: '5px',
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label="安保费">
                          {/* <Input style={{ width:'60%',marginLeft:'30px' }}

                            onChange={e => this.setState({ anbaoMoney: e.target.value})} /> */}
                          <input
                            type="number"
                            min="0"
                            max="99999999999"
                            onChange={e => this.setState({ anbaoMoney: e.target.value })}
                            style={{
                              width: '100%',
                              height: '39px',
                              border: '2px solid #e8e8e8',
                              borderRadius: '5px',
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="保险">
                      <Col span={15}>
                        <Form.Item {...formlayout} label="卡车运输险">
                          {/* <Input style={{ width:'60%',marginLeft:'30px' }}

                          onChange={e => this.setState({ kacheMoney: e.target.value})} /> */}
                          <input
                            type="number"
                            min="0"
                            max="99999999999"
                            onChange={e => this.setState({ kacheMoney: e.target.value })}
                            style={{
                              width: '100%',
                              height: '39px',
                              border: '2px solid #e8e8e8',
                              borderRadius: '5px',
                            }}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={15}>
                        <Form.Item {...formlayout} label="海运险">
                          {/* <Input style={{ width:'60%',marginLeft:'30px' }}

                              onChange={e => this.setState({ haiyunMoney: e.target.value})} /> */}
                          <input
                            type="number"
                            min="0"
                            max="99999999999"
                            onChange={e => this.setState({ haiyunMoney: e.target.value })}
                            style={{
                              width: '100%',
                              height: '39px',
                              border: '2px solid #e8e8e8',
                              borderRadius: '5px',
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Form onSubmit={this.handleSubmit}>
                    {formItems}
                    <Form.Item {...formlayout}>
                      <Button type="dashed" onClick={this.add}>
                        <Icon type="plus" /> 添加自定义报价
                      </Button>
                    </Form.Item>
                  </Form>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="请选择金钱单位">
                      <Select style={{ width: 120 }} onChange={this.qitajinqiandanwei}>
                        <Option value="0">人民币</Option>
                        <Option value="1">美元</Option>
                        <Option value="2">欧元</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="费用总计">
                      {/* <Input
                        onChange={e => this.setState({ sumMoney: e.target.value})}
                      /> */}
                      <input
                        type="number"
                        min="0"
                        max="99999999999"
                        onChange={e => this.setState({ sumMoney: e.target.value })}
                        style={{
                          width: '100%',
                          height: '39px',
                          border: '2px solid #e8e8e8',
                          borderRadius: '5px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      {/* <Button style={{backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.djsyb} >
                            上一步
                          </Button> */}
                      <Button
                        style={{
                          marginLeft: '10px',
                          marginRight: '10px',
                          backgroundColor: '#57B5E3',
                          color: '#FFFFFF',
                        }}
                        onClick={this.qitafuwutijiao}
                      >
                        确认提交
                      </Button>
                    </div>
                  </Col>
                </Row>
                <br></br>
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhdd}>
                        返回订单页面
                      </Button>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhdj}>
                        返回定金页面
                      </Button>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhwk}>
                        返回尾款页面
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/* 其他服务详情 */}
        {!isNil(this.state) &&
        this.state.feiyungmingxi === 1 &&
        this.state.tiaozhuan === 0 &&
        this.state.zhifu === 0 &&
        this.state.zfdj === 0 &&
        this.state.zfwk === 0 &&
        this.state.qtfw === 0 &&
        this.state.kaipiaomingxi === 0 ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{formatMessage({ id: '其他服务费支付设置' })}</span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="其他服务费">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.qitabaojialist)
                            ? ''
                            : this.state.qitabaojialist
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: false,
                        }}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.orderQuotation)
                            ? ''
                            : moment(this.state.orderQuotation.updateDate).format(
                                'YYYY/MM/DD HH:mm:ss',
                              )
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付金额">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.orderQuotation)
                            ? ''
                            : this.state.orderQuotation.sumMoney
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="收款公司名称">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.orderQuotation)
                            ? ''
                            : this.state.orderQuotation.bankAddress
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付截至时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.orderQuotation)
                            ? ''
                            : moment(this.state.orderQuotation.deadlineTime).format(
                                'YYYY/MM/DD HH:mm:ss',
                              )
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="开户银行">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.orderQuotation)
                            ? ''
                            : this.state.orderQuotation.bankDeposit
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="银行账户">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.orderQuotation)
                            ? ''
                            : this.state.orderQuotation.bankAccount
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="其他服务费">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.orderQuotation)
                            ? ''
                            : this.state.orderQuotation.otherServiceCharges
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="其他联合运输">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.orderQuotation)
                            ? ''
                            : this.state.orderQuotation.lianheTransport
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="绑扎">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.orderQuotation)
                            ? ''
                            : this.state.orderQuotation.bangzhaMoney
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="集港">
                      <Col span={15}>
                        <Form.Item {...formlayout} label="港口操作">
                          <Input
                            style={{ width: '60%', marginLeft: '30px' }}
                            disabled
                            value={
                              isNil(this.state) || isNil(this.state.orderQuotation)
                                ? ''
                                : this.state.orderQuotation.portOperation
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label="港建费">
                          <Input
                            style={{ width: '60%', marginLeft: '30px' }}
                            disabled
                            value={
                              isNil(this.state) || isNil(this.state.orderQuotation)
                                ? ''
                                : this.state.orderQuotation.gangjianMoney
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label="报关">
                          <Input
                            style={{ width: '60%', marginLeft: '30px' }}
                            disabled
                            value={
                              isNil(this.state) || isNil(this.state.orderQuotation)
                                ? ''
                                : this.state.orderQuotation.baoguanMoney
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label="代理费">
                          <Input
                            style={{ width: '60%', marginLeft: '30px' }}
                            disabled
                            value={
                              isNil(this.state) || isNil(this.state.orderQuotation)
                                ? ''
                                : this.state.orderQuotation.dailiMoney
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label="理货费">
                          <Input
                            style={{ width: '60%', marginLeft: '30px' }}
                            disabled
                            value={
                              isNil(this.state) || isNil(this.state.orderQuotation)
                                ? ''
                                : this.state.orderQuotation.lihuoMoney
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={15}>
                        <Form.Item {...formlayout} label="安保费">
                          <Input
                            style={{ width: '60%', marginLeft: '30px' }}
                            disabled
                            value={
                              isNil(this.state) || isNil(this.state.orderQuotation)
                                ? ''
                                : this.state.orderQuotation.anbaoMoney
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="保险">
                      <Col span={15}>
                        <Form.Item {...formlayout} label="卡车运输险">
                          <Input
                            style={{ width: '60%', marginLeft: '30px' }}
                            disabled
                            value={
                              isNil(this.state) || isNil(this.state.orderQuotation)
                                ? ''
                                : this.state.orderQuotation.kacheMoney
                            }
                          />
                        </Form.Item>
                      </Col>

                      <Col span={15}>
                        <Form.Item {...formlayout} label="海运险">
                          <Input
                            style={{ width: '60%', marginLeft: '30px' }}
                            disabled
                            value={
                              isNil(this.state) || isNil(this.state.orderQuotation)
                                ? ''
                                : this.state.orderQuotation.haiyunMoney
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Form.Item>
                  </Col>
                </Row>

                {isNil(this.state) || isNil(this.state.orderQuotationOther)
                  ? ''
                  : this.state.orderQuotationOther.map(item => {
                      return (
                        <Row gutter={24}>
                          <Col span={8}>
                            <Form.Item {...formlayout} label="费用名称">
                              <Input
                                disabled
                                className="OnlyRead"
                                value={
                                  isNil(this.state) || isNil(this.state.orderQuotationOther)
                                    ? ''
                                    : item.name
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item {...formlayout} label="费用金额">
                              <Input
                                disabled
                                className="OnlyRead"
                                value={
                                  isNil(this.state) || isNil(this.state.orderQuotationOther)
                                    ? ''
                                    : item.money
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item {...formlayout} label="时间">
                              <Input
                                disabled
                                className="OnlyRead"
                                value={
                                  isNil(this.state) || isNil(this.state.orderQuotationOther)
                                    ? ''
                                    : moment(item.createDate).format('MMM Do')
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      );
                    })}
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="金钱单位">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.orderQuotation)
                            ? ''
                            : this.state.orderQuotation.moneyType == 0
                            ? '人民币'
                            : this.state.orderQuotation.moneyType == 1
                            ? '美元'
                            : '欧元'
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="费用总计">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.orderQuotation)
                            ? ''
                            : this.state.orderQuotation.sumMoney
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <br></br>
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhdd}>
                        返回订单页面
                      </Button>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhdj}>
                        返回定金页面
                      </Button>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhys}>
                        返回运输中页面
                      </Button>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhwk}>
                        返回尾款页面
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/* 尾款支付设置 */}
        {!isNil(this.state) &&
        this.state.zfwk === 1 &&
        this.state.qtfw === 0 &&
        this.state.tiaozhuan === 0 &&
        this.state.zhifu === 0 &&
        this.state.zfdj === 0 &&
        this.state.feiyungmingxi === 0 &&
        this.state.kaipiaomingxi === 0 ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{formatMessage({ id: '尾款支付设置' })}</span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="收款公司名称">
                      <Select defaultValue={provinceData[0]} onChange={this.handleProvinceChange}>
                        {provinceData.map(province => (
                          <Option key={province}>{province}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付截至时间">
                      <DatePicker onChange={this.weikuanData} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="请选择开户银行">
                      <Select value={this.state.secondCity} disabled></Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="银行账户">
                      <Select value={this.state.lallal} disabled></Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="海运费总价">
                      <Input disabled></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="已支付定金">
                      <Input disabled></Input>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="需支付尾款">
                      {/* <Input
                            onChange={e=>this.setState({finalPaymentCount: e.target.value})}
                          >
                          </Input> */}
                      <input
                        type="number"
                        min="0"
                        max="99999999999"
                        onChange={e => this.setState({ finalPaymentCount: e.target.value })}
                        style={{
                          width: '100%',
                          height: '39px',
                          border: '2px solid #e8e8e8',
                          borderRadius: '5px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="请选择金钱单位">
                      <Select style={{ width: 120 }} onChange={this.weikuanjinqianxuanze}>
                        <Option value="0">人民币</Option>
                        <Option value="1">美元</Option>
                        <Option value="2">欧元</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      {/* <Button style={{backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.djsyb} >
                            上一步
                          </Button> */}
                      <Button
                        style={{
                          marginLeft: '10px',
                          marginRight: '10px',
                          backgroundColor: '#57B5E3',
                          color: '#FFFFFF',
                        }}
                        onClick={this.weikuantijiao}
                      >
                        确认提交
                      </Button>
                    </div>
                  </Col>
                </Row>
                <br></br>
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhdd}>
                        返回订单页面
                      </Button>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhdj}>
                        返回定金页面
                      </Button>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhwk}>
                        返回尾款页面
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/* 开票明细 */}
        {!isNil(this.state) &&
        this.state.kaipiaomingxi === 1 &&
        this.state.qtfw === 0 &&
        this.state.tiaozhuan === 0 &&
        this.state.zhifu === 0 &&
        this.state.zfdj === 0 &&
        this.state.feiyungmingxi === 0 &&
        this.state.zfwk === 0 ? (
          <div className={commonCss.container}>
            <div className={commonCss.title}>
              <span className={commonCss.text}>{formatMessage({ id: '客户填写开票需求' })}</span>
            </div>
            <Card bordered={false}>
              <Form labelAlign="left">
                {isNil(this.state) || isNil(this.state.datas)
                  ? ''
                  : this.state.datas.map(item => {
                      return (
                        <div>
                          <Row gutter={24}>
                            <Col span={12}>
                              <Form.Item {...formlayout} label="发票类型">
                                <Input
                                  disabled
                                  value={
                                    item.invoiceType == 0
                                      ? '增值发票'
                                      : item.invoiceType == 1
                                      ? '普通发票'
                                      : item.invoiceType == 2
                                      ? 'Debit Note'
                                      : ''
                                  }
                                ></Input>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item {...formlayout} label="收票人姓名">
                                <Input disabled value={item.name}></Input>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={24}>
                            <Col span={12}>
                              <Form.Item {...formlayout} label="发票抬头">
                                <Input disabled value={item.companyName}></Input>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item {...formlayout} label="收票人手机">
                                <Input disabled value={item.phone}></Input>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={24}>
                            <Col span={12}>
                              <Form.Item {...formlayout} label="纳税人识别码">
                                <Input disabled value={item.taxpayerIdentificationCode}></Input>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item {...formlayout} label="收票人地址">
                                <Input disabled value={item.address}></Input>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={24}>
                            <Col span={12}>
                              <Form.Item {...formlayout} label="发票内容">
                                <Input
                                  disabled
                                  value={
                                    item.invoiceContent == 0
                                      ? '服务明细'
                                      : item.invoiceContent == 1
                                      ? '服务明细'
                                      : ''
                                  }
                                ></Input>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item {...formlayout} label="支付类型">
                                <Input
                                  disabled
                                  value={item.type == 0 ? '尾款' : item.type == 1 ? '服务费' : ''}
                                ></Input>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row className={commonCss.rowTop}>
                            <Col>
                              <HrComponent text="dashed" />
                            </Col>
                          </Row>
                        </div>
                      );
                    })}
                <br></br>
                <Form labelAlign="left">
                  <Row className={commonCss.rowTop}>
                    <Col span={11} className={commonCss.lastButtonAlignRight}></Col>

                    <Col span={11} className={commonCss.lastButtonAlignLight}>
                      <ButtonOptionComponent
                        type="Approve"
                        text="导出开票信息"
                        event={() => this.export()}
                        disabled={false}
                      />
                    </Col>
                  </Row>
                </Form>
                <br></br>
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhdd}>
                        返回订单页面
                      </Button>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhdj}>
                        返回定金页面
                      </Button>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhys}>
                        返回运输中页面
                      </Button>
                      <Button style={{ marginRight: '10px' }} onClick={this.fhwk}>
                        返回尾款页面
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card>
            <Divider dashed={true} />
          </div>
        ) : null}

        {/* 订单信息 */}
        {!isNil(this.state) &&
        this.state.orderTitleType == 1 &&
        this.state.current == 0 &&
        this.state.zhifu === 0 &&
        this.state.zfdj === 0 &&
        this.state.tiaozhuan === 0 &&
        this.state.qtfw === 0 &&
        this.state.zfwk === 0 &&
        this.state.feiyungmingxi === 0 &&
        this.state.kaipiaomingxi === 0 ? (
          <Card bordered={false}>
            <div className={commonCss.container}>
              <div className={commonCss.title}>
                <span className={commonCss.text}>
                  {formatMessage({ id: 'OrderManagement-OrderMsg.orderinformation' })}
                </span>
              </div>
              <Form labelAlign="left">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单编号">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.orderNumber
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="下单时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : moment(this.state.voyageDto.order.createDate).format('YYYY/MM/DD')
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="上传合同">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.htxq) ? '' : this.state.htxq
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htxq) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        <Button>
                          <Icon type="upload" /> 上传合同
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="上传单证">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.dzxx) ? '' : this.state.dzxx
                        }
                        onChange={this.handleChange1} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        <Button>
                          <Icon type="upload" /> 上传单证
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                {/* 船东报价和其他服费报价 */}
                {CDFW}
                {/* 货盘信息 */}
                {huooanxinxi}
                {/* 航次信息详情 */}
                {hangcixiangqing}
                {/* 航次信息 */}
                {hangcixinxi}
                <div className={commonCss.title}>
                  <span className={commonCss.text}>客服备注</span>
                </div>
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...formItemLayout} label="备注">
                      <Input.TextArea
                        maxLength={300}
                        style={{ width: '100%', height: '200px' }}
                        value={
                          isNil(this.state) || isNil(this.state.dingdank) ? '' : this.state.dingdank
                        }
                        onChange={e => this.setState({ dingdank: e.target.value })}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {/* 三个按钮 */}
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <Button
                        style={{ backgroundColor: '#135A8D', color: '#FFFFFF' }}
                        onClick={this.dingdanbaochun}
                      >
                        保存
                      </Button>
                      <Button
                        style={{
                          marginLeft: '10px',
                          marginRight: '10px',
                          backgroundColor: '#57B5E3',
                          color: '#FFFFFF',
                        }}
                        onClick={this.zhifu}
                      >
                        支付管理
                      </Button>
                      <Button
                        style={{
                          marginRight: '10px',
                          backgroundColor: '#0080FF',
                          color: '#FFFFFF',
                        }}
                        onClick={this.tiaozhuan}
                      >
                        跳转设置
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>

              <Divider dashed={true} />
            </div>
          </Card>
        ) : null}

        {/* 货主定金支付 */}
        {!isNil(this.state) &&
        this.state.orderTitleType == 2 &&
        this.state.current == 1 &&
        this.state.zhifu === 0 &&
        this.state.zfdj === 0 &&
        this.state.tiaozhuan === 0 &&
        this.state.qtfw === 0 &&
        this.state.zfwk === 0 &&
        this.state.feiyungmingxi === 0 &&
        this.state.kaipiaomingxi === 0 ? (
          <Card bordered={false}>
            <div className={commonCss.container}>
              <Form labelAlign="left">
                <div>
                  <div className={commonCss.title}>
                    <span className={commonCss.text}>{formatMessage({ id: '支付信息' })}</span>
                  </div>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="定金支付">
                        <Upload
                          name="file"
                          action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                          fileList={
                            isNil(this.state) || isNil(this.state.djattachementss)
                              ? ''
                              : this.state.djattachementss
                          }
                          onChange={this.handleChange} // 每次上传时，都会触发这个方法
                          style={{ width: '100px' }}
                          listType="picture"
                          pageSize={20}
                          onRemove={this.shanchufujian}
                          // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                          showUploadList={{
                            showPreviewIcon: true,
                            showDownloadIcon: true,
                            showRemoveIcon: false,
                          }}
                        ></Upload>
                      </Form.Item>
                    </Col>
                    <Col span={12}></Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="支付时间">
                        <Input
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.djattachementss)
                              ? ''
                              : this.state.djattachementss.map(value => value.date)
                          }
                        ></Input>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formlayout} label="支付金额">
                        <Input
                          disabled
                          value={
                            isNil(this.state) || isNil(this.state.djattachementss)
                              ? ''
                              : this.state.djattachementss.map(value => value.depositDount)
                          }
                        ></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '订单信息' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单编号">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.orderNumber
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="下单时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : moment(this.state.voyageDto.order.createDate).format('YYYY/MM/DD')
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="上传合同">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="上传单证">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.djdzz) ? '' : this.state.djxx
                        }
                        onChange={this.djdz} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        <Button>
                          <Icon type="upload" /> 上传单证
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>

                {/* 船东报价和其他服费报价 */}
                {CDFW}
                {/* 货盘信息 */}
                {huooanxinxi}
                {/* 航次信息详情 */}
                {hangcixiangqing}
                {/* 航次信息 */}
                {hangcixinxi}
                <div className={commonCss.title}>
                  <span className={commonCss.text}>客服备注</span>
                </div>
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...formItemLayout} label="备注">
                      <Input.TextArea
                        maxLength={300}
                        style={{ width: '100%', height: '200px' }}
                        value={
                          isNil(this.state) || isNil(this.state.dingjink) ? '' : this.state.dingjink
                        }
                        onChange={e => this.setState({ dingjink: e.target.value })}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {/* 三个按钮 */}
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <Button
                        style={{ backgroundColor: '#135A8D', color: '#FFFFFF' }}
                        onClick={this.dingjinbaochun}
                      >
                        保存
                      </Button>
                      <Button
                        style={{
                          marginLeft: '10px',
                          marginRight: '10px',
                          backgroundColor: '#57B5E3',
                          color: '#FFFFFF',
                        }}
                        onClick={this.zhifu}
                      >
                        支付管理
                      </Button>
                      <Button
                        style={{
                          marginRight: '10px',
                          backgroundColor: '#0080FF',
                          color: '#FFFFFF',
                        }}
                        onClick={this.tiaozhuan}
                      >
                        跳转设置
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
              <Divider dashed={true} />
            </div>
          </Card>
        ) : null}

        {/* 运送中 */}
        {!isNil(this.state) &&
        this.state.orderTitleType == 3 &&
        this.state.current == 2 &&
        this.state.zhifu === 0 &&
        this.state.zfdj === 0 &&
        this.state.tiaozhuan === 0 &&
        this.state.qtfw === 0 &&
        this.state.zfwk === 0 &&
        this.state.feiyungmingxi === 0 &&
        this.state.kaipiaomingxi === 0 ? (
          <Card bordered={false}>
            <div className={commonCss.container}>
              <Form labelAlign="left">
                {/* {
                    支付信息这里需要进行判断，等返回值的时候再写
                  } */}
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '支付信息' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="定金支付">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachements)
                            ? ''
                            : this.state.attachements
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        pageSize={20}
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachements)
                            ? ''
                            : this.state.attachements.map(value => value.date)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付金额">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachements)
                            ? ''
                            : this.state.attachements.map(value => value.depositDount)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="其他服务费">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Button
                      onClick={() => {
                        this.feiyongmingxi(
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits.map(value => value.guid),
                        );
                      }}
                    >
                      费用明细
                    </Button>

                    <Button
                      onClick={() => {
                        this.kaipiaomingxi(
                          isNil(this.state) || isNil(this.state.guidd) ? '' : this.state.guidd,
                        );
                      }}
                    >
                      查看开票明细
                    </Button>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits.map(value => value.date)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付金额">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits.map(value => value.depositDount)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>

                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '实际货运量' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="实际重量历史">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.actualWeight
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="实际体积历史">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.actualVolume
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="实际重量">
                      {getFieldDecorator('qq', {
                        rules: [
                          {
                            required: false,
                            pattern: new RegExp(/^[0-9]+(\.[0-9]{1,2})?$/, 'g'),
                            message: '请正确输入一到两位小数的正数',
                          },
                        ],
                        getValueFromEvent: event => {
                          return event.target.value.replace(/\D\./g, '');
                        },
                        initialValue: '',
                      })(
                        <input
                          type="number"
                          min="0"
                          max="99999999999"
                          onChange={e => this.setState({ actualWeight: e.target.value })}
                          style={{ width: '100%', height: '39px' }}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="实际体积">
                      {getFieldDecorator('ww', {
                        rules: [
                          {
                            required: false,
                            pattern: new RegExp(/^[0-9]+(\.[0-9]{1,2})?$/, 'g'),
                            message: '请正确输入一到两位小数的正数',
                          },
                        ],
                        getValueFromEvent: event => {
                          return event.target.value.replace(/\D\./g, '');
                        },
                        initialValue: '',
                      })(
                        // <Input onChange={e => this.setState({ actualVolume: e.target.value})} />
                        <input
                          type="number"
                          min="0"
                          max="99999999999"
                          onChange={e => this.setState({ actualVolume: e.target.value })}
                          style={{ width: '100%', height: '39px' }}
                        />,
                      )}
                      {/* <Input
                          onChange={e => this.setState({ actualVolume: e.target.value })}
                        ></Input> */}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="上传检验报告">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsJianYanBaoGaos)
                            ? ''
                            : this.state.attachmentsJianYanBaoGaos
                        }
                        onChange={this.ysjy} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        <Button>
                          <Icon type="upload" /> 上传检验报告
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '保函' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="上传保函">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsBaoHans)
                            ? ''
                            : this.state.attachmentsBaoHans
                        }
                        onChange={this.ysbh} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        <Button>
                          <Icon type="upload" /> 上传保函
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '海运费总价' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="海运费总金额历史">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.haiyunMoney
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="单位历史">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.haiyunMoneyType == 0
                            ? '人民币'
                            : this.state.voyageDto.order.haiyunMoneyType == 1
                            ? '美元'
                            : this.state.voyageDto.order.haiyunMoneyType == 0
                            ? '欧元'
                            : ''
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="海运费总金额">
                      {/* <Input
                          onChange={e => this.setState({ haiyunMoneys: e.target.value })}
                        ></Input> */}
                      <input
                        type="number"
                        min="0"
                        max="99999999999"
                        onChange={e => this.setState({ haiyunMoneys: e.target.value })}
                        style={{ width: '100%', height: '39px' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="单位">
                      <Select style={{ width: 120 }} onChange={this.yunshuzhongdanwei}>
                        <Option value="0">RMB</Option>
                        <Option value="1">USD</Option>
                        <Option value="2">EUR</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '货物提单' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="提单信息">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsTiDans)
                            ? ''
                            : this.state.attachmentsTiDans
                        }
                        onChange={this.ystd} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        <Button>
                          <Icon type="upload" /> 上传提单
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>

                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '订单信息' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="查看合同">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsHeTongs)
                            ? ''
                            : this.state.attachmentsHeTongs
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单编号">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.orderNumber
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="下单时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : moment(this.state.voyageDto.order.createDate).format('YYYY/MM/DD')
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="上传单证">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsDanZhengs)
                            ? ''
                            : this.state.attachmentsDanZhengs
                        }
                        onChange={this.ysdz} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        <Button>
                          <Icon type="upload" /> 上传单证
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                {/* 船东报价和其他服费报价 */}
                {CDFW}
                {/* 货盘信息 */}
                {huooanxinxi}
                {/* <LabelTitleComponent text={isNil(this.state) || isNil(this.state.CGCG) ? '' : this.state.CGCG === 'G' ? '查看国际货盘' : '查看国内货盘'} event={() => this.onBack()} /> */}

                {/* 航次信息详情 */}
                {hangcixiangqing}
                {/* 航次信息 */}
                {hangcixinxi}
                <div className={commonCss.title}>
                  <span className={commonCss.text}>客服备注</span>
                </div>
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...formItemLayout} label="备注">
                      <Input.TextArea
                        maxLength={300}
                        style={{ width: '100%', height: '200px' }}
                        value={
                          isNil(this.state) || isNil(this.state.yunshuremark)
                            ? ''
                            : this.state.yunshuremark
                        }
                        onChange={e => this.setState({ yunshuremark: e.target.value })}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* 三个按钮 */}
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <Button
                        style={{ backgroundColor: '#135A8D', color: '#FFFFFF' }}
                        onClick={this.ysbc}
                      >
                        保存
                      </Button>
                      <Button
                        style={{
                          marginLeft: '10px',
                          marginRight: '10px',
                          backgroundColor: '#57B5E3',
                          color: '#FFFFFF',
                        }}
                        onClick={this.zhifu}
                      >
                        支付管理
                      </Button>
                      <Button
                        style={{
                          marginRight: '10px',
                          backgroundColor: '#0080FF',
                          color: '#FFFFFF',
                        }}
                        onClick={this.tiaozhuan}
                      >
                        跳转设置
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
              <Divider dashed={true} />
            </div>
          </Card>
        ) : null}

        {/* 支付尾款并提货 */}
        {!isNil(this.state) &&
        this.state.orderTitleType == 4 &&
        this.state.current == 3 &&
        this.state.zhifu === 0 &&
        this.state.zfdj === 0 &&
        this.state.tiaozhuan === 0 &&
        this.state.qtfw === 0 &&
        this.state.zfwk === 0 &&
        this.state.feiyungmingxi === 0 &&
        this.state.kaipiaomingxi === 0 ? (
          <Card bordered={false}>
            <div className={commonCss.container}>
              <Form labelAlign="left">
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '支付信息' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="定金支付">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachementsa)
                            ? ''
                            : this.state.attachementsa
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementsa)
                            ? ''
                            : this.state.attachementsa.map(value => value.date)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付金额">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementsa)
                            ? ''
                            : this.state.attachementsa.map(value => value.depositDount)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="尾款支付">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.weikuanzhifulalalal)
                            ? ''
                            : this.state.weikuanzhifulalalal
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.weikuanzhifulalalal)
                            ? ''
                            : this.state.weikuanzhifulalalal.map(value => value.date)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付金额">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.weikuanzhifulalalal)
                            ? ''
                            : this.state.weikuanzhifulalalal.map(value => value.depositDount)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="其他服务费">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachementTransitsa)
                            ? ''
                            : this.state.attachementTransitsa
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Button
                      onClick={() => {
                        this.feiyongmingxi(
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits.map(value => value.guid),
                        );
                      }}
                    >
                      费用明细
                    </Button>
                    <Button
                      onClick={() => {
                        this.kaipiaomingxi(
                          isNil(this.state) || isNil(this.state.guidd) ? '' : this.state.guidd,
                        );
                      }}
                    >
                      查看开票明细
                    </Button>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits.map(value => value.date)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付金额">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits.map(value => value.depositDount)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="自定义服务费1">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits.map(value => value.date)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付金额">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits.map(value => value.depositDount)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>

                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '货物提单' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="查看提单">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsTiDansa)
                            ? ''
                            : this.state.attachmentsTiDansa
                        }
                        onChange={this.zfwktd} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        <Button>
                          <Icon type="upload" />
                          上传提单
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>

                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '实际货运量' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="实际重量">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.actualWeight
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="实际体积">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.actualVolume
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="查看检验报告">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsJianYanBaoGaosa)
                            ? ''
                            : this.state.attachmentsJianYanBaoGaosa
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        {/* <Button >
                              <Icon type="upload" />上传提单
                            </Button> */}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '保函' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="保函信息">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsBaoHansa)
                            ? ''
                            : this.state.attachmentsBaoHansa
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        {/* <Button >
                              <Icon type="upload" />上传提单
                            </Button> */}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '订单信息' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单编号">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.orderNumber
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="下单时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : moment(this.state.voyageDto.order.createDate).format('YYYY/MM/DD')
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="查看合同">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsHeTongsa)
                            ? ''
                            : this.state.attachmentsHeTongsa
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        {/* <Button >
                              <Icon type="upload" />上传提单
                            </Button> */}
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="上传单证">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsDanZhengsa)
                            ? ''
                            : this.state.attachmentsDanZhengsa
                        }
                        onChange={this.zfwkdz} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        <Button>
                          <Icon type="upload" />
                          上传单证
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                {/* 船东报价和其他服费报价 */}
                {CDFW}
                {/* 货盘信息 */}
                {huooanxinxi}
                {/* 航次信息详情 */}
                {hangcixiangqing}
                {/* 航次信息 */}
                {hangcixinxi}
                <div className={commonCss.title}>
                  <span className={commonCss.text}>客服备注</span>
                </div>
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...formItemLayout} label="备注">
                      <Input.TextArea
                        maxLength={300}
                        style={{ width: '100%', height: '200px' }}
                        value={
                          isNil(this.state) || isNil(this.state.remark) ? '' : this.state.remark
                        }
                        onChange={e => this.setState({ zhifuweikbeizhu: e.target.value })}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {/* 三个按钮 */}
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <Button
                        style={{ backgroundColor: '#135A8D', color: '#FFFFFF' }}
                        onClick={this.zhifuweikuanbaochun}
                      >
                        保存
                      </Button>
                      <Button
                        style={{
                          marginLeft: '10px',
                          marginRight: '10px',
                          backgroundColor: '#57B5E3',
                          color: '#FFFFFF',
                        }}
                        onClick={this.zhifu}
                      >
                        支付管理
                      </Button>
                      <Button
                        style={{
                          marginRight: '10px',
                          backgroundColor: '#0080FF',
                          color: '#FFFFFF',
                        }}
                        onClick={this.tiaozhuan}
                      >
                        跳转设置
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>
          </Card>
        ) : null}

        {/* 交易完成 */}
        {!isNil(this.state) &&
        this.state.orderTitleType == 5 &&
        this.state.current == 4 &&
        this.state.zhifu === 0 &&
        this.state.zfdj === 0 &&
        this.state.tiaozhuan === 0 &&
        this.state.qtfw === 0 &&
        this.state.zfwk === 0 &&
        this.state.feiyungmingxi === 0 &&
        this.state.kaipiaomingxi === 0 ? (
          <Card bordered={false}>
            <div className={commonCss.container}>
              <Form labelAlign="left">
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '支付信息' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="定金支付">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachementsa)
                            ? ''
                            : this.state.attachementsa
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementsa)
                            ? ''
                            : this.state.attachementsa.map(value => value.date)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付金额">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementsa)
                            ? ''
                            : this.state.attachementsa.map(value => value.depositDount)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="尾款支付">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.weikuanzhifulalalal)
                            ? ''
                            : this.state.weikuanzhifulalalal
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.weikuanzhifulalalal)
                            ? ''
                            : this.state.weikuanzhifulalalal.map(value => value.date)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付金额">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.weikuanzhifulalalal)
                            ? ''
                            : this.state.weikuanzhifulalalal.map(value => value.depositDount)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="其他服务费">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachementTransitsa)
                            ? ''
                            : this.state.attachementTransitsa
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Button
                      onClick={() => {
                        this.feiyongmingxi(
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits.map(value => value.guid),
                        );
                      }}
                    >
                      费用明细
                    </Button>
                    <Button
                      onClick={() => {
                        this.kaipiaomingxi(
                          isNil(this.state) || isNil(this.state.guidd) ? '' : this.state.guidd,
                        );
                      }}
                    >
                      查看开票明细
                    </Button>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits.map(value => value.date)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付金额">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits.map(value => value.depositDount)
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="自定义服务费1">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachementTransits)
                            ? ''
                            : this.state.attachementTransits
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        // defaultFileList={!isNil(this.state) || isNil(this.state.htfj) ? '' : this.state.htxq}
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}></Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付时间">
                      <Input disabled></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="支付金额">
                      <Input disabled></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '货物提单' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="查看提单">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsTiDansa)
                            ? ''
                            : this.state.attachmentsTiDansa
                        }
                        onChange={this.zfwktd} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      ></Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '实际货运量' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="实际重量">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.actualWeight
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="实际体积">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.actualVolume
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="查看检验报告">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsJianYanBaoGaosa)
                            ? ''
                            : this.state.attachmentsJianYanBaoGaosa
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        {/* <Button >
                              <Icon type="upload" />上传提单
                            </Button> */}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '保函' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="保函信息">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsBaoHansa)
                            ? ''
                            : this.state.attachmentsBaoHansa
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        {/* <Button >
                              <Icon type="upload" />上传提单
                            </Button> */}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <div className={commonCss.title}>
                  <span className={commonCss.text}>{formatMessage({ id: '订单信息' })}</span>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="订单编号">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : this.state.voyageDto.order.orderNumber
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="下单时间">
                      <Input
                        disabled
                        value={
                          isNil(this.state) || isNil(this.state.voyageDto)
                            ? ''
                            : moment(this.state.voyageDto.order.createDate).format('YYYY/MM/DD')
                        }
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="查看合同">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsHeTongsa)
                            ? ''
                            : this.state.attachmentsHeTongsa
                        }
                        onChange={this.handleChange} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        {/* <Button >
                              <Icon type="upload" />上传提单
                            </Button> */}
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item {...formlayout} label="上传单证">
                      <Upload
                        name="file"
                        action="/api/sys/file/upLoadFuJian/order" // 这个是上传的接口请求，实际开发中，要替换成你自己的业务接口
                        fileList={
                          isNil(this.state) || isNil(this.state.attachmentsDanZhengsasss)
                            ? ''
                            : this.state.attachmentsDanZhengsasss
                        }
                        onChange={this.jiaoyiwanchengs} // 每次上传时，都会触发这个方法
                        style={{ width: '100px' }}
                        listType="picture"
                        showUploadList={{
                          showPreviewIcon: true,
                          showDownloadIcon: true,
                          showRemoveIcon: true,
                        }}
                        onRemove={this.shanchufujian}
                      >
                        <Button>
                          <Icon type="upload" />
                          上传单证
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                {/* 船东报价和其他服费报价 */}
                {CDFW}
                {/* 货盘信息 */}
                {huooanxinxi}
                {/* 航次信息详情 */}
                {hangcixiangqing}
                {/* 航次信息 */}
                {hangcixinxi}
                <div className={commonCss.title}>
                  <span className={commonCss.text}>客服备注</span>
                </div>
                <Row gutter={24}>
                  <Col>
                    <Form.Item {...formItemLayout} label="备注">
                      <Input.TextArea
                        maxLength={300}
                        style={{ width: '100%', height: '200px' }}
                        value={
                          isNil(this.state) || isNil(this.state.jiaoyiremark)
                            ? ''
                            : this.state.jiaoyiremark
                        }
                        onChange={e => this.setState({ jiaoyiremark: e.target.value })}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <Button
                        style={{ backgroundColor: '#135A8D', color: '#FFFFFF' }}
                        onClick={this.jiaoyiwanchengbaochun}
                      >
                        保存
                      </Button>
                      <Button
                        style={{
                          marginLeft: '10px',
                          marginRight: '10px',
                          backgroundColor: '#57B5E3',
                          color: '#FFFFFF',
                        }}
                        onClick={this.zhifu}
                      >
                        支付管理
                      </Button>
                      <Button
                        style={{
                          marginRight: '10px',
                          backgroundColor: '#0080FF',
                          color: '#FFFFFF',
                        }}
                        onClick={this.tiaozhuan}
                      >
                        跳转设置
                      </Button>
                    </div>
                  </Col>
                </Row>
                {/* <Row gutter={24}>
                      <Col>
                        <Button style={{backgroundColor: '#135A8D', color: '#FFFFFF' }} onClick={this.baochun} >
                          保存
                        </Button>
                      </Col>
                    </Row> */}
              </Form>
            </div>
          </Card>
        ) : null}
        <Card bordered={false}>
          <Row className={commonCss.rowTop}>
            <Col span={14} pull={1} className={commonCss.lastButtonAlignRight}>
              <ButtonOptionComponent
                disabled={false}
                type="CloseButton"
                text={formatMessage({ id: '返回到列表页' })}
                event={() => this.onBack()}
              />
            </Col>
            <Col span={10}></Col>
          </Row>
        </Card>

        <Modal
          className="picModal"
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
          <a
            onClick={() =>
              linkHref(
                isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage,
              )
            }
          >
            查看原图
          </a>
        </Modal>
      </div>
    );
  }
}

const MyOrderView_Form = Form.create({ name: 'MyOrderView_Form' })(MyOrderView);

export default MyOrderView_Form;
