import { FormComponentProps } from 'antd/lib/form';

export interface OrderViewFormProps extends FormComponentProps {
  OrderShow?: boolean; //订单显示隐藏
  DzhtShow?: boolean; //电子合同显示隐藏
  XxzfShow?: boolean; //线下支付流水单显示隐藏
  KpxxShow?: boolean; //开票信息显示隐藏
  ZsyShow?: boolean; //总收益显示隐藏
  TzShow?: boolean; //跳转设置显示隐藏
  ZfxxShow?: boolean; //支付信息显示隐藏
  visible?: boolean; //图片放大显示隐藏
  htEdit?: boolean; //修改合同
  editor?: any;
  curContent?: any;
  ContractTitle?: string; //合同标题
  orderNumber?: string; //订单编号
  orderCreateDate?: string; //下单时间
  chargeType?: string; //1按吨收费2总包干价
  chargeTtypeValue?: string; //上面字段的值
  palletNumber?: string; //	货物编号
  palletStartPortName?: string; //货物起始港
  palletDestinationPortName?: string; // 货物终点港
  goodsName?: string; // 货物名称
  goodsWeight?: string; //货物重量
  goodsMaxWeight?: string; //货物重量
  loadDate?: string; // 装货日期
  endDate?: string; //  装货日期
  weightMin?: string; //所需船舶吨位
  weightMax?: string; //所需船舶吨位
  shipSum?: string; //所需船舶数量
  intentionMoney?: string; //意向价
  shipLoadUnloadDay?: string; //装载天数
  overdueFee?: string; //超期费
  freightType?: string; //1有定金2卸前付清3既有定金又卸前付清
  remark?: string; //备注
  shipName?: string; // 船名
  tonNumber?: string; // 吨
  // 尾款信息：
  finalPaymentClosingTime?: string; // 尾款支付截至日期
  finalPaymentCount?: string; // 尾款金额
  balanceDate?: string; //支付尾款时间
  // 运费收益：
  orderFinishDate?: string; //收益结算时间
  depositCount?: string; // 定金金额
  dyMoneySum?: string; // 平台收益
  dyServiceCharge?: string; // 平台服务费
  finalPaymentPayType?: string; // 1支付宝、2微信、3公司转账、4线下支付
  finishDate?: string; // 货主确认完成时间
  finishVDate?: string; // 船东确认完成时间
  // 列表增加字段：
  palletMoneySum?: string; // 共付运费
  voyageMoneySum?: string; //本单收益

  contractMoney: number; //合同金额
  createDate: string; //创建时间
  attachments?: any; //附件
  goodsContacter?: string; //货主
  goodsshipPhoneCode?: string; //货主手机号段
  goodsshipContactPhone?: string; //货主电话
  goodsPhone?: string; //货主电话含号段
  shipContacter?: string; //船东
  shipPhoneCode?: string; //船东号段
  shipContactPhone?: string; //船东电话
  shipPhone?: string; //船东电话含号段

  fileName: string; //文件名
  type: string; //文件类型
  depositAttachment: string;

  orderStatus: number; //订单状态 0 未结算  1已完成 2已结算
  payStatus: number; //支付状态 0 未支付  1已付定金 2已收尾款
  deliverStatus: number; //发货状态 0 未发货 1 已发货

  downpayment: number; //定金
  tailMoney: number; //尾款

  // status: number;
  current: number;
  guid: number;
  entity: any;
  match: any;
  history: any;

  sceneState?: number; //场景状态
  currentState?: number; //当前应该在的场景

  previewVisible?: boolean;
  previewImage?: string;
  picNum: number;

  contactFile?: any; //合同图片
  contactFileName: string;
  contactType: string;

  documentsFile?: any; //单证图片
  documentsFileName: string;
  documentsType: string;

  earnestFile?: any; //定金流水单
  earnestFileName: string;
  earnestType: string;

  tailFile?: any; //尾款流水单
  tailFileName: string;
  tailType: string;

  settlementFile?: any; //结算图片

  logisticsInfo?: LogisticsInfo[];
}

//图片信息
export interface FileMsg {
  uid?: any;
  name?: string;
  status?: string;
  thumbUrl?: any;
  type?: any;
}

//附件
export interface Attachments {
  type: string; //附件标记
  fileName: string; //文件名
  fileLog: string; //文件夹类型
}

//物流信息
export interface LogisticsInfo {
  time: string; //时间信息
  logisticsMsg: string; //物流信息
}
