import { FormComponentProps } from 'antd/lib/form';

export interface OrderViewFormProps extends FormComponentProps {
  orderNumber: string;             //订单编号
  contractMoney: number;           //合同金额
  createDate: string;              //创建时间
  attachments?:any;                //附件

  goodsContacter?: string;              //货主
  goodsshipPhoneCode?: string;          //货主手机号段
  goodsshipContactPhone?: string;       //货主电话
  goodsPhone?: string;                  //货主电话含号段
  shipContacter?: string;              //船东
  shipPhoneCode?: string;              //船东号段
  shipContactPhone?: string;           //船东电话
  shipPhone?: string;                  //船东电话含号段

  fileName: string;                //文件名
  type:string;                     //文件类型
  depositAttachment:string,

  orderStatus: number;             //订单状态 0 未结算  1已完成 2已结算
  payStatus:number;                //支付状态 0 未支付  1已付定金 2已收尾款
  deliverStatus:number;           //发货状态 0 未发货 1 已发货

  downpayment:number;             //定金
  tailMoney:number;                //尾款

  remark: string;

  // status: number;
  current: number;
  guid: number;
  entity:any;
  match: any;
  history: any;

  sceneState?:number;              //场景状态
  currentState?:number;            //当前应该在的场景

  previewVisible?:boolean;
  previewImage?:string;
  picNum: number;

  contactFile?:any;                //合同图片
  contactFileName:string;
  contactType:string;

  documentsFile?:any;              //单证图片
  documentsFileName:string;
  documentsType:string;

  earnestFile?:any;                //定金流水单
  earnestFileName:string;
  earnestType:string;

  tailFile?:any;                   //尾款流水单
  tailFileName:string;
  tailType:string;

  settlementFile?:any;             //结算图片

  logisticsInfo?:LogisticsInfo[];

}

//图片信息
export interface FileMsg {
  uid?: any;
  name?: string;
  status?: string;
  thumbUrl?: any;
  type?:any;
}

//附件
export interface Attachments {
  type: string;//附件标记
  fileName: string;//文件名
  fileLog: string;//文件夹类型
}

//物流信息
export interface LogisticsInfo {
  time: string;//时间信息
  logisticsMsg: string;//物流信息
}
