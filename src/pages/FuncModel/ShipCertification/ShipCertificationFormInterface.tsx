import { FormComponentProps } from 'antd/lib/form';

interface ShipCertificationFormProps extends FormComponentProps {
  ship: Ship;//航次对象
  picList: Attachments[];//附件
  shipChecks:ShipChecks;
  previewVisible: boolean;
  previewImage: any;
  history: any;
  aFileList: any;
  bFileList: any;
  cFileList: any;
  pFileList: any;
  match: any;
  picNum:any;
  checkRemark:string;
}
export default ShipCertificationFormProps;

//船舶
export interface Ship {
  shipName:string;//船名
  buildParticularYear:string;//建造年份
  tonNumber:string;//吨位
  draft:string;//吃水
  shipDeck:string;//船甲板
  capacity:string;//仓容
  anchoredPort:string;//挂靠港口
  shipType:string;//船舶类型
  checkStatus:string;//审核状态
  shipCrane:string;//船吊
  pmiDeadline:string;//PMI期限
  endTime:string;//PMI截至时间
  startTime:string;//PMI起始时间
  registryDeadline:string;//船舶登记证书期限
  registryStartTime:string;//起始时间
  registryEndTime:string;//截止时间
  imo:string;//IMO
  mmsi:string;//MMSI
  charterWay:string;//租船方式
  voyageArea:string;//航区
  classificationSociety:string;//船级社
  leaseDeadline:string;					//租船合同期限						
  leaseStartTime:string;					//租船合同起始时间						
  leaseEndTime:string;					//租船合同截至时间						
}

//附件
export interface Attachments {
  type: string;//附件标记
  fileName: string;//文件名
  fileLog: string;//文件夹类型
}

//审批意见
export interface ShipChecks {
   checkRemark:string;
  }